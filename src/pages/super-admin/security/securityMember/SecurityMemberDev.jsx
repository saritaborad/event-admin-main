import { BsShieldCheck, BsSearch, BsArrowRightCircle } from "react-icons/bs";
import AddButton from "../../../../componets/ui-elements/AddButton";
import { useEffect, useRef, useState } from "react";
import { makeApiCall } from "../../../../api/Post";
import {
  appendDataToFormData,
  filterByProperty,
} from "../../../../utils/CommonFunctions";
import black_user from "../../../../assets/blank_user.svg";
import ImageModel from "../../../../componets/ui-elements/ImageModel";
import Alert from "../../../../componets/ui-elements/Alert";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { MdClose } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { MaterialReactTable } from "material-react-table";
import { Box, Typography, Button } from "@mui/material";

const securityTypeData = [
  {
    label: "Gate",
    value: "gate",
  },
  {
    label: "Checkpoint",
    value: "checkpoint",
  },
  {
    label: "Zone",
    value: "zone",
  },
  {
    label: "Privilage zone",
    value: "privilage_zone",
  },
  {
    label: "Play Zone",
    value: "play_zone",
  },
  {
    label: "Parking",
    value: "parking",
  },
];

const SecurityMemberDev = () => {
  const animatedComponents = makeAnimated();
  const [assignedSecurity, setAssignedSecurity] = useState([]);
  const [notAssignedSecurity, setNotAssignedSecurity] = useState([]);
  const [securityTableData, setSecurityTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAppointed, setIsAppointed] = useState(false);
  const [selectedGuardId, setSelectedGuardId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isTypeSelect, setIsTypeSelect] = useState(false);
  const [isAssignPopup, setIsAssignPopup] = useState(false);
  const [typeData, setTypeData] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [searchData, setSearchData] = useState([]);

  const [typeId, setTypeId] = useState();
  const [typeName, setTypeName] = useState();
  const tableRef = useRef();

  const navigate = useNavigate();

  const columns = [
    {
      id: "guard", //id used to define `group` column
      header: "Guard",
      columns: [
        {
          accessorFn: (row) => `${row.guard_name}`, //accessorFn used to join multiple data into a single cell
          id: "profile_pic", //id is still required when using accessorFn instead of accessorKey
          header: "Guard",
          size: 250,
          Cell: ({ renderedCellValue, row }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                onClick={() => handleOpenModel(row.original.guard_avatar)}
                alt="avatar"
                height={30}
                src={row.original.guard_avatar}
                loading="lazy"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                }}
              />
              {/* <p>{row.original.roles}</p> */}
              {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
              <span>{renderedCellValue}</span>
            </Box>
          ),
        },
      ],
    },
    {
      accessorKey: "guard_contact",
      header: "Guard Contact",
      size: 50,
      enableClickToCopy: true,
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "place",
      header: "Place",
    },
    {
      id: "assign", //id used to define `group` column
      header: "",
      columns: [
        {
          header: "Assign",
          size: 150,
          Cell: ({ renderedCellValue, row }) =>
            row.original.assigned === 0 ? (
              <button
                className="bg-green-500 px-2 py-1 text-white rounded-sm"
                onClick={() => {
                  setSelectedGuardId(row.original._id);
                  setIsAssignPopup(true);
                }}
              >
                Assign
              </button>
            ) : (
              "---"
            ),
        },
      ],
    },
    {
      id: "deassign", //id used to define `group` column
      header: "",
      columns: [
        {
          header: "Remove",
          size: 150,
          Cell: ({ renderedCellValue, row }) => (
            row.original.assigned === 0 ? "---":
            <button
              className="bg-red-500 px-2 py-1 text-white rounded-sm"
              onClick={() => handleClick(row.original._id)}
            >
              Remove
            </button>
          ),
        },
      ],
    },
    {
      id: "update", //id used to define `group` column
      header: "",
      columns: [
        {
          header: "Update",
          size: 150,
          Cell: ({ renderedCellValue, row }) => (

            row.original.assigned === 0 ? "---":
            <button
              className="bg-blue-500 px-2 py-1 text-white rounded-sm"
              onClick={() => {
                setIsAssignPopup(true);
                  setSelectedGuardId(row.original._id);
                }}
            >
              Update
            </button>
          ),
        },
      ],
    },
  ];

  const getAllSecurity = async () => {
    setIsLoading(true);
    try {
      const response = await makeApiCall("get", "guard/all", null, "raw");
      if (response.data.status === 1) {
        const filterdSecurity = filterByProperty(
          response.data.data,
          "is_deleted",
          false
        );

        console.log(filterdSecurity);

        const notAssignedData = filterdSecurity.filter(
          (item) =>
            !(
              "gate" in item ||
              "checkpoint" in item ||
              "zone" in item ||
              "parking" in item
            )
        );

        const assignedData = filterdSecurity.filter(
          (item) =>
            "gate" in item ||
            "checkpoint" in item ||
            "zone" in item ||
            "parking" in item
        );

        const filterSecurityData = filterdSecurity.map((security) => ({
          _id: security._id,
          guard_avatar: security?.profile_pic,
          guard_name: security?.guard_name,
          guard_contact: security?.phone_number,
          place:
            "gate" in security
              ? security?.gate?.gate_name
              : "checkpoint" in security
              ? security?.checkpoint?.checkpoint_name
              : "zone" in security
              ? security?.zone?.zone_name
              : "parking" in security
              ? security?.parking?.parking_name
              : "---",
          type:
            "gate" in security
              ? "Gate"
              : "checkpoint" in security
              ? "Checkpoint"
              : "zone" in security
              ? "Zone"
              : "parking" in security
              ? "Parking"
              : "---",
          assigned:
            "gate" in security
              ? "Gate"
              : "checkpoint" in security
              ? "Checkpoint"
              : "zone" in security
              ? "Zone"
              : "parking" in security
              ? "Parking"
              : 0,
        }));

        setSecurityTableData(filterSecurityData);

        setAssignedSecurity(assignedData);
        setNotAssignedSecurity(notAssignedData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getAllSecurity();
  }, []);

  useEffect(() => {
    const sortedData = isAppointed
      ? assignedSecurity
      : notAssignedSecurity
          ?.slice()
          .sort((a, b) => a.phone_number.localeCompare(b.phone_number));

    const searchList = sortedData?.filter(
      (item) =>
        item.phone_number.includes(searchQuery) ||
        item.guard_name.toLowerCase().includes(searchQuery)
    );
    setSearchData(searchList);
  }, [assignedSecurity, notAssignedSecurity, isAppointed, searchQuery]);

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const resp = await makeApiCall(
        "post",
        "guard/removeguard",
        {
          guard_id: selectedGuardId,
        },
        "raw"
      );
      if (resp.status === 200) {
        setStatus("complete");
        setSuccessMsg(resp.data.message);
      } else {
        setStatus("error");
        setErrorMsg(resp.data.message);
      }
    } catch (error) {
      console.warn(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const handleClick = (id) => {
    setIsAlert(true);
    setStatus("start");
    setSelectedGuardId(id);
    console.log(id);
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    setIsAlert(false);
    getAllSecurity();
    setIsAssignPopup(false);
  };

  const handleAssignSecurity = async () => {
    setIsAlert(true);
    setStatus("loading");
    try {
      const data = {
        guard_id: selectedGuardId,
      };
      const formData = new FormData();

      appendDataToFormData(formData, data);
      // formData.append("profile_pic",profilePic);
      typeName === "gate"
        ? formData.append("gate", typeId)
        : typeName === "checkpoint"
        ? formData.append("checkpoint", typeId)
        : typeName === "zone"
        ? formData.append("zone", typeId)
        : typeName === "play_zone"
        ? formData.append("zone", typeId)
        : typeName === "privilage_zone"
        ? formData.append("zone", typeId)
        : formData.append("parking", typeId);

      const resp = await makeApiCall(
        "post",
        "guard/update",
        formData,
        "formdata"
      );
      if (resp.data.status === 1) {
        setIsAlert(true);
        setStatus("complete");
        setSuccessMsg(resp.data.message);
      } else {
        setIsAlert(true);
        setStatus("error");
        setErrorMsg(resp.data.message);
      }
    } catch (error) {
      console.warn(error);
      setIsAlert(true);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const fetchData = async (securityType) => {
    setIsTypeSelect(true);
    console.log(securityType, "from fetch data");
    try {
      const response = await makeApiCall(
        "get",
        securityType === "play_zone"
          ? "zone/all"
          : securityType === "privilage_zone"
          ? "zone/all"
          : securityType + "/all",
        null,
        "raw"
      );

      if (response.data.status === 1) {
        setIsLoading(false);
        const dt =
          securityType === "gate"
            ? response.data.gates
            : securityType === "checkpoint"
            ? response.data.data
            : securityType === "zone"
            ? response.data.tickets
            : securityType === "play_zone"
            ? filterByProperty(response.data?.tickets, "pass_zone", true)
            : securityType === "privilage_zone"
            ? filterByProperty(response.data?.tickets, "is_privilege", true)
            : response.data.data;

        console.log(dt, "Data from fetch data");

        const filterData = filterByProperty(dt, "is_deleted", false);

        let isNotParkingGate;
        securityType === "gate"
          ? (isNotParkingGate = filterByProperty(dt, "parking_gate", false))
          : null;

        console.log(isNotParkingGate);

        const selectData = filterData?.map((el) => ({
          value: el._id,
          label:
            securityType === "checkpoint"
              ? el.checkpoint_name
              : securityType === "zone"
              ? el.zone_name
              : securityType === "play_zone"
              ? el.zone_name
              : securityType === "privilage_zone"
              ? el.zone_name
              : el.parking_name,
        }));

        const selectGateData = isNotParkingGate?.map((el) => ({
          value: el._id,
          label: el.gate_name,
        }));

        securityType === "gate"
          ? setTypeData(selectGateData)
          : setTypeData(selectData);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleTypeSelect = async (e) => {
    setTypeName(e.value);
    fetchData(e.value);
    console.log(e.value);

    // switch (e.value) {
    //   case "zone":
    //     break;
    //   case "privilage_zone":
    //     setTypeName("privilage_zone");
    //     fetchData("privilage_zone");
    //     break;
    //   case "play_zone":
    //     setTypeName("play_zone");
    //     fetchData("play_zone");
    //     break;

    //   default:
    //     setTypeName(e.value);
    //     break;
    // }
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
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <AddButton
          title={"Security Member"}
          link={"/role/superadmin/security-member/add-new"}
        />
        <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start md:hidden">
          <BsSearch />
          <input
            type="text"
            placeholder="Search security by name or number"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full my-3 p-1 border border-gray-300 rounded-2xl md:hidden">
          <div className="flex items-center">
            <div className="relative flex item-center justify-between w-full gap-3  border-gray-300">
              <div
                className={`w-2/4 flex items-center justify-center text-[14px] h-[50px] rounded-xl text-center z-0 bg-primary absolute ${
                  isAppointed === false
                    ? " translate-x-full transition-all  "
                    : "translate-x-[0] transition-all "
                }`}
              ></div>
              <div
                className={`w-2/4 flex items-center justify-center text-[16px] h-[50px] rounded-xl z-50 text-center ${
                  isAppointed === true ? "text-white" : null
                }`}
                onClick={() => setIsAppointed(true)}
              >
                Assigned
              </div>
              <div
                className={`w-2/4 flex items-center justify-center text-[16px] h-[50px] rounded-xl z-50 text-center ${
                  isAppointed === true ? null : "text-white"
                }`}
                onClick={() => setIsAppointed(false)}
              >
                Not Assigned
              </div>
            </div>
          </div>
        </div>
        {isLoading ? (
          <>
            <div className="w-full h-auto grid grid-cols-2 gap-2 items-center mb-24 md:hidden">
              <div className="h-[180px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[180px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
            </div>
          </>
        ) : searchData?.length > 0 ? (
          <div className="w-full h-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 items-center mb-24 md:hidden">
            {searchData?.map((security, i) => {
              let place = {};
              if ("gate" in security) {
                place = { key: 0, value: security.gate };
              } else if ("checkpoint" in security) {
                place = { key: 1, value: security.checkpoint };
              } else if ("zone" in security) {
                place = { key: 2, value: security.zone };
              } else if ("parking" in security) {
                place = { key: 3, value: security.parking };
              }

              return (
                <SecurityCard
                  key={i}
                  image={security.profile_pic}
                  name={security.guard_name}
                  phoneNumber={security.phone_number}
                  place={place}
                  isAssigned={isAppointed}
                  removeFunc={() => handleClick(security?._id)}
                  assignFunc={() => {
                    setSelectedGuardId(security?._id);
                    setIsAssignPopup(true);
                  }}
                />
              );
            })}{" "}
          </div>
        ) : (
          <p className="text-xl text-center font-medium text-gray-400 mt-24 md:hidden">
            No Security Member Found
          </p>
        )}

        <div
          ref={tableRef}
          className="h-auto hidden md:block md:h-screen md:overflow-y-auto md:rounded-none md:m-0"
        >
          <MaterialReactTable
            style={{ margin: "20px" }}
            columns={columns}
            data={securityTableData}
            enableRowSelection
            positionToolbarAlertBanner="bottom"
          />
        </div>
      </div>
      {isAssignPopup ? (
        <div className="bg-[#00000090] backdrop-blur-sm h-screen w-full fixed top-0 left-0 z-[100] flex items-center justify-center">
          <div className="bg-white flex flex-col items-start justify-start gap-4 p-4 w-[90%] h-auto max-h-[70%] rounded-xl md:max-w-[30%]">
            <p className="text-xl font-semibold w-full flex items-center justify-between">
              Assign Security{" "}
              <MdClose onClick={() => setIsAssignPopup(false)} />
            </p>
            <div className="w-full">
              <p className="text-[14px] text-black font-semibold">
                Select type{" "}
              </p>
              <div className="eventSelect flex items-center w-full h-full border border-gray-300 rounded-lg mt-2">
                <Select
                  options={securityTypeData}
                  components={animatedComponents}
                  name="zone"
                  placeholder="Select Type"
                  onChange={handleTypeSelect}
                  className="basic-multi-select h-full flex item-center bg-transparent outline-none"
                  classNamePrefix="select"
                />
              </div>
            </div>
            {isTypeSelect ? (
              <div className="h-full w-full flex flex-col items-center justify-start mt-7 gap-10">
                {" "}
                <div className="w-full">
                  <p className="text-[14px] text-black font-semibold">
                    Select type{" "}
                  </p>
                  <div className="eventSelect flex items-center w-full h-full border border-gray-300 rounded-lg mt-2">
                    <Select
                      options={typeData}
                      components={animatedComponents}
                      name="zone"
                      placeholder={`Select ${typeName}`}
                      onChange={(e) => {
                        setTypeId(e.value);
                      }}
                      className="basic-multi-select h-full flex item-center bg-transparent outline-none"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
                <button
                  className="bg-priamry_green w-full h-12 rounded-full text-white"
                  onClick={handleAssignSecurity}
                >
                  Assign security
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SecurityMemberDev;

const SecurityCard = ({
  image,
  name,
  phoneNumber,
  place,
  isAssigned,
  removeFunc,
  assignFunc,
}) => {
  const [isImageModel, setIsImageModel] = useState(false);

  const value =
    place?.key === 0
      ? "Gate" + " - " + place?.value?.gate_name
      : place?.key === 1
      ? "Checkpoint" + " - " + place?.value?.checkpoint_name
      : place?.key === 2
      ? "Zone" + " - " + place?.value?.zone_name
      : "Parking" + " - " + place?.value?.parking_name;

  return (
    <>
      <div
        className="bg-white p-3 rounded-xl h-auto max-h-[270px] flex flex-col justify-center items-center"
        style={{ boxShadow: "0px 0px 20px #0000002b" }}
      >
        {isAssigned === true ? (
          <p className="text-center mb-2 text-sm">{value} </p>
        ) : null}
        <div className="garbaImage w-[50px] h-[50px] overflow-hidden">
          {/* <img
            src={image ? image : black_user}
            alt="image"
            className="w-full h-full rounded-xl object-cover"
            onClick={() => setIsImageModel(true)}
          /> */}
          <LazyLoadImage
            alt={"image"}
            src={image ? image : black_user} // use normal <img> attributes as props
            className="w-full h-full rounded-xl object-cover"
          />
        </div>
        <div className="garbaText my-4 text-center">
          <h1 className="text-xl font-medium">{name}</h1>
          <p className="text-sm text-gray-400 my-1">{phoneNumber}</p>
        </div>
        {isAssigned ? (
          <div className="flex flex-col items-center justify-center text-white font-semibold gap-3 w-full">
            <button
              className="border-primary border-2 text-primary px-3 py-1 text-sm rounded-lg w-full"
              onClick={assignFunc}
            >
              Update
            </button>
            <button
              className="bg-primary text-white px-3 py-1 text-sm rounded-lg w-full"
              onClick={removeFunc}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center text-white">
            <button
              className="primary-button px-3 text-sm py-1 rounded-full"
              onClick={assignFunc}
            >
              Assign
            </button>
          </div>
        )}
      </div>
      {isImageModel ? (
        <ImageModel
          src={image ? image : black_user}
          handleClose={() => setIsImageModel(false)}
        />
      ) : null}
    </>
  );
};
