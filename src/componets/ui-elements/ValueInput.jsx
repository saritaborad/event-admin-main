import React from "react";

const ValueInput = ({
  type,
  value,
  placeholder,
  icon,
  inputPlaceholder,
  handleChange,
  isDisabled
}) => {
  return (
    <>
      <p className="text-[14px] text-black font-semibold ms-1 mb-1">{placeholder}</p>
      <div className="garbaName flex items-center rounded-lg bg-[#f2f2f2] p-4" >
        {/* <div className="garbaicone items-center">
          <p className="ps-5 pe-3">{icon}</p>
        </div> */}
        <div className="details w-full ps-3">
          {/* <p className="text-xs text-primary">{placeholder}</p> */}
          <input
            type={type}
            className="outline-none bg-transparent border-none placeholder:text-black w-full"
            value={value}
            placeholder={inputPlaceholder}
            onChange={handleChange}
            disabled={isDisabled}
          />
          {/* <p className="font-medium">{value}</p> */}
        </div>
      </div>
    </>
  );
};

export default ValueInput;
