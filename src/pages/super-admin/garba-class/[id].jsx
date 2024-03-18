import React, { useState, useEffect } from "react";
import { MdPersonOutline, MdOutlinePhoneIphone } from "react-icons/md";
import { BsFlag, BsBuildings, BsPinAngle, BsPin } from "react-icons/bs";
import { BiMaleFemale } from "react-icons/bi";
import { FaInstagram } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import ValueInput from "../../../componets/ui-elements/ValueInput";
import { makeApiCall } from "../../../api/Post";
import Loader from "../../../componets/ui-elements/Loader";
import Alert from "../../../componets/ui-elements/Alert";
import InputField from "../../../componets/ui-elements/InputField";

const GarbaInfo = () => {
  const [singlClasses, setClasses] = useState(null);
  const [loading, setLoading] = useState(false);

  const param = useParams();
  const navigate = useNavigate();
  const classesId = param.id;

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const [branchName, setBranchName] = useState();
  const [branchArea, setBranchArea] = useState();
  const [branchProfileImage, setBranchProfileImage] = useState();
  const [branchProfileDisplayImage, setBranchProfileDisplayImage] = useState();

  const findGarbaClass = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall(
        "get",
        `garbaclass/info/` + classesId,
        null,
        "raw"
      );
      console.log(response);
      setClasses(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    findGarbaClass();
  }, []);

  const handleDelete = async (e) => {
    setIsAlert(true);
    setStatus("loading");

    e.preventDefault();
    try {
      const deleteGarbaClass = await makeApiCall(
        "post",
        "garbaclass/delete",
        { garba_classname_id: classesId },
        "raw"
      );
      console.log(deleteGarbaClass);
      if (deleteGarbaClass.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(deleteGarbaClass.data.message);
      } else {
        setStatus("error");
        setErrorMsg(deleteGarbaClass.data.data);
      }
    } catch (error) {
      console.log(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const handleConfirm = async () => {
    console.log("handle confirm clicked");
  };

  const handleClick = () => {
    setIsAlert(true);
    setStatus("start");
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    navigate("/role/superadmin/garba-class");
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
      {loading ? <Loader /> : null}
      <div className="createGarbaClassSubmit mt-5">
        <div className="createGarbaClassSubmitSection flex flex-col gap-[20px] bg-white pt-4 m-1 h-auto rounded-[30px] p-[25px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
          <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
            <div className="w-full flex items-start justify-center gap-2">
              <div className="h-full border-gray-400 rounded-lg overflow-hidden w-full object-cover">
                <p className="font-semibold mb-4 text-center">
                  Garba class logo
                </p>
                <div className="flex justify-center">
                  <img
                    src={singlClasses?.garba_class_logo}
                    alt="image"
                    className="h-full w-[100px] object-cover rounded-xl"
                  />
                </div>
              </div>
              <div className="h-full border-gray-400 rounded-lg overflow-hidden w-full object-cover">
                <p className="font-semibold mb-4 text-center">Owner Image</p>
                <div className="flex justify-center">
                  <img
                    src={singlClasses?.owner.profile_pic}
                    alt="image"
                    className="h-full w-[100px] object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
            {singlClasses?.branch_list?.map((branch) => {
              return (
                <>
                  {branch.main_branch === true ? (
                    <p className="text-lg text-primary font-medium">
                      Main Branch
                    </p>
                  ) : (
                    <p className="text-lg text-primary font-medium">
                      Branch List
                    </p>
                  )}

                  <div className="bg-gray-200 p-2 rounded-md flex flex-col gap-2">
                    {branch.main_branch === true ? (
                      <>
                        {" "}
                        <ValueInput
                          type={"text"}
                          icon={
                            <BiMaleFemale className="text-2xl text-gray-400" />
                          }
                          placeholder={"Garba Class Name"}
                          inputPlaceholder={"Garba Class Name"}
                          value={
                            singlClasses
                              ? `${singlClasses.garba_classname}`
                              : null
                          }
                          disabled={singlClasses ? false : true}
                        />
                        <ValueInput
                          type={"text"}
                          icon={
                            <MdPersonOutline className="text-2xl text-gray-400" />
                          }
                          placeholder={"Owner Name"}
                          inputPlaceholder={"Owner Name"}
                          value={
                            singlClasses ? `${singlClasses.owner.name}` : null
                          }
                          disabled={singlClasses ? false : true}
                        />
                        <ValueInput
                          type={"number"}
                          icon={
                            <MdOutlinePhoneIphone className="text-2xl text-gray-400" />
                          }
                          placeholder={"Owner Contact Number"}
                          inputPlaceholder={"Owner Contact Number"}
                          value={
                            singlClasses
                              ? `${singlClasses.owner.phone_number}`
                              : null
                          }
                          disabled={singlClasses ? false : true}
                        />
                        <ValueInput
                          type={"number"}
                          icon={<BsFlag className="text-2xl text-gray-400" />}
                          placeholder={"Since"}
                          inputPlaceholder={"Since"}
                          value={
                            singlClasses
                              ? `${singlClasses.garba_class_since}`
                              : null
                          }
                          disabled={singlClasses ? false : true}
                        />
                        <ValueInput
                          type={"text"}
                          icon={
                            <SlLocationPin className="text-2xl text-gray-400" />
                          }
                          placeholder={"Address"}
                          inputPlaceholder={"Address"}
                          value={
                            singlClasses
                              ? `${singlClasses.garba_class_address}`
                              : null
                          }
                          disabled={singlClasses ? false : true}
                        />
                        <ValueInput
                          type={"text"}
                          icon={
                            <BsPinAngle className="text-2xl text-gray-400" />
                          }
                          placeholder={"Area"}
                          inputPlaceholder={"Area"}
                          value={
                            singlClasses
                              ? `${singlClasses.garba_class_area}`
                              : null
                          }
                          disabled={singlClasses ? false : true}
                        />
                        <>
                          <p className="text-[14px] text-black font-semibold ms-1 mb-1">
                            Zone
                          </p>
                          <div className="garbaName flex items-center rounded-lg bg-[#f2f2f2] p-4">
                            <div className="details w-full ps-3">
                              <input
                                type={"text"}
                                style={{
                                  backgroundColor:
                                    "#" +
                                    singlClasses?.zone?.color_code.slice(4),
                                }}
                                className="outline-none text-white rounded-md px-2 py-1 border-none placeholder:text-black w-auto"
                                placeholder={"Zone"}
                                value={`${singlClasses?.zone?.zone_name}`}
                              />
                            </div>
                          </div>
                        </>
                        <ValueInput
                          type={"text"}
                          icon={
                            <FaInstagram className="text-2xl text-gray-400" />
                          }
                          placeholder={"Instagram"}
                          inputPlaceholder={"Instagram"}
                          value={
                            singlClasses ? `${singlClasses.instagram_id}` : null
                          }
                          disabled={singlClasses ? false : true}
                        />
                      </>
                    ) : (
                      <>
                        {isEditable ? (
                          <InputField
                            type="text"
                            icon={<BsPin className="text-2xl" />}
                            placeholder={"Branch name"}
                            inputPlaceholder={"Enter branch name"}
                            // value={checkPointName}
                            handleChange={(e) => setBranchName(e.target.value)}
                            disabled={false}
                          />
                        ) : (
                          <ValueInput
                            type={"text"}
                            icon={
                              <BsBuildings className="text-2xl text-gray-400" />
                            }
                            placeholder={"Branch name"}
                            inputPlaceholder={"Branch name"}
                            value={branch.branch_name}
                            disabled={singlClasses ? false : true}
                          />
                        )}

                        {isEditable ? (
                          <InputField
                            type="text"
                            icon={<BsPin className="text-2xl" />}
                            placeholder={"Branch name"}
                            inputPlaceholder={"Enter branch name"}
                            // value={checkPointName}
                            handleChange={(e) => setBranchArea(e.target.value)}
                            disabled={false}
                          />
                        ) : (
                          <ValueInput
                            type={"text"}
                            icon={
                              <BsBuildings className="text-2xl text-gray-400" />
                            }
                            placeholder={"Branch area"}
                            inputPlaceholder={"Branch area"}
                            value={branch.branch_area}
                            disabled={singlClasses ? false : true}
                          />
                        )}

                        {/* <ValueInput
                      type={"text"}
                      icon={<BsBuildings className="text-2xl text-gray-400" />}
                      placeholder={"Branch area"}
                      inputPlaceholder={"Branch area"}
                      value={branch.garba_class_area}
                      disabled={singlClasses ? false : true}
                    /> */}
                        <ValueInput
                          type={"text"}
                          icon={
                            <BsBuildings className="text-2xl text-gray-400" />
                          }
                          placeholder={"Branch contact"}
                          inputPlaceholder={"Branch contact"}
                          value={branch.branch_mobile_number}
                          disabled={singlClasses ? false : true}
                        />
                      </>
                    )}
                    {/* <ValueInput
                  type={"text"}
                  icon={<BsBuildings className="text-2xl text-gray-400" />}
                  placeholder={"Main Branch"}
                  inputPlaceholder={"Main Branch"}
                  value={
                    singlClasses
                      ? `${branch.main_branch === true ? "Yes" : "No"}`
                      : null
                  }
                  disabled={singlClasses ? false : true}
                /> */}
                  </div>
                </>
              );
            })}

            <div className="w-full flex items-center mt-16 gap-2 mb-24">
              {!isEditable ? (
                <>
                  <PrimaryButton
                    title={"Edit Details"}
                    background={"bg-black"}
                    handleClick={() => setIsEditable(true)}
                  />
                  <PrimaryButton
                    title={"Delete"}
                    background={"bg-black"}
                    handleClick={handleDelete}
                  />
                </>
              ) : (
                <PrimaryButton
                  title={"Submit"}
                  background={"bg-primary"}
                  handleClick={() => setIsEditable(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GarbaInfo;
