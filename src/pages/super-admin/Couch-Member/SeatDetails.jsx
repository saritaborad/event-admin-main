import React, { useState, useEffect } from "react";
import sofa_seat from "../../../assets/sofa-seat.svg";
import { useParams } from "react-router-dom";
import { makeApiCall } from "../../../api/Post";
import { filterByProperty } from "../../../utils/CommonFunctions";
import { Link } from "react-router-dom";

const SeatDetails = () => {
  const [seat, setSeat] = useState();

  const param = useParams();

  const getAllSeat = async () => {
    try {
      const response = await makeApiCall("get", "sofa/allmember", null, "raw");
      if (response.data.status === 1) {
        const isNotDeteled = filterByProperty(
          response.data.data,
          "is_deleted",
          false
        );
        const findUser = filterByProperty(isNotDeteled, "_id", param.userid);
        const singleUser = findUser[0];
        const allSofa = singleUser.sofa_member;
        const findSofa = filterByProperty(allSofa, "_id", param.id);
        console.log(findSofa[0]);
        setSeat(findSofa[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllSeat();
  }, []);

  return (
    <div className="h-auto m-[2px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px]">
      <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
        <div className="pt-5 px-5">
          {/* <Link to={`/role/superadmin/couch/couch-info/${sofa?._id}`}> */}
          <div className="info">
            <h3 className="text-lg font-medium text-center">Sofa Details</h3>
          </div>
          {/* </Link> */}
        </div>
        <div className="sofaInfo mt-5">
          <div
            className={`sofaName ${
              seat?.main_section === "M01"
                ? "bg-[#56A6E8]"
                : seat?.main_section === "M02"
                ? "bg-[#F3AB3E]"
                : "bg-[#FF4F6E]"
            } p-2`}
          >
            <p className="text-white text-center text-lg">
              {seat?.main_section}
            </p>
          </div>
        </div>

        {seat?.seats?.map((seatItem, i) => {
          const positionName = seatItem?.position;
          const pName = positionName[0]?.toUpperCase() + positionName?.slice(1);
          return (
            <Link
              to={`/role/superadmin/couch/sofadetails/${param.userid}/seatdetails/${param.id}/ticket/${seatItem._id}`}
            >
              <div
                className="seatInfo mx-3 mt-5 rounded-xl overflow-hidden"
                style={{ boxShadow: "0px 0px 20px #0000002b" }}
              >
                <div className="seatCart flex items-center">
                  <div
                    className={`image ${
                      seat?.main_section === "M01"
                        ? "bg-[#56A6E8]"
                        : seat?.main_section === "M02"
                        ? "bg-[#F3AB3E]"
                        : "bg-[#FF4F6E]"
                    }  py-3 px-7`}
                  >
                    <h3 className="text-center bg-white rounded-full text-sm my-2">
                      {pName}
                    </h3>
                    <img src={sofa_seat} alt="image" />
                  </div>
                  <div className="ms-3">
                    <p className="text-gray-400 my-2">
                      STATUS :{" "}
                      <span className="text-black">{seatItem.seat_status}</span>
                    </p>
                    <p className="text-gray-400 my-2">
                      POSITION : <span className="text-black ">{pName}</span>
                    </p>
                    <div className="flex items-center rounded-lg overflow-hidden my-2">
                      <p className="text-sm bg-black text-white p-1 px-2">
                        SEAT NO.
                      </p>
                      <p
                        className={`text-sm p-1 px-4 rounded-r-lg ${
                          seat?.main_section === "M01"
                            ? "bg-[#56A6E8]"
                            : seat?.main_section === "M02"
                            ? "bg-[#F3AB3E]"
                            : "bg-[#FF4F6E]"
                        } text-white`}
                      >
                        {seatItem.seat_name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SeatDetails;
