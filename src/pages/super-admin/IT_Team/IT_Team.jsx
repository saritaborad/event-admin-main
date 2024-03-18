import React, { useState, useEffect, useRef } from "react";
import { makeApiCall } from "../../../api/Post";
import { MaterialReactTable } from "material-react-table";
import { formatDateToDDMMMYYYY } from "../../../utils/CommonFunctions";
import { socket } from "../../../Routes";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../../componets/ui-elements/ImageUpload";
import InputField from "../../../componets/ui-elements/InputField";
import { animatedComponents, genderData } from "../../../utils/commonData";
import Select from "react-select";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import Alert from "../../../componets/ui-elements/Alert";
import PhoneNumberInput from "../../../componets/ui-elements/PhoneNumberInput";
import { Box } from "@mui/material";
import ImageModel from "../../../componets/ui-elements/ImageModel";

function IT_Team() {
  const tableRef = useRef();
  const [user, setUser] = useState([]);
  const [addTeam, setAddTeam] = useState(false);
  const [displayProfilePic, setDisplayProfilePic] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const [addTeamParams, setAddTeamParams] = useState({});

    const [selectedImage, setSelectedImage] = useState();
  const [isImageModel, setIsImageModel] = useState();

  const maxFileSize = 9 * 1024 * 1024; // 9mb
  const [fileSizeExceeded, setFileSizeExceeded] = useState(false);

  const getAllTeamMember = async () => {
    // setIsLoading(true);
    try {
      const response = await makeApiCall("get", "user/allteam", null, "raw");
      if (response.data.status === 1) {
        // setIsLoading(true);
        const rawUser = response.data.data;
        console.log(rawUser);

        const tableTeamData = rawUser.map((user) => ({
          name: user.name,
          phone_number: user.phone_number,
          user_avatar: user.profile_pic,
        }));

        setUser(tableTeamData);
      } else {
        // setIsLoading(false);
        console.log(response);
      }
    } catch (error) {
      // setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getAllTeamMember();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAddTeamParams({ ...addTeamParams, ["profile_pic"]: file });
    // console.log(file);
    console.log(file.size);

    if (file && file.size < maxFileSize) {
      const reader = new FileReader();
      setFileSizeExceeded(false);
      reader.onloadend = () => {
        const base64String = reader.result;
        setDisplayProfilePic(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setFileSizeExceeded(true);
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "post",
        `user/additteam`,
        addTeamParams,
        "raw"
      );
      console.log(response);
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setStatus("error");
      setErrorMsg(response.data.message);
    }
  };

  const handleComplete = () => {
    setIsAlert(false);
    setAddTeamParams({});
    setDisplayProfilePic();
  };

  const handleCancel = () => {
    setIsAlert(false);
    setAddTeamParams({});
    setDisplayProfilePic();
  };

  const handleClick = () => {
    setIsAlert(true);
    setStatus("start");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddTeamParams({ ...addTeamParams, [name]: value });
  };

    const handleImageModelClose = () => {
    setIsImageModel(false);
  };

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

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
      header: "Phone number",
      size: 50,
    },
  ];

  return (
    <>
      {isAlert ? (
        <Alert
          isOpen={isAlert}
          title="Are you sure?"
          text="You won't be able to revert this!"
          confirmButtonText="Submit"
          cancelButtonText="Cancel"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          status={status}
          confirmText={successMsg}
          errorText={errorMsg}
          onComplete={handleComplete}
        />
      ) : null}
      <div className="h-screen overflow-y-auto ">
        <div className="serverLog py-5 mx-4">
          <h3 className="text-xl font-semibold">IT Team</h3>
        </div>
        <div className="add flex items-center" onClick={() => setAddTeam(true)}>
          <h3 className="bg-primary text-white px-4 py-2 m-4 rounded-lg cursor-pointer">
            Add IT Team{" "}
          </h3>
        </div>
        <div ref={tableRef}>
          <MaterialReactTable
            style={{ margin: "20px" }}
            columns={columns}
            data={user || []}
            positionToolbarAlertBanner="bottom"
            onPaginationChange={({ currentPage, pageSize }) =>
              console.log(pageSize)
            }
          />
        </div>

        {addTeam === true ? (
          <div className="bg-[#00000080] h-screen w-full md:w-[87%] fixed top-0 z-50 flex items-center justify-center">
            <div className="bg-[#f2f2f2] h-4/5  md:w-2/4 w-[90%] max-h-3/4 rounded-md p-5 overflow-y-auto pb-10">
              <div className="flex items-center justify-between  text-2xl cursor-pointer ">
                <p className="font-semibold">IT Team</p>
                <span onClick={() => setAddTeam(false)}> &times;</span>
              </div>
              <div className="authorizedPersonAvtar mt-3">
                <ImageUpload
                  id={"file"}
                  name={"profile_pic"}
                  handleChange={(e) => handleFileChange(e, "profile_pic")}
                  source={displayProfilePic}
                  heading={"Profile"}
                  height={"h-auto min-h-56"}
                  label={displayProfilePic ? "Replace image" : "Upload image"}
                  imageSize={"w-44"}
                />
                {fileSizeExceeded && (
                  <p className="error text-red-500">
                    File size exceeded the limit of 9 mb
                  </p>
                )}
              </div>
              <div className="w-full mt-3">
                <InputField
                  type="text"
                  placeholder={"Name"}
                  name="name"
                  inputPlaceholder={"Enter name"}
                  handleChange={handleInputChange}
                  disabled={false}
                />
              </div>
              <div className="w-full mt-3">
                {/* <InputField
                type="number"
                name="phone_number"
                placeholder={"Phone No."}
                inputPlaceholder={"Enter Phone No."}
                handleChange={handleInputChange}
                disabled={false}
              /> */}
                <PhoneNumberInput
                  // value={addTeamParams["phone_number"]||""}
                  name={"phone_number"}
                  handleChange={handleInputChange}
                />
              </div>
              <div className="w-full mt-3">
                <p className="text-[14px] font-semibold ms-1 mb-1">Gender</p>
                <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                  <div className="authorizedName flex items-center h-full">
                    <Select
                      options={genderData}
                      components={animatedComponents}
                      name="gender"
                      placeholder="Select Gender"
                      onChange={(e) =>
                        setAddTeamParams({
                          ...addTeamParams,
                          ["gender"]: e.value,
                        })
                      }
                      className="basic-multi-select h-full flex item-center bg-transparent"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
              </div>

              <div className="flex mt-16 items-center justify-center w-full gap-3">
                <PrimaryButton
                  background={"primary-button"}
                  handleClick={handleClick}
                  title={"Submit"}
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="h-14"></div>
      </div>
      {isImageModel ? (
        <ImageModel handleClose={handleImageModelClose} src={selectedImage} />
      ) : null}
    </>
  );
}

export default IT_Team;
