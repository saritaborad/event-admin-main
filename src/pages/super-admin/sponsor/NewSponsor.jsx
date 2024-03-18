import React, { useState, useEffect } from "react";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import InputField from "../../../componets/ui-elements/InputField";
import { makeApiCall } from "../../../api/Post";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../../componets/ui-elements/ImageUpload";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  filterByProperty,
  handleNumberValidate,
} from "../../../utils/CommonFunctions";
import Alert from "../../../componets/ui-elements/Alert";
import PhoneNumberInput from "../../../componets/ui-elements/PhoneNumberInput";

const NewSponsor = () => {
  const [name, setName] = useState();
  const [companyName, setCompanyName] = useState();
  const [companyLogo, setCompanyLogo] = useState();
  const [authoPerson, setAutoPerson] = useState();
  const [authoPersonImage, setAutoPersonImage] = useState();
  const [number, setNumber] = useState();
  const [zone, setZone] = useState([]);
  const [parking, setParking] = useState([]);
  const [balance, setBalance] = useState();
  const [profile, setProfile] = useState();
  const [banner, setBanner] = useState();
  const [status, setStatus] = useState("start");
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();
  const [zoneData, setZoneData] = useState([]);
  const [parkingData, setParkingData] = useState([]);
  const [params, setParams] = useState({});
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const [companyLogoDispaly, setCompanyLogoDispaly] = useState();
  const [profileDisplay, setProfileDisplay] = useState();
  const [bannerDisplay, setBannerDisplay] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const maxFileSize = 9 * 1024 * 1024; // 9mb
  const [fileSizeExceededLogo, setFileSizeExceededLogo] = useState(false);
  const [fileSizeExceededProfile, setFileSizeExceededProfile] = useState(false);
  const [fileSizeExceededBanner, setFileSizeExceededBanner] = useState(false);

  const handleFileChange = (sponsor, name) => {
    const file = sponsor.target.files[0];

    if (file) {
      if (name === "companyLogo") {
        if (file.size < maxFileSize) {
          setFileSizeExceededLogo(false);
          setCompanyLogo(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result;
            setCompanyLogoDispaly(base64String);
          };
          reader.readAsDataURL(file);
        } else {
          setFileSizeExceededLogo(true);
        }
      } else if (name === "profile") {
        if (file.size < maxFileSize) {
          setFileSizeExceededProfile(false);
          setProfile(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result;
            setProfileDisplay(base64String);
          };
          reader.readAsDataURL(file);
        } else {
          setFileSizeExceededProfile(true);
        }
      } else {
        if (file.size < maxFileSize) {
          setFileSizeExceededBanner(false);
          setBanner(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result;
            setBannerDisplay(base64String);
          };
          reader.readAsDataURL(file);
        } else {
          setFileSizeExceededBanner(true);
        }
      }
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");
    // Perform any action needed on confirmation
    try {

      const params = {
        profile_pic: profile,
        company_logo: companyLogo,
        authorized_person_photo: banner,
        name: name,
        phone_number: number,
        company_name: companyName,
        authorized_person: authoPerson,
        parking: parking,
        balance_alloted: balance,
        zone: zone,
      };

      const formData = new FormData();
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await makeApiCall(
        "post",
        "sponsor/create",
        formData,
        "formdata"
      );
      console.log(response.data.message);
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
      }
      // setIsAlert(false);
      // setLoading(true);
    } catch (error) {
      console.warn(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
    // Swal.fire("Check Point Create", "Done", "success");
  };

  const fetchData = async () => {

    const responseZone = await makeApiCall(
      "get",
      "zone/all",
      null,
      "raw"
    );
    console.log(responseZone);
    const filterZone = responseZone.data.tickets;
    const result = filterByProperty(
      filterZone,
      "ticket_zone",
      true,
      null,
      "raw"
    );
    const zoneOptions = result.map((zone) => ({
      value: zone._id,
      label: zone.zone_name,
    }));
    setZoneData(zoneOptions);

    const responseParking = await makeApiCall(
      "get",
      "parking/all",
      null,
      "raw"
    );

    const parkingOptions = responseParking.data.data.map((parking) => ({
      value: parking._id,
      label: parking.parking_name,
    }));

    setParkingData(parkingOptions);
  };

  const handleComplete = () => {
    navigate("/role/superadmin/sponsordashboard/sponsor");
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleClick = () => {
    if (
      number.length === 10 &&
      companyLogoDispaly &&
      profileDisplay &&
      bannerDisplay &&
      name &&
      companyName &&
      zone &&
      parking &&
      balance
    ) {
      setIsAlert(true);
      setStatus("start");
    } else {
      setIsAlert(true);
      setStatus("error");
      setErrorMsg("Please fill all field");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNumberChange = async (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric characters
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    // Limit the number to 10 digits
    if (numericValue.length <= 10) {
      setNumber(numericValue);
      const isExist = await handleNumberValidate(numericValue);
      console.log(isExist)
      if (isExist && isExist.data.status == 1) {
        // if (isExist.data.data.roles === "n-user") {
        //   console.log(e.target.value, "Contact number");
        //   setNumber(e.target.value);
        // } else {
          setIsAlert(true);
          setStatus("error");
          setErrorMsg(
            `User already exists as a ${isExist.data.data.roles}. Try with another number.`
          );
        // }
      } else {
        setNumber(e.target.value);
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
      <div className="h-auto p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[40px] justify-between md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
        <div className="companyLogo mt-3">
          <ImageUpload
            id={"companyLogoFile"}
            handleChange={(e) => handleFileChange(e, "companyLogo")}
            source={companyLogoDispaly}
            heading={"Company Logo"}
            height={"h-auto min-h-56"}
            label={companyLogo ? "Replace image" : "Upload image"}
          />
          {fileSizeExceededLogo && (
            <p className="error text-red-500">
              File size exceeded the limit of 9 mb
            </p>
          )}
        </div>
        <div className="profile mt-3">
          <ImageUpload
            id={"ProfileFile"}
            handleChange={(e) => handleFileChange(e, "profile")}
            source={profileDisplay}
            heading={"Authorized Person Photo"}
            height={"h-auto min-h-56"}
            label={profile ? "Replace image" : "Upload image"}
          />
          {fileSizeExceededProfile && (
            <p className="error text-red-500">
              File size exceeded the limit of 9 mb
            </p>
          )}
        </div>
        <div className="banner mt-3">
          <ImageUpload
            id={"bannerFile"}
            handleChange={(e) => handleFileChange(e, "banner")}
            source={bannerDisplay}
            heading={"Banner"}
            height={"h-auto min-h-56"}
            label={banner ? "Replace image" : "Upload image"}
          />
          {fileSizeExceededBanner && (
            <p className="error text-red-500">
              File size exceeded the limit of 9 mb
            </p>
          )}
        </div>

        <div className="w-full h-auto flex mt-5 flex-col gap-2">
          <InputField
            type={"text"}
            placeholder={"Name"}
            inputPlaceholder={"Enter Name"}
            name="name"
            value={name}
            handleChange={(e) => setName(e.target.value)}
          />
          <InputField
            type={"text"}
            placeholder={"Company Name"}
            inputPlaceholder={"Enter Company Name"}
            name="companyName"
            value={companyName}
            handleChange={(e) => setCompanyName(e.target.value)}
          />
          <InputField
            type={"text"}
            placeholder={"Authorized Person"}
            inputPlaceholder={"Enter Authorized Person"}
            name="authoPerson"
            value={authoPerson}
            handleChange={(e) => setAutoPerson(e.target.value)}
          />
          {/* <InputField
            type={"number"}
            placeholder={"Contact Number"}
            inputPlaceholder={"Enter Contact Number"}
            name="number"
            value={number}
            handleChange={(e) => setNumber(e.target.value)}
          /> */}
          <PhoneNumberInput value={number} handleChange={handleNumberChange} />
          <div className="text w-full">
            <p className="text-[14px] font-semibold ms-1 my-1">Zone</p>
            <div className="authorizedNameInput h-[55px] p-2 border border-gray-300 rounded-lg">
              <div className="authorizedName flex items-center h-full">
                <Select
                  options={zoneData}
                  components={animatedComponents}
                  isMulti
                  name="zone"
                  placeholder="Select Zone"
                  onChange={(e) =>
                    e.map((zoneItem) => setZone([...zone, zoneItem.value]))
                  }
                  className="basic-multi-select h-full flex item-center bg-transparent"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>

          <div className="text w-full">
            <p className="text-[14px] font-semibold ms-1 my-1">Parking</p>
            <div className="authorizedNameInput h-[55px] p-2 border border-gray-300 rounded-lg">
              <div className="authorizedName flex items-center h-full">
                <Select
                  options={parkingData}
                  components={animatedComponents}
                  isMulti
                  name="parking"
                  placeholder="Select Parking"
                  onChange={(e) =>
                    e.map((parkingItem) =>
                      setParking([...parking, parkingItem.value])
                    )
                  }
                  className="basic-multi-select h-full flex item-center bg-transparent"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>

          <InputField
            type={"number"}
            placeholder={"Balance Alloted"}
            inputPlaceholder={"Enter Balance Alloted"}
            name="balance"
            value={balance}
            handleChange={(e) => setBalance(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center pb-5 mt-16 w-full mb-24">
          <PrimaryButton
            title={"Submit"}
            background={"primary-button"}
            handleClick={handleClick}
          />
        </div>
        </div>
      </div>
    </>
  );
};

export default NewSponsor;
