import React, { useEffect, useState } from "react";
import {
  BsTag,
  BsPinMap,
  BsCalendarDay,
  BsGeoAlt,
  BsClock,
  BsPercent,
  BsPlus,
} from "react-icons/bs";
import { MdPersonOutline, MdDateRange } from "react-icons/md";
import { FaDrum } from "react-icons/fa";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import ValueInput from "../../../componets/ui-elements/ValueInput";
import { makeApiCall } from "../../../api/Post";
import { AiOutlineYoutube } from "react-icons/ai";
import Loader from "../../../componets/ui-elements/Loader";
import Alert from "../../../componets/ui-elements/Alert";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import InputField from "../../../componets/ui-elements/InputField";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import ImageUpload from "../../../componets/ui-elements/ImageUpload";
import ImageModel from "../../../componets/ui-elements/ImageModel";

const EventInfo = () => {
  const param = useParams();
  const [singlEvent, setEvent] = useState(null);
  const [ticket, setTicket] = useState();
  const [eventImage, setEventImage] = useState();
  const [eventID, setEventID] = useState();
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState(
    singlEvent ? singlEvent.event_name : ""
  );
  const [eventLocation, setEventLocation] = useState();
  const [eventDate, setEventDate] = useState();
  const [eventDescription, setEventDescription] = useState();
  const [youtubeLink, setYoutubeLink] = useState();
  const [eventDay, setEventDay] = useState();
  const [eventBandName, setEventBandName] = useState();
  const [eventLattitude, setEventLattitude] = useState();
  const [eventLongitude, setEventLongitude] = useState();
  const [eventTime, setEventTime] = useState();
  const [taxGroup, setTaxGroup] = useState([]);
  const [ticketcategorys, setTicketcategorys] = useState([]);

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [isImageModel, setIsImageModel] = useState(false);
  const [venueMap, setVenueMap] = useState();
  const [termsCondition, setTermsCondition] = useState();
  const [sellTicket, setSellTicket] = useState();

  const [isEditable, setIsEditable] = useState(false);

  const navigate = useNavigate();
  const eventId = param.id;

  const [eventPortraitImage, setEventPortraitImage] = useState();
  const [eventDisplayPortraitImage, setEventDisplayPortraitImage] = useState();
  const [eventLandscapImage, setEventLandscapImage] = useState();
  const [eventDisplayLandscapImage, setEventDisplayLandscapImage] = useState();
  const [selectedModelImage, setSelectedModelImage] = useState();

  const findEvent = async () => {
    setIsAlert(true);
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "get",
        `event/info/${eventId}`,
        null,
        "raw"
      );
      if (response.data.status === 1) {
        setEventID(response.data.data._id);
        setEventDisplayLandscapImage(response.data.data.event_photo);
        setEventDisplayPortraitImage(response.data.data.portrait_image);
        setEventName(response.data.data.event_name);
        setEventLocation(response.data.data.event_location);
        setEventDate(response.data.data.event_date);
        setEventDescription(response.data.data.event_description);
        setYoutubeLink(response.data.data.youtube_link);
        setEventDay(response.data.data.event_day);
        setEventBandName(response.data.data.event_band_name);
        setEventLattitude(response.data.data.event_lattitude);
        setEventLongitude(response.data.data.event_longitude);
        setEventTime(response.data.data.event_time);
        setTaxGroup(response.data.data.taxes);
        setTicket(response.data.data.ticketcategorys);
        setVenueMap(response.data.data.venue_pdf);
        setTermsCondition(response.data.data.term_condition_Pdf);
        setSellTicket(response.data.data.selling);
        setIsAlert(false);
      } else {
        setIsAlert(false);
      }
    } catch (error) {
      console.error(error.data);
      setIsAlert(false);
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");
    // setLoading(true);

    console.log(eventLandscapImage);

    const eventData = {
      event_id: eventId,
      // portrait_image: eventPortraitImage,
      // event_photo: eventLandscapImage,
      event_name: eventName,
      event_location: eventLocation,
      event_date: eventDate,
      event_description: eventDescription,
      youtube_link: youtubeLink,
      event_day: eventDay,
      event_band_name: eventBandName,
      event_lattitude: eventLattitude,
      event_longitude: eventLongitude,
      event_time: eventTime,
      venue_pdf: venueMap,
      term_condition_Pdf: termsCondition,
      selling: sellTicket,
      // ticketcategorys: JSON.stringify(ticket),
      // taxes: JSON.stringify(taxGroup),
    };

    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    console.log("Contents of FormData:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await makeApiCall(
        "post",
        "event/update",
        formData,
        "formData"
      );
      setLoading(false);
      console.log(response);
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMsg(error);
    }
  };

  useEffect(() => {
    findEvent();
  }, []);

  const handleClick = () => {
    setIsAlert(true);
    setStatus("start");
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    navigate("/role/superadmin/event");
  };

  const handleDelete = async (e) => {
    setIsAlert(true);
    setStatus("loading");

    e.preventDefault();
    try {
      const deleteEvent = await makeApiCall(
        "post",
        "event/delete",
        { event_id: eventID },
        "raw"
      );
      console.log(deleteEvent);
      if (deleteEvent.data.status === 1) {
        setStatus("complete");
        setSuccessMsg("Event Delete Successfuly");
      } else {
        setStatus("error");
        setErrorMsg(deleteEvent.data.data);
      }
    } catch (error) {
      console.log(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const animatedComponents = makeAnimated();

  const dayData = [
    { value: "01", label: "01" },
    { value: "02", label: "02" },
    { value: "03", label: "03" },
    { value: "04", label: "04" },
    { value: "05", label: "05" },
    { value: "06", label: "06" },
    { value: "07", label: "07" },
    { value: "08", label: "08" },
    { value: "09", label: "09" },
    { value: "10", label: "10" },
  ];

  const sellData = [
    { value: "true", label: "True" },
    { value: "false", label: "false" },
  ];

  const handleTimeChange = (event) => {
    const { value } = event.target;
    // Convert the 24-hour format (value) to AM/PM format
    const timeFormatted = formatTime(value);
    setEventTime(timeFormatted);
  };

  //for ticket

  const handlePriceChange = (ticketId, price) => {
    const existingCategoryIndex = ticketcategorys.findIndex(
      (category) => category.ticket_id === ticketId
    );

    if (existingCategoryIndex !== -1) {
      const updatedCategorys = [...ticketcategorys];
      updatedCategorys[existingCategoryIndex].price = price;
      setTicketcategorys(updatedCategorys);
    } else {
      setTicketcategorys((prevCategorys) => [
        ...prevCategorys,
        { ticket_id: ticketId, price: parseInt(price) },
      ]);
    }
  };

  const handleTaxChage = (e, index) => {
    const { name, value } = e.target;
    const updatedGroups = [...taxGroup];
    updatedGroups[index][name] = value;
    setTaxGroup(updatedGroups);
  };

  const addTaxGroup = () => {
    setTaxGroup([...taxGroup, {}]);
  };

  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      if (name === "landscap") {
        setEventLandscapImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setEventDisplayLandscapImage(base64String);
        };
        reader.readAsDataURL(file);
      } else {
        setEventPortraitImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setEventDisplayPortraitImage(base64String);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handeleImageModelClose = () => {
    setIsImageModel(false);
  };

  // Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split("T")[0];

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
      {loading ? <Loader /> : null}
      <div className="h-full m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[50px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="eventImage flex flex-col gap-3 justify-center items-center ">
            {isEditable ? (
              <ImageUpload
                id={"file"}
                handleChange={(e) => handleFileChange(e, "landscap")}
                source={eventDisplayLandscapImage}
                heading={"Landscap image"}
                height={"h-auto min-h-56"}
                label={"Replace image"}
              />
            ) : (
              <div className="w-full">
                <p className="font-semibold mb-4">Landscap image</p>
                <div className="event flex items-center justify-center  border-gray-400 rounded-lg overflow-hidden h- w-full object-cover">
                  <img
                    src={eventDisplayLandscapImage}
                    alt="image"
                    className="h-full w-full object-cover"
                    onClick={() => {
                      setIsImageModel(true);
                      setSelectedModelImage(eventDisplayLandscapImage);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="eventImage flex flex-col gap-3 mt-5 justify-center items-center  ">
            {isEditable ? (
              <ImageUpload
                id={"filePortrait"}
                handleChange={(e) => handleFileChange(e, "portrait_image")}
                source={eventDisplayPortraitImage}
                heading={"Portrait image"}
                height={"h-auto min-h-56"}
                label={"Replace image"}
              />
            ) : (
              <div className="w-full">
                <p className="font-semibold mb-4">Portrait image</p>
                <div className="event flex items-center justify-center  border-gray-400 rounded-lg overflow-hidden h-auto w-full object-cover">
                  <img
                    src={eventDisplayPortraitImage}
                    alt="image"
                    className="h-full w-full object-cover"
                    onClick={() => {
                      setIsImageModel(true);
                      setSelectedModelImage(eventDisplayPortraitImage);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[25px] mt-5 justify-start items-center">
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  placeholder={"Event name"}
                  inputPlaceholder="Event Name"
                  icon={<MdPersonOutline className="text-2xl" />}
                  disabled={false}
                  name="event_name"
                  value={eventName}
                  handleChange={(e) => setEventName(e.target.value)}
                />
              ) : (
                <ValueInput
                  type="text"
                  icon={<MdPersonOutline className="text-2xl text-gray-400" />}
                  placeholder={"Event Name"}
                  value={eventName}
                  isDisabled={true}
                />
              )}
            </div>
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  placeholder={"Event Location"}
                  inputPlaceholder="Event Location"
                  icon={<BsPinMap className="text-2xl" />}
                  disabled={false}
                  name="eventLocation"
                  value={eventLocation}
                  handleChange={(e) => setEventLocation(e.target.value)}
                />
              ) : (
                <ValueInput
                  type="text"
                  icon={<BsPinMap className="text-2xl text-gray-400" />}
                  placeholder={"Event Location"}
                  inputPlaceholder={eventLocation}
                  isDisabled={true}
                />
              )}
            </div>
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="date"
                  placeholder={"Event Date"}
                  icon={<MdDateRange className="text-2xl" />}
                  disabled={false}
                  name="event_date"
                  value={eventDate}
                  handleChange={(e) => setEventDate(e.target.value)}
                  min={today} // Set the minimum date to today
                />
              ) : (
                <ValueInput
                  type="date"
                  icon={<MdDateRange className="text-2xl text-gray-400" />}
                  placeholder={"Event Date"}
                  inputPlaceholder={eventDate}
                  value={eventDate}
                  isDisabled={true}
                  // handleChange={(e) => console.log(e.target.value)}
                />
              )}
            </div>
            <div className="w-full">
              {isEditable ? (
                <>
                  <p className="text-[14px] font-semibold ms-1 mb-1">
                    Event Description
                  </p>
                  <div className="w-full h-auto border border-gray-300 rounded-2xl">
                    <div className="flex items-center h-full">
                      <div className="mx-2 w-full flex flex-col py-2  pl-2 h-full justify-center">
                        <textarea
                          value={eventDescription}
                          maxlength="1000"
                          minlength="100"
                          className="w-full bg-transparent  outline-none placeholder:text-[14px]"
                          onChange={(e) => setEventDescription(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[14px] font-semibold ms-1 mb-1">
                    Event Description
                  </p>
                  <div className="garbaName flex items-center rounded-2xl bg-[#f2f2f2] p-3">
                    <div className="details w-full ps-3">
                      <textarea
                        value={eventDescription}
                        maxlength="1000"
                        minlength="100"
                        className="w-full bg-transparent  outline-none placeholder:text-[14px]"
                        disabled={true}
                      ></textarea>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  placeholder={"Youtube link"}
                  inputPlaceholder="Youtube link"
                  icon={<AiOutlineYoutube className="text-2xl" />}
                  name="youtube_link"
                  value={youtubeLink}
                  handleChange={(e) => setYoutubeLink(e.target.value)}
                />
              ) : (
                <ValueInput
                  type="text"
                  icon={<AiOutlineYoutube className="text-2xl text-gray-400" />}
                  placeholder={"Youtube Link"}
                  value={youtubeLink}
                  inputPlaceholder={youtubeLink}
                  isDisabled={true}
                />
              )}
            </div>

            <div className="w-full">
              {isEditable ? (
                <div className="w-full">
                  <p className="text-[14 px] text-black font-semibold">
                    Select event day
                  </p>
                  <div className="w-full h-16 border border-gray-300 rounded-lg">
                    <div className="authorizedName flex items-center h-full">
                      <Select
                        options={dayData}
                        components={animatedComponents}
                        placeholder="Select event day"
                        isMulti={false}
                        name="event_day"
                        onChange={(e) =>
                          // e[0].setCheckpoint([...checkpoint, checkpointItem.value])
                          {
                            setEventDay(e.value);
                          }
                        }
                        className="basic-multi-select h-full flex item-center bg-transparent"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <ValueInput
                  type="number"
                  icon={<BsCalendarDay className="text-2xl text-gray-400" />}
                  placeholder={"Event Day"}
                  inputPlaceholder={eventDay}
                  handleChange={(e) => setEventDay(e.target.value)}
                  value={eventDay}
                  isDisabled={true}
                />
              )}
            </div>

            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="text"
                  placeholder={"Band Name"}
                  inputPlaceholder="Band name"
                  icon={<FaDrum className="text-2xl" />}
                  disabled={false}
                  name="band_name"
                  value={eventBandName}
                  handleChange={(e) => setEventBandName(e.target.value)}
                />
              ) : (
                <ValueInput
                  type="text"
                  icon={<FaDrum className="text-2xl text-gray-400" />}
                  placeholder={"Band Name"}
                  inputPlaceholder={eventBandName}
                  value={eventBandName}
                  isDisabled={true}
                />
              )}
            </div>

            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="file"
                  placeholder={"Add Venue Map"}
                  inputPlaceholder="Venue Map"
                  icon={<FaDrum className="text-2xl" />}
                  disabled={false}
                  name="venue_map"
                  accept=".pdf"
                  // value={venueMap}
                  handleChange={(e) => setVenueMap(e.target.files[0])}
                />
              ) : (
                <ValueInput
                  type="text"
                  icon={<FaDrum className="text-2xl text-gray-400" />}
                  placeholder={"Venue Map"}
                  inputPlaceholder={venueMap}
                  value={venueMap}
                  isDisabled={true}
                />
              )}
            </div>

            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="file"
                  placeholder={"Terms Condition"}
                  inputPlaceholder="Terms Condition"
                  icon={<FaDrum className="text-2xl" />}
                  disabled={false}
                  name="termscondition"
                  accept=".pdf"
                  // value={venueMap}
                  handleChange={(e) => setTermsCondition(e.target.files[0])}
                />
              ) : (
                <ValueInput
                  type="text"
                  icon={<FaDrum className="text-2xl text-gray-400" />}
                  placeholder={"Terms Condition"}
                  inputPlaceholder={termsCondition}
                  value={termsCondition}
                  isDisabled={true}
                />
              )}
            </div>

            <div className="w-full">
              {isEditable ? (
                <div className="w-full">
                  <p className="text-[14 px] text-black font-semibold">
                    Sell Ticket
                  </p>
                  <div className="w-full h-16 border border-gray-300 rounded-lg">
                    <div className="authorizedName flex items-center h-full">
                      <Select
                        options={sellData}
                        components={animatedComponents}
                        placeholder="Sell Ticket"
                        isMulti={false}
                        name="sell_ticket"
                        onChange={(e) => {
                          setSellTicket(e.value);
                        }}
                        className="basic-multi-select h-full flex item-center bg-transparent"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <ValueInput
                  type="text"
                  icon={<BsCalendarDay className="text-2xl text-gray-400" />}
                  placeholder={"Sell Ticket"}
                  inputPlaceholder={sellTicket}
                  handleChange={(e) => setSellTicket(e.target.value)}
                  value={sellTicket}
                  isDisabled={true}
                />
              )}
            </div>

            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="number"
                  placeholder={"Lattitude for a location"}
                  inputPlaceholder="Enter lattitude for a location"
                  icon={<BsGeoAlt className="text-2xl" />}
                  name="event_map"
                  value={eventLattitude}
                  handleChange={(e) => setEventLattitude(e.target.value)}
                />
              ) : (
                <ValueInput
                  type="number"
                  icon={<BsGeoAlt className="text-2xl text-gray-400" />}
                  placeholder={"Lattitude for a location"}
                  inputPlaceholder={eventLattitude}
                  value={eventLattitude}
                  isDisabled={true}
                />
              )}
            </div>
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="number"
                  placeholder={"Longitude for a location"}
                  inputPlaceholder="Enter longitude for a location"
                  icon={<BsGeoAlt className="text-2xl" />}
                  disabled={false}
                  name="event_map"
                  value={eventLongitude}
                  handleChange={(e) => setEventLongitude(e.target.value)}
                />
              ) : (
                <ValueInput
                  type="number"
                  icon={<BsGeoAlt className="text-2xl text-gray-400" />}
                  placeholder={"Longitude for a location"}
                  inputPlaceholder={eventLongitude}
                  value={eventLongitude}
                  isDisabled={true}
                />
              )}
            </div>
            <div className="w-full">
              {isEditable ? (
                <InputField
                  type="time"
                  placeholder={"Time"}
                  inputPlaceholder={"Enter time"}
                  icon={<BsClock className="text-2xl" />}
                  name="ticketcategorys"
                  value={eventTime}
                  handleChange={handleTimeChange}
                />
              ) : (
                <ValueInput
                  type="time"
                  icon={<BsClock className="text-2xl text-gray-400" />}
                  placeholder={"Event Time"}
                  inputPlaceholder={eventTime}
                  value={eventTime}
                  isDisabled={true}
                />
              )}
            </div>

            {taxGroup.length != 0 ? (
              <p className="w-full text-left font-bold text-primary">
                Tax list
              </p>
            ) : null}

            {taxGroup.map((tax, index) => {
              return (
                <>
                  <hr className="w-full" />
                  <div
                    key={tax._id}
                    className="addMore flex flex-col gap-[10px] w-full"
                  >
                    {isEditable ? (
                      <>
                        <InputField
                          type={"text"}
                          placeholder={"Tax name"}
                          inputPlaceholder="Enter tax name"
                          name={"tax_name"}
                          value={tax.tax_name}
                          handleChange={(e) => handleTaxChage(e, index)}
                          icon={<HiOutlineCurrencyRupee className="text-2xl" />}
                        />
                        <InputField
                          type={"number"}
                          placeholder={"Tax percentage"}
                          inputPlaceholder="Enter tax percentage"
                          name={"tax_rate"}
                          value={tax.tax_rate}
                          handleChange={(e) => handleTaxChage(e, index)}
                          icon={<BsPercent className="text-2xl" />}
                        />
                      </>
                    ) : (
                      <ValueInput
                        type="text"
                        icon={<BsClock className="text-2xl text-gray-400" />}
                        placeholder={tax.tax_name}
                        inputPlaceholder={eventTime}
                        value={`${tax.tax_rate} %`}
                        isDisabled={true}
                      />
                    )}
                  </div>
                </>
              );
            })}

            {isEditable ? (
              <div
                className={`addBranchButton py-2 border-2 border-gray-300 rounded-2xl flex justify-center w-full `}
                onClick={addTaxGroup}
              >
                <p className=" flex items-center font-medium">
                  <BsPlus className="text-3xl me-3" />
                  Add Tax
                </p>
              </div>
            ) : null}

            <hr className="w-full" />

            <div className="w-full flex flex-col gap-6 bg-white eventCardShadow p-3 rounded-md  ">
              <p className="w-full text-left font-bold text-primary">
                Ticket price
              </p>

              {ticket?.map((el, index) => {
                return (
                  <>
                    <div
                      className="addMore flex flex-col gap-[10px] w-full"
                      key={el._id}
                    >
                      {isEditable ? (
                        <InputField
                          type="number"
                          placeholder={el.ticket_name}
                          inputPlaceholder={`Enter price of ${el.ticket_name}`}
                          icon={<HiOutlineCurrencyRupee className="text-2xl" />}
                          disabled={false}
                          name="ticketcategorys"
                          value={el.price}
                          handleChange={(e) =>
                            handlePriceChange(el._id, e.target.value)
                          }
                        />
                      ) : (
                        <ValueInput
                          type="text"
                          icon={<BsClock className="text-2xl text-gray-400" />}
                          placeholder={el.ticket_name}
                          inputPlaceholder={`₹ ${el.price}`}
                          value={`₹ ${el.price}`}
                          isDisabled={true}
                        />
                      )}
                    </div>
                  </>
                );
              })}
            </div>

            {/* {ticket?.map((ticket) => {
          return (
            <div className="w-full" key={ticket._id}>
              <InputField
                type="number"
                placeholder={ticket.ticket_name}
                inputPlaceholder={`Enter price of ${ticket.ticket_name}`}
                icon={
                  <HiOutlineCurrencyRupee className="text-2xl" />
                }
                disabled={false}
                name="ticketcategorys"
              value={singlEvent ? `${singlEvent.ticketcategorys}` : null}
                handleChange={(e) =>
                  handlePriceChange(ticket._id, e.target.value)
                }
              />
            </div>
          );
        })} */}
          </div>
          <div className="flex items-center gap-4 mt-16 mb-24">
            {/* <PrimaryButton background={"primary-button"} title={"Submit"} /> */}
            <PrimaryButton
              title={isEditable ? "Submit" : "Edit Details"}
              background={isEditable ? "bg-primary" : "bg-black"}
              handleClick={isEditable ? handleClick : () => setIsEditable(true)}
            />
            {isEditable ? null : (
              <PrimaryButton
                title={"Delete"}
                background={isEditable ? "bg-primary" : "bg-black"}
                handleClick={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
      {isImageModel ? (
        <ImageModel
          handleClose={handeleImageModelClose}
          src={selectedModelImage}
        />
      ) : null}
    </>
  );
};

export default EventInfo;
