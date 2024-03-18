import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../../api/Post";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { filterByProperty } from "../../../utils/CommonFunctions";
import { BsCloudUploadFill } from "react-icons/bs";

const GarbaDetail = () => {
  const param = useParams();
  const classID = param.id;
  const navigate = useNavigate();

  const [garbaClass, setGarbaClass] = useState("loading");
  const [students, setStudents] = useState();

  const [activeStudents, setActiveStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);

  const studentType = [
    {
      id: 1,
      name: "Pending student",
      status: "pending",
      length: pendingStudents?.length,
    },
    {
      id: 2,
      name: "Pending payment",
      status: "approved",
      length: approvedStudents?.length,
    },
    {
      id: 3,
      name: "Active student",
      status: "active",
      length: activeStudents?.length,
    },
  ];

  const fetchData = async () => {
    const response = await makeApiCall(
      "get",
      "garbaclass/info/" + classID,
      null,
      "raw"
    );
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
        const branchStudents = branch.student_list.map((student) => {
          try {
            return {
              branch_id: branch._id,
              branch_name: branch.branch_name,
              status: student.pass_list.pass_status,
              ...student,
            };
          } catch (error) {
            console.error(
              `Error with student data: ${JSON.stringify(student)}`
            );
            throw error;
          }
        });

        return [...students, ...branchStudents];
      }, []);

      //combined both array and make a single student array
      const combinedArray = approvalRequest.concat(studentList);

      // console.log(combinedArray);

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

      setActiveStudents(activeStudent);
      setPendingStudents(pendingStudent);
      setApprovedStudents(approvedStudent);

      setStudents(combinedArray);
    }
  };

  useEffect(() => {
    fetchData();
    localStorage.removeItem("garbaStudent");
  }, []);

  const handleNavigateStudent = async (status) => {
    navigate(`/role/superadmin/garba-class/student-list/${param.id}/${status}`);
  };

  return (
    <div className="h-auto px-3 m-[2px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="py-5">
        <p className="text-xl font-semibold ">My Garba class</p>
        {garbaClass === "loading" ? (
          <div className="w-full h-auto min-h-[225px] rounded-md animate-pulse mt-2 bg-gray-200"></div>
        ) : (
          <Link to={`/role/superadmin/garba-class/${garbaClass?._id}`}>
            <div className="bg-white p-3 rounded-lg mt-5  h-auto min-h-32 classOwnerCardShadow">
              <div className=" w-full">
                <div className="garbaText flex items-start justify-center gap-2">
                  {garbaClass ? (
                    <div className="avtar flex items-center justify-center overflow-hidden h-32 w-32 rounded-full">
                      <img src={garbaClass.garba_class_logo} alt="" />
                    </div>
                  ) : (
                    <div className="h-24 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="flex justify-center my-3">
                  {garbaClass ? (
                    <h1 className="text-2xl font-semibold">
                      {garbaClass?.garba_classname}
                    </h1>
                  ) : (
                    <div className="h-[28px] bg-gray-200 rounded-md min-w-[150px] w-auto animate-pulse"></div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <p className="garbaText text-sm bg-red-200 p-1 rounded-md  text-red-700 font-semibold w-auto ">
                    Branchs : {garbaClass?.branch_list?.length}
                  </p>
                  <p className="garbaText text-sm  flex bg-green-200 p-1 rounded-md  text-green-700 font-semibold items-end flex-col">
                    Total student : {students?.length}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
      <div className="studentData rounded-lg">
        {studentType.map((type) => {
          return garbaClass === "loading" ? (
            <div
              className="w-full h-auto min-h-[54px] bg-gray-200 animate-pulse mt-2 rounded-md"
              key={type.id}
            ></div>
          ) : (
            <div
              key={type.id}
              onClick={() => handleNavigateStudent(type.status)}
              className="data border border-gray-400 p-3 rounded-lg my-2 flex items-center"
            >
              <p className="text-lg font-medium">
                {type.name} ({type.length})
              </p>
              <MdOutlineKeyboardArrowRight className="ms-auto text-2xl" />
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 mb-24 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {garbaClass === "loading" ? (
          <div className="w-full h-auto min-h-[128px] bg-gray-200 animate-pulse rounded-md"></div>
        ) : (
          <div
            className="bg-white p-4 rounded-xl mt-5 mx-2 max-h-40 h-auto classOwnerCardShadow"
            onClick={() =>
              navigate(
                `/role/superadmin/garba-class/import-csv/${garbaClass._id}`
              )
            }
          >
            <div className="garbaImage bg-gray-100 rounded-xl w-[70px] h-14 flex justify-center items-center p-3">
              <BsCloudUploadFill className="text-3xl text-primary" />
            </div>
            <div className="garbaText mt-3">
              <h1 className="text-lg font-semibold">Import CSV</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GarbaDetail;
