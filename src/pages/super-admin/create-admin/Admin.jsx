import { BsSearch } from "react-icons/bs";
import AddButton from "../../../componets/ui-elements/AddButton";
import { Link } from "react-router-dom";
import black_user from "../../../assets/blank_user.svg";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import { filterByProperty } from "../../../utils/CommonFunctions";
import ImageModel from "../../../componets/ui-elements/ImageModel";

const Admin = () => {
  const [admin, setAdmin] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getAllAdmin = async () => {
    try {
      const userDataString = localStorage.getItem("user");
      const userData = JSON.parse(userDataString);
      const response = await makeApiCall(
        "get",
        "user/alladmin",
        null,
        userData.token,
        "raw"
      );
      const filterdAdmin = filterByProperty(
        response.data.data,
        "is_deleted",
        false
      );
      setAdmin(filterdAdmin);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllAdmin();
  }, []);

  const sortedData = admin
    ?.slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const searchData = sortedData?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <AddButton
          title={"Admin"}
          link={"/role/superadmin/create-admin/add-new"}
        />
        <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
          <BsSearch />
          <input
            type="text"
            placeholder="Search admin"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {searchData ? (
          searchData.length > 0 ? (
            <div className="w-full h-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 items-center mb-24">
              {searchData?.map((data, i) => {
                return (
                  <DashboardCard
                    key={i}
                    profile_pic={data.profile_pic}
                    name={data.name}
                    phone_number={data.phone_number}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-xl text-center font-medium text-gray-400 mt-24">
              No Admin Found
            </p>
          )
        ) : (
          <>
            <div className="h-[170px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
            <div className="h-[170px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
          </>
        )}
      </div>
    </>
  );
};

const DashboardCard = ({ profile_pic, name, phone_number }) => {
  const [isImageModel, setIsImageModel] = useState(false);
  return (
    <>
      <div
        className="bg-white p-3 rounded-xl h-auto"
        style={{ boxShadow: "0px 0px 20px #0000002b" }}
      >
        <Link to={`/role/superadmin/admin/${phone_number}`} className="w-full">
          <div className="garbaImage flex justify-center items-center overflow-hidden">
            <img
              src={profile_pic ? profile_pic : black_user}
              alt="image"
              className="w-[70px] h-[70px] rounded-3xl"
              onClick={() => setIsImageModel(true)}
            />
          </div>
          <div className="garbaText my-4 text-center">
            <h1 className="text-xl font-medium">{name}</h1>
            <p className="text-sm text-gray-400 my-1">{phone_number}</p>
          </div>
        </Link>
      </div>
      {isImageModel ? (
        <ImageModel
          src={profile_pic ? profile_pic : black_user}
          handleClose={() => setIsImageModel(false)}
        />
      ) : null}
    </>
  );
};

export default Admin;
