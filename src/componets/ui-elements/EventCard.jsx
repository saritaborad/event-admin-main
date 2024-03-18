import React from "react";
import { BsGeoAlt,BsEyeFill } from "react-icons/bs";
import {BiDuplicate} from "react-icons/bi";

const EventCard = ({
  image,
  date,
  time,
  name,
  location,
  handleClick,
  handleDuplicate,
  leftday
  
}) => {
  return (
    <>
      <div className="eventCardShadow w-full rounded-2xl cursor-pointer">
        <div className="event p-3">
          <div className="eventImage h-32 rounded-xl overflow-hidden">
            <img
              src={image}
              alt="image"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="eventinfo px-2">
            <div className="dateTime pt-4">
              <p className="text-sm text-primary font-semibold">
                {date} {time}
              </p>
              <p className="text-sm text-primary font-semibold">
                {leftday}
              </p>
            </div>
            <div className="eventName pt-1">
              <p className="text-xl font-semibold">{name}</p>
            </div>
            <div className="eventLocation flex items-center py-1">
              <BsGeoAlt className="text-gray-400 text-[14px]" />
              <p className="ps-1 text-[14px] text-gray-400">{location}</p>
            </div>
            <div className="button w-full flex gap-3 justify-center py-2">
              <button
                onClick={handleClick}
                className="font-semibold flex justify-center items-center gap-2 bg-primary text-white p-2 rounded-lg w-full"
              >
                <BsEyeFill/>
                View Details
              </button>
              <button
                className="font-semibold flex justify-center items-center gap-2 border-2 border-primary p-2 rounded-lg w-full"
                onClick={handleDuplicate}
              >
                <BiDuplicate />
                Duplicate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventCard;
// 21.123151443098898, 72.79400169539058
// https://maps.app.goo.gl/A6obkqM8Rnbtr4EcA
