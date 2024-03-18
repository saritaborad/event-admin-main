import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import { BsDoorClosed, BsSearch } from "react-icons/bs";
import AddButton from "../../../componets/ui-elements/AddButton";
import { makeApiCall } from "../../../api/Post";
import { copyToClipboard } from "../../../utils/CommonFunctions";
import { FaCopy } from "react-icons/fa";

const UserOTP = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userOtp, setUserOtp] = useState();
  const navigate = useNavigate();

  const handleSearchChange = async (e) => {
    const { value } = e.target;
    setSearchQuery(value);

    if (value.length === 10) {
      setIsLoading(true);
      console.log(value);
      try {
        const data = { phone_number: value };
        const resp = await makeApiCall("post", "user/getotp", data, "raw");
        console.log(resp);
        if (resp.data.status === 0) {
          setIsLoading(false);
          if (resp.data.data != null) {
            setUserOtp(resp.data.data);
          }
        } else {
          setIsLoading(false);
          console.warn("Something wrong in API response ======>", resp);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error in get OTP ======>", error);
      }
    }
  };

  console.log(userOtp === undefined ? "No otp found" : userOtp?.phone_otp);
  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="w-full p-4 rounded-xl bg-gray-200 my-5 flex items-center justify-start">
            <BsSearch />
            <input
              type="text"
              maxLength={10}
              placeholder="Enter user number"
              className="h-full w-full ms-3 outline-none bg-gray-200"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
            {isLoading ? (
              <div className="w-full flex items-center justify-center">
                {" "}
                <svg
                  aria-hidden="true"
                  className="inline w-10 h-10 text-primary animate-spin dark:text-primary fill-gray-400 dark:fill-gray-400"
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
              </div>
            ) : userOtp === undefined ? (
              <p>No OTP found</p>
            ) : (
              <div className="w-full bg-gray-200 px-3 py-2 rounded-full flex items-center justify-between">
                <p>
                  OTP is :{" "}
                  <span className="font-semibold text-primary">
                    {userOtp?.phone_otp}
                  </span>
                </p>
                <span
                  className=" h-[40px] w-[40px] text-sm rounded-full bg-white text-gray-600 border border-gray-600 flex items-center justify-center cursor-pointer"
                  onClick={() =>
                    copyToClipboard({ textToCopy: userOtp?.phone_otp })
                  }
                >
                  <FaCopy />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserOTP;
