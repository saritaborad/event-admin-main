import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import ImageUpload from "../../componets/ui-elements/ImageUpload";
import { makeApiCall } from "../../api/Post";
import { useNavigate } from "react-router-dom";
import Alert from "../../componets/ui-elements/Alert";

const AlertPopPup = ({ handleCancelClick, branchId, userId }) => {
  const [frontImage, setFrontImage] = useState();
  const [backImage, setBackImage] = useState();
  const [frontDisplayImage, setDisplayFrontImage] = useState();
  const [backDisplayImage, setDisplayBackImage] = useState();
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const navigate = useNavigate();

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const data = {
        doc_front: frontImage,
        doc_back: backImage,
        branchid: branchId,
        userid: userId,
      };
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      console.log("Contents of FormData:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await makeApiCall(
        "post",
        "user/uploaddoc",
        formData,
        "formdata"
      );
      if (response.data.status === 1) {
        const sendApproveReq = await makeApiCall(
          "post",
          "user/approverequest",
          {
            userid: userId,
            branchid: branchId,
            action: true,
          },
          "raw"
        );
        if (sendApproveReq.data.status === 1) {
          // setLoading(false);
          setStatus("complete");
          setSuccessMsg(sendApproveReq.data.message);
          // naviget("/role/classowner");
        }
        else if(sendApproveReq.data.status===10){
          handleLogout(navigate("/login"))
        } 
        else {
          // setLoading(false);
          alert(sendApproveReq.data.message);
          setStatus("error");
          setErrorMsg(sendApproveReq.data.message);
        }
      }
      else if(response.data.status === 10){
        handleLogout(navigate("/login"))
      } 
       else {
        // setLoading(false);
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      // setLoading(false);
      console.warn(error);
      setErrorMsg("Something went wrong");
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleClick = () => {
    setIsAlert(true);
    setStatus("start");
  };

  const handleComplete = () => {
    navigate("/role/classowner");
  };

  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
    // console.log(file);
    if (file) {
      if (name === "frontImage") {
        setFrontImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setDisplayFrontImage(base64String);
        };
        reader.readAsDataURL(file);
      } else {
        setBackImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setDisplayBackImage(base64String);
        };
        reader.readAsDataURL(file);
      }
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
      <div
        className={`bg-[#000000ba] backdrop-blur-[3px] top-0 left-0 h-screen absolute w-full `}
      >
        <div
          className={"fixed z-50 top-0 left-0 h-full w-full  flex items-center"}
        >
          {loading ? (
            <div className="w-2/4 mx-auto bg-white h-32 flex items-center justify-center rounded-2xl">
              <svg
                aria-hidden="true"
                className="inline w-12 h-12 mr-2 text-primary animate-spin dark:text-primary fill-white dark:fill-white"
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
          ) : (
            <div
              className={`relative h-auto w-full bg-[#F2F2F2] rounded-3xl p-5 gap-5 mx-2 my-24`}
            >
              <div className="eventImage  h-auto flex flex-col gap-3 justify-center items-center ">
                <div className="adhaarCardFront">
                  <ImageUpload
                    id={"frontFile"}
                    handleChange={(e) => handleFileChange(e, "frontImage")}
                    source={frontDisplayImage}
                    heading={"AadhaarCard Front Image"}
                    height={"h-auto min-h-56"}
                    imageSize={"w-24"}
                    label={frontDisplayImage ? "Replace image" : "Upload image"}
                  />
                  {/* {fileSizeExceededFrontImage && (
                    <p className="error text-red-500">
                      File size exceeded the limit of 9 mb
                    </p>
                  )} */}
                </div>
                <div className="adhaarCardBack">
                  <ImageUpload
                    id={"backFile"}
                    handleChange={(e) => handleFileChange(e, "backImage")}
                    source={backDisplayImage}
                    heading={"AadhaarCard Back Image"}
                    height={"h-auto min-h-56"}
                    imageSize={"w-24"}
                    label={backDisplayImage ? "Replace image" : "Upload image"}
                  />
                  {/* {fileSizeExceededBackImage && (
                    <p className="error text-red-500">
                      File size exceeded the limit of 9 mb
                    </p>
                  )} */}
                </div>
              </div>
              <div className="active flex justify-center items-center gap-3">
                {frontImage && backImage ? (
                  <button
                    className="text-lg font-medium bg-[#13B841] text-white py-2 px-5 mt-5 rounded-xl w-full"
                    onClick={handleClick}
                  >
                    Tap to approve
                  </button>
                ) : null}
                <button
                  className="text-lg font-medium bg-primary text-white py-2 px-5 mt-5 rounded-xl w-full"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AlertPopPup;
