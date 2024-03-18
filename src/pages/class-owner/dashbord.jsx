import React, { useEffect, useState } from "react";
import { BsArrowRight, BsBellFill, BsChevronRight } from "react-icons/bs";
import { MdLocationPin } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { makeApiCall } from "../../api/Post";
import { filterByProperty } from "../../utils/CommonFunctions";
import BotttmNavbar from "../../componets/BotttmNavbar";
import black_user from "../../assets/blank_user.svg";

const classOwner = () => {
  const [approvalRequest, setApprovalRequest] = useState([]);
  const [activeStudent, setActiveStudent] = useState([]);
  const [approvedStudent, setApprovedStudent] = useState([]);

  const [user, setUser] = useState();
  const [garbaClass, setGarbaClass] = useState();
  const [branchId, setBranchId] = useState();
  const [branchList, setBranchList] = useState();
  const [branchStudents, setBranchStudents] = useState();
  const [filterBranch, setFilterBranch] = useState();
  const navigate = useNavigate();
  const [totalStudent, setTotalStudent] = useState([]);
  const [isBranchOwner, setIsBranchOwner] = useState();

  const getGarbaData = async (classId, id) => {
    try {
      const response = await makeApiCall(
        "get",
        `garbaclass/info/${classId}`,
        null,

        "raw"
      );

      if (response.data.status === 1) {
        setGarbaClass(response.data.data);

        const branchList = response.data.data.branch_list;
        setBranchList(branchList);

        const filterBranch = filterByProperty(branchList, "owner", id);
        setBranchId(filterBranch[0]._id);
        setFilterBranch(filterBranch[0]);

        const studentList = filterBranch[0].student_list;

        const pendingStudentData = filterBranch[0].approval_request_list;
        setApprovalRequest(pendingStudentData);

        const pendingPaymentStudentData = studentList.filter(
          (student) => student.pass_list.pass_status === "Approved"
        );
        setApprovedStudent(pendingPaymentStudentData);

        const activeStudentData = studentList.filter(
          (student) => student.pass_list.pass_status === "Active"
        );
        setActiveStudent(activeStudentData);

        const combinedArray = filterBranch[0].approval_request_list.concat(
          filterBranch[0].student_list
        );
        setTotalStudent(combinedArray);
      }

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const getGarbaBranchData = async (classId, id) => {
    const response = await makeApiCall(
      "get",
      `garbaclass/branch/info/${classId}`,
      null,
      "raw"
    );
    if (response.data.status === 1) {
      setGarbaClass(response.data.data);

      const studentList = response.data.data.student_list;

      const pendingStudentData = response.data.data.approval_request_list;
      setApprovalRequest(pendingStudentData);

      const pendingPaymentStudentData = studentList.filter(
        (student) => student.pass_list.pass_status === "Approved"
      );
      setApprovedStudent(pendingPaymentStudentData);

      const activeStudentData = studentList.filter(
        (student) => student.pass_list.pass_status === "Active"
      );
      setActiveStudent(activeStudentData);

      const combinedArray = response.data.data.approval_request_list.concat(
        response.data.data.student_list
      );
      setTotalStudent(combinedArray);
    } else {
      console.log("Something is wrong");
      console.error(response.data);
    }

    return response;
  };

  const fetchData = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "user/info/",
        null,

        "raw"
      );

      if (response.data.status === 1) {
        setUser(response.data.data);

        if (response.data.data.roles === "branchowner") {
          if (response.data.data.owener_of_garba_class_branch != null) {
            setIsBranchOwner(true);
            getGarbaBranchData(
              response.data.data?.owener_of_garba_class_branch._id,
              response.data.data?._id
            );
          } else {
            alert("Something went wrong");
            alert(response.data.data);
          }
        } else if (response.data.data.roles === "garbaclassowner") {
          if (response.data.data.owener_of_garba_class != null) {
            setIsBranchOwner(false);
            getGarbaData(
              response.data.data?.owener_of_garba_class._id,
              response.data.data?._id
            );
          } else {
            alert("Something went wrong");
            alert(response.data.data);
          }
        } else {
          console.warn("Something went wrong");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, isLoading, error } = useQuery("data", fetchData);

  useEffect(() => {
    console.log(error);
  }, [data, isLoading]);

  return (
    <>
      <div className="h-auto md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="garbaOwnerSection shadow-md bg-white px-6 py-4 h-auto items-center flex justify-between mb-2.5">
          <div className="flex items-center gap-4">
            <div className="avtar flex items-center justify-center overflow-hidden h-14 w-14 rounded-full ">
              <img
                src={user ? user.profile_pic : black_user}
                className=" object-cover"
                alt="image"
              />
            </div>
            <div className="adminText">
              {user ? (
                <h1 className="text-lg text-black font-semibold ">
                  {user.name}
                </h1>
              ) : (
                <div className="h-[28px] bg-gray-200 rounded-sm w-full animate-pulse"></div>
              )}
              {user ? (
                <h1 className="text-sm text-gray-500 font-light capitalize">
                  {user.roles}
                </h1>
              ) : (
                <div className="h-[28px] bg-gray-200 rounded-sm w-full animate-pulse"></div>
              )}
            </div>
          </div>
          <Link to="/role/classowner/notification">
            <div className="h-10 w-10 bg-black flex items-center justify-center rounded-full shadow-sm relative">
              <BsBellFill className="text-white text-xl" />
              {user?.notifications.length > 0 ? (
                <div className="bg-primary absolute h-4 w-4 rounded-full top-[-5px] right-0 flex items-center justify-center text-[10px] text-white">
                  {user?.notifications.length}
                </div>
              ) : null}
            </div>
          </Link>
        </div>

        {/* <hr className="border-gray-500"/> */}
        <div className="mx-3 py-5">
          <p className="text-xl font-semibold ">My Garba class</p>
          {garbaClass ? (
            <div className="bg-white p-3 rounded-lg mt-5  h-auto min-h-32 classOwnerCardShadow">
              <div className="flex justify-center w-full">
                <div className="garbaText flex items-center flex-col gap-2">
                  {garbaClass ? (
                    <div className="avtar flex items-center justify-center overflow-hidden h-32 w-32 rounded-full">
                      <img
                        src={
                          isBranchOwner
                            ? garbaClass.parent.garba_class_logo
                            : garbaClass.garba_class_logo
                        }
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                  )}
                  <div>
                    {garbaClass ? (
                      <h1 className="text-2xl text-center font-semibold">
                        {isBranchOwner
                          ? garbaClass?.branch_name
                          : garbaClass?.garba_classname}
                      </h1>
                    ) : (
                      <div className="h-[28px] bg-gray-200 rounded-md min-w-[150px] w-auto animate-pulse"></div>
                    )}

                    {garbaClass ? (
                      <h1 className="text-sm flex items-center justify-center text-gray-500 mt-1">
                        <MdLocationPin className="text-lg me-1" />
                        {isBranchOwner
                          ? garbaClass.parent.garba_class_area
                          : filterBranch?.branch_name}{" "}
                        {/* <span className="bg-green-200 p-1 rounded-md  text-green-700 font-normal">
                      {isBranchOwner
                        ? "Sub branch"
                        : filterBranch?.main_branch === true
                        ? "main branch"
                        : null}
                    </span> */}
                      </h1>
                    ) : (
                      <div className="h-[20px] bg-gray-200 rounded-md min-w-[170px] mt-[10px] w-auto animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
              <div className="totalstudent my-1 flex justify-end">
                <p className="garbaText text-sm bg-green-200 p-1 rounded-md  text-green-700 font-semibold">
                  Total student : {totalStudent.length}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-[250px] bg-gray-200 mt-5 rounded-md min-w-[150px] w-auto animate-pulse"></div>
          )}
        </div>

        <div className="classOwner mx-3 py-5">
          <p className="text-xl font-semibold ">Main branch students</p>

          <div
            className="garbaClass bg-white p-4 rounded-lg mt-5  h-auto flex flex-col gap-4 classOwnerCardShadow"
            // key={i}
            // onClick={() => handleNavigate(data.path)}
          >
            {garbaClass ? (
              // <Link to="/role/classowner/student-type/pending">
                <div className="garbaText flex items-center w-full justify-between">
                  <h1 className="text-md font-medium flex items-center gap-3">
                    {" "}
                    <div className="h-5 w-5 rounded-full bg-red-400"></div>{" "}
                    Pending request ({approvalRequest.length}){" "}
                  </h1>
                  <BsArrowRight className="text-xl" />
                </div>
              // </Link>
            ) : (
              <div className="h-[26px] bg-gray-200 rounded-md min-w-[150px] w-auto animate-pulse"></div>
            )}
            <hr />

            {garbaClass ? (
              <Link to="/role/classowner/student-type/approved">
                <div className="garbaText flex items-center w-full justify-between">
                  <h1 className="text-md font-medium flex items-center gap-3">
                    {" "}
                    <div className="h-5 w-5 rounded-full bg-yellow-300"></div>{" "}
                    Pending payment ({approvedStudent.length}){" "}
                  </h1>
                  <BsArrowRight className="text-xl" />
                </div>
              </Link>
            ) : (
              <div className="h-[26px] bg-gray-200 rounded-md min-w-[150px] w-auto animate-pulse"></div>
            )}
            <hr />

            {garbaClass ? (
              <Link to="/role/classowner/student-type/active">
                <div className="garbaText flex items-center w-full justify-between">
                  <h1 className="text-md font-medium flex items-center gap-3">
                    {" "}
                    <div className="h-5 w-5 rounded-full bg-green-400"></div>{" "}
                    Active students({activeStudent.length}){" "}
                  </h1>
                  <BsArrowRight className="text-xl" />
                </div>
              </Link>
            ) : (
              <div className="h-[26px] bg-gray-200 rounded-md min-w-[150px] w-auto animate-pulse"></div>
            )}
            <hr />

            {/* <Link to="/role/classowner/student-type/total">
              <div className="garbaText flex items-center w-full justify-between">
                <h1 className="text-md font-medium flex items-center gap-3">
                  {" "}
                  <div className="h-5 w-5 rounded-full bg-black"></div> Total
                  students ({totalStudent.length}){" "}
                </h1>
                <BsArrowRight className="text-xl" />
              </div>
              <hr className="mt-4" />
            </Link> */}
            {garbaClass ? (
              user?.roles === "garbaclassowner" || "branchowner" ? (
                <Link to="/role/classowner/all-students">
                  <div className="garbaText flex items-center w-full justify-between">
                    <h1 className="text-md font-medium flex items-center gap-3">
                      {" "}
                      <div className="h-5 w-5 rounded-full bg-purple-400"></div>{" "}
                      All students table
                    </h1>
                    <BsArrowRight className="text-xl" />
                  </div>
                </Link>
              ) : null
            ) : (
              <div className="h-[26px] bg-gray-200 rounded-md min-w-[150px] w-auto animate-pulse"></div>
            )}
          </div>
        </div>

        {/* //branch students */}

        <div className="h-24"></div>
      </div>
      <BotttmNavbar />
    </>
  );
};

export default classOwner;
