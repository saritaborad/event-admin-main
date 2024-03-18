import axios from "axios";
import CryptoJS from "crypto-js";
import {
  decryptToken,
  encryptToken,
  handleLogout,
} from "../utils/CommonFunctions";

const SECRET_KEY = import.meta.env.VITE_TOKEN_SECRET_KEY;
export const IS_PRODUCTION = import.meta.env.VITE_IS_PRODUCTION;

export let BASE_URL;
export const SCANNING_URL = import.meta.env.VITE_API_BASE_URL_SCANNING;

if (IS_PRODUCTION == "false") {
  BASE_URL = import.meta.env.VITE_API_BASE_URL; //<--------- stagging server for developing
} else {
  BASE_URL = import.meta.env.VITE_API_BASE_URL_PRODUCTION; //<--------- Production server for production build
}

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const performLogin = async (params) => {
  const response = await authApi.post("user/sendotp", params);
  return response;
};

export const validateOTP = async (params) => {
  const response = await authApi.post(BASE_URL + "user/verifyotp", params);
  console.log(response);

  const token = encryptToken(response.data.token, SECRET_KEY);
  const userData = {
    token: token,
    role: response.data.data.roles,
  };
  localStorage.setItem("user", JSON.stringify(userData));
  return response;
};

//common api function

export const makeApiCall = async (
  method,
  endpoint,
  params,
  // token,
  content_type,
  navigateFunc
) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = decryptToken(user.token, SECRET_KEY);

  const headers = {
    token: token,
    "Content-Type":
      content_type === "raw"
        ? "application/json"
        : content_type === "formdata"
        ? "multipart/form-data"
        : "application/json",
  };

  const config = {
    headers: headers,
  };

  try {
    let response;
    if (method === "post") {
      response = await axios.post(BASE_URL + endpoint, params, config);
    } else {
      if (params === null) {
        params = "";
      }
      response = await axios.get(BASE_URL + endpoint + params, config);
    }
    if (response.data.status === 10) {
      handleLogout(navigateFunc);
    } else {
      return response;
    }
  } catch (error) {
    if (error.response.data.status === 10) {
      handleLogout(null);
      window.location.href = "/login";
      console.log("API call logout");
    }
    console.error("API call error:", error);
    throw error; // Rethrow the error to handle it at the calling site
  }
};

export const scanningApiCall = async (
  method,
  endpoint,
  params,
  // token,
  content_type,
  navigateFunc
) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = decryptToken(user.token, SECRET_KEY);

  const headers = {
    token: token,
    "Content-Type":
      content_type === "raw"
        ? "application/json"
        : content_type === "formdata"
        ? "multipart/form-data"
        : "application/json",
  };

  const config = {
    headers: headers,
  };

  try {
    let response;
    if (method === "post") {
      response = await axios.post(SCANNING_URL + endpoint, params, config);
    } else {
      if (params === null) {
        params = "";
      }
      response = await axios.get(SCANNING_URL + endpoint + params, config);
    }
    if (response.data.status === 10) {
      handleLogout(navigateFunc);
    } else {
      return response;
    }
  } catch (error) {
    if (error.response.data.status === 10) {
      handleLogout(null);
      window.location.href = "/login";
      console.log("API call logout");
    }
    console.error("API call error:", error);
    throw error; // Rethrow the error to handle it at the calling site
  }
};
