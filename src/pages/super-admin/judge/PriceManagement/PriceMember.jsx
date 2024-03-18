import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import black_image from "../../../../assets/blank_user.svg";
import { makeApiCall } from "../../../../api/Post";
import { filterByProperty } from "../../../../utils/CommonFunctions";

const PriceMember = () => {
  const location = useLocation();
  const eventId = location.state.event;
  const category_id = location.state.category;
  console.log("event", eventId, category_id);

  const [prizeMember, setPrizeMember] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getResult = async () => {
    try {
      let data = {
        event_id: eventId,
        prize_categroies_id: category_id,
      };
      console.log("data", data);
      const response = await makeApiCall("post", "judge/result", data, "raw");
      console.log(response.data.data);
      // const filterdAdmin = filterByProperty(
      //   response.data.data,
      // );
      // console.log(filterdAdmin);
      setPrizeMember(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  // const sortedData = prizeMember
  //   ?.slice()
  //   .sort((a, b) => a.winner.rank.localeCompare(b.winner.rank));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchData = prizeMember?.filter((item) =>
    item.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
        <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
          <BsSearch />
          <input
            type="text"
            placeholder="Search item"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
          <div className="w-full h-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 items-center mb-24">
            {searchData?.map((member, i) => {
              return (
                <PriceMemberCard
                  key={i}
                  image={member.user.profile_pic}
                  name={member.user.name}
                  phoneNumber={member.user.phone_number}
                  rank={member.winner.rank}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceMember;

const PriceMemberCard = ({ image, name, phoneNumber, rank }) => {
  return (
    <>
      <div
        className="bg-white p-3 rounded-xl h-auto"
        style={{ boxShadow: "0px 0px 20px #0000002b" }}
      >
        <div className="flex justify-end items-center">
          <p className="text-white bg-[#13B841] p-2 rounded-full h-6 w-6 text-sm flex items-center justify-center">
            {rank}
          </p>
        </div>
        <div className="garbaImage flex justify-center items-center overflow-hidden">
          <img
            src={image ? image : black_image}
            alt="image"
            className="w-[70px] h-[70px] rounded-3xl"
          />
        </div>
        <div className="garbaText my-4 text-center">
          <h1 className="text-xl font-medium">{name}</h1>
          <p className="text-sm text-gray-400 my-1">{phoneNumber}</p>
        </div>
      </div>
    </>
  );
};
