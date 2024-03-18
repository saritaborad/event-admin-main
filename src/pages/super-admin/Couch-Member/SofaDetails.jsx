import React, { useState, useEffect } from "react";
import raas from "../../../assets/raas.png";
import { Link } from "react-router-dom";
import sofa_blue from "../../../assets/sofa-blue.svg";
import sofa_yellow from "../../../assets/sofa-yellow.svg";
import sofa_pink from "../../../assets/sofa-pink.svg";
import { useParams } from "react-router-dom";
import { makeApiCall } from "../../../api/Post";
import { filterByProperty } from "../../../utils/CommonFunctions";
import Loader from "../../../componets/ui-elements/Loader";

const SofaDetails = () => {
  const [sofa, setSoda] = useState();
  const [loading, setLoading] = useState(true);

  const param = useParams();

  const getAllCouch = async () => {
    try {
      const response = await makeApiCall("get", "sofa/allmember", null, "raw");
      if (response.data.status === 1) {
        const isNotDeteled = filterByProperty(
          response.data.data,
          "is_deleted",
          false
        );
        const findUser = filterByProperty(isNotDeteled, "_id", param.userid);
        console.log(findUser[0]);
        setSoda(findUser[0]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCouch();
  }, []);

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="h-auto m-[2px] bg-white rounded-[30px] flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:m-0 ">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="pt-5 px-5">
            <Link to={`/role/superadmin/couch/couch-info/${sofa?._id}`}>
              <div className="userInfo flex items-center border border-gray-200 rounded-xl px-2">
                <div className="image h-16 w-16 flex items-center justify-center overflow-hidden">
                  <img
                    src={sofa?.profile_pic}
                    alt="image"
                    className="rounded-2xl p-1 h-16 w-16"
                  />
                </div>
                <div className="info ms-2">
                  <h3 className="text-lg font-medium">{sofa?.name}</h3>
                  <p className="text-sm">{sofa?.phone_number}</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mb-24 mt-5">
            {sofa?.sofa_member?.map((seat, i) => {
              return (
                <>
                  <Link
                    to={`/role/superadmin/couch/sofadetails/${param.userid}/seatdetails/${seat._id}`}
                    className="w-full"
                    key={i}
                  >
                    <div className="sofaInfo">
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
                          {seat.main_section}
                        </p>
                      </div>
                    </div>
                    <div className="sofa mx-3 my-5">
                      <div
                        className="py-5 rounded-xl"
                        style={{ boxShadow: "0px 0px 20px #0000002b" }}
                      >
                        <div className="flex justify-end items-center mx-5">
                          <div className="flex justify-end items-center border border-black rounded-lg overflow-hidden">
                            <p className="text-sm bg-black text-white p-1 px-2">
                              SEAT
                            </p>
                            <p className="text-sm p-1 px-2">{seat.sofa_name}</p>
                          </div>
                        </div>
                        <div className="image flex justify-center items-center">
                          <img
                            src={
                              seat.main_section === "M01"
                                ? sofa_blue
                                : seat.main_section === "M02"
                                ? sofa_yellow
                                : sofa_pink
                            }
                            alt="image"
                            className=""
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SofaDetails;
