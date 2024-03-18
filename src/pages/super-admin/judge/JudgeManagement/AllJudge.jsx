import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import AddButton from "../../../../componets/ui-elements/AddButton";
import { Link } from "react-router-dom";
import black_image from "../../../../assets/blank_user.svg";
import { makeApiCall } from "../../../../api/Post";
import { filterByProperty } from "../../../../utils/CommonFunctions";
import Alert from "../../../../componets/ui-elements/Alert";
import { useLocation } from "react-router-dom";

const AllJudge = () => {
  const location = useLocation();
  const eventId = location.state.event;
  console.log("event", eventId);

  const [judge, setJudge] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getAllJudge = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "judge/getalljudge",
        `?assign=true`,
        "raw"
      );
      console.log(response.data.data);
      const filterdAdmin = filterByProperty(
        response.data.data,
        "is_deleted",
        false
      );
      console.log(filterdAdmin);
      setJudge(filterdAdmin);
    } catch (error) {
      console.error(error);
    }
  };

  const [status, setStatus] = useState("start");
  const [isAlert, setIsAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [id, setId] = useState();

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    setIsAlert(false);
    //  navigate("/role/superadmin/judgedashboard/judgemanagement/alljudge");
  };

  const handleClick = (id) => {
    setId(id);
    if (id) {
      setIsAlert(true);
      setStatus("start");
    } else {
      setIsAlert(true);
      setErrorMsg("Please fill all field");
      setStatus("error");
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const data = {
        event_id: eventId,
        judge_id: id,
      };
      const response = await makeApiCall(
        "post",
        "judge/unassignevent",
        data,
        "raw"
      );
      console.log(response);
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

  useEffect(() => {
    getAllJudge();
  }, [!isAlert]);

  const sortedData = judge
    ?.slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchData = sortedData?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone_number.includes(searchQuery.toLowerCase())
  );

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
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
        <AddButton
          title={"Assign Judge"}
          link={`/role/superadmin/judgedashboard/judgemanagement/judgeassign?event=${eventId}`}
        />
          <div className="w-full p-4 rounded-xl bg-gray-200 my-5 flex items-center justify-start">
            <BsSearch />
            <input
              type="text"
              placeholder="Search judge by name or phone"
              className="h-full w-full ms-3 outline-none bg-gray-200"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
            <div className="w-full h-auto grid grid-cols-2  md:grid-cols-2 lg:grid-cols-3 gap-2 items-center mb-24">
              {searchData?.map((judge, i) => {
                return (
                  <JudgeCard
                    key={i}
                    image={judge.profile_pic}
                    name={judge.name}
                    phoneNumber={judge.phone_number}
                    onRemove={() => handleClick(judge._id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllJudge;

const JudgeCard = ({ image, name, phoneNumber, onRemove }) => {
  return (
    <>
      <div
        className="bg-white p-3 rounded-xl h-auto"
        style={{ boxShadow: "0px 0px 20px #0000002b" }}
      >
        <div className="garbaImage flex justify-center items-center overflow-hidden">
          <img
            src={image ? image : black_image}
            alt="image"
            className="w-[70px] h-[70px] rounded-3xl"
          />
        </div>
        <div className="garbaText my-4 text-center">
          <h1 className="text-xl font-medium">{name}</h1>
          <p className="text-sm text-gray-400 my-1">{phoneNumber}</p>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="bg-primary py-1 px-4 text-white rounded-full text-sm"
            onClick={() => onRemove()}
          >
            Remove
          </button>
        </div>
      </div>
    </>
  );
};
