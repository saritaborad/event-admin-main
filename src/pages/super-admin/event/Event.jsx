import AddButton from "../../../componets/ui-elements/AddButton";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import EventCard from "../../../componets/ui-elements/EventCard";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import Loader from "../../../componets/ui-elements/Loader";
import {
  filterByProperty,
  formatDateToDDMMMYYYY,
} from "../../../utils/CommonFunctions";

const Event = () => {
  const [events, setEvents] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [todaysEvents, setTodayEvents] = useState([]);
  const [tomorrowsEvents, setTommorowEvents] = useState([]);
  const [futuresEvents, setFutureEvents] = useState([]);
  const [pastsEvents, setPastEvents] = useState([]);

  const [showEvents, setShowEvents] = useState("all");

  const getAllEvents = async () => {
    try {
      const response = await makeApiCall("get", "event/all", null, "raw");

      const rawEvents = response.data.data;
      const filterEvents = filterByProperty(rawEvents, "is_deleted", false);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // set time to 00:00:00 for accurate comparison

      const todayEvents = [];
      const tomorrowEvents = [];
      const futureEvents = [];
      const pastEvents = [];

      filterEvents.forEach((event) => {
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
      setEvents(filterEvents);
    } catch (error) {
      console.error(error);
    }
  };

  const action = "Sign Up";

  useEffect(() => {
    getAllEvents();
  }, []);

  const eventDuplicate = async (id) => {
    setLoading(true);

    const params = {
      event_id: id,
    };

    try {
      const response = await makeApiCall(
        "post",
        "event/duplicate",
        params,
        "raw"
      );
      console.log(response);
      if (response.data.status === 1) {
        setLoading(false);
        location.reload();
      } else {
        setLoading(false);
        console.log(response.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.response);
    }
  };

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

  console.log(futuresEvents);

  return (
    <>
      <div className="h-full">{loading ? <Loader /> : null}</div>

      {action === "Sign Up" ? (
        <div></div>
      ) : (
        <div>
          Lost Password ?<span>Click Here!</span>{" "}
        </div>
      )}

      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <AddButton title={"Event"} link={"/role/superadmin/event/add-new"} />
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
        <div className="flex items-center flex-wrap justify-start gap-2 w-full">
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
              showEvents === "tommorow"
                ? "bg-primary text-white "
                : "bg-gray-200"
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
                  <EventCard
                    key={i}
                    image={event.event_photo}
                    date={formatedDate}
                    time={event.event_time}
                    name={event.event_name}
                    location={event.event_location}
                    leftday={""}
                    handleClick={() =>
                      navigate(`/role/superadmin/event/${event._id}`)
                    }
                    handleDuplicate={() => eventDuplicate(event._id)}
                  />
                  // console.log(event)
                );
              })
            ) : (
              <p className="text-xl text-center font-medium text-gray-400 mt-24">
                No Event Found
              </p>
            )
          ) : (
            <>
              <div className="h-[309px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[309px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[309px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Event;
