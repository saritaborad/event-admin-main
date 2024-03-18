import { makeApiCall } from "../api/Post";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { capitalize } from "@mui/material";

// for filter data
export const filterByProperty = (array, propertyName, propertyValue) => {
  return array.filter((obj) => obj[propertyName] === propertyValue);
};

//<============= 2022-08-21
export const formatDateToYYYYMMDD = (inputDate) => {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

//<============= 21 Aug, 2022
export const formatDateToDDMMMYYYY = (inputDate) => {
  const date = new Date(inputDate);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const formattedDate = `${day} ${month}, ${year}`;
  return formattedDate;
};

//append form data
export const appendDataToFormData = (formData, data) => {
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
};

//phone number validation
export const handleNumberValidate = async (searchQuery) => {
  // Ensure the input length is exactly 10 digits
  if (searchQuery.length === 10) {
    try {
      return await makeApiCall(
        "post",
        "user/isexist",
        {
          phone_number: searchQuery,
        },
        "raw"
      );
    } catch (error) {
      console.error(error, "From catch");
    }
  } else {
    // Optionally, you can handle cases where the input length is not 10 digits here.
  }
};

//encrypt token
export const encryptToken = (token, SECRET_KEY) => {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

//decrypt token
export const decryptToken = (ciphertext, SECRET_KEY) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

//handle logout
export const handleLogout = async (navigateFunc) => {
  if (window.flutter_inappwebview != undefined) {
    try {
      let respone = await window.flutter_inappwebview.callHandler(
        "userLogout",
        "User Logout."
      );
      let isAppReady = false;
      window.addEventListener(
        "flutterInAppWebViewPlatformReady",
        function (event) {
          isAppReady = true;
        }
      );
      localStorage.clear();
    } catch (error) {
      alert(error);
    }
  } else {
    localStorage.clear();
    navigateFunc;
  }
};

export const formatVehicleNumber = (vehicleNumber) => {
  // Check if the input vehicle number is valid
  if (typeof vehicleNumber !== "string" || vehicleNumber.length !== 10) {
    return "Invalid Vehicle Number";
  }

  // Split the input vehicle number into parts and format
  const part1 = vehicleNumber.slice(0, 4); // First two characters
  const part2 = vehicleNumber.slice(4, 6); // Next two characters
  const part3 = vehicleNumber.slice(6); // The rest of the characters

  // Combine the parts with dashes to format the vehicle number
  const formattedNumber = `${part1}-${part2}-${part3}`;

  return formattedNumber;
};

export const capitalizeWords = (str) =>
  str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");

export const copyToClipboard = (options) => {
  const { textToCopy } = options;

  const textArea = document.createElement("textarea");
  textArea.value = textToCopy;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
};

export const downloadImage = (imageUrl, setLoading, fileName) => {
  setLoading(true);

  console.log("clicked");

  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Image download error:", error);
      // Handle the error, e.g., show an error message or update your loading state
    })
    .finally(() => {
      setLoading(false);
    });
};

export const encodedData = (dataString) => {
  return encodeURIComponent(dataString);
};

export const decodedData = (encodedData) => {
  return decodeURIComponent(encodedData);
};
