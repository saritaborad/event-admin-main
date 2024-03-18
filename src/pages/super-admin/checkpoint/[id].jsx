import React, { useState, useEffect } from "react";
import { BsGeo, BsGeoAlt, BsDoorClosed, BsPin } from "react-icons/bs";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import ValueInput from "../../../componets/ui-elements/ValueInput";
import { useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../../api/Post";
import Loader from "../../../componets/ui-elements/Loader";
import InputField from "../../../componets/ui-elements/InputField";
import Alert from "../../../componets/ui-elements/Alert";

const CheckpointInfo = () => {
  const param = useParams();
  const [singlCheckpoint, setCheckpoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkPointName, setCheckPointName] = useState();
  const [checkPointLocation, setCheckPointLocation] = useState();
  const checkpointId = param.id;
  const navigate = useNavigate();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const [isEditable, setIsEditable] = useState(false);

  const findCheckpoint = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "post",
        "checkpoint/update",
        {
          checkpoint_id: checkpointId,
        },
        "raw"
      );
      console.log(response.data.data);
      setCheckPointName(response.data.data.checkpoint_name);
      setCheckPointLocation(response.data.data.location_reference);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "post",
        "checkpoint/update",
        {
          checkpoint_id: checkpointId,
          checkpoint_name: checkPointName,
          location_reference: checkPointLocation,
        },
        "raw"
      );
      setLoading(false);
      console.log(response);
      navigate("/role/superadmin/checkpoint");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "post",
        "checkpoint/delete",
        {
          checkpoint_id: checkpointId,
        },
        "raw"
      );
      console.log(response);
      if (response.data.status === 1) {
        setLoading(false);
        navigate("/role/superadmin/checkpoint");
      } else {
        setLoading(false);
        setIsAlert(true);
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setIsAlert(true);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
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
    navigate("/role/superadmin/checkpoint");
  };

  useEffect(() => {
    findCheckpoint();
  }, []);

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
      <div className="createGarbaClassSubmit h-[92vh]">
        <div className="flex flex-col items-center justify-start gap-[100px] h-full relative bg-white mx-1 rounded-3xl md:h-screen md:overflow-y-auto md:rounded-none md:m-0 p-[25px]">
          <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
            <div className="flex flex-col gap-[25px] justify-start items-center w-full">
              <div className="w-full">
                {isEditable ? (
                  <InputField
                    type="text"
                    icon={<BsPin className="text-2xl" />}
                    placeholder={"Checkpoint Name"}
                    inputPlaceholder={"Enter checkpoint name"}
                    value={checkPointName}
                    handleChange={(e) => setCheckPointName(e.target.value)}
                    disabled={false}
                  />
                ) : (
                  <ValueInput
                    type="text"
                    icon={<BsDoorClosed className="text-2xl text-gray-400" />}
                    placeholder={"Checkpoint name"}
                    inputPlaceholder={checkPointName}
                    name={"checkpoint_name"}
                    // value={singlCheckpoint?.checkpoint_name}
                    handleChange={(e) => setCheckPointName(e.target.value)}
                    isDisabled={true}
                  />
                )}
              </div>

              <div className="w-full">
                {isEditable ? (
                  <InputField
                    type="text"
                    icon={<BsGeoAlt className="text-2xl" />}
                    placeholder={"Checkpoint Location Reference"}
                    inputPlaceholder={"Enter location name"}
                    value={checkPointLocation}
                    handleChange={(e) => setCheckPointLocation(e.target.value)}
                    disabled={false}
                  />
                ) : (
                  <ValueInput
                    type="text"
                    icon={<BsGeoAlt className="text-2xl text-gray-400" />}
                    placeholder={"Location Reference"}
                    inputPlaceholder={checkPointLocation}
                    name={"location_reference"}
                    value={singlCheckpoint?.location_reference}
                    handleChange={(e) => setCheckPointLocation(e.target.value)}
                    isDisabled={true}
                  />
                )}
              </div>
            </div>
            <div className="w-full flex items-center gap-2 mt-16">
              <PrimaryButton
                title={isEditable ? "Submit" : "Edit Details"}
                background={isEditable ? "bg-primary" : "bg-black"}
                handleClick={
                  isEditable ? handleClick : () => setIsEditable(true)
                }
              />
              {isEditable ? null : (
                <PrimaryButton
                  title={"Delete"}
                  background={isEditable ? "bg-primary" : "bg-black"}
                  handleClick={handleDelete}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckpointInfo;
