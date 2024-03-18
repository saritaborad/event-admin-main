import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { makeApiCall } from "../../../api/Post";
import { BsPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import InputField from "../../../componets/ui-elements/InputField";
import Alert from "../../../componets/ui-elements/Alert";
import ImageUpload from "../../../componets/ui-elements/ImageUpload";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  filterByProperty,
  handleNumberValidate,
} from "../../../utils/CommonFunctions";
import PhoneNumberInput from "../../../componets/ui-elements/PhoneNumberInput";

const NewCouch = () => {
  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [sofaDetails, setSofaDetails] = useState([]);
  const [contact, setContact] = useState();
  const [image, setImage] = useState();
  const [displayImage, setDisplayImage] = useState();
  const [zoneData, setZoneData] = useState();
  const [sofaZone, setSofaZone] = useState();
  const [sofaNumber, setSofaNumber] = useState([]);
  const [parking, setParking] = useState();
  const [parkingData, setParkingData] = useState([]);

  const navigate = useNavigate();
  const maxFileSize = 9 * 1024 * 1024; // 9mb
  const [fileSizeExceeded, setFileSizeExceeded] = useState(false);

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const animatedComponents = makeAnimated();

  const [sofaGroup, setSofaGroup] = useState([]);

  const addTaxGroup = () => {
    setSofaGroup([...sofaGroup, {}]);
  };
  //Handle branch input ================ >
  const handleFileChange = (couch, name) => {
    const file = couch.target.files[0];
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

    const data = {
      phone_number: contact,
      name: name,
      gender: gender,
      sofa_ids: JSON.stringify(sofaDetails),
      profile_pic: image,
    };

    console.log(data);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await makeApiCall(
        "post",
        "sofa/addmember",
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
    navigate("/role/superadmin/couch");
  };

  const getSofa = async (sofaSec) => {
    const responseSofa = await makeApiCall(
      "post",
      "sofa/seating",
      { main_section: sofaZone, sofa_section: sofaSec },
      "raw"
    );
    console.log(responseSofa, "Sofa in response of sofa/seating");
    const rawSofa = responseSofa.data.data?.map((sofa) => ({
      value: sofa._id,
      label: sofa.sofa_name,
    }));
    setSofaNumber(rawSofa);
  };

  const sofaRemove = (index) => {
    const updatedSofa = [...sofaGroup];
    updatedSofa.splice(index, 1);
    setSofaGroup(updatedSofa);
  };

  const genderData = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const sofaSectionData = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
  ];

  const getAllZone = async () => {
    try {
      const response = await makeApiCall("get", "/zone/all", null, "raw");
      console.log(response);
      if (response.data.tickets != null) {
        const rawZone = response.data.tickets;
        const notDeletedZone = filterByProperty(rawZone, "is_deleted", false);
        const privilegeZone = filterByProperty(
          notDeletedZone,
          "is_privilege",
          true
        );
        const filterZone = privilegeZone.map((zone) => ({
          value: zone._id,
          label: zone.zone_name,
        }));

        setZoneData(filterZone);
      } else {
        alert("Pass-zone list is empty");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllZone();
  }, []);

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
                placeholder={"Member Name"}
                inputPlaceholder={"Enter Member name"}
                value={name}
                handleChange={(e) => setName(e.target.value)}
                disabled={false}
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
                    name="gender"
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
              type="number"
              placeholder={"Phone Number"}
              inputPlaceholder={"Enter Phone Number"}
              value={conatact}
              // handleChange={(e) => setNumber(e.target.value)}
              handleChange={handleNumberChange}
              disabled={false}
            />
          </div> */}

            <div className="w-full">
              <PhoneNumberInput
                value={contact}
                handleChange={handleNumberChange}
              />
            </div>

            {sofaGroup.length != 0 ? (
              <p className="w-full text-left font-bold text-primary">
                Sofa list
              </p>
            ) : null}

            {sofaGroup.map((i, index) => {
              const temporarySofaDetails = [...sofaDetails];
              return (
                <>
                  <div
                    className="addMore flex flex-col items-start gap-[10px] border border-gray-300 w-full bg-gray-100 p-4  rounded-md"
                    key={i}
                  >
                    <div className="w-full">
                      <p className="text-[14px] text-black font-semibold">
                        Select Zone
                      </p>
                      <div className="w-full h-full p-2 border border-gray-300 rounded-lg">
                        <div className="authorizedName flex items-center h-full">
                          <Select
                            options={zoneData}
                            components={animatedComponents}
                            // placeholder="Select Sofa Zone"
                            name="event_day"
                            onChange={(e) => {
                              // e[0].setCheckpoint([...checkpoint, checkpointItem.value])
                              setSofaZone(e.label);
                              temporarySofaDetails[index] = {
                                ...temporarySofaDetails[index],
                                zone_id: e.value,
                              };
                              setSofaDetails(temporarySofaDetails);
                            }}
                            className="basic-multi-select h-full flex item-center bg-transparent"
                            classNamePrefix="select"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text w-full">
                      <p className="text-[14px] font-semibold ms-1 mb-1">
                        Sofa Section
                      </p>
                      <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                        <div className="authorizedName flex items-center h-full">
                          <Select
                            options={sofaSectionData}
                            components={animatedComponents}
                            isMulti={false}
                            name="sofaSection"
                            placeholder="Select Sofa Section"
                            onChange={(e) =>
                              //     e.map((sofaNumber) => setSofaNumber([...sofaNumber, sofaNumber.value]))
                              {
                                // setSofaSection();
                                getSofa(e.value);
                              }
                            }
                            className="basic-multi-select h-full flex item-center bg-transparent"
                            classNamePrefix="select"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text w-full">
                      <p className="text-[14px] font-semibold ms-1 mb-1">
                        Sofa Number
                      </p>
                      <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                        <div className="authorizedName flex items-center h-full">
                          <Select
                            options={sofaNumber}
                            components={animatedComponents}
                            // isMulti
                            name="zone"
                            placeholder="Select Sofa Number"
                            onChange={(e) => {
                              temporarySofaDetails[index] = {
                                ...temporarySofaDetails[index],
                                sofa_id: e.value,
                              };
                              setSofaDetails(temporarySofaDetails);
                            }}
                            className="basic-multi-select h-full flex item-center bg-transparent"
                            classNamePrefix="select"
                          />
                        </div>
                      </div>
                    </div>

                    <p
                      className="text-right bg-gray-200 p-2 w-auto cursor-pointer"
                      onClick={() => sofaRemove(index)}
                    >
                      Remove
                    </p>
                  </div>
                  <hr className="w-full" />
                </>
              );
            })}

            <div
              className={`addBranchButton py-2 border-2 border-gray-300 rounded-2xl flex justify-center w-full cursor-pointer`}
              onClick={addTaxGroup}
            >
              <p className=" flex items-center font-medium ">
                <BsPlus className="text-3xl me-3" />
                Add Sofa
              </p>
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

export default NewCouch;
