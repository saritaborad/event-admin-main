import { BiSolidDiscount } from "react-icons/bi";
import { BsSearch, BsTicketPerforatedFill } from "react-icons/bs";
import { FaParking } from "react-icons/fa";
import AddButton from "../../../componets/ui-elements/AddButton";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { makeApiCall } from "../../../api/Post";
import { filterByProperty } from "../../../utils/CommonFunctions";
import { MaterialReactTable } from "material-react-table";

const Complimantorycode = () => {
  const [complimantorycode, setComplimantorycode] = useState();
  const [usedComplimantorycode, setUsedComplimantorycode] = useState();
  const [isUsed, setIsUsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tableRef = useRef();
  const [tableData, setTableData] = useState();

  const [isSummery, setIsSummery] = useState(false);
  const [summeryDetails, setSummeryDetails] = useState();
  const [bikeParking, setBikeParking] = useState();
  const [carParking, setCarParking] = useState();

  const getAllComplimantorycode = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "user/allcomplimantorycode",
        null,
        "raw"
      );
      if (response.data.status === 1) {
        const rawCode = response.data.data;
        console.log(rawCode);

        const codeTableData = rawCode.map((code) => ({
          _id: code._id,
          couponCode: code.coupon_code,
          phoneNo: code.phone_number,
          isUsed: code.is_used ? "TRUE" : "FALSE",
          event: code.order.event,
          parking: code.order.parkings.length > 0 ? code.order.parkings : null,
          ticket: code.order.tickets.length > 0 ? code.order.tickets : null,
        }));

        setTableData(codeTableData);

        const isUsed = filterByProperty(response.data.data, "is_used", true);
        const isNotUsed = filterByProperty(
          response.data.data,
          "is_used",
          false
        );
        setUsedComplimantorycode(isUsed);
        setComplimantorycode(isNotUsed);
      }
      console.log(response);
      // setComplimantorycode(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllComplimantorycode();
  }, []);

  // unUsedSearchData
  const unUsedCodeSortedData = complimantorycode
    ?.slice()
    .sort(
      (a, b) =>
        a.phone_number ||
        a.coupon_code.localeCompare(b.phone_number || b.coupon_code)
    );
  const handleSearchChangeUnUsed = (event) => {
    setSearchQuery(event.target.value);
  };
  const UnusedCodeSearchData = unUsedCodeSortedData?.filter(
    (item) =>
      item.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.coupon_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // usedSearchData
  const usedCodeSortedData = usedComplimantorycode
    ?.slice()
    .sort(
      (a, b) =>
        a.phone_number ||
        a.coupon_code.localeCompare(b.phone_number || b.coupon_code)
    );
  const handleSearchChangeUsed = (event) => {
    setSearchQuery(event.target.value);
  };
  const usedCodeSearchData = usedCodeSortedData?.filter(
    (item) =>
      item.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.coupon_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      accessorKey: "couponCode",
      header: "Complimantory Code",
      size: 50,
    },
    {
      accessorKey: "phoneNo",
      header: "Phone No.",
      size: 50,
    },
    {
      accessorKey: "isUsed",
      header: "Used",
      size: 50,
    },
    {
      id: "summery",
      header: "Summery",
      size: 50,
      Cell: ({ renderedCellValue, row }) => (
        <button
          className="text-primary px-2 py-1 border border-primary rounded-sm"
          onClick={() => handleSummery(row.original._id)}
        >
          Summery
        </button>
      ),
    },
  ];

  const handleSummery = (id) => {
    setIsSummery(true);
    const singleEvent = filterByProperty(tableData, "_id", id);
    setSummeryDetails(singleEvent[0]);
    const bikeParking = filterByProperty(
      singleEvent[0]?.parking,
      "two_wheeler_parking",
      true
    );
    setBikeParking(bikeParking);
    const carParking = filterByProperty(
      singleEvent[0]?.parking,
      "car_parking",
      true
    );
    setCarParking(carParking);
  };

  return (
    <>
      <div className="h-full m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <AddButton
          title={"Complimantory Code"}
          link={"/role/superadmin/complimantorycode/add-new"}
        />

        <div className="w-full my-3 p-1 border border-gray-300 rounded-2xl md:hidden">
          <div className="flex items-center">
            <div className="relative flex item-center justify-between w-full gap-3  border-gray-300">
              <div
                className={`w-2/4 flex items-center justify-center text-[14px] h-[40px] rounded-xl text-center z-0 bg-primary absolute ${
                  isUsed === false
                    ? " translate-x-full transition-all  "
                    : "translate-x-[0] transition-all "
                }`}
              ></div>
              <div
                className={`w-2/4 flex items-center justify-center text-[16px] h-[40px] rounded-xl z-50 text-center ${
                  isUsed === true ? "text-white" : null
                }`}
                onClick={() => setIsUsed(true)}
              >
                Unused
              </div>
              <div
                className={`w-2/4 flex items-center justify-center text-[16px] h-[40px] rounded-xl z-50 text-center ${
                  isUsed === true ? null : "text-white"
                }`}
                onClick={() => setIsUsed(false)}
              >
                Used
              </div>
            </div>
          </div>
        </div>

        {isUsed === true ? (
          <div
            className="w-full h-auto flex flex-col gap-2 items-center rounded-lg md:hidden"
            // style={{ boxShadow: "0px 0px 10px #0000003b" }}
          >
            <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start mb-3">
              <BsSearch />
              <input
                type="text"
                placeholder="Search couponcode or phone"
                className="h-full w-full ms-3 outline-none bg-gray-200"
                value={searchQuery}
                onChange={handleSearchChangeUnUsed}
              />
            </div>
            {UnusedCodeSearchData ? (
              UnusedCodeSearchData.length > 0 ? (
                UnusedCodeSearchData?.map((complimantorycode, i) => {
                  console.log(complimantorycode.coupon_code);
                  return (
                    <Link
                      to={`/role/superadmin/complimantorycode/${complimantorycode.coupon_code}/${complimantorycode.phone_number}`}
                      className="w-full"
                      key={i}
                    >
                      <div className="bg-none border border-[#DDDCDC] w-full font-bold text-[20px] h-[60px] rounded-[15px] flex items-center justify-between p-2.5 gap-2">
                        <div className="flex items-center w-auto font-medium text-[18px] gap-4">
                          <BiSolidDiscount className="text-xl" />
                          <div className="info">
                            <p>{complimantorycode.coupon_code}</p>
                            <p className="text-sm">
                              Phone No : {complimantorycode.phone_number}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-xl font-medium text-gray-400 mt-24">
                  No Complimantory Code Found
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
        ) : null}

        {isUsed === false ? (
          <div
            className="w-full h-auto flex flex-col gap-2 items-center mb-24 rounded-lg md:hidden"
            // style={{ boxShadow: "0px 0px 10px #0000003b" }}
          >
            <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start mb-3">
              <BsSearch />
              <input
                type="text"
                placeholder="Search couponcode or phone"
                className="h-full w-full ms-3 outline-none bg-gray-200"
                value={searchQuery}
                onChange={handleSearchChangeUsed}
              />
            </div>
            {usedCodeSearchData ? (
              usedCodeSearchData.length > 0 ? (
                usedCodeSearchData?.map((complimantorycode, i) => {
                  return (
                    <Link
                      to={`/role/superadmin/complimantorycode/${complimantorycode.coupon_code}/${complimantorycode.phone_number}`}
                      className="w-full"
                      key={i}
                    >
                      <div className="bg-none border border-[#DDDCDC] w-full font-bold text-[20px] h-[60px] rounded-[15px] flex items-center justify-between p-2.5 gap-2">
                        <div className="flex items-center w-auto font-medium text-[18px] gap-4">
                          <BiSolidDiscount className="text-xl" />
                          <div className="info">
                            <p>{complimantorycode.coupon_code}</p>
                            <p className="text-sm">
                              Phone No : {complimantorycode.phone_number}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-xl font-medium text-gray-400 mt-24">
                  No Complimantory Code Found
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
        ) : null}
        <div ref={tableRef} className="hidden md:block ">
          <MaterialReactTable
            style={{ margin: "20px" }}
            columns={columns}
            data={tableData || []}
            positionToolbarAlertBanner="bottom"
          />
        <div className="h-14"></div>
        </div>
      </div>

      {isSummery === true ? (
        <div className="bg-[#00000080] h-screen w-full absolute top-0 flex items-center justify-center z-[1300]">
          <div className="bg-[#f2f2f2] md:h-2/4 md:w-2/4 w-3/4 h-3/4 rounded-md p-5 overflow-y-auto">
            <div className="flex items-center justify-between  text-2xl cursor-pointer ">
              <p className="font-semibold">Order Summery</p>
              <span
                onClick={() => {
                  setIsSummery(false);
                  setSummeryDetails();
                }}
              >
                {" "}
                &times;
              </span>
            </div>
            <hr className="w-full my-3" />

            <div className="eventInfo p-3 border border-gray-400 w-full flex items-start justify-between rounded-2xl mt-2">
              <div className="eventName">
                <h3 className="text-xl font-semibold">
                  {summeryDetails?.event.event_name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {summeryDetails?.event.event_location}
                </p>
                <p className="text-sm mt-1">
                  {summeryDetails?.event.event_date} <span>|</span>{" "}
                  {summeryDetails?.event.event_time}{" "}
                </p>
              </div>
              <div className="day text-center bg-black py-2 px-3 rounded-2xl">
                <p className="text-white text-sm">
                  {summeryDetails?.event.event_day}
                  <br />
                  DAY
                </p>
              </div>
            </div>

            {summeryDetails?.ticket?.length > 0 ? (
              <div className="ticketInfo p-3 border border-gray-400 w-full rounded-2xl my-2">
                <div className="ticket flex items-center">
                  <BsTicketPerforatedFill className="text-2xl text-primary" />
                  <h3 className="font-semibold text-lg ms-3">Tickets</h3>
                </div>

                <div className="ticketsShow">
                  {summeryDetails?.ticket.map((ticketData, i) => {
                    const colorCode = ticketData?.color_code?.slice(4);
                    return (
                      <>
                        <div className="vip flex items-center mt-2" key={i}>
                          <div
                            className={` bg-red-500 rounded-full py-2 px-5`}
                            style={{ backgroundColor: "#" + colorCode }}
                          >
                            <p className="text-sm font-medium text-white">
                              {ticketData.ticket_name}
                            </p>
                          </div>
                          <p className="ms-2">x {ticketData.qty}</p>
                          <div className="price ms-auto">
                            <p className="text-sm mx-2">₹ {ticketData.price}</p>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {summeryDetails?.parking?.length > 0 ? (
              <div className="parkingInfo p-3 border border-gray-400 w-full rounded-2xl my-2">
                <div className="parking flex items-center">
                  <FaParking className="text-2xl text-primary" />
                  <h3 className="font-semibold text-lg ms-3">Parking</h3>
                </div>

                {bikeParking?.length > 0 ? (
                  <div className="bikeParkingTicket">
                    <p className="mt-3">Two wheeler</p>
                    {bikeParking?.map((bikeParkingData, i) => {
                      const colorCode = bikeParkingData?.color_code?.slice(4);
                      return (
                        <>
                          <div className="vip flex items-center mt-2" key={i}>
                            <div
                              className={` bg-red-500 rounded-full py-2 px-5`}
                              style={{ backgroundColor: "#" + colorCode }}
                            >
                              <p className="text-sm font-medium text-white">
                                {bikeParkingData.parking_name}
                              </p>
                            </div>
                            <p className="ms-2">x {bikeParkingData.qty}</p>
                            <div className="price ms-auto">
                              <p className="text-sm mx-2">
                                ₹{bikeParkingData.price}
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                ) : null}

                {carParking?.length > 0 ? (
                  <div className="carParkingTicket">
                    <p className="mt-3">Four wheeler</p>
                    {carParking?.map((carParkingData, i) => {
                      const colorCode = carParkingData?.color_code?.slice(4);
                      return (
                        <>
                          <div className="vip flex items-center mt-2" key={i}>
                            <div
                              className={` bg-red-500 rounded-full py-2 px-5`}
                              style={{ backgroundColor: "#" + colorCode }}
                            >
                              <p className="text-sm font-medium text-white">
                                {carParkingData.parking_name}
                              </p>
                            </div>
                            <p className="ms-2">x {carParkingData.qty}</p>
                            <div className="price ms-auto">
                              <p className="text-sm mx-2">
                                ₹{carParkingData.price}
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Complimantorycode;
