import React, { useEffect, useState } from "react";
import InfoButton from "../../../../componets/ui-elements/InfoButton";
import AddButton from "../../../../componets/ui-elements/AddButton";
import { Link, useParams } from "react-router-dom";
import { BsFillPinFill, BsSearch } from "react-icons/bs";
import { makeApiCall } from "../../../../api/Post";
import { filterByProperty } from "../../../../utils/CommonFunctions";
import SecurityCard from "../../../../componets/ui-elements/SecurityCard";

const AssignSecurity = () => {
  const [assignData, setAssignData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const securityType = params.type;

  const fetchData = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "guard/" + securityType,
        null,
        "raw"
      );
      console.log(response.data.data);
      if (response.data.status === 1) {
        const rawData = response.data.data;
        const filterData = rawData.filter(
          (item) => item[securityType]._id === params.id
        );
        setAssignData(filterData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortedData = assignData
    ?.slice()
    .sort((a, b) => a.guard_name.localeCompare(b.guard_name));
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const searchData = sortedData?.filter(
    (item) =>
      item.guard_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone_number.includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <AddButton
          title={"Assign"}
          link={`/role/superadmin/securitydashboard/security-management/security/assign/assign-new/${securityType}/${params.id}`}
        />
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
            <BsSearch />
            <input
              type="text"
              placeholder="Search security by name or phone"
              className="h-full w-full ms-3 outline-none bg-gray-200"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-full h-auto flex flex-col gap-3 items-center mb-24">
            {searchData?.map((item) => {
              return (
                <SecurityCard
                  key={item._id}
                  image={item.profile_pic}
                  name={item.guard_name}
                  id={item._id}
                  phone_no={item.phone_number}
                  isAssign={false}
                  type={securityType}
                  typeId={params.id}
                  getFunc={fetchData}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignSecurity;
