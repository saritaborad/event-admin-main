import React, { useEffect, useState } from "react";
import InfoButton from "../../../../componets/ui-elements/InfoButton";
import AddButton from "../../../../componets/ui-elements/AddButton";
import { Link, useParams } from "react-router-dom";
import { BsArrowRightCircle, BsFillPinFill, BsSearch } from "react-icons/bs";
import { makeApiCall } from "../../../../api/Post";
import { filterByProperty } from "../../../../utils/CommonFunctions";

const SecurityType = () => {
  const [data, setData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const securityType = params.type;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await makeApiCall(
        "get",
        securityType + "/all",
        null,
        "raw"
      );

      if (response.data.status === 1) {
        setIsLoading(false);
        const dt =
          securityType === "gate"
            ? response.data.gates
            : securityType === "checkpoint"
            ? response.data.data
            : securityType === "zone"
            ? response.data.tickets
            : response.data.data;

        const filterData = filterByProperty(dt, "is_deleted", false);

        let isNotParkingGate;
        securityType === "gate"
          ? (isNotParkingGate = filterByProperty(dt, "parking_gate", false))
          : null;

        securityType === "gate"
          ? setData(isNotParkingGate)
          : setData(filterData);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  let sortedData;

  securityType === "gate"
    ? (sortedData = data
        ?.slice()
        .sort((a, b) => a.gate_name.localeCompare(b.gate_name)))
    : securityType === "checkpoint"
    ? (sortedData = data
        ?.slice()
        .sort((a, b) => a.checkpoint_name.localeCompare(b.checkpoint_name)))
    : securityType === "zone"
    ? (sortedData = data
        ?.slice()
        .sort((a, b) => a.zone_name.localeCompare(b.zone_name)))
    : (sortedData = data
        ?.slice()
        .sort((a, b) => a.parking_name.localeCompare(b.parking_name)));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  let searchData;

  securityType === "gate"
    ? (searchData = sortedData?.filter((item) =>
        item.gate_name.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    : securityType === "checkpoint"
    ? (searchData = sortedData?.filter((item) =>
        item.checkpoint_name.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    : securityType === "zone"
    ? (searchData = sortedData?.filter((item) =>
        item.zone_name.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    : (searchData = sortedData?.filter((item) =>
        item.parking_name.toLowerCase().includes(searchQuery.toLowerCase())
      ));

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
        <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
          <BsSearch />
          <input
            type="text"
            placeholder={`Search ${
              securityType === "gate"
                ? "gate"
                : securityType === "zone"
                ? "zone"
                : securityType === "checkpoint"
                ? "checkpoint"
                : "parking"
            } `}
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full h-auto flex flex-col gap-3 mt-5 items-center mb-24">
          {isLoading ? (
            <>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
            </>
          ) : searchData?.length > 0 ? (
            searchData?.map((el, i) => {
              const name =
                securityType === "gate"
                  ? el.gate_name
                  : securityType === "checkpoint"
                  ? el.checkpoint_name
                  : securityType === "zone"
                  ? el.zone_name
                  : el.parking_name;

              const isPlayZone =
                securityType === "zone" ? el.pass_zone : "null";
              return (
                <Link
                  to={`/role/superadmin/securitydashboard/security-management/security/assign/${securityType}/${el._id}`}
                  className="w-full"
                  key={i}
                >
                  <TypeCard
                    icon={<BsFillPinFill />}
                    title={name}
                    isPlayZone={isPlayZone}
                    securityType={securityType}
                  />
                </Link>
              );
            })
          ) : (
            <p className="text-xl font-medium text-gray-400 mt-24">
              No data Found
            </p>
          )}
          {/* {data ? (
            data.length > 0 ? (
              searchData?.map((el, i) => {
                const name =
                  securityType === "gate"
                    ? el.gate_name
                    : securityType === "checkpoint"
                    ? el.checkpoint_name
                    : securityType === "zone"
                    ? el.zone_name
                    : el.parking_name;

                const isPlayZone =
                  securityType === "zone" ? el.pass_zone : "null";  
                return (
                  <Link
                    to={`/role/superadmin/securitydashboard/security-management/security/assign/${securityType}/${el._id}`}
                    className="w-full"
                    key={i}
                  >
                    <TypeCard
                      icon={<BsFillPinFill />}
                      title={name}
                      isPlayZone={isPlayZone}
                      securityType={securityType}
                    />
                  </Link>
                );
              })
            ) : (
              <p className="text-xl font-medium text-gray-400 mt-24">
                No Chechpoint Found
              </p>
            )
          ) : (
            <>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
            </>
          )} */}
        </div>
        </div>
      </div>
    </>
  );
};

export default SecurityType;

const TypeCard = ({ icon, title, isPlayZone, securityType }) => {
  return (
    <div className="bg-none border border-[#DDDCDC] w-full font-bold text-[20px] h-[60px] rounded-[15px] flex items-center justify-between p-2.5 gap-2">
      <div className="flex items-center w-auto font-medium text-[18px] gap-4">
        {icon}
        <p>{title}</p>
        {securityType === "zone" ? (
          <p className="text-primary">{isPlayZone ? "Pass Zone" : null}</p>
        ) : null}
      </div>
      <BsArrowRightCircle size={20} />
    </div>
  );
};
