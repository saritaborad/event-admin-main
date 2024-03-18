import React, { useEffect, useState , useMemo} from "react";
import { useQuery } from "react-query";
import { makeApiCall } from "../../../api/Post";
import defaultImage from "../../../assets/blank_user.svg"


// ==========================

import { MaterialReactTable } from 'material-react-table';
import { Box, Typography , Button} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';


// ==============================
import Loader from "../../../componets/ui-elements/Loader";
import { useParams } from "react-router-dom";

const UserTransections = () => {
  const [transactions, setTransections] = useState();
  const [loading, setLoading] = useState(false);
  const param = useParams();

 const fetchData = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
      "post",
      "user/isexist",
      {phone_number:param.number},
      "raw"
    );

    if(response.data.status===1){
      const filterData = response.data.data.orders.map((transaction)=>({
        payment_date:transaction.payment_date,
        status:transaction.payment_status,
        method:transaction.payment_method,
        billdesk_order_id:transaction.billdesk_order_id,
        transaction_Id:"NULL", //
        is_gst_in:transaction.is_gst_in,  
        gst:transaction.is_gst_in===true?(`GST number: ${transaction.gst_in} Business Name: ${transaction.business_name} Business Address:${transaction.business_address}`):"No GST Addedd",
        base_price:transaction.base_price,
        total_tax:transaction.total_tax===undefined?"00.00":transaction.total_tax,
        total:transaction.total,
        user_image:"NULL", //
        user_name:"NULL", //
        user_contact:"NULL", //
      })) 
      console.log(filterData,"Filter data")
      setTransections(filterData);
    }

    setLoading(false);
    } catch (error) {
      console.error(error);
    }
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
        accessorKey: 'payment_date',
        header: 'Payment Date',
        size: 50,
      },
      {
        accessorKey: 'user_name',
        header: 'Name',
        size: 50,
      },
      {
        accessorKey: 'user_contact',
        header: 'Contact',
        size: 50,
      },
      {
        accessorKey: 'status',
        header: 'Payment Status',
      },
      {
        accessorKey: 'method',
        header: 'Payment Method',
        enableClickToCopy: true,
      },
      {
        accessorKey: 'billdesk_order_id',
        header: 'Billdesk Order ID',
        enableClickToCopy: true,
      },
      {
        accessorKey: 'transaction_Id',
        header: 'Transaction ID',
            
      },
      {
        accessorKey: 'gst',
        header: 'GST info',
      },
      {
        accessorKey: 'base_price',
        header: 'Base Price',
      },
      {
        accessorKey: 'total_tax',
        header: 'Taxes',
      },
      {
        accessorKey: 'total',
        header: 'Total Amount',
      },
    ],
    [],
  );

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
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

  return(<>
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
            display: 'grid',
            margin: 'auto',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
          }}
        >
          <Typography>Base Price: {row.original.base_price}</Typography>
        </Box>
      )}
      renderTopToolbarCustomActions={({ table }) => (
        <Box
          sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
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
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
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
  </>);
}

export default UserTransections