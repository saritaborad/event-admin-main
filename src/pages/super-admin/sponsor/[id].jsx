import React, { useState, useEffect } from "react";
import { MdPersonOutline, MdOutlineMail } from "react-icons/md";
import {
  BsGeo,
  BsTelephone,
  BsFillFilePersonFill,
  BsFillPersonCheckFill,
  BsBuildings,
} from "react-icons/bs";
import { FaParking } from "react-icons/fa";
import { ImDatabase } from "react-icons/im";
import { LuParkingSquare } from "react-icons/lu";
import raas_Image from "../../../assets/raas.png";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import ValueInput from "../../../componets/ui-elements/ValueInput";
import { makeApiCall } from "../../../api/Post";
import Loader from "../../../componets/ui-elements/Loader";
import { filterByProperty } from "../../../utils/CommonFunctions";
import Alert from "../../../componets/ui-elements/Alert";

const SponsorInfo = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [singlSponsor, setSponsor] = useState(null);
  const sponsorId = param.id;
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [addMoney, setAddMoney] = useState(true);

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const findSponsor = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall("get", "sponsor/all", null);
      if (response.data.status === 1) {
        setLoading(false);
        const rawData = response.data.data;

        const filterData = filterByProperty(rawData, "_id", sponsorId);
        setSponsor(filterData[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const response = await makeApiCall(
        "post",
        "user/updatesposnobal",
        {
          sponsor_id: sponsorId,
          balance_amount: addMoney === true ? balance : "-" + balance,
        },
        "raw"
      );
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const handleClick = () => {
    if (balance > 0) {
      setIsAlert(true);
      setStatus("start");
    } else {
      setIsAlert(true);
      setErrorMsg("Please fill all field");
      setStatus("error");
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    findSponsor();
    setIsAlert(false);
  };

  useEffect(() => {
    findSponsor();
  }, []);

  console.log(singlSponsor);

  return (
    <>
      {isAlert ? (
        <Alert
          isOpen={isAlert}
          title="Are you sure?"
          text="You won't be able to revert this!"
          confirmButtonText="Submit"
          cancelButtonText="Cancel"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          status={status}
          confirmText={successMsg}
          errorText={errorMsg}
          onComplete={handleComplete}
        />
      ) : null}
      {loading ? <Loader /> : null}
      <div className="md:h-screen md:overflow-y-auto md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="h-auto bg-white mt-12 mx-2 rounded-3xl p-[20px] relative md:mt-24">
            <div className="top text-center ">
              <div className="image bg-white border-4 border-white rounded-full absolute h-[100px] w-[100px] top-[-50px] left-0 right-0 m-auto flex place-content-center overflow-hidden">
                <img src={singlSponsor?.profile_pic} alt="image" />
              </div>
            </div>
            <div className="name mt-10 text-center">
              <h3 className="text-2xl my-1">{singlSponsor?.name}</h3>
              <h3 className="text-gray-400 my-1">
                {singlSponsor?.phone_number}
              </h3>
            </div>
            <hr className="my-3" />
            <div className="my-3 mx-5 flex items-center">
              <BsBuildings className="text-2xl text-gray-400" />
              <div className="mx-4">
                <p className="text-sm text-gray-400">Company Name</p>
                <p className="font-medium">{singlSponsor?.company_name}</p>
              </div>
            </div>
            <div className="my-3 mx-5 flex items-center">
              <BsFillPersonCheckFill className="text-2xl text-gray-400" />
              <div className="mx-4">
                <p className="text-sm text-gray-400">Authorized Person</p>
                <p className="font-medium">{singlSponsor?.authorized_person}</p>
              </div>
            </div>
            {/* <div className="my-3 mx-5 flex items-center">
          <BsGeo className="text-2xl text-gray-400" />
          <div className="mx-4">
            <p className="text-sm text-gray-400">Zone Allot</p>
            <p className="font-medium">{singlSponsor?.zone}</p>
          </div>
        </div> */}
          </div>

          <div className="h-auto bg-white mt-3 mx-2 rounded-3xl p-[20px] ">
            <div className="flex items-center gap-5">
              <div className="logo mx-2">
                <p className="text-gray-400">Company Logo</p>
                <img
                  src={singlSponsor?.company_logo}
                  alt="image"
                  className="h-36 w-36 my-4 rounded-xl object-cover"
                />
              </div>
              <div className="logo mx-2">
                <p className="text-gray-400">Banner</p>
                <img
                  src={singlSponsor?.profile_pic}
                  alt="image"
                  className="h-36 w- my-4 rounded-xl object-cover"
                />
              </div>
            </div>
          </div>

          <div className="h-auto bg-white mt-3 mx-2 rounded-3xl p-[20px]">
            <div className="balance flex items-center">
              <p className="text-gray-400">Total Balance Alloted</p>
              <p className="text-2xl ms-auto font-semibold ">
                ₹{singlSponsor?.balance_alloted}
              </p>
            </div>
            <div className="my-3">
              <input
                type="radio"
                name="balance"
                id="add"
                className="accent-primary"
                onChange={(e) => setAddMoney(true)}
              />
              <label htmlFor="add" className="mx-2 cursor-pointer">
                Add money
              </label>
              <input
                type="radio"
                name="balance"
                id="money"
                className="ms-10 accent-primary"
                onChange={(e) => setAddMoney(false)}
              />
              <label htmlFor="money" className="mx-2 cursor-pointer">
                Deduct money
              </label>
              <input
                type="number"
                className="w-full border my-3 p-2 rounded-lg outline-none translate"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <p
                className={`border cursor-pointer ${
                  addMoney === true
                    ? "border-green-600 text-green-600"
                    : "border-primary text-primary"
                } px-2 py-1 rounded-full`}
                onClick={() => setBalance(1000)}
              >
                {addMoney === true ? "+" : "-"} ₹1000
              </p>
              <p
                className={`border cursor-pointer ${
                  addMoney === true
                    ? "border-green-600 text-green-600"
                    : "border-primary text-primary"
                } px-2 py-1 rounded-full`}
                onClick={() => setBalance(2000)}
              >
                {addMoney === true ? "+" : "-"} ₹2000
              </p>
              <p
                className={` border cursor-pointer ${
                  addMoney === true
                    ? "border-green-600 text-green-600"
                    : "border-primary text-primary"
                } px-2 py-1 rounded-full`}
                onClick={() => setBalance(5000)}
              >
                {addMoney === true ? "+" : "-"} ₹5000
              </p>
              <p
                className={` border cursor-pointer ${
                  addMoney === true
                    ? "border-green-600 text-green-600"
                    : "border-primary text-primary"
                } px-2 py-1 rounded-full`}
                onClick={() => setBalance(7000)}
              >
                {addMoney === true ? "+" : "-"} ₹7000
              </p>
            </div>

            <div className="w-full pt-7 px-20">
              <PrimaryButton
                title={"Submit"}
                background={"bg-primary"}
                handleClick={handleClick}
              />
            </div>
          </div>

          <div className="h-auto bg-white mt-3 mx-2 rounded-3xl p-[20px]">
            <div className="text flex items-center">
              <p className="text-lg font-semibold">Transaction</p>
              <p
                className="ms-auto text-primary underline cursor-pointer"
                onClick={() =>
                  navigate(
                    `/role/superadmin/sponsordashboard/sponsor/transaction/${singlSponsor?.phone_number}`
                  )
                }
              >
                See All
              </p>
            </div>
            {/* <div className="info flex items-center justify-between">
              <div className="data mt-5">
                <p>Invoice#12124546</p>
                <p className="text-gray-400 text-sm">Monday, 4:07 pm</p>
              </div>
              <div className="amount mt-5">
                <p className="text-primary">- ₹1090</p>
              </div>
              <div className="status mt-5">
                <p className="text-white bg-[#F1B211] py-1 px-3 text-sm rounded-full">
                  Pending
                </p>
              </div>
            </div> */}
          </div>

          <div className="h-24"></div>
        </div>
      </div>
    </>
  );
};

export default SponsorInfo;
