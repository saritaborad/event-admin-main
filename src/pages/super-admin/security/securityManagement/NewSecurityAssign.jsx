import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { makeApiCall } from "../../../../api/Post";
import SecurityCard from "../../../../componets/ui-elements/SecurityCard";
import defaultUser from "../../../../assets/blank_user.svg";
import { BsSearch } from "react-icons/bs";

const NewSecurityAssign = () => {
  const [data, setData] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const params = useParams();
  const securityType = params.type;

  const fetchData = async () => {
    try {
      const response = await makeApiCall(
        "get",
        // "guard/" + securityType,
        "guard/all",
        null,
        "raw"
      );
      if (response.data.status === 1) {
        const rawData = response.data.data;
        const filteredData = rawData.filter(
          (item) =>
            !(
              "gate" in item ||
              "checkpoint" in item ||
              "zone" in item ||
              "parking" in item
            )
        );
        setData(filteredData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sortedData = data
    ?.slice()
    .sort((a, b) => a.guard_name.localeCompare(b.guard_name));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchData = sortedData?.filter(
    (item) =>
      item.guard_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone_number.includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
            <BsSearch />
            <input
              type="text"
              placeholder="Search security by name or phone"
              className="h-full w-full ms-3 outline-none bg-gray-200"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="grid grid-cols-2 mb-24 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {searchData ? (
              searchData.length > 0 ? (
                searchData?.map((el, i) => {
                  return (
                    <SecurityCard
                      key={i}
                      image={el.profile_pic ? el.profile_pic : defaultUser}
                      name={el.guard_name}
                      id={el._id}
                      isAssign={true}
                      type={securityType} 
                      typeId={params.id}
                      phone_no={el.phone_number}
                    />
                  );
                })
              ) : (
                <p className="text-xl font-medium text-gray-400 mt-24">
                  No Data Found
                </p>
              )
            ) : (
              <>
                <div className="h-[170px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
                <div className="h-[170px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
                <div className="h-[170px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewSecurityAssign;
