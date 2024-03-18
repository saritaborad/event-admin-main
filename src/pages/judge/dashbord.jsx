import React, { useEffect, useState } from "react";
import blank_user from "../../assets/blank_user.svg";
import { makeApiCall } from "../../api/Post";
import { useQuery } from "react-query";
import { BsBellFill, BsChevronRight } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import JudgeEventCard from "../../componets/ui-elements/JudgeEventCard";
import raas from "../../assets/raas.png";
import vector from "../../assets/vector.svg";
import BotttmNavbar from "../../componets/BotttmNavbar";
import {
  filterByProperty,
  formatDateToDDMMMYYYY,
} from "../../utils/CommonFunctions";

const JudgeDashbord = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState();
  const [userDetails, setUserDetails] = useState();

  const handleNavigate = (path) => {
    navigate("/role/judge" + path);
  };

  const fetchData = async () => {
    const response = await makeApiCall("get", "judge/getjudgeassignevent", null, "raw");
    return response;
  };

  const { isLoading, error, data } = useQuery("classOwnerData", fetchData);

  useEffect(() => {
    if (isLoading === false) {
      setUserDetails(data.data.data);
    }
  }, [isLoading]);

  console.log(userDetails);

  const JudgeDashboardData = [
    {
      id: 1,
      image: vector,
      title: "Categories",
      path: "/categories",
    },
    {
      id: 2,
      image: raas,
      title: "Logs",
      path: "/",
    },
  ];

  // console.log("userlist", userDetails?.event[0]?._id)
  return (
    <>
      <div className="judgeDashboard h-full mainBg">
        <div className="shadow-md bg-white px-6 py-4 h-auto items-center flex justify-between">
          <div className="flex items-center gap-4">
            <div className="avtar flex items-center justify-center overflow-hidden h-14 w-14 rounded-full ">
              <img
                src={
                  userDetails?.profile_pic
                    ? userDetails?.profile_pic
                    : blank_user
                }
                alt="image"
              />
            </div>
            <div>
              {userDetails ? (
                <h1 className="text-lg text-black font-semibold ">
                  {userDetails.name}
                </h1>
              ) : (
                <div className="h-[28px] bg-gray-200 rounded-sm w-full animate-pulse"></div>
              )}
              {userDetails ? (
                <h1 className="text-sm text-gray-500 font-light capitalize">
                  {userDetails.roles}
                </h1>
              ) : (
                <div className="h-[28px] bg-gray-200 rounded-sm w-full animate-pulse"></div>
              )}
            </div>
          </div>

          <Link to="/role/judge/notification-page">
            <div className="h-10 w-10 bg-black flex items-center justify-center rounded-full shadow-sm relative">
              <BsBellFill className="text-white text-xl" />
              {userDetails?.notifications?.length > 0 ? (
                <div className="bg-primary absolute h-4 w-4 rounded-full top-[-5px] right-0 flex items-center justify-center text-[10px] text-white">
                  {userDetails?.notifications?.length}
                </div>
              ) : null}
            </div>
          </Link>
        </div>

        <div className="eventCard p-[15px]">
          <div className="info">
            <div className="w-full h-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-center">

              <JudgeEventCard
                image={userDetails?.event?.[0]?.event_photo}
                date={formatDateToDDMMMYYYY(userDetails?.event?.[0]?.event_date)}
                time={userDetails?.event?.[0]?.event_time}
                name={userDetails?.event?.[0]?.event_name}
                location={userDetails?.event?.[0]?.event_location}
              />

            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 my-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {JudgeDashboardData.map((data, i) => {
                return (
                  <div
                    className="bg-white p-4 rounded-2xl mt-3 mx-2 h-40"
                    style={{ boxShadow: "0px 0px 20px #0000002b" }}
                    key={i}
                    onClick={() => handleNavigate(data?.path)}
                  >
                    <div className="garbaImage bg-gray-200 rounded-2xl w-[70px] h-14 flex justify-center items-center p-3">
                      <img src={data.image} alt="image" />
                    </div>
                    <div className="garbaText mt-3">
                      <h1 className="text-lg font-semibold">{data?.title}</h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link to="/role/judge/searchstudent"
            state={{ event: userDetails?.event?.[0]?._id }}>
            <div
              className="p-5 rounded-xl my-5 bg-white"
              style={{ boxShadow: "0px 0px 20px #0000002b" }}
            >
              <div className="flex items-center">
                <p className="font-semibold">Search</p>
                <p className="ms-auto rounded-full bg-gray-200 p-2">
                  <BsChevronRight className="text-xl" />
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <BotttmNavbar />
    </>
  );
};

export default JudgeDashbord;
