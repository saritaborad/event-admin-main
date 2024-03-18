import React, { useState } from "react";
import PrimaryButton from "../../../../componets/ui-elements/PrimaryButton";
import InputField from "../../../../componets/ui-elements/InputField";
import { useNavigate } from "react-router-dom";
import { makeApiCall } from "../../../../api/Post";
import { colorCodeMenu } from "../../../../utils/ColorCode";
import Alert from "../../../../componets/ui-elements/Alert";

const NewTicketZone = () => {
  const [zoneName, setZoneName] = useState();
  const [colorCode, setColorCode] = useState();
  const navigate = useNavigate();
  const [colorCodeShow, setColorCodeShow] = useState();
  const [displayColor, setDisplayColor] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "post",
        "zone/create",
        {
          zone_name: zoneName,
          color_code: colorCode,
          pass_zone: false,
          ticket_zone: true,
          // fun_zone: false,
          price: 0,
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
  };

  
  const handleColorSelect = (event) => {
    const rawColorValue = event.target.value;
    const colorWithoutHash = rawColorValue.substring(1); // Remove the "#" symbol
    const formattedColorValue = "0xff" + colorWithoutHash; // Add "0xff" prefix
    console.log(formattedColorValue)
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
    navigate("/role/superadmin/zone");
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
              placeholder={"Ticket Zone Name"}
              inputPlaceholder={"Enter Ticket Zone Name"}
              value={null}
              handleChange={(e) => setZoneName(e.target.value)}
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

export default NewTicketZone;
