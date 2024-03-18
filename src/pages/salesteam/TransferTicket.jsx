import React, { useState, useEffect } from "react";
import { makeApiCall } from "../../api/Post";
import { useQuery } from "react-query";
import blank_user from "../../assets/blank_user.svg";
import { Link, useNavigate } from "react-router-dom";
import {
  BsArrowLeft,
  BsSearch,
  BsBell,
  BsPlusLg,
  BsCheckCircleFill,
} from "react-icons/bs";
import { MdKeyboardArrowDown, MdClose } from "react-icons/md";
import JudgeEventCard from "../../componets/ui-elements/JudgeEventCard";
import {
  filterByProperty,
  formatDateToDDMMMYYYY,
  handleLogout,
} from "../../utils/CommonFunctions";
import ticket_Image from "../../assets/ticket.svg";
import Select from "react-select";
import Alert from "../../componets/ui-elements/Alert";
import makeAnimated from "react-select/animated";
import Loader from "../../componets/ui-elements/Loader";

const TransferTicket = () => {
  const [userDetails, setUserDetails] = useState();
  const [event, setEvent] = useState();
  const [eventData, setEventData] = useState();
  const [todayEventData, setTodayEventData] = useState();
  const [addTicket, setAddTicket] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [phoneNo, setPhoneNo] = useState();
  const [remark, setRemark] = useState();
  const [userName, setUserName] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [eventTicket, setEventTicket] = useState();

  const [searchQuery, setSearchQuery] = useState();
  const [isLoadingPopup, setIsLoadingPopup] = useState(false);
  const [userInfo, setUserInfo] = useState();

  const [ticketQtY, setTicketQTY] = useState(0);
  const [ticketData, setTicketData] = useState([]);
  const [showTicket, setShowTicket] = useState();
  const [ticketTotal, setTicketTotal] = useState(0);
  const [ticketMenu, setTicketMenu] = useState(false);
  const [transferTicket, setTransferTicket] = useState(false);
  const [cash, setCash] = useState(true);
  const [isNotExist, setIsNotExist] = useState(false);

  const fetchData = async () => {
    const response = await makeApiCall("get", "user/info/", null, "raw");
    return response;
  };

  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery("classOwnerData", fetchData);

  const animatedComponents = makeAnimated();

  const getAllEvent = async () => {
    try {
      const response = await makeApiCall("get", "event/all", null, "raw");
      if (response.data.status === 1) {
        const rawEvents = response.data.data;
        const filterEvents = filterByProperty(rawEvents, "is_deleted", false);

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // set time to 00:00:00 for accurate comparison

        const todayEvents = [];

        filterEvents.forEach((event) => {
          const [year, month, day] = event.event_date.split("-");
          const eventDate = new Date(year, month - 1, day);
          eventDate.setHours(0, 0, 0, 0); // set time to 00:00:00 for accurate comparison

          const timeDiff = eventDate.getTime() - currentDate.getTime();
          const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // calculate difference in days

          if (diffDays === 0) {
            todayEvents.push(event);
          }
        });
        const eventSelectData = todayEvents.map((event) => ({
          value: event._id,
          label: event.event_name,
        }));
        setTodayEventData(eventSelectData);
        handleEventSelect(eventSelectData[0]);
        const eventOption = filterEvents?.map((event) => ({
          value: event._id,
          label: event.event_name + " - Day : " + event.event_day,
        }));

        setEventData(eventOption);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllEvent();
    if (isLoading === false) {
      setUserDetails(data.data.data);
    }
  }, [isLoading]);

  const handleEventSelect = async (e) => {
    const response = await makeApiCall(
      "get",
      `event/info/${e.value ? e.value : todayEventData.value}`,
      null,
      "raw"
    );
    if (response.data.status === 1) {
      setEvent(response.data.data);
      setEventTicket(response.data.data.ticketcategorys);
    }
  };

  const findUser = async (searchQuery) => {
    if (searchQuery.length === 10) {
      setIsLoadingPopup(true);
      try {
        const response = await makeApiCall(
          "post",
          "user/userdetails",
          {
            phone_number: searchQuery,
          },
          "raw"
        );
        console.log("data", response);
        if (response.data.status === 1) {
          setUserInfo(response.data.data);
          setIsLoadingPopup(false);
          setIsNotExist(false);
        } else if (response.data.status === 10) {
          console.log(response);
          // handleLogOut();
          setIsLoadingPopup(false);
          setIsNotExist(false);
        } else if (response.data.status === 0) {
          setIsNotExist(true);
          // setIsAlert(true);
          // setErrorMsg(response.data.message);
          // setStatus("error");
          setIsLoadingPopup(false);
        }
      } catch (error) {
        setIsLoadingPopup(false);
        console.error(error);
      }
    }
  };

  const handleNumberChange = (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric characters
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    // Limit the number to 10 digits
    if (numericValue.length <= 10) {
      setSearchQuery(numericValue);
      findUser(numericValue);
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");

    const params = {
      phone_number: searchQuery,
      event_id: event._id,
      remark: remark ? remark : "remark",
      ticketcategorys: ticketData,
      total: ticketTotal,
      by_cash: cash,
      ...(isNotExist ? { name: userName } : {}),
    };
    console.log("PostData", params);

    try {
      const response = await makeApiCall(
        "post",
        "user/bookmyshow",
        params,
        "raw"
      );
      console.log(response);
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
        // setMaxDiscount(null);
        setTransferTicket(true);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
        // setTransferTicket(false);
      }
    } catch (error) {
      console.warn(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const handleClick = () => {
    console.log(ticketData);
    setIsAlert(true);
    setStatus("start");
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    // setTransferTicket(true)
    console.log("ok");
    navigate("/role/salesteam");
  };

  function handleQuantityChange(ticketId, quantity, price) {
    // Check if the ticket already exists in the orderDetails array
    const existingTicketIndex = ticketData.findIndex(
      (order) => order._id === ticketId
    );

    if (existingTicketIndex !== -1) {
      // If the ticket exists, update its quantity
      const updatedOrderDetails = [...ticketData];
      updatedOrderDetails[existingTicketIndex].qty = quantity;
      setTicketData(updatedOrderDetails);
    } else {
      // If the ticket doesn't exist, add a new entry
      setTicketData([...ticketData, { _id: ticketId, qty: quantity, price }]);
    }
  }

  return (
    <>
      {isAlert ? (
        <Alert
          isOpen={isAlert}
          title="Are you sure?"
          text="You won't be able to revert this!"
          confirmButtonText="Submit"
          cancelButtonText="Cancel"
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          status={status}
          confirmText={successMsg}
          errorText={errorMsg}
          onComplete={handleComplete}
        />
      ) : null}
      {isLoadingPopup ? <Loader /> : null}
      <div className=" h-full bg-[#F2F2F2] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="shadow-md bg-white px-10 py-4 h-auto items-center flex justify-between w-full rounded-lg">
          <Link to="/role/salesteam">
            <div className="flex items-center cursor-pointer">
              <BsArrowLeft className="text-xl me-3 " />
              <h3 className="text-xl font-medium">Transfer Ticket</h3>
            </div>
          </Link>

          <div className="info flex items-center gap-3 xs:gap-1 sm:gap-3 relative">
            <BsSearch className="mx-3 text-gray-500" />

            <BsBell className="text-lg mx-3 text-gray-500" />

            <div className="avtar flex items-center justify-center overflow-hidden h-10 w-10 rounded-full">
              <img
                src={
                  userDetails?.profile_pic
                    ? userDetails?.profile_pic
                    : blank_user
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
              <div className="logout bg-gray-200 p-2 rounded-lg absolute top-11 right-0">
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

        <div className="ticket m-14">
          <div className="transferUser">
            <h3 className="text-[#C4242B] text-xl font-medium">
              Select Transfer User
            </h3>
          </div>
          <div className="cash section my-3">
            <input
              type="radio"
              id="cashYes"
              name="bookCash"
              className="accent-primary"
              onChange={(e) => setCash(true)}
            />
            <label htmlFor="cashYes" className="ms-2 cursor-pointer">
              Cash
            </label>
            <input
              type="radio"
              id="cashNo"
              name="bookCash"
              className="ms-5 accent-primary"
              onChange={(e) => setCash(false)}
            />
            <label htmlFor="cashNo" className="ms-2 cursor-pointer">
              BookMyShow
            </label>
          </div>
          <div className="phoneAndEvent my-3 flex items-center w-full gap-7 xs:flex-col sm:flex-col md:flex-col lg:flex-row">
            <div className="phone w-full">
              <p className="my-2">Phone No.</p>
              <input
                type="number"
                className="px-3 py-3 w-full outline-none rounded-lg"
                placeholder="Enter Number"
                min="0"
                maxLength="10"
                value={searchQuery}
                onChange={handleNumberChange}
              />
            </div>

            <div className="event w-full">
              <div className="phoneAndEvent">
                <p className="my-2">Event</p>
                {/* <input
                type="number"
                className="px-3 py-3 w-full outline-none rounded-lg"
              /> */}
                <div className="eventSelect bg-white flex items-center w-full h-full rounded-lg p-1">
                  <Select
                    value={searchQuery?.length == 10 ? todayEventData : null}
                    options={searchQuery?.length == 10 ? eventData : null}
                    components={animatedComponents}
                    name="event"
                    placeholder="Select Event"
                    onChange={(selectedOption) => {
                      setTodayEventData(selectedOption);
                      handleEventSelect(selectedOption);
                    }}
                    className="basic-multi-select h-full flex item-center bg-transparent outline-none"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>
          </div>
          {isNotExist ? (
            <div className="remark mt-5 w-1/2">
              <p className="my-2">User Name</p>
              <input
                type="text"
                className="px-3 py-3 w-full outline-none rounded-lg"
                placeholder="Enter User Name"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          ) : null}
          <div className="remark mt-5 w-1/2">
            <p className="my-2">Remark</p>
            <input
              type="text"
              className="px-3 py-3 w-full outline-none rounded-lg"
              placeholder="Enter Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
        </div>

        <div className="findUser m-14">
          <div className="user">
            <h3 className="text-gray-400 font-medium">Find Result</h3>
          </div>
          <div className="userAndEvent flex items-center w-full gap-7 xs:flex-col sm:flex-col md:flex-col lg:flex-row">
            {userInfo ? (
              <div className="userInfo bg-white p-4 my-5 rounded-xl flex items-center w-full">
                <div className="flex items-center justify-center overflow-hidden h-14 w-14 rounded-full">
                  <img
                    src={
                      userInfo?.profile_pic ? userInfo?.profile_pic : blank_user
                    }
                    alt="image"
                    className="h-full"
                  />
                </div>
                <div className="name ms-3">
                  <p className=" font-medium">{userInfo?.name}</p>
                  <p className="text-sm text-gray-400">
                    {userInfo?.phone_number}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[88px] bg-gray-200 rounded-xl w-full animate-pulse"></div>
            )}

            {searchQuery?.length == 10 ? (
              <div className="userInfo bg-white p-4 my-5 rounded-xl flex items-center w-full">
                <div className="eventName ms-3">
                  <p className=" font-medium">{event?.event_name}</p>
                  <p className="text-sm text-gray-400">
                    {event?.event_location}
                  </p>
                </div>
                <div className="eventDate ms-auto flex items-center">
                  <p className="text-sm">
                    {formatDateToDDMMMYYYY(event?.event_date)}
                  </p>
                  <p className="text-sm">
                    <span className="border-l-2 border-black mx-1"></span>{" "}
                    {event?.event_time}
                  </p>
                </div>
                <div className="day bg-black p-2 px-3 rounded-xl ms-auto">
                  <p className="text-white text-sm  text-center">
                    {event?.event_day}
                    <br />
                    DAY
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[88px] bg-gray-200 rounded-xl w-full animate-pulse"></div>
            )}
          </div>

          {searchQuery?.length == 10 ? (
            <div className="bg-white p-6 rounded-xl my-5 ">
              <div className="ticket mb-5 flex items-center">
                <div className="ticket flex items-center">
                  <img src={ticket_Image} alt="image" />
                  <p className="ms-3 text-[#325BC5] font-medium">Add Ticket</p>
                </div>

                <div
                  className="add px-7 py-3 flex items-center rounded-xl bg-[#C4242B] ms-auto"
                  onClick={() => setAddTicket(true)}
                >
                  <BsPlusLg className="text-white mx-2" />
                  <p className="text-white">Add</p>
                </div>
              </div>

              {showTicket?.map((ticket, i) => {
                const ticket_color = ticket.color_code.slice(4);
                return (
                  <>
                    <div className="ticket flex items-center my-3" key={i}>
                      <p
                        className="text-lg text-white px-3 py-1 rounded-lg"
                        style={{ backgroundColor: `#${ticket_color}` }}
                      >
                        {ticket.name}
                      </p>
                      <p className="text-lg text-gray-400 ms-7">
                        x{ticket.qty}
                      </p>
                      <div className="price ms-auto flex items-center">
                        <p className="px-3 py-1 bg-[#EEEEEE] rounded-lg">
                          ₹{ticket.price}
                        </p>
                      </div>
                    </div>
                    <hr />
                  </>
                );
              })}

              {showTicket ? (
                <div className="total mt-3 flex items-center">
                  <p>Total Amount : </p>
                  <p className="px-3 py-1 ms-auto bg-[#EEEEEE] rounded-lg">
                    ₹{ticketTotal}
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="h-[150px] my-5 bg-gray-200 rounded-xl w-full animate-pulse"></div>
          )}

          {showTicket ? (
            <div className="button flex items-center justify-center">
              <button
                className="text-white bg-[#C4242B] px-32 py-3 rounded-full"
                // onClick={() => {
                //   handleClick();
                // }}
              >
                Transfer Now
              </button>
            </div>
          ) : null}

          <div className="h-24"></div>
        </div>
      </div>

      {/* Ticket popup start */}
      {addTicket === true ? (
        <div className="h-screen w-screen flex items-center justify-center bg-[#000000a1] backdrop-blur-[5px] top-0 left-0 fixed z-[50]  ">
          <div
            className={`w-[50%] text-xl h-auto min-h-[80px] max-h-[600px] bg-white rounded-[30px] flex flex-col justify-center items-center relative`}
          >
            <div className="mainTicket w-full px-7 py-5">
              <div className="ticket flex items-center">
                <img src={ticket_Image} alt="image" />
                <p className="ms-3 text-[#325BC5] font-medium">Add Ticket</p>
                <MdClose
                  className="ms-auto text-3xl text-gray-400 cursor-pointer"
                  onClick={() => {
                    setTicketData([]);
                    setAddTicket(false);
                    setTicketQTY(0);
                  }}
                />
              </div>

              <div className="showTicket mt-7 min-h-[100px] max-h-[400px] overflow-auto">
                {eventTicket?.map((ticket, i) => {
                  const coloCode = ticket.color_code.slice(4);
                  return (
                    <>
                      <div className="ticket flex items-center my-2" key={i}>
                        <p
                          className="text-sm text-white px-3 py-1 rounded-lg"
                          style={{ backgroundColor: `#${coloCode}` }}
                        >
                          {ticket.ticket_name}
                        </p>
                        <div className="price ms-auto flex items-center">
                          <p className="px-3 py-1 bg-[#EEEEEE] text-sm rounded-lg">
                            ₹{ticket.price}
                          </p>

                          <div className="flex items-center gap-1 ms-2">
                            <input
                              type="number"
                              className="border rounded-lg w-24 p-1 text-sm outline-none"
                              placeholder="Enter QTY"
                              onChange={(e) =>
                                handleQuantityChange(
                                  ticket._id,
                                  e.target.value,
                                  ticket.price
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <hr />
                    </>
                  );
                })}

                <div className="total my-5 flex items-center">
                  <p className="text-sm">Total Tickets : {ticketData.length}</p>
                  {/* <div className="totalAmount ms-auto flex items-center">
                    <p className="text-sm mx-2">Total Amount : </p>
                    <p className="px-3 py-1 bg-[#EEEEEE] text-sm rounded-lg">
                      {}
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="button w-full flex items-center gap-7 px-20 pb-5">
              <button
                className="bg-[#BEBEBE] rounded-full text-white w-full py-2 text-lg"
                onClick={() => {
                  setTicketData([]);
                  setAddTicket(false);
                  setTicketQTY(0);
                }}
              >
                Cancel
              </button>

              <button
                className="bg-[#C4242B] rounded-full text-white w-full py-2 text-lg"
                onClick={() => {
                  // let total = 0;
                  // for (const item of ticketData) {
                  //   const itemTotal = item.price * item.qty;
                  //   total += itemTotal;
                  // }
                  // setTicketTotal(total);
                  // console.log("Total:", total);
                  // setTicketMenu(false);

                  // setShowTicket(ticketData);
                  // setAddTicket(false);
                  // handleTicket();
                  handleClick();
                }}
              >
                Add Ticket
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {/* Ticket popup end */}
    </>
  );
};

export default TransferTicket;
