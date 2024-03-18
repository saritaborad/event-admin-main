import React from 'react'

const PhoneNumberInput = ({ value,name, handleChange, ...options }) => {
  return (
    <>
      <p className="text-[14px] text-black font-semibold ms-1 mb-1">Phone no.</p>
      <div className={`w-full h-16 border border-gray-300 rounded-lg`}>
        <div className="flex items-center h-full">
          <div className="mx-2 w-full flex flex-col py-2 pl-2 h-full justify-center">
            <input
              type="text"
              className="outline-none w-full placeholder:text-[14px] bg-transparent"
              placeholder={"Enter user phone no."}
              onChange={handleChange}
              value={value}
              min="0"
              name={name}
              maxLength={10}
              {...options}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default PhoneNumberInput


//  const handleNumberChange = async (e, type) => {
//     const inputValue = e.target.value;
//     const { name, value } = e.target;
//     const numericValue = inputValue.replace(/[^0-9]/g, "");
    
//     if (numericValue.length <= 10) {
//       const isExist = await handleNumberValidate(numericValue);

//       if (isExist && isExist.data.status == 1) {

//         if (isExist.data.data.roles === "n-user") {
//           console.log(e.target.value, "Contact number");
//           if (type = "mentor") {
//             setMentorParams({ ...mentorParams, [name]: value });
//           } else {
//             setEditDetailParams({ ...editDetailParams, [name]: value });
//           }

//         } else {
//           setIsAlert(true);
//           setStatus("error");
//           setErrorMsg(
//             `User already exists as a ${isExist.data.data.roles}. Try with another number.`
//           );
//         }
//       } else {
//         setPhoneNo(e.target.value);
//       }
//     }
//   };