import { BsTag, BsSearch, BsArrowRightCircle } from "react-icons/bs";
import AddButton from "../../../componets/ui-elements/AddButton";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import { FaCopy } from "react-icons/fa";
import { copyToClipboard } from "../../../utils/CommonFunctions";

const PromoCode = () => {
  const [promoCode, setPromoCode] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [textToCopy, setTextToCopy] = useState();

  const getAllPromoCode = async () => {
    try {
      const response = await makeApiCall("get", "/promocode/all", null, "raw");
      console.log(response);
      setPromoCode(response.data.tickets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPromoCode();
  }, []);

  const SortedData = promoCode
    ?.slice()
    .sort((a, b) => a.promo_code.localeCompare(b.promo_code));
  const handleSearchChangeUnUsed = (event) => {
    setSearchQuery(event.target.value);
  };
  const SearchData = SortedData?.filter((item) =>
    item.promo_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="h-[92vh] m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <AddButton
            title={"PromoCode"}
            link={"/role/superadmin/promocode/add-new"}
          />
          <div className="w-full p-4 rounded-xl bg-gray-200 my-5 flex items-center justify-start mb-3">
            <BsSearch />
            <input
              type="text"
              placeholder="Search promocode"
              className="h-full w-full ms-3 outline-none bg-gray-200"
              value={searchQuery}
              onChange={handleSearchChangeUnUsed}
            />
          </div>

          <div className="w-full h-auto flex flex-col gap-2 items-center">
            {SearchData ? (
              SearchData.length > 0 ? (
                SearchData?.map((promocode) => {
                  return (
                    <PromoCodeCard
                      key={promocode._id}
                      id={promocode._id}
                      icon={<BsTag className="text-xl" />}
                      title={promocode.promo_code}
                      percentage={promocode.discount_percentage}
                      influencerName={promocode.remark}
                    />
                  );
                })
              ) : (
                <p className="text-xl font-medium text-gray-400 mt-24">
                  No Promocode Found
                </p>
              )
            ) : (
              <>
                <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
                <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
                <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoCode;

const PromoCodeCard = ({ id, title, influencerName, percentage }) => {


  return (
    <div className="flex items-center justify-between w-full">
      <Link
        to={`/role/superadmin/promocode/${id}`}
        className="w-[90%] flex items-center justify-start"
      >
        <div className="bg-none  border border-[#DDDCDC] w-[90%] font-bold text-[20px] h-[40px] rounded-full flex items-center justify-between py-2 px-2 gap-2">
          <div className="flex items-center w-auto font-medium text-sm gap-2">
            {/* {icon} */}
            <p className="flex items-center justify-center gap-2">{title}</p>-
            <p>{influencerName}</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <p className="text-sm font-medium">{percentage} %</p>
            {/* <BsArrowRightCircle size={20} /> */}
          </div>
        </div>
      </Link>
      <span
        className=" h-[40px] w-[40px] text-sm rounded-full bg-gray-200 text-gray-600 border border-gray-600 flex items-center justify-center cursor-pointer"
        onClick={() => copyToClipboard({ textToCopy: title })}
      >
        <FaCopy />
      </span>
    </div>
  );
};
