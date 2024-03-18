import React, { useState } from "react";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { makeApiCall } from "../../../api/Post";
import { useNavigate } from "react-router-dom";
import InputField from "../../../componets/ui-elements/InputField";
import Alert from "../../../componets/ui-elements/Alert";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const gateList = [
  {
    label: "Main Gate",
    value: "is_main",
  },
  {
    label: "Parking Gate",
    value: "parking_gate",
  },
  {
    label: "Normal Gate",
    value: "normal_gate",
  },
];

const NewGate = () => {
  const [gateName, setGateName] = useState();
  const [location, setLocation] = useState();
  const [selectedGate, setSelectedGate] = useState({});
  const navigate = useNavigate();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const animatedComponents = makeAnimated();

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "post",
        "gate/create",
        {
          gate_name: gateName,
          is_main: selectedGate.value === "is_main",
          parking_gate: selectedGate.value === "parking_gate",
          location_reference: location,
        },
        "raw"
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
    // Swal.fire("Garba Class Create", "Done", "success");
  };

  const handleClick = () => {
    if (gateName?.trim() && location?.trim() && selectedGate?.value?.trim()) {
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
    navigate("/role/superadmin/gate");
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
      <div className="h-[90vh] m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[100px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="flex flex-col gap-[25px] justify-start items-center">
            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Gate Name"}
                inputPlaceholder={"Enter gate name"}
                value={gateName}
                handleChange={(e) => setGateName(e.target.value)}
                disabled={false}
              />
            </div>
            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Gate Location Reference"}
                inputPlaceholder={"Enter your gate location"}
                value={location}
                handleChange={(e) => setLocation(e.target.value)}
                disabled={false}
              />
            </div>
            {/*  <div
            className={`w-full flex items-center justify-between border p-2 rounded-lg ${
              isParkingGate ? "border-none bg-gray-200 text-gray-400" : null
            }`}
            // onClick={() => setIsMainGate(!isMainGate)}
             onClick={isParkingGate ? null : () => setIsMainGate(!isMainGate)}
          >
            <p className="font-semibold text-[14px] ms-1">Main Gate</p>
            <div className="flex items-center justify-center gap-2">
              <p>{isParkingGate ? null : isMainGate ? "Yes" : "No"}</p>
              <div className="h-5 w-5 border rounded-full p-[2px] flex items-center justify-center">
                {isMainGate ? (
                  <>
                    <div className="bg-primary h-3 w-3 rounded-full"></div>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div
            className={`w-full flex items-center justify-between border p-2 rounded-lg ${
              isMainGate ? "border-none bg-gray-200 text-gray-400" : null
            }`}
            onClick={isMainGate ? null : () => setIsParkingGate(!isParkingGate)}
          >
            <p className="font-semibold text-[14px] ms-1">Parking Gate</p>
            <div className="flex items-center justify-center gap-2">
              <p>{isMainGate ? null : isParkingGate ? "Yes" : "No"}</p>
              <div className="h-5 w-5 border rounded-full p-[2px] flex items-center justify-center">
                {isParkingGate ? (
                  <>
                    <div className="bg-primary h-3 w-3 rounded-full"></div>
                  </>
                ) : null}
              </div>
            </div>
          </div> */}
            <div className="w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Select gate</p>
              <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  {/* <p className="px-5">
                <BsDoorClosed className="text-2xl" />
              </p> */}
                  <Select
                    options={gateList}
                    components={animatedComponents}
                    // value={selectedGate}
                    name="branch"
                    placeholder="Select Gate"
                    onChange={setSelectedGate}
                    className="basic-multi-select h-full flex item-center bg-transparent"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-16 gap-4">
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

export default NewGate;
