import React, { useState } from "react";
import {
    BsHouseFill,
    BsFillBellFill,
    BsFillPersonFill,
    BsFillTicketPerforatedFill,
} from "react-icons/bs";
import { useNavigate,useLocation } from "react-router-dom";

const BotttmNavbar = () => {

   const navigate = useNavigate();
   const location = useLocation();

   const handleNavigation = (link)=>{
       navigate(link);
    }
        const homeLink="/role/security"
        const ticketLink="/role/security/my-pass"
        const notificationLink="/role/security/notification"
        const profileLink="/role/security/profile"

  return (
     <>
            <div className="footerMenu bg-black mx-5 py-4 rounded-full z-10 bottom-2 w-[90%] fixed sm:inline-block md:hidden lg:hidden xl:hidden 2xl:hidden">
                <div className="menu flex justify-around items-center ">
                    <div className={`${location.pathname===homeLink?"bg-primary":"bg-black"} p-2 px-5 flex items-center rounded-full`} onClick={()=>handleNavigation(homeLink)}>
                        <BsHouseFill className="text-white text-2xl" />
                    </div>
                    <div className={`${location.pathname===ticketLink?"bg-primary":"bg-black"} p-2 px-5 flex items-center rounded-full`} onClick={()=>handleNavigation(ticketLink)}>
                        <BsFillTicketPerforatedFill className="text-white text-2xl" />
                    </div>
                    <div className={`${location.pathname===notificationLink?"bg-primary":"bg-black"} p-2 px-5 flex items-center rounded-full`} onClick={()=>handleNavigation(notificationLink)}>
                        <BsFillBellFill className="text-white text-2xl" />
                    </div>
                    <div className={`${location.pathname===profileLink?"bg-primary":"bg-black"} p-2 px-5 flex items-center rounded-full`}  onClick={()=>handleNavigation(profileLink)}>
                        <BsFillPersonFill className="text-white text-2xl" />
                    </div>
                </div>
            </div>
        </>
  )
}

export default BotttmNavbar