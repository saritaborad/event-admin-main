import React, { useEffect, useState } from "react";
import Alert from "../../componets/ui-elements/Alert";
import PrimaryButton from "../../componets/ui-elements/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../api/Post";
import { useQuery } from "react-query";
import { filterByProperty } from "../../utils/CommonFunctions";
import ValueInput from "../../componets/ui-elements/ValueInput";
import AlertPopPup from "../../componets/ui-elements/AlertPopPup";
import ImageModel from "../../componets/ui-elements/ImageModel";

const StudentDetails = () => {
  const [user, setUser] = useState();
  const [studentData, setStudentData] = useState();
  const [garbaClassName, setGarbaClassName] = useState();
  const [branchId, setBranchId] = useState();
  const [imageModel, setImageModel] = useState(false);
  
  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [isApproveAlert, setIsApproveAlert] = useState(false);


  const params = useParams();
  const studenId = params.id;

  // console.log(studentData);

  const getGarbaData = async (classId, id) => {
    const response = await makeApiCall(
      "get",
      `garbaclass/info/${classId}`,
      null,
      "raw"
    );

    if (response.data.status === 1) {
      setGarbaClassName(response.data.data.garba_classname);

      const branchList = response.data.data.branch_list;

      const filterBranch = filterByProperty(branchList, "owner", id);
      setBranchId(filterBranch[0]._id);

      const approveRequest = filterBranch[0].approval_request_list;

      const approvedStudent = filterBranch[0].student_list;

      const combinedArray = filterBranch[0].approval_request_list.concat(
        filterBranch[0].student_list
      );

      switch (params.type) {
        case "total":
          const singleTotalRecord = filterByProperty(
            combinedArray,
            "_id",
            studenId
          );
          setStudentData(singleTotalRecord[0]);
          break;

        case "active":
          const singleActiveRecord = filterByProperty(
            approvedStudent,
            "_id",
            studenId
          );
          setStudentData(singleActiveRecord[0]);

          break;

        case "approved":
          const singleApprovedRecord = filterByProperty(
            approvedStudent,
            "_id",
            studenId
          );
          setStudentData(singleApprovedRecord[0]);
          break;

        case "pending":
          const singlePendingRecord = filterByProperty(
            approveRequest,
            "_id",
            studenId
          );
          setStudentData(singlePendingRecord[0]);
          break;

        default:
          console.log("type not found");
          break;
      }
    } else {
      console.log("Something went wrong");
    }

    return response;
  };

  const getGarbaBranchData = async (classId) => {
    const response = await makeApiCall(
      "get",
      `garbaclass/branch/info/${classId}`,
      null,
      "raw"
    );
    if (response.data.status === 1) {
      setGarbaClassName(response.data.data.parent.garba_classname);
      setBranchId(response.data.data._id);

      const approveRequest = response.data.data.approval_request_list;

      const approvedStudent = response.data.data.student_list;

      const combinedArray = response.data.data.approval_request_list.concat(
        response.data.data.student_list
      );

      switch (params.type) {
        case "total":
          const singleTotalRecord = filterByProperty(
            combinedArray,
            "_id",
            studenId
          );
          setStudentData(singleTotalRecord[0]);
          break;

        case "active":
          const singleActiveRecord = filterByProperty(
            approvedStudent,
            "_id",
            studenId
          );
          setStudentData(singleActiveRecord[0]);

          break;

        case "approved":
          const singleApprovedRecord = filterByProperty(
            approvedStudent,
            "_id",
            studenId
          );
          setStudentData(singleApprovedRecord[0]);
          break;

        case "pending":
          const singlePendingRecord = filterByProperty(
            approveRequest,
            "_id",
            studenId
          );
          setStudentData(singlePendingRecord[0]);
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

  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setUser(data.data.data);
      if (data.data.data.roles === "branchowner") {
        getGarbaBranchData(data.data.data?.owener_of_garba_class_branch._id);
      } else if (data.data.data.roles === "garbaclassowner") {
        getGarbaData(
          data.data.data?.owener_of_garba_class._id,
          data.data.data?._id
        );
      } else {
        console.warn("Something went wrong");
      }
    }
  }, [data, isLoading]);

  const handleConfirm = async () => {
    setStatus("loading");
    if (params.type === "approved") {
      const data = {
        userids: [studenId],
      };

      try {
        const response = await makeApiCall(
          "post",
          "user/pendingpaymentplayer",
          data,
          "raw"
        );

        if (response.data.status === 1) {
          console.log(response);
          setStatus("complete");
          setSuccessMsg(response.data.message);
        } else {
          console.log(response);
          setStatus("error");
          setErrorMsg(response.data.message);
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
        setErrorMsg("Something went wrong");
      }
    } else if (params.type === "pending") {
      // try {
      //   const response = await makeApiCall(
      //     "post",
      //     "user/approverequest",
      //     {
      //       userid: studentData._id,
      //       branchid: branchId,
      //       action: true,
      //     },
      //     "raw"
      //   );
      //   if (response.data.status === 1) {
      //     setStatus("complete");
      //     setSuccessMsg(response.data.message);
      //   } else {
      //     setStatus("error");
      //     setErrorMsg(response.data.message);
      //   }
      // } catch (error) {
      //   console.warn(error);
      //   setStatus("error");
      //   setErrorMsg("Something went wrong");
      // }
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
    navigate("/role/classowner/");
  };

  const closeApprovePopup = () => {
    setIsApproveAlert(false);
  };

  const handleImageClose = ()=>{
    setImageModel(false)
  }

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
              onClick={()=>setImageModel(true)}
              src={studentData?.profile_pic}
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
              value={garbaClassName}
            />
          </div>
        </div>
        <div className="flex items-center w-full mb-24">
          {params.type === "approved" || params.type === "pending" ? (
            <PrimaryButton
              background={
                params.type === "approved"
                  ? "bg-primary"
                  : params.type === "pending"
                  ? "bg-green-500"
                  : "bg-green-500"
              }
              // handleClick={handleClick}
              handleClick={() =>
                params.type === "pending"
                  ? setIsApproveAlert(true)
                  : handleClick
              }
              title={
                params.type === "approved"
                  ? "Tap to notify"
                  : params.type === "pending"
                  ? "Tap to approve"
                  : "View details"
              }
            />
          ) : null}
        </div>
      </div>
      {isApproveAlert ? (
        <AlertPopPup
          branchId={branchId}
          userId={studenId}
          handleCancelClick={closeApprovePopup}
        />
      ) : null}
      {
        imageModel?
        <ImageModel src={studentData?.profile_pic}  handleClose={handleImageClose} />:null
      }
    </>
  );
};
export default StudentDetails;
