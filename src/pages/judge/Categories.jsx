import React, { useState, useEffect } from "react";
import { BsSearch, BsTrophy } from "react-icons/bs";
import { makeApiCall } from "../../api/Post";
import { filterByProperty } from "../../utils/CommonFunctions";
import InfoButton from "../../componets/ui-elements/InfoButton";
import { Link } from "react-router-dom";

const Categories = () => {
  const [prizeCategory, setPrizeCategory] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getAllPrizeCategories = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "judge/getallprizecategories",
        "",
        "raw"
      );
      console.log(response?.data?.data);
      const filterdAdmin = filterByProperty(
        response.data.data,
        "is_deleted",
        false
      );
      console.log(filterdAdmin);
      setPrizeCategory(filterdAdmin);
    } catch (error) {
      console.error(error);
    }
  };
  const sortedData = prizeCategory
    ?.slice()
    .sort((a, b) => a.prize_name.localeCompare(b.prize_name));
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const searchData = sortedData?.filter((item) =>
    item.prize_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    getAllPrizeCategories();
  }, []);

  return (
    <div className="h-full m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
        <BsSearch />
        <input
          type="text"
          placeholder="Search Student"
          className="h-full w-full ms-3 outline-none bg-gray-200"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
        {searchData ? (
          searchData.length > 0 ? (
            searchData?.map((data, i) => {
              return (
                <InfoButton
                  icon={<BsTrophy className="text-xl" />}
                  title={data.prize_name}
                />
              );
            })
          ) : (
            <p className="text-xl text-center font-medium text-gray-400 mt-24">
              No PrizeCategory Found
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
      {/* <div className="data">
        <InfoButton title={"Price"} />
      </div> */}
    </div>
  );
};

export default Categories;
