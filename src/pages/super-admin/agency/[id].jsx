import React from "react";
import { MdPersonOutline, MdOutlineMail, MdBloodtype } from "react-icons/md";
import {
  BsPhone,
  BsInstagram,
  BsCalendarWeek,
  BsFillPersonCheckFill,
  BsTelephone,
  BsFillFilePersonFill,
} from "react-icons/bs";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import ValueInput from "../../../componets/ui-elements/ValueInput";



const AgencyInfo = () => {
  const data = [
    {
      id: 1,
      placeholder: "Full Name",
      value: "Jaywin Patel",
      icon: MdPersonOutline,
    },
    {
      id: 2,
      placeholder: "Email Address",
      value: "jayvinpatel123@gmail.com",
      icon: MdOutlineMail,
    },
    {
      id: 3,
      placeholder: "Phone Number",
      value: "0123 456 789",
      icon: BsPhone,
    },
    {
      id: 4,
      placeholder: "Instagram ID",
      value: "jayvin_1234",
      icon: BsInstagram,
    },
    {
      id: 5,
      placeholder: "Date Of Birth",
      value: "14 JAN 1994",
      icon: BsCalendarWeek,
    },
    {
      id: 6,
      placeholder: "Blood Groupe",
      value: "B positive (B+)",
      icon: MdBloodtype,
    },
    {
      id: 7,
      placeholder: "Gender",
      value: "Male",
      icon: BsFillFilePersonFill,
    },
    {
      id: 8,
      placeholder: "Garba Class Name",
      value: "Branch Name One",
      icon: MdBloodtype,
    },
    {
      id: 9,
      placeholder: "Authorized Name",
      value: "A1 Garba Classes",
      icon: BsFillPersonCheckFill,
    },
    {
      id: 10,
      placeholder: "Contact Number",
      value: "0223 123 456",
      icon: BsTelephone,
    },
  ];

  return (
    <>
      <div className="createGarbaClassSubmit pt-24 h-[92vh]">
        <div className="flex flex-col items-center justify-between h-auto relative bg-[#f2f2f2] pt-4 mx-1 rounded-3xl md:rounded-none">
          <div className="w-full">
            <div className="avtarName flex items-center justify-center py-5 px-5">
              <div className="avtar flex justify-center items-center top-[-60px] rounded-full overflow-hidden absolute h-28 w-28">
                {/* <img src={UserImage} alt="image" className="w-full" /> */}
              </div>
              <div className="chnagePhoto mt-10">
                <p className="text-gray-400">Change Photo</p>
              </div>
            </div>
            {data.map((input) => {
              return (
                <ValueInput
                  value={input.value}
                  placeholder={input.placeholder}
                  icon={<input.icon />}
                />
              );
            })}
          </div>
          <div className="itemCenter w-full mt-5 flex justify-between gap-2 mb-24">
            {/* <PrimaryButton title={"Submit"} background={"primary-button"} /> */}
            <PrimaryButton title={"Edit Details"} background={"bg-black"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AgencyInfo;