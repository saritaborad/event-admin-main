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
import PhoneNumberInput from "../../../../componets/ui-elements/PhoneNumberInput";

const NewSecurityMember = () => {
  const params = useParams();

  const [securityName, setSecurityName] = useState();
  const [gender, setGender] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [profilePic, setProfilePic] = useState();
  const [DisplayProfilePic, setDisplayProfilePic] = useState();
  const navigate = useNavigate();

  const [zoneData, setZoneData] = useState();
  const [checkpointData, setCheckPointData] = useState();
  const [parkingData, setParkingData] = useState();
  const [gateData, setGateData] = useState();

  const [gate, setGate] = useState();
  const [zone, setZone] = useState();
  const [parking, setParking] = useState();
  const [checkPoint, setCheckPoint] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const animatedComponents = makeAnimated();

  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
    setProfilePic(file);
    // console.log(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setDisplayProfilePic(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const data = {
        profile_pic: profilePic,
        guard_name: securityName,
        phone_number: phoneNo,
        guard_gender: gender,
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await makeApiCall(
        "post",
        "guard/create",
        formData,
        "formdata"
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
    // Swal.fire("Garba Class Create", "Done", "success");
  };

  const handleClick = () => {
    if (securityName && phoneNo && gender) {
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
    navigate("/role/superadmin/securitydashboard/security-member");
  };

  const fetchData = async () => {
    const responseGate = await makeApiCall("get", "gate/all", null, "raw");
    if (responseGate.data.status == 1) {
      const gateOptions = responseGate?.data.gates.map((gate) => ({
        value: gate._id,
        label: gate.gate_name,
      }));
      setGateData(gateOptions);
    }
    const responseParking = await makeApiCall(
      "get",
      "parking/all",
      null,
      "raw"
    );
    if (responseParking.data.status == 1) {
      const notDeleteParking = filterByProperty(
        responseParking.data.data,
        "is_deleted",
        false
      );
      const parkingOptions = notDeleteParking.map((parking) => ({
        value: parking._id,
        label: parking.parking_name,
      }));
      setParkingData(parkingOptions);
    }

    const responseCheckpoint = await makeApiCall(
      "get",
      "checkpoint/all",
      null,
      "raw"
    );

    if (responseCheckpoint.data.status == 1) {
      const notDeletedZone = filterByProperty(
        responseCheckpoint.data.data,
        "is_deleted",
        false
      );
      const checkPointOptions = notDeletedZone.map((checkpoint) => ({
        value: checkpoint._id,
        label: checkpoint.checkpoint_name,
      }));
      setCheckPointData(checkPointOptions);
    }

    const responseZone = await makeApiCall("get", "zone/all", null, "raw");

    if (responseZone.data.status == 1) {
      const rawZone = responseZone.data.tickets;
      const notDeleted = filterByProperty(rawZone, "is_deleted", false);
      const result = filterByProperty(notDeleted, "ticket_zone", true);
      const zoneOptions = result.map((zone) => ({
        value: zone._id,
        label: zone.zone_name,
      }));

      setZoneData(zoneOptions);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const genderData = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  // const handleNumberValidate = async (e) => {
  //   const userDataString = localStorage.getItem("user");
  //   const userData = JSON.parse(userDataString);
  //   if (e.target.value.length === 10) {
  //     try {
  //       const isExist = await handleNumberValidate(e.target.value);
  //       if (isExist.data.status == 1) {
  //         if (isExist.data.data.roles === "n-user") {
  //           setPhoneNo(e.target.value);
  //         } else {
  //           setIsAlert(true);
  //           setStatus("error");
  //           setErrorMsg(
  //             `User already exist as a ${isExist.data.data.roles} try with other number`
  //           );
  //         }
  //       } else {
  //         setPhoneNo(e.target.value);
  //       }
  //     } catch (error) {
  //       console.error(error, "From catch");
  //     }
  //   }
  // };

  const handleNumberChange = async (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric characters
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    // Limit the number to 10 digits
    if (numericValue.length <= 10) {
      setPhoneNo(numericValue);
      const isExist = await handleNumberValidate(numericValue);
      if (isExist && isExist.data.status == 1) {
        if (isExist.data.data.roles === "n-user") {
          console.log(e.target.value, "Contact number");
          setPhoneNo(e.target.value);
        } else {
          setIsAlert(true);
          setStatus("error");
          setErrorMsg(
            `User already exists as a ${isExist.data.data.roles}. Try with another number.`
          );
        }
      } else {
        setPhoneNo(e.target.value);
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
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[100px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="flex flex-col gap-[25px] justify-start items-center">
            <div className="eventImage flex flex-col gap-3 justify-center items-center ">
              <div className="authorizedPersonAvtar">
                <ImageUpload
                  id={"file"}
                  handleChange={(e) => handleFileChange(e, "image")}
                  source={DisplayProfilePic}
                  heading={"Image"}
                  height={"h-auto min-h-56"}
                  label={DisplayProfilePic ? "Replace image" : "Upload image"}
                  // handleDelete={()=>handleDelete("landscap")}
                />
              </div>
            </div>

            <div className="w-full">
              <InputField
                type="text"
                placeholder={`Name`}
                inputPlaceholder={"Enter Security name"}
                value={securityName}
                handleChange={(e) => setSecurityName(e.target.value)}
                disabled={false}
              />
            </div>

            <div className="w-full">
              <PhoneNumberInput
                handleChange={handleNumberChange}
                value={phoneNo}
              />
            </div>

            <div className="text w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Gender</p>
              <div className="authorizedNameInput w-full p-2 h-full border border-gray-300 rounded-lg">
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
            {/* 
          <div className="text w-full">
            <p className="text-[14px] font-semibold ms-1 mb-1">Zone</p>
            <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
              <div className="authorizedName flex items-center h-full">
                <Select
                  options={zoneData}
                  components={animatedComponents}
                  name="zone"
                  placeholder="Select Zone"
                  onChange={(e) => setZone(e.value)}
                  className="basic-multi-select h-full flex item-center bg-transparent"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>

          <div className="text w-full">
            <p className="text-[14px] font-semibold ms-1 mb-1">Check Point</p>
            <div className="authorizedNameInput w-full p-2 h-full border border-gray-300 rounded-lg">
              <div className="authorizedName flex items-center h-full">
                <Select
                  options={checkpointData}
                  components={animatedComponents}
                  placeholder="Select Checkpoint"
                  name="checkpoint"
                  onChange={(e) => setCheckPoint(e.value)}
                  className="basic-multi-select h-full flex item-center bg-transparent"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>

          <div className="text w-full">
            <p className="text-[14px] font-semibold ms-1 mb-1">Parking</p>
            <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
              <div className="authorizedName flex items-center h-full">
                <Select
                  options={parkingData}
                  components={animatedComponents}
                  name="parking"
                  placeholder="Select Parking"
                  onChange={(e) => setParking(e.value)}
                  className="basic-multi-select h-full flex item-center bg-transparent"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>

          <div className="text w-full">
            <p className="text-[14px] font-semibold ms-1 mb-1">Gate</p>
            <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
              <div className="authorizedName flex items-center h-full">
                <Select
                  options={gateData}
                  components={animatedComponents}
                  name="gate"
                  placeholder="Select Gate"
                  onChange={(e) => setGate(e.value)}
                  className="basic-multi-select h-full flex item-center bg-transparent"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div> */}
          </div>
          <div className="flex items-center mt-16 gap-4 mb-24">
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

export default NewSecurityMember;
