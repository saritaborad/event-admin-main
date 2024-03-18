import React, { useState } from "react";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { makeApiCall } from "../../../api/Post";
import { useNavigate } from "react-router-dom";
import InputField from "../../../componets/ui-elements/InputField";
import Alert from "../../../componets/ui-elements/Alert";

const NewCheckpoint = () => {
  const [checkpointName, setCheckPointName] = useState();
  const [location, setLocation] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const navigate = useNavigate();

  const handleConfirm = async () => {
    setStatus("loading");
    // Perform any action needed on confirmation
    try {
      const response = await makeApiCall(
        "post",
        "checkpoint/create",
        {
          checkpoint_name: checkpointName,
          location_reference: location,
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
      console.warn(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
    // Swal.fire("Check Point Create", "Done", "success");
  };

  const handleClick = () => {
    if (checkpointName && location) {
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
    navigate("/role/superadmin/checkpoint");
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
      <div className="h-[90vh] m-[2px] p-[25px] bg-white rounded-[30px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0 mt-4 flex flex-col gap-[100px] justify-start ">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="flex flex-col gap-[25px] justify-start items-center">
            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Checkpoint Name"}
                inputPlaceholder={"Enter checkpoint name"}
                value={checkpointName}
                handleChange={(e) => setCheckPointName(e.target.value)}
                disabled={false}
              />
            </div>
            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Checkpoint Location Reference"}
                inputPlaceholder={"Enter location name"}
                value={location}
                handleChange={(e) => setLocation(e.target.value)}
                disabled={false}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 selection:bg-none mt-16">
            <PrimaryButton
              background={"primary-button"}
              // handleClick={createCheckPoint}
              handleClick={handleClick}
              title={"Submit"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCheckpoint;
