import React, { useEffect, useState, useRef } from "react";
import { makeApiCall } from "../../../api/Post";
import { useParams } from "react-router-dom";
import {
  filterByProperty,
  formatDateToYYYYMMDD,
} from "../../../utils/CommonFunctions";
import AccessPopup from "../../../componets/ui-elements/AccessPopup";
import UserTicketCard from "../../../componets/cards/UserTicketCard";
import { MaterialReactTable } from "material-react-table";
import Loader from "../../../componets/ui-elements/Loader";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Box } from "@mui/material";
import ImageModel from "../../../componets/ui-elements/ImageModel";

const UserTickets = () => {
  const params = useParams();

  const [ticketDataTable, setTicketDataTable] = useState([]);

  const [activeTickets, setActiveTickets] = useState();
  const [notActiveTickets, setNotActiveTickets] = useState();

  const [isActive, setIsActive] = useState(true);
  const [isImageModel, setIsImageModel] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedAllAccess, setSelectedAllAccess] = useState();
  const [isAllAccess, setIsAllAccess] = useState();

  const [accessPopup, setAcessPopup] = useState(false);
  const [accessGates, setAcessGates] = useState();
  const [accessZones, setAcessZones] = useState();
  const [accessCheckpoint, setAcessCheckpoint] = useState();
  const [specialAccessGates, setSpecialAcessGates] = useState();
  const [specialAccessZones, setSpecialAcessZones] = useState();
  const [specialAccessCheckpoint, setSpecialAcessCheckpoint] = useState();
  const [blockAccessGates, setBlockAcessGates] = useState();
  const [blockAccessZones, setBlockAcessZones] = useState();
  const [blockAccessCheckpoint, setBlockAcessCheckpoint] = useState();
  const [accessTicketId, setAccessTicketId] = useState();
  const [accessType, setAccessType] = useState();

  const [todaysTickets, setTodayTickets] = useState([]);
  const [tomorrowsTickets, setTommorowTickets] = useState([]);
  const [futuresTickets, setFutureTickets] = useState([]);
  const [pastsTickets, setPastTickets] = useState([]);

  const [showTickets, setShowTickets] = useState("all");
  const [showType, setShowType] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef();

  const fetchUser = async () => {
    const res = await makeApiCall(
      "post",
      "user/userdetails",
      {
        phone_number: params.number,
      },
      "raw"
    );
    console.log(res.data.data);
    if (res.data.status === 1) {


      const rawTickets = res.data.data.my_tickets;

      const ticketsTableData = rawTickets.map((ticket) => ({
        _id: ticket._id,
        isAllAccess: ticket.all_access,
        user_name: ticket.is_active ? ticket.ticket_user.name : "---",
        user_avatar: ticket.is_active ? ticket.ticket_user.profile_pic : null,
        gender: ticket.is_active ? ticket.ticket_user.gender : null,
        ticket_name: ticket.ticket_name,
        color_code: "#" + ticket.color_code?.slice(4),
        ticket_random_id: ticket.ticket_random_id,
        event_day: ticket.event.event_day,

        specialAccessGates: ticket.special_accessgates,
        specialAccessCheckpoint: ticket.special_accesscheckpoints,
        specialAccessZones: ticket.special_accesszones,

        blockGates: ticket.access_blockgates,
        blockCheckpoints: ticket.access_blockcheckpoints,
        blockZones: ticket.access_blockzones,

        is_used: ticket.is_used ? "TRUE" : "FALSE",
        is_active: ticket.is_active ? "TRUE" : "FALSE",

        gates: ticket.gates,
        zones: ticket.zones,
        checkpoints: ticket.checkpoints,

        purchase: ticket.complimanotry
          ? "Complimanotry"
          : ticket.is_privilege
          ? "Privilege"
          : ticket.is_salesteam
          ? "BookMyShow"
          : "Normal",
      }));

      setTicketDataTable(ticketsTableData);

      const activeT = filterByProperty(rawTickets, "is_active", true);
      const nonActiveT = filterByProperty(rawTickets, "is_active", false);

      const rawCurrentDate = new Date();
      const modifiedDate = formatDateToYYYYMMDD(rawCurrentDate);

      const ticketEvent = activeT.map((event) => event.event);

      const sortT = filterByProperty(ticketEvent, "event_date", modifiedDate);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const todayTickets = [];
      const tomorrowTickets = [];
      const futureTickets = [];
      const pastTickets = [];

      activeT.forEach((tickets) => {
        const [year, month, day] = tickets.event.event_date.split("-");
        const eventDate = new Date(year, month - 1, day);
        eventDate.setHours(0, 0, 0, 0); // set time to 00:00:00 for accurate comparison

        const timeDiff = eventDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // calculate difference in days

        if (diffDays === 0) {
          todayTickets.push(tickets);
        } else if (diffDays === 1) {
          tomorrowTickets.push(tickets);
        } else if (diffDays > 1) {
          futureTickets.push(tickets);
        } else if (diffDays < 0) {
          pastTickets.push(tickets);
        }
      });
      setTodayTickets(todayTickets);
      setTommorowTickets(tomorrowTickets);
      setFutureTickets(futureTickets);
      setPastTickets(pastTickets);

      setActiveTickets(activeT);
      setNotActiveTickets(nonActiveT);

      setTimeout(() => {
        let mainDiv = tableRef?.current?.childNodes[0];
        mainDiv.style.borderRadius = "30px";
        mainDiv.childNodes[0].style.borderRadius = "30px";
        mainDiv.childNodes[0].childNodes[1].style["flex-wrap"] = "wrap-reverse";
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleImageModelClose = () => {
    setIsImageModel(false);
  };

  const accessPopupClose = () => {
    setAcessPopup(false);
  };

  const accessPopupOpen = (options) => {
    const {
      gates,
      zones,
      checkpoints,
      specialGates,
      specialCheckpoints,
      specialZones,
      blockGates,
      blockCheckpoints,
      blockZones,
      type,
      ticketId,
    } = options;

    setBlockAcessGates(blockGates);
    setBlockAcessZones(blockZones);
    setBlockAcessCheckpoint(blockCheckpoints);

    setAcessGates(gates);
    setAcessZones(zones);
    setAcessCheckpoint(checkpoints);

    setSpecialAcessGates(specialGates);
    setSpecialAcessZones(specialZones);
    setSpecialAcessCheckpoint(specialCheckpoints);

    setAccessType(type);
    setAccessTicketId(ticketId);
    setAcessPopup(true);
  };

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

  const handleSpecialAccess = (options) => {
    const {
      gates,
      zones,
      checkpoints,
      specialGates,
      specialCheckpoints,
      specialZones,
      ticketId,
    } = options;

    // console.log(specialGates, "Special gates");
    // console.log(specialCheckpoints, "Special checkpoints");
    // console.log(specialZones, "Special zones");

    accessPopupOpen({
      gate: gates,
      zone: zones,
      checkpoint: checkpoints,
      specialGates: specialGates,
      specialCheckpoints: specialCheckpoints,
      specialZones: specialZones,
      type: 0,
      ticketId: ticketId,
    });
  };

  const handleCommonAccess = (options) => {
    const { gates, zones, checkpoints, ticketId } = options;

    accessPopupOpen({
      gates: gates,
      zones: zones,
      checkpoints: checkpoints,
      type: 1,
      ticketId: ticketId,
    });
  };

  const handleBlockAccess = (options) => {
    const {
      gates,
      zones,
      checkpoints,
      ticketId,
      blockGates,
      blockCheckpoints,
      blockZones,
    } = options;

    accessPopupOpen({
      gates: gates,
      zones: zones,
      checkpoints: checkpoints,
      blockGates: blockGates,
      blockCheckpoints: blockCheckpoints,
      blockZones: blockZones,
      type: 2,
      ticketId: ticketId,
    });
  };

  useEffect(() => {
    const data =
      showTickets === "today"
        ? todaysTickets
        : showTickets === "tommorow"
        ? tomorrowsTickets
        : showTickets === "future"
        ? futuresTickets
        : showTickets === "past"
        ? pastsTickets
        : activeTickets;
    setShowType(data);
  }, [todaysTickets, showTickets]);

  const columns = [
    {
      id: "user", //id used to define `group` column
      header: "User",
      columns: [
        {
          accessorFn: (row) => `${row.user_name}`, //accessorFn used to join multiple data into a single cell
          id: "profile_pic", //id is still required when using accessorFn instead of accessorKey
          header: "User",
          size: 150,
          Cell: ({ renderedCellValue, row }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {row.original.is_active === "TRUE" ? (
                <img
                  alt="avatar"
                  onClick={() => handleOpenModel(row.original.user_avatar)}
                  height={30}
                  src={row.original.user_avatar}
                  loading="lazy"
                  style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                  }}
                />
              ) : null}

              <span>{renderedCellValue}</span>
            </Box>
          ),
        },
      ],
    },
    {
      accessorKey: "gender",
      header: "Gender",
      size: 20,
    },
    {
      id: "ticket_name", //id used to define `group` column
      header: "Ticket Name",
      columns: [
        {
          header: "Ticket Name",
          Cell: ({ renderedCellValue, row }) => (
            <p
              style={{ backgroundColor: `${row.original.color_code}` }}
              className="py-1 rounded-full text-center text-white"
            >
              {row.original.ticket_name}
            </p>
          ),
        },
      ],
    },
    {
      accessorKey: "ticket_random_id",
      header: "Ticket Id",
      size: 50,
      enableClickToCopy: true,
    },
    {
      accessorKey: "event_day",
      header: "Event day",
      size: 50,
      enableClickToCopy: true,
    },
    {
      accessorKey: "is_used",
      header: "Check in",
      size: 20,
    },
    {
      accessorKey: "is_active",
      header: "Activated",
      size: 20,
    },
    {
      accessorKey: "purchase",
      header: "Purchase",
      size: 20,
    },
    {
      id: "action", //id used to define `group` column
      header: "Actions",
      columns: [
        {
          header: "Special Access",
          size: 150,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="primary-button px-2 py-1 text-white rounded-sm"
              onClick={() => {
                setSelectedAllAccess(row.original.isAllAccess);
                handleSpecialAccess({
                  gates: row.original.gates,
                  zones: row.original.zones,
                  checkpoints: row.original.checkpoints,
                  specialGates: row.original.specialAccessGates,
                  specialCheckpoints: row.original.specialAccessCheckpoint,
                  specialZones: row.original.specialAccessZones,
                  ticketId: row.original._id,
                });
              }}
            >
              Special access
            </button>
          ),
        },
        {
          header: "Common Access",
          size: 150,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="bg-black px-2 py-1 text-white rounded-sm"
              onClick={() =>
                handleCommonAccess({
                  gates: row.original.gates,
                  zones: row.original.zones,
                  checkpoints: row.original.checkpoints,
                  ticketId: row.original._id,
                })
              }
            >
              Common access
            </button>
          ),
        },
        {
          header: "Block",
          size: 50,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="text-red-500 px-2 py-1 border border-red-500 rounded-sm"
              onClick={() =>
                handleBlockAccess({
                  gates: row.original.gates,
                  zones: row.original.zones,
                  checkpoints: row.original.checkpoints,
                  ticketId: row.original._id,
                  blockGates: row.original.blockGates,
                  blockCheckpoints: row.original.blockGates,
                  blockZones: row.original.blockGates,
                })
              }
            >
              Block
            </button>
          ),
        },
      ],
    },
  ];




  return (
    <>
      {" "}
      {isImageModel ? (
        <ImageModel handleClose={handleImageModelClose} src={selectedImage} />
      ) : null}
      <div className="createGarbaClassSubmitSection flex flex-col gap-[20px] bg-white pt-4 m-1 h-auto rounded-3xl p-2 md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <p className="font-medium text-center text-2xl ">User tickets</p>
        <hr />
        <div className="w-full my-3 p-1 border border-gray-300 rounded-2xl md:hidden">
          <div className="flex items-center">
            <div className="relative flex item-center justify-between w-full gap-3  border-gray-300">
              <div
                className={`w-2/4 flex items-center justify-center text-[14px] h-[40px] rounded-xl text-center z-0 bg-primary absolute ${
                  isActive === false
                    ? " translate-x-full transition-all  "
                    : "translate-x-[0] transition-all "
                }`}
              ></div>
              <div
                className={`w-2/4 flex items-center justify-center text-[16px] h-[40px] rounded-xl z-50 text-center ${
                  isActive === true ? "text-white" : null
                }`}
                onClick={() => setIsActive(true)}
              >
                Active
              </div>
              <div
                className={`w-2/4 flex items-center justify-center text-[16px] h-[40px] rounded-xl z-50 text-center ${
                  isActive === true ? null : "text-white"
                }`}
                onClick={() => setIsActive(false)}
              >
                InActive
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap justify-start gap-2 w-full md:hidden">
          <button
            className={`${
              showTickets === "all" ? "bg-primary text-white " : "bg-gray-200"
            } px-4 py-2 rounded-md`}
            onClick={() => setShowTickets("all")}
          >
            All
          </button>
          <button
            className={`${
              showTickets === "past" ? "bg-primary text-white " : "bg-gray-200"
            } px-4 py-2 rounded-md`}
            onClick={() => setShowTickets("past")}
          >
            Past
          </button>
          <button
            className={`${
              showTickets === "today" ? "bg-primary text-white " : "bg-gray-200"
            } px-4 py-2 rounded-md`}
            onClick={() => setShowTickets("today")}
          >
            Today
          </button>
          <button
            className={`${
              showTickets === "tommorow"
                ? "bg-primary text-white "
                : "bg-gray-200"
            } px-4 py-2 rounded-md`}
            onClick={() => setShowTickets("tommorow")}
          >
            Tommorow
          </button>
          <button
            className={`${
              showTickets === "future"
                ? "bg-primary text-white "
                : "bg-gray-200"
            } px-4 py-2 rounded-md`}
            onClick={() => setShowTickets("future")}
          >
            Future
          </button>
        </div>

        <div className="flex flex-col gap-4 md:hidden">
          {isActive === true
            ? showType?.map((ticket, i) => {
                const colorCode = ticket?.color_code?.slice(4);
                return (
                  <UserTicketCard
                    key={ticket._id}
                    colorCode={colorCode}
                    name={ticket.ticket_name}
                    random_id={ticket.ticket_random_id}
                    is_used={ticket.is_used}
                    specialAccessFunc={() =>
                      handleSpecialAccess({
                        gates: ticket.gates,
                        zones: ticket.zones,
                        checkpoints: ticket.checkpoints,
                        specialGates: ticket.special_accessgates,
                        specialCheckpoints: ticket.special_accesscheckpoints,
                        specialZones: ticket.special_accesszones,
                        ticketId: ticket._id,
                      })
                    }
                    commonAccessFunc={() =>
                      handleCommonAccess({
                        gates: ticket.gates,
                        zones: ticket.zones,
                        checkpoints: ticket.checkpoints,
                        ticketId: ticket._id,
                      })
                    }
                    blockFunc={() =>
                      handleBlockAccess({
                        gates: ticket.gates,
                        zones: ticket.zones,
                        checkpoints: ticket.checkpoints,
                        ticketId: ticket._id,
                      })
                    }
                    is_active={ticket.is_active}
                    profile_pic={ticket.ticket_user?.profile_pic}
                    handleImageModelClose={handleImageModelClose}
                    isImageModel={isImageModel}
                    selectedImage={selectedImage}
                    handleOpenModel={handleOpenModel}
                    userName={ticket.ticket_user.name}
                  />
                );
              })
            : notActiveTickets?.map((ticket) => {
                const colorCode = ticket?.color_code?.slice(4);
                return (
                  <UserTicketCard
                    key={ticket._id}
                    colorCode={colorCode}
                    name={ticket.ticket_name}
                    random_id={ticket.ticket_random_id}
                    specialAccessFunc={() =>
                      handleSpecialAccess({
                        gates: ticket.gates,
                        zones: ticket.zones,
                        checkpoints: ticket.checkpoints,
                        specialGates: ticket.special_accessgates,
                        specialCheckpoints: ticket.special_accesscheckpoints,
                        specialZones: ticket.special_accesszones,
                        ticketId: ticket._id,
                      })
                    }
                    commonAccessFunc={() =>
                      handleCommonAccess({
                        gates: ticket.gates,
                        zones: ticket.zones,
                        checkpoints: ticket.checkpoints,
                        ticketId: ticket._id,
                      })
                    }
                    blockFunc={() =>
                      handleBlockAccess({
                        gates: ticket.gates,
                        zones: ticket.zones,
                        checkpoints: ticket.checkpoints,
                        ticketId: ticket._id,
                      })
                    }
                    is_active={ticket.is_active}
                    profile_pic={ticket.ticket_user?.profile_pic}
                    handleImageModelClose={handleImageModelClose}
                    isImageModel={isImageModel}
                    selectedImage={selectedImage}
                    handleOpenModel={handleOpenModel}
                  />
                );
              })}
        </div>
        <div ref={tableRef} className="hidden md:block ">
          <MaterialReactTable
            style={{ margin: "20px" }}
            columns={columns}
            data={ticketDataTable || []}
            positionToolbarAlertBanner="bottom"
          />
        </div>
        <div className="h-14"></div>
      </div>
      {accessPopup ? (
        <AccessPopup
          type={accessType}
          handleClose={accessPopupClose}
          propGates={accessGates}
          propCheckpoints={accessCheckpoint}
          propZones={accessZones}
          specialAccessGates={specialAccessGates}
          specialAccessCheckpoint={specialAccessCheckpoint}
          specialAccessZones={specialAccessZones}
          blockAccessGates={blockAccessGates}
          blockAccessCheckpoints={blockAccessCheckpoint}
          blockAccessZones={blockAccessZones}
          accessTicketId={accessTicketId}
          reloadFunc={fetchUser}
          popCloseFunc={() => setAcessPopup(false)}
          usertype={"ticket"}
          allAccess={selectedAllAccess}
        />
      ) : null}
      <>{loading ? <Loader /> : null}</>
    </>
  );
};

export default UserTickets;
