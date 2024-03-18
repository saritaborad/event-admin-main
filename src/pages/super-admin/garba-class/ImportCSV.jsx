import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import InputField from "../../../componets/ui-elements/InputField";
import Alert from "../../../componets/ui-elements/Alert";
import { useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../../api/Post";
import CsvDownloadButton from "react-json-to-csv";
import Lottie from "lottie-react";
import completed from "../../../assets/lottie/completed.json";
import error from "../../../assets/lottie/error.json";
import logo from "../../../assets/newLogo.svg";

//-- import from react-select
import Select from "react-select";
import makeAnimated from "react-select/animated";

const ImportCSV = () => {
  const [csvFile, setCSVFile] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const [branchList, setBranchList] = useState();
  const [branchId, setbranchId] = useState();

  const [csvResponseData, setCsvResponseData] = useState();

  const params = useParams();
  const navigate = useNavigate();
  const classId = params.branchId;
  const animatedComponents = makeAnimated();

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const data = {
        csv: csvFile,
        branch_id: branchId,
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await makeApiCall(
        "post",
        "user/importcsv",
        formData,
        "formdata"
      );
      // console.log(response.data);
      if (response.data.status === 1) {
        const { message, exists_data, mobileNumberNotFoundData, imported_data, changeNToPuserData } = response.data
        setStatus("complete");
        setSuccessMsg(
          <>
            <span>{message}</span>
            <br />
            <span>Fail Data: {[...exists_data, ...mobileNumberNotFoundData].length}</span>
            <br />
            <span>Successful Data: {[...imported_data, ...changeNToPuserData].length}</span>
          </>
        );
        setCsvResponseData(response.data);
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
    if (csvFile && branchId) {
      setIsAlert(true);
      setStatus("start");
    } else {
      setIsAlert(true);
      setErrorMsg("Please fill all fields");
      setStatus("error");
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = (download = false) => {
    if (!download) {
      navigate(`/role/superadmin/garba-class/detail/${classId}`);
      return;
    }
    const { exists_data, mobileNumberNotFoundData } = csvResponseData
    const filterData = [...exists_data, ...mobileNumberNotFoundData].map((student) => ({
      name: student.name ? student.name : "NULL",
      phone_number: student.phone_number ? student.phone_number : "NULL",
      birth_date: student.birth_date ? student.birth_date : "NULL",
      blood_group: student.blood_group ? student.blood_group : "NULL",
      gender: student.gender ? student.gender : "NULL",
      instagram_id: student.instagram_Id ? student.instagram_Id : "NULL",
      reason: student?.phone_number ? "Student already exists" : "Phone Number is missing",
    }));
    const keys = Object.keys(filterData[0]);
    const header = keys.join(",");

    const data = filterData
      .map((item) => {
        return Object.values(item).map((value) => (value ? `"${value}"` : ""));
      })
      .map((row) => row.join(","));

    const csv = [header, ...data].join("\n");
    if (csv) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const [fileName, fileType] = csvFile?.name?.split(".");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}-Error.${fileType}`;
      a.click();
      navigate(`/role/superadmin/garba-class/detail/${classId}`);
    }
  };

  const fetchData = async () => {
    const response = await makeApiCall(
      "get",
      "garbaclass/info/" + classId,
      null,
      "raw"
    );
    if (response.data.status === 1) {
      const rawData = response.data.data.branch_list.map((branch) => ({
        label: branch.branch_name,
        value: branch._id,
      }));

      setBranchList(rawData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isAlert ? (
        <Model
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
          csvResponseData={csvResponseData}
          classId={classId}
        />
      ) : null}
      <div className="h-[90vh] m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[100px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="flex flex-col gap-[25px] justify-start items-center">
          <div className="w-full">
            <>
              <p className="text-[14px] text-black font-semibold ms-1 mb-1">
                Upload student data file
              </p>
              <div className={`w-full h-16 border border-gray-300 rounded-lg`}>
                <div className="flex items-center h-full">
                  <div className="mx-2 w-full flex flex-col py-2 pl-2 h-full justify-center">
                    <input
                      type="file"
                      className=" outline-none w-full placeholder:text-[14px] bg-transparent"
                      placeholder={"Upload student data"}
                      onChange={(e) => setCSVFile(e.target.files[0])}
                      accept=".csv"
                    />
                  </div>
                </div>
              </div>
            </>
          </div>
          <div className="w-full">
            <p className="text-[14px] font-semibold ms-1 mb-1">Select branch</p>
            <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
              <div className="authorizedName flex items-center h-full">
                {/* <p className="px-5">
                <BsDoorClosed className="text-2xl" />
              </p> */}
                <Select
                  options={branchList}
                  components={animatedComponents}
                  name="branch"
                  placeholder="Select branch"
                  onChange={(e) => setbranchId(e.value)}
                  className="basic-multi-select h-full flex item-center bg-transparent"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 selection:bg-none">
          <PrimaryButton
            background={"primary-button"}
            // handleClick={createCheckPoint}
            handleClick={handleClick}
            title={"Submit"}
          />
        </div>
      </div>
    </>
  );
};

export default ImportCSV;

const Model = ({
  isOpen,
  title,
  text,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  onComplete,
  csvResponseData,
  status,
  confirmText,
  errorText,
}) => {
  if (!isOpen) return null;
  const handleConfirm = () => {
    onConfirm && onConfirm();
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return (
    <div className="fixed z-[99] top-0 left-0 h-screen w-full bg-[#000000ba] backdrop-blur-[4px] flex items-center justify-center transition duration-700 ease-in-out">
      <div
        className={`max-h-[300px] relative h-auto w-[330px] bg-white rounded-3xl flex flex-col items-center justify-center p-6 gap-5 ${isOpen ? "" : null
          } `}
      >
        <div
          className={` ${status === "loading" ? "hidden" : null} flex w-full items-center justify-end  text-2xl absolute top-2 right-5`}
          onClick={() => onComplete(false)}
        >
          &times;
        </div>
        <div className="absolute h-16 w-16 rounded-full text-3xl text-primary bg-white shadow-md top-[-32px] flex items-center justify-center overflow-hidden">
          {status === "loading" ? (
            <svg
              aria-hidden="true"
              className="inline w-12 h-12 text-primary animate-spin dark:text-primary fill-gray-400 dark:fill-gray-400"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : status === "complete" ? (
            <Lottie
              animationData={completed}
              loop={true}
              className="w-[50px]"
            />
          ) : status === "error" ? (
            <Lottie animationData={error} loop={true} className="w-[50px]" />
          ) : (
            // <BsFlower2 />
            <img src={logo} alt="logo" className="p-2" />
          )}
        </div>
        {status === "loading" ? (
          <p className="mt-5 font-semibold">Waiting ...</p>
        ) : status === "complete" ? (
          <>
            <div className="flex items-center w-full gap-3 justify-center mt-7">
              <p className="text-[20px] font-medium text-center">
                {confirmText}
              </p>
            </div>
            <div className="flex  items-center justify-center w-full gap-3">
              {/* {([...[], ...[]].length) ? */}
              {([
                // eslint-disable-next-line no-unsafe-optional-chaining, react/prop-types
                ...csvResponseData?.exists_data,
                // eslint-disable-next-line no-unsafe-optional-chaining, react/prop-types
                ...csvResponseData?.mobileNumberNotFoundData
              ].length) ?
                <Button
                  handleClick={() => onComplete(true)}
                  title={"Download .CSV"}
                  background="bg-primary"
                  color="white"
                  border="border-transparent"
                /> : null}
              <Button
                handleClick={() => onComplete(false)}
                title={"Close"}
                background="bg-white"
                color="black"
                border="border-primary"
              />
            </div>
          </>
        ) : status === "error" ? (
          <>
            {" "}
            <div className="flex items-center w-full gap-3 justify-center">
              <p className="text-[20px] font-medium mt-3 text-center">
                {errorText}
              </p>
            </div>
            <div className="flex  items-center justify-center w-full gap-3">
              <Button
                handleClick={handleCancel}
                title={"Retry"}
                background="bg-primary"
                color="white"
                border="border-transparent"
              />
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="flex items-center w-full gap-3 justify-center">
              <p className="text-[20px] font-medium mt-3 text-center">
                {title}
              </p>
            </div>
            {text && (
              <div className="flex items-center w-full gap-3 justify-center">
                <p className="text-[16px] mt-2">{text}</p>
              </div>
            )}
            <div className="flex items-center justify-center w-full gap-3">
              <Button
                handleClick={handleConfirm}
                title={confirmButtonText}
                background="bg-primary"
                color="white"
                border="border-transparent"
              />
              <Button
                handleClick={handleCancel}
                title={cancelButtonText}
                background="bg-white"
                color="black"
                border="border-primary"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const Button = ({ handleClick, title, background, color, border }) => {
  return (
    <button
      onClick={handleClick}
      className={`flex justify-center ${background} border ${border} rounded-2xl px-10 py-4 w-full`}
    >
      <p className={`text-${color}`}>{title}</p>
    </button>
  );
};
