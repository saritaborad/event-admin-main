import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

const StudentCard = ({ link, image, name, phone, isApproved, type }) => {
  return (
    <>
      <Link to={link} className="w-full">
        <div
          className="bg-white p-3 rounded-xl mt-5 mx-2 h-auto"
          style={{ boxShadow: "0px 0px 20px #0000002b" }}
        >
          <div className="garbaImage flex justify-center items-center  overflow-hidden">
            <img
              src={image}
              alt="image"
              className="w-[70px] h-[70px] rounded-full"
            />
          </div>
          <div className="garbaText mt-3 text-center">
            <h1 className="text-lg leading-normal">
              <span className="text-sm font-semibold text-gray-400">Name</span>{" "}
              <br />
              {name}
            </h1>
            <h1>
              <span className="text-sm font-semibold text-gray-400">Phone No</span> <br />
              {phone}
            </h1>
            {
              type?
              <p className={`text-sm rounded-md p-2 ${type==="active"?"bg-green-200 text-green-600":"bg-yellow-200 text-yellow-600"}  uppercase font-bold`}>{type}</p>
              :null
            }
          </div>
        </div>
      </Link>
    </>
  );
};

export default StudentCard;

