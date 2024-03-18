import React, { useEffect, useState } from "react";
import PhoneNumberInput from "../../../componets/ui-elements/PhoneNumberInput";
import ImageUpload from "../../../componets/ui-elements/ImageUpload";
import InputField from "../../../componets/ui-elements/InputField";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { handleNumberValidate } from "../../../utils/CommonFunctions";
import Alert from "../../../componets/ui-elements/Alert";
import { useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../../api/Post";

const NewSalesTeam = () => {
  const params = useParams();
  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [bloodgroup, setBloodGroup] = useState();
  const [insta, setInsta] = useState();
  const [contact, setContact] = useState();
  const [image, setImage] = useState();
  const [displayImage, setDisplayImage] = useState();
  const [pass, setPass] = useState();
  const [birthdate, setBirthDate] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const maxFileSize = 9 * 1024 * 1024; // 9mb
  const [fileSizeExceeded, setFileSizeExceeded] = useState(false);

  const navigate = useNavigate();

  const bloodData = [
    { value: "O+", label: "+ O Positive" },
    { value: "O-", label: "- O Negetive" },
    { value: "A-", label: "- A Negetive" },
    { value: "A+", label: "+ A Positive" },
    { value: "AB+", label: "+ AB Positive" },
    { value: "AB-", label: "- AB Negetive" },
    { value: "B-", label: "- B Negetive" },
    { value: "B+", label: "+ B Positive" },
  ];

  const genderData = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const animatedComponents = makeAnimated();

  const handleFileChange = (e, name) => {
    const file = e.target.files[0];
    // setImage(file);
    // console.log(file);

    if (file && file.size < maxFileSize) {
      setFileSizeExceeded(false);
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setDisplayImage(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setFileSizeExceeded(true);
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");

    try {
      const data = {
        name: name,
        profile_pic: image,
        phone_number: contact,
        birth_date: birthdate,
        gender: gender,
        instagram_id: insta,
        blood_group: bloodgroup,
        // pass_id: pass._id,
      };

      console.log(data);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await makeApiCall(
        "post",
        "user/addsalesteam",
        formData,
        "formdata"
      );
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

  const handleNumberChange = async (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric characters
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    // Limit the number to 10 digits
    if (numericValue.length <= 10) {
      setContact(numericValue);
      const isExist = await handleNumberValidate(numericValue);
      if (isExist && isExist.data.status == 1) {
        if (isExist.data.data.roles === "n-user") {
          console.log(e.target.value, "Contact number");
          setContact(e.target.value);
        } else {
          setIsAlert(true);
          setStatus("error");
          setErrorMsg(
            `User already exists as a ${isExist.data.data.roles}. Try with another number.`
          );
        }
      } else {
        setContact(e.target.value);
      }
    }
  };

  const handleClick = () => {
    if (name && gender && contact && image) {
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
    navigate(`/role/superadmin/salesteam`);
  };

  //   const fetchUser = async () => {
  //     const res = await makeApiCall(
  //       "post",
  //       "user/userdetails",
  //       {
  //         phone_number: params.number,
  //       },
  //       "raw"
  //     );
  //     if (res.data.status === 1) {
  //       setPass(res.data.data.pass_list);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchUser();
  //   }, []);

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
      <div className=" h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[100px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="flex w-full  flex-col gap-[25px] justify-start items-start">
            <div className="eventImage flex flex-col w-full gap-3 justify-center items-center ">
              <div className="authorizedPersonAvtar w-full">
                <ImageUpload
                  id={"file"}
                  handleChange={(e) => handleFileChange(e, "couchPhoto")}
                  source={displayImage}
                  heading={"Image"}
                  height={"h-auto min-h-56"}
                  label={displayImage ? "Replace image" : "Upload image"}
                  // handleDelete={()=>handleDelete("landscap")}
                />
                {fileSizeExceeded && (
                  <p className="error text-red-500">
                    File size exceeded the limit of 9 mb
                  </p>
                )}
              </div>
            </div>

            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Sales Name"}
                inputPlaceholder={"Enter Sales name"}
                value={name}
                handleChange={(e) => setName(e.target.value)}
                disabled={false}
              />
            </div>
            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Instagram ID"}
                inputPlaceholder={"Enter Instagram Id"}
                value={insta}
                handleChange={(e) => setInsta(e.target.value)}
                disabled={false}
              />
            </div>

            <div className="text w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Blood group</p>
              <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  <Select
                    options={bloodData}
                    components={animatedComponents}
                    isMulti={false}
                    name="blood"
                    placeholder="Select Blood group"
                    onChange={(e) => {
                      setBloodGroup(e.value);
                    }}
                    className="basic-multi-select h-full flex item-center bg-transparent"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <PhoneNumberInput
                value={contact}
                handleChange={handleNumberChange}
              />
            </div>
            <div className="w-full">
              <InputField
                type="date"
                placeholder={"Birth Date"}
                disabled={false}
                name="birth_date"
                // value={params.event_date}
                handleChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div className="text w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Gender</p>
              <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  <Select
                    options={genderData}
                    components={animatedComponents}
                    isMulti={false}
                    name="bllod"
                    placeholder="Select Gender"
                    onChange={(e) => {
                      setGender(e.value);
                    }}
                    className="basic-multi-select h-full flex item-center bg-transparent"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>
            {/* <div className="w-full">
        <InputField
          type="date"
          placeholder={"Birth Date"}
          disabled={false}
          name="event_date"
          // value={params.event_date}
          handleChange={(e) => setBirthDate(e.target.value)}
        />
      </div> */}
            <div className="flex w-full items-center mt-16 gap-4 mb-24">
              <PrimaryButton
                background={"primary-button"}
                handleClick={handleClick}
                title={"Submit"}
              />
            </div>
            <div className="h-14"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewSalesTeam;
