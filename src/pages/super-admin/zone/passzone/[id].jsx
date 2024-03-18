import React, { useState, useEffect } from "react";
import { BsGeo } from "react-icons/bs";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { IoIosColorFilter, IoMdTrendingUp } from "react-icons/io";
import PrimaryButton from "../../../../componets/ui-elements/PrimaryButton";
import ValueInput from "../../../../componets/ui-elements/ValueInput";
import { useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../../../api/Post";
import Loader from "../../../../componets/ui-elements/Loader";
import { filterByProperty } from "../../../../utils/CommonFunctions";
import InputField from "../../../../componets/ui-elements/InputField";
import { LuParkingCircle } from "react-icons/lu";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const PassZoneInfo = () => {
  const [singlZone, setZone] = useState(null);
  const param = useParams();
  const zoneId = param.id;
  const [loading, setLoading] = useState(false);
  const [zoneName, setZoneName] = useState();
  const [colorCode, setColorCode] = useState();
  const [colorCodeShow, setColorCodeShow] = useState();
  const [displayColor, setDisplayColor] = useState();
  const [price, setPrice] = useState();
  const navigate = useNavigate();

  const [isEditable, setIsEditable] = useState(false);

  const [gates, setGates] = useState([]);
  const [gateData, setGateData] = useState();
  const [checkPoints, setCheckPoints] = useState([]);
  const [checkPointData, setCheckPointData] = useState();
  const [selectedAdditionalGates, setSelectedAdditionalGates] = useState([]);
  const [selectedAdditionalCheckPoints, setSelectedAdditionalCheckPoints] =
    useState([]);

  const animatedComponents = makeAnimated();

  const findZone = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "get",
        "zone/info/" + zoneId,
        null,
        "raw"
      );

      console.log(response);

      if (response.data.status) {
        setZoneName(response.data.tickets.zone_name);
        setPrice(response.data.tickets.price);
        const updateColor = "#" + response.data.tickets.color_code.substring(4);
        setColorCode(updateColor);
        setLoading(false);

        const rawGates = response.data.tickets.gates;

        console.log(rawGates);
        const transformedGate = rawGates.map((item) => ({
          value: item._id,
          label: item.gate_name,
        }));

        // setGateData(transformedGate);
        setGates(transformedGate);

        const rawCheckpoint = response.data.tickets.checkpoints;
        console.log(rawCheckpoint);

        const transformedCheckpoint = rawCheckpoint.map((item) => ({
          value: item._id,
          label: item.checkpoint_name,
        }));

        // setGateData(transformedGate);
        setCheckPoints(transformedCheckpoint);
      } else {
        setLoading(false);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const resGate = await makeApiCall(
      "get",
      "/gate/all",
      null,
      "raw"
    );
    const rawGates = resGate.data.gates;
    const filterdGates = filterByProperty(rawGates, "is_deleted", false);
    const transformedGate = filterdGates.map((item) => ({
      value: item._id,
      label: item.gate_name,
    }));
    setGateData(transformedGate);

    const resCheckPoint = await makeApiCall(
      "get",
      "/checkpoint/all",
      null,
      "raw"
    );
    const rawCheckPoints = resCheckPoint.data.data;
    const filterdCheckPoint = filterByProperty(
      rawCheckPoints,
      "is_deleted",
      false
    );
    const transformedCheckPoint = filterdCheckPoint.map((item) => ({
      value: item._id,
      label: item.checkpoint_name,
    }));
    setCheckPointData(transformedCheckPoint);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const gateArray = gates.map((gate) => gate.value);
    const checkpointArray = checkPoints.map((checkpoint) => checkpoint.value);

    const colorWithoutHash = colorCode.substring(1); // Remove the "#" symbol
    const formattedColorValue = "0xff" + colorWithoutHash; // Add "0xff" prefix

    try {
      const response = await makeApiCall(
        "post",
        "zone/update",
        {
          zone_id: zoneId,
          zone_name: zoneName,
          color_code: formattedColorValue,
          price: price,
          gates: gateArray,
          checkpoints: checkpointArray,
        },
        "raw"
      );
      setLoading(false);
      console.log(response);
      navigate("/role/superadmin/passzone");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    findZone();
    fetchData();
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "post",
        "zone/delete",
        {
          zone_id: zoneId,
        },
        "raw"
      );
      console.log(response);
      if (response.data.status === 1) {
        setLoading(false);
        navigate("/role/superadmin/passzone");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleColorSelect = (event) => {
    const rawColorValue = event.target.value;
    setColorCode(rawColorValue);
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="createGarbaClassSubmit h-auto">
        <div className="flex flex-col items-center justify-start gap-[100px] h-full relative bg-white mx-1 rounded-3xl p-[25px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="flex flex-col gap-[20px] justify-start items-center w-full">
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  icon={<LuParkingCircle className="text-2xl" />}
                  placeholder={"Pass Zone Name"}
                  inputPlaceholder={"Enter PassZone Name"}
                  value={zoneName}
                  handleChange={(e) => setZoneName(e.target.value)}
                  disabled={false}
                />
              ) : (
                <ValueInput
                  type="text"
                  icon={<BsGeo className="text-2xl text-gray-400" />}
                  placeholder={"Zone Name"}
                  inputPlaceholder={zoneName}
                  handleChange={(e) => setZoneName(e.target.value)}
                  isDisabled={true}
                />
              )}
            </div>

            <div className="color w-full">
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

            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="number"
                  icon={<HiOutlineCurrencyRupee className="text-2xl" />}
                  placeholder={"Price"}
                  inputPlaceholder={"Ente Price"}
                  value={price}
                  handleChange={(e) => setPrice(e.target.value)}
                  disabled={false}
                />
              ) : (
                <ValueInput
                  type="number"
                  icon={
                    <HiOutlineCurrencyRupee className="text-2xl text-gray-400" />
                  }
                  placeholder={"Price"}
                  inputPlaceholder={price}
                  handleChange={(e) => setPrice(e.target.value)}
                  isDisabled={true}
                />
              )}
            </div>

            <div className="w-full">
              {isEditable ? (
                <div className="w-full">
                  <p className="text-[14px] text-black font-semibold">
                    Select gate
                  </p>
                  <div className="authorizedNameInput w-full p-2 h-auto border border-gray-300 rounded-lg">
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
                        onChange={(selectedOptions) =>
                          setGates(selectedOptions)
                        }
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

            <div className="w-full">
              {isEditable ? (
                <div className="w-full">
                  <p className="text-[14px] text-black font-semibold">
                    Select CheckPoint
                  </p>
                  <div className="authorizedNameInput w-full p-2 h-auto border border-gray-300 rounded-lg">
                    <div className="authorizedName flex items-center h-full">
                      <Select
                        options={checkPointData}
                        value={checkPoints}
                        components={animatedComponents}
                        isMulti
                        name="checkPoint"
                        placeholder="Select CheckPoint"
                        onBlur={() => {
                          if (selectedAdditionalCheckPoints.length > 0) {
                            setCheckPointData((prevSelected) => [
                              ...prevSelected,
                              ...selectedAdditionalCheckPoints,
                            ]);
                            setSelectedAdditionalCheckPoints([]); // Clear the selected additional gates
                          }
                        }}
                        onChange={(selectedOptions) =>
                          setCheckPoints(selectedOptions)
                        }
                        className="basic-multi-select h-full flex item-center bg-transparent"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text">
                  <p className="text-[14px] font-semibold ms-1 mb-1">
                    CheckPoint
                  </p>
                  <div className="garbaName flex items-center rounded-lg bg-[#f2f2f2] p-3">
                    <div className="details w-full ps-3">
                      <div className="flex items-center flex-wrap gap-2 mt-2">
                        {checkPoints?.map((item, i) => {
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

export default PassZoneInfo;
