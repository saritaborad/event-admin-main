import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import black_user from "../assets/blank_user.svg";
import { useQuery } from "react-query";
import { makeApiCall } from "../api/Post";

const EditProfile = () => {
  const [userDetails, setUserDetails] = useState();
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
    }
  }, [isLoading]);

  return (
    <>
      <div className="ticketConfirmationPage h-auto">
        <div className="h-[92vh] m-[2px] p-[25px] bg-white rounded-2xl mt-4 ">
          <div className="user flex justify-center">
            <div className="userImage h-40 w-40 rounded-full overflow-hidden border border-gray-400">
              <img
                src={userDetails ? userDetails.profile_pic : black_user}
                alt="image"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="userDetails border border-gray-400 mt-10 rounded-2xl p-3">
            <div className="user flex items-center">
              <p className="font-medium text-sm">Personal Details</p>
              <MdOutlineEdit className="text-xl ms-auto" />
            </div>
            <div className="userInfo mt-3">
              <p className="text-xl font-medium">{userDetails?.name}</p>
              <p className="text-sm text-gray-400">
                +91 {userDetails?.phone_number}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
