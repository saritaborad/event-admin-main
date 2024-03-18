import React, { useState } from "react";
import flower from "../../assets/flower2.png";
import raas_Image from "../../assets/raas.png";
import {
  MdPersonOutline,
  MdOutlineMailOutline,
  MdOutlinePhoneIphone,
} from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [instaID, setInstaID] = useState("");
  const [image,setImage]=useState();

  const navigate = useNavigate();
  const handleSignUp = async(e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("email",email); 
    formData.append("name",fullName); 
    formData.append("phone_number",number); 
    formData.append("profile_pic",image); 
    formData.append("instagram_id",instaID); 

    // try {
    //   const response = await signUp(formData);
    //   console.log(response);
    //   if(response.status===200){
    //     localStorage.setItem("token",response.data.token)
    //     if(response.data.user.roles==="superadmin")
    //     {

    //       navigate("role/superadmin");
    //     }
    //     else{
    //       alert("User not valid to go forward")
    //     }
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
    console.log(fullName, email, number, instaID,image);
  };

  return (
   <>
      <div className="accountPage">
        <div className="createAccountPage pt-10 mx-7">
          <div className="CreateAccount">
            <div className="titleText flex items-center mt-10">
              <div className="image">
                <img src={flower} alt="image" />
              </div>
              <div className="eventText ms-3">
                <h1 className="text-2xl text-[#FE385C] font-semibold">Event</h1>
              </div>
            </div>

            <div className="acreatAccountText mt-8">
              <h1 className="text-3xl font-semibold">Create Your Account</h1>
              <p className="mt-5 text-gray-400">
                I have already account
                <Link to={"/"} className="underline ms-1 text-black">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="signUp bg-white mt-16 py-4">
          <form id="form" >
            <div className="avtarName flex items-center py-5 px-5">
              <div className="avtar flex items-center justify-center border border-gray-400 rounded-full overflow-hidden h-24 w-24">
                {image?
                  <img src={image} alt="image" />:null}
              </div>
              <div className="fileUpload ms-5">
                <div className="yourAvtarText">
                  <p className="text-gray-400">Your Avatar</p>
                </div>
                <div className="uploadFile mt-3 bg-black p-2 rounded-xl px-7">
                  <label htmlFor="file" className="text-white text-sm">
                    Choose File
                  </label>
                  <input
                  onChange={(e)=>setImage(e.target.files)}
                    type="file"
                    id="file"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="fullNAmeInput mt-3 py-4 border border-gray-300 rounded-2xl mx-3">
              <div className="Name flex items-center">
                <p className="ps-5 pe-3">
                  <MdPersonOutline className="text-2xl" />
                </p>
                <p className="text-xl">|</p>
                <input
                  id="fullName"
                  type="text"
                  className="ps-3 outline-none"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="emailInput mt-5 py-4 border border-gray-300 rounded-2xl mx-3">
              <div className="email flex items-center">
                <p className="ps-5 pe-3">
                  <MdOutlineMailOutline className="text-2xl" />
                </p>
                <p className="text-xl">|</p>
                <input
                  type="email"
                  className="ps-3 outline-none"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="phoneNumberInput mt-5 py-4 border border-gray-300 rounded-2xl mx-3">
              <div className="phoneNumber flex items-center">
                <p className="ps-5 pe-3">
                  <MdOutlinePhoneIphone className="text-2xl" />
                </p>
                <p className="text-xl">|</p>
                <input
                  type="number"
                  className="ps-3 outline-none"
                  placeholder="Phone Number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="instagramInput mt-5 py-4 border border-gray-300 rounded-2xl mx-3">
              <div className="instagram flex items-center">
                <p className="ps-5 pe-3">
                  <FaInstagram className="text-2xl" />
                </p>
                <p className="text-xl">|</p>
                <input
                  type="text"
                  className="ps-3 outline-none"
                  placeholder="Instagram ID"
                  value={instaID}
                  onChange={(e) => setInstaID(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSignUp}
              className="requestOTP text-white py-3 text-lg w-5/6 flex justify-center mt-10 mx-auto bg-gradient-to-l from-[#FE385C] to-[#FF5D53] rounded-full"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup