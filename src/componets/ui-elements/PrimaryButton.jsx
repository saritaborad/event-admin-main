import React from "react";
import { Link } from "react-router-dom";

const PrimaryButton = ({ handleClick, title, background, options = {} }) => {
  return (
    <button
      onClick={handleClick}
      className={`flex justify-center ${background} rounded-full px-10 py-4 w-full`}
      {...options}
    >
      <p className="text-white">{title}</p>
    </button>
  );
};

export default PrimaryButton;
