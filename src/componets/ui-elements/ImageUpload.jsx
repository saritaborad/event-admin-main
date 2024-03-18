import React from "react";
import { BsUpload } from "react-icons/bs";
import { MdClose, MdDelete, MdPhotoLibrary } from "react-icons/md";
// import { FaRotate } from 'react-icons/fa6'

const ImageUpload = ({
  id,
  handleChange,
  source,
  heading,
  height,
  label,
  imageSize,
  name,
}) => {
  return (
    <div>
      <p className="font-semibold mb-4">{heading}</p>
      <div
        className={`eventImage mt-2 border border-black flex ${height} flex-col gap-3 justify-center items-center p-7 rounded-md bg-white`}
      >
        <input
          type="file"
          id={id}
          className="hidden"
          name={name}
          accept=".jpg,.jpeg,.png,.svg"
          onChange={handleChange}
        />

        {source ? (
          <div className="relative flex item-center justify-center">
            {/* <div className='absolute flex p-1 items-center justify-center h-5 w-5 bg-red-600 rounded-full -top-2 -right-2' onClick={handleDelete}>
                  <MdClose className='text-lg text-white' />
                </div> */}
            <img
              src={source}
              alt="image"
              className={`h-auto ${imageSize} object-cover imageShadow`}
            />
          </div>
        ) : (
          <>
            <MdPhotoLibrary className="text-3xl" />
            <p className="text-gray-400">
              Only .jpg .jpeg .png images are acceptable
            </p>
          </>
        )}
        <label
          htmlFor={id}
          className="bg-gray-100  flex items-center gap-2 p-2 rounded-md cursor-pointer"
        >
          {source ? (
            <BsUpload className="text-xl" />
          ) : (
            <BsUpload className="text-xl" />
          )}
          {label}
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
