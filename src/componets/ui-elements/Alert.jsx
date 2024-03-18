import React, { useEffect } from "react";
import PrimaryButton from "./PrimaryButton";
import { BsFlower2 } from "react-icons/bs";
import Lottie from "lottie-react";
import completed from "../../assets/lottie/completed.json";
import error from "../../assets/lottie/error.json";
import logo from "../../assets/newLogo.svg";

const Alert = ({
  isOpen,
  title,
  text,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  onComplete,
  status,
  confirmText,
  errorText,
}) => {
  if (!isOpen) return null;
  const handleConfirm = () => {
    onConfirm && onConfirm();
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return (
    <div className="fixed z-[101] top-0 left-0 h-screen w-full bg-[#000000ba] backdrop-blur-[4px] flex items-center justify-center transition duration-700 ease-in-out">
      <div
        className={`max-h-[240px] relative h-auto w-[330px] bg-white rounded-3xl flex flex-col items-center justify-center p-6 gap-5 ${isOpen?"":null} `}
      >
        <div className="absolute h-16 w-16 rounded-full text-3xl text-primary bg-white shadow-md top-[-32px] flex items-center justify-center overflow-hidden">
          {status === "loading" ? (
            <svg
              aria-hidden="true"
              className="inline w-12 h-12 text-primary animate-spin dark:text-primary fill-gray-400 dark:fill-gray-400"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : status === "complete" ? (
            <Lottie
              animationData={completed}
              loop={true}
              className="w-[50px]"
            />
          ) : status === "error" ? (
            <Lottie animationData={error} loop={true} className="w-[50px]" />
          ) : (
            // <BsFlower2 />
            <img src={logo} alt="logo" className="w-full h-full" />
          )}
        </div>
        {status === "loading" ? (
          <p className="mt-5 font-semibold">Waiting ...</p>
        ) : status === "complete" ? (
          <>
            {" "}
            <div className="flex items-center w-full gap-3 justify-center">
              <p className="text-[20px] font-medium mt-3 text-center">
                {confirmText}
              </p>
            </div>
            <div className="flex  items-center justify-center w-full gap-3">
              <Button
                handleClick={onComplete}
                title={"OK"}
                background="bg-primary"
                color="white"
                border="border-transparent"
              />
            </div>
          </>
        ) : status === "error" ? (
          <>
            {" "}
            <div className="flex items-center w-full gap-3 justify-center">
              <p className="text-[20px] font-medium mt-3 text-center">
                {errorText}
              </p>
            </div>
            <div className="flex  items-center justify-center w-full gap-3">
              <Button
                handleClick={handleCancel}
                title={"Retry"}
                background="bg-primary"
                color="white"
                border="border-transparent"
              />
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="flex items-center w-full gap-3 justify-center">
              <p className="text-[20px] font-medium mt-3 text-center">
                {title}
              </p>
            </div>
            {text && (
              <div className="flex items-center w-full gap-3 justify-center">
                <p className="text-[16px] mt-2">{text}</p>
              </div>
            )}
            <div className="flex  items-center justify-center w-full gap-3">
              <Button
                handleClick={handleConfirm}
                title={confirmButtonText}
                background="bg-primary"
                color="white"
                border="border-transparent"
              />
              <Button
                handleClick={handleCancel}
                title={cancelButtonText}
                background="bg-white"
                color="black"
                border="border-primary"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Alert;

export const Button = ({ handleClick, title, background, color, border }) => {
  return (
    <button
      onClick={handleClick}
      className={`flex justify-center ${background} border ${border} rounded-2xl px-10 py-4 w-full`}
    >
      <p className={`text-${color}`}>{title}</p>
    </button>
  );
};
