import React, { useState, useEffect } from "react";
import { BsShieldCheck, BsGeoAlt, BsDoorClosed } from "react-icons/bs";
import PrimaryButton from "../../../../componets/ui-elements/PrimaryButton";
import ValueInput from "../../../../componets/ui-elements/ValueInput";
import { useNavigate, useParams } from "react-router-dom";
import { LuParkingSquare } from "react-icons/lu";
import { makeApiCall } from "../../../../api/Post";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import Loader from "../../../../componets/ui-elements/Loader";
import InputField from "../../../../componets/ui-elements/InputField";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const PriceCategoryInfo = () => {
  const param = useParams();
  const prizeCategoryId = param.id;
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();

  const [loading, setLoading] = useState(false);
  const [prizeName, setPrizeName] = useState();
  const [type, setType] = useState();
  const [prizeRank, setPrizeRank] = useState();

  const [isEditable, setIsEditable] = useState(false);

  const findParking = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "get",
        "judge/getprizecategory/" + prizeCategoryId,
        null,
        "raw"
      );
      console.log(response);
      if (response.data.status) {
        setPrizeName(response.data.data.prize_name);
        setType(response.data.data.type);
        setPrizeRank(response.data.data.prize_rank);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "post",
        "judge/updateprizecategory",
        {
          prize_category_id: prizeCategoryId,
          prize_name: prizeName,
          type: type,
          prize_rank: prizeRank,
          couple_flag: type === "Couple" ? true : false,
        },
        "raw"
      );
      if (response.data.status === 1) {
        console.log(response);
        navigate("/role/superadmin/judgedashboard/price-category");
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
        "judge/deleteprizecategory",
        {
          prize_category_id: prizeCategoryId,
        },
        "raw"
      );
      console.log("first");
      console.log(response);
      if (response.data.status === 1) {
        setLoading(false);
        navigate("/role/superadmin/judgedashboard/price-category");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    findParking();
  }, []);

  const genderData = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Couple", label: "Couple" },
  ];

  const rankPrizeData = [
    { value: "01", label: "01" },
    { value: "02", label: "02" },
    { value: "03", label: "03" },
    { value: "04", label: "04" },
    { value: "05", label: "05" },
    { value: "06", label: "06" },
    { value: "07", label: "07" },
    { value: "08", label: "08" },
    { value: "09", label: "09" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ];

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="h-auto">
        <div className="flex flex-col items-center justify-start gap-[100px] h-full relative bg-white mx-1 rounded-3xl p-[25px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
          <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
            <div className="flex flex-col gap-[25px] justify-start items-center w-full">
              <div className="w-full">
                {isEditable ? (
                  <InputField
                    type="text"
                    icon={<LuParkingSquare className="text-2xl" />}
                    placeholder={"Prize Name"}
                    inputPlaceholder={"Enter Prize Name"}
                    value={prizeName}
                    handleChange={(e) => setPrizeName(e.target.value)}
                    disabled={false}
                  />
                ) : (
                  <ValueInput
                    type="text"
                    icon={
                      <LuParkingSquare className="text-2xl text-gray-400" />
                    }
                    placeholder={"Prize Name"}
                    inputPlaceholder={prizeName}
                    handleChang={(e) => setPrizeName(e.target.value)}
                    isDisabled={true}
                  />
                )}
              </div>

              <div className="w-full">
                {isEditable ? (
                  <>
                    <p className="text-[14px] font-semibold ms-1 mb-1">
                      Gender Type
                    </p>
                    <div className="authorizedNameInput w-full p-2 h-14 border border-gray-300 rounded-lg">
                      <Select
                        options={genderData}
                        icon={<LuParkingSquare className="text-2xl" />}
                        components={animatedComponents}
                        placeholder={type ? type : "Select Gender"}
                        name="type"
                        onChange={(e) => {
                          setType(e.value);
                        }}
                        className="basic-multi-select h-full flex item-center bg-transparent"
                        classNamePrefix="select"
                      />
                    </div>
                  </>
                ) : (
                  <ValueInput
                    type="text"
                    icon={<BsGeoAlt className="text-2xl text-gray-400" />}
                    placeholder={"Gender"}
                    inputPlaceholder={type}
                    handleChange={(e) => setType(e.target.value)}
                    isDisabled={true}
                  />
                )}
              </div>

              <div className="w-full">
                {isEditable ? (
                  <>
                    <p className="text-[14px] font-semibold ms-1 mb-1">
                      Prize Rank
                    </p>
                    <div className="authorizedNameInput w-full p-2 h-14 border border-gray-300 rounded-lg">
                      <Select
                        options={rankPrizeData}
                        icon={<LuParkingSquare className="text-2xl" />}
                        components={animatedComponents}
                        placeholder={
                          prizeRank ? prizeRank : "Select Prize Rank"
                        }
                        name="prizeRank"
                        onChange={(e) => {
                          setPrizeRank(e.value);
                        }}
                        className="basic-multi-select h-full flex item-center bg-transparent"
                        classNamePrefix="select"
                      />
                    </div>
                  </>
                ) : (
                  <ValueInput
                    type="number"
                    icon={<BsGeoAlt className="text-2xl text-gray-400" />}
                    placeholder={"Prize Rank"}
                    inputPlaceholder={prizeRank}
                    handleChange={(e) => setPrizeRank + e.target.value}
                    isDisabled={true}
                  />
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

export default PriceCategoryInfo;
