import React from "react";
import { BsGeoAlt } from "react-icons/bs";

const JudgeEventCard = ({ image, date, time, name, location }) => {
  return (
    <div className="eventCardShadow w-full rounded-2xl bg-white mt-5">
      <div className="event p-3">
        <div className="eventImage h-32 rounded-xl overflow-hidden">
          <img src={image} alt="image" className="h-full w-full object-cover" />
        </div>
        <div className="eventinfo px-2">
          <div className="dateTime pt-4">
            <p className="text-sm text-primary font-semibold">
              {date} {time}
            </p>
          </div>
          <div className="eventName pt-1">
            <p className="text-xl font-semibold">{name}</p>
          </div>
          <div className="eventLocation flex items-center py-1">
            <BsGeoAlt className="text-gray-400 text-[14px]" />
            <p className="ps-1 text-[14px] text-gray-400">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeCard;
