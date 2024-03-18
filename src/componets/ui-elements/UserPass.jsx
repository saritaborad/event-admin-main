import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import defaultUserImage from "../../../assets/blank_user.svg";
import QRCode from "react-qr-code";
import logo from "../../../assets/newLogo.svg";
import { EffectFlip, Navigation } from "swiper/modules";
import swipe_icone from "../../../assets/swipe-icone.svg";

const UserPass = () => {
  return (
    <div className="h-screen bg-black rounded-[30px] mt-4">
      <p className="text-white text-xl text-center pt-10">View Ticket</p>
      <div className="swiperTicket">
        <Swiper
          effect={"flip"}
          grabCursor={true}
          loop={true}
          modules={[EffectFlip, Navigation]}
          className="mySwiper h-full py-10 mx-5"
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
                    src={defaultUserImage}
                    alt="image"
                    className={`h-24 w-24 rounded-full border p-1`}
                  />
                </div>
                <div className="nam my-5">
                  <h3 className="text-center text-white text-xl">Hari Patel</h3>
                </div>
              </div>
              <div className="border-t-2 border-dotted border-[#111314]"></div>
              <div className="sofaInfo px-5 my-7 flex justify-between">
                <div className="zone flex w-auto">
                  <p className="text-white text-sm py-1 px-2 bg-[#000000] rounded-l-lg">
                    ZONE
                  </p>
                  <p className={`text-white text-sm py-1 px-2 rounded-r-lg`}>
                    M01
                  </p>
                </div>
                <div className="zone flex w-auto">
                  <p className="text-white text-sm py-1 px-2 bg-[#000000] rounded-l-lg">
                    SEAT NO.
                  </p>
                  <p className={`text-white text-sm py-1 px-3 rounded-r-lg`}>
                    11
                  </p>
                </div>
              </div>
              <div className="info px-5 my-5 flex items-center justify-between">
                <div className="date text-start">
                  <p className=" text-[#FFFFFF80]">DATE</p>
                  <p className="text-white">02 Jan, 2023</p>
                </div>
                <div className="date text-end">
                  <p className="text-[#FFFFFF80]">POSITION</p>
                  <p className="text-white">Left</p>
                </div>
              </div>
              <div className="gender px-5 py-2">
                <div className="date text-start flex">
                  <p className="text-[#FFFFFF80]">GENDER : </p>
                  <p className="text-white mx-2">Male</p>
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
                <div className="image overflow-hidden flex justify-center items-center my-3">
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

export default UserPass;
