import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../../componets/ui-elements/PrimaryButton";
import InputField from "../../../../componets/ui-elements/InputField";
import { colorCodeMenu } from "../../../../utils/ColorCode";
import { useNavigate } from "react-router-dom";
import { makeApiCall } from "../../../../api/Post";
import Alert from "../../../../componets/ui-elements/Alert";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const NewPrivilegeZone = () => {
  const [zoneName, setZoneName] = useState();
  const [price, setPrice] = useState();
  const navigate = useNavigate();

  const [colorCode, setColorCode] = useState();
  const [colorCodeShow, setColorCodeShow] = useState();
  const [displayColor, setDisplayColor] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [gateData, setGetData] = useState([0, 1, 2, 3, 4]);
  const [gates, setGates] = useState([]);
  const [checkpoint, setCheckpoint] = useState([]);
  const [checkpointData, setCheckPointData] = useState();

  const animatedComponents = makeAnimated();

  const fetchData = async () => {
    const responseGate = await makeApiCall("get", "gate/all", null, "raw");

    const gateOptions = responseGate?.data.gates.map((gate) => ({
      value: gate._id,
      label: gate.gate_name,
    }));
    setGetData(gateOptions);

    const responseCheckpoint = await makeApiCall(
      "get",
      "checkpoint/all",
      null,
      "raw"
    );
    const checkPointOptions = responseCheckpoint.data.data.map(
      (checkpoint) => ({
        value: checkpoint._id,
        label: checkpoint.checkpoint_name,
      })
    );
    setCheckPointData(checkPointOptions);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirm = async () => {
    setStatus("loading");
    console.log(gates);
    console.log(checkpoint);
    try {
      const response = await makeApiCall(
        "post",
        "zone/create",
        {
          zone_name: zoneName,
          color_code: colorCode,
          // pass_zone: true,
          is_privilege: true,
          // ticket_zone: false,
          gates: gates,
          checkpoints: checkpoint,
          // fun_zone: false,
          price: price,
        },
        "raw"
      );
      console.log(response);
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
  };

  const handleColorSelect = (event) => {
    const rawColorValue = event.target.value;
    const colorWithoutHash = rawColorValue.substring(1); // Remove the "#" symbol
    const formattedColorValue = "0xff" + colorWithoutHash; // Add "0xff" prefix
    console.log(formattedColorValue);
    setColorCode(formattedColorValue);
  };

  const handleClick = () => {
    if (zoneName && colorCode) {
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
    navigate("/role/superadmin/privilege-zone");
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
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[100px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="flex flex-col gap-[25px] justify-start items-center">
            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Privilege Zone Name"}
                inputPlaceholder={"Enter Privilege Name"}
                value={null}
                handleChange={(e) => setZoneName(e.target.value)}
                disabled={false}
              />
            </div>

            <div className="color w-full">
              <InputField
                type="color"
                placeholder={"Color code"}
                inputPlaceholder={"Enter Slot"}
                // value={null}
                disabled={false}
                handleChange={handleColorSelect}
                // isError={true}
                // errMsg={"Enter slot more then '0' "}
              />
            </div>

            {/* <div className="w-full">
            <InputField
              type="number"
              placeholder={"Price"}
              inputPlaceholder={"Ente Price"}
              value={null}
              handleChange={(e) => setPrice(e.target.value)}
              disabled={false}
            />
          </div> */}

            <div className="text w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Gate</p>
              <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  <Select
                    options={gateData}
                    components={animatedComponents}
                    isMulti
                    name="gate"
                    placeholder="Select gate"
                    onChange={(e) =>
                      e.map((gate) => setGates([...gates, gate.value]))
                    }
                    className="basic-multi-select h-full flex item-center bg-transparent"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>

            <div className="text w-full mt-5">
              <p className="text-[14px] font-semibold ms-1 mb-1">Check Point</p>
              <div className="authorizedNameInput w-full p-2 h-full border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  {/* <p className="px-5">
                <BsPin className="text-2xl" />
              </p> */}
                  <Select
                    options={checkpointData}
                    components={animatedComponents}
                    placeholder="Select checkpoint"
                    isMulti
                    name="checkpoint"
                    onChange={(e) =>
                      e?.map((checkpointItem) =>
                        setCheckpoint([...checkpoint, checkpointItem.value])
                      )
                    }
                    className="basic-multi-select h-full flex item-center bg-transparent"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-16 mb-24">
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

export default NewPrivilegeZone;
