import React, { useState } from "react";
// import flower from "../asset/flower2.png";
import black_user from "../../assets/blank_user.svg";
import { AiOutlineRight } from "react-icons/ai";
import { IoIosLogIn } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { makeApiCall } from "../../api/Post";
import Loader from "../../componets/ui-elements/Loader";
import BotttmNavbar from '../../componets/BotttmNavbar'

const SecurityHome = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "user/info/",
        null,
        "raw"
      );

      if (response.data.status === 1) {
        console.log(response.data.data);
        setUser(response.data.data);
        setLoading(false)
      } else {
        console.warn("Something went wrong");
        setLoading(false)
      }
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  };

  const { data, isLoading, error } = useQuery("data", fetchData);
  const navigate = useNavigate();

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="securityTitleName h-24 flex justify-center items-center ">
        {/* <img src={flower} alt="image" /> */}
        <h1 className="text-2xl font-bold ms-2 text-[#FE385C]">
          Security Guard
        </h1>
      </div>

      <div className="securityHome h-[88vh] px-5 pt-5">
        <div className="securityDetails bg-white p-4 rounded-2xl flex" onClick={()=>navigate("/role/security/profile")}>
          <div className="securityImage rounded-full bg-sky-400 overflow-hidden h-12 w-12">
            <img
              src={user?.profile_pic ? user?.profile_pic : black_user}
              className="w-full object-cover"
              alt="image"
            />
          </div>
          <div className="securityData flex items-center ms-4">
            <div className="securityName ">
              <h1 className="text-lg font-medium">{user?.name}</h1>
              <p className="text-sm">{user?.phone_number}</p>
            </div>
          </div>
        </div>
        <div className="gateNo bg-white mt-10 p-4 rounded-3xl flex justify-center">
          <div className="getNoData ms-4 text-center">
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
            ) : (
              <h1 className="text-xl font-medium my-4">
                You are not alloted anywhere
              </h1>
            )}

            {user?.guard?.gate ||
              user?.guard?.checkpoint ||
              user?.guard?.zone ||
              user?.guard?.parking ? (
              <Link to={"/role/security/qr-scan"}>
                <div className="scanQRCode bg-black rounded-full my-7">
                  <p className="text-white py-4 px-16">Scan QR Code</p>
                </div>
              </Link>
            ) : null}
          </div>
        </div>
        {/* <div className="recentList bg-white mt-10 p-4 rounded-2xl">
          <div className="recentListText ms-4 flex items-center">
            <h1 className="text-lg font-medium">Recent List</h1>
            <AiOutlineRight className="ms-auto text-xl" />
          </div>
        </div> */}
        {/* <Link to={"/security/ticketConfirmation"}>
          <div className="recentList bg-white mt-5 p-4 rounded-2xl">
            <div className="recentListText ms-4 flex items-center">
              <h1 className="text-lg font-medium">My Pass</h1>
              <AiOutlineRight className="ms-auto text-xl" />
            </div>
          </div>
        </Link> */}
      </div>
      {/* <BotttmNavbar /> */}
    </>
  );
};
export default SecurityHome;
