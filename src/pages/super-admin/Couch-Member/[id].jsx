import React, { useEffect, useState } from "react";
import { BsShieldCheck, BsGeoAlt, BsDoorClosed } from "react-icons/bs";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import ValueInput from "../../../componets/ui-elements/ValueInput";
import { makeApiCall } from "../../../api/Post";
import Loader from "../../../componets/ui-elements/Loader";
import InputField from "../../../componets/ui-elements/InputField";
import Alert from "../../../componets/ui-elements/Alert";
import { filterByProperty } from "../../../utils/CommonFunctions";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const CouchInfo = () => {
  const [couch, setCouch] = useState();
  const [singlGate, setGate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [number, setNumber] = useState();
  const [gateLocation, setGateLocation] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [isEditable, setIsEditable] = useState(false);

  const animatedComponents = makeAnimated();

  const navigate = useNavigate();
  const param = useParams();
  const gateId = param.id;

  const getAllCouch = async () => {
    try {
      const response = await makeApiCall("get", "sofa/allmember", null, "raw");
      if (response.data.status === 1) {
        const filterdCouch = filterByProperty(
          response.data.data,
          "is_deleted",
          false
        );
        const findSecurity = filterByProperty(filterdCouch, "_id", param.id);
        console.log(findSecurity[0]);
        setCouch(findSecurity[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCouch();
  }, []);

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="h-auto m-[2px] p-[25px] rounded-[30px] mt-4 flex flex-col gap-[100px] bg-white justify-start md:h-screen md:overflow-y-auto md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="flex flex-col gap-[25px] justify-start items-center">
            <div className="eventImage flex flex-col gap-3 justify-center items-center  ">
              {isEditable ? (
                <ImageUpload
                  id={"filePortrait"}
                  // handleChange={(e) => handleFileChange(e, "image")}
                  // source={Image}
                  heading={"Landscap image"}
                  height={"h-auto min-h-56"}
                  label={"Replace image"}
                />
              ) : (
                <div className="w-full">
                  <p className="font-semibold mb-4">Image</p>
                  <div className="event flex items-center justify-center  border-gray-400 rounded-lg overflow-hidden h-auto w-full object-cover">
                    <img
                      src={couch?.profile_pic}
                      alt="image"
                      className="h-full w-full object-cover"
                      // onClick={() => {
                      //   setIsImageModel(true);
                      //   setSelectedModelImage(eventDisplayPortraitImage);
                      // }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  icon={<BsDoorClosed className="text-2xl" />}
                  placeholder={"Member Name"}
                  inputPlaceholder={"Enter Member name"}
                  value={couch.name}
                  // handleChange={(e) => setName(e.target.value)}
                  disabled={false}
                />
              ) : (
                <ValueInput
                  type={"text"}
                  icon={<BsDoorClosed className="text-2xl text-gray-400" />}
                  placeholder={"Member Name"}
                  inputPlaceholder={couch?.name}
                  // handleChange={(e) => setName(e.target.value)}
                  isDisabled={true}
                />
              )}
            </div>

            <div className="w-full">
              {isEditable ? (
                <div className="w-full">
                  <p className="text-[14 px] text-black font-semibold">
                    Select event day
                  </p>
                  <div className="w-full h-16 border border-gray-300 rounded-lg">
                    <div className="authorizedName flex items-center h-full">
                      <Select
                        // options={dayData}
                        components={animatedComponents}
                        placeholder="Select event day"
                        isMulti={false}
                        name="event_day"
                        // onChange={(e) =>
                        //   // e[0].setCheckpoint([...checkpoint, checkpointItem.value])
                        //   {
                        //     setEventDay(e.value);
                        //   }
                        // }
                        className="basic-multi-select h-full flex item-center bg-transparent"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <ValueInput
                  type="number"
                  placeholder={"Gender"}
                  inputPlaceholder={couch?.gender}
                  // handleChange={(e) => setGender(e.target.value)}
                  // value={eventDay}
                  isDisabled={true}
                />
              )}
            </div>

            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  icon={<BsGeoAlt className="text-2xl" />}
                  placeholder={"Phone no"}
                  inputPlaceholder={"Enter Phone no"}
                  value={couch.phone_number}
                  // handleChange={(e) => setNumber(e.target.value)}
                  disabled={false}
                />
              ) : (
                <ValueInput
                  isDisabled={true}
                  type={"text"}
                  icon={<BsGeoAlt className="text-2xl text-gray-400" />}
                  placeholder={"Phone no"}
                  inputPlaceholder={couch?.phone_number}
                  // handleChange={(e) => setNumber(e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="w-full flex items-center gap-2 mt-16 mb-24">
            <PrimaryButton
              title={isEditable ? "Submit" : "Edit Details"}
              background={isEditable ? "bg-primary" : "bg-black"}
              // handleClick={isEditable ? handleUpdate : () => setIsEditable(true)}
            />
            {isEditable ? null : (
              <PrimaryButton
                title={"Delete"}
                background={isEditable ? "bg-primary" : "bg-black"}
                // handleClick={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CouchInfo;
