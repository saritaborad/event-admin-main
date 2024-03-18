import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { makeApiCall } from "../../api/Post";
import ReactDataTable from "../../componets/DataTable";
import Loader from "../../componets/ui-elements/Loader";

const TransactionHistory = () => {
  const [transactions, setTransections] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await makeApiCall(
      "get",
      "user/transactionhistory",
      null,
      "raw"
    );
    console.log(response.status);
    if (response.status === 200) {
      const filterData = response.data.data.orders.map((item) => ({
        _id: item._id,
        order_id: item.order_id,
        complimantory_code: item.complimantory_code,
        provided_by: item.provided_by,
        total: item.total,
        payment_method: item.payment_method,
      }));
      setTransections(filterData);
      setLoading(false);
    }
    console.log(response);
  };

  const { data, isLoading, error } = useQuery("data", fetchData);

  useEffect(() => {
    if (data) {
      // setTransections(data.data.data.orders);
      console.log(data.data.data.orders);
    } else {
      console.warn("Something went wrong");
    }
  }, [data, isLoading]);

  const columns = [
    { data: "_id", title: "TRANSECTION ID" },
    { data: "order_id", title: "Order ID" },
    { data: "complimantory_code", title: "Complimantory Code" },
    { data: "provided_by", title: "Provided By" },
    { data: "total", title: "Total" },
    { data: "payment_method", title: "Payment Method" },
  ];

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="bg bg-white py-5 rounded-t-[30px] mt-4">
        {transactions?.length > 0 ? (
          <ReactDataTable data={transactions} columns={columns} />
        ) : null}
      </div>
    </>
  );
};
export default TransactionHistory;
