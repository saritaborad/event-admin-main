import React, { useState, useEffect } from "react";
import { BsGeoAlt } from "react-icons/bs";
import PrimaryButton from "../../../../componets/ui-elements/PrimaryButton";
import ValueInput from "../../../../componets/ui-elements/ValueInput";
import { useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../../../api/Post";
import { LuParkingSquare } from "react-icons/lu";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import Loader from "../../../../componets/ui-elements/Loader";
import { colorCodeMenu } from "../../../../utils/ColorCode";
import { filterByProperty } from "../../../../utils/CommonFunctions";
import InputField from "../../../../componets/ui-elements/InputField";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const PassParkingInfo = () => {
  const param = useParams();
  const animatedComponents = makeAnimated();
  const navigate = useNavigate();
  const parkingId = param.id;

  const [loading, setLoading] = useState(false);
  const [parkingName, setParkingName] = useState();
  const [slot, setSlot] = useState();
  const [reserveSlot, setreserveSlot] = useState();
  const [price, setPrice] = useState();
  const [colorCode, setColorCode] = useState();
  const [displayColor, setDisplayColor] = useState();

  const [isEditable, setIsEditable] = useState(false);

  const [gates, setGates] = useState([]);
  const [gateData, setGateData] = useState();
  const [selectedAdditionalGates, setSelectedAdditionalGates] = useState([]);

  const findParking = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "get",
        "parking/info/" + parkingId,
        null,
        "raw"
      );
      if (response.data.status) {
        setParkingName(response.data.data.parking_name);
        setSlot(response.data.data.slot);
        setreserveSlot(response.data.data.reserve_slot);
        setPrice(response.data.data.price);

        const updateColor = "#" + response.data.data.color_code.substring(4);
        setColorCode(updateColor);

        const rawGates = response.data.data.gates;

        const transformedGate = rawGates.map((item) => ({
          value: item._id,
          label: item.gate_name,
        }));

        setGates(transformedGate);

        setLoading(false);
      } else {
        setLoading(false);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    const gateArray = gates.map((gate) => gate.value);

    const colorWithoutHash = colorCode.substring(1); // Remove the "#" symbol
    const formattedColorValue = "0xff" + colorWithoutHash; // Add "0xff" prefix

    try {
      const response = await makeApiCall(
        "post",
        "parking/update",
        {
          parking_id: parkingId,
          parking_name: parkingName,
          color_code: formattedColorValue,
          slot: slot,
          reserve_slot: reserveSlot,
          price: price,
          gates: gateArray,
        },
        "raw"
      );
      if (response.data.status === 1) {
        setLoading(false);
        console.log(response);
        navigate("/role/superadmin/parkingdashboard/passparking");
      } else {
        setLoading(false);
        console.log(response);
      }
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
        "parking/delete",
        {
          parking_id: parkingId,
        },
        "raw"
      );
      console.log("first");
      console.log(response);
      if (response.data.status === 1) {
        setLoading(false);
        navigate("/role/superadmin/parkingdashboard/passparking");
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
  };

  useEffect(() => {
    findParking();
    fetchData();
  }, []);

  const handleColorSelect = (event) => {
    const rawColorValue = event.target.value;
    setColorCode(rawColorValue);
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="h-auto">
        <div className="flex flex-col items-center justify-start gap-[100px] h-full relative bg-white  mx-1 rounded-3xl p-[25px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
          <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
            <div className="flex flex-col gap-[25px] justify-start items-center w-full">
              <div className="w-full">
                {isEditable ? (
                  <InputField
                    type="text"
                    icon={<LuParkingSquare className="text-2xl" />}
                    placeholder={"Pass Parking Name"}
                    inputPlaceholder={"Enter Parking Name"}
                    value={parkingName}
                    handleChange={(e) => setParkingName(e.target.value)}
                    disabled={false}
                  />
                ) : (
                  <ValueInput
                    type="text"
                    icon={
                      <LuParkingSquare className="text-2xl text-gray-400" />
                    }
                    placeholder={"Parking Pass Name"}
                    inputPlaceholder={parkingName}
                    handleChange={(e) => setParkingName(e.target.value)}
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
                <ValueInput
                  type="number"
                  icon={<BsGeoAlt className="text-2xl text-gray-400" />}
                  placeholder={"Total Slot"}
                  inputPlaceholder={slot}
                  handleChange={(e) => setSlot(e.target.value)}
                  isDisabled={true}
                />
              </div>

              <div className="w-full">
                <ValueInput
                  type="text"
                  icon={<BsGeoAlt className="text-2xl text-gray-400" />}
                  placeholder={"Reserve Slot"}
                  inputPlaceholder={reserveSlot}
                  handleChange={(e) => setreserveSlot(e.target.value)}
                  isDisabled={true}
                />
              </div>

              <div className="w-full">
                {isEditable ? (
                  <InputField
                    type="number"
                    icon={<HiOutlineCurrencyRupee className="text-2xl" />}
                    placeholder={"Price"}
                    inputPlaceholder={"Price"}
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

export default PassParkingInfo;
