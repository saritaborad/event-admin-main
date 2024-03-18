import React, { useState } from "react";
import LogoOpicxo from "../../assets/LogoOpicxo.png";
import ImageUpload from "../../componets/ui-elements/ImageUpload";
import PrimaryButton from "../../componets/ui-elements/PrimaryButton";
import { maxFileSize } from "../../utils/commonData";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api/Post";
import { Pagination } from "@mui/material";
import ImageModel from "../../componets/ui-elements/ImageModel";
import { MdReplay, MdWarning } from "react-icons/md";
import { FaRegImages } from "react-icons/fa";

const UserImages = () => {
  const [userImages, setUserImages] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState();
  const [isImageModel, setIsImageModel] = useState();
  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState();
  const [uploadDsiplayImage, setUploadDsiplayImage] = useState();
  const [fileSizeExceeded, setFileSizeExceeded] = useState(false);
  const [isShowUserImage, setIsShowUserImage] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState([]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = e.target.files[0];
    if (file && file.size < maxFileSize) {
      setFileSizeExceeded(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const prefixRegex = /^data:image\/(png|jpeg|heic);base64,/;
        const base64WithoutPrefix = base64String.replace(prefixRegex, "");
        setUploadDsiplayImage(base64String);
        setUploadImage(base64WithoutPrefix);
      };
      reader.readAsDataURL(file);
    } else {
      setFileSizeExceeded(true);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchImages(newPage);
  };

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

  const getMyImage = async () => {
    setLoading(true);
    try {
      const data = {
        albumid: params.albumid,
        username: "bhidu",
        userImage: uploadImage,
      };
      const resp = await axios.post(BASE_URL + `opixo/registerFace`, data);

      console.log(resp);
      if (resp.status === 200) {
        console.log(resp);
        console.log(resp.data.status);
        if (resp.data.status === true) {
          setIsShowUserImage(true);
          setUserImages(resp.data.data.picture_list);
          const lgth = Math.ceil(resp.data.data.total_images / 15);
          const newTotalPage = [];
          for (let index = 0; index < lgth; index++) {
            newTotalPage.push(index);
          }
          setTotalPage(newTotalPage);
          setLoading(false);
          setUploadDsiplayImage();
          setUploadImage();
        } else {
          setIsShowUserImage(true);
          setLoading(false);
        }
      } else {
        console.log(resp);
        setLoading(false);
        setUploadDsiplayImage();
        setUploadImage();
      }
    } catch (error) {
      setUploadDsiplayImage();
      setLoading(false);
      console.log("Error is ====> ", error);
      setUploadImage();
    }
  };


  return (
    <div className="h-screen w-full  flex flex-col items-start justify-start  gap-4 overflow-hidden">
      <div className="flex items-center justify-between  text-2xl cursor-pointer w-full py-4 px-1">
        <div className="w-[120px]" onClick={() => navigate("/opixo")}>
          <img src={LogoOpicxo} className="w-full" />
        </div>
        {!isShowUserImage ? null : (
          <button
            // onClick={() => setAddImgModel(true)}
            onClick={() => setIsShowUserImage(false)}
            className="capitalize bgCard text-[16px] xs:text-md text-white px-2 py-1 rounded "
          >
            Find your image
          </button>
        )}
      </div>
      <div className="w-full h-full flex items-center justify-center">
        {isShowUserImage ? (
          <div className="w-full h-full flex items-center justify-center">
            {userImages.length > 0 ? (
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-y-auto p-4">
                {userImages?.map((img) => {
                  return (
                    <div
                      key={img.PictureId}
                      onClick={() => handleOpenModel(img.PictureUrl)}
                    >
                      <img
                        className="h-full max-w-full rounded-lg object-cover"
                        src={img.PictureUrl}
                        alt=""
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 p-2 h-full">
                <p className="text-center">
                  Wow, you're shining so bright that even our camera can't quite
                  capture your radiance!
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button onClick={()=>navigate("/opixo")} className="bg-green-200 px-4 py-2 text-black rounded-full flex items-center justify-center gap-2 text-md">
                    <FaRegImages/>All images
                  </button>
                  <button onClick={()=>setIsShowUserImage(false)}  className="bg-yellow-200 px-4 py-2 text-black rounded-full flex items-center justify-center gap-2 text-md">
                    <MdReplay className="text-lg" />
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-[768px] w-auto h-full flex items-center justify-center">
            <div className="bg-white w-full rounded-md p-5 overflow-y-auto">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    className="inline w-14 h-14 mr-2 text-primary animate-spin dark:text-primary fill-gray-400 dark:fill-gray-400"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between  text-2xl cursor-pointer ">
                    <p className="font-semibold">Upload your selfie</p>
                  </div>
                  <div className="text-sm my-4 bg-yellow-100 text-yellow-600 py-2 px-3 rounded-lg border-yellow-500 border-l-4 flex items-center justify-start gap-4">
                    {/* <MdWarning className="text-xl"/> */}
                    <div className="flex flex-col items-start justify-center gap-1">
                      <p>
                        * Pose for the picture all by yourself (because being
                        alone sometimes has its advantages)!
                      </p>
                      <p>* Make sure image is clear and high resolution</p>
                    </div>
                  </div>
                  <div className="eventImage flex flex-col w-full gap-3 justify-center items-center">
                    <div className="authorizedPersonAvtar w-full">
                      <ImageUpload
                        id={"file"}
                        name={"profile_pic"}
                        handleChange={(e) => handleFileChange(e)}
                        source={uploadDsiplayImage}
                        //   heading={"Image"}
                        imageSize={"w-2/4"}
                        height={"h-auto min-h-56"}
                        label={uploadImage ? "Replace image" : "Upload image"}
                      />
                      {fileSizeExceeded && (
                        <p className="error text-red-500">
                          File size exceeded the limit of 9 mb
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full items-center gap-4 mt-6">
                    <PrimaryButton
                      background={"cardBg"}
                      // handleClick={()=>console.log(mentorParams)}
                      handleClick={getMyImage}
                      title={"Submit"}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 bg-white w-full flex flex-col items-center justify-center gap-2 p-3">
        <p className="text-center w-full text-gray-700 text-sm">
          Powerd by <span className="text-black font-semibold">Opicxo</span>
        </p>
      </div>
      <div className="h-24"></div>
      {isImageModel ? (
        <ImageModel
          src={selectedImage ? selectedImage : black_image}
          handleClose={() => setIsImageModel(false)}
          isDownLoad={true}
        />
      ) : null}
    </div>
  );
};

export default UserImages;
