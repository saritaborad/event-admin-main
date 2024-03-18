import React, { useEffect, useState } from "react";
import { dashBordData } from "../../utils/dashBordData";
import { Link, useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../api/Post";
import { useQuery } from "react-query";
import { BsBellFill, BsSearch } from "react-icons/bs";
import blank_user from "../../assets/blank_user.svg";
import BotttmNavbar from "../../componets/BotttmNavbar";
import { MdKeyboardArrowDown } from "react-icons/md";
import { handleLogout } from "../../utils/CommonFunctions";

const superAdmin = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const [filterData,setFilterData]=useState();

  const handleNavigate = (path) => {
    navigate("/role/superadmin" + path);
  };


  const fetchData = async () => {
    const response = await makeApiCall(
      "get",
      "user/info/",
      null,
      "raw"
    );
    return response;
  };

  const { isLoading, error, data } = useQuery("classOwnerData", fetchData);

  useEffect(() => {
    if (isLoading === false) {
      if(data.data.status===1){
        setUserDetails(data.data.data);
        const access_ids = data.data.data?.access_ids;
        const filteredAccess = dashBordData.filter(item => access_ids.includes(item.UID));
        setFilterData(filteredAccess)
      }
    }
  }, [isLoading]);

  const sortedData = filterData
    ?.slice()
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchData = sortedData?.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(dashBordData)
  console.log(userDetails?.access_ids)

  return (
    <>
      <div className="adminPanel h-full md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="shadow-md bg-white px-6 py-4 h-auto items-center flex justify-between">
          <div className="flex items-center gap-4">
            <div className="avtar flex items-center justify-center overflow-hidden h-14 w-14 rounded-full ">
              <img
                src={
                  userDetails?.profile_pic
                    ? userDetails.profile_pic
                    : blank_user
                }
                alt="image"
                className={` ${
                  userDetails?.profile_pic ? null : "animate-pulse"
                }`}
              />
            </div>
            <div>
              {userDetails ? (
                <h1 className="text-lg text-black font-semibold ">
                  {userDetails.name}
                </h1>
              ) : (
                <div className="h-[28px] bg-gray-200 rounded-sm w-full animate-pulse"></div>
              )}
              {userDetails ? (
                <h1 className="text-sm text-gray-500 font-light capitalize">
                  {userDetails.roles}
                </h1>
              ) : (
                <div className="h-[28px] bg-gray-200 rounded-sm w-full animate-pulse"></div>
              )}
            </div>
          </div>

                <div className="ms-auto flex items-center gap-4">
          <Link to="/role/superadmin/notification-page">
            <div className="h-10 w-10 bg-black flex items-center justify-center rounded-full shadow-sm relative">
              <BsBellFill className="text-white text-xl" />
              {userDetails?.notifications.length > 0 ? (
                <div className="bg-primary absolute h-4 w-4 rounded-full top-[-5px] right-0 flex items-center justify-center text-[10px] text-white">
                  {userDetails?.notifications.length}
                </div>
              ) : null}
            </div>
          </Link>

          <MdKeyboardArrowDown
            className={`text-2xl text-gray-500 cursor-pointer ${
              showMenu === true ? "-rotate-90" : "rotate-0"
            }`}
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu === true ? (
            <div className="logout bg-gray-200 p-2 rounded-lg absolute top-20 right-7">
              <p
                className="bg-primary text-white px-5 py-1 rounded-lg cursor-pointer"
                onClick={() => handleLogout(navigate("/login"))}
              >
                Logout
              </p>
            </div>
          ) : null}
          </div>
        </div>

        <div className="bg-menu">
          <div className="adminData mx-3 py-5">
            <div className="w-full p-4 rounded-xl bg-white flex items-center justify-start gap-4">
              <BsSearch />
              <input
                type="text"
                placeholder="Search item"
                className="h-full w-full outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="dashboardText pt-5 ms-2">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>
            <div className="grid grid-cols-2 mb-24 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {searchData?.map((data, i) => {
                return (
                  <div
                    className="bg-white p-4 rounded-2xl mt-5 mx-2 h-40"
                    style={{ boxShadow: "0px 0px 20px #0000001b" }}
                    key={i}
                    onClick={() => handleNavigate(data.path)}
                  >
                    <div className="garbaImage bg-gray-200 rounded-2xl w-[70px] h-14 flex justify-center items-center p-3">
                      {<data.image className="text-3xl text-primary" />}
                    </div>
                    <div className="garbaText mt-3">
                      <h1 className="text-lg font-semibold">{data.title}</h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <BotttmNavbar />
    </>
  );
};

export default superAdmin;

