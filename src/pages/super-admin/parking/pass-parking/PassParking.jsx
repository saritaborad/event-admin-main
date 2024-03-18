import React, { useState, useEffect } from "react";
import InfoButton from "../../../../componets/ui-elements/InfoButton";
import AddButton from "../../../../componets/ui-elements/AddButton";
import { Link } from "react-router-dom";
import { LuParkingSquare } from "react-icons/lu";
import { BsSearch } from "react-icons/bs";
import { makeApiCall } from "../../../../api/Post";
import { filterByProperty } from "../../../../utils/CommonFunctions";

const PassParking = () => {
  const [parking, setParking] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getAllParking = async () => {
    try {
      const response = await makeApiCall("get", "/parking/all", null, "raw");
      if (response.data.data != null) {
        const filterResponse = response.data.data;
        const result = filterByProperty(filterResponse, "pass_parking", true);
        const filterdCHeckpoints = filterByProperty(
          result,
          "is_deleted",
          false
        );
        setParking(filterdCHeckpoints);
        console.log(result);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllParking();
  }, []);

  const sortedData = parking
    ?.slice()
    .sort((a, b) => a.parking_name.localeCompare(b.parking_name));
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const searchData = sortedData?.filter((item) =>
    item.parking_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(searchData);

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
        <AddButton
          title={"Parking Pass"}
          link={
            "/role/superadmin/parkingdashboard/passparking/add-new-pass-parking"
          }
        />
        <div className="w-full p-4 rounded-xl bg-gray-200 my-5 flex items-center justify-start">
          <BsSearch />
          <input
            type="text"
            placeholder="Search pass parking"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
          {parking === undefined ? (
            <>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
            </>
          ) : searchData.length > 0 ? (
            searchData?.map((parking, i) => {
              return (
                <Link
                  to={`/role/superadmin/parkingdashboard/passparking/${parking._id}`}
                  className="w-full"
                  key={i}
                >
                  <InfoButton
                    icon={<LuParkingSquare className="text-xl" />}
                    title={`${parking.parking_name}`}
                  />
                </Link>
              );
            })
          ) : (
            <p className="text-xl text-center font-medium text-gray-400 mt-24">
              No Pass parking found
            </p>
          )}
        </div>
        </div>
      </div>
    </>
  );
};

export default PassParking;
