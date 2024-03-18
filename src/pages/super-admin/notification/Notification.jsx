import { BsSendFill, BsEyeFill, BsGeoAltFill } from "react-icons/bs";
import AddButton from "../../../componets/ui-elements/AddButton";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import { formatDateToDDMMMYYYY } from "../../../utils/CommonFunctions";
import car from "../../../assets/sports-car.svg";
import bike from "../../../assets/scooter-front-view.svg";
import { GoAlertFill } from "react-icons/go";
import { FiCheck } from "react-icons/fi";
import InputField from "../../../componets/ui-elements/InputField";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import Alert from "../../../componets/ui-elements/Alert";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const Notification = () => {
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();

  const [notification, setNotification] = useState();
  const [sendOpen, setSendOpen] = useState(false);
  const [notificationName, setNotificationName] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [user, setUser] = useState();

  const [notificationParam, setNotificationParams] = useState({});

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const userData = [
    { value: "p-user", label: "Pass User" },
    // { value: "n-user", label: "N-User" },
    // { value: "user", label: "User" },
    { value: "all", label: "All-User" },
  ];

  const getAllNotification = async () => {
    try {
      const response = await makeApiCall("get", "notification/all", null);
      console.log(response);
      setNotification(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllNotification();
  }, []);

  const handleView = () => {
    navigate(`/role/superadmin/notification/${notification._id}`);
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      if (notificationParam.type === "p-user") {
        const response = await makeApiCall(
          "post",
          "notification/alluser",
          {
            title: notificationParam.title,
            body: notificationParam.description,
            type: notificationParam.type,
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
      } else if (notificationParam.type === "all") {
        const response = await makeApiCall(
          "post",
          "notification/alluser",
          {
            title: notificationParam.title,
            body: notificationParam.description,
            type: notificationParam.type,
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
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const handleClick = () => {
    if (notificationParam) {
      setIsAlert(true);
      setStatus("start");
    } else {
      setIsAlert(true);
      setErrorMsg("Please fill all field");
      setStatus("error");
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    setIsAlert(false);
  };

  const handleNotificationChange = (e) => {
    const { name, value } = e.target;
    setNotificationParams({ ...notificationParam, [name]: value });
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
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[40px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto gap-[40px]">
          <div className="w-full ">
            <InputField
              type="text"
              placeholder={"Notification Title"}
              inputPlaceholder={"Enter Title"}
              name={"title"}
              value={notificationParam["title"] || ""}
              // handleChange={(e) => setTitle(e.target.value)}
              handleChange={handleNotificationChange}
              disabled={false}
            />
          </div>
          <div className="w-full mt-5">
            <InputField
              type="text"
              placeholder={"Notification Description"}
              inputPlaceholder={"Enter Description"}
              name={"description"}
              value={notificationParam["description"] || ""}
              // handleChange={(e) => setDesc(e.target.value)}
              handleChange={handleNotificationChange}
              disabled={false}
            />
          </div>

          <div className="w-full mt-5">
            <p className="text-[14 px] text-black font-semibold">Select User</p>
            <div className="w-full h-16 border border-gray-300 rounded-lg">
              <div className="authorizedName flex items-center h-full">
                <Select
                  options={userData}
                  components={animatedComponents}
                  // placeholder="Select User"
                  isMulti={false}
                  name="user"
                  onChange={(e) => {
                    setNotificationParams({
                      ...notificationParam,
                      type: e.value,
                    });
                  }}
                  className="basic-multi-select h-full flex item-center bg-transparent"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-16 mb-24">
            <PrimaryButton
              background={"bg-green-500"}
              handleClick={handleClick}
              title={"Send"}
            />
          </div>

          {/* <AddButton
          title={"Notification"}
          link={"/role/superadmin/notification/add-new"}
        />

        <div className="flex flex-col gap-[25px] justify-start items-center">
          <div className="w-full">
            <InputField
              type="text"
              placeholder={"Event Title"}
              inputPlaceholder={"Enter Title"}
              value={notificationName}
              handleChange={(e) => setNotificationName(e.target.value)}
              disabled={false}
            />
          </div>
          <div className="w-full">
            <InputField
              type="text"
              placeholder={"Event Description"}
              inputPlaceholder={"Enter your Event Description"}
              value={notificationDescription}
              handleChange={(e) => setNotificationDescription(e.target.value)}
              disabled={false}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 ">
          <PrimaryButton
            background={"primary-button"}
            handleClick={handleClick}
            title={"Submit"}
          />
        </div>

        <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
          {notification ? (
            notification.length > 0 ? (
              notification?.map((notification, i) => {
                const formatedDate = formatDateToDDMMMYYYY(
                  notification.createdAt
                );
                return (
                  <div className="eventCardShadow w-full rounded-2xl" key={i}>
                    <div className="event p-3">
                      <div className="eventinfo px-2">
                        <div className="dateTime pt-4">
                          <p className="text-sm text-primary font-semibold">
                            {formatedDate}
                          </p>
                        </div>
                        <div className="eventName pt-1">
                          <p className="text-xl font-semibold">
                            {notification.title}
                          </p>
                        </div>
                        <div className="bodytext">
                          <p className="text-gray-400">{notification.body}</p>
                        </div>
                        <div className="button w-full flex gap-3 py-2">
                          <button
                            onClick={() => handleSend(notification._id)}
                            // onClick={() => setSendOpen(true)}
                            className="font-semibold flex items-center justify-center gap-2 bg-green-500 text-white p-2 rounded-lg w-full"
                          >
                            <BsSendFill />
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xl font-medium text-gray-400 mt-24">
                No Notification Found
              </p>
            )
          ) : (
            <>
              <div className="h-[300px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[300px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[300px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
            </>
          )}
        </div>
        {sendOpen === true ? (
          <div
            className={`bg-[#000000ba] backdrop-blur-[3px] top-0 left-0 h-screen absolute w-full `}
          >
            <div
              className={
                "fixed z-50 top-0 left-0 h-full w-full  flex items-center"
              }
            >
              <div
                className={`relative h-auto w-full bg-[#F2F2F2] rounded-3xl p-5 gap-5 mx-2 my-24`}
              >
                <div className="active flex justify-center items-center gap-3">
                  <button
                    className="text-lg font-medium bg-[#13B841] text-white py-2 px-5 mt-5 rounded-xl w-full"
                    onClick={() => setSendOpen(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null} */}
          {/* Notification PopPup End */}
        </div>
      </div>
    </>
  );
};

export default Notification;
