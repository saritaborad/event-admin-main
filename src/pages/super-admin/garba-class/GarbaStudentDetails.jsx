import React, { useEffect, useState } from "react";
import Alert from "../../../componets/ui-elements/Alert";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../../api/Post";
import { useQuery } from "react-query";
import { filterByProperty } from "../../../utils/CommonFunctions";
import ValueInput from "../../../componets/ui-elements/ValueInput";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import ImageModel from "../../../componets/ui-elements/ImageModel";
import black_image from "../../../assets/blank_user.svg";

const GarbaStudentDetails = () => {
  const [method, setMethod] = useState();
  const [studentData, setStudentData] = useState();
  const [garbaClassName, setGarbaClassName] = useState();
  const [branchId, setBranchId] = useState();
  const [imageModel, setImageModel] = useState(false);

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const studenId = params.id;
  const classID = params.classID;

  const [carParking, setCarParking] = useState();
  const [bikeParking, setBikeParking] = useState();

  const [parking, setParking] = useState();

  const [parkingList, setParkingList] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall(
        "get",
        "garbaclass/info/" + classID,
        null,
        "raw"
      );
      if (response.data.status === 1) {
        const branchList = response.data.data.branch_list;
        setLoading(false);

        // console.log(branchList);
        //approval_request_list from branch
        const approvalRequest = branchList.reduce((students, branch) => {
          const branchStudents = branch.approval_request_list.map(
            (student) => ({
              branch_id: branch._id,
              branch_name: branch.branch_name,
              status: "Pending",
              ...student,
            })
          );

          return [...students, ...branchStudents];
        }, []);

        //students which is approved and active from branch
        const studentList = branchList.reduce((students, branch) => {
          const branchStudents = branch.student_list.map((student) => ({
            branch_id: branch._id,
            branch_name: branch.branch_name,
            status: student.pass_list?.pass_status,
            ...student,
          }));

          return [...students, ...branchStudents];
        }, []);

        //combined both array and make a single student array
        const combinedArray = approvalRequest.concat(studentList);

        const StudentDetails = filterByProperty(combinedArray, "_id", studenId);
        setStudentData(StudentDetails[0]);
      } else {
        // console.log(response);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
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

  const { data, isLoading, error } = useQuery("data", fetchData);

  const navigate = useNavigate();

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "get",
        "user/tappendingpass",
        null,
        "raw"
      );
      // console.log(response);
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

  const handleClick = () => {
    setIsAlert(true);
    setStatus("start");
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    fetchData();
    setIsAlert(false);
  };

  useEffect(() => {
    fetchParkingData();
  }, []);

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
        } else {
          setStatus("error");
          setErrorMsg(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsAlert(true);
      setStatus("error");
      setErrorMsg("Please select student");
    }
  };

  const handleImageClose = () => {
    setImageModel(false);
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

        // console.log(response);

        if (response.data.status === 1) {
          setStatus("complete");
          setSuccessMsg(response.data.message);
          setParkingList(false);
        } else {
          setStatus("error");
          setErrorMsg(response.data.message);
        }
      } catch (error) { }
    } else {
      setIsAlert(true);
      setStatus("error");
      setErrorMsg("Please select student");
    }
  };

  console.log(studentData)


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
      <div className="h-auto m-[2px] p-[25px] bg-white  classOwnerCardShadow  rounded-t-[30px] mt-4 flex flex-col gap-[30px] justify-start items-center md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        {studentData ? (
          <div className="eventPhoto border-2 border-gray-300 flex flex-col justify-center items-center h-32 w-32 rounded-full overflow-hidden">
            <img
              onClick={() => setImageModel(true)}
              src={studentData?.profile_pic || black_image}
              alt="student image"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="bg-gray-300 h-32 w-32 rounded-full overflow-hidden animate-pulse "></div>
        )}

        <div className="flex flex-col gap-[15px] justify-start items-center w-full">
          <div className="w-full">
            <ValueInput
              type="text"
              placeholder={"Full name"}
              disabled={false}
              value={studentData?.name}
            />
          </div>
          <div className="w-full">
            <ValueInput
              type="number"
              placeholder={"Phone"}
              disabled={false}
              value={studentData?.phone_number}
            />
          </div>
          <div className="w-full">
            <ValueInput
              type="text"
              placeholder={"Gender"}
              disabled={false}
              value={studentData?.gender}
            />
          </div>
          <div className="w-full">
            <ValueInput
              type="text"
              placeholder={"Garba Class Name"}
              disabled={false}
              value={studentData?.branch_name}
            />
          </div>
          {studentData?.pass_list.parking ? (
            <div className="w-full">
              <div className="parking border rounded-xl py-3 px-5">
                <div className="flex">
                  <div className="name">
                    <p className="text-sm text-gray-400">Parking Name</p>
                    <p
                      style={{
                        backgroundColor: `#${studentData?.pass_list.parking.color_code.slice(
                          4
                        )}`,
                      }}
                      className="mt-1 text-white px-3 py-1 rounded-full"
                    >
                      {studentData?.pass_list.parking.parking_name}
                    </p>
                  </div>
                  <div className="slot ms-auto text-end">
                    <p className="text-sm text-gray-400">Slot</p>
                    <p>{studentData?.pass_list.parking.allot_slot}</p>
                  </div>
                </div>
                <div className="flex mt-3">
                  <div className="name">
                    <p className="text-sm text-gray-400">ID</p>
                    <p>{studentData?.pass_list.parking.parking_random_id}</p>
                  </div>
                  <div className="slot ms-auto text-end">
                    <p className="text-sm text-gray-400">Vehicle</p>
                    <p>
                      {studentData?.pass_list.parking.two_wheeler_parking ===
                        "true"
                        ? "Bike"
                        : "Car"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {studentData?.pass_list.mentor_list?.map((mentor) => {
          return (
            <div className="flex w-full items-center justify-between px-5 py-3 rounded-xl border">
              <div className="image overflow-hidden">
                <img
                  src={mentor.profile_pic}
                  alt="image"
                  className="h-16 w-16 rounded-full"
                />
              </div>
              <div className="flex flex-col items-start justify-center mt-3 gap-5">
                <p className="text-lg ">
                  <span className="text-gray-500 text-lg mr-4">Name:</span>{" "}
                  {mentor.name}
                </p>
                <p className="text-lg">
                  <span className="text-gray-500 text-lg mr-4">Phone no:</span>
                  {mentor.phone_number}
                </p>
              </div>
            </div>
            //        <div className="mntolStudent border py-3 px-5 w-full rounded-xl">
            //   <div className="">

            //     <div className="name ">
            //       <p className="text-sm text-gray-400">Name</p>
            //       <p className="text-lg ">{mentor.name}</p>
            //     </div>

            //   </div>
            // </div>
          );
        })}
        {loading ? (
          <div className="w-full h-[56px] bg-gray-200 animate-pulse rounded-full"></div>
        ) : (
          <div className="flex items-center gap-2 w-full mb-24">
            {params.type === "approved" ? (
              <>
                <PrimaryButton
                  background={"bg-primary"}
                  handleClick={() => handleClick("notify")}
                  title={"Tap to notify"}
                />
                <PrimaryButton
                  background={"bg-green-500"}
                  handleClick={() => setParkingList(true)}
                  title={"Tap to active"}
                />
              </>
            ) : params.type === "active" ? (
              studentData?.pass_list.parking ? null : studentData ? (
                <PrimaryButton
                  background={"bg-green-500"}
                  handleClick={() => setParkingList(true)}
                  title={"Tap to add parking"}
                />
              ) : null
            ) : null}
          </div>
        )}

        <div className="h-14 "></div>
      </div>
      {parkingList === true ? (
        <div className="fixed z-30 top-0 left-0 h-screen w-full bg-[#000000ba] backdrop-blur-[3px] flex items-end  transition duration-700 ease-in-out">
          <div
            className={`max-h-auto relative h-auto w-full bg-[#F2F2F2] rounded-t-3xl p-5 gap-5`}
          >
            <>
              <div className="w-full my-3 p-1 border border-gray-300 rounded-2xl">
                <div className="flex items-center">
                  <div className="flex item-center justify-between w-full gap-3  border-gray-300 relative">
                    <div
                      className={`w-2/4 flex items-center justify-center text-[14px] h-[36px] rounded-xl text-center z-0 bg-primary absolute ${isReserved === false
                        ? " translate-x-full transition-all  "
                        : "translate-x-[0] transition-all "
                        }`}
                    ></div>
                    <div
                      className={`w-2/4 flex items-center justify-center text-[14px] h-[36px] ${isReserved === true ? "text-white" : null
                        } rounded-xl z-50 text-center
    
                      `}
                      onClick={() => setIsReserved(true)}
                    >
                      Reserved parking
                    </div>
                    <div
                      className={`w-2/4 flex items-center justify-center text-[14px] h-[36px] ${isReserved === true ? null : "text-white"
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
                                  {singleCarParking ? carParkingData.price : 0}
                                </p>
                              </div>
                              <div className="select border border-gray-400 rounded-full flex items-center p-1 gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${parking === carParkingData._id
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
                                ₹ {singleCarParking ? carParkingData.price : 0}
                              </p>
                            </div>
                            <div className="select border border-gray-400 rounded-full flex items-center p-1 gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${parking === carParkingData._id
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
                                    className={`h-2 w-2 rounded-full ${parking === bikeParkingData._id
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
                                  {singleCarParking ? bikeParkingData.price : 0}
                                </p>
                              </div>
                              <div className="select border border-gray-400  rounded-full flex items-center p-1 gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${parking === bikeParkingData._id
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
                {params.type === "approved" ? (
                  <button
                    className="bg-primary text-white w-full py-4 rounded-xl font-medium"
                    onClick={() => handleActive(studenId)}
                  >
                    Active student{" "}
                  </button>
                ) : params.type === "active" ? (
                  <div className="flex gap-2">
                    <button
                      className="bg-primary text-white w-full py-4 rounded-xl font-medium"
                      onClick={() => handleAddParking(studenId)}
                    >
                      Add parking
                    </button>
                    <button
                      className="bg-white border border-primary w-full py-4 rounded-xl font-medium"
                      onClick={() => setParkingList(false)}
                    >
                      Close
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {imageModel ? (
        <ImageModel
          src={studentData?.profile_pic || black_image}
          handleClose={handleImageClose}
        />
      ) : null}
    </>
  );
};
export default GarbaStudentDetails;
