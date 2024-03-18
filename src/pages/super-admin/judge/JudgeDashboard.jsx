import React, { useState } from "react";
import check from "../../../assets/check.svg";
import { useNavigate } from "react-router-dom";
import trophy from "../../../assets/trophy.svg";

const JudgeDashboard = () => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate("/role/superadmin/judgedashboard" + path);
    console.log(path);
  };

  const securityData = [
    {
      id: 1,
      image: check,
      title: "Judge",
      path: "/judge",
    },
    {
      id: 2,
      image: check,
      title: "Judge Management",
      path: "/judgemanagement",
    },
    {
      id: 3,
      image: trophy,
      title: "Prize Categories",
      path: "/price-category",
    },
    {
      id: 4,
      image: trophy,
      title: "Prize Management",
      path: "/pricemanagement",
    },
  ];

  return (
    <>
      <div className="security">
        <div className="h-[92vh] m-[2px] bg-white rounded-[30px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
          <div className="adminData mx-3 py-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-[70px]">
              {securityData.map((data, i) => {
                return (
                  <div
                    className="garbaClass bg-white p-4 rounded-2xl mt-5 mx-2 h-40 cursor-pointer"
                    style={{ boxShadow: "0px 0px 20px #0000003b" }}
                    key={i}
                    onClick={() => handleNavigate(data.path)}
                  >
                    <div className="garbaImage bg-gray-200 rounded-2xl w-[70px] h-14 flex justify-center items-center p-3">
                      <img src={data.image} alt="image" />
                    </div>
                    <div className="garbaText mt-3">
                      <h1 className="text-lg font-semibold">{data.title}</h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JudgeDashboard;

