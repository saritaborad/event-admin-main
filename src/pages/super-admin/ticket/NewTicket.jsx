//-- import from react js
import React, { useEffect, useState } from "react";

//-- import ui elements
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import InputField from "../../../componets/ui-elements/InputField";

//-- import icons
import { BsFillTicketPerforatedFill } from "react-icons/bs";

//-- import api calling functions
import { makeApiCall } from "../../../api/Post";
import { filterByProperty } from "../../../utils/CommonFunctions";

//-- import json data
import { colorCodeMenu } from "../../../utils/ColorCode";

//-- import from react-router-dom
import { useNavigate } from "react-router-dom";

//-- import from react-select
import Select from "react-select";
import makeAnimated from "react-select/animated";

import Alert from "../../../componets/ui-elements/Alert";

const NewTicket = () => {
  const navigate = useNavigate(); //---->instance for rnavigation

  //---->send data to api(backend)
  const [ticketName, setTicketName] = useState();
  const [gates, setGates] = useState([]);
  const [rawGates, setRawGates] = useState([]);
  const [zone, setZone] = useState([]);
  const [playZone, setPlayZone] = useState([]);
  const [privilageZone, setPrivilageZone] = useState([]);
  const [checkpoint, setCheckpoint] = useState([]);

  //---->store data from api
  const [gateData, setGetData] = useState([]);
  const [checkpointData, setCheckPointData] = useState();
  const [zoneData, setZoneData] = useState([]);

  const [colorCode, setColorCode] = useState();
  const [colorCodeShow, setColorCodeShow] = useState();
  const [displayColor, setDisplayColor] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  //---->get data from backend(API)
  const fetchData = async () => {
    const responseGate = await makeApiCall("get", "gate/all", null, "raw");
    if (responseGate.data.status === 1) {
      const filterGate = filterByProperty(
        responseGate?.data.gates,
        "is_deleted",
        false
      );
      setRawGates(filterGate);
    } else {
      console.log(error);
    }
    const gateOptions = responseGate?.data.gates.map((gate) => ({
      value: gate._id,
      label: gate.gate_name + (gate.is_main ? "   ----->    Main gate" : ""),
    }));
    setGetData(gateOptions);

    const responseZone = await makeApiCall("get", "zone/all", null, "raw");
    // const filterZone = responseZone.data.tickets;
    if (responseZone.data.status === 1) {
      const filterZone = filterByProperty(
        responseZone?.data.tickets,
        "is_deleted",
        false
      );
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
    } else {
      console.log(error);
    }

    const responseCheckpoint = await makeApiCall(
      "get",
      "checkpoint/all",
      null,
      "raw"
    );
    if (responseCheckpoint.data.status === 1) {
      const filterCheckpoint = filterByProperty(
        responseCheckpoint?.data.data,
        "is_deleted",
        false
      );
      const checkPointOptions = filterCheckpoint.map((checkpoint) => ({
        value: checkpoint._id,
        label: checkpoint.checkpoint_name,
      }));
      setCheckPointData(checkPointOptions);
    } else {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //---->call api for create ticket
  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "post",
        "ticketcategory/create",
        {
          ticket_name: ticketName,
          gates: gates,
          checkpoints: checkpoint,
          zones: zone,
          color_code: colorCode,
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
    // Swal.fire("Ticket create successfully !", "Done", "success");
  };

  const handleClick = () => {
    if (ticketName && gates && checkpoint && zone && colorCode) {
      const gateData = gates;

      const isMainGate = gateData.some((gateId) => {
        const foundGate = rawGates.find((rawGate) => rawGate._id === gateId);
        return foundGate && foundGate.is_main;
      });

      console.log(isMainGate);
      if (isMainGate) {
        setIsAlert(true);
        setStatus("start");
      } else {
        setIsAlert(true);
        setErrorMsg("Minimum 1 main gate required !");
        setStatus("error");
      }
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
    navigate("/role/superadmin/ticket");
  };

  const handleColorSelect = (event) => {
    const rawColorValue = event.target.value;
    const colorWithoutHash = rawColorValue.substring(1); // Remove the "#" symbol
    const formattedColorValue = "0xff" + colorWithoutHash; // Add "0xff" prefix
    console.log(formattedColorValue);
    setColorCode(formattedColorValue);
  };
  const animatedComponents = makeAnimated();

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
                icon={<BsFillTicketPerforatedFill className="text-2xl" />}
                placeholder={"Ticket Name"}
                inputPlaceholder={"Ticket Name"}
                value={ticketName}
                handleChange={(e) => setTicketName(e.target.value)}
                disabled={false}
              />
            </div>
            <div className="color w-full">
              <InputField
                type="color"
                placeholder={"Color code"}
                inputPlaceholder={"Enter color"}
                // value={null}
                disabled={false}
                handleChange={handleColorSelect}
                // isError={true}
                // errMsg={"Enter slot more then '0' "}
              />
            </div>
            <div className="text w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Gate</p>
              <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  {/* <p className="px-5">
                <BsDoorClosed className="text-2xl" />
              </p> */}
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

            <div className="text w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Zone</p>
              <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  {/* <p className="px-5">
                <BsGeo className="text-2xl" />
              </p> */}
                  <Select
                    options={zoneData}
                    components={animatedComponents}
                    placeholder="Select zone"
                    isMulti
                    name="zone"
                    onChange={(e) =>
                      e.map((zoneItem) => setZone([...zone, zoneItem.value]))
                    }
                    className="basic-multi-select h-full flex item-center bg-transparent "
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>

            <div className="text w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">Check Point</p>
              <div className="authorizedNameInput w-full h-full p-2 border border-gray-300 rounded-lg">
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

export default NewTicket;
