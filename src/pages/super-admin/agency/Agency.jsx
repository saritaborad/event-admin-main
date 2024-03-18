import React, { useEffect, useState } from "react";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import AddButton from "../../../componets/ui-elements/AddButton";
import { Link } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import { makeApiCall } from "../../../api/Post";
import { filterByProperty } from "../../../utils/CommonFunctions";

const Agency = () => {
  const [agency, setAgency] = useState();

  const getAllAgency = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "agency/all",
        null,
        "raw"
      );
      const filterdCHeckpoints = filterByProperty(
        response.data.data,
        "is_deleted",
        false
      );
      console.log(filterdCHeckpoints);
      setAgency(filterdCHeckpoints);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllAgency();
  }, []);

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] md:rounded-none mt-4 flex flex-col gap-[40px]">
        <AddButton title={"Agency"} link={"/role/superadmin/agency/add-new"} />
        <div className="w-full h-auto flex flex-col gap-2 items-center">
          {agency?.map((agencydata) => {
            return (
              <Link
                to={`/role/superadmin/agency/${agencydata._id}`}
                className="w-full"
                key={agencydata._id}
              >
                <InfoButton
                  icon={<BsFillPersonFill className="text-xl" />}
                  title={`${agencydata.name}`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Agency;
