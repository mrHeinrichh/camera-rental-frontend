import React from "react";
import { useParams } from "react-router-dom";
import { useGetCommentByIdQuery } from "@/state/api/reducer";
import { Card, CardContent, Typography } from "@mui/material";
import { ERROR } from "../../constants";
import { PacmanLoader } from "react-spinners";

export default function () {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetCommentByIdQuery(id, {
    populate: "transaction",
  });

  const { transService, ratings, text, transaction } = data?.details ?? {};

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_COMMENTS_ERROR}</div>
      ) : (
        <Card
          sx={{
            margin: "auto",
            width: "50%",
            textAlign: "center",
            backgroundColor: "#2c3e50",
            color: "#f1f2f6",
            borderRadius: ".75rem",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Comment Details
            </Typography>
            <Typography variant="body2">
              <strong>TransService:</strong> {transService}
            </Typography>
            <Typography variant="body2">
              <strong>Ratings:</strong> {ratings}
            </Typography>
            <Typography variant="body2">
              <strong>Text:</strong> {text}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {transaction.status}
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
}
