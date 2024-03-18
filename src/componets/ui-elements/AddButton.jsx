import React from "react";
import { BsPlusCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
const AddButton = ({ title, link }) => {
  return (
    <div className="md:max-w-[500px] md:mx-auto">
    <Link to={link} className="text-center w-full">
      <div className="w-full font-bold text-[20px] py-2 h-[70px] bg-primary rounded-[15px] flex items-center justify-center gap-2 text-white md:px-14 md:py-2">
        <BsPlusCircle /> <p>New {title} </p>
      </div>
    </Link>
    </div>
  );
};

export default AddButton;
