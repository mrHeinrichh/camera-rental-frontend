import React from "react";
import { DataTable } from "@/component";
import { useGetTransactionsQuery } from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { ERROR } from "../../constants";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment-timezone";

export default function () {
  const auth = useSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetTransactionsQuery({
    populate: ["user", "cameras"],
  });

  const filteredTransactions = data?.details?.filter(
    (detail) => detail?.user?._id === auth?.user?._id
  );

  const headers = ["ID", "Customer", "Cameras", "Status", "Date"];

  const keys = [
    {
      key: "_id",
      operation: (value, row) => (
        <Link to={`/dashboard/transaction/${row?._id}`} className="link">
          {row?._id}
        </Link>
      ),
    },
    {
      key: "user",
      operation: (value) => (value ? value?.name : ""),
    },
    {
      key: "cameras",
      operation: (value) => value?.map((camera) => camera?.name).join(", "),
    },
    {
      key: "status",
    },
    {
      key: "date",
      operation: (value) =>
        moment(value).tz("Asia/Manila").format("YYYY-MM-DD"),
    },
  ];

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_TRANSACTIONS_ERROR}</div>
      ) : (
        filteredTransactions && (
          <DataTable
            headers={headers}
            keys={keys}
            data={filteredTransactions}
          />
        )
      )}
    </>
  );
}
