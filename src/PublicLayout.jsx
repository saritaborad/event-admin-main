// import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { decryptToken } from './utils/CommonFunctions';
// import BotttmNavbar from './componets/BotttmNavbar'
const SECRET_KEY = import.meta.env.VITE_TOKEN_SECRET_KEY;

const PublicLayout = () => {
  const roles = {
    superadmin: "/role/superadmin",
    garbaclassowner: "/role/classowner",
    branchowner: `/role/classowner`,
    security: "/role/security",
    sponsor: "/role/sponsor",
    securityguard: "/role/security",
    admin: "/role/admin",
  }
  let redirectPath = null
  let auth = localStorage.getItem("user");
auth = auth ? JSON.parse(auth) : null;
  if (auth?.token) {
    const token = decryptToken(auth?.token, SECRET_KEY);
    if (auth?.role) redirectPath = roles[auth?.role]
    if (token && redirectPath) {
      return <Navigate to={redirectPath} replace />;
    } else
      return <Outlet />;
  } else {
    return <Outlet />;
  }

}

export default PublicLayout