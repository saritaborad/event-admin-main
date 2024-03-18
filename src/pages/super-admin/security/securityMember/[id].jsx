import React, { useEffect, useState } from "react";
import { BsShieldCheck, BsGeoAlt, BsDoorClosed } from "react-icons/bs";
import PrimaryButton from "../../../../componets/ui-elements/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import ValueInput from "../../../../componets/ui-elements/ValueInput";
import { makeApiCall } from "../../../../api/Post";
import Loader from "../../../../componets/ui-elements/Loader";
import InputField from "../../../../componets/ui-elements/InputField";
import Alert from "../../../../componets/ui-elements/Alert";

const Info = () => {
  const [singlGate, setGate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [securityName, setSecurityName] = useState();
  const [gateLocation, setGateLocation] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();

  const [isEditable, setIsEditable] = useState(false);

  const navigate = useNavigate();
  const param = useParams();
  const gateId = param.id;

  const findSecurity = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall(
        "post",
        "gate/update",
        {
          gate_id: gateId,
        },
        "raw"
      );
      console.log(response.data.data);
      setGateName(response.data.data.gate_name);
      setGateLocation(response.data.data.location_reference);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // const handleUpdate = async () => {
  //   // setLoading(true);
  //   console.log(gateName);
  //   console.log(gateLocation);
  //   try {
  //     const response = await makeApiCall(
  //       "post",
  //       "gate/update",
  //       {
  //         gate_id: gateId,
  //         gate_name: gateName,
  //         location_reference: gateLocation,
  //       },
  //       userData.token,
  //       "raw"
  //     );
  //     setLoading(false);
  //     console.log(response);
  //     navigate("/role/superadmin/gate");
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false);
  //   }
  // };

  // const handleDelete = async () => {
  //   setLoading(true);
  //   console.log(gateId);
  //   try {
  //     const response = await makeApiCall(
  //       "post",
  //       "gate/delete",
  //       {
  //         gate_id: gateId,
  //       },
  //       userData.token,
  //       "raw"
  //     );
  //     console.log("first");
  //     console.log(response);
  //     if (response.data.status === 1) {
  //       setLoading(false);
  //       navigate("/role/superadmin/gate");
  //     } else {
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    findSecurity();
  }, []);

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="h-[90vh] m-[2px] p-[25px] rounded-[30px] mt-4 flex flex-col gap-[100px] bg-white justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="flex flex-col gap-[25px] justify-start items-center">
          <div className="w-full">
            {isEditable ? (
              <InputField
                type="text"
                icon={<BsDoorClosed className="text-2xl" />}
                placeholder={"Security Name"}
                inputPlaceholder={"Enter Security name"}
                value={securityName}
                handleChange={(e) => setSecurityName(e.target.value)}
                disabled={false}
              />
            ) : (
              <ValueInput
                type={"text"}
                icon={<BsDoorClosed className="text-2xl text-gray-400" />}
                placeholder={"Security Name"}
                inputPlaceholder={securityName}
                handleChange={(e) => setSecurityName(e.target.value)}
                isDisabled={true}
              />
            )}
          </div>
          <div className="w-full">
            {isEditable ? (
              <InputField
                type="text"
                icon={<BsGeoAlt className="text-2xl" />}
                placeholder={"Gate Location Reference"}
                inputPlaceholder={"Enter your gate location"}
                value={gateLocation}
                handleChange={(e) => setLocation(e.target.value)}
                disabled={false}
              />
            ) : (
              <ValueInput
                isDisabled={true}
                type={"text"}
                icon={<BsGeoAlt className="text-2xl text-gray-400" />}
                placeholder={"Location Reference"}
                inputPlaceholder={gateLocation}
                handleChange={(e) => setGateLocation(e.target.value)}
              />
            )}
          </div>
        </div>
        <div className="w-full flex items-center gap-2">
          <PrimaryButton
            title={isEditable ? "Submit" : "Edit Details"}
            background={isEditable ? "bg-primary" : "bg-black"}
            handleClick={isEditable ? handleUpdate : () => setIsEditable(true)}
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
    </>
  );
};

export default Info;
