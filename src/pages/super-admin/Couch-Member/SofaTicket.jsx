import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import defaultUserImage from "../../../assets/blank_user.svg";
import swipe_icone from "../../../assets/swipe-icone.svg";
import QRCode from "react-qr-code";
import logo from "../../../assets/newLogo.svg";
import { useParams } from "react-router-dom";
import { makeApiCall } from "../../../api/Post";
import {
  filterByProperty,
  formatDateToDDMMMYYYY,
} from "../../../utils/CommonFunctions";
import { EffectFlip, Navigation } from "swiper/modules";

const SofaTicket = () => {
  const [ticket, setTicket] = useState();
  const [singleUser, setSingleUser] = useState();
  const [sofa, setSofa] = useState();

  const param = useParams();
  const positionName =
    ticket?.position[0]?.toUpperCase() + ticket?.position.slice(1);
  const formatedDate = formatDateToDDMMMYYYY(singleUser?.createdAt);

  const getAllSeat = async () => {
    try {
      const response = await makeApiCall("get", "sofa/allmember", null, "raw");
      if (response.data.status === 1) {
        const isNotDeteled = filterByProperty(
          response.data.data,
          "is_deleted",
          false
        );
        const findUser = filterByProperty(isNotDeteled, "_id", param.userid);
        const singleUser = findUser[0];
        setSingleUser(singleUser);

        const allSofa = singleUser.sofa_member;
        const findSofa = filterByProperty(allSofa, "_id", param.id);
        setSofa(findSofa[0]);

        const findTicket = filterByProperty(
          findSofa[0].seats,
          "_id",
          param.ticketid
        );
        // console.log(allSofa);
        setTicket(findTicket[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllSeat();
  }, []);


  return (
    <div className="h-screen bg-black rounded-t-[30px] mt-4 w-full">
      <p className="text-white text-xl text-center pt-10">View Ticket</p>
      <div className="swiperTicket my-5 mx-auto md:max-w-[500px]">
        <Swiper
          effect={"flip"}
          grabCursor={true}
          loop={true}
          modules={[EffectFlip, Navigation]}
          className="mySwiper h-full py-14 mx-5"
        >
          <SwiperSlide className="h-auto">
            <div className="h-[500px] bg-[#30343E] rounded-3xl relative">
              <div
                className="top bg-black h-8 w-8 rounded-full absolute ms-auto me-auto left-0 right-0"
                style={{ top: "-15px" }}
              ></div>
              <div
                className="bottom bg-black h-8 w-8 rounded-full absolute bottom-0 ms-auto me-auto left-0 right-0"
                style={{ bottom: "-15px" }}
              ></div>
              <div className="h-auto p-2">
                <div className="image overflow-hidden flex justify-center items-center my-5">
                  <img
                    src={singleUser?.profile_pic}
                    alt="image"
                    className={`h-24 w-24 rounded-full border p-1 ${
                      ticket?.main_section === "M01"
                        ? "border-[#56A6E8]"
                        : ticket?.main_section === "M02"
                        ? "border-[#F3AB3E]"
                        : "border-[#FF4F6E]"
                    }`}
                  />
                </div>
                <div className="nam my-5">
                  <h3 className="text-center text-white text-xl">
                    {singleUser?.name}
                  </h3>
                </div>
              </div>
              <div className="border-t-2 border-dotted border-[#111314]"></div>
              <div className="sofaInfo px-5 my-7 flex justify-between">
                <div className="zone flex w-auto">
                  <p className="text-white text-sm py-1 px-2 bg-[#000000] rounded-l-lg">
                    ZONE
                  </p>
                  <p
                    className={`text-white text-sm py-1 px-2 ${
                      ticket?.main_section === "M01"
                        ? "bg-[#56A6E8]"
                        : ticket?.main_section === "M02"
                        ? "bg-[#F3AB3E]"
                        : "bg-[#FF4F6E]"
                    } rounded-r-lg`}
                  >
                    {sofa?.zone?.zone_name}
                  </p>
                </div>
                <div className="zone flex w-auto">
                  <p className="text-white text-sm py-1 px-2 bg-[#000000] rounded-l-lg">
                    SEAT NO.
                  </p>
                  <p
                    className={`text-white text-sm py-1 px-3 ${
                      ticket?.main_section === "M01"
                        ? "bg-[#56A6E8]"
                        : ticket?.main_section === "M02"
                        ? "bg-[#F3AB3E]"
                        : "bg-[#FF4F6E]"
                    } rounded-r-lg`}
                  >
                    {ticket?.seat_name}
                  </p>
                </div>
              </div>
              <div className="info px-5 my-5 flex items-center justify-between">
                <div className="date text-start">
                  <p className=" text-[#FFFFFF80]">DATE</p>
                  <p className="text-white">{formatedDate}</p>
                </div>
                <div className="date text-end">
                  <p className="text-[#FFFFFF80]">POSITION</p>
                  <p className="text-white">{positionName}</p>
                </div>
              </div>
              <div className="gender px-5 py-2">
                <div className="date text-start flex">
                  <p className="text-[#FFFFFF80]">GENDER : </p>
                  <p className="text-white mx-2">{singleUser?.gender}</p>
                </div>
              </div>
              <div className="image px-5 py-5 flex justify-center items-center">
                <img src={swipe_icone} alt="image" className="w-5" />
                <p className="text-white text-sm mx-2">
                  Swipe to scan your QR code
                </p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="h-full">
            <div className="h-[500px] bg-[#30343E] rounded-3xl">
              <div
                className="top bg-black h-8 w-8 rounded-full absolute ms-auto me-auto left-0 right-0"
                style={{ top: "-15px" }}
              ></div>
              <div
                className="bottom bg-black h-8 w-8 rounded-full absolute bottom-0 ms-auto me-auto left-0 right-0"
                style={{ bottom: "-15px" }}
              ></div>
              <div className="h-auto p-2">
                <div className="image overflow-hidden flex justify-center items-center my-5">
                  <img
                    src={logo}
                    alt="image"
                    className="h-14 w-14 rounded-full "
                  />
                </div>
                <div className="qrCode flex items-center justify-center">
                  <div
                    style={{
                      height: "auto",
                      margin: "0 auto",
                      maxWidth: 200,
                      width: "100%",
                    }}
                    className="bg-white p-5 rounded-2xl"
                  >
                    <QRCode
                      size={256}
                      style={{
                        height: "100%",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      value={"verselix.com"}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                </div>
                <div className="image px-5 py-5 flex justify-center items-center">
                  <p className="text-white text-center text-xl mx-2">
                    Scan this QR code or show this ticket at of concert
                  </p>
                </div>
                <div className="image px-5 py-5 flex justify-center items-center">
                  <img src={swipe_icone} alt="image" className="w-5" />
                  <p className="text-white text-sm mx-2">
                    Swipe to scan your QR code
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default SofaTicket;
