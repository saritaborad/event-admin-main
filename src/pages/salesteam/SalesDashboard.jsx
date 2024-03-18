import React, { useState, useEffect, useRef } from "react";
import { makeApiCall } from "../../api/Post";
import { useQuery } from "react-query";
import blank_user from "../../assets/blank_user.svg";
import { Link, useNavigate } from "react-router-dom";
import {
  BsBellFill,
  BsSearch,
  BsBell,
  BsBoxArrowInUpRight,
  BsTicketPerforatedFill,
  BsFillCheckCircleFill,
} from "react-icons/bs";
import { GoAlertFill } from "react-icons/go";
import { MdKeyboardArrowDown } from "react-icons/md";
import JudgeEventCard from "../../componets/ui-elements/JudgeEventCard";
import {
  filterByProperty,
  capitalizeWords,
  formatDateToDDMMMYYYY,
  handleLogout,
} from "../../utils/CommonFunctions";
import NoDataFound from "../../componets/NoDataFound";
import logo from "../../assets/newLogo.svg";
import black_user from "../../assets/blank_user.svg";
import { MaterialReactTable } from "material-react-table";
 
const SalesDashboard = () => {
  const tableRef = useRef();
  const [userDetails, setUserDetails] = useState();

  const [event, setEvent] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [transferTicketData, setTransferTicketData] = useState([]);
  const [totalQTY, setTotalQTY] = useState();
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await makeApiCall("get", "user/info/", null, "raw");
    return response;
  };

  const { isLoading, error, data } = useQuery("classOwnerData", fetchData);

  const transferTicket = async () => {
    try {
      const resTicket = await makeApiCall(
        "get",
        "ticketcategory/transferticket",
        null,
        "row"
      );
      console.log(resTicket);
      if (resTicket.data.status === 1) {
        const filterTicket = resTicket.data.data;

        const qtyData = filterTicket.map((qty) => qty.qty);
        const qtySum = qtyData.reduce((partialSum, a) => partialSum + a, 0);
        setTotalQTY(qtySum);

        const reverseTicketData = [...resTicket.data.data].reverse();

        const ticketTableData = reverseTicketData.map((ticket) => ({
          _id: ticket._id,
          name: ticket?.user?.name,
          phone_number: ticket?.user?.phone_number,
          event_name:
            ticket?.event?.event_name + " - Day : " + ticket?.event?.event_day,
          last_modified: formatDateToDDMMMYYYY(ticket?.createdAt),
          tickets: ticket.ticket_name,
          qty: ticket.qty,
          price: ticket.price,
          ticket_status: ticket?.by_cash === true ? "Cash" : "Bookmyshow",
          ticket_color: ticket?.color_code.slice(4),
        }));

        setTransferTicketData(ticketTableData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      size: 50,
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
      size: 30,
    },
    {
      accessorKey: "event_name",
      header: "Event Name",
      size: 50,
    },
    {
      accessorKey: "last_modified",
      header: "	Last Modified",
      size: 30,
    },
    {
      id: "ticket",
      columns: [
        {
          header: "Tickets",
          size: 100,
          Cell: ({ renderedCellValue, row }) => (
            <p
              className="text-white text-center px-2 py-2 rounded-md"
              style={{ backgroundColor: `#${row.original.ticket_color}` }}
            >
              {row.original.tickets}
            </p>
          ),
        },
      ],
    },

    {
      accessorKey: "qty",
      header: "QTY",
      size: 30,
    },
    {
      accessorKey: "price",
      header: "Price	",
      size: 30,
    },
    {
      accessorKey: "ticket_status",
      header: "Ticket Status",
      size: 50,
    },
  ];

  useEffect(() => {
    transferTicket();
    if (isLoading === false) {
      setUserDetails(data.data.data);
    }
  }, [isLoading]);

  // console.log(event);
  console.log(transferTicketData);

  return (
    <div className="salesTeamDashboard h-full bg-[#F2F2F2] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="shadow-md bg-white px-10 py-4 h-auto items-center flex justify-between w-full rounded-lg">
        <div className="logo">
          <img src={logo} alt="image" />
        </div>

        <div className="info flex items-center gap-3  xs:gap-1 sm:gap-3">
          <BsSearch className="mx-3 text-gray-500" />

          <BsBell className="text-lg mx-3 text-gray-500" />

          <div className="avtar flex items-center justify-center overflow-hidden h-9 w-9 rounded-full">
            <img
              src={
                userDetails?.profile_pic ? userDetails?.profile_pic : blank_user
              }
              alt="image"
              className={`h-full ${
                userDetails?.profile_pic ? null : "animate-pulse"
              }`}
            />
          </div>
          <div className="name">
            {userDetails ? (
              <h1 className="text-lg text-black font-medium ">
                {userDetails?.name}
              </h1>
            ) : (
              <div className="h-[28px] bg-gray-200 rounded-md w-[70px] animate-pulse"></div>
            )}
          </div>

          <MdKeyboardArrowDown
            className={`text-2xl text-gray-500 cursor-pointer ${
              showMenu === true ? "-rotate-90" : "rotate-0"
            }`}
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu === true ? (
            <div className="logout bg-gray-200 p-2 rounded-lg absolute top-16 right-7">
              <p
                className="bg-primary text-white px-5 py-1 rounded-lg cursor-pointer"
                onClick={() => handleLogout(navigate("/login"))}
              >
                Logout
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="ticket p-10 h-full ">
        <div className="nameAndTicket bg-[#C4242B] px-14 py-7 rounded-3xl flex items-center xs:flex-col md:flex-row">
          <div className="name">
            <h1 className="text-2xl font-medium text-white">
              Hello, {userDetails?.name}
            </h1>
            <p className="text-white text-sm my-3">
              Ready To Start Your Day With Some Pitch Deks?
            </p>
          </div>
          <div className="bg-white ms-auto rounded-xl xs:ms-0 md:ms-auto">
            <Link to="/role/salesteam/transferticket">
              <button className="custom-button p-3 text-primary flex items-center font-medium ">
                <BsBoxArrowInUpRight className="mx-2 text-lg" /> New Transfer
                Ticket
              </button>
            </Link>
          </div>
        </div>

        <div className="data my-10 flex items-center w-full gap-7 xs:flex-col sm:flex-col md:flex-col lg:flex-row">
          <div className="totalTicket flex items-center bg-white rounded-2xl p-4 w-full">
            <div className="icone bg-[#E0E9FF] p-3 rounded-lg">
              <BsTicketPerforatedFill className="text-3xl text-[#325BC5]" />
            </div>
            <div className="number ms-4">
              <h1 className="text-4xl text-[#325BC5] font-semibold">
                {totalQTY}
              </h1>
              <p className="text-sm text-gray-400 mt-1">Total Of Ticket</p>
            </div>
          </div>

          <div className="totalTicket flex items-center bg-white rounded-2xl p-4 w-full">
            <div className="icone bg-[#FEE9EA] p-3 rounded-lg">
              <GoAlertFill className="text-3xl text-[#C4242B]" />
            </div>
            <div className="number ms-4">
              <h1 className="text-4xl text-[#C4242B] font-semibold">15</h1>
              <p className="text-sm text-gray-400 mt-1">
                Total Of Failed Tickets
              </p>
            </div>
          </div>

          <div className="totalTicket flex items-center bg-white rounded-2xl p-4 w-full">
            <div className="icone bg-[#D8EECE] p-3 rounded-lg">
              <BsFillCheckCircleFill className="text-3xl text-[#4DBF17]" />
            </div>
            <div className="number ms-4">
              <h1 className="text-4xl text-[#696969] font-semibold">
                {transferTicketData.length}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Total Of Transferred Tickets
              </p>
            </div>
          </div>
        </div>

        <div className="transferTicket my-3">
          <p className="text-lg font-medium">Recent Transfer Tickets</p>
        </div>

        <div className="h-auto m-[2px] bg-white rounded-[30px] flex flex-col gap-[20px] md:h-screen md:rounded-none md:m-0">
          <div ref={tableRef} className="">
            <MaterialReactTable
              style={{ margin: "20px" }}
              columns={columns}
              data={transferTicketData}
              positionToolbarAlertBanner="bottom"
              enableStickyFooter={true}
              enableStickyHeader={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
