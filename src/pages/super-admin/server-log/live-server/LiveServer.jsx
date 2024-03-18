import React, { useState, useEffect, useRef } from "react";
import { MaterialReactTable } from "material-react-table";
import { socket } from "../../../../Routes";

// const socket = io(BASE_URL)
// export const socket = io("https://test.mydigievent.co.in/socket.io/?EIO=4&transport=polling")

const LiveServer = () => {
  const [serverLog, setServerLog] = useState([]);
  const tableRef = useRef();

  // useEffect(() => {
  socket.on("server_logs", (data) => {
    // console.log(data)
    if (data?.status === 1 && data?.data?.message != serverLog[0]?.message) {
      data.data.date = data.data.timestamp;
      // console.log("match", data?.data?.timestamp, serverLog[0]?.timestamp)
      setServerLog([data.data, ...serverLog]);
    }
  });
  // }, [serverLog])

  useEffect(() => {
    updateTableStyle();
    // serverLogData();
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
    <div className="h-screen overflow-y-auto">
      <div className="serverLog py-5 mx-4">
        <h3 className="text-xl font-semibold">Live Server</h3>
      </div>
      <div ref={tableRef}>
        <MaterialReactTable
          style={{ margin: "20px" }}
          columns={columns}
          data={serverLog || []}
          positionToolbarAlertBanner="bottom"
          enablePagination={false}
          //  enableFilters={false}
          enableStickyHeader={true}
        />
        <div className="h-14 my-16"></div>
      </div>
    </div>
  );
};

export default LiveServer;
