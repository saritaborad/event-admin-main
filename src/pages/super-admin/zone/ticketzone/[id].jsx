import React, { useState, useEffect } from "react";
import { BsGeo } from "react-icons/bs";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import PrimaryButton from "../../../../componets/ui-elements/PrimaryButton";
import ValueInput from "../../../../componets/ui-elements/ValueInput";
import { useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../../../api/Post";
import Loader from "../../../../componets/ui-elements/Loader";
import { colorCodeMenu } from "../../../../utils/ColorCode";
import { filterByProperty } from "../../../../utils/CommonFunctions";
import InputField from "../../../../componets/ui-elements/InputField";
import { LuParkingCircle } from "react-icons/lu";

const ZoneInfo = () => {
  const param = useParams();
  const [singlZone, setZone] = useState(null);
  const zoneId = param.id;
  const [loading, setLoading] = useState(false);
  const [zoneName, setZoneName] = useState();
  const [price, setPrice] = useState();
  const navigate = useNavigate();
  const [colorCode, setColorCode] = useState();
  const [colorCodeShow, setColorCodeShow] = useState();
  const [displayColor, setDisplayColor] = useState();

  const [isEditable, setIsEditable] = useState(false);

  const findZone = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "post",
        "zone/update",
        {
          zone_id: zoneId,
        },
        "raw"
      );
      console.log(response.data.data);
      if (response.data.status) {
        setZoneName(response.data.data.zone_name);
        const updateColor = "#" + response.data.data.color_code.substring(4);
        setColorCode(updateColor);
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
        },
        "raw"
      );
      setLoading(false);
      console.log(response);
      navigate("/role/superadmin/zone");
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
        "zone/delete",
        {
          zone_id: zoneId,
        },
        "raw"
      );
      console.log(response);
      if (response.data.status === 1) {
        setLoading(false);
        navigate("/role/superadmin/zone");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    findZone();
  }, []);

  const handleColorSelect = (event) => {
    const rawColorValue = event.target.value;
    setColorCode(rawColorValue);
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="createGarbaClassSubmit  h-[92vh]">
        <div className="flex flex-col items-center justify-start gap-[100px] h-full relative bg-white  mx-1 rounded-3xl p-[25px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
          <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
            <div className="flex flex-col gap-[25px] justify-start items-center w-full">
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
                    placeholder={"Create Zone Name"}
                    inputPlaceholder={zoneName}
                    name="zone_name"
                    isDisabled={true}
                    handleChange={(e) => setZoneName(e.target.value)}
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
            </div>
            <div className="w-full flex items-center mt-16 gap-2">
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

export default ZoneInfo;
