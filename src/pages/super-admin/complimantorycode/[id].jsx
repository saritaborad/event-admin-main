import React, { useEffect, useState } from "react";
import {
  BsPercent,
  BsTag,
  BsPerson,
  BsTicketPerforatedFill,
  BsTagFill,
} from "react-icons/bs";
import { FaParking } from "react-icons/fa";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import ValueInput from "../../../componets/ui-elements/ValueInput";
import { makeApiCall } from "../../../api/Post";
import Loader from "../../../componets/ui-elements/Loader";
import InputField from "../../../componets/ui-elements/InputField";
import {
  filterByProperty,
  formatDateToDDMMMYYYY,
} from "../../../utils/CommonFunctions";

const Info = () => {
  const [loading, setLoading] = useState(false);
  const [complimantoryCode, setComplimantoryCode] = useState();
  const [phoneNo, setPhoneNo] = useState();

  const [isEditable, setIsEditable] = useState(false);

  const navigate = useNavigate();
  const param = useParams();
  const complimantorycode = param.coupon_code;
  const phone_no = param.phone_no;
  const [ticketTotal, setTicketTotal] = useState(0);
  const [bikeParking, setBikeParking] = useState([]);
  const [carParking, setCarParking] = useState([]);
  const [event, setEvent] = useState();

  const findPromocode = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall(
        "get",
        "user/allcomplimantorycode",
        null,
        "raw"
      );
      if (response.data.status === 1) {
        const findComplimantoryCode = filterByProperty(
          response.data.data,
          "coupon_code",
          complimantorycode
        );

        try {
          const event = await makeApiCall(
            "get",
            `event/info/${findComplimantoryCode[0].order.event._id?findComplimantoryCode[0].order.event._id:findComplimantoryCode[0].order.event}`,
            null,
            "raw"
          );
          if (event.data.status === 1) {
            setEvent(event.data.data);
          } else if (event.data.status === 10) {
          } else {
            console.log(event);
          }
        } catch (error) {
          console.error(error);
        }

        setComplimantoryCode(findComplimantoryCode[0]);
        let parkings = findComplimantoryCode[0].order.parkings;

        const rawBikeParking = filterByProperty(
          parkings,
          "two_wheeler_parking",
          true
        );
        const rawCarParking = filterByProperty(parkings, "car_parking", true);

        setBikeParking(rawBikeParking);
        setCarParking(rawCarParking);

        setLoading(false);
      } else {
        console.log(response);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    findPromocode();
  }, []);

  const formatedDate = formatDateToDDMMMYYYY(event?.event_date);

  console.log(complimantoryCode);

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="h-auto m-[2px] p-[25px]  mt-4 flex flex-col gap-[20px] bg-white justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="promoCode flex items-center p-2 border border-gray-400 rounded-xl">
          <BsTagFill className="text-primary text-xl" />
          <p className="ms-3 text-xl font-medium">
            {complimantoryCode?.coupon_code}
          </p>
        </div>

        <div className="p-3 border border-gray-400 text-xl w-full rounded-xl">
          <p>
            Contact no :
            <span className="font-semibold">
              {" "}
              {complimantoryCode?.phone_number}
            </span>
          </p>
        </div>
        <div className="p-3 border border-gray-400 text-xl w-full rounded-xl">
          <p>
           Provided by :
            <span className="font-semibold capitalize">
              {" "}
              {complimantoryCode?.provided_by}
            </span>
          </p>
        </div>

        <div className="eventInfo p-3 border border-gray-400 w-full flex items-start justify-between rounded-2xl mt-2">
          <div className="eventName">
            <h3 className="text-xl font-semibold">{event?.event_name}</h3>
            <p className="text-sm text-gray-400 mt-1">
              {event?.event_location}
            </p>
            <p className="text-sm mt-1">
              {formatedDate} <span>|</span> {event?.event_time}{" "}
            </p>
          </div>
          <div className="day text-center bg-black py-2 px-3 rounded-2xl">
            <p className="text-white text-sm">
              {event?.event_day}
              <br />
              DAY
            </p>
          </div>
        </div>
        {complimantoryCode?.order.tickets.length > 0 ? (
          <div className="ticketInfo p-3 border border-gray-400 w-full rounded-2xl">
            <div className="ticket flex items-center">
              <BsTicketPerforatedFill className="text-2xl text-primary" />
              <h3 className="font-semibold text-lg ms-3">Tickets</h3>
            </div>

            <div className="ticketsShow">
              {complimantoryCode?.order.tickets.map((ticketData, i) => {
                const colorCode = ticketData?.color_code?.slice(4);
                return (
                  <>
                    <div className="vip flex items-center mt-2" key={i}>
                      <div
                        className={` bg-red-500 rounded-full py-2 px-5`}
                        style={{ backgroundColor: "#" + colorCode }}
                      >
                        <p className="text-sm font-medium text-white">
                          {ticketData.ticket_name}
                        </p>
                      </div>
                      <p className="ms-2">x {ticketData.qty}</p>
                      <div className="price ms-auto">
                        <p className="text-sm mx-2">₹ {ticketData.price}</p>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        ) : // <p className="text-center font-medium">No Tickets</p>
        null}

        <div className="parkingInfo p-3 border border-gray-400 w-full rounded-2xl mb-24">
          <div className="parking flex items-center">
            <FaParking className="text-2xl text-primary" />
            <h3 className="font-semibold text-lg ms-3">Parking</h3>
          </div>

          {bikeParking.length > 0 && (
            <div className="showTickets">
              <p className="mt-3">Two wheeler</p>
              {bikeParking.map((bikeParkingData, i) => {
                const colorCode = bikeParkingData?.color_code?.slice(4);
                return (
                  <>
                    <div className="vip flex items-center mt-2" key={i}>
                      <div
                        className={` bg-red-500 rounded-full py-2 px-5`}
                        style={{ backgroundColor: "#" + colorCode }}
                      >
                        <p className="text-sm font-medium text-white">
                          {bikeParkingData.parking_name}
                        </p>
                      </div>
                      <p className="ms-2">x {bikeParkingData.qty}</p>
                      <div className="price ms-auto">
                        <p className="text-sm mx-2">₹{bikeParkingData.price}</p>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}

          {carParking.length > 0 && (
            <div className="showTickets">
              <p className="mt-3">Four wheeler</p>
              {carParking.map((carParkingData, i) => {
                const colorCode = carParkingData?.color_code?.slice(4);
                return (
                  <>
                    <div className="vip flex items-center mt-2" key={i}>
                      <div
                        className={` bg-red-500 rounded-full py-2 px-5`}
                        style={{ backgroundColor: "#" + colorCode }}
                      >
                        <p className="text-sm font-medium text-white">
                          {carParkingData.parking_name}
                        </p>
                      </div>
                      <p className="ms-2">x {carParkingData.qty}</p>
                      <div className="price ms-auto">
                        <p className="text-sm mx-2">₹{carParkingData.price}</p>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Info;
