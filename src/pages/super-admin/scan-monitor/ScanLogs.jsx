import React, { useEffect, useState, useRef } from "react";
import { makeApiCall } from "../../../api/Post";
import defaultImage from "../../../assets/blank_user.svg";
import android from "../../../assets/android.svg";
import apple from "../../../assets/mac-os-logo.svg";
import windows from "../../../assets/windows2.png";

// ==========================

import { MaterialReactTable } from "material-react-table";
import { Box, Typography, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";

// ==============================
import Loader from "../../../componets/ui-elements/Loader";
import ImageModel from "../../../componets/ui-elements/ImageModel";
import { filterByProperty } from "../../../utils/CommonFunctions";
import { useNavigate } from "react-router-dom";

const ScanLogs = () => {
  const tableRef = useRef();
  const navigate = useNavigate();

  const today = new Date();
  const minDate = new Date('2023-10-15T00:00');

  const [scanLogs, setScanLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isImageModel, setIsImageModel] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [userDetail, setUserDetail] = useState([]);
  const [isUserPopup, setIsUserPopup] = useState(false);
  const [toDate, setToDate] = useState();
  const [fromDate, setFrommDate] = useState();
  const [totalData, setTotalData] = useState();

  const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 20, //customize the default page size
});


  const fetchData = async (page) => {
    console.log(toDate);
    console.log(fromDate);
    setLoading(true);
    try {
      const data = {
        endDateString: `${toDate}`,
        startDateString: `${fromDate}`,
        page: pagination.pageIndex ,
        perPage: pagination.pageSize,
      };
      const updatedData = { ...data, page };
      const response = await makeApiCall(
        "post",
        "guard/scanlogs",
        data,
        "raw"
      );

      console.log(response);
      if (response.data.status === 1) {

        setTotalData(response.data.total);

        const filterData = response.data.data.map((scan) => ({
          //   id: scan._id,
          guard_name: scan.guard?.guard_name,
          guard_contact: scan.guard?.phone_number,
          status: scan.status ? scan.status : "---",
          user_id: scan._id,
          user_details: scan.user ? scan.user : null,
          user_name: scan.user?.name ? scan.user.name : "---",
          location_name: scan.location_name ? scan.location_name : "---",
          type: scan.type,
          time: scan.time,
          guard_avatar: scan.guard?.profile_pic,
          user_avatar: scan.user?.profile_pic,
          user_login: scan.user_login ? scan.user_login : null,
        }));
        // console.log(filterData, "Filter data")
        setScanLogs(filterData);
        setLoading(false);
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
      setLoading(false);
    }
  };


  const handleImageModelClose = () => {
    setIsImageModel(false);
  };

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

  const columns = [
    //   {
    //     accessorKey: "id",
    //     header: "ID",
    //     size: 50,
    //   },
    {
      id: "guard", //id used to define `group` column
      header: "Guard",
      columns: [
        {
          accessorFn: (row) => `${row.guard_name}`, //accessorFn used to join multiple data into a single cell
          id: "profile_pic", //id is still required when using accessorFn instead of accessorKey
          header: "Guard",
          size: 250,
          Cell: ({ renderedCellValue, row }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                onClick={() => handleOpenModel(row.original.guard_avatar)}
                alt="avatar"
                height={30}
                src={row.original.guard_avatar}
                loading="lazy"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                }}
              />
              {/* <p>{row.original.roles}</p> */}
              {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
              <span>{renderedCellValue}</span>
            </Box>
          ),
        },
      ],
    },
    {
      accessorKey: "guard_contact",
      header: "Guard Contact",
      size: 50,
    },
    {
      accessorKey: "location_name",
      header: "Guard location",
      size: 50,
    },
    {
      accessorKey: "status",
      header: "Scan Status",
    },
    {
      accessorKey: "user_name",
      header: "User Name",
      enableClickToCopy: true,
    },
    {
      id: "user_id", //id used to define `group` column
      header: "User details",
      columns: [
        {
          header: "User details",
          size: 250,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="bg-black px-2 py-1 text-white rounded-sm"
              onClick={() => handleUserDetails(row.original.user_id)}
            >
              User details
            </button>
          ),
        },
      ],
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "time",
      header: "Time of scan",
    },
  ];

  const handleUserDetails = (id) => {
    setIsUserPopup(true);
    const singleUser = filterByProperty(scanLogs, "user_id", id);
    // setSecurityDetail(singleOrder[0]);
    console.log(scanLogs);
    setUserDetail(singleUser[0]);
  };

  console.log(userDetail);

  useEffect(() => {
  fetchData()
}, [pagination.pageIndex, pagination.pageSize]);

   const UserLog = () =>{
    navigate("/role/superadmin/scanmoniotoring/userlogs");
   }

  return (
    <>
      {loading ? <Loader /> : null}
      {isImageModel ? (
        <ImageModel handleClose={handleImageModelClose} src={selectedImage} />
      ) : null}

      <div className="h-screen overflow-y-auto">
        <div className="flex items-end justify-start w-full gap-2">
        <div className="dateSelect">
          <div className="date ml-4 mt-4">
            <p className="text-lg font-medium">Select Date</p>
          </div>

          <div className="date flex items-end gap-5 mt-5 ml-5">
            <div className="from">
              <p>From</p>
              <input
                type="datetime-local"
                className="px-2 py-2 rounded-md"
                min={minDate}
                max={today}
                onChange={(e) => setFrommDate(e.target.value)}
              />
            </div>
            <div className="from">
              <p>To</p>
              <input
                type="datetime-local"
                className="px-2 py-2 rounded-md"
                min={minDate}
                max={today}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="btn">
              <button
                className="text-white bg-primary px-5 py-2 rounded-lg"
                onClick={() => fetchData(1)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
       <div className="btn">
              <button
                className="text-primary bg-transparent border-primary border px-5 py-2 rounded-lg"
                onClick={() => UserLog()}
              >
                User logs
              </button>
            </div>
        </div>

        {scanLogs?.length > 0 ? (
          <div
            ref={tableRef}
            className="h-auto md:h-screen md:overflow-y-auto md:rounded-none md:m-0 pt-2"
          >
            <MaterialReactTable
              style={{ margin: "20px" }}
              positionToolbarAlertBanner="bottom"
              columns={columns}
              data={scanLogs}
              enableStickyHeader={true}
              manualPagination={true}
              rowCount={totalData}
              state={{pagination}}
              onPaginationChange={setPagination}
              
              // onPageChange={handlePageChange}
              renderTopToolbarCustomActions={({ table }) => (
                <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 ">
                  <button
                    onClick={() =>
                      navigate("/role/superadmin/scanmoniotoring/livescaning")
                    }
                    className={`flex justify-center bg-primary rounded-full px-4 py-2 w-full`}
                  >
                    <p className="text-white">Live Scanning</p>
                  </button>
                </div>
              )}
            />
          </div>
        ) : null}

        {isUserPopup ? (
          <div className="bg-[#00000080] h-screen w-full md:w-[83%] absolute top-0 z-50 flex items-center justify-center">
            <div className="bg-[#f2f2f2] md:max-h-2/4 md:w-2/4 w-3/4 max-h-3/4 h-auto rounded-md p-5 overflow-y-auto flex flex-col gap-5 items-start justify-start">
              <div className="flex items-center justify-between  text-lg cursor-pointer w-full ">
                <p className="font-medium">User Details</p>
                <span
                  onClick={() => setIsUserPopup(false)}
                  className="text-2xl"
                >
                  {" "}
                  &times;
                </span>
              </div>
              {userDetail.user_details === null ? null : (
                <div className="flex items-center justify-start gap-4 w-full">
                  <img
                    onClick={() =>
                      handleOpenModel(userDetail.user_details.profile_pic)
                    }
                    alt="avatar"
                    height={30}
                    src={userDetail.user_details.profile_pic}
                    loading="lazy"
                    style={{
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-md font-medium">
                      {userDetail.user_details.name}
                    </p>
                    <p className="tetx-md text-gray-600">
                      {userDetail.user_details.phone_number}
                    </p>
                  </div>
                </div>
              )}

              {userDetail.user_login === null ? null : (
                <div className="data w-full">
                  <div
                    className="info flex items-center py-2 gap-2 border-black border-t "
                    // style={{ boxShadow: "0px 0px 20px #0000002b" }}
                  >
                    <div className="image   rounded-xl">
                      <img
                        src={
                          userDetail.user_login?.android_device === true
                            ? android
                            : userDetail.user_login?.ios_device === true
                            ? apple
                            : windows
                        }
                        alt="image"
                        className="h-6 w-8"
                      />
                    </div>
                    <div className="name w-full">
                      <div className="nameinfo flex items-center">
                        <h2 className="text-sm font-medium">
                          {userDetail.user_login?.android_device === true
                            ? "Android"
                            : userDetail.user_login?.ios_device === true
                            ? "Apple"
                            : "Windows"}
                        </h2>
                        <p className="text-sm text-gray-400 ml-2">
                          / model :{" "}
                          <span>{userDetail.user_login?.device_modal}</span>
                        </p>
                        <p className="text-sm ms-auto">
                          V. {userDetail.user_login?.app_version}
                        </p>
                      </div>
                      {/* <p className="text-sm text-gray-400">
                      IP : <span>{userDetail.user_login?.user_ip}</span>
                    </p> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
        <div className="h-14"></div>
      </div>
    </>
  );
};

export default ScanLogs;
