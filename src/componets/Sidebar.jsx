import React, { useState } from "react";
import { dashBordData } from "../utils/dashBordData";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { handleLogout } from "../utils/CommonFunctions";
import digiLogo from "../assets/newLogo.svg";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItems] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigate = (path) => {
    navigate("/role/superadmin" + path);
  };

  const sortedData = dashBordData
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchData = sortedData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sidebar hidden md:flex bg-[#343c49] text-[#95a4b5] shadow-lg min-w-[13%] w-auto flex-col items-start justify-between gap-18 h-screen overflow-auto">
      <div className="flex items-start justify-start flex-col gap-7 w-full">
        <div className="flex flex-col items-start justify-start gap-4 p-2 w-full">
          {/* <p
            className="text-2xl font-bold text-white mx-auto my-3 cursor-pointer"
            onClick={() => navigate("/role/superadmin")}
          >
            Superadmin
          </p> */}
          <div
            className="mx-auto my-1 cursor-pointer"
            onClick={() => navigate("/role/superadmin")}
          >
            <img src={digiLogo} alt="image" />
          </div>

          <div className="w-full px-4 py-3 rounded-lg text-white bg-[#252A34] flex items-center justify-start gap-4">
            <BsSearch />
            <input
              type="text"
              placeholder="Search item"
              className="h-full w-full outline-none bg-transparent"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 items-start justify-start w-full p-2 ">
          {searchData.map((data, i) => {
            return (
              <div
                key={i}
                className={`flex items-center rounded-md justify-start gap-4 cursor-pointer w-full py-2 px-3 hover:bg-[#2f3642] hover:text-white ${
                  data.UID === selectedItem ? "bg-[#2f3642]" : null
                }`}
                onClick={() => {
                  handleNavigate(data.path);
                  setSelectedItems(data.UID);
                }}
              >
                <div className="h-full">
                  {
                    <data.image
                      className={`${
                        data.UID === selectedItem ? "text-white" : null
                      }`}
                    />
                  }
                  {/* <img className="w-full" src={data.image} alt="image" /> */}
                </div>
                <p
                  className={`whitespace-nowrap text-sm ${
                    data.UID === selectedItem ? "text-white" : null
                  }`}
                >
                  {data.title}
                </p>
              </div>
            );
          })}
        </div>

        <div className="w-full flex flex-col py-8">
          <button
            className="py-2 bg-primary text-sm rounded-md text-white mx-3"
            onClick={() => handleLogout(navigate("/login"))}
          >
            Logout
          </button>
        </div>
        <div className="h-16"></div>
      </div>
    </div>
  );
};

export default Sidebar;
