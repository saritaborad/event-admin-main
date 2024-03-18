import { BsDoorClosed, BsSearch } from "react-icons/bs";
import { GiSofa } from "react-icons/gi";
import AddButton from "../../../componets/ui-elements/AddButton";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import { Link ,useNavigate} from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { makeApiCall } from "../../../api/Post";
import {
  capitalizeWords,
  filterByProperty,
} from "../../../utils/CommonFunctions";
import black_user from "../../../assets/blank_user.svg";
import UserCard from "../../../componets/ui-elements/UserCard";
import { MaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";
import ImageModel from "../../../componets/ui-elements/ImageModel";
import Loader from "../../../componets/ui-elements/Loader";

const Couch = () => {
  const tableRef = useRef();
  const navigate = useNavigate();
  const [couch, setCouch] = useState();
  const [couchTable, setCouchTable] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [isImageModel, setIsImageModel] = useState();

  const getAllCouch = async () => {
    setIsLoading(true);
    try {
      const response = await makeApiCall("get", "sofa/allmember", null, "raw");
      console.log(response.data);
      if (response.data.status === 1) {
        setIsLoading(false);
        const filterdCouch = filterByProperty(
          response.data.data,
          "is_deleted",
          false
        );
        console.log(filterdCouch);
        setCouch(filterdCouch);

        const tablePrivilegeCouch = filterdCouch.map((couch) => ({
          _id: couch._id,
          user_profile: couch.profile_pic ? couch.profile_pic : black_user,
          name: capitalizeWords(couch.name),
          phone_number: couch.phone_number,
          gender: capitalizeWords(couch.gender),
        }));
        setCouchTable(tablePrivilegeCouch);
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
      header: "Privilege Couch",
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
                onClick={() => handleOpenModel(row.original.user_profile)}
                height={30}
                src={row.original.user_profile}
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
      id: "addSofa",
      columns: [
        {
          header: "Sofa",
          size: 150,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="text-sky-500 px-2 py-2 border border-sky-500 rounded-md"
              onClick={() => handleAddSofa(row.original._id)}
            >
              Sofa Details
            </button>
          ),
        },
      ],
    },
  ];

  const handleAddSofa = (id) => {
    console.log(id)
    navigate(`/role/superadmin/couch/sofadetails/${id}`)
  };

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

  const sortedData = couch
    ?.slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchData = sortedData?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone_number.includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isLoading ? <Loader /> : null}
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0 ">
        <AddButton
          title={"Privilege Couch"}
          link={"/role/superadmin/couch/add-new"}
        />
        <div className="md:hidden">
          <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
            <BsSearch />
            <input
              type="text"
              placeholder="Search privilege couch by name or phone"
              className="h-full w-full ms-3 outline-none bg-gray-200"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-full h-auto flex flex-col gap-2 items-center mt-5 mb-24">
            <div className="w-full h-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 items-center mb-24">
              {searchData?.map((couch, i) => {
                return (
                  <Link
                    // to={`/role/superadmin/couch/couch-info/${couch._id}`}
                    to={`/role/superadmin/couch/sofadetails/${couch._id}`}
                    className="w-full"
                    key={i}
                  >
                    <UserCard
                      image={couch.profile_pic}
                      name={couch.name}
                      phoneNumber={couch.phone_number}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="h-auto m-[2px] p-[15px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:rounded-none md:m-0">
            <div ref={tableRef} className="">
              <MaterialReactTable
                style={{ margin: "20px" }}
                columns={columns}
                data={couchTable}
                positionToolbarAlertBanner="bottom"
                enableStickyFooter={true}
                enableStickyHeader={true}
              />
            </div>
            <div className="h-24"></div>
          </div>
        </div>
        {isImageModel ? (
          <ImageModel
            src={selectedImage ? selectedImage : black_image}
            handleClose={() => setIsImageModel(false)}
          />
        ) : null}
      </div>
    </>
  );
};

export default Couch;
