import React, { useEffect, useState } from "react";
import { BsTicketPerforatedFill } from "react-icons/bs";
import { FaParking } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { makeApiCall } from "../../../api/Post";
import { useNavigate } from "react-router-dom";
import InputField from "../../../componets/ui-elements/InputField";
import Alert from "../../../componets/ui-elements/Alert";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  filterByProperty,
  formatDateToDDMMMYYYY,
  handleNumberValidate,
} from "../../../utils/CommonFunctions";
import PhoneNumberInput from "../../../componets/ui-elements/PhoneNumberInput";

const IssueComplimentary = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState();
  const [event, setEvent] = useState();
  const [ticketMenu, setTicketMenu] = useState(false);
  const [parkingMenu, setParkingMenu] = useState(false);

  const [ticketTotal, setTicketTotal] = useState(0);
  const [parkingTotal, setParkingTotal] = useState(0);

  const [carParking, setCarParking] = useState();
  const [bikeParking, setBikeParking] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const [ticketData, setTicketData] = useState([]);
  // const [parkingData, setParkingData] = useState([]);
  const [contact, setContact] = useState();
  const [user, setUser] = useState();
  const [isNotExist, setIsNotExist] = useState(false);
  const [userName, setUserName] = useState();

  const [ticketQtY, setTicketQTY] = useState(0);
  const [carParkingQTY, setCarParkingQTY] = useState(0);
  const [bikeParkingQTY, setBikeParkingQTY] = useState();
  const [carParkingData, setCarParkingData] = useState([]);
  const [bikeParkingData, setBikeParkingData] = useState([]);

  const [isReserved, setIsReserved] = useState(false);
  const [isShowEvent, setIsShowEvent] = useState(false);

  const handleTicket = (ticket, cal) => {
    const isTicketExist = ticketData.some(
      (obj) => obj.ticket_id === ticket._id
    );
    // const isTicketExist = ticketData.find(obj=>obj.ticket_id===ticket._id);

    if (isTicketExist) {
      if (cal === "minus") {
        const matchingTicket = ticketData.find(
          (obj) => obj.ticket_id === ticket._id
        );
        if (matchingTicket.qty > 1) {
          matchingTicket.qty -= 1;
          setTicketQTY(ticketQtY - 1);
        } else {
          console.log("Minimum 1 ticket needed");
          // Remove the ticket from the array if the quantity is 0
          setTicketData(
            ticketData.filter((obj) => obj.ticket_id !== ticket._id)
          );
        }
      } else {
        const matchingTicket = ticketData.find(
          (obj) => obj.ticket_id === ticket._id
        );
        matchingTicket.qty += 1;
        setTicketQTY(ticketQtY + 1);
      }
    } else if (cal !== "minus") {
      // Don't add the ticket if the operation is "minus"
      setTicketQTY(1);
      setTicketData((prevTicket) => [
        ...prevTicket,
        {
          ticket_id: ticket._id,
          name: ticket.ticket_name,
          price: ticket.price,
          qty: 1,
          color_code: ticket.color_code,
        },
      ]);
    }
  };

  const handleCarParking = (parking, cal) => {
    const isParkingExist = carParkingData.some(
      (obj) => obj.parking_id === parking._id
    );
    // const isTicketExist = ticketData.find(obj=>obj.ticket_id===ticket._id);

    if (isParkingExist) {
      if (cal === "minus") {
        const matchingParking = carParkingData.find(
          (obj) => obj.parking_id === parking._id
        );
        if (matchingParking.qty > 1) {
          matchingParking.qty -= 1;
          setCarParkingQTY(carParkingQTY - 1);
        } else {
          console.log("Minimum 1 parking needed");
          setCarParkingData(
            carParkingData.filter((obj) => obj.parking_id !== parking._id)
          );
        }
      } else {
        const matchingParking = carParkingData.find(
          (obj) => obj.parking_id === parking._id
        );
        matchingParking.qty += 1;
        setCarParkingQTY(carParkingQTY + 1);
      }
    } else if (cal !== "minus") {
      setCarParkingQTY(1);
      setCarParkingData((prevParking) => [
        ...prevParking,
        {
          parking_id: parking._id,
          name: parking.parking_name,
          price: parking.price,
          qty: 1,
          color_code: parking.color_code,
        },
      ]);
    }
  };

  const handleBikeParking = (parking, cal) => {
    const isParkingExist = bikeParkingData.some(
      (obj) => obj.parking_id === parking._id
    );
    // const isTicketExist = ticketData.find(obj=>obj.ticket_id===ticket._id);

    if (isParkingExist) {
      if (cal === "minus") {
        const matchingParking = bikeParkingData.find(
          (obj) => obj.parking_id === parking._id
        );
        if (matchingParking.qty > 1) {
          matchingParking.qty -= 1;
          setBikeParkingQTY(bikeParkingQTY - 1);
        } else {
          console.log("Minimum 1 parking needed");
          setBikeParkingData(
            bikeParkingData.filter((obj) => obj.parking_id !== parking._id)
          );
        }
      } else {
        const matchingParking = bikeParkingData.find(
          (obj) => obj.parking_id === parking._id
        );
        matchingParking.qty += 1;
        setBikeParkingQTY(bikeParkingQTY + 1);
      }
    } else if (cal !== "minus") {
      setBikeParkingQTY(1);
      setBikeParkingData((prevParking) => [
        ...prevParking,
        {
          parking_id: parking._id,
          name: parking.parking_name,
          price: parking.price,
          qty: 1,
          color_code: parking.color_code,
        },
      ]);
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");
    const filterTicketData = ticketData.map(({ ticket_id, price, qty }) => ({
      _id: ticket_id,
      price: price,
      qty: qty,
    }));

    const parkingData = carParkingData.concat(bikeParkingData);

    const filterParkingData = parkingData.map(({ parking_id, price, qty }) => ({
      _id: parking_id,
      price: price,
      qty: qty,
    }));

    const params = {
      phone_number: contact,
      event_id: event._id,
      ticketcategorys: filterTicketData,
      parkings: null,
      revesed_parking: false,
      resassigned: true,
      total: ticketTotal,
    };

    console.log(params);

    try {
      const response = await makeApiCall(
        "post",
        "user/createcomplimantorycode",
        params,
        "raw"
      );
      console.log(response);
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg("Your complemantory code is " + response.data.data);
        // setMaxDiscount(null);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.warn(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const handleClick = () => {
    if (event && contact) {
      if (contact.length >= 10) {
        setIsAlert(true);
        setStatus("start");
      } else {
        setIsAlert(true);
        setErrorMsg("Please enter valid number !");
        setStatus("error");
      }
    } else {
      setIsAlert(true);
      setErrorMsg("Please fill all fileds !");
      setStatus("error");
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    setIsAlert(false);
    navigate("/role/sponsor");
  };

  const fetchData = async () => {
    const response = await makeApiCall("get", "event/all", null, "raw");
    const filterData = response.data.data;
    console.log(filterData);

    if (filterData?.length > 0) {
      const result = filterByProperty(filterData, "is_deleted", false);

      const eventOption = result?.map((event) => ({
        value: event._id,
        label: event.event_name + " - Day : " + event.event_day,
      }));
      console.log(eventOption);
      setEventData(eventOption);
    }
    return response;
  };

  const fetchDataParking = async () => {
    setParkingMenu(true);

    const getParking = await makeApiCall(
      "get",
      "parking/reminingparkingslot",
      null,
      "raw"
    );

    const remainingParking = filterByProperty(
      getParking.data.data,
      "event",
      event._id
    );
    console.log(remainingParking);

    const response = await makeApiCall("get", "parking/all", null, "raw");

    const isNotDeleted = filterByProperty(
      response.data.data,
      "is_deleted",
      false
    );

    const result = isNotDeleted.filter((isNotDeletedItem) =>
      remainingParking.some(
        (remainingParkingItem) =>
          remainingParkingItem.parking === isNotDeletedItem._id
      )
    );
    const combinedData = result.map((isNotDeletedItem) => {
      const matchingRemainingParkingItem = remainingParking.find(
        (remainingParkingItem) =>
          remainingParkingItem.parking === isNotDeletedItem._id
      );

      return {
        ...isNotDeletedItem,
        purchased_reseved_slot:
          matchingRemainingParkingItem.purchased_reseved_slot,
        purchased_slot: matchingRemainingParkingItem.purchased_slot,
        remaining_reseved_slot:
          matchingRemainingParkingItem.remaining_reseved_slot,
        remaining_slot: matchingRemainingParkingItem.remaining_slot,
        reserve_slot: matchingRemainingParkingItem.reserve_slot,
        slot: matchingRemainingParkingItem.slot,
      };
    });

    const isTicketParking = filterByProperty(
      combinedData,
      "ticket_parking",
      true
    );

    const isCarParking = filterByProperty(
      combinedData,
      "two_wheeler_parking",
      false
    );

    setCarParking(isCarParking);
    const isBikeParking = filterByProperty(
      isTicketParking,
      "two_wheeler_parking",
      true
    );
    setBikeParking(isBikeParking);
  };

  const animatedComponents = makeAnimated();

  const handleEventSelect = async (e) => {
    console.log(e.value);
    const response = await makeApiCall(
      "get",
      `event/info/${e.value}`,
      null,
      "raw"
    );
    console.log(response);
    setEvent(response.data.data);
  };

  const formatedDate = formatDateToDDMMMYYYY(event?.event_date);

  useEffect(() => {
    fetchData();
  }, []);

  const handleNumberChange = async (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric characters
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    setContact(numericValue);

    if (numericValue.length === 10) {
      const isExist = await handleNumberValidate(numericValue);
      console.log(isExist);
      if (isExist.data.status === 1) {
        if (isExist.data.data.roles === "n-user") {
          console.log("Valid user");
          setContact(e.target.value);
          setIsShowEvent(true);
          setUser({
            name: isExist.data.data.name,
            profile_pic: isExist.data.data.profile_pic,
          });
        } else {
          console.log("Not Valid user");
          setIsAlert(true);
          setStatus("error");
          setErrorMsg(
            `User already exists as a ${isExist.data.data.roles}. Try with another number.`
          );
        }
      } else {
        // setIsAlert(true);
        // setStatus("error");
        // setErrorMsg(`User not exist`);
        setIsShowEvent(true);
        setIsNotExist(true);
      }
    }
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
      <div className="h-[90vh] m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[100px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="flex flex-col gap-[25px] justify-start items-center">
          <div className="w-full">
            {/* <InputField
              type="number"
              placeholder={"Phone number"}
              inputPlaceholder={"Enter contact number"}
              value={contact}
              handleChange={(e) => setContact(e.target.value)}
              disabled={false}
            /> */}
            <PhoneNumberInput
              value={contact}
              handleChange={handleNumberChange}
            />
            {isShowEvent ? (
              isNotExist ? (
                <div className="w-full mt-2">
                  <InputField
                    type="text"
                    placeholder={"User Name"}
                    inputPlaceholder={"Enter user name"}
                    value={userName}
                    handleChange={(e) => setUserName(e.target.value)}
                    disabled={false}
                  />
                </div>
              ) : (
                <div className="w-full h-12 bg-gray-200 px-2 rounded-lg mt-2 flex items-center justify-start gap-4">
                  <div
                    className="h-8 w-8 rounded-full bg-white overflow-hidden"
                    onClick={() => setIsImageModel(true)}
                  >
                    <img className="w-full" src={user?.profile_pic} />
                  </div>
                  <p className="">{user?.name}</p>
                </div>
              )
            ) : null}
          </div>
          {isShowEvent ? (
            <div className="w-full">
              <p className="text-[14px] text-black font-semibold">
                Select event{" "}
              </p>
              <div className="eventSelect flex items-center w-full h-full border border-gray-300 rounded-lg p-2">
                <Select
                  options={eventData}
                  components={animatedComponents}
                  name="zone"
                  placeholder="Select Event"
                  onChange={handleEventSelect}
                  className="basic-multi-select h-full flex item-center bg-transparent outline-none"
                  classNamePrefix="select"
                />
              </div>
            </div>
          ) : null}

          {event ? (
            <>
              <div className="eventInfo p-3 border border-gray-400 w-full flex items-start justify-between rounded-2xl mt-2">
                <div className="eventName">
                  {event ? (
                    <h3 className="text-xl font-semibold">
                      {event.event_name}
                    </h3>
                  ) : (
                    <div className="w-[180px] h-[28px] bg-gray-200 rounded-sm animate-pulse"></div>
                  )}

                  {event ? (
                    <p className="text-sm text-gray-400 mt-1">
                      {event.event_location}
                    </p>
                  ) : (
                    <div className="w-[180px] h-[16px] mt-1 bg-gray-200 rounded-sm animate-pulse"></div>
                  )}

                  {event ? (
                    <p className="text-sm mt-1">
                      {formatedDate} <span>|</span> {event.event_time}{" "}
                    </p>
                  ) : (
                    <div className="w-[190px] h-[16px] mt-1 bg-gray-200 rounded-sm animate-pulse"></div>
                  )}
                </div>

                {event ? (
                  <div className="day text-center bg-black py-2 px-3 rounded-2xl">
                    <p className="text-white text-sm">
                      {event.event_day}
                      <br />
                      DAY
                    </p>
                  </div>
                ) : (
                  <div className="w-[45px] h-[45px] ms-auto me-4 mt-1 bg-gray-200 rounded-sm animate-pulse"></div>
                )}
              </div>

              <div className="ticketInfo p-3 border border-gray-400 w-full rounded-2xl">
                <div className="ticket flex items-center">
                  <BsTicketPerforatedFill className="text-2xl text-primary" />
                  <h3 className="font-semibold text-lg ms-3">Add Tickets</h3>
                  <button
                    disabled={event ? false : true}
                    className="ms-auto bg-primary text-white rounded-full py-1 px-7 disabled:bg-[#fda5b5]"
                    onClick={() => {
                      setTicketMenu(true);
                    }}
                  >
                    Add
                  </button>
                </div>

                {ticketData?.map((ticket) => {
                  const colorCode = ticket?.color_code?.slice(4);
                  return (
                    <div className="vip flex items-center mt-2">
                      <div
                        className={` bg-[#${colorCode}] rounded-full py-2 px-5`}
                        style={{ backgroundColor: "#" + colorCode }}
                      >
                        <p className="text-sm font-medium text-white">
                          {ticket.name}
                        </p>
                      </div>
                      <p className="ms-2">x {ticket.qty}</p>
                      <div className="price ms-auto">
                        <p className="text-sm mx-2">
                          ₹ {ticket.qty * ticket.price}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div className="ticketPrice py-2 px-2 rounded-lg mt-4">
                  <hr className="mb-2" />
                  <p className="font-medium text-right flex items-center justify-between">
                    <span>Total :</span>{" "}
                    {ticketTotal ? "₹" + ticketTotal : "₹0"}
                  </p>
                </div>
              </div>

              {/* <div className="parkingInfo p-3 border border-gray-400 w-full rounded-2xl">
                <div className="parking flex items-center">
                  <FaParking className="text-2xl text-primary" />
                  <h3 className="font-semibold text-lg ms-3">Add Parking</h3>
                  <button
                    disabled={event ? false : true}
                    className="ms-auto bg-primary text-white rounded-full py-1 px-7 disabled:bg-[#fda5b5]"
                    onClick={fetchDataParking}
                  >
                    Add
                  </button>
                </div>

                {carParkingData?.map((parking) => {
                  const colorCode = parking?.color_code?.slice(4);
                  return (
                    <div className="vip flex items-center mt-2">
                      <div
                        className={` bg-[#${colorCode}] rounded-full py-2 px-5`}
                        style={{ backgroundColor: "#" + colorCode }}
                      >
                        <p className="text-sm font-medium text-white">
                          {parking.name}
                        </p>
                      </div>
                      <p className="ms-2">x {parking.qty}</p>
                      <div className="price ms-auto">
                        <p className="text-sm mx-2">
                          ₹ {parking.qty * parking.price}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div className="ticketPrice py-2 px-2 rounded-lg mt-4">
                  <hr className="mb-2" />
                  <p className="font-medium text-right flex items-center justify-between">
                    <span>Total :</span>{" "}
                    {parkingTotal ? "₹" + parkingTotal : "₹0"}
                  </p>
                </div>
              </div> */}

              <div className="totalAmount p-3 border border-gray-400 w-full rounded-2xl mb-24">
                <div className="amount flex items-center mb-5">
                  <p className="font-semibold">Total Amount</p>
                  <p className="ms-auto font-semibold">₹ {ticketTotal}</p>
                </div>
                <hr />
                <div className="flex items-center mt-5">
                  <PrimaryButton
                    background={"primary-button"}
                    handleClick={handleClick}
                    title={"Create code"}
                  />
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Show Ticket Start */}
        {ticketMenu === true ? (
          <div
            className={`bg-[#000000ba] backdrop-blur-[3px] top-0 left-0 h-screen absolute w-full`}
          ></div>
        ) : null}
        <div
          className={`fixed z-50 top-0 left-0 h-screen w-full  flex items-end ${
            ticketMenu === true
              ? "translate-y-0 transition-all duration-300"
              : "translate-y-[1000px] transition-all"
          }`}
        >
          <div
            className={`max-h-auto relative h-auto w-full bg-[#F2F2F2] rounded-t-3xl p-5 gap-5`}
          >
            <div className="ticketText flex items-center">
              <div className="text flex">
                <BsTicketPerforatedFill className="text-2xl text-primary" />
                <p className="ms-3 text-xl font-semibold">Add Tickets</p>
              </div>
              <div className="cancel p-1 rounded-full ms-auto">
                <MdOutlineCancel
                  className="text-2xl"
                  onClick={() => {
                    let total = 0;
                    for (const item of ticketData) {
                      const itemTotal = item.price * item.qty;
                      total += itemTotal;
                    }
                    setTicketTotal(total);
                    console.log("Total:", total);
                    setTicketMenu(false);
                  }}
                />
              </div>
            </div>

            <div className="totalTicket my-3">
              <p className="text-sm font-semibold">
                Tickets ({event?.ticketcategorys.length})
              </p>
            </div>

            <div className="allTicket bg-white p-3 rounded-3xl w-full h-auto max-h-[400px] overflow-y-auto mb-5">
              {event?.ticketcategorys.map((ticket, i) => {
                const colorCode = ticket.color_code.slice(4);
                const singleTicket = ticketData.find(
                  (obj) => obj.ticket_id === ticket._id
                );
                console.log(singleTicket);
                return (
                  <div className="vip flex items-center mt-2" key={ticket._id}>
                    <div
                      className={` bg-[#${colorCode}] rounded-full py-2 px-5`}
                      style={{ backgroundColor: "#" + colorCode }}
                    >
                      <p className="text-sm font-medium text-white">
                        {ticket.ticket_name}
                      </p>
                    </div>
                    <div className="price ms-auto">
                      <p className="text-sm mx-2">
                        {console.log(i, ticketData[i])} ₹{ticket.price}
                      </p>
                    </div>
                    <div className="select border border-gray-400 rounded-full flex items-center px-3 gap-2">
                      <button
                        className="text-2xl text-primary"
                        onClick={() => handleTicket(ticket, "minus")}
                      >
                        -
                      </button>
                      <p className="text-primary">
                        {/* {ticketData[i] ? ticketData[i]?.qty : 0} */}
                        {singleTicket ? singleTicket.qty : 0}
                      </p>
                      <button
                        className="text-xl text-primary"
                        onClick={() => handleTicket(ticket, "plus")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="buttom bg-white flex items-center p-2 rounded-2xl gap-5">
              {/* <div className="ticketPrice border border-gray-400 py-4 px-7 rounded-xl">
                  <p className="font-medium">₹</p>
                </div> */}
              <div className="addTicket w-full ">
                <button
                  className="bg-primary text-white w-full py-4 rounded-xl font-medium"
                  onClick={() => {
                    let total = 0;
                    for (const item of ticketData) {
                      const itemTotal = item.price * item.qty;
                      total += itemTotal;
                    }
                    setTicketTotal(total);
                    console.log("Total:", total);
                    setTicketMenu(false);
                  }}
                >
                  Add Tickets{" "}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Show Ticket End */}

        {/* Show Parking Start */}
        {/* {parkingMenu === true ? (
          <div
            className={`bg-[#000000ba] backdrop-blur-[3px] top-0 left-0 h-screen absolute w-full`}
          ></div>
        ) : null} */}
        {/* <div
          className={`fixed z-50 top-0 left-0 h-screen w-full flex items-end ${
            parkingMenu === true
              ? "translate-y-0 transition-all duration-300"
              : "translate-y-[1000px] transition-all"
          }`}
        >
          <div
            className={`max-h-auto relative h-auto w-full bg-[#F2F2F2] rounded-t-3xl p-5 gap-5`}
          >
            <div className="ticketText flex items-center">
              <div className="text flex">
                <FaParking className="text-2xl text-primary" />
                <p className="ms-3 text-xl font-semibold">Add Parking</p>
              </div>
              <div className="cancel p-1 rounded-full ms-auto">
                <MdOutlineCancel
                  className="text-2xl"
                  onClick={() => {
                    let bikeParkingTotal = 0;
                    let carParkingTotal = 0;

                    for (const item of bikeParkingData) {
                      const itemTotal = item.price * item.qty;
                      bikeParkingTotal += itemTotal;
                    }
                    for (const item of carParkingData) {
                      const itemTotal = item.price * item.qty;
                      carParkingTotal += itemTotal;
                    }
                    setParkingTotal(carParkingTotal + bikeParkingTotal);
                    console.log("Total:", carParkingTotal + bikeParkingTotal);
                    setParkingMenu(false);
                  }}
                />
              </div>
            </div>
            {carParking?.length > 0 ? (
              <>
                {" "}
                <div className="totalTicket my-3">
                  <p className="text-sm font-semibold">
                    Four Wheeler ({carParking?.length})
                  </p>
                </div>
                <div className="allTicket bg-white p-3 rounded-3xl flex flex-col gap-2 items-between justify-center">
                  {carParking?.map((carParking, i) => {
                    const colorCode = carParking.color_code.slice(4);
                    const singleCarParking = carParkingData.find(
                      (obj) => obj.parking_id === carParking._id
                    );
                    return (
                      <div className="vip flex items-center" key={i}>
                        <div
                          className="rounded-full py-2 px-5"
                          style={{ backgroundColor: "#" + colorCode }}
                        >
                          <p className="text-sm font-medium text-white">
                            {carParking.parking_name}
                          </p>
                        </div>
                        <div className="price ms-auto">
                          <p className="text-sm mx-2">₹{carParking.price}</p>
                        </div>
                        <div className="select border border-gray-400 rounded-full flex items-center px-3 gap-2">
                          <button
                            className="text-2xl text-primary"
                            onClick={() =>
                              handleCarParking(carParking, "minus")
                            }
                          >
                            -
                          </button>
                          <p className="text-primary">
                            {singleCarParking ? singleCarParking.qty : "0"}
                          </p>
                          <button
                            className="text-2xl text-primary"
                            onClick={() => handleCarParking(carParking, "plus")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}

            {bikeParking?.length > 0 ? (
              <>
                {" "}
                <div className="totalTicket my-3">
                  <p className="text-sm font-semibold">
                    Two Wheeler ({bikeParking?.length})
                  </p>
                </div>
                <div className="allTicket bg-white p-3 rounded-3xl flex flex-col gap-2 items-between justify-center">
                  {bikeParking?.map((bikeParking, i) => {
                    const colorCode = bikeParking.color_code.slice(4);
                    const singleCarParking = bikeParkingData.find(
                      (obj) => obj.parking_id === bikeParking._id
                    );
                    return (
                      <div className="vip flex items-center" key={i}>
                        <div
                          className="rounded-full py-2 px-5 text-sm text-white"
                          style={{ backgroundColor: "#" + colorCode }}
                        >
                          <p className="font-semibold">
                            {bikeParking.parking_name}
                          </p>
                        </div>
                        <div className="price ms-auto">
                          <p className="text-sm mx-2">₹{bikeParking.price}</p>
                        </div>
                        <div className="select border border-gray-400 rounded-full flex items-center px-3 gap-2">
                          <button
                            className="text-2xl text-primary"
                            onClick={() =>
                              handleBikeParking(bikeParking, "minus")
                            }
                          >
                            -
                          </button>
                          <p className="text-primary">
                            {singleCarParking ? singleCarParking.qty : 0}
                          </p>
                          <button
                            className="text-2xl text-primary"
                            onClick={() =>
                              handleBikeParking(bikeParking, "plus")
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}

            <div className="buttom bg-white flex items-center p-2 mt-36 rounded-2xl gap-5">
              <div className="addTicket w-full ">
                <button
                  className="bg-primary text-white w-full py-4 rounded-xl font-medium"
                  onClick={() => {
                    let bikeParkingTotal = 0;
                    let carParkingTotal = 0;

                    for (const item of bikeParkingData) {
                      const itemTotal = item.price * item.qty;
                      bikeParkingTotal += itemTotal;
                    }
                    for (const item of carParkingData) {
                      const itemTotal = item.price * item.qty;
                      carParkingTotal += itemTotal;
                    }
                    setParkingTotal(carParkingTotal + bikeParkingTotal);
                    console.log("Total:", carParkingTotal + bikeParkingTotal);
                    setParkingMenu(false);
                  }}
                >
                  Add Parking{" "}
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/* Show Parking End */}
      </div>
    </>
  );
};

export default IssueComplimentary;
