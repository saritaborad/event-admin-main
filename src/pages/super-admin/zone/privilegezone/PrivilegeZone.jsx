import React, { useEffect, useState } from "react";
import { BsGeo, BsSearch } from "react-icons/bs";
import AddButton from "../../../../componets/ui-elements/AddButton";
import InfoButton from "../../../../componets/ui-elements/InfoButton";
import { Link } from "react-router-dom";
import { makeApiCall } from "../../../../api/Post";
import { filterByProperty } from "../../../../utils/CommonFunctions";

const PrivilegeZone = () => {
  const [zone, setZone] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getAllZone = async () => {
    try {
      const response = await makeApiCall("get", "/zone/all", null, "raw");
      console.log(response);
      if (response.data.tickets != null) {
        const filterResponse = response.data.tickets;
        const result = filterByProperty(filterResponse, "is_privilege", true);
        setZone(result);
      } else {
        alert("Pass-zone list is empty");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllZone();
  }, []);

  const sortedData = zone
    ?.slice()
    .sort((a, b) => a.zone_name.localeCompare(b.zone_name));
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const searchData = sortedData?.filter((item) =>
    item.zone_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
      <AddButton
        title={"Privilege Zone"}
        link={"/role/superadmin/privilege-zone/add-new"}
      />
        <div className="w-full p-4 rounded-xl bg-gray-200 my-5 flex items-center justify-start">
          <BsSearch />
          <input
            type="text"
            placeholder="Search privilege zone"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full h-auto flex flex-col gap-2  items-center mb-24">
          {searchData ? (
            searchData.length >= 0 ? (
              searchData?.map((zone, i) => {
                return (
                  <Link
                    to={`/role/superadmin/privilege-zone/${zone._id}`}
                    className="w-full"
                    key={i}
                  >
                    <InfoButton
                      icon={<BsGeo className="text-xl" />}
                      title={`${zone.zone_name}`}
                    />
                  </Link>
                );
              })
            ) : (
              <p className="text-xl text-center font-medium text-gray-400 mt-24">
                No Pass zone found
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
    </div>
  );
};

export default PrivilegeZone;
