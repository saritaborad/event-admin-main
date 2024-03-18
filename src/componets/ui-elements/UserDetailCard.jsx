import React, { useState } from "react";
import blank_user from "../../assets/blank_user.svg";
import { FaParking } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import raas from "../../../assets/rass.svg";
import raas from "../../assets/raas.svg";
import parking from "../../assets/parking.svg";
import ImageModel from "./ImageModel";

const UserDetailCard = ({ userDetail }) => {
  const navigate = useNavigate();
  const [imageModel, setImageModel] = useState(false);

  function handleNavigate(path) {
    navigate(path);
  }

  const data = [
    {
      id: 1,
      image: raas,
      title: "Garba tickets",
      path: "/role/superadmin/finduser/tickets/",
    },
    {
      id: 2,
      image: parking,
      title: "Parking tickets",
      path: "/role/superadmin/finduser/tickets/",
    },
  ];

  const handeleImageModelClose = () => {
    setImageModel(false);
  };

  return (
    <>
      <div className="flex flex-col items-start justify-center gap-4 text-white w-full">
        <div
          className="flex items-start justify-start gap-4 w-full h-auto min-h-32 py-2 px-3 rounded-xl bg-white"
          style={{ boxShadow: "0px 0px 20px #0000002b" }}
          onClick={() =>
            navigate(`/role/superadmin/finduser/${userDetail.phone_number}`)
          }
        >
          <div className="bg-white rounded-2xl overflow-hidden object-cover">
            <img
              src={userDetail.profile_pic ? userDetail.profile_pic : blank_user}
              className="w-20 h-16"
              onClick={() => setImageModel(true)}
            />
          </div>
          <div className="flex items-center w-full">
            <div className="flex flex-col ">
              <p className="text-black text-xl min-w-24 w-auto overflow-hidden text-ellipsis ">{userDetail.name}</p>
              <p className="text-sm text-gray-400 my-1">
                {userDetail.phone_number}
              </p>
            </div>
            <p className="ms-auto bg-primary text-white px-3 rounded-full">
              {userDetail.roles}
            </p>
          </div>
        </div>
        {/* <div className="w-full flex items-center justify-between gap-2">
        {data.map((el) => {
          return (
            <div
              className="bg-white p-4 rounded-2xl mt-5 mx-2 h-40 w-56 "
              style={{ boxShadow: "0px 0px 20px #0000001b" }}
              onClick={() =>
                handleNavigate(
                  `${el.path}${userDetail.phone_number}`
                )
              }
            >
              <div className="garbaImage bg-gray-200 rounded-2xl w-[70px] h-14 flex justify-center items-center p-3">
                <img src={el.image} alt="image" />
              </div>
              <div className="garbaText mt-3">
                <h1 className="text-lg text-black font-semibold">
                  {el.title}
                </h1>
              </div>
            </div>
          );
        })}
      </div> */}
      </div>
      {imageModel ? (
        <ImageModel
          handleClose={handeleImageModelClose}
          src={userDetail?.profile_pic}
        />
      ) : null}
    </>
  );
};

export default UserDetailCard;
