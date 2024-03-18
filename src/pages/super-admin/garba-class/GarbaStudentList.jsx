import { param } from "jquery";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../../api/Post";
import {
  filterByProperty,
  handleNumberValidate,
} from "../../../utils/CommonFunctions";
import { MdOutlineKeyboardArrowRight, MdOutlineCancel } from "react-icons/md";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import Alert from "../../../componets/ui-elements/Alert";
import { FaMinus, FaParking, FaPlus } from "react-icons/fa";
import { BsPatchCheckFill, BsPlus, BsSearch } from "react-icons/bs";
import UserCard from "../../../componets/ui-elements/UserCard";
import black_image from "../../../assets/blank_user.svg";
import { Box, Pagination } from "@mui/material";
import ImageModel from "../../../componets/ui-elements/ImageModel";
import { MaterialReactTable } from "material-react-table";
import Select from "react-select";
import ImageUpload from "../../../componets/ui-elements/ImageUpload";
import InputField from "../../../componets/ui-elements/InputField";
import PhoneNumberInput from "../../../componets/ui-elements/PhoneNumberInput";
import AccessPopup from "../../../componets/ui-elements/AccessPopup";
import {
  animatedComponents,
  bloodData,
  genderData,
} from "../../../utils/commonData";

const GarbaStudentList = () => {
  const params = useParams();
  const userID = params.userID;
  const studentID = param.studentID;
  const classID = params.classID;
  const studentStatus = params.status;
  const navigate = useNavigate();
  const tableRef = useRef();

  const [userDetails, setUserDetails] = useState();

  const [name, setName] = useState();
  const [contact, setContact] = useState();
  const [insta, setInsta] = useState();

  const [action, setActions] = useState();

  const [mentorParams, setMentorParams] = useState({});
  const [editDetailParams, setEditDetailParams] = useState({});
  const [oldNumber, setOldNumber] = useState();

  const [image, setImage] = useState();
  const [displayImage, setDisplayImage] = useState();
  const [pass, setPass] = useState();
  const maxFileSize = 9 * 1024 * 1024; // 9mb
  const [fileSizeExceeded, setFileSizeExceeded] = useState(false);

  const [specialAccessGates, setSpecialAcessGates] = useState();
  const [specialAccessZones, setSpecialAcessZones] = useState();
  const [specialAccessCheckpoint, setSpecialAcessCheckpoint] = useState();

  const [accessTicketId, setAccessTicketId] = useState();
  const [accessPopup, setAcessPopup] = useState(false);

  const [isParkingModel, setIsParkingModel] = useState(false);
  const [isMentorModel, setIsMentorModel] = useState(false);
  const [isMentorAdd, setIsMentorAdd] = useState(false);
  const [parkingModelDetails, setParkingModelDetails] = useState();
  const [mentorModelDetails, setMentorModelDetails] = useState();
  const [selectedStudentId, setSelectedStudentId] = useState();
  const [selectedBranchId, setSelectedBranchId] = useState();
  const [selectedPassId, setSelectedPassId] = useState();

  const [isParkingAdd, setIsParkingAdd] = useState(false);

  const [garbaClass, setGarbaClass] = useState();
  const [selectedStudents, setSelectedStudents] = useState();
  const [parkingList, setParkingList] = useState(false);

  const [activeStudent, setActiveStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [totalStudent, setTotalStudent] = useState([]);

  const [parking, setParking] = useState();
  const [carParking, setCarParking] = useState();
  const [bikeParking, setBikeParking] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  const [searchData, setSearchData] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [dataList, setDataList] = useState([]);

  const [selectedImage, setSelectedImage] = useState();
  const [isImageModel, setIsImageModel] = useState();

  const localData = JSON.parse(localStorage.getItem("garbaStudent"));

  const [showStudents, setShowStudents] = useState(
    localData?.showStudents || "all"
  );
  const [semiActiveStudent, setSemiActiveStudent] = useState();
  const [selectedAllAccess, setSelectedAllAccess] = useState();
  const [fullActiveStudent, setFullActiveStudent] = useState();

  const [editDetail, setEditDetail] = useState(false);
  const [userName, setUserName] = useState();
  const [number, setNumber] = useState();

  const [paginationData, setPaginationData] = useState({
    page: localData?.page || 1,
    perPage: 10,
  });

  const [isComplete, setIsComplete] = useState(false);

  console.log(garbaClass?.garba_classname);

  const fetchData = async () => {
    const response = await makeApiCall(
      "get",
      "garbaclass/info/" + classID,
      null,
      "raw"
    );

    console.log(response);
    if (response.data.status === 1) {
      setGarbaClass(response.data.data);

      const branchList = response.data.data.branch_list;
      //approval_request_list from branch
      const approvalRequest = branchList.reduce((students, branch) => {
        const branchStudents = branch.approval_request_list.map((student) => ({
          branch_id: branch._id,
          branch_name: branch.branch_name,
          status: "Pending",
          ...student,
        }));

        return [...students, ...branchStudents];
      }, []);

      //students which is approved and active from branch
      const studentList = branchList.reduce((students, branch) => {
        const branchStudents = branch.student_list.map((student) => ({
          _id: student._id,
          branch_id: branch._id,
          isAllAccess: student.pass_list?.all_access,
          branch_name: branch.branch_name,
          specialAccessGates: student.pass_list?.special_accessgates,
          specialAccessCheckpoint: student.pass_list?.special_accesscheckpoints,
          specialAccessZones: student.pass_list?.special_accesszones,
          status: student.pass_list?.pass_status,
          student_type:
            params.status === "active"
              ? student?.pass_list.is_completed
                ? "Active"
                : "Semi active"
              : params.status === "approved"
              ? "Pending payment"
              : "Pending",
          is_completed: student.pass_list?.is_completed,
          user_avatar: student.profile_pic ? student.profile_pic : black_image,
          instagram_id: student.instagram_id ? student.instagram_id : "",
          is_parking: student.pass_list.parking ? true : false,
          pass_id: student.pass_list._id,
          is_mentorList:
            student.pass_list.mentor_list.length > 0 ? true : false,
          parkings: student.pass_list.parking
            ? student.pass_list.parking
            : null,
          ...student,
        }));

        return [...students, ...branchStudents];
      }, []);

      //combined both array and make a single student array
      const combinedArray = approvalRequest.concat(studentList);
      setTotalStudent(combinedArray);
      console.log(studentList);

      const activeStudent = filterByProperty(combinedArray, "status", "Active");
      const pendingStudent = filterByProperty(
        combinedArray,
        "status",
        "Pending"
      );
      const approvedStudent = filterByProperty(
        combinedArray,
        "status",
        "Approved"
      );

      const semiActive = filterByProperty(activeStudent, "is_completed", false);
      const fullActive = filterByProperty(activeStudent, "is_completed", true);
      setSemiActiveStudent(semiActive);
      setFullActiveStudent(fullActive);

      // console.log(activeStudent, "<====== Active student");
      // console.log(approvedStudent, "<====== Approved student");
      // console.log(pendingStudent, "<====== Pending student");

      setActiveStudents(activeStudent);
      setPendingStudents(pendingStudent);
      setApprovedStudents(approvedStudent);
      // handleSearchChange();

      let sortedData = null;
      if (params.status === "active")
        sortedData =
          showStudents === "all"
            ? activeStudent
            : showStudents === "active"
            ? fullActive
            : semiActive;
      else if (params.status === "approved") sortedData = approvedStudent;
      else if (params.status === "pending") sortedData = pendingStudent;
      else
        sortedData = combinedArray
          ?.slice()
          .sort((a, b) => a.name.localeCompare(b.name));

      if (!localStorage.getItem("garbaStudent")) {
        handleLocalData(showStudents, paginationData.page);
      }
      setDataList(sortedData);
      setSearchList(sortedData);
      setSearchData(
        sortedData.slice(
          paginationData.page * paginationData.perPage - paginationData.perPage,
          paginationData.page * paginationData.perPage
        )
      );
    }
  };

  const handleLocalData = (showStudents, page) => {
    const data = { showStudents, page };
    localStorage.setItem("garbaStudent", JSON.stringify(data));
  };

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

  const columns = [
    {
      id: "user",
      header: "Student",
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
              <div>
                <p
                  className={`h-3 w-3 rounded-full ${
                    row.original.student_type === "Active"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></p>
              </div>
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
      header: "PhoneNo",
      size: 50,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      size: 50,
    },
    // {
    //   accessorKey: "instagram_id",
    //   header: "InstaID",
    //   size: 50,
    // },
    // {
    //   accessorKey: "student_type",
    //   header: "Status",
    //   size: 50,
    // },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   size: 50,
    // },

    // {
    //   accessorKey: "branch_name",
    //   header: "Garba class name",
    //   size: 50,
    // },
    {
      id: "action",
      header: "Actions",
      columns: [
        {
          header: "Parking details",
          size: 100,
          Cell: ({ renderedCellValue, row }) =>
            row.original.is_parking ? (
              <button
                className="bg-black px-2 py-2 text-white rounded-sm"
                onClick={() => handleParkingModel(row.original._id)}
              >
                Parking details
              </button>
            ) : (
              <p className="text-center">---</p>
            ),
        },
        {
          header: "Mentor details",
          size: 100,
          Cell: ({ renderedCellValue, row }) =>
            row.original.is_mentorList ? (
              <button
                className="bg-black px-2 py-2 text-white rounded-sm"
                onClick={() => handleMentorModel(row.original._id)}
              >
                Mentor details
              </button>
            ) : (
              <p className="text-center">---</p>
            ),
        },
      ],
    },
    {
      id: "special_access",
      header: "",
      columns: [
        {
          header: "Special access",
          size: 100,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="bg-blue-500 px-2 py-2 text-white rounded-sm"
              onClick={() => {
                handleSpecialAccess({
                  gates: row.original.gates,
                  zones: row.original.zones,
                  checkpoints: row.original.checkpoints,
                  specialGates: row.original.specialAccessGates,
                  specialCheckpoints: row.original.specialAccessCheckpoint,
                  specialZones: row.original.specialAccessZones,
                  ticketId: row.original.pass_id,
                }),
                  setSelectedAllAccess(row.original.isAllAccess);
              }}
            >
              Special access
            </button>
          ),
        },
      ],
    },
    {
      id: "add_parking",
      header: "",
      columns: [
        {
          header: "Add parking",
          size: 100,
          Cell: ({ renderedCellValue, row }) =>
            params.type === "approved" ? (
              <button className="bg-priamry_green px-2 py-2 text-white rounded-sm">
                Activate student
              </button>
            ) : row.original.is_parking ? (
              <p className="text-center">---</p>
            ) : (
              <button
                className="bg-priamry_green px-2 py-2 text-white rounded-sm"
                onClick={() => {
                  setIsParkingAdd(true);
                  // setSelectedStudentId(row.original.pass_id);
                  setSelectedStudentId(row.original._id);
                }}
              >
                Add parking
              </button>
            ),
        },
      ],
    },
    {
      id: "add_mentor",
      header: "",
      columns: [
        {
          header: "Add mentor",
          size: 100,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="bg-priamry_green px-2 py-2 text-white rounded-sm"
              onClick={() => {
                setIsMentorAdd(true);
                setMentorParams({
                  ...mentorParams,
                  pass_id: row.original.pass_id,
                });
              }}
            >
              Add mentor
            </button>
          ),
        },
      ],
    },
    {
      id: "edit",
      header: "Edit",
      columns: [
        {
          header: "Edit",
          size: 60,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="bg-rose-500 px-2 py-2 text-white rounded-sm"
              onClick={() => {
                handleEditUser(row.original._id),
                  setSelectedStudentId(row.original._id);
              }}
            >
              Edit
            </button>
          ),
        },
      ],
    },
    {
      id: "delete",
      header: "Delete",
      columns: [
        {
          header: "Delete",
          size: 60,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="border-red-500 border px-2 py-2 text-red-500  rounded-sm"
              onClick={() => {
                handleDeleteClick(), setSelectedStudentId(row.original._id);
                setSelectedBranchId(row.original.branch_id);
              }}
            >
              Delete
            </button>
          ),
        },
      ],
    },
  ];

  const handleEditUser = (id) => {
    setEditDetail(true);

    try {
      const studentList =
        params.status === "active"
          ? activeStudent
          : params.status === "approved"
          ? approvedStudents
          : pendingStudents;

      const filterData = filterByProperty(studentList, "_id", id);
      setEditDetailParams(filterData[0]);
      setOldNumber(filterData[0].phone_number);

      console.log(filterData[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const userUpdate = async () => {
    setIsAlert(true);
    setStatus("loading");
    const params = {
      name: editDetailParams.name,
      birth_date: editDetailParams.birth_date,
      phone_number: editDetailParams.phone_number,
      gender: editDetailParams.gender,
      blood_group: editDetailParams.blood_group,
      instagram_id: editDetailParams.instagram_id,
      user_id: selectedStudentId,
      is_numberchange:
        oldNumber == editDetailParams.phone_number ? false : true,
    };
    try {
      const response = await makeApiCall(
        "post",
        "user/updatepassuser",
        params,
        "raw"
      );
      console.log(response);
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
        setEditDetail(false);
        setSelectedStudentId();
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
        setEditDetail(false);
        setSelectedStudentId();
      }
    } catch (error) {
      setStatus("error");
      setErrorMsg(response.data.message);
      console.log(error);
    }
  };

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

  const fetchParkingData = async () => {
    const response = await makeApiCall(
      "post",
      "parking/remaining",
      {
        is_pass: true,
      },
      "raw"
    );
    console.log(response.data.data);

    const isNotDeleted = filterByProperty(
      response.data.data,
      "is_deleted",
      false
    );

    const isPassParking = filterByProperty(isNotDeleted, "pass_parking", true);

    const isCarParking = filterByProperty(
      isPassParking,
      "two_wheeler_parking",
      false
    );

    const isBikeParking = filterByProperty(
      isPassParking,
      "two_wheeler_parking",
      true
    );

    setCarParking(isCarParking);
    setBikeParking(isBikeParking);
  };

  useEffect(() => {
    fetchData();
    fetchParkingData();
  }, []);

  const handleApprove = async (branchId, studentId) => {
    setIsAlert(true);
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "post",
        "user/approverequest",
        {
          userid: studentId,
          branchid: branchId,
          action: true,
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

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    setIsAlert(false);
    setIsParkingAdd(false);
    setIsMentorAdd(false);
    setMentorParams({});
    setDisplayImage();
    setSelectedPassId();
    setParking();
    fetchParkingData();
    fetchData();
    // navigate("role/superadmin/garba-class/detail/"+classID)
  };

  const handleActive = async (studentId) => {
    setIsAlert(true);
    setStatus("loading");
    if (studentId) {
      try {
        const response = await makeApiCall(
          "post",
          "user/complimantorypass",
          {
            user_id: studentId,
            parking_id: parking,
            revesed_parking: isReserved,
          },
          "raw"
        );

        // console.log(response);

        if (response.data.status === 1) {
          setStatus("complete");
          setSuccessMsg(response.data.message);
          setParkingList(false);
          location.reload();
        } else {
          setStatus("error");
          setErrorMsg(response.data.message);
        }
      } catch (error) {}
    } else {
      setIsAlert(true);
      setStatus("error");
      setErrorMsg("Please select student");
    }
  };

  const handleStudentType = (type) => {
    setShowStudents(type);
    let sortedData =
      type === "all"
        ? activeStudent
        : type === "active"
        ? fullActiveStudent
        : semiActiveStudent;

    sortedData?.slice().sort((a, b) => a.name.localeCompare(b.name));

    setDataList(sortedData);
    setSearchList(sortedData);
    setSearchData(
      sortedData?.slice(
        1 * paginationData.perPage - paginationData.perPage,
        1 * paginationData.perPage
      )
    );
    setPaginationData((d) => ({ ...d, page: 1 }));
    handleLocalData(type, 1);
  };

  const handleSearchChange = (event) => {
    const filterData = dataList?.filter(
      (item) =>
        item.name.toLowerCase().includes(event?.target?.value?.toLowerCase()) ||
        item.phone_number.includes(event?.target?.value?.toLowerCase())
    );
    setSearchList(filterData);
    setSearchData(
      filterData.slice(
        1 * paginationData.perPage - paginationData.perPage,
        1 * paginationData.perPage
      )
    );
    setPaginationData((d) => ({ ...d, page: 1 }));
    handleLocalData(showStudents, 1);
  };

  const handleAddMentor = async () => {
    setIsAlert(true);
    setStatus("loading");
    try {
      console.log(mentorParams);

      const formData = new FormData();
      Object.entries(mentorParams).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await makeApiCall(
        "post",
        "user/addmentorinpass",
        formData,
        "formdata"
      );
      if (response.data.status === 0) {
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

  const handleNumberChange = async (e, type) => {
    const inputValue = e.target.value;
    const { name, value } = e.target;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (numericValue.length <= 10) {
      const isExist = await handleNumberValidate(numericValue);

      if (isExist && isExist.data.status == 1) {
        if (isExist.data.data.roles === "n-user") {
          if (type === "mentor") {
            setMentorParams({ ...mentorParams, [name]: value });
          } else {
            setEditDetailParams({ ...editDetailParams, [name]: value });
          }
        } else {
          setIsAlert(true);
          setStatus("error");
          setErrorMsg(
            `User already exists as a ${isExist.data.data.roles}. Try with another number.`
          );
        }
      } else {
        if (type === "mentor") {
          setMentorParams({ ...mentorParams, [name]: value });
        } else {
          setEditDetailParams({ ...editDetailParams, [name]: value });
        }
      }
    }
  };

  const handleMentorInputChange = (e) => {
    const { name, value } = e.target;
    setMentorParams({ ...mentorParams, [name]: value });
  };

  const handleEditUserInputChange = (e) => {
    const { name, value } = e.target;
    setEditDetailParams({ ...editDetailParams, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = e.target.files[0];
    if (file && file.size < maxFileSize) {
      setFileSizeExceeded(false);
      setImage(file);
      setMentorParams({ ...mentorParams, [name]: files[0] });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setDisplayImage(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setFileSizeExceeded(true);
    }
  };

  const handleChangePage = (e, page) => {
    // console.log(page);
    setPaginationData((d) => ({ ...d, page }));
    setSearchData(
      searchList.slice(
        page * paginationData.perPage - paginationData.perPage,
        page * paginationData.perPage
      )
    );
    handleLocalData(showStudents, page);
  };

  const handleParkingModel = (id) => {
    setIsParkingModel(true);
    const filterStudent = filterByProperty(activeStudent, "_id", id);
    setParkingModelDetails(filterStudent[0]);
    console.log(filterStudent);
  };

  const handleMentorModel = (id) => {
    setIsMentorModel(true);
    const filterStudent = filterByProperty(activeStudent, "_id", id);
    setMentorModelDetails(filterStudent[0]);
    console.log(filterStudent);
  };

  const handleAddParking = async (studentId) => {
    setIsAlert(true);
    setStatus("loading");
    if (studentId) {
      try {
        const response = await makeApiCall(
          "post",
          "user/addparkingplayer",
          {
            parking_id: parking,
            user_id: studentId,
            revesed_parking: isReserved,
          },
          "raw"
        );
        if (response.data.status === 1) {
          setStatus("complete");
          setSuccessMsg(response.data.message);
          setParkingList(false);
        } else {
          setStatus("error");
          setErrorMsg(response.data.message);
        }
      } catch (error) {}
    } else {
      setIsAlert(true);
      setStatus("error");
      setErrorMsg("Please select student");
    }
  };

  const handleDeleteClick = () => {
    console.log("first");
    setIsAlert(true);
    setStatus("start");
    setActions("delete");
  };

  const handleStudentDelete = async (studentId, branchId) => {
    setIsAlert(true);
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "post",
        "garbaclass/deletegarbaplayer",
        {
          branch_id: selectedBranchId,
          student_id: selectedStudentId,
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

  return (
    <>
      {isAlert ? (
        <Alert
          isOpen={isAlert}
          title="Are you sure?"
          text="You won't be able to revert this!"
          confirmButtonText="Submit"
          cancelButtonText="Cancel"
          onConfirm={action === "delete" ? handleStudentDelete : handleApprove}
          onCancel={handleCancel}
          status={status}
          confirmText={successMsg}
          errorText={errorMsg}
          onComplete={handleComplete}
        />
      ) : null}

      <div className="h-auto m-[2px] p-[15px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <p className=" capitalize text-[22px] font-semibold">
          {params.status} Students
        </p>
        <p className="text-gray-400 text-lg font-semibold">
          GarbaClass :
          <span className="text-black">
            {" " + garbaClass?.garba_classname}
          </span>
        </p>
        <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start gap-4 md:hidden">
          <BsSearch />
          <input
            type="text"
            placeholder="Search students by name or phone"
            className="h-full w-full outline-none bg-gray-200"
            // value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {params.status === "active" ? (
          <div className="flex items-center flex-wrap justify-start gap-2 w-full md:hidden">
            <button
              className={`${
                showStudents === "all"
                  ? "bg-primary text-white "
                  : "bg-gray-200"
              } px-4 py-2 rounded-md`}
              onClick={() => handleStudentType("all")}
            >
              All ({totalStudent?.length})
            </button>
            <button
              className={`${
                showStudents === "active"
                  ? "bg-primary text-white "
                  : "bg-gray-200"
              } px-4 py-2 rounded-md`}
              onClick={() => handleStudentType("active")}
            >
              Active ({fullActiveStudent?.length})
            </button>
            <button
              className={`${
                showStudents === "semi-active"
                  ? "bg-primary text-white "
                  : "bg-gray-200"
              } px-4 py-2 rounded-md`}
              onClick={() => handleStudentType("semi-active")}
            >
              Semi-Active ({semiActiveStudent?.length})
            </button>
          </div>
        ) : null}
        <div className="flex flex-col gap-3 mb-24 md:hidden">
          {studentStatus === "active" ? (
            searchData ? (
              searchData?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-3">
                  {searchData?.map((student) => {
                    // const name = student.name.length>10?student.name.slice(0.5)+"..."+:student.name
                    return (
                      <Link
                        to={`/role/superadmin/student-detail/${classID}/${student._id}/active`}
                        key={student._id}
                      >
                        <StudentCard
                          image={student.profile_pic}
                          name={student.name}
                          phoneNumber={student.phone_number}
                          isCSV={student.pass_list.is_csv}
                        />
                        <div className="userInfo w-full flex justify-center">
                          {/* <button className="bg-primary text-white p-2 rounded-lg text-sm">
                            View details
                          </button> */}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                // <div className="studentData mt-4 w-full h-[85px] rounded-2xl animate-pulse bg-gray-100"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-2">
                  <div className="studentData mt-4 w-full h-[200px] rounded-2xl animate-pulse bg-gray-100"></div>
                  <div className="studentData mt-4 w-full h-[200px] rounded-2xl animate-pulse bg-gray-100"></div>
                </div>
              )
            ) : (
              <p className="text-gray-300 mt-5 text-2xl text-center font-semibold ">
                No data found
              </p>
              // <p className=" font-light  mt-5 text-lg">No data found</p>
            )
          ) : studentStatus === "pending" ? (
            pendingStudents ? (
              pendingStudents?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-3">
                  {searchData?.map((student, i) => {
                    return (
                      <Link
                        key={i}
                        to={`/role/superadmin/student-detail/${classID}/${student._id}/pending`}
                      >
                        <StudentCard
                          image={student.profile_pic}
                          name={student.name}
                          phoneNumber={student.phone_number}
                        />
                        {/* <div className="userInfo w-full flex justify-center">
                          <button
                            className="bg-green-500 text-white p-2 rounded-lg text-sm"
                            onClick={() =>
                              handleApprove(student.branch_id, student._id)
                            }
                          >
                            Tap to approved
                          </button>
                        </div> */}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                // <p className=" font-light  mt-5 text-lg">No data found</p>
                <p className=" text-gray-300 mt-5 text-2xl text-center font-semibold ">
                  No data found
                </p>
              )
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-2">
                <div className="studentData mt-4 w-full h-[200px] rounded-2xl animate-pulse bg-gray-100"></div>
                <div className="studentData mt-4 w-full h-[200px] rounded-2xl animate-pulse bg-gray-100"></div>
              </div>
              // <div className="studentData mt-4 w-full h-[85px] rounded-2xl animate-pulse bg-gray-100"></div>
            )
          ) : approvedStudents ? (
            approvedStudents?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-3">
                {searchData?.map((student, i) => {
                  return (
                    <Link
                      key={i}
                      to={`/role/superadmin/student-detail/${classID}/${student._id}/approved`}
                    >
                      <div
                        className="userDetails w-full"
                        onClick={() => {
                          setSelectedStudents(student);
                        }}
                      >
                        <StudentCard
                          image={student.profile_pic}
                          name={student.name}
                          phoneNumber={student.phone_number}
                        />
                        {/* <div className="userInfo w-full flex justify-center">
                          <button className="bg-green-500 text-white p-2 rounded-lg text-sm">
                            Tap to active
                          </button>
                        </div> */}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              // <p className=" font-light  mt-5 text-lg">No data found</p>
              <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-2">
                <div className="studentData mt-4 w-full h-[200px] rounded-2xl animate-pulse bg-gray-100"></div>
                <div className="studentData mt-4 w-full h-[200px] rounded-2xl animate-pulse bg-gray-100"></div>
              </div>
            )
          ) : (
            <p className="text-gray-300 mt-5 text-2xl text-center font-semibold ">
              No data found
            </p>
            // <div className="studentData mt-4 w-full h-[85px] rounded-2xl animate-pulse bg-gray-100"></div>
          )}
          {searchList?.length ? (
            <Pagination
              className="w-full flex justify-center"
              count={Math.ceil(searchList.length / paginationData?.perPage)}
              color="primary"
              page={paginationData.page}
              onChange={handleChangePage}
            />
          ) : null}
        </div>

        {isParkingModel ? (
          <div className="bg-[#00000080] h-screen w-full absolute top-0 z-50 flex items-center justify-center">
            <div className="bg-[#f2f2f2] md:max-h-2/4 md:h-auto md:w-2/4 w-3/4 max-h-3/4 rounded-md p-5 overflow-y-auto">
              <div className="flex items-center justify-between  text-2xl cursor-pointer ">
                <p className="font-semibold">Parking Details</p>
                <span onClick={() => setIsParkingModel(false)}> &times;</span>
              </div>
              <div className="w-full mt-4">
                <div className="parking border rounded-xl py-3 px-5">
                  <div className="flex">
                    <div className="name">
                      <p className="text-sm text-gray-400">Parking Name</p>
                      <p
                        style={{
                          backgroundColor: `#${parkingModelDetails?.parkings?.color_code.slice(
                            4
                          )}`,
                        }}
                        className="mt-1 text-white px-3 py-1 rounded-full"
                      >
                        {parkingModelDetails?.parkings?.parking_name}
                      </p>
                    </div>
                    <div className="slot ms-auto text-end">
                      <p className="text-sm text-gray-400">Slot</p>
                      <p>{parkingModelDetails?.parkings?.allot_slot}</p>
                    </div>
                  </div>
                  <div className="flex mt-3">
                    <div className="name">
                      <p className="text-sm text-gray-400">ID</p>
                      <p>{parkingModelDetails?.parkings?.parking_random_id}</p>
                    </div>
                    <div className="slot ms-auto text-end">
                      <p className="text-sm text-gray-400">Vehicle</p>
                      <p>
                        {parkingModelDetails?.parkings?.two_wheeler_parking ===
                        "true"
                          ? "Bike"
                          : "Car"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {isMentorModel ? (
          <div className="bg-[#00000080] h-screen w-[87%] absolute top-0 z-50 flex items-center justify-center">
            <div className="bg-[#f2f2f2] md:max-h-2/4 md:h-auto md:w-2/4 w-3/4 max-h-3/4 rounded-md p-5 overflow-y-auto">
              <div className="flex items-center justify-between  text-2xl cursor-pointer ">
                <p className="font-semibold">Mentors Details</p>
                <span onClick={() => setIsMentorModel(false)}> &times;</span>
              </div>
              {mentorModelDetails.pass_list?.mentor_list?.map((mentor) => {
                return (
                  <div className="flex items-center mt-2 border border-black p-2 rounded-md">
                    <div className="image ">
                      <img
                        src={
                          mentor.profile_pic ? mentor.profile_pic : black_image
                        }
                        alt="image"
                        className=" h-16 w-16 rounded-full object-cover"
                      />
                    </div>
                    <div className="ms-4">
                      <p className="font-medium text-sm capitalize">
                        {mentor.name}
                      </p>
                      <p className="text-sm">Age : -</p>
                      <p className="text-sm capitalize">
                        Phone No : {mentor.phone_number}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div ref={tableRef} className="hidden md:block ">
          <MaterialReactTable
            style={{ margin: "20px" }}
            columns={columns}
            data={
              params.status === "active"
                ? activeStudent
                : params.status === "approved"
                ? approvedStudents
                : pendingStudents || []
            }
            positionToolbarAlertBanner="bottom"
          />
        <div className="h-14 my-10"></div>
        </div>

        {isParkingAdd ? (
          <div className="bg-[#00000080] h-screen w-[87%] absolute top-0 z-50 flex items-center justify-center">
            <div className="bg-[#f2f2f2] md:max-h-2/4 md:h-auto md:w-2/4 w-3/4 max-h-3/4 rounded-md p-5 overflow-y-auto">
              <div className="flex items-center justify-between  text-2xl cursor-pointer ">
                <p className="font-semibold">Add parking</p>
                <span onClick={() => setIsParkingAdd(false)}> &times;</span>
              </div>
              <>
                <div className="w-full my-3 p-1 border border-gray-300 rounded-2xl">
                  <div className="flex items-center">
                    <div className="flex item-center justify-between w-full gap-3  border-gray-300 relative">
                      <div
                        className={`w-2/4 flex items-center justify-center text-[14px] h-[36px] rounded-xl text-center z-0 bg-primary absolute ${
                          isReserved === false
                            ? " translate-x-full transition-all  "
                            : "translate-x-[0] transition-all "
                        }`}
                      ></div>
                      <div
                        className={`w-2/4 flex items-center justify-center text-[14px] h-[36px] ${
                          isReserved === true ? "text-white" : null
                        } rounded-xl z-50 text-center
    
                      `}
                        onClick={() => setIsReserved(true)}
                      >
                        Reserved parking
                      </div>
                      <div
                        className={`w-2/4 flex items-center justify-center text-[14px] h-[36px] ${
                          isReserved === true ? null : "text-white"
                        } z-50  rounded-xl text-center `}
                        onClick={() => setIsReserved(false)}
                      >
                        Normal parking
                      </div>
                    </div>
                  </div>
                </div>

                <div className="totalTicket my-3">
                  <p className="text-sm font-semibold">
                    Four Wheeler ({carParking?.length})
                  </p>
                </div>

                <div className="allTicket bg-white px-3 py-1 rounded-3xl">
                  {carParking?.map((carParkingData, i) => {
                    const colorCode = carParkingData.color_code.slice(4);
                    const singleCarParking = carParking.find(
                      (obj) => obj.parking_id === carParking._id
                    );
                    return (
                      <label
                        htmlFor="carparking"
                        key={i}
                        onClick={() => setParking(carParkingData._id)}
                      >
                        <div className="vip flex items-center my-2">
                          <div
                            className="rounded-full py-1 px-2 text-sm "
                            style={{ backgroundColor: "#" + colorCode }}
                          >
                            <p className="font-semibold text-white">
                              {carParkingData.parking_name}
                            </p>
                          </div>
                          <span className="ml-2 text-[12px] font-semibold text-primary">
                            {isReserved
                              ? carParkingData.remaining_reseved_slot
                              : carParkingData.remaining_slot}{" "}
                            parkings left
                          </span>

                          {isReserved ? (
                            carParkingData.remaining_reseved_slot > 0 ? (
                              <>
                                <div className="price ms-auto">
                                  <p className="text-sm mx-2">
                                    ₹{" "}
                                    {singleCarParking
                                      ? carParkingData.price
                                      : 0}
                                  </p>
                                </div>
                                <div className="select border border-gray-400 rounded-full flex items-center p-1 gap-2">
                                  <div
                                    className={`h-2 w-2 rounded-full ${
                                      parking === carParkingData._id
                                        ? "bg-primary"
                                        : null
                                    } `}
                                  ></div>
                                </div>
                              </>
                            ) : null
                          ) : carParkingData.remaining_slot > 0 ? (
                            <>
                              <div className="price ms-auto">
                                <p className="text-sm mx-2">
                                  ₹{" "}
                                  {singleCarParking ? carParkingData.price : 0}
                                </p>
                              </div>
                              <div className="select border border-gray-400 rounded-full flex items-center p-1 gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    parking === carParkingData._id
                                      ? "bg-primary"
                                      : null
                                  } `}
                                ></div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="totalTicket my-3">
                  <p className="text-sm font-semibold">
                    Two Wheeler ({bikeParking?.length})
                  </p>
                </div>

                <div className="allTicket bg-white px-3 py-1 rounded-3xl">
                  {bikeParking?.map((bikeParkingData, i) => {
                    const colorCode = bikeParkingData.color_code.slice(4);
                    const singleCarParking = bikeParking.find(
                      (obj) => obj.parking_id === bikeParking._id
                    );
                    return (
                      <>
                        <label
                          htmlFor="bikeparking"
                          key={i}
                          onClick={() => setParking(bikeParkingData._id)}
                        >
                          <div className="vip flex items-center my-2">
                            <div
                              className="rounded-full py-1 px-2 text-sm "
                              style={{ backgroundColor: "#" + colorCode }}
                            >
                              <p className="font-semibold text-white">
                                {bikeParkingData.parking_name}
                              </p>
                            </div>
                            <span className="ml-2 text-[12px] font-semibold text-primary">
                              {isReserved
                                ? bikeParkingData.remaining_reseved_slot
                                : bikeParkingData.remaining_slot}{" "}
                              parkings left
                            </span>

                            {isReserved ? (
                              bikeParkingData.remaining_reseved_slot > 0 ? (
                                <>
                                  <div className="price ms-auto">
                                    <p className="text-sm mx-2">
                                      ₹{" "}
                                      {singleCarParking
                                        ? bikeParkingData.price
                                        : 0}
                                    </p>
                                  </div>
                                  <div className="select border border-gray-400  rounded-full flex items-center p-1 gap-2">
                                    <div
                                      className={`h-2 w-2 rounded-full ${
                                        parking === bikeParkingData._id
                                          ? "bg-primary"
                                          : null
                                      } `}
                                    ></div>
                                  </div>
                                </>
                              ) : null
                            ) : bikeParkingData.remaining_slot > 0 ? (
                              <>
                                <div className="price ms-auto">
                                  <p className="text-sm mx-2">
                                    ₹{" "}
                                    {singleCarParking
                                      ? bikeParkingData.price
                                      : 0}
                                  </p>
                                </div>
                                <div className="select border border-gray-400  rounded-full flex items-center p-1 gap-2">
                                  <div
                                    className={`h-2 w-2 rounded-full ${
                                      parking === bikeParkingData._id
                                        ? "bg-primary"
                                        : null
                                    } `}
                                  ></div>
                                </div>
                              </>
                            ) : null}
                          </div>
                        </label>
                      </>
                    );
                  })}
                </div>
              </>

              <div className="buttom bg-white flex items-center p-2 mt-2 rounded-2xl gap-5">
                <div className="addTicket w-full ">
                  <button
                    className="bg-primary text-white w-full py-4 rounded-xl font-medium"
                    onClick={() => handleAddParking(selectedStudentId)}
                  >
                    Add parking
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {isMentorAdd ? (
        <div className="bg-[#00000080] h-screen w-[87%] absolute top-0 z-50 flex items-center justify-center">
          <div className="bg-[#f2f2f2] md:max-h-[500px] md:h-auto md:w-2/4 w-3/4 max-h-3/4 rounded-md p-5 overflow-y-auto">
            <div className="flex items-center justify-between  text-2xl cursor-pointer ">
              <p className="font-semibold">Add Mentor</p>
              <span onClick={() => setIsMentorAdd(false)}> &times;</span>
            </div>
            <div className="flex w-full  flex-col gap-[25px] justify-start items-start">
              <div className="eventImage flex flex-col w-full gap-3 justify-center items-center ">
                <div className="authorizedPersonAvtar w-full">
                  <ImageUpload
                    id={"file"}
                    name={"profile_pic"}
                    handleChange={(e) => handleFileChange(e)}
                    // handleChange={(e) => console.log(e)}
                    source={displayImage}
                    heading={"Image"}
                    height={"h-auto min-h-56"}
                    label={displayImage ? "Replace image" : "Upload image"}
                    // handleDelete={()=>handleDelete("landscap")}
                  />
                  {fileSizeExceeded && (
                    <p className="error text-red-500">
                      File size exceeded the limit of 9 mb
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <InputField
                  type="text"
                  placeholder={"Student Name"}
                  inputPlaceholder={"Enter Student name"}
                  value={name}
                  name={"name"}
                  // handleChange={(e) => setName(e.target.value)}
                  handleChange={handleMentorInputChange}
                  disabled={false}
                />
              </div>
              {/* <div className="w-full">
                <InputField
                  type="text"
                  placeholder={"Instagram ID"}
                  inputPlaceholder={"Enter Instagram Id"}
                  value={insta}
                  name={"instagram_id"}
                  handleChange={handleMentorInputChange}
                  disabled={false}
                />
              </div> */}

              {/* <div className="text w-full">
                <p className="text-[14px] font-semibold ms-1 mb-1">
                  Blood group
                </p>
                <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                  <div className="authorizedName flex items-center h-full">
                    <Select
                      options={bloodData}
                      components={animatedComponents}
                      isMulti={false}
                      name="blood"
                      placeholder="Select Blood group"
                      onChange={(e) => {
                        const { value } = e;
                        const name = "blood_group";
                        setMentorParams({ ...mentorParams, [name]: value });
                      }}
                      className="basic-multi-select h-full flex item-center bg-transparent"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
              </div> */}
              <div className="w-full">
                <PhoneNumberInput
                  value={contact}
                  name={"phone_number"}
                  // handleChange={(e) => handleNumberChange(e, "mentor")}
                  handleChange={handleMentorInputChange}
                />
              </div>
              <div className="w-full">
                <InputField
                  type="date"
                  placeholder={"Birth Date"}
                  disabled={false}
                  name="birth_date"
                  // value={params.event_date}
                  // handleChange={(e) => setBirthDate(e.target.value)}
                  handleChange={handleMentorInputChange}
                />
              </div>
              <div className="text w-full">
                <p className="text-[14px] font-semibold ms-1 mb-1">Gender</p>
                <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                  <div className="authorizedName flex items-center h-full">
                    <Select
                      options={genderData}
                      components={animatedComponents}
                      isMulti={false}
                      name="gender"
                      placeholder="Select Gender"
                      onChange={(e) => {
                        const { value } = e;
                        const name = "gender";
                        setMentorParams({ ...mentorParams, [name]: value });
                      }}
                      // onChange={(e) => {
                      //   setGender(e.value);
                      // }}
                      className="basic-multi-select h-full flex item-center bg-transparent"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
              </div>
              {/* <div className="w-full">
            <InputField
              type="date"
              placeholder={"Birth Date"}
              disabled={false}
              name="event_date"
              // value={params.event_date}
              handleChange={(e) => setBirthDate(e.target.value)}
            />
          </div> */}
              <div className="flex w-full items-center gap-4">
                <PrimaryButton
                  background={"primary-button"}
                  // handleClick={()=>console.log(mentorParams)}
                  handleClick={handleAddMentor}
                  title={"Submit"}
                />
              </div>
              <div className="h-14"></div>
            </div>
          </div>
        </div>
      ) : null}
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
          usertype={"pass"}
          allAccess={selectedAllAccess}
        />
      ) : null}

      {editDetail === true ? (
        <div className="bg-[#00000080] h-screen w-[87%] fixed top-0 z-50 flex items-center justify-center">
          <div className="bg-[#f2f2f2] md:max-h-2/4 md:h-auto md:w-2/4 w-3/4 max-h-3/4 rounded-md p-5 overflow-y-auto">
            <div className="flex items-center justify-between  text-2xl cursor-pointer ">
              <p className="font-semibold">Edit Details</p>
              <span onClick={() => setEditDetail(false)}> &times;</span>
            </div>
            <div className="userDetails flex flex-col gap-3">
              <div className="mt-3">
                <InputField
                  type={"text"}
                  placeholder={"Name"}
                  inputPlaceholder="Name"
                  name="name"
                  value={editDetailParams["name"] || ""}
                  handleChange={handleEditUserInputChange}
                />
              </div>
              <div>
                {/* <InputField
                  type={"number"}
                  placeholder={"Phone No"}
                  inputPlaceholder="Phone No"
                  name="phone_number"
                  value={editDetailParams["phone_number"] || ""}
                  handleChange={handleNumberChange}
                /> */}
                <PhoneNumberInput
                  value={contact}
                  name={"phone_number"}
                  handleChange={handleNumberChange}
                />
              </div>
              <div className="text w-full">
                <p className="text-[14px] font-semibold ms-1 mb-1">Gender</p>
                <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                  <div className="authorizedName flex items-center h-full">
                    <Select
                      options={genderData}
                      components={animatedComponents}
                      isMulti={false}
                      name="gender"
                      placeholder="Select Gender"
                      onChange={(e) => {
                        const { value } = e;
                        const name = "gender";
                        setEditDetailParams({
                          ...editDetailParams,
                          [name]: value,
                        });
                      }}
                      className="basic-multi-select h-full flex item-center bg-transparent"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
              </div>

              <div className="text w-full">
                <p className="text-[14px] font-semibold ms-1 mb-1">
                  Blood Group
                </p>
                <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                  <div className="authorizedName flex items-center h-full">
                    <Select
                      options={bloodData}
                      components={animatedComponents}
                      isMulti={false}
                      name="blood_group"
                      placeholder="Select Blood Group"
                      onChange={(e) => {
                        const { value } = e;
                        const name = "blood_group";
                        setEditDetailParams({
                          ...editDetailParams,
                          [name]: value,
                        });
                      }}
                      className="basic-multi-select h-full flex item-center bg-transparent"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
              </div>
              <div>
                <InputField
                  type={"date"}
                  placeholder={"Birth Date"}
                  inputPlaceholder="Birth Date"
                  name="birth_date"
                  value={editDetailParams["birth_date"] || ""}
                  handleChange={handleEditUserInputChange}
                />
              </div>
              <div>
                <InputField
                  type={"text"}
                  placeholder={"Instagram ID"}
                  inputPlaceholder="Instagram ID"
                  name="instagram_id"
                  value={editDetailParams["instagram_id"] || ""}
                  handleChange={handleEditUserInputChange}
                />
              </div>
              <div className="flex items-center gap-4 selection:bg-none">
                <PrimaryButton
                  background={"primary-button"}
                  // handleClick={createCheckPoint}
                  handleClick={userUpdate}
                  title={"Submit"}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isImageModel ? (
        <ImageModel
          src={selectedImage ? selectedImage : black_image}
          handleClose={() => setIsImageModel(false)}
        />
      ) : null}
    </>
  );
};

export default GarbaStudentList;

const StudentCard = ({ image, name, phoneNumber, isCSV }) => {
  const [isImageModel, setIsImageModel] = useState(false);
  return (
    <>
      <div
        className="bg-white p-3 rounded-xl h-auto"
        style={{ boxShadow: "0px 0px 20px #0000002b" }}
      >
        <div className="flex items-center justify-end">
          <p className="text-xs my-1 text-white bg-primary rounded-full w-auto py-1 px-2 ms-auto">
            CSV
          </p>
        </div>

        <div className="garbaImage flex justify-center items-center overflow-hidden">
          <img
            src={image ? image : black_image}
            alt="image"
            className="w-[70px] h-[70px] rounded-3xl"
            onClick={() => setIsImageModel(true)}
          />
        </div>
        <div className="garbaText my-4 text-center">
          <h1 className="text-[1rem] max-h-[200px] h-auto font-medium capitalize truncate">
            {name}
          </h1>
          <p className="text-sm text-gray-400 my-1">{phoneNumber}</p>
        </div>
      </div>
      {isImageModel ? (
        <ImageModel
          src={image ? image : black_image}
          handleClose={() => setIsImageModel(false)}
        />
      ) : null}
    </>
  );
};
