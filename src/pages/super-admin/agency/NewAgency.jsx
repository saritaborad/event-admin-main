import React, { useState } from "react";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import InputField from "../../../componets/ui-elements/InputField";
import { makeApiCall } from "../../../api/Post";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../../componets/ui-elements/ImageUpload";

const NewAgency = () => {
  const [name, setName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [instID, setInstID] = useState();
  const [birthDate, setBirthDate] = useState();
  const [bloodGroup, setBloodGroup] = useState();
  const [gender, setGender] = useState();
  const [address, setAddress] = useState();
  const [agencyType, setAgencyType] = useState();
  const [profile, setProfile] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const navigate = useNavigate();

  const [params, setParams] = useState({});

  // const handleInput = (event) => {
  //   const name = event.target.name;
  //   const value = event.target.value;
  //   setParams((values) => ({ ...values, [name]: value }));
  // };

  const handleFileChange = (event, name) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        switch (name) {
          case "agency_profile":
            console.log(name);
            setProfile(file);
            setParams((values) => ({
              ...values,
              agency_profile: file,
            }));
            break;
          default:
            console.log("name need to be passed");
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    setStatus("loading");
    // Perform any action needed on confirmation
    try {
      const response = await makeApiCall(
        "post",
        "agency/create",
        {
          profile_pic: profile,
          name: name,
          email: "text@gmail.com",
          phone_number: phoneNumber,
          instagram_id: instID,
          birth_date: birthDate,
          blood_group: bloodGroup,
          gender: gender,
          addresss: address,
          agency_type: agencyType,
        },
        "raw"
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
      console.log(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
    // Swal.fire("Check Point Create", "Done", "success");
  };

  return (
    <div className="h-auto p-[25px] bg-white rounded-[30px] md:rounded-none mt-4 flex flex-col gap-[40px] justify-between">
      <div className="fileUpload">
        <div className="uploadFile rounded-xl">
          <ImageUpload
            id={"file"}
            handleChange={(e) => handleFileChange(e, "agency_profile")}
            source={profile}
            heading={"Your Avatar"}
            height={"h-auto min-h-56"}
            label={"Upload image"}
          />
        </div>
      </div>
      <div className="w-full h-auto flex flex-col gap-2 items-start ">
        <InputField
          type={"text"}
          placeholder={"Full Name"}
          name="name"
          value={name}
          handleChange={(e) => setName(e.target.value)}
        />
        <InputField
          type={"number"}
          placeholder={"Phone Number"}
          name="phone_number"
          value={phoneNumber}
          handleChange={(e) => setPhoneNumber(e.target.value)}
        />
        <InputField
          type={"text"}
          placeholder={"Instagram ID"}
          name="instagram_id"
          value={instID}
          handleChange={(e) => {
            setInstID(e.target.value);
          }}
        />
        <InputField
          type={"Date"}
          placeholder={"Date Of Birth"}
          name="birth_date"
          value={birthDate}
          handleChange={(e) => setBirthDate(e.target.value)}
        />
        <InputField
          type={"text"}
          placeholder={"Blood Group"}
          name="blood_group"
          value={bloodGroup}
          handleChange={(e) => setBloodGroup(e.target.value)}
        />
        <InputField
          type={"text"}
          placeholder={"Gender"}
          name="gender"
          value={gender}
          handleChange={(e) => setGender(e.target.value)}
        />
        <InputField
          type={"text"}
          placeholder={"Address"}
          name="addresss"
          value={address}
          handleChange={(e) => setAddress(e.target.value)}
        />
        <InputField
          type={"text"}
          placeholder={"Agency Type"}
          name="agency_type"
          value={agencyType}
          handleChange={(e) => setAgencyType(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-center pb-5 w-full mb-24">
        <PrimaryButton
          title={"Submit"}
          background={"primary-button"}
          handleClick={handleCreate}
        />
      </div>
    </div>
  );
};

export default NewAgency;
