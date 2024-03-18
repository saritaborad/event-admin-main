import React, { useState } from "react";
import { MdClose, MdDownload } from "react-icons/md";
import { downloadImage } from "../../utils/CommonFunctions";

const ImageModel = ({ src, handleClose, isDownLoad }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = (imgUrl) => {
    // Call the downloadImage function and pass the imageUrl and setLoading as arguments
    downloadImage({ imgUrl }, setLoading);
  };
  return (
    <div
      // onClick={handleClose}
      className="bg-[#000000d9] h-screen w-full fixed z-[99] backdrop-blur-lg top-0 left-0 flex flex-col items-center justify-center p-5"
    >
      <div
        className="absolute top-10 flex items-center justify-end px-10 w-full"
        onClick={handleClose}
      >
        {/* {isDownLoad ? (
          ) : null} */}
        <MdClose className="text-2xl text-white font-bold" />
      </div>
      <img src={src} className="md:w-[40%] w-[90%] rounded-lg" loading="lazy" />
      {isDownLoad && (
        <div
          className="h-18 w-18 rounded-full border border-white p-2 mt-8"
          onClick={() => handleDownload(src)}
        >
          {loading ? (
            ""
          ) : (
            <MdDownload className="text-2xl text-white font-bold" />
          )}
        </div>
      )}
    </div>
  );
};

export default ImageModel;
