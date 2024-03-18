import React from "react";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import AddButton from "../../../componets/ui-elements/AddButton";
import { Link } from "react-router-dom";
import { BsFillMegaphoneFill, BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import UserCard from "../../../componets/ui-elements/UserCard";

const Sponsor = () => {
  const [sopnsor, setSponsor] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getAllSponsor = async () => {
    try {
      const response = await makeApiCall("get", "sponsor/all", null);
      console.log(response);
      setSponsor(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllSponsor();
  }, []);

  const sortedData = sopnsor
    ?.slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const searchData = sortedData?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <AddButton
          title={"Sponsor"}
          link={"/role/superadmin/sponsordashboard/sponsor/add-new"}
        />
        <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
          <BsSearch />
          <input
            type="text"
            placeholder="Search sponsor"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
          {searchData ? (
            searchData.length > 0 ? (
              <div className="w-full h-auto grid grid-cols-2 md:grid-cols-3 md lg:grid-cols-4 xl:grid-cols-5 gap-2 items-center mb-24">
                {searchData?.map((sponsor, i) => {
                  return (
                    <Link
                      to={`/role/superadmin/sponsordashboard/sponsor/${sponsor._id}`}
                      className="w-full"
                      key={i}
                    >
                      <UserCard
                        image={sponsor.profile_pic}
                        name={sponsor.name}
                        phoneNumber={sponsor.phone_number}
                      />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-xl text-center font-medium text-gray-400 mt-24">
                No Sponsor Found
              </p>
            )
          ) : (
            <>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sponsor;
