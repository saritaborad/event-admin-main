import React, { useState, useEffect, useRef } from "react";
import { makeApiCall } from "../../../api/Post";
import { MaterialReactTable } from "material-react-table";
import { formatDateToDDMMMYYYY } from "../../../utils/CommonFunctions";
import { socket } from "../../../Routes";
import { useNavigate } from "react-router-dom";

// const socket = io(BASE_URL)
// export const socket = io("https://test.mydigievent.co.in/socket.io/?EIO=4&transport=polling")

const ServerLog = () => {
  const [serverLog, setServerLog] = useState([]);
  const tableRef = useRef();
  const navigate = useNavigate();

  // useEffect(() => {
  // socket.on("server_logs", (data) => {
  //   // console.log(serverLog);
  //   // console.log(serverLog, data.data);
  //   // console.log(data?.data?.timestamp?.toString() !== serverLog[0]?.timestamp?.toString())
  //   if (
  //     serverLog[0]?.message &&
  //     (data?.data?.message != serverLog[0]?.message)
  //   ) {
  //     data.data.date = data.data.timestamp
  //     // console.log("match", data?.data?.timestamp, serverLog[0]?.timestamp)
  //     setServerLog([data.data, ...serverLog])
  //   }
  // })
  // }, [serverLog])

  const timeFormat = (time) => {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    let period = "AM";

    if (hours >= 12) {
      if (hours > 12) {
        hours -= 12;
      }
      period = "PM";
    }
    const formattedTime = ` ${hours}:${minutes}:${seconds} ${period}`;
    return formattedTime;
  };

  const serverLogData = async (page = 1, size = 20) => {
    try {
      const response = await makeApiCall(
        "get",
        `user/serverlogs?page=${page}&size=${size}`,
        null,
        "raw"
      );
      if (response.data.status === 1) {
        const serverData = response.data.data;
        const serverTable = serverData.map((log) => ({
          _id: log._id,
          date:
            formatDateToDDMMMYYYY(log.createdAt) + timeFormat(log.createdAt),
          message: log.message,
          timestamp: log.timestamp,
        }));
        setServerLog(serverTable); // replace old data with new data
      } else {
        console.log("No Data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    updateTableStyle();
    serverLogData();
  }, []);

  const updateTableStyle = () => {
    setTimeout(() => {
      let mainDiv = tableRef?.current?.childNodes[0];
      mainDiv.style.borderRadius = "30px";
      mainDiv.childNodes[0].style.borderRadius = "30px";
      mainDiv.childNodes[0].childNodes[1].style["flex-wrap"] = "wrap-reverse";
    }, 2000);
  };

  const columns = [
    {
      accessorKey: "date",
      header: "Date & Time",
      size: 30,
    },
    {
      accessorKey: "message",
      header: "Message",
      size: 50,
    },
  ];

  return (
    <div className="h-screen overflow-y-auto ">
      <div className="serverLog py-5 mx-4">
        <h3 className="text-xl font-semibold">Server Log</h3>
      </div>
      <div ref={tableRef}>
        <MaterialReactTable
          style={{ margin: "20px" }}
          columns={columns}
          data={serverLog || []}
          positionToolbarAlertBanner="bottom"
          onPaginationChange={({ currentPage, pageSize }) =>
            console.log(pageSize)
          }
          renderTopToolbarCustomActions={({ table }) => (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 mb-2">
                <button
                  onClick={() =>
                    navigate("/role/superadmin/serverlog/liveserver")
                  }
                  className={`flex justify-center bg-primary rounded-full px-4 py-2 w-full`}
                >
                  <p className="text-white">
                    {" "}
                    {/* <FileDownloadIcon sx={{ mr: 1 }} /> */}
                    Live Server
                  </p>
                </button>
              </div>
            </div>
          )}
        />
        <div className="h-14 my-16"></div>
      </div>
    </div>
  );
};

export default ServerLog;
