import { BsDoorClosed, BsSearch } from "react-icons/bs";
import AddButton from "../../../componets/ui-elements/AddButton";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import { filterByProperty } from "../../../utils/CommonFunctions";

const Gate = () => {
  const [gates, setGates] = useState();
  const [searchQuery, setSearchQuery] = useState(""); 

  const navigate = useNavigate();

  const getAllGates = async () => {
    try {
      const response = await makeApiCall("get", "/gate/all", null, "raw");
      console.log(response.data.gates);
      if (response.data.status === 1) {
        const filterdGates = filterByProperty(
          response.data.gates,
          "is_deleted",
          false
        );
        console.log(filterdGates);
        setGates(filterdGates);
      } else if (response.data.status === 10) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllGates();
  }, []);

  const sortedData = gates
    ?.slice()
    .sort((a, b) => a.gate_name.localeCompare(b.gate_name));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchData = sortedData?.filter((item) =>
    item.gate_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
          <AddButton title={"Gate"} link={"/role/superadmin/gate/add-new"} />
          <div className="w-full p-4 rounded-xl bg-gray-200 my-5 flex items-center justify-start">
            <BsSearch />
            <input
              type="text"
              placeholder="Search gate"
              className="h-full w-full ms-3 outline-none bg-gray-200"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div></div>
          <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
            {searchData ? (
              searchData.length > 0 ? (
                searchData?.map((gate, i) => {
                  return (
                    <Link
                      to={`/role/superadmin/gate/${gate._id}`}
                      className="w-full"
                      key={i}
                    >
                      <InfoButton
                        icon={<BsDoorClosed className="text-xl" />}
                        title={gate.gate_name}
                      />
                    </Link>
                  );
                })
              ) : (
                <p className="text-xl text-center font-medium text-gray-400 mt-24">
                  No Gate Found
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

export default Gate;
