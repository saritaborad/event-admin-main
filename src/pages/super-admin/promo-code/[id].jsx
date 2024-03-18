import React, { useEffect, useState } from "react";
import { BsPercent, BsTag, BsPerson } from "react-icons/bs";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import ValueInput from "../../../componets/ui-elements/ValueInput";
import { makeApiCall } from "../../../api/Post";
import Loader from "../../../componets/ui-elements/Loader";
import InputField from "../../../componets/ui-elements/InputField";

const Info = () => {
  const [loading, setLoading] = useState(false);
  const [promocode, setPromocode] = useState();
  const [discount, setDiscount] = useState();
  const [remark, setRemark] = useState();

  const [isEditable, setIsEditable] = useState(false);

  const navigate = useNavigate();
  const param = useParams();
  const promocodeId = param.id;

  const findPromocode = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall(
        "post",
        "promocode/update",
        {
          promocode_id: promocodeId,
        },
        "raw"
      );
      console.log(response.data.data);
      setRemark(response.data.data.remark);
      setPromocode(response.data.data.promo_code);
      setDiscount(response.data.data.discount_percentage);
      // setMaxDiscount(response.data.data.max_discount);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    // setLoading(true);
    try {
      const response = await makeApiCall(
        "post",
        "promocode/update",
        {
          promocode_id: promocodeId,
          remark: remark,
          promo_code: promocode,
          discount_percentage: discount,
        },
        "raw"
      );
      setLoading(false);
      console.log(response);
      navigate("/role/superadmin/promocode");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {};

  useEffect(() => {
    findPromocode();
  }, []);

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="h-[90vh] m-[2px] p-[25px] rounded-[30px] mt-4 flex flex-col gap-[100px] bg-white justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="flex flex-col gap-[25px] justify-start items-center">
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  icon={<BsPerson className="text-2xl" />}
                  placeholder={"Remarks"}
                  inputPlaceholder={"Enter remarks"}
                  value={remark}
                  handleChange={(e) => setRemark(e.target.value)}
                  disabled={false}
                />
              ) : (
                <ValueInput
                  type={"text"}
                  icon={<BsPerson className="text-2xl text-gray-400" />}
                  placeholder={"InfluencerName"}
                  inputPlaceholder={remark}
                  handleChange={(e) => setRemark(e.target.value)}
                  isDisabled={true}
                />
              )}
            </div>
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  icon={<BsTag className="text-2xl" />}
                  placeholder={"Gate Location Reference"}
                  inputPlaceholder={"Enter your gate location"}
                  value={promocode}
                  handleChange={(e) => setPromocode(e.target.value)}
                  disabled={false}
                />
              ) : (
                <ValueInput
                  type={"text"}
                  icon={<BsTag className="text-2xl text-gray-400" />}
                  placeholder={"Promocode"}
                  inputPlaceholder={promocode}
                  handleChange={(e) => setPromocode(e.target.value)}
                  isDisabled={true}
                />
              )}
            </div>
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  icon={<BsPercent className="text-2xl" />}
                  placeholder={"Discount Percentage"}
                  inputPlaceholder={"Enter Discount Percentage"}
                  value={discount}
                  handleChange={(e) => setDiscount(e.target.value)}
                  disabled={false}
                />
              ) : (
                <ValueInput
                  type={"text"}
                  icon={<BsPercent className="text-2xl text-gray-400" />}
                  placeholder={"Discount Percentage"}
                  inputPlaceholder={discount}
                  handleChange={(e) => setDiscount(e.target.value)}
                  isDisabled={true}
                />
              )}
            </div>
            {/* <div className="w-full">
            {isEditable ? (
              <InputField
                type="text"
                icon={<HiOutlineCurrencyRupee className="text-2xl" />}
                placeholder={"Max Discount"}
                inputPlaceholder={"Enter Max Discount"}
                value={maxDiscount}
                handleChange={(e) => setMaxDiscount(e.target.value)}
                disabled={false}
              />
            ) : (
              <ValueInput
                type={"text"}
                icon={<HiOutlineCurrencyRupee className="text-2xl text-gray-400" />}
                placeholder={"Max Discount"}
                inputPlaceholder={maxDiscount}
                handleChange={(e) => setMaxDiscount(e.target.value)}
              isDisabled={true}
              />
            )}
          </div> */}
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
    </>
  );
};

export default Info;
