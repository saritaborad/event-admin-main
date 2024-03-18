import React from "react";
import InfoButton from "../../../../componets/ui-elements/InfoButton";
import { Link, useParams } from "react-router-dom";
import { BsDoorClosed, BsSearch } from "react-icons/bs";
import AddButton from "../../../../componets/ui-elements/AddButton";

const Mentorship = () => {

  const params = useParams();

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px]">
        <AddButton title={"Student"} link={`/role/superadmin/finduser/mentorship/add-new/${params.number}`} />
        {/* <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
          <BsSearch />
          <input
            type="text"
            placeholder="Search item"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div> */}
        <div></div>
        <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
          {/* <InfoButton
            icon={<BsDoorClosed className="text-xl" />}
            title={"Student 1"}
          /> */}
          {/* {currentItems ? (
            currentItems.length > 0 ? (
              currentItems?.map((gate, i) => {
                return (
                  <Link
                    to={`/role/superadmin/gate/${gate._id}`}
                    className="w-full"
                    key={i}
                  >
                    <InfoButton
                      icon={<BsDoorClosed className="text-xl" />}
                      title={gate.gate_name}
                    />
                  </Link>
                );
              })
            ) : (
              <p className="text-xl text-center font-medium text-gray-400 mt-24">
                No Gate Found
              </p>
            )
          ) : (
            <>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
            </>
          )} */}
          <div className="flex items-center gap-2 mt-5">
            {/* {pageNumbers.map((number, i) => {
              return (
                <p
                  key={i}
                  className={`  ${
                    currentPage === number
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  } rounded-full w-10 h-10 flex items-center justify-center text-xl`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </p>
              );
            })} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Mentorship;
