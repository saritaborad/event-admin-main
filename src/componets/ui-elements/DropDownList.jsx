import React, { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import DropDownData from "./DropDownData";


const DropDownList = ({title,data,isButton,branchId}) => {
  const [activeList, setActiveList] = useState(false);

  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("/role/classowner/activelist");
  };


  
  return (
    <>
      <div className="activeStudentList">
        <div className="owner bg-white m-3 rounded-2xl p-2">
          <div className="ownerData flex items-center">
            <div
              className="activeTudentText m-2 flex items-center justify-between w-full "
              onClick={() => setActiveList(!activeList)}
            >
              <h1 className="text-xl font-semibold">{title}</h1>
              <BsChevronRight
                className={`text-xl ${
                  !activeList
                    ? "rotate-0 duration-300"
                    : "rotate-90 duration-300"
                }`}
              />
            </div>
          </div>

          {activeList
            ? data?.slice(0,4).map((user) => {
                return (
                  <>
                    <hr />
                    <DropDownData branchId={branchId} key={user._id} id={user._id} name={user.name} img={user.profile_pic} button={isButton} />
                  </>
                );
              })
            : null}
          {activeList ? <PrimaryButton handleClick={handleNavigation} title={"See all"} background={"bg-black"} /> : null}
        </div>
      </div>
    </>
  );
};

export default DropDownList;
