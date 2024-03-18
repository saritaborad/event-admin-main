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

const AllUsers = () => {
  const tableRef = useRef();

  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState();
  const [isImageModel, setIsImageModel] = useState();

  const [specialAccessGates, setSpecialAcessGates] = useState();
  const [specialAccessZones, setSpecialAcessZones] = useState();
  const [specialAccessCheckpoint, setSpecialAcessCheckpoint] = useState();
  const [accessTicketId, setAccessTicketId] = useState();
  const [accessPopup, setAcessPopup] = useState(false);

  const getAllUser = async () => {
    setIsLoading(true);
    try {
      const response = await makeApiCall("get", "user/allusers", null, "raw");
      if (response.data.status === 1) {
        setIsLoading(true);
        const rawUser = response.data.data;
        const notDeleteUser = filterByProperty(rawUser,"is_deleted",false)
        console.log(rawUser);
        const tableUserData = notDeleteUser.map((user) => ({
          _id: user._id,
          user_avatar: user?.profile_pic ? user.profile_pic : blank_user,
          name: user?.name ? capitalizeWords(user.name) : "---",
          phone_number: user?.phone_number ? user?.phone_number : "---",
          gender: user?.gender ? capitalizeWords(user.gender) : "---",
          device_type: user?.android_device
            ? "Android"
            : user?.ios_device
            ? "Apple"
            : "---",
          device_model: user?.device_modal
            ? capitalizeWords(user.device_modal)
            : "---",
          role: user?.roles ? capitalizeWords(user.roles) : "---",
        }));
        console.log(tableUserData);
        setUser(tableUserData);
        setIsLoading(false);
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
    getAllUser();
  }, []);

  const columns = [
    {
      id: "user",
      header: "User",
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
      accessorKey: "device_type",
      header: "Device type",
      size: 50,
    },
    {
      accessorKey: "device_model",
      header: "Device model",
      size: 50,
    },
    {
      accessorKey: "role",
      header: "Role",
      size: 50,
    },
    //   {
    //     id: "actions",
    //     header: "Actions",
    //     columns: [
    //       {
    //         header: "Special access",
    //         Cell: ({ renderedCellValue, row }) => (
    //           <button
    //             className="bg-primary px-2 py-2 text-white rounded-sm"
    //             onClick={() =>
    //               handleSpecialAccess({
    //                 gates: row.original.gates,
    //                 zones: row.original.zones,
    //                 checkpoints: row.original.checkpoints,
    //                 specialGates: row.original.specialAccessGates,
    //                 specialCheckpoints: row.original.specialAccessCheckpoint,
    //                 specialZones: row.original.specialAccessZones,
    //                 ticketId: row.original._id,
    //               })
    //             }
    //           >
    //             Special access
    //           </button>
    //         ),
    //       },
    //     ],
    //   },
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

  const handleImageModelClose = () => {
    setIsImageModel(false);
  };

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

  return (
    <>
      {isLoading ? <Loader /> : null}
      {isImageModel ? (
        <ImageModel handleClose={handleImageModelClose} src={selectedImage} />
      ) : null}

      <div className="h-auto m-[2px] p-[15px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div ref={tableRef} className=" ">
          <MaterialReactTable
            style={{ margin: "20px" }}
            columns={columns}
            data={user}
            positionToolbarAlertBanner="bottom"
            enableRowVirtualization
          />
          <div className="h-24"></div>
        </div>
      </div>
    </>
  );
};

export default AllUsers;
