import React, { useEffect, useState, useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { makeApiCall } from "../../../api/Post";
import defaultImage from "../../../assets/blank_user.svg";

// ==========================

import { MaterialReactTable } from "material-react-table";
import { Box, Typography, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";

// ==============================
import Loader from "../../../componets/ui-elements/Loader";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import {
  capitalizeWords,
  filterByProperty,
} from "../../../utils/CommonFunctions";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSummery, setIsSummery] = useState(false);
  const [isGST, setIsGST] = useState(false);
  const [gstDetails, setGstDetails] = useState([]);
  const [order, setOrder] = useState({});
  const tableRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall("get", "user/orderlist", null, "raw");

      // console.log(response);
      if (response.data.status === 0) {
        const reverseTransection = [...response.data.data].reverse();
        console.log(reverseTransection);
        // console.log(reverseTransection);

        const filterData = reverseTransection.map((transaction) => ({
          payment_date: transaction.payment_date,
          // status: capitalizeWords(transaction.payment_status),
          status: transaction.payment_status,
          method: transaction.payment_method,
          billdesk_order_id: transaction.billdesk_order_id,
          transaction_Id: transaction.transaction_Id,
          is_promocode: transaction.promo_code_apply
            ? transaction?.promo_code
            : "No",
          discount_price: transaction.promo_code_apply
            ? transaction.discount_price
            : "---",
          is_gst_in: transaction.is_gst_in,
          gst:
            transaction.is_gst_in === true
              ? transaction.gst_in
                ? transaction.gst_in
                : "---"
              : "No GST Addedd",
          gst_details:
            transaction.is_gst_in === true
              ? {
                  gst_number: transaction.gst_in,
                  business_name: transaction.business_name,
                  business_address: transaction.business_address,
                }
              : "No GST Addedd",
          base_price: transaction.base_price,
          total_tax:
            transaction.total_tax === undefined
              ? "00.00"
              : transaction.total_tax,
          total: transaction.total,
          user_image: transaction.user
            ? transaction.user.profile_pic
            : defaultImage,
          // user_name: transaction.user ? capitalizeWords(transaction.user.name) : "NULL",
          user_name: transaction.user ? transaction.user.name : "NULL",

          user_contact: transaction.user
            ? transaction.user.phone_number
            : "NULL",
          summery: transaction._id,
          tickets: transaction.tickets?.map(
            ({ price, qty, ticket_name, color_code }) => ({
              price,
              qty,
              ticket_name,
              color_code,
            })
          ),
          parkings: transaction.parkings?.map(
            ({ price, qty, parking_name, color_code }) => ({
              price,
              qty,
              parking_name,
              color_code,
            })
          ),
        }));
        // console.log(filterData, "Filter data")
        setTransactions(filterData);
      }
      setTimeout(() => {
        let mainDiv = tableRef?.current?.childNodes[0];
        mainDiv.style.borderRadius = "30px";
        mainDiv.childNodes[0].style.borderRadius = "30px";
        mainDiv.childNodes[0].childNodes[1].style["flex-wrap"] = "wrap-reverse";
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  // const { data, isLoading, error } = useQuery("data", fetchData);

  // useEffect(() => {
  //   if (error) {
  //     console.log(error)
  //   } else {
  //     console.log("Something went wrong");
  //   }
  // }, [data, isLoading]);

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: "payment_date",
      header: "Date",
      size: 50,
    },
    {
      accessorKey: "user_name",
      header: "Name",
      size: 50,
    },
    {
      accessorKey: "user_contact",
      header: "Contact",
      size: 50,
    },
    {
      accessorKey: "status",
      // header: "PaymentStatus",
      header: "Status",
      size: 20,
    },
    {
      accessorKey: "method",
      // header: "Payment Method",
      header: "Method",
      size: 50,
    },
    {
      accessorKey: "billdesk_order_id",
      header: "BilldeskOrderID",
      enableClickToCopy: true,
      size: 50,
    },
    {
      accessorKey: "transaction_Id",
      header: "TransactionID",
      enableClickToCopy: true,
      size: 50,
    },
    {
      accessorKey: "is_promocode",
      header: "Promocode",
      size: 30,
    },
    // {
    //   accessorKey: "gst",
    //   header: "GST info",
    // },
    {
      id: "gst_details", //id used to define `group` column
      header: "GST details",
      columns: [
        {
          header: "GST details",
          size: 70,
          Cell: ({ renderedCellValue, row }) =>
            row.original.is_gst_in ? (
              <button
                className="bg-black px-2 py-1 text-white rounded-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={() => handleGst(row.original.summery)}
                disabled={row.original.is_gst_in === true ? false : true}
              >
                View GST
              </button>
            ) : (
              "No GST"
            ),
        },
      ],
    },
    {
      id: "summery", //id used to define `group` column
      header: "Summery",
      columns: [
        {
          header: "Summery",
          size: 150,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="bg-black px-2 py-1 text-white rounded-sm"
              onClick={() => handleSummery(row.original.summery)}
            >
              View summery
            </button>
          ),
        },
      ],
    },
    // {
    //   accessorKey: "discount_price",
    //   header: "Discount Amount",
    // },
    {
      accessorKey: "total",
      header: "Total",
    },
  ];

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

  const handleSummery = (id) => {
    setIsSummery(true);
    const singleOrder = filterByProperty(transactions, "summery", id);
    setOrder(singleOrder[0]);
  };

  const handleGst = (id) => {
    setIsGST(true);
    const singleOrder = filterByProperty(transactions, "summery", id);
    // setOrder(singleOrder[0])
    setGstDetails(singleOrder[0].gst_details);
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <>
        {transactions?.length > 0 ? (
          <div
            ref={tableRef}
            className="h-auto md:h-screen md:overflow-y-auto md:rounded-none md:m-0"
          >
            {/* <div ref={tableRef} className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px]"> */}
            <MaterialReactTable
              style={{ margin: "20px" }}
              columns={columns}
              data={transactions}
              enableRowSelection
              positionToolbarAlertBanner="bottom"
              // renderDetailPanel={({ row }) => (
              //   <Box
              //     sx={{
              //       // display: "grid",
              //       margin: "auto",
              //       gridTemplateColumns: "1fr 1fr",
              //       width: "100%",
              //     }}
              //   >
              //     {/* {console.log(row.original)} */}
              //     <Typography>Base Price: {row.original.base_price}</Typography>
              //     <Typography>Ticket Name Quantity Price</Typography>
              //     {row.original?.tickets?.length ? (
              //       row.original?.tickets.map((ticket, i) => (
              //         <Typography key={i}>
              //           {ticket.ticket_name} {ticket.qty} {ticket.price}
              //         </Typography>
              //       ))
              //     ) : (
              //       <Typography>No records found</Typography>
              //     )}
              //     <Typography>
              //       Payment Date: {row.original.payment_date}
              //     </Typography>
              //   </Box>
              // )}
              renderTopToolbarCustomActions={({ table }) => (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 mb-2">
                    <button
                      onClick={handleExportData}
                      className={`flex justify-center bg-primary rounded-full px-4 py-2 w-full`}
                    >
                      <p className="text-white">
                        {" "}
                        <FileDownloadIcon sx={{ mr: 1 }} />
                        Export All Data
                      </p>
                    </button>
                    <button
                      disabled={
                        table.getPrePaginationRowModel().rows.length === 0
                      }
                      onClick={() =>
                        handleExportRows(table.getPrePaginationRowModel().rows)
                      }
                      className={`flex justify-center bg-primary rounded-full px-4 py-2 w-full`}
                    >
                      <p className="text-white">
                        {" "}
                        <FileDownloadIcon sx={{ mr: 1 }} />
                        Export All Rows
                      </p>
                    </button>
                    <button
                      onClick={() => handleExportRows(table.getRowModel().rows)}
                      className={`flex justify-center bg-primary rounded-full px-4 py-2 w-full`}
                      disabled={table.getRowModel().rows.length === 0}
                    >
                      <p className="text-white">
                        <FileDownloadIcon sx={{ mr: 1 }} />
                        Export Page Rows
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        handleExportRows(table.getSelectedRowModel().rows)
                      }
                      className={`flex justify-center bg-primary rounded-full px-4 py-2 w-full`}
                      disabled={
                        !table.getIsSomeRowsSelected() &&
                        !table.getIsAllRowsSelected()
                      }
                    >
                      <p className="text-white">
                        <FileDownloadIcon sx={{ mr: 1 }} />
                        Export Selected Rows
                      </p>
                    </button>
                  </div>
                </div>
              )}
            />
            <div className="h-14 my-16"></div>
          </div>
        ) : null}
      </>
      {isSummery ? (
        <div className="bg-[#00000080] h-screen w-full absolute top-0 flex items-center justify-center z-[1300]">
          <div className="bg-[#f2f2f2] md:h-2/4 md:w-2/4 w-3/4 h-3/4 rounded-md p-5 overflow-y-auto">
            <div className="flex items-center justify-between  text-2xl cursor-pointer ">
              <p className="font-semibold">Order Summery</p>
              <span onClick={() => setIsSummery(false)}> &times;</span>
            </div>
            <hr className="w-full my-3" />
            <div className="flex flex-col justify-start h-full gap-24">
              <div className="flex flex-col gap-3 items-start justify-start w-full">
                {order?.tickets.length > 0 ? (
                  <div className="w-full">
                    <p className="text-xl">Tickets</p>
                    <div className="vip flex flex-col items-start mt-2 gap-4">
                      {order?.tickets?.map((ticket, i) => {
                        return (
                          <div
                            key={i}
                            className="w-full flex items-center justify-between"
                          >
                            <div
                              className={` rounded-full py-2 px-5`}
                              style={{
                                backgroundColor:
                                  "#" + ticket.color_code.slice(4),
                              }}
                            >
                              <p className="text-sm font-medium text-white">
                                {ticket.ticket_name}
                              </p>
                            </div>
                            <p className="ms-2">x {ticket.qty}</p>
                            <div className="price ms-auto">
                              <p className="text-sm mx-2">₹ {ticket.price}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {order?.parkings.length > 0 ? (
                  <div className="w-full">
                    <p className="text-xl">Parkings</p>
                    <div className="vip flex flex-col items-start mt-2 gap-4">
                      {order?.parkings?.map((parking, i) => {
                        return (
                          <div
                            key={i}
                            className="w-full flex items-center justify-between"
                          >
                            <div
                              className={` rounded-full py-2 px-5`}
                              style={{
                                backgroundColor:
                                  "#" + parking.color_code.slice(4),
                              }}
                            >
                              <p className="text-sm font-medium text-white">
                                {parking.parking_name}
                              </p>
                            </div>
                            <p className="ms-2">x {parking.qty}</p>
                            <div className="price ms-auto">
                              <p className="text-sm mx-2">
                                ₹ {parking.qty * parking.price}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col items-start w-full justify-between pb-5">
                <div className="flex items-center justify-between  text-2xl cursor-pointer w-full ">
                  <p className="font-semibold">Total</p>
                  <span>₹{order?.total}</span>
                </div>
                <div className="flex items-center justify-between text-xs cursor-pointer ">
                  <p className="">Including ₹{order?.total_tax} in taxes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isGST ? (
        <div className="bg-[#00000080] h-screen w-full absolute top-0 flex items-center justify-center z-[1300]">
          <div className="bg-[#f2f2f2] md:h-auto md:w-auto md:max-h-2/4 md:max-w-2/4 max-w-3/4 max-h-3/4 rounded-md p-5 overflow-y-auto">
            <div className="flex items-center justify-between  text-2xl cursor-pointer ">
              <p className="font-semibold">GST details</p>
              <span onClick={() => setIsGST(false)}> &times;</span>
            </div>
            <hr className="w-full my-2" />
            <div className="grid grid-cols-2 grid-rows-2 w-full">
              <p>GST number : </p>
              <span className="font-semibold">{gstDetails.gst_number}</span>
              <p>Businnes name : </p>
              <span className="font-semibold">{gstDetails.business_name}</span>
              <p>Businnes Address : </p>
              <span className="font-semibold">
                {gstDetails.business_address}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      
    </>
  );
};

export default Transaction;
