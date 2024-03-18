import React, { useState } from "react";
import { BsChevronLeft } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import OTPInput from "react-otp-input";
import { performLogin, validateOTP } from "../../../api/Post";
import Alert from "../../../componets/ui-elements/Alert";
import logo from "../../../assets/newLogo.svg";

const WhatsappLogin = () => {
  const navigate = useNavigate();
  const [isOtp, setIsOtp] = useState(false);
  const [number, setNumber] = useState();
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [onConfirm, setOnConfirm] = useState();

  const params = useParams();
  const loginType = params.id;

  const handleInputNumber = (e) => {
    setNumber(e.target.value);
  };

  const handleVarify = async () => {
    setIsAlert(true);
    if (otp.length === 6) {
      setStatus("loading");
      try {
        const userAgent = navigator.userAgent;
        const response = await validateOTP({
          phone: number,
          receivedotp: otp,
          android_device: false,
          ios_device: false,
          device_modal: "Web",
          device_id:userAgent
        });
        if (response.data.status === 1) {
          console.log(response.data.data.roles);

          if (response.data.data.roles === "n-user") {
            setStatus("error");
            setErrorMsg("user not found");
          } else {
            switch (response.data.data.roles) {
              case "superadmin":
                setStatus("complete");
                setSuccessMsg(response.data.message);
                setOnConfirm(navigate(`/role/superadmin`));
                break;
              case "garbaclassowner":
                setStatus("complete");
                setSuccessMsg(response.data.message);
                setOnConfirm(navigate(`/role/classowner`));
                break;
              case "branchowner":
                setStatus("complete");
                setSuccessMsg(response.data.message);
                setOnConfirm(navigate(`/role/classowner`));
                break;
              case "securityguard":
                setStatus("complete");
                setSuccessMsg(response.data.message);
                setOnConfirm(navigate("/role/security"));
                break;
              case "sponsor":
                setStatus("complete");
                setSuccessMsg(response.data.message);
                setOnConfirm(navigate("/role/sponsor"));
                break;
              case "admin":
                setStatus("complete");
                setSuccessMsg(response.data.message);
                setOnConfirm(navigate("/role/admin"));
                break;
              case "judge":
                setStatus("complete");
                setSuccessMsg(response.data.message);
                setOnConfirm(navigate("/role/judge"));
                break;
              case "salesteam":
                setStatus("complete");
                setSuccessMsg(response.data.message);
                setOnConfirm(navigate("/role/salesteam"));
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
      const response = await performLogin({
        phone: number,
        otp_sms: loginType == 0 ? true : false,
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

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleClick = () => {
    if (number === undefined) {
      setIsAlert(true);
      setStatus("error");
      setErrorMsg("Please enter number");
    } else if (number.length != 10) {
      setIsAlert(true);
      setStatus("error");
      setErrorMsg("Please enter valid number");
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
        phone: number,
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
        <div className="whatsappLoginPage md:hidden">
          <div className="backButtonText py-5 flex items-center mx-5">
            <div className="back h-10 w-10 rounded-full bg-white flex justify-center items-center">
              <Link to={"/login"}>
                <BsChevronLeft className="text-xl" />
              </Link>
            </div>
            <div className="loginText ms-7 text-xl font-semibold">Login</div>
          </div>

          <div className="whatsappSection bg-white mt-5 px-10">
            <div className="loginText py-10 px-10 text-center">
              {loginType === "0" ? (
                <h1 className="text-3xl font-semibold">Phone Login</h1>
              ) : (
                <h1 className="text-3xl font-semibold">Whatsapp Login</h1>
              )}
              <p className=" text-[#B1B1B1] mt-3">
                Enter Your phone number to verify your account
              </p>
            </div>

            <div className="moNumber mt-10 py-4 bg-[#E6E6E6] rounded-full">
              <div className="number flex items-center">
                <p className="ps-5 pe-3 font-medium">+91</p>
                <p className="text-xl">|</p>
                <input
                  type="text"
                  maxLength={10}
                  onChange={handleInputNumber}
                  className=" outline-none bg-[#E6E6E6] font-medium w-full mx-3"
                  placeholder="Enter your number"
                />
              </div>
            </div>
            <button
              onClick={handleClick}
              className="w-full mt-5 text-white font-semibold py-4 flex justify-center  bg-gradient-to-l from-[#FE385C] to-[#FF5D53] rounded-full "
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

            {/* <div className="orContinueWith">
              <h2 className="hr-lines text-gray-400">or continue with</h2>
            </div>

            <div className="mail flex justify-center">
              <Link
                to={"/role/email-login"}
                className="mailButton flex justify-center items-center  bg-black rounded-full h-16 w-16"
              >
                <IoIosMail className="text-3xl text-white" />
              </Link>
            </div> */}
          </div>
        </div>
      ) : (
        <div className="whatsappVerifyPage md:hidden">
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
                Enter the code sent to {loginType == 0 ? "SMS" : "Whatsapp"}
              </p>
              <p className="text-lg mt-3 text-[#FE385C]">+91 {number}</p>
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
              className="requestOTP flex justify-center mt-7 bg-[#FE385C] rounded-full w-full py-4 text-white font-semibold"
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

      {!isOtp ? (
        <div className="hidden md:flex h-screen w-full mainBg items-center justify-center ">
          <div className="bg-white h-[435px] w-[585px] rounded-[30px] relative">
            <div className="absolute flex items-center justify-center bg-white border-4 border-[#D5E6F6] mx-auto -top-16 h-32 w-32 rounded-[30px] left-0 right-0">
              <img src={logo} className="w-full object-cover rounded-[30px]" />
            </div>
            <div className="flex flex-col items-center justify-end">
              <div className="backButtonText py-5 flex items-center mx-5">
                <div className="back h-10 w-10 rounded-full bg-white flex justify-center items-center">
                  <Link to={"/login"}>
                    <BsChevronLeft className="text-xl" />
                  </Link>
                </div>
                <div className="loginText ms-7 text-xl font-semibold">
                  Login
                </div>
              </div>

              <div className="whatsappSection bg-white mt-5 px-10">
                <div className="loginText  p-5 text-center">
                  {loginType === "0" ? (
                    <h1 className="text-3xl font-semibold">Phone Login</h1>
                  ) : (
                    <h1 className="text-3xl font-semibold">Whatsapp Login</h1>
                  )}
                  <p className=" text-[#B1B1B1] mt-3">
                    Enter Your phone number to verify your account
                  </p>
                </div>

                <div className="moNumber mt-2 py-4 bg-[#E6E6E6] rounded-full">
                  <div className="number flex items-center">
                    <p className="ps-5 pe-3 font-medium">+91</p>
                    <p className="text-xl">|</p>
                    <input
                      type="text"
                      maxLength={10}
                      onChange={handleInputNumber}
                      className=" outline-none bg-[#E6E6E6] font-medium w-full mx-3"
                      placeholder="Enter your number"
                    />
                  </div>
                </div>
                <button
                  onClick={handleClick}
                  className="w-full mt-5 text-white font-semibold py-4 flex justify-center  bg-gradient-to-l from-[#FE385C] to-[#FF5D53] rounded-full "
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

                {/* <div className="orContinueWith">
              <h2 className="hr-lines text-gray-400">or continue with</h2>
            </div>

            <div className="mail flex justify-center">
              <Link
                to={"/role/email-login"}
                className="mailButton flex justify-center items-center  bg-black rounded-full h-16 w-16"
              >
                <IoIosMail className="text-3xl text-white" />
              </Link>
            </div> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex h-screen w-full mainBg items-center justify-center ">
          <div className="bg-white h-auto p-5 min-h-[435px] w-[585px] rounded-[30px] relative">
            <div className="absolute flex items-center justify-center bg-white border-4 border-[#D5E6F6] mx-auto -top-16 h-32 w-32 rounded-[30px] left-0 right-0">
              <img src={logo} className="w-full object-cover rounded-[30px]" />
            </div>
            <div className="flex flex-col items-center justify-end mt-5">
              <div className="OTPSection  mt-5 px-10">
                <div className="loginText p-5  text-center">
                  <h1 className="text-3xl font-semibold">Verification</h1>
                  <p className=" text-[#B1B1B1] mt-3">
                    Enter the code sent to {loginType == 0 ? "SMS" : "Whatsapp"}
                  </p>
                  <p className="text-lg mt-3 text-[#FE385C]">+91 {number}</p>
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
                        className={`OTPInput text-xl mx-1 bg-gray-300 rounded-xl outline-none focus:bg-primary focus:text-white`}
                      />
                    )}
                  />
                </div>

                <div className="reSend mt-10 text-center">
                  <p className="text-lg text-[#B1B1B1]">
                    Don’t Received the code!
                  </p>
                  <p className="text-lg text-[#FE385C]" onClick={handleResend}>
                    Resend Code
                  </p>
                </div>

                <button
                  onClick={handleVarify}
                  className="requestOTP flex justify-center mt-7 bg-[#FE385C] rounded-full w-full py-4 text-white font-semibold"
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
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsappLogin;
