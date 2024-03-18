import React, { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import InputField from "../../../componets/ui-elements/InputField";
import { makeApiCall } from "../../../api/Post";
import {
  filterByProperty,
  handleNumberValidate,
} from "../../../utils/CommonFunctions";

//-- import from react-select
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Alert from "../../../componets/ui-elements/Alert";
import ImageUpload from "../../../componets/ui-elements/ImageUpload";
import PhoneNumberInput from "../../../componets/ui-elements/PhoneNumberInput";

const NewGarba = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [params, setParams] = useState({});

  const [garbaImage, setGarbaImage] = useState();
  const [ownerImage, setOwnerImage] = useState();
  const [garbaDisplayImage, setGarbaDisplayImage] = useState();
  const [ownerDisplayImage, setOwnerDisplayImage] = useState();
  const [garbaName, setGarbaName] = useState();
  const [email, setEmail] = useState();
  const [ownerName, setOwnerName] = useState();
  const [ownerContect, setOwnerContact] = useState();
  const [garbaOwner, setGarbaOwner] = useState();
  const [since, setSince] = useState();
  const [address, setAddress] = useState();
  const [area, setArea] = useState();
  const [instaID, setInstaId] = useState();
  const [branchGroup, setBranchGroup] = useState([]);
  const [zone, setZone] = useState();
  const [alertStatus, setAlertStatus] = useState();

  const [isZoneList, setIsZoneList] = useState(false);
  const [zoneData, setZoneData] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const navigate = useNavigate();

  const maxFileSize = 9 * 1024 * 1024; // 9mb
  const [fileSizeExceededLogo, setFileSizeExceededLogo] = useState(false);
  const [fileSizeExceededImage, setFileSizeExceededImage] = useState(false);

  const data = {
    garba_classname: garbaName,
    instagram_id: instaID,
    garba_class_area: area,
    garba_class_address: address,
    owner_email: "test@gmail.com",
    owner_name: ownerName,
    owner_contact_number: ownerContect,
    garba_class_since: since,
    owner_profile_pic: ownerImage,
    garba_class_logo: garbaImage,
  };

  //fetch zone_list =============>
  const fetchData = async () => {
    const response = await makeApiCall("get", "zone/all", null, "raw");
    const filterData = response.data.tickets;
    console.log(filterData);
    if (filterData?.length > 0) {
      const result = filterByProperty(filterData, "pass_zone", true);

      const zoneOption = result?.map((zone) => ({
        value: zone._id,
        label: zone.zone_name + " (₹" + zone.price + ")",
      }));
      setZoneData(zoneOption);
    }
    return response;
  };

  useEffect(() => {
    fetchData();
  }, []);

  //add new branch ================ >
  const addBranchGroup = () => {
    setBranchGroup([...branchGroup, {}]);
  };

  //Handle branch input ================ >
  const handleGroupChage = (e, index) => {
    const { name, value } = e.target;
    const updatedGroups = [...branchGroup];
    updatedGroups[index][name] = value;
    setBranchGroup(updatedGroups);
  };

  //handle file input and change type to bas64 ================ >
  const handleFileChange = (event, name) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        switch (name) {
          case "garba_logo":
            if (file.size < maxFileSize) {
              setFileSizeExceededLogo(false);
              setGarbaDisplayImage(base64String);
              setGarbaImage(file);
            } else {
              setFileSizeExceededLogo(true);
            }
            break;
          case "owner_image":
            if (file.size < maxFileSize) {
              setFileSizeExceededImage(false);
              setOwnerDisplayImage(base64String);
              setOwnerImage(file);
              setParams((values) => ({
                ...values,
                owner_profile_pic: file,
              }));
            } else {
              setFileSizeExceededImage(true);
            }
            break;
          default:
            console.log("name need to be passed");
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  //call api and send data backend  ================ >
  const handleConfirm = async (e) => {
    console.log(ownerContect);

    setStatus("loading");
    const formData = new FormData();

    console.log(data);

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("zone_id", zone);
    formData.append("branch_list", JSON.stringify(branchGroup));

    console.log("Contents of FormData:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await makeApiCall(
        "post",
        "garbaclass/create",
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
      setStatus("error");
      setErrorMsg(error);
    }
  };

  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setParams((values) => ({ ...values, [name]: value }));
  };

  const handleAlert = (e) => {
    e.preventDefault();
    console.log(data);
    const isValidParams = () => {
      return Object.values(data).every(
        (value) => value !== null && value !== undefined
      );
    };
    if (isValidParams()) {
      setIsAlert(true);
      setStatus("start");
    } else {
      setIsAlert(true);
      setStatus("error");
      setErrorMsg("Please fill all field");
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    navigate("/role/superadmin/garba-class");
  };

  const handleChange = async (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric characters
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    // Limit the number to 10 digits
    if (numericValue.length <= 10) {
      setOwnerContact(numericValue);
      const isExist = await handleNumberValidate(numericValue);
      if (isExist && isExist.data.status == 1) {
        // switch (isExist.data.data.roles) {
        //   case "superadmin":
        //     setIsAlert(true);
        //     setStatus("error");
        //     setErrorMsg(
        //       `User already exists as a ${isExist.data.data.roles}. Try with another number.`
        //     );
        //     break;
        //   case "garbaclassowner":
        //     setIsAlert(true);
        //     setStatus("error");
        //     setErrorMsg(
        //       `User already exists as a ${isExist.data.data.roles}. Try with another number.`
        //     );
        //     break;
        //   case "classowner":
        //     setIsAlert(true);
        //     setStatus("error");
        //     setErrorMsg(
        //       `User already exists as a ${isExist.data.data.roles}. Try with another number.`
        //     );
        //     break;
        //   case "p-user":
        //     setIsAlert(true);
        //     setStatus("error");
        //     setErrorMsg(
        //       `User already exists as a ${isExist.data.data.roles}. Try with another number.`
        //     );
        //     break;
        //   case "n-user":
        //     console.log(e.target.value, "Contact number");
        //     setOwnerContact(e.target.value);
        //     break;
        //   default:
        //     setOwnerContact(e.target.value);
        //     break;
        // }
        if (isExist.data.data.roles === "n-user") {
          console.log(e.target.value, "Contact number");
          setOwnerContact(e.target.value);
        } else {
          setIsAlert(true);
          setStatus("error");
          setErrorMsg(
            `User already exists as a ${isExist.data.data.roles}. Try with another number.`
          );
        }
      } else {
        setOwnerContact(e.target.value);
      }
    }
  };

  const animatedComponents = makeAnimated();

  const branchRemove = (index) => {
    const updatedBranch = [...branchGroup];
    updatedBranch.splice(index, 1);
    setBranchGroup(updatedBranch);
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
      <div className="CreateGarbaClass m-[2px] bg-white rounded-[30px] mt-4 flex flex-col gap-[40px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        {/* <a href="sms:7359312739">Call</a> */}
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <form>
            <div className="m-4 flex flex-col gap-[20px]">
              <ImageUpload
                id={"file"}
                handleChange={(e) => handleFileChange(e, "garba_logo")}
                source={garbaDisplayImage}
                heading={"Garba class logo"}
                height={"h-auto min-h-56"}
                label={garbaDisplayImage ? "Replace image" : "Upload image"}
              />
              {fileSizeExceededLogo && (
                <p className="error text-red-500">
                  File size exceeded the limit of 9 mb
                </p>
              )}
              <ImageUpload
                id={"files"}
                handleChange={(e) => handleFileChange(e, "owner_image")}
                source={ownerDisplayImage}
                heading={"Class owner photo"}
                height={"h-auto min-h-56"}
                label={ownerDisplayImage ? "Replace image" : "Upload image"}
              />
              {fileSizeExceededImage && (
                <p className="error text-red-500">
                  File size exceeded the limit of 9 mb
                </p>
              )}
            </div>
            <div className="flex flex-col gap-[10px] p-4">
              <InputField
                type={"text"}
                placeholder={"Garba Class Name"}
                inputPlaceholder="Garba Class Name"
                name="garba_classname"
                value={params.garba_classname}
                handleChange={(e) => setGarbaName(e.target.value)}
              />
              {/* <InputField
              type={"email"}
              placeholder={"Owner Email"}
              inputPlaceholder="Owner Email"
              icon={<MdOutlineEmail className="text-2xl" />}
              name="owner_email"
              value={params.owner_email}
              handleChange={(e) => setEmail(e.target.value)}
            /> */}
              <InputField
                type={"text"}
                placeholder={"Owner Name"}
                inputPlaceholder="Owner Name"
                name="owner_name"
                value={params.owner_name}
                handleChange={(e) => setOwnerName(e.target.value)}
              />
              {/* <InputField
              type={"number"}
              placeholder={"Owner Contact Number"}
              inputPlaceholder="Owner Contact Number"
              name="owner_contact_number"
              value={params.owner_contact_number}
              // handleChange={(e) => setOwnerContact(e.target.value)}
              handleChange={handleNumberValidate}
            /> */}

              <PhoneNumberInput
                value={ownerContect}
                handleChange={handleChange}
              />

              <InputField
                type={"number"}
                placeholder={"Since"}
                inputPlaceholder="Since"
                name="garba_class_since"
                value={params.garba_class_since}
                handleChange={(e) => setSince(e.target.value)}
              />
              <InputField
                type={"text"}
                placeholder={"Address"}
                inputPlaceholder="Address"
                name="garba_class_address"
                value={params.garba_class_address}
                handleChange={(e) => setAddress(e.target.value)}
              />
              <InputField
                type={"text"}
                placeholder={"Area"}
                inputPlaceholder="Area"
                name="garba_class_area"
                value={params.garba_class_area}
                handleChange={(e) => setArea(e.target.value)}
              />
              <InputField
                type={"text"}
                placeholder={"Instagram ID"}
                inputPlaceholder="Instagram ID"
                name="instagram_id"
                value={params.instagram_id}
                handleChange={(e) => setInstaId(e.target.value)}
              />
              <div className="text">
                <p className="text-[14px] font-semibold ms-1 mb-1">Zone</p>
                <div
                  className="authorizedNameInput w-full h-16 flex border border-gray-300 rounded-lg"
                  onClick={() => setIsZoneList(!isZoneList)}
                >
                  <div className="authorizedName flex items-center w-full h-full">
                    {/* <p className="px-5">
                  <BsGeo className="text-2xl" />
                </p> */}
                    <Select
                      options={zoneData}
                      components={animatedComponents}
                      name="zone"
                      placeholder="Select zone"
                      onChange={(e) => setZone(e.value)}
                      className="basic-multi-select h-full flex item-center bg-transparent"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
              </div>
              {branchGroup.length != 0 ? (
                <p className="w-full text-left font-bold text-primary">
                  {" "}
                  Add Branch
                </p>
              ) : null}
              {branchGroup.map((branch, index) => {
                return (
                  <>
                    <div className="addMore flex flex-col items-start gap-[10px] bg-gray-100 border-gray-300 border rounded-lg p-3">
                      <InputField
                        type={"text"}
                        placeholder={"Branch Name"}
                        inputPlaceholder="Branch Name"
                        name={"branch_name"}
                        value={branchGroup.branch_name}
                        handleChange={(e) => handleGroupChage(e, index)}
                      />
                      <InputField
                        type={"text"}
                        placeholder={"Branch Owner Name"}
                        inputPlaceholder="Branch Owner Name"
                        name={"branch_owner_name"}
                        value={branchGroup.branch_owner_name}
                        handleChange={(e) => handleGroupChage(e, index)}
                      />
                      <PhoneNumberInput
                        value={branchGroup.branch_owner_number}
                        handleChange={(e) => handleGroupChage(e, index)}
                      />
                      <InputField
                        type={"text"}
                        placeholder={"Branch address"}
                        inputPlaceholder={"Branch address"}
                        name={"branch_address"}
                        value={branchGroup.branch_address}
                        handleChange={(e) => handleGroupChage(e, index)}
                      />
                      <p
                        className="text-right bg-gray-200 p-2 w-auto cursor-pointer"
                        onClick={() => branchRemove(index)}
                      >
                        Remove
                      </p>
                    </div>
                    <hr />
                  </>
                );
              })}

              <div
                className={`addBranchButton py-2 border-2 border-gray-300 rounded-2xl flex justify-center cursor-pointer`}
                onClick={addBranchGroup}
              >
                <p className=" flex items-center font-medium">
                  <BsPlus className="text-3xl me-3" />
                  Add Branch
                </p>
              </div>

              <div className="save&Clearbutton mx-5 mt-16 flex gap-2 justify-between mb-24">
                <PrimaryButton
                  title={"Submit"}
                  background={"primary-button"}
                  handleClick={handleAlert}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewGarba;
