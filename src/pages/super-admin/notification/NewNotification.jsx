import React, { useState } from "react";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { useNavigate } from "react-router-dom";
import InputField from "../../../componets/ui-elements/InputField";
import ImageUpload from "../../../componets/ui-elements/ImageUpload";
import { makeApiCall } from "../../../api/Post";
import Alert from "../../../componets/ui-elements/Alert";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const NewNotification = () => {
  const [notificationName, setNotificationName] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [notificationPhoto, SetNotificationPhoto] = useState();
  const [notificationDisplayPhoto, setNotificationDisplayPhoto] = useState();
  const [user, setUser] = useState();
  const [userNumber, setUserNumber] = useState();
  const [gender, setGender] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const navigate = useNavigate();
  const maxFileSize = 9 * 1024 * 1024; // 9mb
  const [fileSizeExceeded, setFileSizeExceeded] = useState(false);

  const animatedComponents = makeAnimated();

  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
    SetNotificationPhoto(file);
    // console.log(file);
    console.log(file.size);

    if (file && file.size < maxFileSize) {
      const reader = new FileReader();
      setFileSizeExceeded(false);
      reader.onloadend = () => {
        const base64String = reader.result;
        setNotificationDisplayPhoto(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setFileSizeExceeded(true);
    }
  };

  const handleConfirm = async () => {
    console.log("Notification");
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "post",
        "notification/allpassuser",
        {
          body: notificationDescription,
          title: notificationName,
        },
        "raw"
      );
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const handleClick = () => {
    if (notificationName && notificationDescription) {
      setIsAlert(true);
      setStatus("start");
    } else {
      setIsAlert(true);
      setErrorMsg("Please fill all field");
      setStatus("error");
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    navigate("/role/superadmin/notification");
  };

  const userData = [
    { value: "n-user", label: "N-User" },
    { value: "p-user", label: "P-User" },
    { value: "user", label: "User" },
    { value: "alluser", label: "All-User" },
  ];

  const genderData = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

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
      <div className="h-auto m-[2px] p-[20px] bg-white rounded-[30px] mt-4 flex flex-col gap-[50px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="eventImage flex flex-col gap-3 justify-center items-center ">
          {/* <div className="authorizedPersonAvtar">
          <ImageUpload
            id={"file"}
            handleChange={(e) => handleFileChange(e, "notificationPhoto")}
            source={notificationDisplayPhoto}
            heading={"Notification Image"}
            height={"h-auto min-h-56"}
            label={notificationDisplayPhoto ? "Replace image" : "Upload image"}
            // handleDelete={()=>handleDelete("landscap")}
          />
          {fileSizeExceeded && (
            <p className="error text-red-500">
              File size exceeded the limit of 9 mb
            </p>
          )}
        </div> */}
        </div>
        <div className="flex flex-col gap-[25px] justify-start items-center">
          <div className="w-full">
            <InputField
              type="text"
              placeholder={"Event Title"}
              inputPlaceholder={"Enter Title"}
              value={notificationName}
              handleChange={(e) => setNotificationName(e.target.value)}
              disabled={false}
            />
          </div>
          <div className="w-full">
            <InputField
              type="text"
              placeholder={"Event Description"}
              inputPlaceholder={"Enter your Event Description"}
              value={notificationDescription}
              handleChange={(e) => setNotificationDescription(e.target.value)}
              disabled={false}
            />
          </div>

          <div className="w-full">
            <p className="text-[14 px] text-black font-semibold">Select User</p>
            <div className="w-full h-16 border border-gray-300 rounded-lg">
              <div className="authorizedName flex items-center h-full">
                <Select
                  options={userData}
                  components={animatedComponents}
                  // placeholder="Select User"
                  isMulti={false}
                  name="user"
                  onChange={(e) => {
                    setUser(e.value);
                  }}
                  className="basic-multi-select h-full flex item-center bg-transparent"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>

          {user === "user" ? (
            <div className="w-full">
              <InputField
                type="number"
                placeholder={"User Contact"}
                inputPlaceholder={"Enter User Contact"}
                value={notificationDescription}
                handleChange={(e) => setUserNumber(e.target.value)}
                disabled={false}
              />
            </div>
          ) : null}

          {user === "alluser" ? null : (
            <div className="w-full">
              <p className="text-[14 px] text-black font-semibold">
                Select Gender
              </p>
              <div className="w-full h-16 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  <Select
                    options={genderData}
                    components={animatedComponents}
                    // placeholder="Select User"
                    isMulti={false}
                    name="gender"
                    onChange={(e) => {
                      setGender(e.value);
                    }}
                    className="basic-multi-select h-full flex item-center bg-transparent"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mb-24">
          <PrimaryButton
            background={"primary-button"}
            handleClick={handleClick}
            title={"Submit"}
          />
        </div>
      </div>
    </>
  );
};

export default NewNotification;
