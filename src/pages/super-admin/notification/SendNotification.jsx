import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { BsSendFill } from "react-icons/bs";
import { makeApiCall } from "../../../api/Post";
import { useNavigate, useParams } from "react-router-dom";
import { filterByProperty } from "../../../utils/CommonFunctions";
import Alert from "../../../componets/ui-elements/Alert";

const SendNotification = () => {
  const [passUser, setPassUser] = useState();
  const [user, setUser] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [userList, setUserList] = useState();
  const params = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const userType = [
    {
      id: 1,
      name: "P-USER",
    },
    {
      id: 2,
      name: "N-USER",
    },
    {
      id: 3,
      name: "ALL",
    },
  ];

  const handleConfirm = async () => {
    if (selectedUser === 1) {
      const userId = passUser.map((user) => user._id);
      const data = {
        userids: userId,
        notification_id: params.id,
      };

      try {
        const response = await makeApiCall(
          "post",
          "notification/send",
          data,
          "raw"
        );

        if (response.data.status === 1) {
          console.log(response);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (selectedUser === 2) {
      const userId = user.map((user) => user._id);
      const data = {
        userids: userId,
        notification_id: params.id,
      };

      try {
        const response = await makeApiCall(
          "post",
          "notification/send",
          data,
          "raw"
        );

        if (response.data.status === 1) {
          console.log(response);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const userId = userList.map((user) => user._id);
      const data = {
        userids: userId,
        notification_id: params.id,
      };

      try {
        const response = await makeApiCall(
          "post",
          "notification/send",
          data,
          "raw"
        );

        if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
          // console.log(response);
          // navigate("/role/superadmin/notification");
        } else {
          setStatus("error");
          setErrorMsg(response.data.message);
          console.log(response);
        }
      } catch (error) {
        setStatus("error");
      setErrorMsg("Something went wrong");
        console.error(error);
      }
    }
  };

  const handleClick = () => {
    
      setIsAlert(true);
      setStatus("start");
    
    //  else {
    //   setIsAlert(true);
    //   setErrorMsg("Please fill all field");
    //   setStatus("error");
    // }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    navigate("/role/superadmin/notification");
  };

  const fetchUsers = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "user/userlist",
        null,
        "raw"
      );
      if (response.status === 200) {
        const rawUsers = response.data.data;
        const pUser = filterByProperty(rawUsers, "roles", "p-user");
        const nUser = filterByProperty(rawUsers, "roles", "n-user");
        setUserList(rawUsers);
        setPassUser(pUser);
        setUser(nUser);
        // console.log(pUser,"Pass user list")
        // console.log(nUser,"Normal user list")
      } else {
        console.log(response);
      }
      // setComplimantorycode(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      <div className="h-auto m-[2px] p-[20px] bg-white rounded-[30px] mt-4 flex flex-col gap-[50px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="eventImage flex flex-col gap-3 justify-center items-center "></div>
        <div className="info flex justify-center items-center gap-4 text-center">
          {userType.map((user) => {
            return (
              <button
                key={user.id}
                className={`text-lg font-medium border border-gray-400 rounded-xl p-4 w-full ${
                  selectedUser === user.id
                    ? "bg-primary text-white border-transparent"
                    : null
                }`}
                onClick={() => setSelectedUser(user.id)}
              >
                {user.name}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mb-24">
          <button
            className="font-semibold flex items-center justify-center gap-2 bg-green-500 text-white p-2 rounded-lg w-full"
            onClick={handleClick}
          >
            <BsSendFill />
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default SendNotification;
