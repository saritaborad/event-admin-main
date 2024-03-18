import { BsSearch, BsTrophy } from "react-icons/bs";
import AddButton from "../../../../componets/ui-elements/AddButton";
import InfoButton from "../../../../componets/ui-elements/InfoButton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../../../api/Post";
import { filterByProperty } from "../../../../utils/CommonFunctions";

const PriceCategory = () => {
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

  useEffect(() => {
    getAllPrizeCategories();
  }, []);

  const sortedData = prizeCategory
    ?.slice()
    .sort((a, b) => a.prize_name.localeCompare(b.prize_name));
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const searchData = sortedData?.filter((item) =>
    item.prize_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
        <AddButton
          title={"Price Category"}
          link={"/role/superadmin/judgedashboard/price-category/add-new"}
        />
          <div className="w-full p-4 rounded-xl bg-gray-200 my-5 flex items-center justify-start">
            <BsSearch />
            <input
              type="text"
              placeholder="Search price category"
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
                    <Link
                      to={`/role/superadmin/judgedashboard/price-category/${data._id}`}
                      className="w-full"
                      key={i}
                    >
                      <InfoButton
                        icon={<BsTrophy className="text-xl" />}
                        title={data.prize_name}
                      />
                    </Link>
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
        </div>
      </div>
    </>
  );
};

export default PriceCategory;
