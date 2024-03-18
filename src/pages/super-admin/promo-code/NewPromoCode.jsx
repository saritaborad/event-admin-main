import React, { useState } from "react";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { makeApiCall } from "../../../api/Post";
import { useNavigate } from "react-router-dom";
import InputField from "../../../componets/ui-elements/InputField";
import Alert from "../../../componets/ui-elements/Alert";

const NewPromoCode = () => {
  const [remark, setRemark] = useState();
  const [promocode, setPromocode] = useState();
  const [discount, setDiscount] = useState();
  const navigate = useNavigate();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const params = {
    remark: remark,
    promo_code: promocode,
    discount_percentage: discount,
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "post",
        "promocode/create",
        params,
        "raw"
      );
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
        // setInfluencerName(null);
        setPromocode(null);
        setDiscount(null);
        // setMaxDiscount(null);
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

  const handleClick = () => {
    if (promocode && discount) {
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
    navigate("/role/superadmin/promocode");
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
      <div className="h-[90vh] m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[100px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
        <div className="flex flex-col gap-[25px] justify-start items-center">
          <div className="w-full">
            <InputField
              type="text"
              placeholder={"Remark"}
              inputPlaceholder={"Enter Remark"}
              value={remark}
              handleChange={(e) => setRemark(e.target.value)}
              disabled={false}
            />
          </div>
          <div className="w-full">
            <InputField
              type="text"
              placeholder={"Promocode"}
              inputPlaceholder={"Enter Promocode"}
              value={promocode}
              handleChange={(e) => setPromocode(e.target.value)}
              disabled={false}
            />
          </div>
          <div className="w-full">
            <InputField
              type="number"
              placeholder={"Discount Percentage"}
              inputPlaceholder={"Enter Discount Percentage"}
              value={discount}
              handleChange={(e) => setDiscount(e.target.value)}
              disabled={false}
            />
          </div>
          {/* <div className="w-full">
            <InputField
              type="number"
              icon={<HiOutlineCurrencyRupee className="text-2xl" />}
              placeholder={"Max Discount"}
              inputPlaceholder={"Enter Max Discount"}
              value={maxDiscount}
              handleChange={(e) => setMaxDiscount(e.target.value)}
              disabled={false}
            />
          </div> */}
        </div>

        <div className="flex items-center mt-16 gap-4">
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

export default NewPromoCode;
