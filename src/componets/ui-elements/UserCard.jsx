import React, { useState } from "react";
import black_image from "../../assets/blank_user.svg";
import ImageModel from "./ImageModel";

const UserCard = ({ image, name, phoneNumber }) => {
  const [isImageModel, setIsImageModel] = useState(false);

  return (
    <>
      <div
        className="bg-white p-3 rounded-xl h-auto"
        style={{ boxShadow: "0px 0px 20px #0000002b" }}
      >
        <div className="garbaImage flex justify-center items-center overflow-hidden">
          <img
            src={image ? image : black_image}
            alt="image"
            className="w-[70px] h-[70px] rounded-xl object-cover"
            onClick={() => setIsImageModel(true)}
          />
        </div>
        <div className="garbaText my-4 text-center">
          <h1 className="text-xl font-medium">{name}</h1>
          <p className="text-sm text-gray-400 my-1">{phoneNumber}</p>
        </div>
      </div>
      {isImageModel ? (
        <ImageModel
          src={image ? image : black_image}
          handleClose={() => setIsImageModel(false)}
        />
      ) : null}
    </>
  );
};

export default UserCard;
