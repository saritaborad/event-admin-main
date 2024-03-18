import axios from "axios";
// import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const performLogin = async (email) => {
  const response = await axios.post(BASE_URL + "user/sendotp", {
    email: email,
  });

  return response;
};

export const validateOTP = async (datatype, data, otp) => {
  const response = await axios.post(BASE_URL + "user/verifyotp", {
    datatype: data,
    receivedotp: otp,
  });

  return response;
};
