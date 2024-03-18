import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import InputField from "../../../componets/ui-elements/InputField";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import Alert from "../../../componets/ui-elements/Alert";
import { makeApiCall } from "../../../api/Post";
import makeAnimated from "react-select/animated";
import black_user from "../../../assets/blank_user.svg";
import Select from "react-select";
import Loader from "../../../componets/ui-elements/Loader";
import { dashBordData } from "../../../utils/dashBordData";
import PhoneNumberInput from "../../../componets/ui-elements/PhoneNumberInput";
import ImageModel from "../../../componets/ui-elements/ImageModel";

const genderData = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const accessData = dashBordData.map((el) => ({
  label: el.title,
  value: el.UID,
}));

const AdminInfo = () => {
  const params = useParams();
  const adminPhoneNumber = params.phone_number;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [access, setAccess] = useState([]);
  const [profilePic, setProfilePic] = useState();
  const [isImageModel, setIsImageModel] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const animatedComponents = makeAnimated();

  useEffect(() => {
    findAdmin();
  }, []);

  const findAdmin = async () => {
    setLoading(true);
    try {
      const params = {
        phone_number: adminPhoneNumber,
      };
      const response = await makeApiCall(
        "post",
        `user/userdetails`,
        params,
        "raw"
      );
      if (response.data.status) {
        const { name, gender, phone_number, profile_pic, access_ids } =
          response.data.data;
        setName(name);
        setPhone_number(phone_number);
        setProfilePic(profile_pic);
        const genderArray = genderData.find(
          (item) => item.value.toLowerCase() === gender
        );
        setGender(genderArray);
        const accessArray = accessData.filter((item) =>
          access_ids.includes(item.value)
        );
        setAccess(accessArray);

        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsAlert(false);
    setLoading(true);

    try {
      const data = {
        phone_number: phone_number,
        ids: access.map((a) => a.value),
      };
      const response = await makeApiCall(
        "post",
        "user/updateaccessadmin",
        data,
        "raw"
      );
      if (response.data.status === 1) {
        setLoading(false);
        setSuccessMsg(response.data.message);
        handleComplete();
      } else {
        setLoading(false);
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.warn(error);
      setLoading(false);
      setErrorMsg("Something went wrong");
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
  };

  const handleComplete = () => {
    navigate("/role/superadmin/admin");
  };

  return (
    <>
      {loading ? <Loader /> : null}
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
            {!loading ? (
              <div className="eventPhoto border-2 border-gray-300 flex flex-col justify-center items-center h-32 w-32 rounded-full overflow-hidden">
                <img
                  onClick={() => setIsImageModel(true)}
                  src={profilePic ? profilePic : black_user}
                  alt="Admin image"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-gray-300 h-32 w-32 rounded-full overflow-hidden animate-pulse "></div>
            )}

            <div className="w-full">
              <InputField
                type="text"
                placeholder={`Name`}
                inputPlaceholder={"Enter Security name"}
                readOnly
                value={name}
                //   handleChange={(e) => setSecurityName(e.target.value)}
                disabled={true}
              />
            </div>

            <div className="text w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Gender</p>
              <div className="authorizedNameInput w-full p-2 h-full border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  <Select
                    options={genderData}
                    value={gender}
                    isDisabled={true}
                    components={animatedComponents}
                    placeholder="Select Gender"
                    name="gender"
                    onChange={(e) => {
                      setGender(e);
                    }}
                    className="basic-multi-select h-full flex item-center bg-transparent"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <PhoneNumberInput
                value={phone_number}
                disabled={true}
                // handleChange={handleNumberChange}
              />
            </div>

            <div className="text w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Access</p>
              <div className="authorizedNameInput w-full p-2 h-full border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  <Select
                    options={accessData}
                    components={animatedComponents}
                    isMulti
                    value={access}
                    isDisabled={!isEditable}
                    placeholder="Select Access"
                    name="access"
                    onChange={(e) => setAccess(e)}
                    className="basic-multi-select h-full flex item-center bg-transparent"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex items-center gap-2 mt-16 mb-24">
            <PrimaryButton
              title={isEditable ? "Submit" : "Edit Details"}
              background={isEditable ? "bg-primary" : "bg-black"}
              handleClick={() =>
                isEditable ? setIsAlert(true) : setIsEditable(true)
              }
            />
          </div>
        </div>
      </div>
      {isImageModel ? (
        <ImageModel
          src={profilePic ? profilePic : black_user}
          handleClose={() => setIsImageModel(false)}
        />
      ) : null}
    </>
  );
};

export default AdminInfo;
