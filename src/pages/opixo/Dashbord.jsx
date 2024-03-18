import React, { useEffect, useState } from "react";
import Select from "react-select";
import { animatedComponents, opixo_day_data } from "../../utils/commonData";
import { BASE_URL, makeApiCall } from "../../api/Post";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoOpicxo from "../../assets/LogoOpicxo.png"

const OpixoDashbord = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full  flex flex-col items-start justify-start  gap-4 overflow-hidden">
      <div className="flex items-center justify-between  text-2xl cursor-pointer w-full p-5">
          <div className="w-[120px]" onClick={()=>navigate("/opixo")}>
          <img src={LogoOpicxo} className="w-full" />
          </div>

          {/* <button
            onClick={() => setAddImgModel(true)}
            className="primary-button text-sm xs:text-md text-white px-2 py-1 rounded font-semibold"
          >
            Add your image
          </button> */}
        </div>
      <hr className="w-full" />
     <div className="grid xs:grid-cols-4 grid-cols-3 gap-2 justify-center items-center w-full h-auto overflow-y-auto p-5">
        {
          opixo_day_data.map((el,i)=>{
            return(
              <div onClick={()=>navigate(`/opixo/user-images/${el.value}`)} key={i} className="cardBg text-[#fff] w-full xs:h-[150px] h-[110px]  rounded-md  flex items-center justify-center overflow-hidden xs:text-xl text-md font-bold">
                {el.label}
              </div>
            )
          })
        }
      </div>
         <p className="fixed bottom-5 text-center w-full text-gray-700 text-sm">Powerd by <span className="text-black font-semibold">Opicxo</span></p>
      <div className="h-24"></div>

     
    </div>
  );
};

export default OpixoDashbord;
