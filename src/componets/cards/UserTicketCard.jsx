import { BsFillPersonFill } from "react-icons/bs";
import ImageModel from "../ui-elements/ImageModel";
import { MdBlock } from "react-icons/md";
import { FaCrown, FaUser } from "react-icons/fa";

const UserTicketCard = ({
  name,
  random_id,
  specialAccessFunc,
  commonAccessFunc,
  blockFunc,
  is_active,
  colorCode,
  profile_pic,
  handleImageModelClose,
  isImageModel,
  selectedImage,
  handleOpenModel,
  userName,
  branchName,
  is_roles,
  is_used,
  is_parking_used
}) => {
  
  return (
    <div
      className="min-h-14 flex flex-col items-start overflow-hidden justify-start gap-3 p-3 h-auto w-full bg-white rounded-2xl relative"
      style={{
        boxShadow: "0px 0px 20px #0000002b",
      }}
    >
      <div className="flex items-center w-full justify-between">
        <div className="flex gap-4 items-start">
          {is_active ? (
            <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden">
              <img
                src={profile_pic}
                className="w-full object-cover h-full"
                onClick={() => handleOpenModel(profile_pic)}
              />
            </div>
          ) : (
            <div className="w-[55px] h-[55px] rounded-xl flex items-center justify-center overflow-hidden bg-gray-300">
              <BsFillPersonFill className="text-5xl text-gray-500" />
            </div>
          )}

          {isImageModel ? (
            <ImageModel
              handleClose={handleImageModelClose}
              src={selectedImage}
            />
          ) : null}
          <div className="flex flex-col items-start justify-center gap-1 ">
            {is_active === true ? (
              <p className="w-auto text-start text-lg">{userName}</p>
            ) : (
              <p
                className="text-sm py-1 px-3 rounded-full text-white"
                style={{ backgroundColor: "#" + colorCode }}
              >
                {name}
              </p>
            )}

            <p className="text-sm text-gray-500">ID : {random_id}</p>

            {is_roles === "p-user" ? (
              <div className="userRoles">
                <p className="text-sm text-gray-500">
                  Brach Name : {branchName}
                </p>
              </div>
            ) : null}

            {is_active ? (
              <div className="flex items-center gap-2">
                <p
                  className="text-sm py-1 px-3 rounded-full text-white"
                  style={{ backgroundColor: "#" + colorCode }}
                >
                  {name}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {is_active === true ? (
        <div className="flex flex-wrap items-center justify-center xs:justify-start w-full gap-1">
          <button
            onClick={specialAccessFunc}
            className=" text-sm primary-button rounded-full flex items-center justify-center gap-2 px-3 py-2 text-white whitespace-nowrap"
          >
            <FaCrown /> Special access
          </button>
          <button
            onClick={commonAccessFunc}
            className=" text-sm bg-black rounded-full flex items-center justify-center gap-2 px-3 py-2 text-white whitespace-nowrap"
          >
            <FaUser /> Common access
          </button>
          <button
            onClick={blockFunc}
            className="text-red-500 text-sm flex items-center gap-2 px-3 py-2 border border-red-500 rounded-full  whitespace-nowrap"
          >
            <MdBlock />
            Block
          </button>
        </div>
      ) : null}
      {

      }
      {
        is_used?
      <div className="absolute text-white text-xs h-5 w-20 bg-primary font-semibold -right-5 rotate-45 flex items-center justify-center">
        Used
      </div>
        :null
      }
      {
        is_parking_used?
      <div className="absolute text-white text-[8px] h-5 w-[100px] bg-primary  left-[-20px] rotate-[320deg] flex items-center justify-center ">
        Parking Used
      </div>
        :null
      }
    </div>
  );
};

export default UserTicketCard;
