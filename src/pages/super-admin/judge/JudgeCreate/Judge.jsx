import { BsSearch } from "react-icons/bs";
import { MdOutlinePersonOutline } from "react-icons/md";
import AddButton from "../../../../componets/ui-elements/AddButton";
import InfoButton from "../../../../componets/ui-elements/InfoButton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../../../api/Post";
import { filterByProperty } from "../../../../utils/CommonFunctions";
import UserCard from "../../../../componets/ui-elements/UserCard";

const Judge = () => {
  const [judge, setJudge] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAppointed, setIsAppointed] = useState(true);

  const getAllJudge = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "judge/getalljudge",
        `?assign=${isAppointed}`,
        "raw"
      );
      console.log(response.data.data);
      const filterdAdmin = filterByProperty(
        response.data.data,
        "is_deleted",
        false
      );
      console.log(filterdAdmin);
      setJudge(filterdAdmin);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllJudge();
  }, [isAppointed]);

  const sortedData = judge
    ?.slice()
    .sort((a, b) => a?.name.localeCompare(b.name));
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const searchData = sortedData?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      item.phone_number.includes(searchQuery?.toLowerCase())
  );

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
        <AddButton
          title={"Judge"}
          link={"/role/superadmin/judgedashboard/judge-create/add-new"}
        />
          <div className="w-full p-4 rounded-xl bg-gray-200 my-5 flex items-center justify-start">
            <BsSearch />
            <input
              type="text"
              placeholder="Search judge by name or phone"
              className="h-full w-full ms-3 outline-none bg-gray-200"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-full my-3 p-1 border border-gray-300 rounded-2xl">
            <div className="flex items-center">
              <div className="relative flex item-center justify-between w-full gap-3  border-gray-300">
                <div
                  className={`w-2/4 flex items-center justify-center text-[14px] h-[50px] rounded-xl text-center z-0 bg-primary absolute ${
                    isAppointed === false
                      ? " translate-x-full transition-all  "
                      : "translate-x-[0] transition-all "
                  }`}
                ></div>
                <div
                  className={`w-2/4 flex items-center justify-center text-[16px] h-[50px] rounded-xl z-50 text-center ${
                    isAppointed === true ? "text-white" : null
                  }`}
                  onClick={() => setIsAppointed(true)}
                >
                  Assigned
                </div>
                <div
                  className={`w-2/4 flex items-center justify-center text-[16px] h-[50px] rounded-xl z-50 text-center ${
                    isAppointed === true ? null : "text-white"
                  }`}
                  onClick={() => setIsAppointed(false)}
                >
                  Not Assigned
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
            {searchData ? (
              searchData.length > 0 ? (
                <div className="w-full h-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 items-center mb-24">
                  {searchData?.map((data, i) => {
                    return (
                      // <Link
                      //   to={`/role/superadmin/judgedashboard/judge/${data._id}`}
                      //   className="w-full"
                      //   key={i}
                      // >
                      <UserCard
                        key={i}
                        image={data.profile_pic}
                        name={data.name}
                        phoneNumber={data.phone_number}
                      />
                      // </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xl text-center font-medium text-gray-400 mt-24">
                  No Judge Found
                </p>
              )
            ) : (
              <>
                <div className="w-full h-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
                  <div className="h-[170px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
                  <div className="h-[170px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Judge;
