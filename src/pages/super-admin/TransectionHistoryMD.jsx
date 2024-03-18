import React, { useEffect, useState, useMemo } from "react";
import { useQuery } from "react-query";
// import { makeApiCall } from "../../../api/Post";
import { makeApiCall } from "../../api/Post";
import defaultImage from "../../assets/blank_user.svg";

// ==========================

import { MaterialReactTable } from "material-react-table";
import { Box, Typography, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";

// ==============================
import Loader from "../../../componets/ui-elements/Loader";

const Transaction = () => {
  const [transactions, setTransections] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await makeApiCall(
      "get",
      "user/transactionhistory",
      null,
      "raw"
    );
    console.log(response.status);
    if (response.status === 200) {
      const filterData = response.data.data.orders.map((item) => ({
        _id: item._id,
        order_id: item.order_id,
        complimantory_code: item.complimantory_code,
        provided_by: item.provided_by,
        total: item.total,
        payment_method: item.payment_method,
      }));
      setTransections(filterData);
      setLoading(false);
    }
    console.log(response);
  };

  const { data, isLoading, error } = useQuery("data", fetchData);

  useEffect(() => {
    if (data) {
      console.log(data.data.data.orders);
    } else {
      console.warn("Something went wrong");
    }
  }, [data, isLoading]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "payment_date",
        header: "Payment Date",
        size: 50,
      },
      {
        accessorKey: "status",
        header: "Payment Status",
      },
      {
        accessorKey: "method",
        header: "Payment Method",
        enableClickToCopy: true,
      },
      {
        accessorKey: "billdesk_order_id",
        header: "Billdesk Order ID",
        enableClickToCopy: true,
      },
      {
        accessorKey: "transaction_Id",
        header: "Transaction ID",
      },
      {
        accessorKey: "gst",
        header: "GST info",
      },
      {
        accessorKey: "base_price",
        header: "Base Price",
      },
      {
        accessorKey: "total_tax",
        header: "Taxes",
      },
      {
        accessorKey: "total",
        header: "Total Amount",
      },
    ],
    []
  );

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(data);
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <>
        {transactions?.length > 0 ? (
          <MaterialReactTable
            columns={columns}
            data={transactions}
            enableRowSelection
            positionToolbarAlertBanner="bottom"
            renderDetailPanel={({ row }) => (
              <Box
                sx={{
                  display: "grid",
                  margin: "auto",
                  gridTemplateColumns: "1fr 1fr",
                  width: "100%",
                }}
              >
                <Typography>Base Price: {row.original.base_price}</Typography>
              </Box>
            )}
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  p: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  color="primary"
                  //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                  onClick={handleExportData}
                  startIcon={<FileDownloadIcon />}
                  variant="contained"
                >
                  Export All Data
                </Button>
                <Button
                  disabled={table.getPrePaginationRowModel().rows.length === 0}
                  //export all rows, including from the next page, (still respects filtering and sorting)
                  onClick={() =>
                    handleExportRows(table.getPrePaginationRowModel().rows)
                  }
                  startIcon={<FileDownloadIcon />}
                  variant="contained"
                >
                  Export All Rows
                </Button>
                <Button
                  disabled={table.getRowModel().rows.length === 0}
                  //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                  onClick={() => handleExportRows(table.getRowModel().rows)}
                  startIcon={<FileDownloadIcon />}
                  variant="contained"
                >
                  Export Page Rows
                </Button>
                <Button
                  disabled={
                    !table.getIsSomeRowsSelected() &&
                    !table.getIsAllRowsSelected()
                  }
                  //only export selected rows
                  onClick={() =>
                    handleExportRows(table.getSelectedRowModel().rows)
                  }
                  startIcon={<FileDownloadIcon />}
                  variant="contained"
                >
                  Export Selected Rows
                </Button>
              </Box>
            )}
          />
        ) : null}
      </>
      <div className="h-14"></div>
    </>
  );
};

export default Transaction;
