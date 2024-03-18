import React, { useEffect, useState } from "react";
import { BsTag, BsPinMap } from "react-icons/bs";
import { MdPersonOutline, MdDateRange } from "react-icons/md";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { useParams } from "react-router-dom";
import ValueInput from "../../../componets/ui-elements/ValueInput";
import { makeApiCall } from "../../../api/Post";
import Loader from "../../../componets/ui-elements/Loader";

const NotificationInfo = () => {
  const param = useParams();
  const [notification, setNotification] = useState(null);
  const eventId = param.id;
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState();
  const [date, setDate] = useState();
  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  const [isEditable, setIsEditable] = useState(false);

  const getAllNotification = async () => {
    try {
      const response = await makeApiCall("get", "notification/all", null);
      console.log(response);
      setNotification(response.data.tickets);
    } catch (error) {
      console.error(error);
    }
  };

  // const findNotification = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await makeApiCall("post", "notification/update", {
  //       event_id: eventId,
  //     });
  //     console.log(response);
  //     setNotification(response.data.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // findNotification();
    getAllNotification();
  }, []);

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[50px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="flex flex-col gap-[25px] justify-start items-center">
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  placeholder={"Notification Title"}
                  inputPlaceholder="Notification Title"
                  icon={<BsPinMap className="text-2xl" />}
                  disabled={false}
                  name="notification"
                  value={title}
                  handleChange={(e) => setTitle(e.target.value)}
                />
              ) : (
                <ValueInput
                  type="text"
                  icon={<BsPinMap className="text-2xl text-gray-400" />}
                  placeholder={"Notification Title"}
                  // inputPlaceholder={eventLocation}
                  isDisabled={true}
                />
              )}
            </div>

            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  placeholder={"Notification Body"}
                  inputPlaceholder="Notification Body"
                  icon={<BsPinMap className="text-2xl" />}
                  disabled={false}
                  name="eventLocation"
                  value={body}
                  handleChange={(e) => setBody(e.target.value)}
                />
              ) : (
                <ValueInput
                  type="text"
                  icon={<BsPinMap className="text-2xl text-gray-400" />}
                  placeholder={"Notification Body"}
                  // inputPlaceholder={eventLocation}
                  isDisabled={true}
                />
              )}
            </div>

            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="date"
                  placeholder={"Notification Date"}
                  inputPlaceholder="Notification Date"
                  icon={<BsPinMap className="text-2xl" />}
                  disabled={false}
                  name="eventLocation"
                  value={date}
                  handleChange={(e) => setDate(e.target.value)}
                />
              ) : (
                <ValueInput
                  type="date"
                  icon={<BsPinMap className="text-2xl text-gray-400" />}
                  placeholder={"Notification Date"}
                  // inputPlaceholder={eventLocation}
                  isDisabled={true}
                />
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 mb-24">
            {/* <PrimaryButton background={"primary-button"} title={"Submit"} /> */}
            <PrimaryButton background={"bg-black"} title={"Edit Detail"} />
            <PrimaryButton background={"bg-black"} title={"Delete"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationInfo;
