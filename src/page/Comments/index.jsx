import React from "react";
import { DataTable } from "@/component";
import {
  useGetTransactionsQuery,
  useGetCommentsQuery,
} from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import { ERROR } from "../../constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function () {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const {
    data: transactionsData,
    isLoading: transactionIsLoading,
    isError: transactionIsError,
  } = useGetTransactionsQuery();

  const { data, isLoading, isError } = useGetCommentsQuery({
    populate: "transaction",
  });

  const filteredTransactions = transactionsData?.details?.filter(
    (detail) => detail?.user?._id === auth?.user?._id
  );

  const filteredComments = data?.details?.filter((comment) =>
    filteredTransactions?.some(
      (transaction) => transaction?._id === comment?.transaction?._id
    )
  );

  const headers = ["ID", "TransService", "Text", "Ratings", "Transaction"];
  const keys = [
    {
      key: "_id",
      operation: (value, row) => (
        <Link to={`/dashboard/comment/${row?._id}`} className="link">
          {row?._id}
        </Link>
      ),
    },
    {
      key: "transService",
    },
    {
      key: "text",
    },
    {
      key: "ratings",
      operation: (value, row) => `${value} stars`,
    },
    {
      key: "transaction",
      operation: (value) => (value ? value?.status : ""),
    },
  ];

  const handleEdit = (id) => {
    navigate(`edit/${id}`);
  };

  const actions = [
    {
      onClick: handleEdit,
      title: "Edit",
    },
  ];

  return (
    <>
      {isLoading || transactionIsLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_COMMENTS_ERROR}</div>
      ) : transactionIsError ? (
        <div className="errorMessage">{ERROR.GET_TRANSACTIONS_ERROR}</div>
      ) : (
        filteredComments && (
          <DataTable
            headers={headers}
            keys={keys}
            actions={actions}
            data={filteredComments}
          />
        )
      )}
    </>
  );
}
