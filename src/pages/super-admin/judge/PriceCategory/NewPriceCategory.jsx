import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import InputField from "../../../../componets/ui-elements/InputField";
import PrimaryButton from "../../../../componets/ui-elements/PrimaryButton";
import ImageUpload from "../../../../componets/ui-elements/ImageUpload";
import Alert from "../../../../componets/ui-elements/Alert";
import { makeApiCall } from "../../../../api/Post";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import {
  filterByProperty,
  handleNumberValidate,
} from "../../../../utils/CommonFunctions";
import { dashBordData } from "../../../../utils/dashBordData";
import PhoneNumberInput from "../../../../componets/ui-elements/PhoneNumberInput";

const NewPriceCategory = () => {
  const params = useParams();

  const [prizeName, setPrizeName] = useState();
  const [gender, setGender] = useState();
  const [rankPrize, setRankPrize] = useState();
  const [coupleFlag, setCoupleFlag] = useState(false);
  const navigate = useNavigate();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const animatedComponents = makeAnimated();

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const data = {
        prize_name: prizeName,
        type: gender.toLowerCase(),
        couple_flag: gender === "Couple" ? true : false,
        prize_rank: rankPrize,
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        console.log("key", key, "value", value);
        formData.append(key, value);
      });

      const response = await makeApiCall(
        "post",
        "judge/createprizecategories",
        formData,
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
    if (prizeName && gender && rankPrize) {
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
    navigate("/role/superadmin/judgedashboard/price-category");
  };

  const genderData = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Couple", label: "Couple" },
  ];

  const rankPrizeData = [
    { value: "01", label: "01" },
    { value: "02", label: "02" },
    { value: "03", label: "03" },
    { value: "04", label: "04" },
    { value: "05", label: "05" },
    { value: "06", label: "06" },
    { value: "07", label: "07" },
    { value: "08", label: "08" },
    { value: "09", label: "09" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ];

  //   const handleNumberChange = async (e) => {
  //     const inputValue = e.target.value;

  //     // Remove non-numeric characters
  //     const numericValue = inputValue.replace(/[^0-9]/g, "");

  //     // Limit the number to 10 digits
  //     if (numericValue.length <= 10) {
  //       setPhoneNo(numericValue)
  //       const isExist = await handleNumberValidate(numericValue);
  //       if (isExist && isExist.data.status == 1) {
  //         switch (isExist.data.data.roles) {
  //           case "superadmin":
  //             setIsAlert(true);
  //             setStatus("error");
  //             setErrorMsg(
  //               `User already exists as a ${isExist.data.data.roles}. Try with another number.`
  //             );
  //             break;
  //           case "garbaclassowner":
  //             setIsAlert(true);
  //             setStatus("error");
  //             setErrorMsg(
  //               `User already exists as a ${isExist.data.data.roles}. Try with another number.`
  //             );
  //             break;
  //           case "classowner":
  //             setIsAlert(true);
  //             setStatus("error");
  //             setErrorMsg(
  //               `User already exists as a ${isExist.data.data.roles}. Try with another number.`
  //             );
  //             break;
  //           case "p-user":
  //             setIsAlert(true);
  //             setStatus("error");
  //             setErrorMsg(
  //               `User already exists as a ${isExist.data.data.roles}. Try with another number.`
  //             );
  //             break;
  //           case "n-user":
  //             console.log(e.target.value, "Contact number");
  //             setPhoneNo(e.target.value);
  //             break;
  //           default:
  //             setPhoneNo(e.target.value);
  //             break;
  //         }
  //       } else {
  //         setPhoneNo(e.target.value);
  //       }
  //     }
  //   };

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
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[100px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="flex flex-col gap-[25px] justify-start items-center">
            <div className="w-full">
              <InputField
                type="text"
                placeholder={`Prize Name`}
                inputPlaceholder={"Enter Prize name"}
                value={prizeName}
                handleChange={(e) => setPrizeName(e.target.value)}
                disabled={false}
              />
            </div>

            {/* <div className="w-full">
        <PhoneNumberInput value={phoneNo} handleChange={handleNumberChange} />
          </div> */}

            <div className="text w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Gender</p>
              <div className="authorizedNameInput w-full p-2 h-14 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  <Select
                    options={genderData}
                    components={animatedComponents}
                    placeholder="Select Gender"
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

            <div className="text w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Prize Rank</p>
              <div className="authorizedNameInput w-full p-2 h-14 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  <Select
                    options={rankPrizeData}
                    components={animatedComponents}
                    placeholder="Select Prize Rank"
                    name="rankPrize"
                    onChange={(e) => {
                      setRankPrize(e.value);
                    }}
                    className="basic-multi-select h-full flex item-center bg-transparent"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-16 mb-24">
            <PrimaryButton
              background={"primary-button"}
              handleClick={handleClick}
              title={"Submit"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPriceCategory;
