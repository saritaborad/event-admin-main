import React, { useEffect, useState } from "react";
import {
  BsHouseFill,
  BsFillBellFill,
  BsFillPersonFill,
  BsFillTicketPerforatedFill,
} from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { makeApiCall } from "../api/Post";

const BotttmNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState();

  const handleNavigation = (link) => {
    navigate(link);
  };

  const fetchData = async () => {
    try {
      const response = await makeApiCall("get", "user/info/", null, "raw");
      if (response.data.status === 1) {
        switch (response.data.data.roles) {
          case "superadmin":
            setRole("superadmin");
            break;
          case "admin":
            setRole("admin");
            break;
          case "securityguard":
            setRole("security");
            break;
          case "garbaclassowner":
            setRole("classowner");
            break;
          case "branchowner":
            setRole("classowner");
            break;
          case "sponsor":
            setRole("sponsor");
            break;
          case "judge":
            setRole("judge");
            break;
          case "saleteam":
            setRole("saleteam");
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const homeLink = `/role/${role}`;
  const ticketLink = `/role/${role}/pass`;
  const notificationLink = `/role/${role}/notification-page`;
  const profileLink = `/role/${role}/profile`;

  return (
    <>
      <div className="footerMenu bg-black ml-[5%] py-4 rounded-full z-10 bottom-2 w-[90%] fixed sm:inline-block md:hidden lg:hidden xl:hidden 2xl:hidden ">
        <div className="menu flex justify-around items-center relative px-2">
          {/* <div className="w-[64px] flex items-center bg-yellow-400 z-[99] h-full rounded-full absolute left-0"></div> */}
          <div
            className={`home  ${
              location.pathname === homeLink ? "bg-primary" : "bg-black"
            } p-2 px-5 flex items-center rounded-full`}
            onClick={() => handleNavigation(homeLink)}
          >
            <BsHouseFill className="text-white text-2xl" />
          </div>
          {/* <div
            className={`ticket ${
              location.pathname === ticketLink ? "bg-primary" : "bg-black"
            } p-2 px-5 flex items-center rounded-full`}
            onClick={() => handleNavigation(ticketLink)}
          >
            <BsFillTicketPerforatedFill className="text-white text-2xl" />
          </div> */}
          <div
            className={`bell ${
              location.pathname === notificationLink ? "bg-primary" : "bg-black"
            } p-2 px-5 flex items-center rounded-full`}
            onClick={() => handleNavigation(notificationLink)}
          >
            <BsFillBellFill className="text-white text-2xl" />
          </div>
          <div
            className={`user ${
              location.pathname === profileLink ? "bg-primary" : "bg-black"
            } p-2 px-5 flex items-center rounded-full`}
            onClick={() => handleNavigation(profileLink)}
          >
            <BsFillPersonFill className="text-white text-2xl" />
          </div>
        </div>
      </div>
    </>
  );
};

export default BotttmNavbar;
