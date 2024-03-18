import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../api/Post";
import ImageUpload from "../../componets/ui-elements/ImageUpload";
import PrimaryButton from "../../componets/ui-elements/PrimaryButton";
import { maxFileSize, opixo_day_data } from "../../utils/commonData";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Pagination } from "@mui/material";
import LogoOpicxo from "../../assets/LogoOpicxo.png";
import {saveAs} from "file-saver";
import { MdClose, MdDownload } from "react-icons/md";
import { downloadImage, filterByProperty } from "../../utils/CommonFunctions";

const OpixoGallery = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState();
  const [userImages, setUserImages] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const [isImageModel, setIsImageModel] = useState();
  const [loading, setLoading] = useState(false);
  const [downloadImageLoading, setDownloadImageLoading] = useState(false);
  const [addImgModel, setAddImgModel] = useState(false);
  const [uploadImage, setUploadImage] = useState();
  const [uploadDsiplayImage, setUploadDsiplayImage] = useState();
  const [fileSizeExceeded, setFileSizeExceeded] = useState(false);
  const [isShowUserImage, setIsShowUserImage] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState([]);

  const fetchImages = async (pageNumber = 0) => {
    setLoading(true);
    try {
      // const resp = await makeApiCall("get","opixo/getImage/11534",null,"raw");
      const resp = await axios.get(
        BASE_URL + `opixo/getImage/${params.day}/${pageNumber}`
      );

      console.log(resp)

      if (resp.status === 200) {
        const lgth = Math.ceil(resp.data.total_images / 15);
        const newTotalPage = [];
        for (let index = 0; index < lgth; index++) {
          newTotalPage.push(index);
        }
        setTotalPage(newTotalPage);
        setImages(resp.data.picture_list);
        setLoading(false);
      } else {
        console.log(resp);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error====>", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchImages(newPage);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

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

  const getMyImage = async () => {
    setLoading(true);
    try {
      const data = {
        albumid: params.day,
        username: "bhidu",
        userImage: uploadImage,
      };
      const resp = await axios.post(BASE_URL + `opixo/registerFace`, data);

      console.log(resp.status);
      if (resp.status === 200) {
        console.log(resp)
        console.log(resp.data.status)
        if (resp.status === true) {
          setIsShowUserImage(true);
          setUserImages(resp.data.data.picture_list);
          const lgth = Math.ceil(resp.data.data.total_images / 15);
          const newTotalPage = [];
          for (let index = 0; index < lgth; index++) {
            newTotalPage.push(index);
          }
          setTotalPage(newTotalPage);
          setAddImgModel(false);
          setLoading(false);
          setUploadDsiplayImage();
          setUploadImage();
        } else {
          setAddImgModel(false);
          setLoading(false);
        }
      } else {
        console.log(resp);
        setLoading(false);
        setAddImgModel(false);
        setUploadDsiplayImage();
        setUploadImage();
      }
    } catch (error) {
      setUploadDsiplayImage();
      setLoading(false);
      setAddImgModel(false);
      console.log("Error is ====> ", error);
      setUploadImage();
    }
  };

  const handleDownload =  async(url)=>{

    const time = Date.parse(Date())
    const day =filterByProperty (opixo_day_data,"value",parseInt(params.day));
    const rawname = day[0].label+"verselix"+time;
    const finalName=rawname.replace(/\s/g,'')
    downloadImage(url,setDownloadImageLoading,finalName)
  }

  return (
    <>
      <div className="h-screen overflow-y-auto p-2 flex flex-col items-start justify-start gap-2">
        <div className="flex items-center justify-between  text-2xl cursor-pointer w-full py-4 px-1">
          <div onClick={()=>navigate("/opixo")} className="w-[150px]">
            <img src={LogoOpicxo} className="w-full" />
          </div>

          <button
            // onClick={() => setAddImgModel(true)}
            onClick={() => navigate(`/opixo/user-images/${params.day}`)}
            className="capitalize primary-button text-[16px] xs:text-md text-white px-2 py-1 rounded "
          >
            Find your image
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-y-auto">
          {loading ? (
            <>Loading...</>
          ) : isShowUserImage ? (
            userImages.length>0?
            userImages?.map((img) => {
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
            }):<p>Sorry you are visible to anyone</p>
          ) : (
            images?.map((img) => {
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
            })
          )}
        </div>
        <div className="h-[92px]"></div>
        <div className="fixed bottom-0 bg-white w-full flex flex-col items-center justify-center gap-2 p-3">
          <div className="w-full flex gap-2 items-center justify-center">
            <Pagination
              count={totalPage.length}
              page={page + 1}
              onChange={(event, value) => handlePageChange(value - 1)}
              color="primary"
            />
          </div>
          <p className="text-center w-full text-gray-700 text-sm">
            Powerd by <span className="text-black font-semibold">Opicxo</span>
          </p>
        </div>
      </div>
      {isImageModel ? (
        <ImageModel
          src={selectedImage ? selectedImage : black_image}
          handleClose={() => setIsImageModel(false)}
          isDownLoad={false}
          downloadFunc={()=>handleDownload(selectedImage)}
          loading={downloadImageLoading}
        />
      ) : null}
      {addImgModel ? (
        <div className="bg-[#00000050] h-screen w-full absolute top-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="bg-white md:max-h-[500px] md:h-auto md:w-2/4 w-3/4 max-h-3/4 rounded-md p-5 overflow-y-auto">
            {loading ? (
              "Loading"
            ) : (
              <>
                <div className="flex items-center justify-between  text-2xl cursor-pointer ">
                  <p className="font-semibold">Upload your selfie</p>
                  <span onClick={() => setAddImgModel(false)}> &times;</span>
                </div>
                <hr className="w-full my-4 border-black" />
                <div className="eventImage flex flex-col w-full gap-3 justify-center items-center">
                  <div className="authorizedPersonAvtar w-full">
                    <ImageUpload
                      id={"file"}
                      name={"profile_pic"}
                      handleChange={(e) => handleFileChange(e)}
                      source={uploadDsiplayImage}
                      heading={"Image"}
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
                    background={"primary-button"}
                    // handleClick={()=>console.log(mentorParams)}
                    handleClick={getMyImage}
                    title={"Submit"}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default OpixoGallery;


const ImageModel = ({ src, handleClose, isDownLoad,downloadFunc,loading }) => {
  // const [loading, setLoading] = useState(false);

  // const handleDownload = (imgUrl) => {
  //   // Call the downloadImage function and pass the imageUrl and setLoading as arguments
  //   downloadImage({ imgUrl }, setLoading);
  // };
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
          onClick={downloadFunc}
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
