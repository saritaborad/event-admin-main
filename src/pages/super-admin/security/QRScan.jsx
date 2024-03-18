import React, { useEffect, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { IoMdCloseCircle } from "react-icons/io";
import { AiOutlineRight } from "react-icons/ai";
import flashImage from "../../../assets/flashlights.svg";
import { Link } from "react-router-dom";
import scan_animation from "../../../assets/scan-anim.json";
import Lottie from "lottie-react"; 

const QRScan = () => {
  const [scanResult, setScanResult] = useState();

  useEffect(() => {
    let selectedDeviceId;
    const codeReader = new BrowserMultiFormatReader();
    console.log("ZXing code reader initialized");

    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        const sourceSelect = document.getElementById("sourceSelect");
        console.log(videoInputDevices);
        selectedDeviceId = videoInputDevices[1].deviceId;

        // document.getElementById("startButton").addEventListener("click", () => {
          codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            "video",
            (result, err) => {
              if (result) {
                console.log(result);
                setScanResult(result);
                document.getElementById("result").textContent = result.text;
              }
              if (err && !(err instanceof NotFoundException)) {
                console.error(err);
                document.getElementById("result").textContent = err;
              }
            }
          );
          console.log(
            `Started continuous decode from camera with id ${selectedDeviceId}`
          );
        // });

        document.getElementById("closeButton").addEventListener("click", () => {
          codeReader.reset();
          document.getElementById("result").textContent = "";
          console.log("Reset.");
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <div className="ticketConfirmationPage bg-black h-auto py-5 px-5 pt-10" >
        <div className="QRTitle flex">
          <div className="titleTicketText">
            <h1 className="text-xl font-semibold text-white">Scan QR Code</h1>
          </div>
          <Link to={"/role/superadmin"} className="ms-auto">
            <div className="closeButton ms-auto" id="closeButton">
              <IoMdCloseCircle className="text-3xl text-gray-400" />
            </div>
          </Link>
        </div>

        <section className="container" id="demo-content">
          {/* <div className="flex items-center gap-2.5 justify-center mb-2.5 mt-5">
            <button
              className="button bg-white text-black px-4 py-2 rounded-lg"
              id="startButton"
            >
              Start
            </button>
            <button
              className="button bg-white text-black px-4 py-2 rounded-lg"
              id="resetButton"
            >
              Reset
            </button>
          </div> */}

          <div className="scanCon border-2 border-[#3EABFB] rounded-3xl my-10 flex justify-center items-center relative overflow-hidden">
            <Lottie animationData={scan_animation} className="absolute" />
            <video id="video" className="scanWindow h-72"></video>
            {/* <div className="scanAnimation">
              <Player
                autoplay
                loop
                src={scanAnimation}
                style={{ height: "100%" }}
              ></Player>
            </div> */}
          </div>

          <p className="scanNotice text-white text-center bg-red-500 rounded-full p-2.5">
            Please align the QR within the scanner
          </p>
          {/* <p className="text-white mt-2">Result:</p> */}

          <div className="text-black text-center bg-gray-400 rounded-xl my-2">
            {/* <a id="result" href={scanResult}></a> */}
            <p className="p-2">{scanResult}</p>
          </div>

        </section>

        <div className="flashLight flex justify-center mt-5">
          <div className="flashImage bg-gray-600 p-2 rounded-full">
            <img src={flashImage} alt="image" />
          </div>
        </div>

        <div className="info bg-white pb-5 rounded-3xl mt-10 mb-24">
          <div className="gateText p-10 text-center">
            <h1 className="text-2xl">
              Gate No : <span className="text-2xl font-bold">101</span>
            </h1>
          </div>

          <Link to={"#"}>
            <div className="rescanButton bg-black mx-16 py-3 px-5 flex justify-between items-center rounded-full">
              <p className="text-white font-medium">Show Pass</p>
              <AiOutlineRight className="text-white" />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default QRScan;

