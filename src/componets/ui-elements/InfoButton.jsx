import React from 'react'

import {BsArrowRightCircle} from "react-icons/bs"

const InfoButton = ({icon,title}) => {
  return (
    <div className='bg-none border border-[#DDDCDC] w-full font-bold text-[20px] h-[60px] rounded-[15px] flex items-center justify-between p-2.5 gap-2'>
        <div className='flex items-center w-auto font-medium text-[18px] gap-4' >
        {icon}
        <p>{title}</p>
        </div>
        <BsArrowRightCircle size={20} />
    </div>
  )
}

export default InfoButton