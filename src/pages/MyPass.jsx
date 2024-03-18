import React, { useEffect, useState } from "react";
import MyPassImage from "../assets/mypass.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import QRCode from "react-qr-code";
import { useQuery } from "react-query";
import { makeApiCall } from "../api/Post";
import { useNavigate } from "react-router-dom";
import { EffectFlip, Navigation } from "swiper/modules";
import swipe_black from "../assets/swipe-black.svg";

const MyPass = () => {
  const [userDetails, setUserDetails] = useState();
  const [userID, setUserID] = useState();

  const [qrDetails, setQrDetails] = useState(
    //ticket
    //un-used
    // {encrypted_data: 'RoX+T3/MLwGbDN4CsrDvxM4Q8NXTeU7wDOFTyAOnBe3DLNWtJ5…zdQHB88si5ZxU9KGrX65YkfQZqfN9EUkNcKL2Xkt5oxQ8yVdf'}

    //used
    // {"encrypted_data":"RoX+T3/MLwGbDN4CsrDvxNqTEHrJrl7UF31HmgNP3PCauB7qo4YVmA1t1BbjdnGJFJhjMnK+e3emt2Xcywpjdu8Im20Vsc3ztDSkAgbZmVbOkrRMIs6vrZ2v72Lk//2vPWV/KkFCJpg9gCEWYHbEOfa3gXpPsRN90W+/QfdKTLHyIDqX256yx8repA7+BMfh"}

    //pass_user
    // {"encrypted_data":"h8voQKKwYpxi7cHRTfD4oZ9t8G372xSuOp2DvWk3tp4zyErJ0g0ZugsgnYM7vBI6/O9rqsWbgGGVNlIk5+M/lL09jozBNmCJYkUk2p0moF1wywX8trS/g4zdoTQsv+/VpPbVeXJuWM/ZyexU014clsp7n7G/L/c0mX6h7or7myI="}

    //parking
    // {"encrypted_data":"VnOlORQvELw8oCh4rQ4GgawxtggzvK3AtA2MuLQsgpD378n4WsntFOIuxYbP9N+DGm9u5P+aMcs2DTz59ukkSQEFyv6xrGsTi/c+MQQKrPYOhsn9H0wUQxyusVdq4XsMBBXGwFZ+24Q7jZo87Von920eqPj5wzu7Dgixn+wesZEvjvNJ3S6eRqUmCyhRd5bc"}

    //privilege
    // {
    //   encrypteddata:
    //     "9XCG+RAN3yUQst+bk23u+p84eHVLuXyGTczQG6vkm3JmfktpxlA+DiRM103RgSYgm6jLxGxvqZfAUGeeknAXpuJ5ak8xR/F9Dgww//09xT0gjWKY6OMaFbixmmRC9ifBb9cnBnIfZge4gF7YyIgELjp+8Cq/HiI4X98i/pOBAlc4A+cZbY9ejhdhmobd2kKc",
    // },
    {
      _id: "6515204f0cf53e8723ba57b3",
      gsqrcode:
        "7fc5mC0n5/KywVX7inFOVBXFfGruYuLbJFMewU+xJrfwMZ5YyCo9dfSE1WP8zQg+uWqtfVOG9pNHvjnJnMlu5g==",
    }
  );
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await makeApiCall("get", "user/info/", null, "raw");
    return response;
  };

  const { isLoading, error, data } = useQuery("classOwnerData", fetchData);

  useEffect(() => {
    if (isLoading === false) {
      console.log(data);
      setUserDetails(data.data.data);
      setUserID(data.data.data._id);
    }
  }, [isLoading]);

  console.log(userDetails);

  return (
    <>
      {/* <div className="ticketConfirmationPage p-4 bg-black rounded-t-3xl relative mx-auto max-w-[768px] ">
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
          <div className="borderTicket mt-4 border-t-2 border-dashed border-black"></div>

          <div className="ticketSection p-8">
            <div className="grid grid-cols-2 border border-black rounded-3xl p-3 items-center justify-center">
              <div className="qrArea hidden">
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
                    maxWidth: 220,
                    width: "100%",
                  }}
                >
                  <QRCode
                    size={256}
                    style={{
                      height: "auto",
                      maxWidth: "100%",
                      width: "100%",
                    }}
                    value={JSON.stringify(qrDetails)}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="h-screen  bg-black rounded-t-[30px] mt-4">
        <p className="text-white text-xl text-center pt-14">View Pass</p>
        <div className="swiperTicket max-w-[450px] mx-auto">
          <Swiper
            effect={"flip"}
            grabCursor={true}
            loop={true}
            modules={[EffectFlip, Navigation]}
            className="mySwiper h-full py-14 mx-5 "
          >
            <SwiperSlide className="h-auto ">
              <div className="h-[500px] bg-white rounded-3xl relative ">
                <div
                  className="top bg-black h-8 w-8 rounded-full absolute ms-auto me-auto left-0 right-0 "
                  style={{ top: "-15px" }}
                ></div>
                <div
                  className="bottom bg-black h-8 w-8 rounded-full absolute bottom-0 ms-auto me-auto left-0 right-0"
                  style={{ bottom: "-15px" }}
                ></div>
                <div className="h-auto p-2">
                  <div className="image overflow-hidden flex justify-center items-center m-4">
                    <img
                      src={userDetails?.profile_pic}
                      alt="image"
                      className="h-24 w-24 rounded-full border border-gray-400"
                    />
                  </div>
                  <div className="flex items-center my-2 mx-5">
                    <h3 className="text-center text-xl">Darshan Raval</h3>
                    <h3 className="text-center text-white text-sm ms-auto bg-[#13B841] py-1 px-3 rounded-full">
                      Entry Pass
                    </h3>
                  </div>
                </div>
                <div className="border-t-2 border-dotted border-[#111314]"></div>
                <div className="sofaInfo px-5 my-4 flex justify-between">
                  <div className="zone w-auto">
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="">{userDetails?.name}</p>
                  </div>
                  <div className="zone w-auto text-end">
                    <p className="text-sm text-gray-400">Zone</p>
                    <p className="">Z01</p>
                  </div>
                </div>
                <div className="info px-5 my-3 flex items-center justify-between">
                  <div className="date text-start">
                    <p className=" text-sm text-gray-400">Garba Class Name</p>
                    <p className=" ">Surat Garba Class</p>
                  </div>
                  <div className="date text-end">
                    <p className="text-sm text-gray-400">Gate No.</p>
                    <p className="">101</p>
                  </div>
                </div>
                <div className="info px-5 my-3 flex items-center justify-between">
                  <div className="date text-start">
                    <p className="text-sm text-gray-400">Place</p>
                    <p className=" ">Sarsana Dome,Surat</p>
                  </div>
                  <div className="date text-end">
                    <p className="text-sm text-gray-400">Time</p>
                    <p className="">06:00 PM</p>
                  </div>
                </div>
                <div className="info px-5 my-3 flex items-center justify-between">
                  <div className="date text-start">
                    <p className="text-sm text-gray-400">From</p>
                    <p className="">20 Oct, 2023</p>
                  </div>
                  <div className="date text-end">
                    <p className=" text-sm text-gray-400">To</p>
                    <p className="">29 Oct, 2023</p>
                  </div>
                </div>
                <div className="image px-5 py-5 flex justify-center items-center">
                  <img src={swipe_black} alt="image" className="w-5" />
                  <p className=" text-sm mx-2">Swipe to scan your QR code</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="h-full">
              <div className="h-[500px] bg-white rounded-3xl">
                <div
                  className="top bg-black h-8 w-8 rounded-full absolute ms-auto me-auto left-0 right-0"
                  style={{ top: "-15px" }}
                ></div>
                <div
                  className="bottom bg-black h-8 w-8 rounded-full absolute bottom-0 ms-auto me-auto left-0 right-0"
                  style={{ bottom: "-15px" }}
                ></div>
                <div className="h-auto pt-14">
                  <div className="qrCode flex items-center justify-center p-2">
                    <div
                      style={{
                        height: "auto",
                        margin: "0 auto",
                        maxWidth: 220,
                        width: "100%",
                      }}
                      className="bg-white p-4 rounded-2xl border border-gray-400"
                    >
                      <QRCode
                        size={256}
                        style={{
                          height: "100%",
                          maxWidth: "100%",
                          width: "100%",
                        }}
                        value={JSON.stringify(qrDetails)}
                        viewBox={`0 0 256 256`}
                      />
                    </div>
                  </div>
                  <div className="image px-5 py-5 flex justify-center items-center">
                    <p className="text-center text-xl mx-2">
                      Scan this QR code or show this ticket at of concert
                    </p>
                  </div>
                  <div className="image px-5 py-5 flex justify-center items-center">
                    <img src={swipe_black} alt="image" className="w-5" />
                    <p className="text-sm mx-2">Swipe to scan your QR code</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default MyPass;
