import React, { useEffect, useState } from "react";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import AddButton from "../../../componets/ui-elements/AddButton";
import { Link } from "react-router-dom";
import { BsFillPinFill, BsSearch } from "react-icons/bs";
import { makeApiCall } from "../../../api/Post";
import { filterByProperty } from "../../../utils/CommonFunctions";

const Checkpoint = () => {
  const [checkPoints, setCheckpoints] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getAllCheckpoint = async () => {
    try {
      const response = await makeApiCall("get", "checkpoint/all", null, "raw");
      // console.log(response);

      const filterdCHeckpoints = filterByProperty(
        response.data.data,
        "is_deleted",
        false
      );
      console.log(filterdCHeckpoints);
      setCheckpoints(filterdCHeckpoints);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCheckpoint();
  }, []);

  const sortedData = checkPoints
    ?.slice()
    .sort((a, b) => a.checkpoint_name.localeCompare(b.checkpoint_name));
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const searchData = sortedData?.filter((item) =>
    item.checkpoint_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] md:rounded-none mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:m-0 ">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
        <AddButton
          title={"Checkpoint"}
          link={"/role/superadmin/checkpoint/add-new"}
        />
          <div className="w-full p-4 rounded-xl bg-gray-200 my-5 flex items-center justify-start">
            <BsSearch />
            <input
              type="text"
              placeholder="Search checkpoint"
              className="h-full w-full ms-3 outline-none bg-gray-200"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-full h-auto flex flex-col gap-3 items-center mb-24">
            {searchData ? (
              searchData.length > 0 ? (
                searchData?.map((checkpoint, i) => {
                  return (
                    <Link
                      to={`/role/superadmin/checkpoint/${checkpoint._id}`}
                      className="w-full"
                      key={i}
                    >
                      <InfoButton
                        icon={<BsFillPinFill />}
                        title={checkpoint.checkpoint_name}
                      />
                    </Link>
                  );
                })
              ) : (
                <p className="text-xl font-medium text-gray-400 mt-24">
                  No Chechpoint Found
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
    </>
  );
};

export default Checkpoint;
