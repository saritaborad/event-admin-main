import { useEffect, useState } from "react";
import { BsGeoAlt, BsDoorClosed } from "react-icons/bs";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import ValueInput from "../../../componets/ui-elements/ValueInput";
import { makeApiCall } from "../../../api/Post";
import Loader from "../../../componets/ui-elements/Loader";
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

const Info = () => {
  const [loading, setLoading] = useState(false);
  const [gateName, setGateName] = useState();
  const [gateLocation, setGateLocation] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [status, setStatus] = useState("start");
  const [successMsg, setSuccessMsg] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [selectedGate, setSelectedGate] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const animatedComponents = makeAnimated();
  const navigate = useNavigate();
  const param = useParams();
  const gateId = param.id;

  const findGate = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall(
        "post",
        "gate/update",
        {
          gate_id: gateId,
        },
        "raw"
      );
      console.log(response.data.data);
      let responseName = null;
      if (response.data.data.is_main) responseName = "is_main";
      else if (response.data.data.parking_gate) responseName = "parking_gate";
      else responseName = "normal_gate";
      setGateName(response.data.data.gate_name);
      setGateLocation(response.data.data.location_reference);
      setSelectedGate(gateList.find((gate) => gate.value === responseName));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "post",
        "gate/update",
        {
          gate_id: gateId,
          gate_name: gateName,
          is_main: selectedGate.value === "is_main",
          parking_gate: selectedGate.value === "parking_gate",
          location_reference: gateLocation,
        },
        "raw"
      );

      setLoading(false);
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    console.log(gateId);
    try {
      const response = await makeApiCall(
        "post",
        "gate/delete",
        {
          gate_id: gateId,
        },
        "raw"
      );
      console.log("first");
      console.log(response);
      if (response.data.status === 1) {
        setLoading(false);
        navigate("/role/superadmin/gate");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
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
    navigate("/role/superadmin/gate");
  };

  useEffect(() => {
    findGate();
  }, []);

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
      <div className="h-[90vh] m-[2px] p-[25px] rounded-[30px] mt-4 flex flex-col gap-[100px] bg-white justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="flex flex-col gap-[25px] justify-start items-center">
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  icon={<BsDoorClosed className="text-2xl" />}
                  placeholder={"Gate Name"}
                  inputPlaceholder={"Enter gate name"}
                  value={gateName}
                  handleChange={(e) => setGateName(e.target.value)}
                  disabled={false}
                />
              ) : (
                <ValueInput
                  type={"text"}
                  icon={<BsDoorClosed className="text-2xl text-gray-400" />}
                  placeholder={"Gate Name"}
                  inputPlaceholder={gateName}
                  handleChange={(e) => setGateName(e.target.value)}
                  isDisabled={true}
                />
              )}
            </div>
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  icon={<BsGeoAlt className="text-2xl" />}
                  placeholder={"Gate Location Reference"}
                  inputPlaceholder={"Enter your gate location"}
                  value={gateLocation}
                  handleChange={(e) => gateLocation(e.target.value)}
                  disabled={false}
                />
              ) : (
                <ValueInput
                  isDisabled={true}
                  type={"text"}
                  icon={<BsGeoAlt className="text-2xl text-gray-400" />}
                  placeholder={"Location Reference"}
                  inputPlaceholder={gateLocation}
                  handleChange={(e) => setGateLocation(e.target.value)}
                />
              )}
            </div>
            {/* {isEditable ? (
            <div
              className="w-full flex items-center justify-between border border-gray-300 p-4 rounded-lg"
              onClick={() => setIsMainGate(!isMainGate)}
            >
              <p className="font-semibold text-[14px] ms-1">Main Gate</p>
              <div className="flex items-center justify-center gap-2">
                <p>{isMainGate ? "Yes" : "No"}</p>
                <div className="h-5 w-5 border rounded-full p-[2px] flex items-center justify-center">
                  {isMainGate ? (
                    <>
                      <div className="bg-primary h-3 w-3 rounded-full"></div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between bg-[#f2f2f2] p-4 rounded-md">
              <p className="font-semibold text-[14px] ms-1">Main Gate</p>
              <div className="flex items-center justify-center gap-2">
                <p>{isMainGate ? "Yes" : "No"}</p>
              </div>
            </div>
          )} */}

            <div className="w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Select gate</p>
              <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  {/* <p className="px-5">
                <BsDoorClosed className="text-2xl" />
              </p> */}
                  <Select
                    isDisabled={!isEditable}
                    options={gateList}
                    components={animatedComponents}
                    value={selectedGate}
                    name="branch"
                    placeholder="Select branch"
                    onChange={setSelectedGate}
                    className="basic-multi-select h-full flex item-center bg-transparent"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex items-center mt-16 gap-2">
            <PrimaryButton
              title={isEditable ? "Submit" : "Edit Details"}
              background={isEditable ? "bg-primary" : "bg-black"}
              handleClick={isEditable ? handleClick : () => setIsEditable(true)}
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
    </>
  );
};

export default Info;
