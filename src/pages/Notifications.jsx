import React, { useEffect, useState } from "react";
import Notification from "../assets/notificationInfo.svg";
import { useQuery } from "react-query";
import { makeApiCall } from "../api/Post";

const Notifications = () => {
  const [user, setUser] = useState();

  const fetchData = async () => {
    const response = await makeApiCall("get", "user/info/", null, "raw");

    return response;
  };

  const { data, isLoading, error } = useQuery("data", fetchData);

  useEffect(() => {
    if (data) {
      setUser(data.data.data);
    } else {
      console.warn("Something went wrong");
    }
  }, [data, isLoading]);

  return (
    <div className="m-[2px] p-[25px] bg-[#F6FCFF] rounded-[30px] flex flex-col justify-start items-start h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="flex flex-col gap-[20px] justify-start items-start h-full w-full mb-24">
        {user?.notifications.length > 0 ? (
          user.notifications.map((notification) => {
            return (
              <div
                className="h-auto flex p-3 flex-col gap-2 items-start justify-between w-full bg-white border rounded-2xl"
                key={notification._id}
              >
                {/* <p className="text-[12px]">Event</p> */}
                <div className="flex items-center justify-start gap-2">
                  {/* <IoTicketSharp className="text-3xl text-green-500" /> */}
                  <div>
                    <p className="font-bold ">{notification.title}</p>
                    <p className="text-[10px]">{notification.body}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-auto w-full flex flex-col items-center m-auto">
            <div className="notificationImage">
              <img src={Notification} alt="image" />
            </div>
            <div className="notificationInfo text-center">
              <p className="text-xl font-semibold mt-5">No Notifications !</p>
              <p className="text-gray-400 mt-5">you will get notify soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
