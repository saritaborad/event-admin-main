import React, { useState } from "react";
import { makeApiCall } from "../../api/Post";
import { appendDataToFormData } from "../../utils/CommonFunctions";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
import defaultUserImage from "../../assets/blank_user.svg";

const SecurityCard = ({ image, name, id, isAssign, type, typeId,phone_no,getFunc }) => {
  const navigate = useNavigate();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const [method, setMethod] = useState();

  const data = {
    guard_id: id,
  };
  const formData = new FormData();

  appendDataToFormData(formData, data);
  // formData.append("profile_pic",profilePic);
  type === "gate"
    ? formData.append("gate", typeId)
    : type === "checkpoint"
    ? formData.append("checkpoint", typeId)
    : type === "zone"
    ? formData.append("zone", typeId)
    : formData.append("parking", typeId);

  const handleConfirm = async () => {
    setStatus("loading");
    if (method === 0) {
      try {
        const resp = await makeApiCall(
          "post",
          "guard/update",
          formData,
          "formdata"
        );
        if (resp.data.status === 1) {
          setStatus("complete");
          setSuccessMsg(resp.data.message);
        } else {
          setStatus("error");
          setErrorMsg(resp.data.message);
        }
      } catch (error) {
        console.warn(error);
        setStatus("error");
        setErrorMsg("Something went wrong");
      }
    } else {
      try {
        const resp = await makeApiCall(
          "post",
          "guard/removeguard",
          {
            guard_id: id,
          },
          "raw"
        );
        if (resp.status === 200) {
          setStatus("complete");
          setSuccessMsg(resp.data.message);
        } else {
          setStatus("error");
          setErrorMsg(resp.data.message);
        }
      } catch (error) {
        console.warn(error);
        setStatus("error");
        setErrorMsg("Something went wrong");
      }
    }
  };

  const handleClick = (mtd) => {
    setMethod(mtd);
    setIsAlert(true);
    setStatus("start");
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    if (method === 0) {
      navigate(
        `/role/superadmin/securitydashboard/security-management/security/assign/${type}/${typeId}`
      );
    } else {
      setIsAlert(false);
      getFunc();
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
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          status={status}
          confirmText={successMsg}
          errorText={errorMsg}
          onComplete={handleComplete}
        />
      ) : null}
      <div className="w-full flex flex-col items-center justify-between gap-5 p-3 bg-white rounded-xl h-auto max-h-[200px]" style={{ boxShadow: "0px 0px 20px #0000002b" }}>
        <div className="flex items-center flex-col justify-center gap-3">
          <div className="h-14 w-14 rounded-md overflow-hidden flex items-center justify-center">
            <img
              src={image ? image : defaultUserImage}
              alt="image"
              className="w-full object-cover rounded-md h-full"
            />
          </div>
        <div className="flex flex-col items-center justify-center">
            <p className="truncate overflow-hidden text-sm ">
              {name}
            </p>

            <p className="truncate overflow-hidden text-sm ">
              {phone_no}
            </p>
            </div>
          {/* <div className="ms-2 w-52">
          </div> */}
        </div>
        {isAssign === true ? (
          <button
            className="bg-green-400 px-3 py-1 rounded-full text-white text-sm"
            onClick={() => handleClick(0)}
          >
            Assign
          </button>
        ) : (
          <button
            className="bg-primary px- 3 py-1 rounded-full text-white text-sm"
            onClick={() => handleClick(1)}
          >
            Remove
          </button>
        )}
      </div>
    </>
  );
};

export default SecurityCard;
