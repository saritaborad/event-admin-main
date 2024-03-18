import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useZxing } from "react-zxing";
import { Link, useNavigate } from "react-router-dom";
import scan_animation from "../../../assets/scan-anim.json";
import Lottie from "lottie-react";
import bipSound from "../../../assets/audio/bipSound.mp3";
import { makeApiCall } from "../../../api/Post";
import { useQuery } from "react-query";
import { encodedData, filterByProperty } from "../../../utils/CommonFunctions";

const QRScaner = () => {
  const [result, setResult] = useState();
  const [qrResp, setQrResp] = useState();
  const [isError, setIsError] = useState();
  const [isWarn, setIsWarn] = useState();
  const [paused, setPaused] = useState(false);
  const [qrCodes, setQRCodes] = useState();
  const [groundStaff, setGroundStaff] = useState();

  const [isModel, setIsModel] = useState(false);
  const audioRef = React.createRef();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await makeApiCall("get", "user/gsqr", null, "raw");
      const groundStaffResponse = await makeApiCall(
        "get",
        "user/allgroundstaff",
        null,
        "raw"
      );

      if (response.data.status === 1 || groundStaffResponse.data.status === 1) {
        console.log(response.data.data);
        console.log(groundStaffResponse.data.data);
        setGroundStaff(groundStaffResponse.data.data);
        setQRCodes(response.data.data);
      } else {
        console.warn("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const { data, isLoading, error } = useQuery("data", fetchData);

  const varifyQR = (id) => {
    const filterQr = filterByProperty(qrCodes, "gsqrcode", id);
    console.log(qrCodes);
    console.log(filterQr);
    const qr_id = filterQr[0].gsqrcode;
    const findUser = filterByProperty(groundStaff, "gsqrcode", qr_id);

    if (filterQr.length > 0) {
      const gsqrcode = encodedData(findUser[0].gsqrcode);
      console.log(gsqrcode);
      navigate(`/role/superadmin/physicalqr/active-staff/${gsqrcode}`);
      // alert("QR verify successfully")
    } else {
      alert("QR not found");
    }
  };

  const { ref } = useZxing({
    paused,
    onDecodeResult(result) {
      console.log(JSON.parse(result));
      setQrResp(JSON.parse(result));
      varifyQR(JSON.parse(result).encrypted_data);
    },
    onDecodeError(error) {
      console.log(error);
    },
    onError(error) {
      console.error(error);
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {/* <video ref={ref} className=" h-full md:w-[87%] w-full object-cover absolute " /> */}
      <div className="ticketConfirmationPage bg-black  pt-5  h-screen flex flex-col items-center justify-between absolute md:w-[87%] w-full">
        <div className="QRTitle flex px-5 w-full">
          <div className="titleTicketText">
            <h1 className="text-xl font-semibold text-white">Scan QR Code</h1>
          </div>
          <Link to={"/role/superadmin/physicalqr"} className="ms-auto">
            <div className="closeButton ms-auto" id="closeButton">
              <IoMdCloseCircle className="text-3xl text-gray-400" />
            </div>
          </Link>
        </div>

        <section className="container px-5 contents" id="demo-content">
          <div className="scanCon border-2 border-[#3EABFB] rounded-3xl my-10 flex justify-center items-center relative overflow-hidden w-[400px] h-[400px]">
            <Lottie
              animationData={scan_animation}
              className="absolute w-full h-full"
            />
            <video ref={ref} className="w-full " />
          </div>

          <p className="scanNotice text-white text-center rounded-full p-2.5">
            Please align the QR within the scanner
          </p>
        </section>

        <audio ref={audioRef} src={bipSound} />
      </div>
    </>
  );
};

export default QRScaner;
