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
import Loader from "../../componets/ui-elements/Loader";
import NoDataFound from "../../componets/NoDataFound";

const TransactionHistorySponsor = () => {
  const [transactions, setTransections] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "get",
        "user/creditbedit",
        null,
        "raw"
      );
      console.log(response.data.message);
      if (response.data.status === 1) {
        setLoading(true);
        const filterData = response.data.data.map((item) => ({
          _id: item._id,
          order_id: item.order_id,
          complimantory_code: item.complimantory_code,
          provided_by: item.provided_by,
          amount: item.amount,
          credit: item?.credit,
          debit: item?.debit,
          payment_method: item.payment_method,
        }));
        setTransections(filterData);
        setLoading(false);
        console.log(response);
      }else{
        setLoading(false);
        console.log(response);
      }
    } catch (error) {
      console.log(error)
       setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "Payment ID",
        size: 50,
      },
      {
        accessorKey: "complimantory_code",
        header: "Complimentory code",
        enableClickToCopy: true,
      },
      {
        accessorKey: "provided_by",
        header: "Provided by",
        enableClickToCopy: true,
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "credit",
        header: "Credit",
      },
      {
        accessorKey: "debit",
        header: "Debit",
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
        ) : <NoDataFound/>}
      </>
      <div className="h-14"></div>
    </>
  );
};

export default TransactionHistorySponsor;
