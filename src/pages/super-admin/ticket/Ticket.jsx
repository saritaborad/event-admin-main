import { BsFillTicketPerforatedFill, BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import AddButton from "../../../componets/ui-elements/AddButton";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import { filterByProperty } from "../../../utils/CommonFunctions";

const Ticket = () => {
  const [ticket, setTicket] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getAllTicket = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "ticketcategory/all",
        null,
        "raw"
      );
      const filterTIckets = filterByProperty(
        response.data.tickets,
        "is_deleted",
        false
      );
      setTicket(filterTIckets);
      console.log(filterTIckets);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTicket();
  }, []);

  const sortedData = ticket
    ?.slice()
    .sort((a, b) => a.ticket_name.localeCompare(b.ticket_name));
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const searchData = sortedData?.filter((item) =>
    item.ticket_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
      <div className="md:w-[80%] lg:w-[60%] xl:w-[40%] md:mx-auto">
        <AddButton title={"Ticket"} link={"/role/superadmin/ticket/add-new"} />
        <div className="w-full p-4 rounded-xl bg-gray-200 my-5 flex items-center justify-start">
          <BsSearch />
          <input
            type="text"
            placeholder="Search ticket"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
          {searchData ? (
            searchData.length > 0 ? (
              searchData?.map((ticket) => {
                return (
                  <Link
                    to={`/role/superadmin/ticket/${ticket._id}`}
                    className="w-full"
                  >
                    <InfoButton
                      icon={<BsFillTicketPerforatedFill className="text-xl" />}
                      title={`${ticket.ticket_name}`}
                    />
                  </Link>
                );
              })
            ) : (
              <p className="text-xl font-medium text-gray-400 mt-24">
                No Ticket Found
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
  );
};

export default Ticket;
