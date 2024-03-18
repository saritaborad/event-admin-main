// import React from 'react'
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { decryptToken } from "./utils/CommonFunctions";
import Sidebar from "./componets/Sidebar";
import { useEffect, useState } from "react";
import { BASE_URL, makeApiCall } from "./api/Post";
// import BotttmNavbar from './componets/BotttmNavbar'
const SECRET_KEY = import.meta.env.VITE_TOKEN_SECRET_KEY;

const Layout = () => {
  const redirectPath = "/login";
  const [role, setRole] = useState();
  const auth = JSON.parse(localStorage.getItem("user"));
  const token = auth?.token ? decryptToken(auth?.token, SECRET_KEY) : null;
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  const fetchData = async () => {
    try {
      const response = await makeApiCall("get", "user/info/", null, "raw");
      if (response.data.status === 1) {
        switch (response.data.data.roles) {
          case "superadmin":
            setRole("superadmin");
            break;
          case "admin":
            setRole("admin");
            break;
          case "securityguard":
            setRole("security");
            break;
          case "garbaclassowner":
            setRole("classowner");
            break;
          case "branchowner":
            setRole("classowner");
            break;
          case "sponsor":
            setRole("sponsor");
            break;
          case "judge":
            setRole("judge");
            break;
          case "saleteam":
            setRole("saleteam");
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {role === "superadmin" ? (
        <div className="mx-auto w-auto h-screen md:w-full md:flex">
          <Sidebar role={role} />
          <div className="w-full">
            <Outlet />
          </div>
          {/* <BotttmNavbar/> */}
        </div>
      ) : (
        <div className="mx-auto w-auto h-screen md:w-full md:flex">
          {/* <Sidebar /> */}
          <div className="w-full">
            <Outlet />
          </div>
          {/* <BotttmNavbar/> */}
        </div>
      )}
    </>
  );
};

export default Layout;
