import React from "react";

const InputField = ({
  type,
  value,
  placeholder,
  handleChange,
  name,
  inputPlaceholder,
  error,
  ...options
}) => {
  const isError = error && error.isError;
  const errMsg = isError ? error.message : "";

  return (
    <>
      <p className="text-[14px] text-black font-semibold ms-1 mb-1">{placeholder}</p>
      <div className={`w-full h-16 ${isError ? "border-2 border-red-500" : "border border-gray-300"}  rounded-lg`}>
        <div className="flex items-center h-full">
          <div className="mx-2 w-full flex flex-col py-2 pl-2 h-full justify-center">
            <input
              type={type}
              className=" outline-none w-full placeholder:text-[14px] bg-transparent"
              placeholder={inputPlaceholder}
              onChange={handleChange}
              name={name}
              value={value}
              min="0"
              {...options}
            />
          </div>
        </div>
        {
          isError ?
            <p className="text-[12px] text-red-600">*{errMsg}</p> : null
        }
      </div>
    </>
  );
};

export default InputField;
