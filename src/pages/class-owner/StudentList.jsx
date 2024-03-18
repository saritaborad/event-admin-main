import React, { useState, useEffect } from "react";
import {
  BsCheckLg,
  BsChevronRight,
  BsClockHistory,
  BsPatchCheck,
  BsPatchCheckFill,
  BsSearch
} from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { makeApiCall } from "../../api/Post";
import { useQuery } from "react-query";
import { filterByProperty } from "../../utils/CommonFunctions";
import StudentCard from "../../componets/ui-elements/StudentCard";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const StudentList = () => {
  const [user, setUser] = useState();
  const [studentData, setStudentData] = useState();
  const [approvedStudent, setApprovedStudent] = useState();
  const [activeStudent, setActiveStudent] = useState();
  const [pendingStudent, setPendingStudent] = useState();
  const [isBranchOwner, setIsBranchOwner] = useState();
   const [searchQuery, setSearchQuery] = useState("");

  const params = useParams();

  const getGarbaData = async (classId, id) => {
    const response = await makeApiCall(
      "get",
      `garbaclass/info/${classId}`,
      null,
      "raw"
    );

    const branchList = response.data.data.branch_list;

    const filterBranch = filterByProperty(branchList, "owner", id);

    const studentList = filterBranch[0].student_list;

    const pendingStudentData = filterBranch[0].approval_request_list;

    const pendingPaymentStudentData = studentList.filter(
      (student) => student.pass_list.pass_status === "Approved"
    );

    const activeStudentData = studentList.filter(
      (student) => student.pass_list.pass_status === "Active"
    );

     const combinedArray = studentList.concat(
        studentList
      );


    switch (params.student_type) {
      case "active":
        const filterActiveStudentData = activeStudentData.map((student)=>({
          _id:student._id,
          name:student.name,
          pass_list:student.pass_list,
          profile_pic:student.profile_pic,
          phone_number:student.phone_number,
          gender:student.gender,
          type:"active"
        }));
        // console.log(activeStudentData,"Student list from function")
        setStudentData(filterActiveStudentData);
        break;

      case "approved":
          const filterApprovedStudentData = pendingPaymentStudentData.map((student)=>({
          _id:student._id,
          name:student.name,
          pass_list:student.pass_list,
          profile_pic:student.profile_pic,
          phone_number:student.phone_number,
          gender:student.gender,
          type:"approved"
        }));
        setStudentData(filterApprovedStudentData);
        break;

      case "pending":
         const filterPendingStudentData = pendingStudentData.map((student)=>({
          _id:student._id,
          name:student.name,
          pass_list:student.pass_list,
          profile_pic:student.profile_pic,
          phone_number:student.phone_number,
          gender:student.gender,
          type:"pending"
        }));
        setStudentData(pendingStudentData);
        break;

      default:
        console.log("type not found");
        break;
    }

    return response;
  };

  const getGarbaBranchData = async (classId, id) => {
    const response = await makeApiCall(
      "get",
      `garbaclass/branch/info/${classId}`,
      null,
      "raw"
    );

    if (response.data.status === 1) {
      const approveRequest = response.data.data.approval_request_list;

      const studentList = response.data.data.student_list;

      const pendingStudentData = response.data.data.approval_request_list;

      const pendingPaymentStudentData = studentList.filter(
        (student) => student.pass_list.pass_status === "Approved"
      );

      const activeStudentData = studentList.filter(
        (student) => student.pass_list.pass_status === "Active"
      );

      const combinedArray = response.data.data.approval_request_list.concat(
        response.data.data.student_list
      );

      switch (params.student_type) {
        case "total":
          setStudentData(combinedArray);
          // setActiveStudent(activeStudentData);
          // setApprovedStudent(pendingPaymentStudentData);
          // setPendingStudent(pendingStudentData);
          break;

        case "active":
          setStudentData(activeStudentData);
          break;

        case "approved":
          setStudentData(pendingPaymentStudentData);
          break;

        case "pending":
          setStudentData(pendingStudentData);
          break;

        default:
          console.log("type not found");
          break;
      }
    } else {
      console.log("Something is wrong");
      console.error(response.data);
    }

    return response;
  };

  const fetchData = async () => {
    const response = await makeApiCall(
      "get",
      "user/info/",
      null,
      "raw"
    );

    return response;
  };

  const { data, isLoading, error } = useQuery("data", fetchData);

  useEffect(() => {
    if (data) {
      setUser(data.data.data);
      if (data.data.data.roles === "branchowner") {
        setIsBranchOwner(true);
        getGarbaBranchData(
          data.data.data?.owener_of_garba_class_branch._id,
          data.data.data?._id
        );
      } else if (data.data.data.roles === "garbaclassowner") {
        setIsBranchOwner(false);
        getGarbaData(
          data.data.data?.owener_of_garba_class._id,
          data.data.data?._id
        );
      } else {
        console.warn("Something went wrong");
      }
    }
  }, [data, isLoading]);

    const sortedData =
      studentData?.slice().sort((a, b) => a.name.localeCompare(b.name));
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const searchData = sortedData?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.phone_number.includes(searchQuery.toLowerCase())  
  );

  console.log(studentData)

  return (
    <div className="createGarbaClassSubmit pt-10 h-full mb-24 md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="bg-white h-full  px-2 py-2 rounded-3xl">
        <h1 className="text-xl font-medium flex items-center gap-3 ps-1 mt-2 ms-3">
          {params.student_type === "total"
            ? "All students"
            : params.student_type === "approved"
            ? "Approved students"
            : params.student_type === "active"
            ? "Active students"
            : "Pending students"}
        </h1>

        <div className="w-auto p-4 mx-2 mt-3 rounded-xl bg-gray-200 flex items-center justify-start">
          <BsSearch />
          <input
            type="text"
            placeholder="Search student by name or phone"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex flex-col items-center justify-between h-full relative bg-white pt-4 mx-1">
          {/* {pageHeading} */}
          <div className="w-full">
            <div className="studentData">
              {
              studentData ? (
                studentData.length > 0 ? (
                  <div className="grid grid-cols-2 mb-24 md:grid-cols-3">
                    {searchData.map((student) => {
                      console.log(student.type)
                      return (
                        <StudentCard
                          image={student.profile_pic}
                          name={student.name}
                          link={`/role/classowner/student-details/${params.student_type}/${student._id}`}
                          isApproved={
                            params.student_type === "pending" ? false : true
                          }
                          phone={student.phone_number}
                          type={student.type}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center mt-52 font-semibold text-2xl text-gray-400">
                    No data found
                  </p>
                )
              ) : (
                <>
                  <div className="grid grid-cols-2 mb-24 md:grid-cols-3 gap-2">
                    <div className="studentData mt-4 w-full h-[170px] rounded-2xl animate-pulse bg-gray-100"></div>
                    <div className="studentData mt-4 w-full h-[170px] rounded-2xl animate-pulse bg-gray-100"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
