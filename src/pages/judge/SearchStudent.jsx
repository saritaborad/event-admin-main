import { useEffect, useState } from "react";
import { BsSearch, BsPhone, BsInstagram, BsTrophy } from "react-icons/bs";
import { LuScanLine } from "react-icons/lu";
import raas_black from "../../assets/raas-black.svg";
import { makeApiCall } from "../../api/Post";
import { filterByProperty } from "../../utils/CommonFunctions";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import black_user from "../../assets/blank_user.svg";

const SearchStudent = () => {
  const [passUser, setPassUser] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [openCategory, setCategory] = useState(false);
  const [rankOpen, setRankOpen] = useState(false)
  const [selectedRank, setSelectedRank] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [prizeCategory, setPrizeCategory] = useState();
  const [searchQueryCat, setSearchQueryCat] = useState("");

  const navigate = useNavigate()
  const location = useLocation();
  const eventId = location.state.event
  console.log("event", eventId)

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
  const handleSearchChangeCat = (event) => {
    setSearchQueryCat(event.target.value);
  };

  const searchDataCat = sortedData?.filter((item) =>
    item.prize_name.toLowerCase().includes(searchQueryCat.toLowerCase())
  );

  const getPhoneNoWiseSearch = async () => {
    try {
      let query = "";
      if (searchQuery) {
        query = `?phone_number=${searchQuery}`;
      }

      const response = await makeApiCall(
        "get",
        "judge/getpassuserphoneno",
        query,
        "raw"
      );
      console.log(response?.data);

      setPassUser(response?.data?.data);
      response.data ? setOpen(true) : setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectRank = () => {
    selectedRank ? (setRankOpen(false), assignRank()) : setRankOpen(true)
  };

  const handleSelect = () => {
    getAllPrizeCategories()
    setOpen(false);
    setCategory(true)
  };
  const handleSelectCat = () => {
    selectedCategory ? (
      setCategory(false),
      setRankOpen(true)
    ) : "";
  };

  const assignRank = async () => {
    try {
      const data = {
        pass_id: passUser?.pass_list,
        prize_category_id: selectedCategory,
        rank: selectedRank,
        event_id: eventId
      }
      console.log("data", data)
      const response = await makeApiCall(
        "post",
        "judge/assignprize",
        data,
        "raw"
      );
      console.log(response);
      navigate("/role/judge/editresult", { state: { passId: passUser?.pass_list } })
      if (response.data.status === 1) {

        // setStatus("complete");
        // setSuccessMsg(response.data.message);
      } else {
        // setStatus("error");
        // setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.warn(error);
      // setStatus("error");
      // setErrorMsg("Something went wrong");
    }
  }

  const rankPrizeData = [
    { value: "01", label: "01" },
    { value: "02", label: "02" },
    { value: "03", label: "03" },
    { value: "04", label: "04" },
    { value: "05", label: "05" },
    { value: "06", label: "06" },
    { value: "07", label: "07" },
    { value: "08", label: "08" },
    { value: "09", label: "09" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ];

  return (
    <>
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
        <div className="button mt-3">
          <div className="flex gap-4">
            <div className="phone bg-black w-full rounded-xl">
              <button
                className="text-white w-full py-4 flex items-center justify-center"
                onClick={getPhoneNoWiseSearch}
              >
                <BsPhone className="text-xl mx-2" />
                Phone
              </button>
            </div>
            <div className="phone bg-primary w-full rounded-xl">
              <button className="text-white w-full py-4 flex items-center justify-center">
                <LuScanLine className="text-xl mx-2" />
                Scan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Judge Popup Start */}
      {open ? (
        <div className="h-screen w-screen flex items-center justify-center bg-[#000000a1] backdrop-blur-[5px] top-0 left-0 fixed z-[50]">
          <div
            className={`w-[90%] text-xl h-auto min-h-[80px] max-h-[500px] bg-white rounded-[30px] flex flex-col justify-center items-center relative`}
          >
            <div className="parking w-full ">
              <div className="top text-center ">
                <div className="image bg-white border-4 border-white rounded-full absolute h-[90px] w-[90px] top-[-45px] left-0 right-0 m-auto flex place-content-center overflow-hidden ">
                  <img
                    src={passUser?.profile_pic ? passUser?.profile_pic : black_user}
                    alt="image"
                    className="h-full w-full "
                  />
                </div>
                <div className="number mt-16">
                  <h3 className="text-center text-xl font-medium">
                    {passUser?.name}
                  </h3>
                  <p className="text-sm">{passUser?.phone_number}</p>
                </div>
                <div className="parking text-center my-3 flex items-center justify-center">
                  <p className="text-sm rounded-full bg-gray-200 px-4 py-1">
                    {passUser?.gender}
                  </p>
                </div>
                <div className="info flex items-center gap-5 mx-3">
                  <div className="insta flex items-center w-full">
                    <BsInstagram className="text-2xl mx-2" />
                    <div className="text-start">
                      <p className="text-sm text-gray-400">
                        {passUser?.owener_of_garba_class?.instagram_id}
                      </p>
                      <p className="text-lg"></p>
                    </div>
                  </div>
                  <div className="className flex items-center w-full">
                    <img src={raas_black} alt="image" className="h-7 mx-2" />
                    <div className="text-start">
                      {/* <p className="text-sm text-gray-400">{passUser?.pass_list?.sesone_name}</p> */}
                      <p className="text-lg ">
                        {passUser?.owener_of_garba_class?.garba_classname}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="button w-full gap-3 py-5 px-14">
                <button
                  className="bg-[#13B841] text-white w-full p-4 rounded-full text-lg font-medium"
                  onClick={handleSelect}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {openCategory ? (
        <div className="h-screen w-screen flex items-center justify-center bg-[#000000a1] backdrop-blur-[5px] top-0 left-0 fixed z-[50]">
          <div className={`w-[90%] text-xl h-auto min-h-[80px] max-h-[500px] bg-white rounded-[30px] flex flex-col justify-center items-center relative`}>
            <div className="parking w-full ">
              <div className="top text-center margin-top">
                <p className="text-center font-medium mb-4">Categories</p>
                <div className="number mt-16">
                  <h3 className="text-center text-xl font-medium">
                    < div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
                      <BsSearch />
                      <input
                        type="text"
                        placeholder="Search Student"
                        className="h-full w-full ms-3 outline-none bg-gray-200"
                        value={searchQueryCat}
                        onChange={handleSearchChangeCat}
                      />
                    </div>
                  </h3>
                </div>
                <div className="parking text-center my-3 items-center justify-center">
                  {searchDataCat ? (
                    searchDataCat.length > 0 ? (
                      searchDataCat?.map((data, i) => {
                        return (
                          <div className="p-4 flex items-center border rounded-2xl" key={i}>
                            <p>{data.prize_name}</p>
                            <input type="radio" className="ms-auto accent-primary"
                              checked={selectedCategory === data._id}
                              onChange={() => setSelectedCategory(data._id)}
                            />
                          </div>
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
                  {/* </div> */}
                </div>
              </div>
              <div className="button w-full gap-3 py-5 px-14">
                <button
                  className="bg-[#13B841] text-white w-full p-4 rounded-full text-lg font-medium"
                  onClick={handleSelectCat}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {rankOpen ? (
        <div className="h-screen w-screen fixed top-0 left-0 flex items-center justify-center bg-[#000000a1] backdrop-blur-[5px] z-[50]">
          <div className="w-[90%] max-w-[500px] h-auto min-h-[100px] max-h-[500px] bg-white rounded-[30px] flex flex-col justify-center items-center relative">
            <div className="parking w-full">
              <div className="top text-center mt-6">
                <p className="text-center font-medium mb-4">Rank</p>
                <div className="parking-scrollable overflow-y-auto max-h-[300px]"> {/* Added a new container */}
                  {rankPrizeData ? (
                    rankPrizeData.length > 0 ? (
                      rankPrizeData.map((data, i) => {
                        return (
                          <div key={i} className="p-4 flex items-center border rounded-2xl">
                            <p>{data.label}</p>
                            <input type="radio" className="ml-auto accent-primary" value={data.value}
                              checked={selectedRank === data.value}
                              onChange={() => setSelectedRank(data.value)} />
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xl text-center font-medium text-gray-400 mt-24">
                        No Rank Found
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
              <div className="button w-full gap-3 py-5 px-14">
                <button
                  className="bg-[#13B841] text-white w-full p-4 rounded-full text-lg font-medium"
                  onClick={handleSelectRank}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* Judge Popup End */}

      {/* Categories Popup Start */}
      {/* {openCategory?
      <div className="h-screen w-screen flex items-end justify-center bg-[#000000a1] backdrop-blur-[5px] top-0 left-0 fixed z-[50]">
        <div className="w-[95%] text-xl h-auto min-h-[80px] max-h-[500px] bg-white rounded-t-[30px] flex flex-col justify-center items-center">
          <div className="parking w-full p-4">
            <p className="text-center font-medium mb-4">Categories</p>
            <div className="p-4 flex items-center border rounded-2xl">
              <p>Best Outfits</p>
              <input type="radio" className="ms-auto accent-primary" />
            </div>
            <div className="button w-full gap-3 py-5 px-12">
              <button className="bg-primary text-white w-full p-3 rounded-full text-lg font-medium">
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
      :""} */}
      {/* Categories Popup End */}
    </>
  );
};

export default SearchStudent;
