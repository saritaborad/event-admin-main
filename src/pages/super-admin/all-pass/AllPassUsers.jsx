import React, { useEffect, useRef, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import {
  capitalizeWords,
  filterByProperty,
} from "../../../utils/CommonFunctions";
import blank_user from "../../../assets/blank_user.svg";
import { MaterialReactTable } from "material-react-table";
import { Box, capitalize } from "@mui/material";
import ImageModel from "../../../componets/ui-elements/ImageModel";
import AccessPopup from "../../../componets/ui-elements/AccessPopup";
import Loader from "../../../componets/ui-elements/Loader";

const AllPassUsers = () => {
  const tableRef = useRef();

  const [passUser, setPassUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState();
  const [isImageModel, setIsImageModel] = useState();

  const [specialAccessGates, setSpecialAcessGates] = useState();
  const [specialAccessZones, setSpecialAcessZones] = useState();
  const [specialAccessCheckpoint, setSpecialAcessCheckpoint] = useState();
  const [accessTicketId, setAccessTicketId] = useState();
  const [accessPopup, setAcessPopup] = useState(false);
  const [selectedAllAccess, setSelectedAllAccess] = useState();

  const getAllPassUser = async () => {
    setIsLoading(true);
    try {
      const response = await makeApiCall("get", "user/allpass", null, "raw");
      console.log(response);
      if (response.data.status === 1) {
        setIsLoading(false);
        const rawPass = response.data.data;
        const tablePassData = rawPass.map((pass) => ({
          _id: pass._id,
          user_avatar: pass.user?.profile_pic
            ? pass.user.profile_pic
            : blank_user,
          name: pass.user?.name ? capitalizeWords(pass.user.name) : "---",
          phone_number: pass.user?.phone_number
            ? pass.user.phone_number
            : "---",
          gender: pass.user?.gender ? capitalizeWords(pass.user.gender) : "---",
          device_type: pass.user?.android_device
            ? "Android"
            : pass.user?.ios_device
            ? "Apple"
            : "---",
          device_modal: pass.user ? pass.user.device_modal : "---",
          play_zone: pass.zone?.zone_name ? pass.zone.zone_name : "---",
          garba_class: pass.garba_class?.branch_name
            ? pass.garba_class.branch_name
            : "---",
          isAllAccess: pass.all_access,
        }));
        setPassUser(tablePassData);
      } else {
        setIsLoading(false);
        console.log(response);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPassUser();
  }, []);

  const columns = [
    {
      id: "user",
      header: "Pass user",
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
      accessorKey: "garba_class",
      header: "Garba class",
      size: 50,
    },
    {
      accessorKey: "play_zone",
      header: "Play zone",
      size: 50,
    },
    {
      accessorKey: "device_type",
      header: "Device type",
      size: 50,
    },
    {
      accessorKey: "device_modal",
      header: "Device model",
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
                  ticketId: row.original._id,
                }),
                  setSelectedAllAccess(row.original.isAllAccess),
                  console.log(row.original.isAllAccess, "<========");
              }}
            >
              Special access
            </button>
          ),
        },
      ],
    },
  ];

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

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

  return (
    <>
      {isLoading ? <Loader /> : null}
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
          reloadFunc={getAllPassUser}
          popCloseFunc={() => setAcessPopup(false)}
          usertype={"pass"}
          allAccess={selectedAllAccess}
        />
      ) : null}
      <div className="h-auto m-[2px] p-[15px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen  md:rounded-none md:overflow-y-auto md:m-0">
        <div ref={tableRef} className="hidden md:block ">
          <MaterialReactTable
            style={{ margin: "20px" }}
            columns={columns}
            data={passUser}
            positionToolbarAlertBanner="bottom"
            enableRowVirtualization
          />
          <div className="h-14 my-16"></div>
        </div>
      </div>
    </>
  );
};

export default AllPassUsers;
