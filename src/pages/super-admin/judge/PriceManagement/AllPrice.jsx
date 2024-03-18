import React, { useEffect, useState } from "react";
import AddButton from "../../../../componets/ui-elements/AddButton";
import { Link, useLocation } from "react-router-dom";
import black_image from "../../../../assets/blank_user.svg";
import InfoButton from "../../../../componets/ui-elements/InfoButton";
import { makeApiCall } from "../../../../api/Post";
import { filterByProperty } from "../../../../utils/CommonFunctions";
import { BsSearch } from "react-icons/bs";

const AllPrice = () => {
  const location = useLocation();
  const eventId = location.state.event;
  console.log("event", eventId);

  const [prize, setPrize] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getAllPrize = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "judge/getallprizecategories",
        "",
        "raw"
      );
      console.log(response?.data?.data);
      const filterdAdmin = filterByProperty(
        response?.data?.data,
        "is_deleted",
        false
      );
      console.log(filterdAdmin);
      setPrize(filterdAdmin);
    } catch (error) {
      console.error(error);
    }
  };

  const sortedData = prize
    ?.slice()
    .sort((a, b) => a?.prize_name.localeCompare(b.prize_name));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchData = sortedData?.filter((item) =>
    item?.prize_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    getAllPrize();
  }, []);

  return (
    <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
        <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
          <BsSearch />
          <input
            type="text"
            placeholder="Search price category"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full h-auto flex flex-col gap-2 mt-5 items-center mb-24">
          {searchData?.map((prize, i) => {
            return (
              <Link
                to={`/role/superadmin/judgedashboard/pricemanagement/allprice/pricemember`}
                state={{ event: eventId, category: prize._id }}
                className="w-full"
                key={i}
              >
                <InfoButton title={prize?.prize_name} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllPrice;
