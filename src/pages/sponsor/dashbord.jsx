import React, { useEffect, useState } from "react";
import { makeApiCall } from "../../api/Post";
import { useQuery } from "react-query";
import {
  BsBellFill,
  BsSearch,
  BsWallet2,
  BsChevronRight,
} from "react-icons/bs";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import blank_user from "../../assets/blank_user.svg";
import BotttmNavbar from "../../componets/BotttmNavbar";
import { MdWallet } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { BiSolidDiscount } from "react-icons/bi";
import { sponsorDashboardData } from "../../utils/sponsorDashboardData";
import { MdKeyboardArrowDown } from "react-icons/md";
import { handleLogout } from "../../utils/CommonFunctions";

const SponsorDashbord = () => {
  const [userDetails, setUserDetails] = useState();
  const [transaction, setTransaction] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await makeApiCall("get", "user/info/", null, "raw");
    setUserDetails(response.data.data.sponsore);
    return response;
  };

  const { isLoading, error, data } = useQuery("classOwnerData", fetchData);

  const transactionData = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "user/transactionhistory",
        null,
        "raw"
      );
      console.log(response);
      if (response.data.status === 0) {
        setTransaction(response.data.data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    transactionData();
    fetchData();
    if (isLoading === false) {
      console.log(data.data.data.sponsore);
    }
  }, [isLoading]);

  const handleNavigate = (link) => {
    navigate("/role/sponsor/" + link);
  };

  return (
    <>
      <div className="h-auto md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="shadow-md bg-white px-6 py-4 h-auto items-center flex fixed top-0 w-full">
          <div className="flex items-center gap-4">
            <div className="avtar flex items-center justify-center overflow-hidden h-14 w-14 rounded-full ">
              <img
                src={
                  userDetails?.company_logo
                    ? userDetails.company_logo
                    : blank_user
                }
                alt="image"
                className={` w-full object-cover h-full ${
                  userDetails?.company_logo ? null : "animate-pulse"
                }`}
              />
            </div>
            <div>
              {userDetails ? (
                <h1 className="text-lg text-black font-semibold ">
                  {userDetails.authorized_person}
                </h1>
              ) : (
                <div className="h-[28px] bg-gray-200 rounded-sm w-full animate-pulse"></div>
              )}
              {userDetails ? (
                <h1 className="text-sm text-gray-500 font-light capitalize">
                  {userDetails.roles} ({userDetails.company_name})
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
                {/* {userDetails?.notifications.length > 0 ? (
                <div className="bg-primary absolute h-4 w-4 rounded-full top-[-5px] right-0 flex items-center justify-center text-[10px] text-white">
                  {userDetails?.notifications.length}
                </div>
              ) : null} */}
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
        <div className="h-20"></div>
        <div className="mx-4 my-4">
          <div
            className=" h-auto p-4 flex items-center justify-start gap-4 rounded-2xl"
            style={{ boxShadow: "0px 0px 20px #0000003b" }}
          >
            <div>
              <p className=" text-lg w-full text-gray-400 flex items-center justify-between">
                My Balance
              </p>
              <p className="text-3xl font-semibold my-2">
                ₹ {userDetails?.balance_alloted}.00
              </p>
            </div>
            <div className="ms-auto mx-5">
              <BsWallet2 className="text-4xl text-gray-400" />
            </div>
            {/* <p className="text-md  bg-green-200 text-green-500 border-green-500 border p-2 rounded-md"><MdWallet className="text-2xl" /> Balance : <span className=" font-bold  ">₹ 799</span></p> */}
          </div>

          <div className="logo my-5">
            <div className="text">
              <p className="text-lg font-medium">Company Logo</p>
            </div>
            <div
              className="image p-4 rounded-2xl my-3 flex justify-center items-center"
              style={{ boxShadow: "0px 0px 20px #0000003b" }}
            >
              <img
                src={userDetails?.company_logo}
                alt="image"
                className="h-40 w-40 rounded-full"
              />
            </div>
          </div>

          <div className="my-5">
            {sponsorDashboardData?.map((sponsorData, i) => {
              return (
                <div
                  className="bg-white p-3 rounded-2xl flex items-center"
                  style={{ boxShadow: "0px 0px 20px #0000003b" }}
                  key={i}
                  onClick={() => handleNavigate(sponsorData.path)}
                >
                  <div className="image w-[50px] h-12 flex justify-center items-center">
                    <img src={sponsorData.image} alt="image" />
                  </div>
                  <div className="Text mx-3">
                    <h1 className="text-lg font-semibold">
                      {sponsorData.title}
                    </h1>
                  </div>
                  <BsChevronRight className="ms-auto text-xl" />
                </div>
              );
            })}
          </div>

          <div
            className="transaction p-4 rounded-2xl"
            style={{ boxShadow: "0px 0px 20px #0000003b" }}
          >
            <div className="text flex items-center">
              <p className="text-lg font-semibold">Transaction</p>
              <p
                className="ms-auto text-primary underline"
                onClick={() => navigate("/role/sponsor/transaction-history")}
              >
                See All
              </p>
            </div>
            {transaction?.map((data, i) => {
              return (
                <>
                  <div
                    className="info flex items-center justify-between"
                    key={i}
                  >
                    <div className="data mt-5">
                      <p>OrderID : {data.order_id}</p>
                      <p className="text-gray-400 text-sm">Monday, 4:07 pm</p>
                    </div>
                    <div className="amount mt-5">
                      <p className="text-primary">- ₹{data.total}</p>
                    </div>
                    <div className="status mt-5">
                      <p className="text-white bg-[#F1B211] py-1 px-3 text-sm rounded-full">
                        {data.payment_method}
                      </p>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div className="h-24"></div>
      </div>
      <BotttmNavbar />
    </>
  );
};

export default SponsorDashbord;
