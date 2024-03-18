import React from "react";
import Notification from "../../assets/notificationInfo.svg";
import { useQuery } from "react-query";
import { makeApiCall } from "../../api/Post";

const Notifications = () => {

  const [user, setUser] = useState();

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
      } else {
        console.warn("Something went wrong");
    }
  }, [data, isLoading]);

  return (
    <div className="h-[90vh] m-[2px] p-[25px] bg-[#F6FCFF] rounded-[30px] flex justify-center items-center ">
      <div className="flex flex-col gap-[25px] justify-start items-center">
        <div className="w-full ">
          <div className="notificationImage">
            <img src={Notification} alt="image" />
          </div>
            <div className="notificationInfo text-center">
            <p className="text-xl font-semibold mt-5">No Notifications !</p>
            <p className="text-gray-400 mt-5">you will get notify soon</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Notifications;
