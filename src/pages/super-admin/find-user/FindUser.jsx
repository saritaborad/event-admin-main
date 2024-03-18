import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { makeApiCall } from "../../../api/Post";
import UserDetailCard from "../../../componets/ui-elements/UserDetailCard";
import Alert from "../../../componets/ui-elements/Alert";
import Loader from "../../../componets/ui-elements/Loader";
import JSONPretty from 'react-json-pretty';

const FindUser = () => {
  const [searchQuery, setSearchQuery] = useState();

  const [user, setUser] = useState();
  const [rawResp, setrawResp] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const json = {
  "name": "John Doe",
  "age": 32,
  "email": "johndoe@example.com"
};

  const handleLogOut = async () => {
    try {
      const respone = await window.flutter_inappwebview.callHandler(
        "userLogout",
        "User Logout."
      );
      var isAppReady = false;
      window.addEventListener(
        "flutterInAppWebViewPlatformReady",
        function (event) {
          isAppReady = true;
        }
      );
      localStorage.clear();
    } catch (error) {
      alert(error);
    }
  };

  const findUser = async (searchQuery) => {
    if(searchQuery.length===10){
      setIsLoading(true);
    try {
      const response = await makeApiCall(
        "post",
        "user/userdetails",
        {
          phone_number: searchQuery,
        },
        "raw"
      );
      console.log(response);
      setrawResp(response);
      if (response.data.status === 1) {
        setUser(response.data.data);
        setIsLoading(false);
      } else if (response.data.status === 10) {
        console.log(response);
        handleLogOut();
        setIsLoading(false);
      } else if (response.data.status === 0) {
        setIsAlert(true);
        setErrorMsg(response.data.message);
        setStatus("error");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }
};

const handleNumberChange = (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric characters
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    // Limit the number to 10 digits
    if (numericValue.length <= 10) {
      setSearchQuery(numericValue);
      findUser(numericValue);
    }
  };




  return (
    <>
      {isAlert ? (
        <Alert
          isOpen={isAlert}
          title="Are you sure?"
          text="You won't be able to revert this!"
          confirmButtonText="Submit"
          cancelButtonText="Cancel"
          onCancel={() => setIsAlert(false)}
          status={status}
          confirmText={successMsg}
          errorText={errorMsg}
          onComplete={() => setIsAlert(false)}
        />
      ) : null}
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <p className="text-xl font-medium">Find user</p>
        <div className="w-full p-3 rounded-xl bg-gray-200 flex items-center justify-start h-18">
          <BsSearch />
          <input
            type="number"
            maxLength="10"
            placeholder="Enter User Phone Number"
            className="h-full w-full ms-3 outline-none bg-gray-200 disabled:placeholder:text-gray-100"
            value={searchQuery}
            onChange={handleNumberChange}
          />
          {/* ) : null} */}
        </div>
        {user != undefined ? (
          <UserDetailCard userDetail={user} />
        ) : (
          <p className="text-center text-xl text-gray-400  mt-24">
            User Not Found
          </p>
        )}
        {
          user!=undefined?
          <JSONPretty id="json-pretty" data={rawResp}></JSONPretty>
          :null
        }

        
      </div>
      {/* <pre>{JSON.stringify(json, null, 2)}</pre> */}
      {isLoading?<Loader/>:null}
    </>
  );
};

export default FindUser;
