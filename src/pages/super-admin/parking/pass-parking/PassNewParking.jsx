import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../../componets/ui-elements/PrimaryButton";
import { useNavigate } from "react-router-dom";
import InputField from "../../../../componets/ui-elements/InputField";
import { makeApiCall } from "../../../../api/Post";
import { colorCodeMenu } from "../../../../utils/ColorCode";
import Alert from "../../../../componets/ui-elements/Alert";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { filterByProperty } from "../../../../utils/CommonFunctions";

const PassNewParking = () => {
  const [parkingName, setParkingName] = useState();
  const [slot, setSlot] = useState();
  const [reservSlot, setReservSlot] = useState();
  const [price, setPrice] = useState();
  const [loading, setLoading] = useState(false);
  const [vehical, setVehical] = useState(1); // 1 for car // 2 for bike
  const [colorCode, setColorCode] = useState();
  const [colorCodeShow, setColorCodeShow] = useState();
  const [displayColor, setDisplayColor] = useState();
  const navigate = useNavigate();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const [gates, setGates] = useState([]);
  const [gateData, setGetData] = useState([]);

  const params = {
    parking_name: parkingName,
    slot: slot,
    reserve_slot: reservSlot,
    color_code: colorCode,
    pass_parking: true,
    ticket_parking: false,
    car_parking: vehical === 1 ? true : false,
    two_wheeler_parking: vehical === 2 ? true : false,
    price: price,
    gates: gates,
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      setLoading(true);
      const response = await makeApiCall(
        "post",
        "parking/create",
        params,
        "raw"
      );
      // const response = console.log(params)
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
        setLoading(false);
        setParkingName(null);
        setSlot(null);
        setReservSlot(null);
        setPrice(null);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMsg("Something went wrong please try later");
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
    const isValidParams = () => {
      return Object.values(params).every(
        (value) => value !== null && value !== undefined
      );
    };
    if (isValidParams()) {
      if (params.slot >= params.reserve_slot) {
        setIsAlert(true);
        setStatus("start");
      } else {
        setIsAlert(true);
        setStatus("error");
        setErrorMsg("Reserved sloat not more then normal slots");
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
    navigate("/role/superadmin/parkingdashboard/passparking");
  };

  const fetchData = async () => {
    const responseGate = await makeApiCall("get", "gate/all", null, "raw");

    const rawData = filterByProperty(
      responseGate?.data.gates,
      "is_deleted",
      false
    );
    const filterData = filterByProperty(rawData, "parking_gate", true);

    const gateOptions = filterData.map((gate) => ({
      value: gate._id,
      label: gate.gate_name,
    }));
    setGetData(gateOptions);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const animatedComponents = makeAnimated();

  console.log(gateData);

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
                placeholder={"Parking Name"}
                inputPlaceholder={"Enter Parking Name"}
                // value={parkingName}
                handleChange={(e) => setParkingName(e.target.value)}
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

            <div className="w-full">
              <InputField
                type="number"
                placeholder={"Total Slot"}
                inputPlaceholder={"Enter Total Slot"}
                // value={null}
                disabled={false}
                handleChange={(e) => setSlot(parseInt(e.target.value))}
                // isError={true}
                // errMsg={"Enter slot more then '0' "}
              />
            </div>
            <div className="w-full flex flex-col ">
              <InputField
                type="number"
                placeholder={"Reserve Slot"}
                inputPlaceholder={"Enter Reserve Slot"}
                // value={null}
                disabled={false}
                handleChange={(e) => setReservSlot(parseInt(e.target.value))}
                // isError={true}
                // errMsg={"Reserve slot not more then Slots"}
              />
              {/* {slot && reservSlot ? (
              <p className="mt-2 ms-auto">Total sloats : {slot + reservSlot}</p>
            ) : null} */}
            </div>

            <div className="w-full">
              <InputField
                type="number"
                placeholder={"Price"}
                inputPlaceholder={"Enter Price"}
                // value={null}
                disabled={false}
                handleChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="w-full">
              <div className="w-full py-1 border border-gray-300 rounded-2xl">
                <div className="flex items-center">
                  <div className="mx-1 relative flex item-center justify-between w-full gap-3  border-gray-300">
                    <div
                      className={`w-2/4 flex items-center justify-center text-[14px] h-[50px] rounded-xl text-center z-0 bg-primary absolute ${
                        vehical === 2
                          ? " translate-x-full transition-all  "
                          : "translate-x-[0] transition-all "
                      }`}
                    ></div>
                    <div
                      className={`w-2/4 flex items-center justify-center text-[18px] h-[50px] z-50 rounded-xl text-center ${
                        vehical === 1 ? "text-white" : null
                      }`}
                      onClick={() => setVehical(1)}
                    >
                      Car
                    </div>
                    <div
                      className={`w-2/4 flex items-center justify-center text-[18px] h-[50px] z-50 rounded-xl text-center ${
                        vehical === 2 ? " text-white " : null
                      }`}
                      onClick={() => setVehical(2)}
                    >
                      Bike
                    </div>
                  </div>
                </div>
              </div>
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

export default PassNewParking;
