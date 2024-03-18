import React, { useEffect, useState } from "react";
import MyPassImage from "../../assets/mypass.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import QRCode from "react-qr-code";
import { useQuery } from "react-query";
import { makeApiCall } from "../../api/Post";
import { useNavigate } from "react-router-dom";

const MyPass = () => {

const [userDetails, setUserDetails] = useState();
const [userID,setUserID]=useState();
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await makeApiCall(
      "get",
      "user/info/",
      null,
      "raw"
    );
    return response;
  };

  const { isLoading, error, data } = useQuery("classOwnerData", fetchData);

  useEffect(() => {
    if (isLoading === false) {
      console.log(data.data.data);
      setUserDetails(data.data.data);
      setUserID(data.data.data._id)
    }
  }, [isLoading]);


  return (
    <>
      <div className="ticketConfirmationPage p-4 bg-black rounded-t-3xl md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        {/* <div className="titleTicketText flex items-center pt-5">
          <Link to={"/role/superadmin"}>
            <div className="bg-white h-[35px] w-[35px] rounded-full flex items-center justify-center">
              <BsChevronLeft className="text-xl" />
            </div>
          </Link>
          <h1 className="text-xl font-semibold text-white ms-5">
            Get A Ticket
          </h1>
        </div> */}
        <div className="ticket bg-white pb-5 rounded-3xl mt-5 mb-20">
          <div className="ticketSection pb-0">
            <div className="userImage mx-7 pt-4">
              <div className="image h-56 flex justify-cente rounded-3xl">
                <Swiper
                  pagination={true}
                  modules={[Pagination]}
                  className="mySwiper mt-2 rounded-2xl"
                >
                  <SwiperSlide>
                    <img
                      src={MyPassImage}
                      alt="image"
                      className="w-full h-48"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src={MyPassImage}
                      alt="image"
                      className="w-full h-48"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src={MyPassImage}
                      alt="image"
                      className="w-full h-48"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
              <div className="grid grid-cols-2 name-address items-center">
                <div className="name">
                  <h1 className="text-xl font-bold">Darshan Raval</h1>
                </div>
                <div className="playerPass bg-[#13B841] ms-auto py-2 px-4 rounded-full">
                  <p className="text-white text-sm">Entry Pass</p>
                </div>
              </div>

              <div className="grid grid-cols-2 name-address items-center mt-3">
                <div className="name">
                  <h1 className="text-sm text-gray-400 font-medium">Name</h1>
                  <h1 className="text-lg font-medium">{userDetails?.name}</h1>
                </div>
                <div className="zone text-right">
                  <h1 className="text-sm text-gray-400 font-medium">Zone</h1>
                  <h1 className="text-lg font-medium">Z1</h1>
                </div>
              </div>

              <div className="grid grid-cols-2 name-address items-center mt-3">
                <div className="garbaClass">
                  <h1 className="text-sm text-gray-400 font-medium">
                    Garba class name
                  </h1>
                  <h1 className="text-lg font-medium">Sai garba class</h1>
                </div>
                <div className="gate text-right">
                  <h1 className="text-sm text-gray-400 font-medium">
                    Gate No.
                  </h1>
                  <h1 className="text-lg font-medium">101</h1>
                </div>
              </div>

              <div className="grid grid-cols-2 name-address items-center mt-3">
                <div className="place">
                  <h1 className="text-sm text-gray-400 font-medium">Place</h1>
                  <h1 className="text-lg font-medium">Sarsana Dome, Surat</h1>
                </div>
                <div className="time text-right">
                  <h1 className="text-sm text-gray-400 font-medium">Time</h1>
                  <h1 className="text-lg font-medium">06:00 PM</h1>
                </div>
              </div>

              <div className="grid grid-cols-2 name-address items-center mt-3">
                <div className="place">
                  <h1 className="text-sm text-gray-400 font-medium">From</h1>
                  <h1 className="text-lg font-medium">20 Oct, 2023</h1>
                </div>
                <div className="time text-right">
                  <h1 className="text-sm text-gray-400 font-medium">To</h1>
                  <h1 className="text-lg font-medium">29 Oct, 2023</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="left bg-black h-9 w-9 rounded-full absolute left-0"></div>
          <div className="right bg-black h-9 w-9 rounded-full absolute right-0"></div>
          <div className="borderTicket mt-4 border-t-2 border-dashed border-black "></div>

          <div className="ticketSection p-8">
            <div className="grid grid-cols-2 border border-black rounded-3xl p-3 items-center justify-center">
              <div className="qrArea">
                <div className="text">
                  <p>scan this QR code or show ths ticket at of concert</p>
                </div>
                <div className="ticketID border-2 border-gray-400 rounded-full p-1 mt-3">
                  <p className="text-center">ID: 202244966</p>
                </div>
              </div>
              <div className="qrCode flex items-center justify-center">
                <div
                  style={{
                    height: "auto",
                    margin: "0 auto",
                    maxWidth: 100,
                    width: "100%",
                  }}
                >
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={"userID"}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPass;
