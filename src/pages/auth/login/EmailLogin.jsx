import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";
import { BsChevronLeft, BsTelephoneFill } from "react-icons/bs";
import { performLogin, validateOTP } from "../../../api/Post";
import Alert from "../../../componets/ui-elements/Alert";
// import Cookies from "js-cookie";

const EmailLogin = () => {
  const navigate = useNavigate();
  const [isOtp, setIsOtp] = useState(false);
  const [email, setEmail] = useState();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [onConfirm, setOnConfirm] = useState();

  const handleInputEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleVarify = async () => {
    setIsAlert(true);
    if (otp.length === 6) {
      setStatus("loading");
      try {
        const response = await validateOTP({
          email: email,
          receivedotp: otp,
        });
        if (response.data.status === 1) {
          if (response.data.data.roles === "n-user") {
            setStatus("error");
            setErrorMsg("user not found");
          } else {
            switch (response.data.data.roles) {
              case "superadmin":
                navigate(`/role/superadmin`);
                break;
              case "garbaclassowner":
                navigate(`/role/classowner`);
                break;
              case "branchowner":
                setOnConfirm(navigate(`/role/classowner`));
                break;
              case "security":
                navigate("/role/security");
                break;
              case "judge":
                navigate("/role/judge");
                break;
              case "salesteam":
                navigate("/role/salesteam");
                break;
              default:
                // Handle the case when the user role is not matched
                setStatus("error");
                setErrorMsg("Invalid user");
                break;
            }
          }
          console.log("User verfied ");
        } else {
          setStatus("error");
          setErrorMsg("OTP is wrong");
        }
      } catch (error) {
        console.warn(error);
        setStatus("error");
        setErrorMsg("Something went wrong");
      }
    } else {
      setStatus("error");
      setErrorMsg("OTP length is not valid");
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const response = await performLogin({ email: email });
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
        setIsOtp(true);
      }
    } catch (error) {
      setStatus("error");
      setErrorMsg(response.data.message);
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleClick = () => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const emailIsValid = regex.test(email);
    if (!email) {
      setIsAlert(true);
      setStatus("error");
      setErrorMsg("Please enter email");
    } else if (!emailIsValid) {
      setIsAlert(true);
      setStatus("error");
      setErrorMsg("Please enter valid email");
    } else {
      setIsAlert(true);
      setStatus("start");
    }
  };

  const handleResend = async () => {
    setOtp("");
    setIsAlert(true);
    setStatus("loading");

    try {
      const response = await performLogin({
        email: email,
      });
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
        setOnConfirm(setIsOtp(true));
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <>
      {isAlert ? (
        <Alert
          isOpen={isAlert}
          title="Are you sure?"
          text="You won't be able to revert this!"
          confirmButtonText="Submit"
          cancelButtonText="Cancel"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          status={status}
          confirmText={successMsg}
          errorText={errorMsg}
          onComplete={() => {
            setIsAlert(false);
          }}
        />
      ) : null}
      {!isOtp ? (
        <div className="whatsappLoginPage">
          <div className="backButtonText py-5 flex items-center mx-5">
            <div className="back h-10 w-10 rounded-full bg-white flex justify-center items-center">
              <Link to={"/login"}>
                <BsChevronLeft className="text-xl" />
              </Link>
            </div>
            <div className="loginText ms-7">
              <p className="text-xl font-semibold">Login</p>
            </div>
          </div>

          <div className="mailSection bg-white mt-5 px-10">
            <div className="loginText py-10 px-10 text-center">
              <h1 className="text-3xl font-semibold">Email Login</h1>
              <p className=" text-[#B1B1B1] mt-3">
                Enter Your Email to verify your account
              </p>
            </div>

            <div className="moNumber mt-10 py-4 bg-[#E6E6E6] rounded-full">
              <div className="number flex items-center ms-2">
                <input
                  onChange={handleInputEmail}
                  type="email"
                  className=" outline-none bg-[#E6E6E6] font-medium w-full mx-3"
                  placeholder="Email Address"
                />
              </div>
            </div>

            <button
              onClick={handleClick}
              className="w-full mt-5 text-white font-semibold py-4 flex justify-center  bg-gradient-to-l from-[#FE385C] to-[#FF5D53] rounded-full items-center gap-3"
            >
              {loading ? (
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 mr-2 text-white animate-spin dark:text-white fill-slate-500 dark:fill-slate -300"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : null}
              Continue
            </button>

            <div className="orContinueWith">
              <h2 className="hr-lines text-gray-400">or continue with</h2>
            </div>

            <div className="mail flex justify-center">
              <Link
                to={"/role/whatsapp-login"}
                className="mailButton flex justify-center items-center  bg-[#13B841] rounded-full h-16 w-16"
              >
                <BsTelephoneFill className="text-2xl text-white" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="emailVerifyPage">
          <div className="backButtonText py-5 flex items-center mx-5">
            <div className="back h-10 w-10 rounded-full bg-white flex justify-center items-center">
              <button onClick={() => setIsOtp(false)}>
                <BsChevronLeft className="text-xl" />
              </button>
            </div>
            <div className="loginText ms-7">
              <p className="text-xl font-semibold">Login</p>
            </div>
          </div>

          <div className="OTPSection bg-white mt-5 px-10">
            <div className="loginText py-10 px-10 text-center">
              <h1 className="text-3xl font-semibold">Verification</h1>
              <p className=" text-[#B1B1B1] mt-3">
                Enter the code sent to Email
              </p>
              <p className="text-lg mt-3 text-[#FE385C]">{email}</p>
            </div>

            <div className="OTPBox w-full mt-5 flex justify-center">
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => (
                  <input
                    {...props}
                    type="number"
                    className="OTPInput text-xl mx-1 bg-gray-300 rounded-xl outline-none"
                  />
                )}
              />
            </div>

            <div className="reSend mt-10 text-center">
              <p className="text-lg text-[#B1B1B1]">Don’t Received the code!</p>
              <p className="text-lg text-[#FE385C]" onClick={handleResend}>
                Resend Code
              </p>
            </div>

            <button
              onClick={handleVarify}
              className="requestOTP flex justify-center mt-7 bg-[#FE385C] rounded-full w-full py-4 text-white font-semibold items-center gap-3"
            >
              {loading ? (
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 mr-2 text-white animate-spin dark:text-white fill-slate-500 dark:fill-slate -300"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : null}
              Verify
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailLogin;
