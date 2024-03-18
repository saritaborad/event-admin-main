import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeApiCall } from "../../../api/Post";
import { decodedData, filterByProperty } from "../../../utils/CommonFunctions";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import InputField from "../../../componets/ui-elements/InputField";
import Alert from "../../../componets/ui-elements/Alert";
import Select from "react-select";
import { animatedComponents, genderData } from "../../../utils/commonData";

const ActiveGroundStaff = () => {
  const [staffUser, setStaffUser] = useState({});
  const [staffPhone, setStaffPhone] = useState();
  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [staffUserGender, setStaffUserGender] = useState();
  const [qrId,setQrId]=useState();
  const params = useParams();
  const gsqrcode = decodedData(params.id);

  const fetchData = async () => {
    try {
      const groundStaffResponse = await makeApiCall(
        "get",
        "user/allgroundstaff",
        null,
        "raw"
      );
      const response = await makeApiCall("get", "user/gsqr", null, "raw");
      console.log(response);
      console.log(groundStaffResponse);
      if (groundStaffResponse.data.status === 1 || response.data.status === 1) {
        const rawDt = groundStaffResponse.data.data;
        const rawQr = response.data.data;
        const filterDt = filterByProperty(rawDt, "gsqrcode", gsqrcode);
        const findQR = filterByProperty(rawQr, "gsqrcode", gsqrcode);
        console.log(findQR)
        setQrId(findQR[0].phone_number); 
        setStaffUser(filterDt[0].name);
        setStaffPhone(filterDt[0].phone_number);
        setStaffUserGender({
          label: filterDt[0].gender,
          value: filterDt[0].gender,
        });
      } else {
        console.warn("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = () => {
    setIsAlert(true);
    setStatus("start");
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    navigate("/role/superadmin/physicalqr");
  };

  const handleEditUserInputChange = (e) => {
    const { name, value } = e.target;
    setStaffUser({ ...staffUser, [name]: value });
  };

  const handleConfirm = async () => {
    setStatus("loading");
    const params = {
      name: staffUser ? staffUser : "",
      gender: staffUserGender.value,
      phone_number: staffPhone,
      // qr_id: qrId,
      // blood_group: editDetailParams.blood_group,
      // remark: editDetailParams.remark,
    };

    const response = await makeApiCall(
      "post",
      "user/updategroundstaff",
      params,
      "raw"
    );
    if (response.data.status === 1) {
      setStatus("complete");
      setSuccessMsg(response.data.message);
    } else {
      setStatus("error");
      setErrorMsg(response.data.message);
    }
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
                placeholder={"Name"}
                inputPlaceholder={"Enter gate name"}
                value={staffUser}
                // handleChange={handleEditUserInputChange}
                handleChange={(e) => setStaffUser(e.target.value)}
                disabled={false}
              />
            </div>
          </div>
          <div className="text w-full my-3">
            <p className="text-[14px] font-semibold ms-1 mb-1">Gender</p>
            <div className="authorizedNameInput h-full p-2 border border-gray-300 bg-white rounded-lg">
              <div className="authorizedName flex items-center h-full">
                <Select
                  options={genderData}
                  value={staffUserGender}
                  components={animatedComponents}
                  name="gender"
                  placeholder="Select gender"
                  onChange={(selectedOptions) => setStaffUserGender(selectedOptions)}
                  className="basic-multi-select h-full flex item-center bg-transparent"
                  classNamePrefix="select"
                />
              </div>
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

export default ActiveGroundStaff;




