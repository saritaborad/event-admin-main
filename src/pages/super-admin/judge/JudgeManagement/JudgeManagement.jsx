import React, { useEffect, useState } from "react";
import { BsGeoAlt, BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { makeApiCall } from "../../../../api/Post";
import {
  filterByProperty,
  formatDateToDDMMMYYYY,
} from "../../../../utils/CommonFunctions";
import JudgeEventCard from "../../../../componets/ui-elements/JudgeEventCard";

const JudgeManagement = () => {
  const [events, setEvents] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const [todaysEvents, setTodayEvents] = useState([]);
  const [tomorrowsEvents, setTommorowEvents] = useState([]);
  const [futuresEvents, setFutureEvents] = useState([]);
  const [pastsEvents, setPastEvents] = useState([]);

  const [showEvents, setShowEvents] = useState("all");

  const getAllEvent = async () => {
    try {
      const response = await makeApiCall("get", "event/all", null, "raw");
      console.log(response.data.data);
      const filterdAdmin = filterByProperty(
        response.data.data,
        "is_deleted",
        false
      );
      console.log(filterdAdmin);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const todayEvents = [];
      const tomorrowEvents = [];
      const futureEvents = [];
      const pastEvents = [];

      filterdAdmin.forEach((event) => {
        const [year, month, day] = event.event_date.split("-");
        const eventDate = new Date(year, month - 1, day);
        eventDate.setHours(0, 0, 0, 0); // set time to 00:00:00 for accurate comparison

        const timeDiff = eventDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // calculate difference in days

        if (diffDays === 0) {
          todayEvents.push(event);
        } else if (diffDays === 1) {
          tomorrowEvents.push(event);
        } else if (diffDays > 1) {
          futureEvents.push(event);
        } else if (diffDays < 0) {
          pastEvents.push(event);
        }
      });

      setTodayEvents(todayEvents);
      setTommorowEvents(tomorrowEvents);
      setFutureEvents(futureEvents);
      setPastEvents(pastEvents);
      setEvents(filterdAdmin);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllEvent();
  }, []);

  const sortedData =
    showEvents === "all"
      ? events
      : showEvents === "past"
      ? pastsEvents
      : showEvents === "today"
      ? todaysEvents
      : showEvents === "tommorow"
      ? tomorrowsEvents
      : futuresEvents
          ?.slice()
          .sort((a, b) => a.event_name.localeCompare(b.event_name));
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const searchData = sortedData?.filter((item) =>
    item.event_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="judgeManagement p-[20px] bg-white rounded-t-3xl md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
        <BsSearch />
        <input
          type="text"
          placeholder="Search event"
          className="h-full w-full ms-3 outline-none bg-gray-200"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex items-center flex-wrap justify-start gap-2 w-full mt-4">
        <button
          className={`${
            showEvents === "all" ? "bg-primary text-white " : "bg-gray-200"
          } px-4 py-2 rounded-md`}
          onClick={() => setShowEvents("all")}
        >
          All ({events?.length}){" "}
        </button>
        <button
          className={`${
            showEvents === "past" ? "bg-primary text-white " : "bg-gray-200"
          } px-4 py-2 rounded-md`}
          onClick={() => setShowEvents("past")}
        >
          Past ({pastsEvents?.length}){" "}
        </button>
        <button
          className={`${
            showEvents === "today" ? "bg-primary text-white " : "bg-gray-200"
          } px-4 py-2 rounded-md`}
          onClick={() => setShowEvents("today")}
        >
          Today ({todaysEvents?.length})
        </button>
        <button
          className={`${
            showEvents === "tommorow" ? "bg-primary text-white " : "bg-gray-200"
          } px-4 py-2 rounded-md`}
          onClick={() => setShowEvents("tommorow")}
        >
          Tommorow ({tomorrowsEvents?.length})
        </button>
        <button
          className={`${
            showEvents === "future" ? "bg-primary text-white " : "bg-gray-200"
          } px-4 py-2 rounded-md`}
          onClick={() => setShowEvents("future")}
        >
          Future ({futuresEvents?.length})
        </button>
      </div>
      <div className="w-full h-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-center mb-24">
        {searchData ? (
          searchData.length > 0 ? (
            searchData?.map((event, i) => {
              const formatedDate = formatDateToDDMMMYYYY(event.event_date);
              console.log(formatedDate);
              return (
                <Link
                  to={`/role/superadmin/judgedashboard/judgemanagement/alljudge`}
                  state={{ event: event._id }}
                  key={i}
                >
                  <JudgeEventCard
                    image={event.event_photo}
                    date={formatedDate}
                    time={event.event_time}
                    name={event.event_name}
                    location={event.event_location}
                  />
                </Link>
              );
            })
          ) : (
            <p className="text-xl font-medium text-center text-gray-400 mt-24">
              No Event Found
            </p>
          )
        ) : (
          <>
            <div className="h-[250px] w-full bg-gray-200 animate-pulse rounded-2xl mt-5"></div>
            <div className="h-[250px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
            <div className="h-[250px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default JudgeManagement;
