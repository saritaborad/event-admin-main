import React, { useEffect, useState } from "react";
import AddButton from "../../../componets/ui-elements/AddButton";
import { makeApiCall } from "../../../api/Post";
import { BsSearch } from "react-icons/bs";
import UserCard from "../../../componets/ui-elements/UserCard";
import { Link } from "react-router-dom";

const SalesTeam = () => {

  const [allSalesTeam,setAllSalesTeam]=useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getAllSalesTeam = async () => {
    try {
      const response = await makeApiCall("get", "user/allsalesteam", null, "raw");
      console.log(response);
      if (response.data.status === 1) {
        setAllSalesTeam(response.data.data);
        // const filterdGates = filterByProperty(
        //   response.data.gates,
        //   "is_deleted",
        //   false
        // );
        // console.log(filterdGates);
        // setGates(filterdGates);
      } else if (response.data.status === 10) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllSalesTeam();
  }, []);

  console.log(allSalesTeam)

    const sortedData = allSalesTeam?.slice()
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
          title={"Sales Team"}
          link={"/role/superadmin/salesteam/add-new"}
        />
        <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
          <BsSearch />
          <input
            type="text"
            placeholder="Search sales team by name"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full h-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 items-center mb-24">
          {searchData ? (
            searchData.length > 0 ? (
              searchData?.map((el, i) => {
                return (
                  // <Link
                  //   to={`/role/superadmin/gate/${el._id}`}
                  //   className="w-full"
                  //   key={i}
                  // >
                  //   </Link>
                    <UserCard
                      name={el.name}
                      image={el.profile_pic}
                      phoneNumber={el.phone_number}
                    />
                );
              })
            ) : (
              <p className="text-xl text-center font-medium text-gray-400 mt-24">
                No Salest team Found
              </p>
            )
          ) : (
            <>
              <div className="h-[180px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[180px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[180px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SalesTeam;
