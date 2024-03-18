import React, { useEffect, useRef, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import {
  capitalizeWords,
  filterByProperty,
} from "../../../utils/CommonFunctions";
import blank_user from "../../../assets/blank_user.svg";
import { MaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";
import ImageModel from "../../../componets/ui-elements/ImageModel";
import AccessPopup from "../../../componets/ui-elements/AccessPopup";
import Loader from "../../../componets/ui-elements/Loader";

const AllPrivilegeUsers = () => {
  const tableRef = useRef();

  const [couch, setCouch] = useState([]);

  const [selectedImage, setSelectedImage] = useState();
  const [isImageModel, setIsImageModel] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [specialAccessGates, setSpecialAcessGates] = useState();
  const [specialAccessZones, setSpecialAcessZones] = useState();
  const [specialAccessCheckpoint, setSpecialAcessCheckpoint] = useState();
  const [accessTicketId, setAccessTicketId] = useState();
  const [selectedAllAccess, setSelectedAllAccess] = useState();
  const [accessPopup, setAcessPopup] = useState(false);

  const getAllCouch = async () => {
    setIsLoading(true);
    try {
      const response = await makeApiCall(
        "get",
        "user/allprivilege",
        null,
        "raw"
      );
      if (response.data.status === 0) {
        setIsLoading(false);
        const rawCouch = response.data.data;
        console.log(rawCouch);
        const tableCouchData = rawCouch.map((couch) => ({
          _id: couch._id,
          isAllAccess: couch.privilege_tickets[0].all_access,
          user_avatar: couch.profile_pic ? couch.profile_pic : blank_user,
          name: capitalizeWords(couch.name),
          phone_number: couch.phone_number,
          gender: couch.gender ? capitalizeWords(couch.gender) : "---",
          zone:
            couch.privilege_tickets.length > 0
              ? couch.privilege_tickets[0].zone
                ? couch.privilege_tickets[0].zone.zone_name
                : "---"
              : "---",
          is_used:
            couch.privilege_tickets.length > 0
              ? couch.privilege_tickets[0].is_used
                ? "Check in"
                : "Not Check in"
              : "---",
          is_active:
            couch.privilege_tickets.length > 0
              ? couch.privilege_tickets[0].is_active
                ? "Active"
                : "Not Active"
              : "---",
          seat:
            couch.privilege_tickets.length > 0
              ? couch.privilege_tickets[0].seat
                ? couch.privilege_tickets[0].seat.seat_name
                : "---"
              : "---",
          seat_position:
            couch.privilege_tickets.length > 0
              ? couch.privilege_tickets[0].seat
                ? capitalizeWords(couch.privilege_tickets[0].seat.position)
                : "---"
              : "---",
          seat_status:
            couch.privilege_tickets.length > 0
              ? couch.privilege_tickets[0].seat
                ? couch.privilege_tickets[0].seat.seat_status
                : "---"
              : "---",
          sofa_name:
            couch.privilege_tickets.length > 0
              ? couch.privilege_tickets[0].seat.sofa_id
                ? couch.privilege_tickets[0].seat.sofa_id.sofa_name
                : "---"
              : "---",
          sofa_status:
            couch.privilege_tickets.length > 0
              ? couch.privilege_tickets[0].seat.sofa_id
                ? couch.privilege_tickets[0].seat.sofa_id.sofa_status
                : "---"
              : "---",
          pass_id:
            couch.privilege_tickets.length > 0
              ? couch.privilege_tickets[0]._id
              : null,
          specialAccessCheckpoint:
            couch.privilege_tickets.length > 0
              ? couch.privilege_tickets[0].special_accesscheckpoints.length > 0
                ? couch.privilege_tickets[0].special_accesscheckpoints
                : null
              : null,
          specialAccessGates:
            couch.privilege_tickets.length > 0
              ? couch.privilege_tickets[0].special_accessgates.length > 0
                ? couch.privilege_tickets[0].special_accessgates
                : null
              : null,
          specialAccessZones:
            couch.privilege_tickets.length > 0
              ? couch.privilege_tickets[0].special_accesszones.length > 0
                ? couch.privilege_tickets[0].special_accesszones
                : null
              : null,
        }));
        setCouch(tableCouchData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCouch();
  }, []);

  const columns = [
    {
      id: "user",
      header: "Privilege user",
      columns: [
        {
          accessorFn: (row) => `${row.name}`,
          id: "profile_pic",
          header: "User",
          size: 180,
          Cell: ({ renderedCellValue, row }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                alt="avatar"
                onClick={() => handleOpenModel(row.original.user_avatar)}
                height={30}
                src={row.original.user_avatar}
                loading="lazy"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                }}
              />

              <span>{renderedCellValue}</span>
            </Box>
          ),
        },
      ],
    },
    {
      accessorKey: "phone_number",
      header: "Phone no",
      size: 50,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      size: 50,
    },
    {
      accessorKey: "zone",
      header: "Zone",
      size: 50,
    },
    {
      accessorKey: "sofa_name",
      header: "Sofa name",
      size: 50,
    },
    {
      accessorKey: "seat_position",
      header: "Seat position",
      size: 50,
    },
    {
      accessorKey: "sofa_status",
      header: "Sofa status",
      size: 50,
    },
    {
      accessorKey: "seat",
      header: "Seat Name",
      size: 50,
    },

    {
      accessorKey: "seat_status",
      header: "Seat status",
      size: 50,
    },
    {
      accessorKey: "is_active",
      header: "Is Active",
      size: 50,
    },
    {
      accessorKey: "is_used",
      header: "Check in",
      size: 50,
    },

    {
      id: "actions",
      header: "Actions",
      columns: [
        {
          header: "Special access",
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="bg-primary px-2 py-2 text-white rounded-sm"
              onClick={() => {
                handleSpecialAccess({
                  gates: row.original.gates,
                  zones: row.original.zones,
                  checkpoints: row.original.checkpoints,
                  specialGates: row.original.specialAccessGates,
                  specialCheckpoints: row.original.specialAccessCheckpoint,
                  specialZones: row.original.specialAccessZones,
                  ticketId: row.original.pass_id,
                });
                setSelectedAllAccess(row.original.isAllAccess);
              }}
            >
              Special access
            </button>
          ),
        },
      ],
    },
  ];

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

  const handleSpecialAccess = (options) => {
    const {
      gates,
      zones,
      checkpoints,
      specialGates,
      specialCheckpoints,
      specialZones,
      ticketId,
    } = options;

    accessPopupOpen({
      gate: gates,
      zone: zones,
      checkpoint: checkpoints,
      specialGates: specialGates,
      specialCheckpoints: specialCheckpoints,
      specialZones: specialZones,
      type: 0,
      ticketId: ticketId,
    });
  };

  const accessPopupOpen = (options) => {
    const {
      gate,
      zone,
      checkpoint,
      specialGates,
      specialCheckpoints,
      specialZones,
      type,
      ticketId,
    } = options;
    setSpecialAcessGates(specialGates);
    setSpecialAcessZones(specialZones);
    setSpecialAcessCheckpoint(specialCheckpoints);

    setAccessTicketId(ticketId);
    setAcessPopup(true);
  };

  return (
    <>
      {isLoading ? <Loader /> : null}
      <div className="h-auto m-[2px] p-[15px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div ref={tableRef} className="">
          <MaterialReactTable
            style={{ margin: "20px" }}
            columns={columns}
            data={couch}
            positionToolbarAlertBanner="bottom"
            enableStickyFooter={true}
            enableStickyHeader={true}
          />
          <div className="h-24"></div>
        </div>
      </div>
      {isImageModel ? (
        <ImageModel
          src={selectedImage ? selectedImage : black_image}
          handleClose={() => setIsImageModel(false)}
        />
      ) : null}

      {accessPopup ? (
        <AccessPopup
          type={0}
          handleClose={() => setAcessPopup(false)}
          propGates={null}
          propCheckpoints={null}
          propZones={null}
          specialAccessGates={specialAccessGates}
          specialAccessCheckpoint={specialAccessCheckpoint}
          specialAccessZones={specialAccessZones}
          accessTicketId={accessTicketId}
          reloadFunc={getAllCouch}
          popCloseFunc={() => setAcessPopup(false)}
          usertype={"privilege"}
          allAccess={selectedAllAccess}
        />
      ) : null}
    </>
  );
};

export default AllPrivilegeUsers;
