import React from "react";
import { BsChevronLeft } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  let navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-start p-2 font-bold gap-4 md:hidden ">
      <div
        onClick={handleGoBack}
        className="bg-white h-[35px] w-[35px] rounded-full flex  items-center justify-center"
      >
        <BsChevronLeft />
      </div>
      
      <p>Back</p>
    </div>
  );
};

export default Navbar;
