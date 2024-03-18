import React, { useState, useEffect } from "react";
import {
  BsPerson,
  BsPin,
  BsGeo,
  BsDoorClosed,
  BsFillTicketPerforatedFill,
} from "react-icons/bs";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import ValueInput from "../../../componets/ui-elements/ValueInput";
import { useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../../api/Post";
import Loader from "../../../componets/ui-elements/Loader";
import { colorCodeMenu } from "../../../utils/ColorCode";
import { filterByProperty } from "../../../utils/CommonFunctions";
import InputField from "../../../componets/ui-elements/InputField";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const TicketInfo = () => {
  const param = useParams();
  const [singleTicket, setTicket] = useState(null);
  const ticketId = param.id;
  const [loading, setLoading] = useState(false);
  const [ticketName, setTicketName] = useState();
  const [colorCode, setColorCode] = useState();
  const [colorCodeShow, setColorCodeShow] = useState();
  const [displayColor, setDisplayColor] = useState();

  const [gates, setGates] = useState([]);
  const [gateData, setGateData] = useState();
  const [selectedAdditionalGates, setSelectedAdditionalGates] = useState([]);

  const [zones, setZones] = useState();
  const [zoneData, setZoneData] = useState();
  const [selectedAdditionalZones, setSelectedAdditionalZones] = useState([]);

  const [checkPoints, setCheckPoints] = useState();
  const [checkPointData, setCheckPointData] = useState();
  const [selectedAdditionalCheckpoint, setSelectedAdditionalCheckpoint] =
    useState([]);

  const [isEditable, setIsEditable] = useState(false);

  const findTicket = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "get",
        `ticketcategory/info/${ticketId}`,
        null,
        "raw"
      );
      if (response.data.status) {
        setTicketName(response.data.data.ticket_name);
        const rawGates = response.data.data.gates;

        const transformedGate = rawGates.map((item) => ({
          value: item._id,
          label: item.gate_name,
        }));

        // setGateData(transformedGate);
        setGates(transformedGate);

        const rawZones = response.data.data.zones;

        const transformedZone = rawZones.map((item) => ({
          value: item._id,
          label: item.zone_name,
        }));
        setZones(transformedZone);

        const rawCheckpoints = response.data.data.checkpoints;
        const transformedCheckpoints = rawCheckpoints.map((item) => ({
          value: item._id,
          label: item.checkpoint_name,
        }));
        setCheckPoints(transformedCheckpoints);
        const updateColor = "#" + response.data.data.color_code.substring(4);
        setColorCode(updateColor);

        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleUpdate = async () => {
    setLoading(true);

    const gateArray = gates.map((gate) => gate.value);

    const zoneArray = zones.map((zone) => zone.value);

    const checkpointArray = checkPoints.map((checkpoint) => checkpoint.value);

    const colorWithoutHash = colorCode.substring(1); // Remove the "#" symbol
    const formattedColorValue = "0xff" + colorWithoutHash; // Add "0xff" prefix

    const params = {
      ticket_id: ticketId,
      ticket_name: ticketName,
      color_code: formattedColorValue,
      zones: zoneArray,
      checkpoints: checkpointArray,
      gates: gateArray,
    };

    try {
      const response = await makeApiCall(
        "post",
        "ticketcategory/update",
        params,
        "raw"
      );
      setLoading(false);
      console.log(response);
      navigate("/role/superadmin/ticket");
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
        "ticketcategory/delete",
        {
          ticket_id: ticketId,
        },
        "raw"
      );
      console.log(response);
      if (response.data.status === 1) {
        setLoading(false);
        navigate("/role/superadmin/ticket");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const resGate = await makeApiCall("get", "/gate/all", null, "raw");
    const rawGates = resGate.data.gates;

    const filterdGates = filterByProperty(rawGates, "is_deleted", false);

    const transformedGate = filterdGates.map((item) => ({
      value: item._id,
      label: item.gate_name,
    }));

    setGateData(transformedGate);

    const resZone = await makeApiCall("get", "/zone/all", null, "raw");

    const rawZone = resZone.data.tickets;

    const filterdZone = filterByProperty(rawZone, "is_deleted", false);

    const transformedZone = filterdZone.map((item) => ({
      value: item._id,
      label: item.zone_name,
    }));

    setZoneData(transformedZone);

    const resCheckpoint = await makeApiCall(
      "get",
      "/checkpoint/all",
      null,
      "raw"
    );
    const rawCheckpoint = resCheckpoint.data.data;

    const filterdCheckpoint = filterByProperty(
      rawCheckpoint,
      "is_deleted",
      false
    );

    const transformedCheckpoint = filterdCheckpoint.map((item) => ({
      value: item._id,
      label: item.checkpoint_name,
    }));

    setCheckPointData(transformedCheckpoint);
  };

  useEffect(() => {
    findTicket();
    fetchData();
  }, []);

  const handleColorSelect = (event) => {
    const rawColorValue = event.target.value;
    setColorCode(rawColorValue);
  };

  const animatedComponents = makeAnimated();

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="h-auto">
        <div className="flex flex-col items-center justify-start gap-[25px] h-full relative bg-white p-[25px] mx-1 rounded-3xl md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="w-full">
            {isEditable ? (
              <InputField
                type="text"
                icon={<BsFillTicketPerforatedFill className="text-2xl" />}
                placeholder={"Ticket Name"}
                inputPlaceholder={"Enter Ticket Name"}
                value={ticketName}
                handleChange={(e) => setTicketName(e.target.value)}
                disabled={false}
              />
            ) : (
              <ValueInput
                type="text"
                icon={
                  <BsFillTicketPerforatedFill className="text-2xl text-gray-400" />
                }
                placeholder={"Ticket Name"}
                inputPlaceholder={ticketName}
                handleChange={(e) => setParkingName(e.target.value)}
                isDisabled={true}
              />
            )}
          </div>

          <div className="color w-full mt-4">
            {isEditable ? (
              <InputField
                type="color"
                placeholder={"Color code"}
                inputPlaceholder={"Enter color code"}
                value={colorCode}
                disabled={false}
                handleChange={handleColorSelect}
                // isError={true}
                // errMsg={"Enter slot more then '0' "}
              />
            ) : (
              <ValueInput
                type="color"
                // icon={<BsGeoAlt className="text-2xl text-gray-400" />}
                placeholder={"Color"}
                inputPlaceholder={"Color"}
                value={colorCode}
                isDisabled={true}
              />
            )}
          </div>

          <div className="w-full mt-4">
            {isEditable ? (
              <div className="w-full">
                <p className="text-[14 px] text-black font-semibold">
                  Select gate
                </p>
                <div className="authorizedNameInput w-full h-auto border border-gray-300 rounded-lg">
                  <div className="authorizedName flex items-center h-full">
                    <Select
                      options={gateData}
                      value={gates}
                      components={animatedComponents}
                      isMulti
                      name="gate"
                      placeholder="Select gate"
                      onBlur={() => {
                        if (selectedAdditionalGates.length > 0) {
                          setGateData((prevSelected) => [
                            ...prevSelected,
                            ...selectedAdditionalGates,
                          ]);
                          setSelectedAdditionalGates([]); // Clear the selected additional gates
                        }
                      }}
                      onChange={(selectedOptions) => setGates(selectedOptions)}
                      className="basic-multi-select h-full flex item-center bg-transparent"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text">
                <p className="text-[14px] font-semibold ms-1 mb-1">Gates</p>
                <div className="garbaName flex items-center rounded-lg bg-[#f2f2f2] p-3">
                  <div className="details w-full ps-3">
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      {gates?.map((item, i) => {
                        return (
                          <p key={i} className="bg-gray-300 p-2 rounded-sm">
                            {item.label}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full mt-4">
            {isEditable ? (
              <div>
                <p className="text-[14px] text-black font-semibold">
                  Select Zone
                </p>
                <div className="authorizedNameInput w-full h-auto border border-gray-300 rounded-lg">
                  <div className="authorizedName flex items-center h-full flex-wrap">
                    <Select
                      options={zoneData}
                      value={zones}
                      components={animatedComponents}
                      placeholder="Select zone"
                      isMulti
                      name="zone"
                      onChange={(selectedOptions) => setZones(selectedOptions)}
                      onBlur={() => {
                        if (selectedAdditionalZones.length > 0) {
                          setZoneData((prevSelected) => [
                            ...prevSelected,
                            ...selectedAdditionalZones,
                          ]);
                          setSelectedAdditionalZones([]); // Clear the selected additional gates
                        }
                      }}
                      className="basic-multi-select h-full flex item-center bg-transparent "
                      classNamePrefix="select"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text">
                <p className="text-[14px] font-semibold ms-1 mb-1">Zones</p>
                <div className="garbaName flex items-center rounded-lg bg-[#f2f2f2] p-3">
                  <div className="details w-full ps-3">
                    <div className="flex  items-center gap-2 mt-2 flex-wrap">
                      {zones?.map((item, i) => {
                        return (
                          <p className="bg-gray-300 p-2 rounded-sm" key={i}>
                            {item.label}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-full mt-4">
            {isEditable ? (
              <div className="w-full">
                <p className="text-[14px] text-black font-semibold">
                  Select checkpoint
                </p>
                <div className="authorizedNameInput w-full h-auto border border-gray-300 rounded-lg">
                  <div className="authorizedName flex items-center h-full">
                    <Select
                      options={checkPointData}
                      value={checkPoints}
                      components={animatedComponents}
                      placeholder="Select checkpoint"
                      isMulti
                      name="checkpoint"
                      onChange={(selectedOptions) =>
                        setCheckPoints(selectedOptions)
                      }
                      onBlur={() => {
                        if (selectedAdditionalCheckpoint.length > 0) {
                          setGateData((prevSelected) => [
                            ...prevSelected,
                            ...selectedAdditionalCheckpoint,
                          ]);
                          setSelectedAdditionalCheckpoint([]); // Clear the selected additional gates
                        }
                      }}
                      className="basic-multi-select h-full flex item-center bg-transparent"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text">
                <p className="text-[14px] font-semibold ms-1 mb-1">
                  Check Point
                </p>
                <div className="garbaName flex items-center rounded-lg bg-[#f2f2f2] p-3">
                  <div className="details w-full  ps-3">
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {checkPoints?.map((item, i) => {
                        return (
                          <p key={i} className="bg-gray-200 p-2 rounded-sm">
                            {item.label}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full flex items-center gap-2 mt-16 mb-24">
            <PrimaryButton
              title={isEditable ? "Submit" : "Edit Details"}
              background={isEditable ? "bg-primary" : "bg-black"}
              handleClick={
                isEditable ? handleUpdate : () => setIsEditable(true)
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

export default TicketInfo;
