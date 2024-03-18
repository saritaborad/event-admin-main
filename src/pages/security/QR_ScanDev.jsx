import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { AiOutlineRight } from "react-icons/ai";
import { useZxing } from "react-zxing";
import { Link } from "react-router-dom";
import scan_animation from "../../assets/scan-anim.json";
import Lottie from "lottie-react";
import bipSound from "../../assets/audio/bipSound.mp3";
import { makeApiCall, scanningApiCall } from "../../api/Post";
import { MdClose, MdError } from "react-icons/md";
import { BsGeoAltFill } from "react-icons/bs";
import black_user from "../../assets/blank_user.svg";
import ImageModel from "../../componets/ui-elements/ImageModel";
import car from "../../assets/sports-car.svg";
import bike from "../../assets/scooter-front-view.svg";
import { GoAlertFill } from "react-icons/go";
import { FiCheck } from "react-icons/fi";
import { formatVehicleNumber } from "../../utils/CommonFunctions";
import { useQuery } from "react-query";

const QR_Scan = () => {
  const [result, setResult] = useState();
  const [qrResp, setQrResp] = useState();
  const [isError, setIsError] = useState();
  const [modelLoading, setModelLoading] = useState(false);
  const [isWarn, setIsWarn] = useState();
  const [paused, setPaused] = useState(false);
  const [user, setUser] = useState();

  const [isModel, setIsModel] = useState(false);
  const audioRef = React.createRef();

  const fetchData = async () => {
    try {
      const response = await makeApiCall("get", "user/info/", null, "raw");

      if (response.data.status === 1) {
        console.log(response.data.data);
        setUser(response.data.data);
      } else {
        console.warn("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, isLoading, error } = useQuery("data", fetchData);

  const scanningQR = async (obj) => {
    audioRef.current.play();
    const data = obj;
    try {
      const resp = await scanningApiCall("post", "guard/scan", data, "raw");
      console.log(resp);
      if (resp.data.status === 1) {
        setResult(resp.data);
        // setModelLoading(false);

        if (audioRef.current != null) {
          if (window.flutter_inappwebview != undefined) {
            let isAppReady = false;
            window.addEventListener("vibration_scan", function (event) {
              isAppReady = true;
            });
          }
        }
        setIsModel(true);
        setPaused(true);
      } else if (resp.data.status === 0) {
        setIsWarn(resp.data);
        // setModelLoading(false);
        if (audioRef.current != null) {
          audioRef.current.play();
          if (window.flutter_inappwebview != undefined) {
            let isAppReady = false;
            window.addEventListener("vibration_scan", function (event) {
              isAppReady = true;
            });
          }
        }
        setIsModel(true);
        setPaused(true);
      }
    } catch (error) {
      // setModelLoading(false);
      console.error(error);
      setIsError(error);
      setIsModel(true);
      setPaused(true);
    }
  };

  const { ref } = useZxing({
    paused,
    onDecodeResult(result) {
      setPaused(true);
      console.log(result.getText());
      // setIsModel(true);
      // setModelLoading(true)
      scanningQR(result.getText());
      setQrResp(JSON.parse(result));
    },
    onDecodeError(error) {
      console.log(error);
      // setPaused(true);
    },
    onError(error) {
      console.error(error);
      // setPaused(true);
    },
  });

  const handleCloseModel = () => {
    setIsModel(false);
    setPaused(false);
    setResult();
    setIsWarn();
  };

  return (
    <>
      {isModel === true ? (
        <ConfirmationPopup
          handleCloseModel={handleCloseModel}
          result={result}
          isWarn={isWarn}
          qrResp={qrResp}
          isLoading={modelLoading}
        />
      ) : null}
      {/* <video ref={ref} className=" w-full object-cover absolute h-full" /> */}
      <div className="ticketConfirmationPage bg-black  pt-5  h-screen flex flex-col items-center justify-between absolute w-full">
        <div className="QRTitle flex px-5 w-full">
          <div className="titleTicketText">
            <h1 className="text-xl font-semibold text-white">Scan QR Code</h1>
          </div>
          <Link to={"/role/security"} className="ms-auto">
            <div className="closeButton ms-auto" id="closeButton">
              <IoMdCloseCircle className="text-3xl text-gray-400" />
            </div>
          </Link>
        </div>

        <section className="container px-5 contents" id="demo-content">
          <div className="scanCon border-2 border-green-400 rounded-3xl my-10 flex justify-center items-center relative overflow-hidden w-[350px] h-[350px]">
            {/* <Lottie
              animationData={scan_animation}
              className="absolute w-full h-full"
            /> */}
            <video ref={ref} className=" " />
          </div>

          <p className="scanNotice text-white text-center rounded-full p-2.5">
            Please align the QR within the scanner
          </p>
        </section>

        <div className="info bg-white rounded-t-3xl mt-10 w-full flex flex-col items-center justify-start gap-10 p-8">
          <div className="gateText text-center">
            {user?.guard?.gate ? (
              <>
                <h1 className="text-xl font-medium my-4">Gate No : </h1>
                <h1 className="text-4xl font-semibold text-[#FE385C] my-5">
                  {user?.guard.gate.gate_name}
                </h1>
              </>
            ) : user?.guard?.checkpoint ? (
              <>
                <h1 className="text-xl font-medium my-4">Checkpoint No : </h1>
                <h1 className="text-4xl font-semibold text-[#FE385C] my-5">
                  {user?.guard.checkpoint.checkpoint_name}
                </h1>
              </>
            ) : user?.guard?.parking ? (
              <>
                <h1 className="text-xl font-medium my-4">Parking No : </h1>
                <h1 className="text-4xl font-semibold text-[#FE385C] my-5">
                  {user?.guard.parking.parking_name}
                </h1>
              </>
            ) : user?.guard?.zone ? (
              <>
                <h1 className="text-xl font-medium my-4">Zone No : </h1>
                <h1 className="text-4xl font-semibold text-[#FE385C] my-5">
                  {user?.guard.zone.zone_name}
                </h1>
              </>
            ) : null}
          </div>
          {/* 
          <Link to={"#"} className="w-3/4">
            <div className="rescanButton h-16 bg-black  px-5 flex justify-between items-center rounded-full w-full">
              <p className="text-white font-medium">Show Pass</p>
              <AiOutlineRight className="text-white" />
            </div>
          </Link> */}
        </div>
        {/* <audio ref={audioRef} src={bipSound} /> */}
        <audio ref={audioRef}>
          <source src={bipSound} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </>
  );
};

export default QR_Scan;

const ConfirmationPopup = ({
  handleCloseModel,
  result,
  isWarn,
  isError,
  isLoading,
  qrResp,
}) => {
  console.log(isLoading);
  const userType = isWarn ? isWarn.type : result?.type;
  const [status, setStatus] = useState(
    isWarn ? "warn" : isError ? "error" : isLoading ? "loading" : "start"
  );
  const [selectedImage, setSelectedImage] = useState();
  const [isImageModel, setIsImageModel] = useState(false);

  const qrData = qrResp;
  console.log(qrResp);

  const userValidation = async (isValid) => {
    setStatus("loading");
    console.log(isValid)
    try {
      if(isValid){
        setStatus("success");
      }else{
        setStatus("failed");
      }
      const data = {
        encrypted_data: qrData.encrypted_data,
        is_valid: isValid,
        is_parking: result.is_parking,
      };
      const resp = await makeApiCall("post", "guard/uservalided", data, "raw");
      console.log(resp);
      if (resp.data.status === 1) {
        console.log(result)
        // if (userType === "pass") {
        //   if (result.is_parking === true) {
        //     if (resp.data.data.parking.is_used === true) {
        //       setStatus("success");
        //     } else if (resp.data.data.parking.is_used === false) {
        //       setStatus("failed");
        //     }
        //   } else {
        //     if (resp.data.data.is_used === true) {
        //       setStatus("success");
        //     } else if (resp.data.data.is_used === false) {
        //       setStatus("failed");
        //     }
        //   }
        // } else {
        //   if (resp.data.data.is_used === true) {
        //     setStatus("success");
        //   } else if (resp.data.data.is_used === false) {
        //     setStatus("failed");
        //   }
        // }

        // if (userType === "pass") {
        //   setStatus("success");
        // } else {
        // }
      } else {
        setStatus("warning");
        console.log(resp.data);
      }
    } catch (error) {
      setStatus("error");
      console.warn(error);
    }
  };

  return (
    <>
      <div
        className="h-screen w-screen flex items-center justify-center bg-[#000000a1] backdrop-blur-[5px] top-0 left-0 fixed z-[50]  "
        // onClick={handleCloseModel}
      >
        <div
          className={`w-[90%] text-xl h-auto min-h-[80px]  bg-white rounded-[30px] flex flex-col justify-center items-center relative`}
        >
          {status === "start" && (
            <>
              <div className={`parking w-full ${userType==="pass"?"mt-[60px]":null}`}>
                {/* <div className="top text-center mt-[60px]"> */}
                <div className="top text-center mt-4">
                  {userType === "pass" ? (
                    <div className="image bg-white absolute p-1 rounded-md h-[160px] w-[160px] top-[-70px] left-0 right-0 m-auto flex place-content-center overflow-hidden">
                      <img
                        src={
                          result?.data?.user.profile_pic
                            ? result?.data?.user.profile_pic
                            : black_user
                        }
                        onClick={
                          userType === "parking"
                            ? null
                            : () => {
                                setSelectedImage(result?.data?.user.profile_pic
                                );
                                setIsImageModel(true);
                              }
                        }
                        alt="image"
                        className="
                        object-cover rounded-md"
                      />
                    </div>
                  ) : null}
                  {/* {userType === "parking" ? (
                    <div className="image bg-white absolute p-4 rounded-full h-[100px] w-[100px] top-[-50px] left-0 right-0 m-auto flex place-content-center overflow-hidden shadow-lg">
                      <img
                        src={result.data.car_parking === true ? car : bike}
                        alt="image"
                        className=" object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="image bg-white absolute p-1 rounded-md h-[160px] w-[160px] top-[-70px] left-0 right-0 m-auto flex place-content-center overflow-hidden">
                      <img
                        src={
                          userType === "parking"
                            ? result.data.car_parking === true
                              ? car
                              : bike
                            : userType === "privilege"
                            ? result?.data?.ticket_user.profile_pic
                            : userType === "ticket"
                            ? result?.data?.ticket_user.profile_pic
                            : userType === "press"
                            ? result?.data?.user.profile_pic
                            : result?.is_parking
                            ? result.data.parking.car_parking === true
                              ? car
                              : bike
                            : userType === "pass"
                            ? result?.data?.user.profile_pic
                            : userType === "team"
                            ? result?.data?.profile_pic
                            : black_user
                        }
                        onClick={
                          userType === "parking"
                            ? null
                            : () => {
                                setSelectedImage(
                                  userType === "privilege"
                                    ? result?.data?.ticket_user.profile_pic
                                    : userType === "ticket"
                                    ? result?.data?.ticket_user.profile_pic
                                    : userType === "press"
                                    ? result?.data?.user.profile_pic
                                    : userType === "team"
                                    ? result?.data?.profile_pic
                                    : result?.data?.user.profile_pic
                                );
                                setIsImageModel(true);
                              }
                        }
                        alt="image"
                        className="
                        object-cover rounded-md"
                      />
                    </div>
                  )} */}

                  {/* <div className="number mt-[7rem]"> */}
                  <div className={`number ${userType==="pass"?"mt-[7rem]":null}`}>
                    {userType === "ticket" ? (
                      <div className="text-center w-full flex items-center justify-center mb-3">
                        <p className="text-sm bg-black text-white py-1 w-[50px] rounded-md">
                          Day {result?.data?.event?.event_day}
                        </p>
                      </div>
                    ) : userType === "parking" ? (
                      <div className="text-center w-full flex items-center justify-center mb-3">
                        <p className="text-sm bg-black text-white py-1 w-[50px] rounded-md">
                          Day {result?.data?.event?.event_day}
                        </p>
                      </div>
                    ) : null}

                    <h3 className="text-center text-2xl font-bold">
                      {userType === "privilege"
                        ? result?.data?.ticket_user.name
                        : userType === "ticket"
                        ? result?.data?.ticket_user.name
                        : userType === "team"
                        ? result?.data?.name
                        : userType === "press"
                        ? result?.data?.user?.name
                        : userType === "staff"
                        ? result?.data?.user?.name
                        : userType === "pass"
                        ? result?.is_parking
                          ? formatVehicleNumber(
                              result?.data?.parking.vehicle_number
                            )
                          : result?.data?.user.name
                        : null}
                      {/* : formatVehicleNumber(result?.data?.vehicle_number)} */}
                    </h3>

                    <h3 className="text-center text-sm font-medium">
                      {userType === "parking" ? "Alloted Slot : " : "ID : "}
                      {userType === "privilege"
                        ? result?.data?.ticket_random_id
                        : userType === "ticket"
                        ? result?.data?.ticket_random_id
                        : userType === "pass"
                        ? result?.is_parking
                          ? result?.data?.parking.parking_random_id
                          : result?.data?.pass_random_id
                        : userType === "press"
                        ? result?.data?.random_id
                        : userType === "staff"
                        ? result?.data?.random_id
                        : userType === "team"
                        ? result?.data?.random_id
                        : result?.data?.allot_slot}
                    </h3>
                    {userType === "press" ? (
                      <p>
                        {result?.data?.house_name}-{result?.data?.position}
                      </p>
                    ) : null}
                    <span className="text-sm capitalize">
                      {" "}
                      {userType === "privilege"
                        ? result?.data?.ticket_user.gender
                        : userType === "ticket"
                        ? result?.data?.ticket_user.gender
                        : userType === "team"
                        ? result?.data?.gender
                        : userType === "press"
                        ? result?.data?.user?.gender
                        : userType === "staff"
                        ? result?.data?.user?.gender
                        : userType === "pass"
                        ? result?.is_parking
                          ? null
                          : result?.data?.user.gender
                        : null}
                    </span>
                  </div>
                  <div className="parking text-center my-3 flex flex-col gap-2 items-center justify-center">
                    <span
                      className={`text-sm font-bold ${
                        result?.warning === true
                          ? "bg-yellow-200 text-yellow-600 "
                          : result?.access === true
                          ? "bg-green-400 text-green-700 "
                          : "bg-red-400 text-red-600 "
                      } text-white px-4 py-2 rounded-xl `}
                    >
                      {result?.is_confirmation === true
                        ? result?.message
                        : result?.message}
                    </span>
                  </div>
                </div>
                <hr className="w-full border-black border-dashed" />
                {/* <div className="center bg-[#F3F3F3] py-3 mt-2">
                  <div className="name text-center flex flex-col place-content-center ">
                    <h3 className="text-xl my-1">
                      {" "}
                      {userType === "privilege"
                        ? result?.data?.event?.event_name
                        : userType === "ticket"
                        ? result?.data?.event?.event_name
                        : userType === "pass"
                        ? result?.data?.season_name
                        : result?.data?.event?.event_name}
                    </h3>
                    <div className="location flex items-center justify-center gap-2">
                      {result?.data?.event ? (
                        <BsGeoAltFill className="text-sm text-gray-400" />
                      ) : null}
                      <p className="text-sm text-gray-400 my-1">
                        {result?.data?.event?.event_location}
                      </p>
                    </div>
                  </div>
                </div> */}

                {userType === "parking" ? (
                  <div className="my-3 flex items-center justify-between mx-7">
                    <div className="par1">
                      <p className="text-gray-400 my-1 text-sm">Slot</p>
                      <p className="text-sm">{result?.data?.allot_slot}</p>
                    </div>
                    <div className="par1">
                      <p className="text-gray-400 my-1 text-sm">Parking Name</p>
                      <p
                        style={{
                          backgroundColor: `#${result?.data?.color_code.slice(
                            4
                          )}`,
                        }}
                        className="text-sm px-4 py-1 rounded-full text-white"
                      >
                        {result?.data?.parking_name}
                      </p>
                    </div>
                  </div>
                ) : userType === "pass" ? (
                  <>
                    <div className="my-3 flex items-end justify-between mx-7">
                      <div className="par1">
                        <p className="text-gray-400 my-1 text-sm">
                          {result?.is_parking ? "Parking" : "Zone"}
                        </p>
                        {result?.is_parking ? (
                          <p
                            style={{
                              backgroundColor: `#${result?.data?.parking?.color_code.slice(
                                4
                              )}`,
                            }}
                            className="text-sm text-white px-3 py-1 rounded-full"
                          >
                            {result?.data?.parking?.parking_name}
                          </p>
                        ) : (
                          <p
                            style={{
                              backgroundColor: `#${result?.data?.zone?.color_code.slice(
                                4
                              )}`,
                            }}
                            className="text-sm text-white px-3 py-1 rounded-full"
                          >
                            {result?.data?.zone?.zone_name}
                          </p>
                        )}
                      </div>
                      {userType === "pass"
                        ? result?.is_parking
                          ? result?.data?.parking?.allot_slot
                          : null
                        : null}
                    </div>
                    {result.data.mentor_list?.length > 0 ? (
                      <>
                        <div className="px-4 w-full flex items-center justify-start gap-2 pt-2">
                          <p className="text-md font-medium">Mentors</p>
                          <MdClose />
                          <p className="text-sm bg-black text-white px-2 py-0.5 rounded-full">
                            {result.data.mentor_list?.length}
                          </p>
                        </div>
                        <div className=" w-full max-h-44 overflow-y-auto  h-auto px-4 py-2">
                          <div className=" w-full h-full">
                            {result.data.mentor_list.map((mentor, i) => {
                              return (
                                <div
                                  key={i}
                                  className="flex items-center mt-2 border border-black p-2 rounded-md"
                                >
                                  <div className="image ">
                                    <img
                                      src={
                                        mentor.profile_pic
                                          ? mentor.profile_pic
                                          : black_image
                                      }
                                      onClick={
                                        userType === "parking"
                                          ? null
                                          : () => {
                                              setSelectedImage(
                                                mentor.profile_pic
                                                  ? mentor.profile_pic
                                                  : black_image
                                              );
                                              setIsImageModel(true);
                                            }
                                      }
                                      alt="image"
                                      className=" h-16 w-16 rounded-full object-cover"
                                    />
                                  </div>
                                  <div className="ms-4">
                                    <p className="font-medium text-sm capitalize">
                                      {mentor.name}
                                    </p>
                                    {/* <p className="text-sm">Age : -</p> */}
                                    <p className="text-sm">
                                      Gender : {mentor.gender}
                                    </p>
                                    <p className="text-sm capitalize">
                                      Phone No : {mentor.phone_number}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </>
                ) : (
                  <div className="my-3 flex items-center justify-between mx-7">
                    <div className="par1">
                      <p className="text-gray-400 my-1 text-sm">
                        {result?.data?.zone ? "Zone" : null}
                      </p>
                      <p
                        style={{
                          backgroundColor: `#${result?.data?.zone?.color_code.slice(
                            4
                          )}`,
                        }}
                        className="text-sm text-white px-3 py-1 rounded-full"
                      >
                        {result?.data?.zone?.zone_name}
                      </p>
                    </div>
                  </div>
                )}
                <div className="button flex items-center w-full gap-3 p-5">
                  {result?.is_confirmation === true ? (
                    <>
                      <button
                        className="bg-[#13B841] text-white w-full p-4 rounded-full text-sm font-medium"
                        onClick={() => userValidation(true)}
                      >
                        Confirm
                      </button>
                      <button
                        className="bg-[#FE385C] text-white w-full p-4 rounded-full text-sm font-medium"
                        onClick={() => userValidation(false)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-black text-white w-full p-4 rounded-full text-sm font-medium"
                      onClick={handleCloseModel}
                    >
                      Okay
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {status === "loading" && (
            <svg
              aria-hidden="true"
              className="inline w-14 h-14 mr-2 text-primary animate-spin dark:text-primary fill-gray-400 dark:fill-gray-400"
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
          )}

          {status === "success" && (
            <div className="parking w-full ">
              <div className="top text-center ">
                <div className="image bg-[#13B841] p-2 border-4 border-white rounded-full absolute h-[90px] w-[90px] top-[-45px] left-0 right-0 m-auto flex place-content-center ">
                  <FiCheck className="h-10 w-10 text-white m-auto" />
                </div>
                <div className="number mt-16">
                  <h3 className="text-center text-[#13B841] text-3xl font-medium">
                    Check In Successfull
                  </h3>
                </div>
                <div className="parking text-center my-5 flex items-center justify-center">
                  <p className="text-lg text-gray-400 rounded-full px-10 ">
                    Your Ticket Check-In Successfully Completed
                  </p>
                </div>
              </div>
              <div className="button w-full gap-3 py-5 px-20">
                <button
                  className="bg-[#13B841] text-white w-full p-4 rounded-full text-sm font-medium"
                  onClick={handleCloseModel}
                >
                  Ok
                </button>
              </div>
            </div>
          )}

          {status === "failed" && (
            <div className="parking w-full ">
              <div className="top text-center ">
                <div className="image bg-[#F6C6CF] p-2 border-4 border-white rounded-full absolute h-[90px] w-[90px] top-[-45px] left-0 right-0 m-auto flex place-content-center ">
                  <GoAlertFill className="h-10 w-10 text-primary m-auto" />
                </div>
                <div className="number mt-16">
                  <h3 className="text-center text-primary text-3xl font-medium">
                    Check In Rejected
                  </h3>
                </div>
                <div className="parking text-center my-5 flex items-center justify-center">
                  <p className="text-lg text-gray-400 rounded-full ">
                    Your Ticket Check-In Failed
                  </p>
                </div>
              </div>
              <div className="button w-full gap-3 py-5 px-20">
                <button
                  className="bg-[#FE385C] text-white w-full p-4 rounded-full text-sm font-medium"
                  onClick={handleCloseModel}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {status === "warn" && (
            <>
              <div className="parking w-full ">
                <div className="top text-center ">
                  {/* {userType === "parking" ? (
                    <div className="image bg-white absolute p-4 rounded-full h-[100px] w-[100px] top-[-50px] left-0 right-0 m-auto flex place-content-center overflow-hidden shadow-lg">
                      <img
                        src={isWarn.data.car_parking === true ? car : bike}
                        alt="image"
                        className=" object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="image bg-white absolute p-1 rounded-md h-[160px] w-[160px] top-[-70px] left-0 right-0 m-auto flex place-content-center overflow-hidden">
                      <img
                        src={
                          userType === "parking"
                            ? isWarn.data.car_parking === true
                              ? car
                              : bike
                            : userType === "privilege"
                            ? isWarn?.data?.ticket_user.profile_pic
                            : userType === "ticket"
                            ? isWarn?.data?.ticket_user.profile_pic
                            : isWarn?.is_parking
                            ? isWarn.data.parking.car_parking === true
                              ? car
                              : bike
                            : userType === "pass"
                            ? isWarn?.data?.user.profile_pic
                            : black_user
                        }
                        onClick={
                          userType === "parking"
                            ? null
                            : () => {
                                setSelectedImage(
                                  userType === "privilege"
                                    ? isWarn?.data?.ticket_user.profile_pic
                                    : userType === "ticket"
                                    ? isWarn?.data?.ticket_user.profile_pic
                                    : isWarn?.data?.user.profile_pic
                                );
                                setIsImageModel(true);
                              }
                        }
                        alt="image"
                        className="
                        object-cover rounded-md"
                      />
                    </div>
                  )} */}
                  {/* <div className="image bg-white p-3 rounded-full absolute h-[120px] w-[120px] top-[-60px] left-0 right-0 m-auto flex place-content-center overflow-hidden">
                    <img
                      src={
                        userType === "parking"
                          ? isWarn.data.car_parking === true
                            ? car
                            : bike
                          : userType === "privilege"
                          ? isWarn?.data?.ticket_user.profile_pic
                          : userType === "ticket"
                          ? isWarn?.data?.ticket_user.profile_pic
                          : isWarn?.is_parking
                          ? isWarn.data.parking.car_parking === true
                            ? car
                            : bike
                          : isWarn?.data?.user.profile_pic
                      }
                      onClick={
                        userType === "parking"
                          ? null
                          : () => {
                              setSelectedImage(
                                userType === "privilege"
                                  ? isWarn?.data?.ticket_user.profile_pic
                                  : userType === "ticket"
                                  ? isWarn?.data?.ticket_user.profile_pic
                                  : isWarn?.data?.user.profile_pic
                              );
                              setIsImageModel(true);
                            }
                      }
                      alt="image"
                      className="object-cover rounded-full"
                    />
                  </div> */}
                  <div className="w-full text-black flex items-center justify-end px-5 pt-5 text-2xl">
                    <MdClose onClick={handleCloseModel} />
                  </div>
                  <div className="number mt-7">
                    <h3 className="text-center text-2xl font-bold">
                      {userType === "privilege"
                        ? isWarn?.data?.ticket_user.name
                        : userType === "ticket"
                        ? isWarn?.data?.ticket_user.name
                        : userType === "pass"
                        ? isWarn?.is_parking
                          ? formatVehicleNumber(
                              isWarn?.data?.parking.vehicle_number
                            )
                          : isWarn?.data?.user.name
                        : null}
                    </h3>
                    <h3 className="text-center text-sm font-medium">
                      {userType === "parking" ? "Alloted Slot : " : "ID : "}
                      {userType === "privilege"
                        ? isWarn?.data?.ticket_random_id
                        : userType === "ticket"
                        ? isWarn?.data?.ticket_random_id
                        : userType === "pass"
                        ? isWarn?.is_parking
                          ? isWarn?.data?.parking.parking_random_id
                          : isWarn?.data?.pass_random_id
                        : isWarn?.data?.allot_slot}
                    </h3>
                  </div>
                  <div className="parking text-center my-3 flex flex-col gap-2 items-center justify-center">
                    {/* <p className="text-primary text-sm bg-[#FFDEE4] rounded-full px-5 py-2 capitalize">
                      {userType} User
                    </p> */}
                    <span
                      className={`text-sm font-bold bg-yellow-200 text-yellow-600 px-4 py-2 rounded-xl `}
                    >
                      {isWarn.message}
                    </span>
                  </div>
                </div>
                <div className="center bg-[#F3F3F3] py-3 mt-2">
                  <div className="name text-center flex flex-col place-content-center ">
                    <h3 className="text-xl my-1">
                      {" "}
                      {userType === "privilege"
                        ? isWarn?.data?.event?.event_name
                        : userType === "ticket"
                        ? isWarn?.data?.event?.event_name
                        : userType === "pass"
                        ? isWarn?.data?.season_name
                        : isWarn?.data?.event?.event_name}
                    </h3>
                    <div className="location flex items-center justify-center gap-2">
                      <p className="flex items-center">
                        {isWarn?.data?.event ? (
                          <BsGeoAltFill className="text-sm text-gray-400" />
                        ) : null}{" "}
                      </p>
                      <p className="text-sm text-gray-400 my-1">
                        {isWarn?.data?.event?.event_location}
                      </p>
                    </div>
                  </div>
                </div>

                {userType === "parking" ? (
                  <div className="my-3 flex items-center justify-between mx-7">
                    <div className="par1">
                      <p className="text-gray-400 my-1 text-sm">Slot</p>
                      <p className="text-sm">{isWarn?.data?.allot_slot}</p>
                    </div>
                    <div className="par1">
                      <p className="text-gray-400 my-1 text-sm">Parking Name</p>
                      <p
                        style={{
                          backgroundColor: `#${isWarn?.data?.color_code.slice(
                            4
                          )}`,
                        }}
                        className="text-sm px-4 py-1 rounded-full text-white"
                      >
                        {isWarn?.data?.parking_name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="my-3 flex items-center justify-between mx-7">
                    <div className="par1">
                      <p className="text-gray-400 my-1 text-sm">
                        {isWarn?.data?.zone ? "Zone" : null}
                      </p>
                      <p
                        style={{
                          backgroundColor: `#${isWarn?.data?.zone.color_code.slice(
                            4
                          )}`,
                        }}
                        className="text-sm text-white px-3 py-1 rounded-full"
                      >
                        {isWarn?.data?.zone?.zone_name}
                      </p>
                    </div>
                  </div>
                )}
                <div className="button flex items-center w-full gap-3 p-5">
                  {isWarn.is_confirmation === true ? (
                    <>
                      <button
                        className="bg-[#13B841] text-white w-full p-4 rounded-full text-sm font-medium"
                        onClick={() => userValidation(true)}
                      >
                        Confirm
                      </button>
                      <button
                        className="bg-[#FE385C] text-white w-full p-4 rounded-full text-sm font-medium"
                        onClick={() => userValidation(false)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-black text-white w-full p-4 rounded-full text-sm font-medium"
                      onClick={handleCloseModel}
                    >
                      Okay
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {status === "error" && <p>Something is wrong !</p>}
        </div>
      </div>
      {isImageModel ? (
        <ImageModel
          src={selectedImage ? selectedImage : black_user}
          handleClose={() => setIsImageModel(false)}
        />
      ) : null}
    </>
  );
};

//9537701658
