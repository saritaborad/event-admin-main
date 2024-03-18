import React, { useEffect, useState } from "react";

//react icons
import { BsPlus } from "react-icons/bs";

//ui-elements
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import InputField from "../../../componets/ui-elements/InputField";
import Alert from "../../../componets/ui-elements/Alert";

import { makeApiCall } from "../../../api/Post";
import { useNavigate } from "react-router-dom";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import ImageUpload from "../../../componets/ui-elements/ImageUpload";
import { appendDataToFormData } from "../../../utils/CommonFunctions";

const NewEvent = () => {
  const [eventName, setEventName] = useState();
  const [eventDesc, setEventDesc] = useState();
  const [youtubeLink, setYoutubeLink] = useState();
  const [eventDate, setEventDate] = useState();
  const [eventDay, setEventDay] = useState();
  const [eventLocation, setEventLocation] = useState();
  const [eventBandName, setEventBandName] = useState();
  const [eventMap, setEventMap] = useState();
  const [eventTime, setEventTime] = useState();
  const [ticketcategorys, setTicketcategorys] = useState([]);
  const [ticket, setTicket] = useState();
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [taxGroup, setTaxGroup] = useState([]);
  const [venueMap, setVenueMap] = useState();
  const [termsCondition, setTermsCondition] = useState();

  const [eventPortraitImage, setEventPortraitImage] = useState();
  const [eventDisplayPortraitImage, setEventDisplayPortraitImage] = useState();
  const [eventLandscapImage, setEventLandscapImage] = useState();
  const [eventDisplayLandscapImage, setEventDisplayLandscapImage] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [sellTicket, setSellTicket] = useState();

  const maxFileSize = 9 * 1024 * 1024; // 9mb
  const [fileSizeExceededLandscap, setFileSizeExceededLandscap] =
    useState(false);
  const [fileSizeExceededPortrait, setFileSizeExceededPortrait] =
    useState(false);

  const navigate = useNavigate();

  const params = {
    event_name: eventName,
    event_description: eventDesc,
    youtube_link: youtubeLink,
    event_photo: eventLandscapImage,
    portrait_image: eventPortraitImage,
    event_date: eventDate,
    event_day: eventDay,
    event_location: eventLocation,
    event_band_name: eventBandName,
    event_longitude: long,
    event_lattitude: lat,
    event_time: eventTime,
    event_map: eventMap,
    term_condition_Pdf: termsCondition,
    venue_pdf: venueMap,
    selling: sellTicket,
  };

  //add new branch ================ >
  const addTaxGroup = () => {
    setTaxGroup([...taxGroup, {}]);
  };
  //Handle branch input ================ >
  const handleTaxChage = (e, index) => {
    const { name, value } = e.target;
    const updatedGroups = [...taxGroup];
    updatedGroups[index][name] = value;
    setTaxGroup(updatedGroups);
  };

  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
    // console.log(file);
    if (file) {
      if (name === "landscap") {
        if (file.size < maxFileSize) {
          setFileSizeExceededLandscap(false);
          setEventLandscapImage(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result;
            setEventDisplayLandscapImage(base64String);
          };
          reader.readAsDataURL(file);
        } else {
          setFileSizeExceededLandscap(true);
        }
      } else {
        if (file.size < maxFileSize) {
          setFileSizeExceededPortrait(false);
          setEventPortraitImage(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result;
            setEventDisplayPortraitImage(base64String);
          };
          reader.readAsDataURL(file);
        } else {
          setFileSizeExceededPortrait(true);
        }
      }
    }
  };

  const handleDelete = (event) => {
    if (event === "landscap") {
      setEventDisplayLandscapImage();
      setEventLandscapImage();
    } else {
      setEventDisplayPortraitImage();
      setEventPortraitImage();
    }
  };

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

  const handleTimeChange = (event) => {
    const { value } = event.target;
    // Convert the 24-hour format (value) to AM/PM format
    const timeFormatted = formatTime(value);
    setEventTime(timeFormatted);
  };

  const formatTime = (value) => {
    const [hours, minutes] = value.split(":");
    const parsedHours = parseInt(hours, 10);

    // Check if the time is in the AM or PM period
    const period = parsedHours >= 12 ? "PM" : "AM";

    // Convert the hours to 12-hour format
    const formattedHours = parsedHours % 12 || 12;

    // Return the formatted time in the desired format
    return `${formattedHours}:${minutes} ${period}`;
  };

  const handleConfirm = async () => {
    setStatus("loading");

    const formData = new FormData();

    appendDataToFormData(formData, params);
    formData.append("ticketcategorys", JSON.stringify(ticketcategorys));
    formData.append("taxes", JSON.stringify(taxGroup));

    console.log("Contents of FormData:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      const response = await makeApiCall(
        "post",
        "event/create",
        formData,
        "formdata"
      );
      console.log(response);
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      setStatus("error");
      setErrorMsg("Something went wrong");
      console.log(error);
    }
  };

  const handleClick = () => {
    const isValidParams = () => {
      return Object.values(params).every(
        (value) => value !== null && value !== undefined
      );
    };
    console.log(params);
    if (!isValidParams()) {
      setIsAlert(true);
      setErrorMsg("Please fill all field");
      setStatus("error");
    } else {
      setIsAlert(true);
      setStatus("start");
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    navigate("/role/superadmin/event");
  };

  const getAllTicket = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "ticketcategory/all",
        null,
        "raw"
      );
      setTicket(response.data.tickets);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTicket();
  }, []);

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
    { value: "false", label: "False" },
  ];

  const taxRemove = (index) => {
    const updatedTax = [...taxGroup];
    updatedTax.splice(index, 1);
    setTaxGroup(updatedTax);
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
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[50px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="landscap">
            <ImageUpload
              id={"file"}
              handleChange={(e) => handleFileChange(e, "landscap")}
              source={eventDisplayLandscapImage}
              heading={"Landscap Image"}
              height={"h-auto min-h-56"}
              label={
                eventDisplayLandscapImage ? "Replace image" : "Upload image"
              }
              // handleDelete={()=>handleDelete("landscap")}
            />
            {fileSizeExceededLandscap && (
              <p className="error text-red-500">
                File size exceeded the limit of 9 mb
              </p>
            )}
          </div>

          <div className="portraitFile mt-5">
            <ImageUpload
              id={"portraitFile"}
              handleChange={(e) => handleFileChange(e, "portrait")}
              source={eventDisplayPortraitImage}
              heading={"Portrait Image"}
              height={"h-auto min-h-96"}
              label={
                eventDisplayPortraitImage ? "Replace image" : "Upload image"
              }
              // handleDelete={()=>handleDelete("portrait")}
            />
            {fileSizeExceededPortrait && (
              <p className="error text-red-500">
                File size exceeded the limit of 9 mb
              </p>
            )}
          </div>

          <div className="flex flex-col gap-[20px] mt-5 justify-start items-center">
            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Event name"}
                inputPlaceholder="Event Name"
                disabled={false}
                name="event_name"
                handleChange={(e) => setEventName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Event Location"}
                inputPlaceholder="Event Location"
                disabled={false}
                name="eventLocation"
                // value={params.brandName}
                handleChange={(e) => setEventLocation(e.target.value)}
              />
            </div>
            <div className="w-full">
              <InputField
                type="date"
                placeholder={"Event Date"}
                disabled={false}
                name="event_date"
                // value={params.event_date}
                handleChange={(e) => setEventDate(e.target.value)}
                min={today} // Set the minimum date to today
              />
            </div>
            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Description"}
                inputPlaceholder="Description"
                disabled={false}
                name="event_description"
                // value={params.event_description}
                handleChange={(e) => setEventDesc(e.target.value)}
              />
            </div>
            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Youtube link"}
                inputPlaceholder="Youtube link"
                disabled={false}
                name="youtube_link"
                // value={params.youtube_link}
                handleChange={(e) => setYoutubeLink(e.target.value)}
              />
            </div>
            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Band Name"}
                inputPlaceholder="Band name"
                disabled={false}
                name="band_name"
                handleChange={(e) => setEventBandName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <>
                <p className="text-[14px] text-black font-semibold ms-1 mb-1">
                  Add Venue Map
                </p>
                <div
                  className={`w-full h-16 border border-gray-300 rounded-lg`}
                >
                  <div className="flex items-center h-full">
                    <div className="mx-2 w-full flex flex-col py-2 pl-2 h-full justify-center">
                      <input
                        type="file"
                        className=" outline-none w-full placeholder:text-[14px] bg-transparent"
                        placeholder={"Add Venue Map"}
                        onChange={(e) => setVenueMap(e.target.files[0])}
                        accept=".pdf"
                      />
                    </div>
                  </div>
                </div>
              </>
            </div>

            <div className="w-full">
              <>
                <p className="text-[14px] text-black font-semibold ms-1 mb-1">
                  Terms & Condition
                </p>
                <div
                  className={`w-full h-16 border border-gray-300 rounded-lg`}
                >
                  <div className="flex items-center h-full">
                    <div className="mx-2 w-full flex flex-col py-2 pl-2 h-full justify-center">
                      <input
                        type="file"
                        className=" outline-none w-full placeholder:text-[14px] bg-transparent"
                        placeholder={"Terms Condition"}
                        onChange={(e) => setTermsCondition(e.target.files[0])}
                        accept=".pdf"
                      />
                    </div>
                  </div>
                </div>
              </>
            </div>

            <div className="w-full">
              <p className="text-[14 px] text-black font-semibold">
                Sell Ticket
              </p>
              <div className="w-full h-16 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  <Select
                    options={sellData}
                    components={animatedComponents}
                    // placeholder="Select event day"
                    isMulti={false}
                    name="sell_ticket"
                    onChange={(e) =>
                      // e[0].setCheckpoint([...checkpoint, checkpointItem.value])
                      {
                        setSellTicket(e.value);
                      }
                    }
                    className="basic-multi-select h-full flex item-center bg-transparent"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-[14 px] text-black font-semibold">
                Select day
              </p>
              <div className="w-full h-16 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  <Select
                    options={dayData}
                    components={animatedComponents}
                    // placeholder="Select event day"
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

            <div className="w-full">
              <InputField
                type="number"
                placeholder={"Lattitude for a location"}
                inputPlaceholder="Enter lattitude for a location"
                disabled={false}
                name="event_map"
                // value={params.event_day}
                handleChange={(e) => setLat(e.target.value)}
              />
            </div>
            <div className="w-full">
              <InputField
                type="number"
                placeholder={"Longitude for a location"}
                inputPlaceholder="Enter longitude for a location"
                disabled={false}
                name="event_map"
                // value={params.event_day}
                handleChange={(e) => setLong(e.target.value)}
              />
            </div>
            <div className="w-full">
              <InputField
                type="text"
                placeholder={"Event map URL"}
                inputPlaceholder="Enter map URL for location"
                disabled={false}
                name="event_map"
                // value={params.event_day}
                handleChange={(e) => setEventMap(e.target.value)}
              />
            </div>

            <div className="w-full">
              <InputField
                type="time"
                placeholder={"Time"}
                inputPlaceholder={"Enter time"}
                disabled={false}
                name="ticketcategorys"
                handleChange={handleTimeChange}
              />
            </div>
            <p className="w-full text-left font-bold text-primary">
              Ticket price
            </p>
            {ticket?.map((ticket) => {
              return (
                <div className="w-full" key={ticket._id}>
                  <InputField
                    type="number"
                    placeholder={ticket.ticket_name}
                    inputPlaceholder={`Enter price of ${ticket.ticket_name}`}
                    disabled={false}
                    name="ticketcategorys"
                    handleChange={(e) =>
                      handlePriceChange(ticket._id, e.target.value)
                    }
                  />
                </div>
              );
            })}

            {taxGroup.length != 0 ? (
              <p className="w-full text-left font-bold text-primary">
                Tax list
              </p>
            ) : null}

            {taxGroup.map((i, index) => {
              console.log(taxGroup[index]);
              return (
                <>
                  <div
                    className="addMore flex flex-col items-start gap-[10px] border border-gray-300 w-full bg-gray-100 p-4  rounded-md"
                    key={i}
                  >
                    <InputField
                      type={"text"}
                      placeholder={"Tax name"}
                      inputPlaceholder="Enter tax name"
                      name={"tax_name"}
                      value={taxGroup.tax_name}
                      handleChange={(e) => handleTaxChage(e, index)}
                    />
                    <InputField
                      type={"number"}
                      placeholder={"Tax percentage"}
                      inputPlaceholder="Enter tax percentage"
                      name={"tax_rate"}
                      value={taxGroup.tax_rate}
                      handleChange={(e) => handleTaxChage(e, index)}
                    />
                    <p
                      className="text-right bg-gray-200 p-2 w-auto"
                      onClick={() => taxRemove(index)}
                    >
                      Remove
                    </p>
                  </div>
                  <hr className="w-full" />
                </>
              );
            })}

            <div
              className={`addBranchButton py-2 border-2 border-gray-300 rounded-2xl flex justify-center w-full `}
              onClick={addTaxGroup}
            >
              <p className=" flex items-center font-medium">
                <BsPlus className="text-3xl me-3" />
                Add Tax
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-16 mb-24">
            <PrimaryButton
              background={"primary-button"}
              handleClick={handleClick}
              title={"Submit"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewEvent;
