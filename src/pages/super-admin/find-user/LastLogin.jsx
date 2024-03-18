import React, { useEffect, useState, useRef } from "react";
import android from "../../../assets/android.svg";
import apple from "../../../assets/mac-os-logo.svg";
import windows from "../../../assets/windows2.png";
import { useParams } from "react-router-dom";
import { makeApiCall } from "../../../api/Post";
import { MaterialReactTable } from "material-react-table";
import { Box, Typography, Button } from "@mui/material";
import Loader from "../../../componets/ui-elements/Loader";

const LastLogin = () => {
  const [lastLogin, setLastLogin] = useState();
  const [loginActivity, setLoginActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const tableRef = useRef();

  const param = useParams();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await makeApiCall(
        "post",
        "user/userdetails",
        {
          phone_number: param.number,
        },
        "raw"
      );
      if (response.data.status === 1) {
        setIsLoading(false);
        setLastLogin(response.data.data);
        const rawLoginActivity = response.data.data?.login_activity.map(
          (el) => ({
            device_type: el.android_device ? 0 : el.ios_device ? 1 : 2, //0 for android 1 for ios and 2 for web
            device_modal: el.device_modal,
            device_id: el.device_id,
            app_version: el.app_version,
            time: el.time,
          })
        );
        setLoginActivity(rawLoginActivity);
      }
    } catch (error) {
      setLoading(false);
      console.warn(error);
    }
  };

  const columns = [
    {
      accessorKey: "device_type",
      header: "Device type",
      size: 50,
      Cell: ({ renderedCellValue, row }) => (
        <img
          onClick={() => handleOpenModel(row.original.guard_avatar)}
          alt="avatar"
          src={
            row.original.device_type === 0
              ? android
              : row.original.device_type === 1
              ? apple
              : windows
          }
          loading="lazy"
          style={{
            width: "30px",
            height: "30px",
          }}
        />
      ),
    },
    {
      accessorKey: "time",
      header: "Time",
      size: 50,
    },
    {
      accessorKey: "device_modal",
      header: "Device modal",
      size: 50,
    },
    {
      accessorKey: "device_id",
      header: "Device id",
      size: 50,
    },
    {
      accessorKey: "app_version",
      header: "App version",
      size: 50,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? <Loader /> : null}
      <div className="h-auto m-[2px] px-2 bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="details text-center my-3">
          <h3 className="text-xl font-medium">Last Devices</h3>
        </div>
        {isLoading ? (
          <div className="w-full h-[92px] bg-gray-200 animate-pulse rounded-md"></div>
        ) : (
          <div className="data ">
            <div
              className="info p-3 flex items-center rounded-2xl gap-3"
              style={{ boxShadow: "0px 0px 20px #0000002b" }}
            >
              <div className="image p-3 bg-[#E6E6E6] rounded-xl">
                <img
                  src={
                    lastLogin?.android_device === true
                      ? android
                      : lastLogin?.ios_device === true
                      ? apple
                      : windows
                  }
                  alt="image"
                  className="h-8 w-10"
                />
              </div>
              <div className="name w-full">
                <div className="nameinfo flex items-center">
                  <h2 className="text-lg font-medium">
                    {lastLogin?.android_device === true
                      ? "Android"
                      : lastLogin?.ios_device === true
                      ? "Apple"
                      : "Windows"}
                  </h2>
                  <p className="text-sm ms-auto">V. {lastLogin?.app_version}</p>
                </div>
                <p className="text-sm text-gray-400">
                  Model : <span>{lastLogin?.device_modal}</span>
                </p>
                <p className="text-sm text-gray-400">
                  IP : <span>{lastLogin?.user_ip}</span>
                </p>
              </div>
            </div>
          </div>
        )}
        <div
          ref={tableRef}
          className="h-auto md:h-screen md:overflow-y-auto md:rounded-none md:m-0"
        >
          <MaterialReactTable
            style={{ margin: "20px" }}
            columns={columns}
            data={loginActivity}
            positionToolbarAlertBanner="bottom"
          />
        </div>
      </div>
    </>
  );
};

export default LastLogin;
