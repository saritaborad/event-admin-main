import React, { useEffect, useState } from "react";
import { dashBordData } from "../../utils/dashBordData";
import { Link, useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../api/Post";
import { useQuery } from "react-query";
import { BsBellFill, BsSearch } from "react-icons/bs";
import blank_user from "../../assets/blank_user.svg";
import BotttmNavbar from "../../componets/BotttmNavbar";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { MdCurrencyRupee, MdEmojiEvents } from "react-icons/md";
import { BsFillPersonFill, BsFillCreditCardFill } from "react-icons/bs";
import CountUp from "react-countup";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const superAdmin = () => {
  const now = new Date();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [userschartData, setUsersChartData] = useState(null);
  const [PlayerPasschartData, setPlayerPassChartData] = useState();
  const [eventData, setEventData] = useState([]);
  const [event, setEvent] = useState();
  const [totalUser, setTotalUser] = useState();
  const [totalGarba, setTotalGarba] = useState();
  const [ticketDetails, setTicketDetails] = useState({});
  const [ticketnameDetails, setTicketnameDetails] = useState({});
  const sources = [
    "bookMyShow",
    "cash",
    "complimantory",
    "salesteam",
    "success",
  ];
  // If the current time is before 6 AM, consider the previous day as the event date
  if (now.getHours() < 6) {
    now.setDate(now.getDate() - 1);
  }

  const currentDate = now.toISOString().split("T")[0]; // This will give you a date in the format "YYYY-MM-DD"

  const fetchAllEventData = async () => {
    console.log("fire --->>>>>>>");
    const response = await makeApiCall("get", "event/all", null, "raw");
    const ticketcategoryresponse = await makeApiCall(
      "get",
      "ticketcategory/all",
      null,
      "raw"
    );
    setTicketnameDetails(
      // ticketcategoryresponse.data.tickets.map((item) => item.ticket_name).sort()
      ticketcategoryresponse.data.tickets
    );

    if (response?.data?.status === 1) {
      setEventData(response.data.data);
      setSelectedEvent(
        response.data.data.find((event) => event.event_date === currentDate) ||
          response.data.data[0]?._id
      );
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      handleStatus(selectedEvent);
    }
  }, [selectedEvent]);

  const handleStatus = (selectedEventid) => {

    console.log(selectedEventid)

    const bookmyshow =
      event?.bookmyshow?.find((b) => b.eventDetails._id === selectedEventid)
        ?.ticketDetails || [];
    const cash =
      event?.cash?.find((c) => c.eventDetails._id === selectedEventid)
        ?.ticketDetails || [];
    const complimantory =
      event?.complimantory?.find((c) => c.eventDetails._id === selectedEventid)
        ?.ticketDetails || [];
    const salesteam =
      event?.salesteam?.find((s) => s.eventDetails._id === selectedEventid)
        ?.ticketDetails || [];
    const success =
      event?.success?.find((s) => s.eventDetails._id === selectedEventid)
        ?.ticketDetails || [];
    const data = {
      bookmyshow,
      cash,
      complimantory,
      salesteam,
      success,
    };
    setTicketDetails(data);
  };

  const dummyData = [
    {
      id: 3,
      title: "Total User",
      price: totalUser,
      icon: <BsFillPersonFill />,
      time: "Feb - Apr, 2023",
    },
    {
      id: 4,
      title: "Total Garba Class",
      price: totalGarba,
      icon: <MdEmojiEvents />,
      time: "Jan - Apr, 2023",
    },
  ];

  const handleNavigate = (path) => {
    navigate("/role/superadmin" + path);
  };

  const fetchData = async () => {
    const response = await makeApiCall("get", "user/info/", null, "raw");
    return response;
  };

  const garbaclassinfo = async (classID) => {
    const response = await makeApiCall(
      "get",
      "garbaclass/info/" + classID,
      null,
      "raw"
    );

    const male = response.data.data.branch_list[0].student_list.filter(
      (item) => item.gender == "male"
    ).length;
    const female = response.data.data.branch_list[0].student_list.filter(
      (item) => item.gender == "female"
    ).length;
    const activeStudentCounts =
      response.data.data.branch_list[0].student_list.filter(
        (item) => item.pass_list?.is_completed == true
      ).length;

    return {
      male: male,
      female: female,
      activeStudentCounts: activeStudentCounts,
    };
  };

  const allstatus = async () => {
    const ticketsresponse = await makeApiCall(
      "get",
      "ticketcategory/statics",
      null,
      "raw"
    );

    setEvent(ticketsresponse.data.data);

    const allUsersResponse = await makeApiCall(
      "get",
      "user/allusers",
      null,
      "raw"
    );

    setTotalUser(allUsersResponse.data.data.length);

    // Create an object to store unique roles and their counts
    const uniqueRolesCount = {};

    // Iterate through the dataset and count unique roles
    allUsersResponse.data.data.forEach((user) => {
      const roles = user.roles; // Replace 'roles' with the actual field name
      if (roles) {
        if (!uniqueRolesCount[roles]) {
          uniqueRolesCount[roles] = 1;
        } else {
          uniqueRolesCount[roles]++;
        }
      }
    });

    // Extract unique user labels and their counts
    const labels = Object.keys(uniqueRolesCount);
    const data = Object.values(uniqueRolesCount);

    // Create the chart data
    const chartData = {
      labels,
      datasets: [
        {
          label: "User Counts",
          data,
        },
      ],
    };

    setUsersChartData(chartData);

    const allGarbaGarbaResponse = await makeApiCall(
      "get",
      "/garbaclass/all",
      null,
      "raw"
    );
    const garba_classes = allGarbaGarbaResponse.data.data;
    setTotalGarba(allGarbaGarbaResponse.data.data.length);

    if (garba_classes) {
      const studentCounts = garba_classes.map(
        (garba) => garba.branch_list[0].student_list.length
      );

      const students = await Promise.all(
        garba_classes.map(async (garba) => await garbaclassinfo(garba._id))
      );

      const PasschartData = {
        labels: garba_classes.map((garba) => garba.garba_classname),
        datasets: [
          {
            label: "Total Student",
            data: studentCounts,
            borderColor: "rgb(255,0,255)",
            backgroundColor: "rgb(255,0,255, 0.5)",
          },
          {
            label: "Active Student",
            data: students.map((student) => student.activeStudentCounts),
            borderColor: "rgb(50,205,50)",
            backgroundColor: "rgb(50,205,50,0.5)",
          },
          {
            label: "Male Student",
            data: students.map((student) => student.male),
            borderColor: "rgb(0,191,255)",
            backgroundColor: "rgb(0,191,255,0.5)",
          },
          {
            label: "Female Student",
            data: students.map((student) => student.female),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };

      setPlayerPassChartData(PasschartData);
    }
  };

  const { isLoading, error, data } = useQuery("classOwnerData", fetchData);

  useEffect(() => {
    // Define the function you want to run
    const fetchData = () => {
      if (isLoading === false) {
        setUserDetails(data.data.data);
      }
      allstatus();
    };

    // Run the function immediately upon mounting
    fetchData();

    // Set up the interval to run the function every 2:30 minutes
    const intervalId = setInterval(fetchData, 150000); // 150000ms = 2.5 minutes

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [isLoading]);

  useEffect(() => {
    if (event) {
      console.log("fire---------> ");
      fetchAllEventData();
    }
  }, [event]);

  const sortedData = dashBordData
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchData = sortedData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchGuardStatics = async () => {
    const resp = await makeApiCall("get", "guard/statics", null, "raw");
    console.log(resp);
    if (resp.data.status === 1) {
      const rawData = resp.data.data;

      // const all = Object.values(rawData).map((zones)=>{
      //   zones.map((item)=>console.log( zones.find((el)=>console.log(el.status===item.status?"repete":item.status))))
      // })

      const allStatuses = Object.values(rawData).flatMap((zoneData) =>
        zoneData.map((item) => item.status)
      );
      const uniqueStatuses = [...new Set(allStatuses)];
      console.log(uniqueStatuses);
      console.log(resp.data.data);
    }
  };
  useEffect(() => {
    fetchGuardStatics();
  }, []);

  return (
    <>
      <div className="adminPanel h-auto w-full md:h-screen md:overflow-y-auto md:m-0 ">
        <div className="shadow-md bg-white px-6 py-4 h-auto items-center flex justify-between w-full md:my-4 md:rounded-lg">
          <div className="flex items-center gap-4 w-full">
            <div className="avtar flex items-center justify-center overflow-hidden h-14 w-14 rounded-full ">
              <img
                src={
                  userDetails?.profile_pic
                    ? userDetails.profile_pic
                    : blank_user
                }
                alt="image"
                className={` ${
                  userDetails?.profile_pic ? null : "animate-pulse"
                }`}
              />
            </div>
            <div>
              {userDetails ? (
                <h1 className="text-lg text-black font-semibold ">
                  {userDetails.name}
                </h1>
              ) : (
                <div className="h-[28px] bg-gray-200 rounded-sm w-full animate-pulse"></div>
              )}
              {userDetails ? (
                <h1 className="text-sm text-gray-500 font-light capitalize">
                  {userDetails.roles}
                </h1>
              ) : (
                <div className="h-[28px] bg-gray-200 rounded-sm w-full animate-pulse"></div>
              )}
            </div>
          </div>

          <Link to="/role/superadmin/notification-page">
            <div className="h-10 w-10 bg-black flex items-center justify-center rounded-full shadow-sm relative">
              <BsBellFill className="text-white text-xl" />
              {userDetails?.notifications.length > 0 ? (
                <div className="bg-primary absolute h-4 w-4 rounded-full top-[-5px] right-0 flex items-center justify-center text-[10px] text-white">
                  {userDetails?.notifications.length}
                </div>
              ) : null}
            </div>
          </Link>
        </div>


        <div className="bg-menu md:hidden">
          <div className="adminData mx-3 py-5">
            <div className="w-full p-4 rounded-xl bg-white flex items-center justify-start gap-4">
              <BsSearch />
              <input
                type="text"
                placeholder="Search item"
                className="h-full w-full outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="dashboardText pt-5 ms-2">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>
            <div className="grid grid-cols-2 mb-24 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {searchData?.map((data, i) => {
                return (
                  <div
                    className="bg-white p-4 rounded-2xl mt-5 mx-2 h-40"
                    style={{ boxShadow: "0px 0px 20px #0000001b" }}
                    key={i}
                    onClick={() => handleNavigate(data.path)}
                  >
                    <div className="garbaImage bg-gray-200 rounded-2xl w-[70px] h-14 flex justify-center items-center p-3">
                      {<data.image className="text-3xl text-primary" />}
                    </div>
                    <div className="garbaText mt-3">
                      <h1 className="text-lg font-semibold">{data.title}</h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* start from here */}
        <div className="hidden md:block w-full py-5 space-y-6">
          <div className="grid grid-cols-4 gap-4 px-2">
            {dummyData.map((data) => (
              <Card
                title={data.title}
                icon={data.icon}
                price={data.price}
                time={data.time}
              />
            ))}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg text-white mx-4">
            <h1 className="text-2xl font-semibold">Event Ticket Sales</h1>
            <select
              className="selectEvent bg-gray-700 text-white rounded-lg p-2 outline-none cursor-pointer"
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option value="">Select an Event</option>
              {eventData.length &&
                eventData.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.event_name + " - DAY" + event.event_day}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-span-3 bg-white p-4 rounded-lg shadow-md">
            {selectedEvent && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2">Ticket Details</th>
                    {ticketnameDetails.map((ticket) => (
                      <th key={ticket._id} className="py-2">
                        {ticket.ticket_name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sources.map((source, index) => (
                    <tr
                      key={source}
                      className={
                        index % 2 === 0
                          ? "bg-gray-100"
                          : "bg-white hover:bg-gray-100"
                      }
                    >
                      <td className="py-2 px-4 border">{source}</td>
                      {ticketnameDetails.map((ticket) => {

                        console.log(ticket)
                        console.log(ticketDetails["bookmyshow"] ,"<===")

                        const qty =
                          ticketDetails?.[source]?.find(
                            (t) => t.ticket_name === ticket.ticket_name
                          )?.ticket_sell || 0;

                        return (
                          <td
                            key={ticket._id}
                            className="py-2 px-4 text-center border"
                          >
                            <CountUp start={0} end={qty} duration={1} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 px-3 mb-24">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h1 className="text-lg font-semibold mb-4">User Data</h1>
              {userschartData ? (
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="py-2 border-b">User</th>
                      <th className="py-2 border-b">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userschartData.labels.map((label, index) => (
                      <tr
                        key={label}
                        className={index % 2 === 0 ? "bg-gray-100" : ""}
                      >
                        <td className="py-2 px-4">{label}</td>
                        <td className="py-2 px-4 text-center">
                          {userschartData.datasets[0].data[index]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-[500px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                  {/* ... your SVG loading animation ... */}
                </div>
              )}
            </div>

            <div className="garbaClass row-span-2 p-4 col-span-2 w-full">
              <h1 className="text-lg font-semibold mb-4">Garba Class Data</h1>
              {PlayerPasschartData ? (
                PlayerPasschartData && (
                  <div
                    className="max-w-screen-lg mx-auto p-2 rounded-lg"
                    style={{ boxShadow: "0px 0px 20px #0000001b" }}
                  >
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead>
                        <tr>
                          <th className="py-2">Garba Class</th>
                          {PlayerPasschartData.datasets.map(
                            (dataset, index) => (
                              <th key={index} className="py-2">
                                {dataset.label}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {PlayerPasschartData.labels.map((label, index) => (
                          <tr
                            key={label}
                            className={index % 2 === 0 ? "bg-gray-100" : ""}
                          >
                            <td className="py-2 px-4">{label}</td>
                            {PlayerPasschartData.datasets.map(
                              (dataset, idx) => (
                                <td
                                  key={idx}
                                  className="py-2 px-4 text-center"
                                  style={{
                                    // backgroundColor: dataset.backgroundColor,
                                    borderColor: dataset.borderColor,
                                  }}
                                >
                                  {dataset.data[index]}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="h-[450px] w-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    className="inline w-14 h-14 mr-2 text-primary animate-spin dark:text-primary fill-gray-400 dark:fill-gray-400"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-24"></div>
      </div>
      <BotttmNavbar />
    </>
  );
};

export default superAdmin;

const Card = ({ title, price, time, icon }) => {
  return (
    <div
      className="w-full flex p-4 items-center justify-between max-h-40 h-auto bg-white rounded-md"
      style={{ boxShadow: "0px 0px 20px #0000001b" }}
    >
      <div className="h-20 w-20 rounded-full bg-black flex items-center justify-center text-white text-4xl">
        {icon}
      </div>
      <div className="flex flex-col items-end justify-center">
        <p className="text-[16px] capitalize">{title}</p>
        <p className="text-[28px] font-semibold">{price}</p>
        <p className="text-[15px] capitalize">{time}</p>
      </div>
    </div>
  );
};
