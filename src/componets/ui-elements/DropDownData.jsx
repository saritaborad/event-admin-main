import React, { useState } from "react";
import { makeApiCall } from "../../api/Post";
import Alert from "./Alert";

const DropDownData = ({ img, name, id, button, branchId }) => {
  // CommonJS
  // const Swal = require('sweetalert2')

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);


  const shortenedId = id.slice(0, 5) + "..." + id.slice(-4);
  console.log(branchId, "<==== branch id");
  console.log(id, "<==== user id");

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "post",
        "user/approverequest",
        {
          userid: id,
          branchid: branchId,
          action: true,
        },
        "raw"
      );
      console.log(response);
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.warn(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const handleClick = () => {
    setIsAlert(true);
    setStatus("start");
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    // location.reload();
    setIsAlert(false);
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
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          status={status}
          confirmText={successMsg}
          errorText={errorMsg}
          onComplete={handleComplete}
        />
      ) : null}
      <div className="studentData flex items-center py-2">
        <div className="studentImage rounded-full border border-gray-300 flex items-center justify-center overflow-hidden">
          <img src={img} alt="image" className="h-12 w-12" />
        </div>
        <div className="studentInfo ms-3">
          <h1 className="text-lg font-medium">{name}</h1>
          <p className="text-xs text-[#636363]">ID: {shortenedId}</p>
        </div>
        {button ? (
          <div className="detailsButton bg-[#13B841] px-4 py-1 rounded-full ms-auto">
            <button
              className="text-sm text-white capitalize"
              onClick={handleClick}
            >
              Tap to approve
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default DropDownData;
