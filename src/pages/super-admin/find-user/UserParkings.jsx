import React, { useEffect, useRef, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import { useParams } from "react-router-dom";
import {
  filterByProperty,
  formatVehicleNumber,
} from "../../../utils/CommonFunctions";
import ImageModel from "../../../componets/ui-elements/ImageModel";
import car from "../../../assets/sports-car.svg";
import bike from "../../../assets/scooter-front-view.svg";
import { MaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";
import Loader from "../../../componets/ui-elements/Loader";

const UserParkings = () => {
  const params = useParams();
  const [parkingDataTable, setParkingDataTable] = useState([]);
  const tableRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      id: "parking", //id used to define `group` column
      header: "parking",
      columns: [
        {
          accessorFn: (row) => `${row.parking_name}`, //accessorFn used to join multiple data into a single cell
          id: "profile_pic", //id is still required when using accessorFn instead of accessorKey
          header: "Parking",
          size: 250,
          Cell: ({ renderedCellValue, row }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {
                <img
                  alt="avatar"
                  height={30}
                  src={row.original.parking_img}
                  loading="lazy"
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "cover",
                  }}
                />
              }

              <span>{renderedCellValue}</span>
            </Box>
          ),
        },
      ],
    },
    // {
    //   id: "ticket_name", //id used to define `group` column
    //   header: "Ticket Name",
    //   columns: [
    //     {
    //       header: "Ticket Name",
    //       Cell: ({ renderedCellValue, row }) => (
    //         <p
    //           style={{ backgroundColor: `${row.original.color_code}` }}
    //           className="w-auto px-2 py-1 rounded-full text-center text-white"
    //         >
    //           {row.original.ticket_name}
    //         </p>
    //       ),
    //     },
    //   ],
    // },
    {
      accessorKey: "vehical_number",
      header: "Vehical number",
      size: 50,
      enableClickToCopy: true,
    },
    {
      accessorKey: "parking_random_id",
      header: "Parking Id",
      size: 50,
      enableClickToCopy: true,
    },
    {
      accessorKey: "is_used",
      header: "Check in",
      size: 50,
    },
    {
      accessorKey: "is_active",
      header: "Activated",
    },
  ];

  const [activeParkings, setActiveParkings] = useState();
  const [notActiveParkings, setNotActiveParkings] = useState();

  const [isActive, setIsActive] = useState(true);
  const [isImageModel, setIsImageModel] = useState(false);
  const fetchUser = async () => {
    setIsLoading(true);
    const res = await makeApiCall(
      "post",
      "user/userdetails",
      {
        phone_number: params.number,
      },
      "raw"
    );
    console.log(res);
    if (res.data.status === 1) {
      setIsLoading(false);
      const rawParkings = res.data.data.my_parkings;
      const parkingsTableData = rawParkings.map((parking) => ({
        _id: parking._id,
        parking_img: parking.car_parking ? car : bike,
        parking_name: parking.parking_name,
        color_code: "#" + parking.color_code?.slice(4),
        parking_random_id: parking.parking_random_id,
        vehical_number: parking.is_active
          ? formatVehicleNumber(parking.vehicle_number)
          : "---",
        is_used: parking.is_used ? "TRUE" : "FALSE",
        is_active: parking.is_active ? "TRUE" : "FALSE",
        gates: parking?.gates,
        zones: parking?.zones,
        checkpoints: parking?.checkpoints,
      }));

      console.log(parkingsTableData);

      setParkingDataTable(parkingsTableData);

      const activeP = filterByProperty(rawParkings, "is_active", true);
      const nonActiveP = filterByProperty(rawParkings, "is_active", false);

      setActiveParkings(activeP);
      setNotActiveParkings(nonActiveP);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleImageModelClose = () => {
    setIsImageModel(false);
  };

  return (
    <>
      {isLoading ? <Loader /> : null}
      <div className="createGarbaClassSubmitSection flex flex-col gap-[20px] bg-white pt-4 m-1 h-auto rounded-3xl p-[25px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <p className="font-medium text-center text-2xl ">User parkings</p>
        <hr />
        <div className="w-full my-3 p-1 border border-gray-300 rounded-2xl md:hidden">
          <div className="flex items-center">
            <div className="relative flex item-center justify-between w-full gap-3  border-gray-300">
              <div
                className={`w-2/4 flex items-center justify-center text-[14px] h-[40px] rounded-xl text-center z-0 bg-primary absolute ${
                  isActive === false
                    ? " translate-x-full transition-all  "
                    : "translate-x-[0] transition-all "
                }`}
              ></div>
              <div
                className={`w-2/4 flex items-center justify-center text-[16px] h-[40px] rounded-xl z-50 text-center ${
                  isActive === true ? "text-white" : null
                }`}
                onClick={() => setIsActive(true)}
              >
                Active
              </div>
              <div
                className={`w-2/4 flex items-center justify-center text-[16px] h-[40px] rounded-xl z-50 text-center ${
                  isActive === true ? null : "text-white"
                }`}
                onClick={() => setIsActive(false)}
              >
                Not Active
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:hidden">
          {isActive === true
            ? activeParkings?.map((parking) => {
                const colorCode = parking?.color_code?.slice(4);
                const vehicleState = parking?.vehicle_number?.substring(0, 4);
                const vehicleSeries = parking?.vehicle_number?.substring(4, 6);
                const vehicleNumber = parking?.vehicle_number?.substring(6, 10);
                return (
                  <UserParkingCard
                    image={parking.car_parking === true ? car : bike}
                    parkingName={parking.parking_name}
                    id={parking.parking_random_id}
                    vehicleNo={
                      vehicleState + "-" + vehicleSeries + "-" + vehicleNumber
                    }
                    isActive={parking.is_active}
                    parkingSlot={parking.allot_slot}
                    is_used={parking.is_used}
                  />
                );
              })
            : notActiveParkings?.map((parking) => {
                const colorCode = parking?.color_code?.slice(4);
                return (
                  <UserParkingCard
                    image={parking.car_parking === true ? car : bike}
                    parkingName={parking.parking_name}
                    id={parking.parking_random_id}
                    isActive={parking.is_active}
                    parkingSlot={parking.allot_slot}
                  />
                );
              })}
        </div>
        <div ref={tableRef} className="hidden md:block ">
          <MaterialReactTable
            style={{ margin: "20px" }}
            columns={columns}
            data={parkingDataTable || []}
            positionToolbarAlertBanner="bottom"
          />
        </div>
        <div className="h-14"></div>
      </div>
    </>
  );
};
export default UserParkings;

export const UserParkingCard = ({
  image,
  parkingName,
  id,
  vehicleNo,
  isActive,
  parkingSlot,
  is_used,
}) => {
  return (
    <div
      className="parking p-3 rounded-xl flex items-center relative overflow-hidden"
      style={{ boxShadow: "0px 0px 20px #0000002b" }}
    >
      <div className="car bg-gray-200 rounded-xl">
        <img src={image} alt="image" className="h-14 w-14 p-3" />
      </div>
      <div className="name ms-4">
        <p className="text-xl font-medium">{parkingName}</p>
        <p className="text-sm text-gray-400">ID : {id}</p>
        {isActive === true ? (
          <p className="text-sm text-gray-400">
            Vehicle No: <span className="text-primary">{vehicleNo}</span>
          </p>
        ) : null}
        <p className="text-sm text-gray-400">
          Allot Slot : <span>{parkingSlot}</span>
        </p>
      </div>
      {is_used ? (
        <div className="absolute text-white text-xs h-5 w-20 bg-primary font-semibold right-[-20px] rotate-45 flex items-center justify-center top-[10px]">
          Used
        </div>
      ) : null}
    </div>
  );
};
