import React, { useEffect, useState } from "react";
import AddButton from "../../../componets/ui-elements/AddButton";
import { BiSolidDiscount } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { makeApiCall } from "../../../api/Post";
import { Link } from "react-router-dom";
import { filterByProperty } from "../../../utils/CommonFunctions";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import { MdDeleteForever } from "react-icons/md";
import { param } from "jquery";
import Alert from "../../../componets/ui-elements/Alert";

const ComplimentaryCodeSponsor = () => {
  const [usedComplimantorycode, setUsedComplimantorycode] = useState();
  const [notUsedComplimantorycode, setNotUsedComplimantorycode] = useState();
  const [isUsed, setIsUsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);
  const [selectedId, setSelectedID] = useState();

  const getAllComplimantorycode = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "user/allcomplimantorycode",
        null,
        "raw"
      );
      if (response.data.status === 1) {
        const isUsed = filterByProperty(response.data.data, "is_used", true);
        const isNotUsed = filterByProperty(
          response.data.data,
          "is_used",
          false
        );
        setUsedComplimantorycode(isUsed);
        setNotUsedComplimantorycode(isNotUsed);
      }
      console.log(response);
      //   setComplimantorycode(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllComplimantorycode();
  }, []);

  // notUsedComplimantorycode
  const unUsedCodeSortedData = notUsedComplimantorycode
    ?.slice()
    .sort(
      (a, b) =>
        a.phone_number ||
        a.coupon_code.localeCompare(b.phone_number || b.coupon_code)
    );
  const handleSearchChangeUnUsed = (event) => {
    setSearchQuery(event.target.value);
  };
  const UnusedCodeSearchData = unUsedCodeSortedData?.filter(
    (item) =>
      item.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.coupon_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // usedComplimantorycode
  const usedCodeSortedData = usedComplimantorycode
    ?.slice()
    .sort(
      (a, b) =>
        a.phone_number ||
        a.coupon_code.localeCompare(b.phone_number || b.coupon_code)
    );
  const handleSearchChangeUsed = (event) => {
    setSearchQuery(event.target.value);
  };
  const usedCodeSearchData = usedCodeSortedData?.filter(
    (item) =>
      item.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.coupon_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const requestParams = {
        code_id: selectedId,
      };
      const resp = await makeApiCall(
        "post",
        "sponsor/codedelete",
        requestParams,
        "raw"
      );
      console.log(resp);
      if (resp.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(resp.data.message);
      } else {
        setStatus("error");
        setErrorMsg(resp.data.message);
      }
    } catch (error) {
      console.warn(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const handleClick = (id) => {
    setIsAlert(true);
    setStatus("start");
    setSelectedID(id);
  };

  const handleCancel = () => {
    setIsAlert(false);
  };

  const handleComplete = () => {
    setIsAlert(false);
    getAllComplimantorycode();
  };

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
      <div className="h-full m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <AddButton
          title={"Complimantory Code"}
          link={"/role/sponsor/complimentary-code/issue-complymetery-pass"}
        />

        <div className="w-full my-3 p-1 border border-gray-300 rounded-2xl">
          <div className="flex items-center">
            <div className="relative flex item-center justify-between w-full gap-3  border-gray-300">
              <div
                className={`w-2/4 flex items-center justify-center text-[14px] h-[50px] rounded-xl text-center z-0 bg-primary absolute ${
                  isUsed === false
                    ? " translate-x-full transition-all  "
                    : "translate-x-[0] transition-all "
                }`}
              ></div>
              <div
                className={`w-2/4 flex items-center justify-center text-[16px] h-[50px] rounded-xl z-50 text-center ${
                  isUsed === true ? "text-white" : null
                }`}
                onClick={() => setIsUsed(true)}
              >
                Unused
              </div>
              <div
                className={`w-2/4 flex items-center justify-center text-[16px] h-[50px] rounded-xl z-50 text-center ${
                  isUsed === true ? null : "text-white"
                }`}
                onClick={() => setIsUsed(false)}
              >
                Used
              </div>
            </div>
          </div>
        </div>

        {isUsed === true ? (
          <div className="w-full h-auto flex flex-col gap-2 items-start rounded-lg pb-24">
            <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start mb-3">
              <BsSearch />
              <input
                type="text"
                placeholder="Search couponcode or phone"
                className="h-full w-full ms-3 outline-none bg-gray-200"
                value={searchQuery}
                onChange={handleSearchChangeUnUsed}
              />
            </div>
            {notUsedComplimantorycode?.length > 0 ? (
              UnusedCodeSearchData.map((complimantorycode) => {
                return (
                  <div className=" w-full border border-black font-bold text-[20px] h-[60px] rounded-[15px] flex items-center justify-between p-2.5 gap-2">
                    <Link
                      to={`/role/superadmin/complimantorycode/${complimantorycode.coupon_code}/${complimantorycode.phone_number}`}
                      className="w-full"
                      key={complimantorycode._id}
                    >
                      <div className="flex items-center w-auto font-medium text-[18px] gap-4">
                        <BiSolidDiscount className="text-3xl" />
                        <div className="info">
                          <p>{complimantorycode.coupon_code}</p>
                          <p className="text-sm">
                            Phone No : {complimantorycode.phone_number}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <div
                      className="text-3xl cursor-pointer"
                      onClick={() => handleClick(complimantorycode._id)}
                    >
                      <MdDeleteForever />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="w-full text-green-500 font-semibold text-2xl text-center mb-4">
                No data found !
              </p>
            )}
            {notUsedComplimantorycode?.length > 5 ? (
              <PrimaryButton title={"See more"} background={"bg-primary"} />
            ) : null}
          </div>
        ) : null}

        {isUsed === false ? (
          <div className="w-full h-auto flex flex-col gap-2 items-start rounded-lg pb-24">
            <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start mb-3">
              <BsSearch />
              <input
                type="text"
                placeholder="Search couponcode or phone"
                className="h-full w-full ms-3 outline-none bg-gray-200"
                value={searchQuery}
                onChange={handleSearchChangeUsed}
              />
            </div>

            {usedComplimantorycode?.length > 0 ? (
              usedCodeSearchData.map((complimantorycode) => {
                return (
                  <Link
                    to={`/role/superadmin/complimantorycode/${complimantorycode.coupon_code}/${complimantorycode.phone_number}`}
                    className="w-full"
                    key={complimantorycode._id}
                  >
                    <div className="bg-white w-full border border-black font-bold text-[20px] h-[60px] rounded-[15px] flex items-center justify-between p-2.5 gap-2">
                      <div className="flex items-center w-auto font-medium text-[18px] gap-4">
                        <BiSolidDiscount className="text-3xl" />
                        <div className="info">
                          <p>{complimantorycode.coupon_code}</p>
                          <p className="text-sm">
                            Phone No : {complimantorycode.phone_number}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="w-full text-green-500 font-semibold text-2xl text-center mb-4">
                No data found !
              </p>
            )}
            {/* {usedComplimantorycode?.length > 5 ? (
            <PrimaryButton title={"See more"} background={"bg-primary"} />
          ) : null} */}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ComplimentaryCodeSponsor;
