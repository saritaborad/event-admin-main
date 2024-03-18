import React, { useEffect } from "react";
import lock_icone from "../../../assets/login.svg";
import { BsTelephoneFill, BsWhatsapp } from "react-icons/bs";
import queryString from "query-string";
import { Link, useNavigate } from "react-router-dom";
import { decryptToken, encryptToken } from "../../../utils/CommonFunctions";
import logo from "../../../assets/newLogo.svg";

const Login = () => {
  const navigate = useNavigate();

  const SECRET_KEY = import.meta.env.VITE_TOKEN_SECRET_KEY;
  let userData = localStorage.getItem("user");
  if (userData) {
    userData = JSON.parse(userData);
  } else {
    // Handle the case when there is no user data in local storage
    userData = null;
  }

  useEffect(() => {
    const queryParams = queryString.parse(window.location.search);

    // Extract the token and user type from the query parameters
    const token = encryptToken(queryParams.token, SECRET_KEY);
    const userType = queryParams.user_type;
    // const userType = queryParams.user_type;

    // Store the token and user type in local storage
    console.log(token, "<===== TOKEN", userType, "<===== User type");

    const userData = {
      token: token,
      role: userType,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    if (token) {
      switch (userType) {
        case "superadmin":
          navigate("/role/superadmin");
          break;
        case "garbaclassowner":
          navigate("/role/classowner");
          break;
        case "branchowner":
          navigate(`/role/classowner`);
          break;
        case "security":
          navigate("/role/security");
          break;
        case "sponsor":
          navigate("/role/sponsor");
          break;
        case "securityguard":
          navigate("/role/security");
          break;
        case "admin":
          navigate("/role/admin");
          break;
        case "judge":
          navigate("/role/judge");
          break;
        case "salesteam":
          navigate("/role/salesteam");
          break;
        default:
          // Handle the case when the user role is not matched
          console.log("Invalid user role");
          break;
      }
    }
  }, []);

  return (
    <>
      <div className="loginPage md:hidden">
        <div className="titleText flex items-center justify-center pt-24">
          <div className="image">
            <img src={logo} alt="image" className="w-[150px]" />
          </div>
        </div>

        <div className="loginSection bg-white mt-20">
          <div className="loginText py-10 px-10 text-center">
            <h1 className="text-3xl font-semibold">Login Account</h1>
            <p className=" text-[#B1B1B1] mt-3">Sign in your account!</p>
          </div>

          <Link
            to={`/login/${0}`}
            className="whatsappButton flex items-center justify-center bg-primary rounded-full py-4 mx-10"
          >
            <BsTelephoneFill className="text-xl text-white" />
            <p className="text-lg text-white ms-2">Phone Number</p>
          </Link>

          <Link
            to={`/login/${1}`}
            className="whatsappButton flex items-center justify-center bg-[#13B841] rounded-full py-4 m-10 "
          >
            <BsWhatsapp className="text-2xl text-white" />
            <p className="text-lg text-white ms-2">Whatsapp Number</p>
          </Link>
        </div>
      </div>
      <div className="hidden md:flex h-screen w-full mainBg items-center justify-center ">
        <div className="bg-white h-[435px] w-[585px] rounded-[30px] relative">
          <div className="absolute flex items-center justify-center bg-white border-4 border-[#D5E6F6] mx-auto -top-16 h-32 w-32 rounded-[30px] left-0 right-0">
            <img src={logo} className="w-full object-cover rounded-[30px]" />
          </div>
          <div className="flex flex-col items-center justify-end">
            <div className="loginSection bg-white mt-20 w-3/4">
              <div className="loginText py-10 px-10 text-center">
                <h1 className="text-3xl font-semibold">Login Account</h1>
                <p className=" text-[#B1B1B1] mt-3">Sign in your account!</p>
              </div>

              <Link
                to={`/login/${0}`}
                className="whatsappButton w-full flex items-center justify-center bg-primary rounded-full py-4"
              >
                <BsTelephoneFill className="text-xl text-white" />
                <p className="text-lg text-white ms-2">Phone Number</p>
              </Link>

              <Link
                to={`/login/${1}`}
                className="whatsappButton w-full flex items-center justify-center bg-[#13B841] rounded-full py-4 mt-5"
              >
                <BsWhatsapp className="text-2xl text-white" />
                <p className="text-lg text-white ms-2">Whatsapp Number</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
