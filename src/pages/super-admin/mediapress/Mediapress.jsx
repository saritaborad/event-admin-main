import React, { useState, useEffect, useRef } from "react";
import { MdCloudUpload } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import completed from "../../../assets/lottie/completed.json";
import error from "../../../assets/lottie/error.json";
import logo from "../../../assets/newLogo.svg";

import blank_user from "../../../assets/blank_user.svg";
import ImageModel from "../../../componets/ui-elements/ImageModel";
import { MaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";
//-- import from react-select
import Select from "react-select";
import makeAnimated from "react-select/animated";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { makeApiCall } from "../../../api/Post";
import AccessPopup from "../../../componets/ui-elements/AccessPopup";

const Mediapress = () => {
  const params = useParams();
  const classId = params.branchId;
  const tableRef = useRef();
   const [selectedAllAccess,setSelectedAllAccess]=useState();

  const [isImportCSV, setIsImportCSV] = useState(false);
  const [csvFile, setCSVFile] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const [selectedImage, setSelectedImage] = useState();
  const [isImageModel, setIsImageModel] = useState();

  const [specialAccessGates, setSpecialAcessGates] = useState();
  const [specialAccessZones, setSpecialAcessZones] = useState();
  const [specialAccessCheckpoint, setSpecialAcessCheckpoint] = useState();
  const [accessTicketId, setAccessTicketId] = useState();
  const [accessPopup, setAcessPopup] = useState(false);

  const [mediaPressTableData, setMediaPressTableData] = useState();

  const [csvResponseData, setCsvResponseData] = useState();

  const fetchData = async () => {
    setIsAlert(true);
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "get",
        "user/allmediapress",
        null,
        "raw"
      );
      if (response.data.status === 1) {
        setIsAlert(false);
        const rawData = response.data.data;
        console.log(rawData)
        const filterTableData = rawData.map((user) => ({
          _id: user._id,
          user_avatar: user?.profile_pic ? user.profile_pic : blank_user,
          name: user?.name ? user?.name : "---",
          phone_number: user?.phone_number ? user?.phone_number : "---",
          gender: user?.gender ? user?.gender : "---",
          device_type: user?.android_device
            ? "Android"
            : user?.ios_device
            ? "Apple"
            : "---",
          device_model: user?.device_modal ? user?.device_modal : "---",
          role: user?.roles ? user?.roles : "---",
          position: user?.position ? user.position : "---",
          house_name: user ? user?.house_name: "---",
          isAllAccess: user.all_access,
        }));

        setMediaPressTableData(filterTableData);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const columns = [
    {
      id: "user",
      header: "User",
      columns: [
        {
          accessorFn: (row) => `${row.name}`,
          id: "profile_pic",
          header: "User",
          size: 180,
          Cell: ({ renderedCellValue, row }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                alt="avatar"
                onClick={() => handleOpenModel(row.original.user_avatar)}
                height={30}
                src={row.original.user_avatar}
                loading="lazy"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                }}
              />

              <span>{renderedCellValue}</span>
            </Box>
          ),
        },
      ],
    },
    {
      accessorKey: "phone_number",
      header: "Phone no",
      size: 50,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      size: 50,
    },
    // {
    //   accessorKey: "device_type",
    //   header: "Device type",
    //   size: 50,
    // },
    // {
    //   accessorKey: "device_model",
    //   header: "Device model",
    //   size: 50,
    // },
    // {
    //   accessorKey: "role",
    //   header: "Role",
    //   size: 50,
    // },
    {
      accessorKey: "position",
      header: "Position",
      size: 50,
    },
    {
      accessorKey: "house_name",
      header: "House name",
      size: 50,
    },
    // {
    //   accessorKey: "is_active",
    //   header: "IsActive",
    //   size: 50,
    // },
    {
      id: "actions",
      header: "Actions",
      columns: [
        {
          header: "Special access",
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="bg-primary px-2 py-2 text-white rounded-sm"
              onClick={() =>{
                handleSpecialAccess({
                  gates: row.original.gates,
                  zones: row.original.zones,
                  checkpoints: row.original.checkpoints,
                  specialGates: row.original.specialAccessGates,
                  specialCheckpoints: row.original.specialAccessCheckpoint,
                  specialZones: row.original.specialAccessZones,
                  ticketId: row.original._id,
                }),
                setSelectedAllAccess(row.original.isAllAccess)
              }
              }
            >
              Special access
            </button>
          ),
        },
      ],
    },
  ];

  const handleSpecialAccess = (options) => {
    const {
      gates,
      zones,
      checkpoints,
      specialGates,
      specialCheckpoints,
      specialZones,
      ticketId,
    } = options;

    accessPopupOpen({
      gate: gates,
      zone: zones,
      checkpoint: checkpoints,
      specialGates: specialGates,
      specialCheckpoints: specialCheckpoints,
      specialZones: specialZones,
      type: 0,
      ticketId: ticketId,
    });
  };

  const accessPopupOpen = (options) => {
    const {
      gate,
      zone,
      checkpoint,
      specialGates,
      specialCheckpoints,
      specialZones,
      type,
      ticketId,
    } = options;
    setSpecialAcessGates(specialGates);
    setSpecialAcessZones(specialZones);
    setSpecialAcessCheckpoint(specialCheckpoints);

    setAccessTicketId(ticketId);
    setAcessPopup(true);
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const data = {
        csv: csvFile,
        // branch_id: branchId,
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await makeApiCall(
        "post",
        "user/importmediapress",
        formData,
        "formdata"
      );
      console.log(response.data);
      if (response.data.status === 1) {
        const {
          message,
          exists_data,
          mobileNumberNotFoundData,
          imported_data,
          changeNToMediapressData,
        } = response.data;
        setStatus("complete");
        setSuccessMsg(
          <>
            <span>{message}</span>
            <br />
            <span>
              Fail Data: {[...exists_data, ...mobileNumberNotFoundData].length}
            </span>
            <br />
            <span>
              Successful Data:{" "}
              {[...imported_data, ...changeNToMediapressData].length}
            </span>
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
    if (csvFile) {
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
    setIsAlert(false);
    // if (!download) {
    //   navigate(`/role/superadmin/garba-class/detail/${classId}`);
    //   return;
    // }
    // const { exists_data, mobileNumberNotFoundData } = csvResponseData
    // const filterData = [...exists_data, ...mobileNumberNotFoundData].map((student) => ({
    //   name: student.name ? student.name : "NULL",
    //   phone_number: student.phone_number ? student.phone_number : "NULL",
    //   birth_date: student.birth_date ? student.birth_date : "NULL",
    //   blood_group: student.blood_group ? student.blood_group : "NULL",
    //   gender: student.gender ? student.gender : "NULL",
    //   instagram_id: student.instagram_Id ? student.instagram_Id : "NULL",
    //   reason: student?.phone_number ? "Student already exists" : "Phone Number is missing",
    // }));
    // const keys = Object.keys(filterData[0]);
    // const header = keys.join(",");

    // const data = filterData
    //   .map((item) => {
    //     return Object.values(item).map((value) => (value ? `"${value}"` : ""));
    //   })
    //   .map((row) => row.join(","));

    // const csv = [header, ...data].join("\n");
    // if (csv) {
    //   // eslint-disable-next-line no-unsafe-optional-chaining
    //   const [fileName, fileType] = csvFile?.name?.split(".");
    //   const blob = new Blob([csv], { type: "text/csv" });
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = `${fileName}-Error.${fileType}`;
    //   a.click();
    //   navigate(`/role/superadmin/garba-class/detail/${classId}`);
    // }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

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
      <div className="h-[90vh] m-[2px] bg-white rounded-[30px] mt-4 flex flex-col gap-[100px] justify-start items-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div
          className="w-auto bg-gray-200  px-6 py-2 flex items-center justify-center gap-3 m-2 rounded-md cursor-pointer"
          onClick={() => setIsImportCSV(true)}
        >
          <MdCloudUpload className="text-2xl text-primary" />
          <h1 className="text-lg font-semibold whitespace-nowrap">
            Import CSV
          </h1>
        </div>
        {mediaPressTableData && (
          <div ref={tableRef} className="w-full">
            <MaterialReactTable
              style={{ margin: "20px" }}
              columns={columns}
              data={mediaPressTableData}
              positionToolbarAlertBanner="bottom"
            />
          </div>
        )}

        {isImageModel ? (
          <ImageModel
            src={selectedImage ? selectedImage : black_image}
            handleClose={() => setIsImageModel(false)}
          />
        ) : null}

        {isImportCSV && (
          <div className="bg-[#00000080] h-screen w-[87%] absolute top-0 z-50 flex items-center justify-center">
            <div className="bg-[#f2f2f2] md:max-h-2/4 md:h-auto md:w-2/4 w-3/4 max-h-3/4 rounded-md p-5 overflow-y-auto">
              <div className="flex items-center justify-between  text-lg ">
                <p className="font-bold">Import CSV</p>
                <span
                  className="cursor-pointer "
                  onClick={() => setIsImportCSV(false)}
                >
                  {" "}
                  &times;
                </span>
              </div>
              <div className="h-auto pt-4 flex flex-col gap-[100px] justify-start md:overflow-y-auto md:rounded-none md:m-0">
                <div className="flex flex-col gap-[25px] justify-start items-center">
                  <div className="w-full">
                    <>
                      <p className="text-[14px] text-black font-semibold ms-1 mb-1">
                        Upload student data file
                      </p>
                      <div
                        className={`w-full h-16 border border-gray-300 rounded-lg`}
                      >
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
            </div>
          </div>
        )}

        {accessPopup ? (
          <AccessPopup
            type={0}
            handleClose={() => setAcessPopup(false)}
            propGates={null}
            propCheckpoints={null}
            propZones={null}
            specialAccessGates={specialAccessGates}
            specialAccessCheckpoint={specialAccessCheckpoint}
            specialAccessZones={specialAccessZones}
            accessTicketId={accessTicketId}
            reloadFunc={fetchData}
            popCloseFunc={() => setAcessPopup(false)}
            usertype={"press"}
            allAccess={selectedAllAccess}
          />
        ) : null}
      </div>
    </>
  );
};

export default Mediapress;

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
        className={`max-h-[300px] relative h-auto w-[330px] bg-white rounded-3xl flex flex-col items-center justify-center p-6 gap-5 ${
          isOpen ? "" : null
        } `}
      >
        <div
          className={` ${
            status === "loading" ? "hidden" : null
          } flex w-full items-center justify-end  text-2xl absolute top-2 right-5`}
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
              {[
                // eslint-disable-next-line no-unsafe-optional-chaining, react/prop-types
                ...csvResponseData?.exists_data,
                // eslint-disable-next-line no-unsafe-optional-chaining, react/prop-types
                ...csvResponseData?.mobileNumberNotFoundData,
              ].length ? (
                <Button
                  handleClick={() => onComplete(true)}
                  title={"Download .CSV"}
                  background="bg-primary"
                  color="white"
                  border="border-transparent"
                />
              ) : null}
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