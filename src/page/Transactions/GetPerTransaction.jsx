import React from "react";
import { useParams } from "react-router-dom";
import { useGetTransactionByIdQuery } from "@/state/api/reducer";
import { Card, CardContent, Typography } from "@mui/material";
import { ERROR } from "../../constants";
import { PacmanLoader } from "react-spinners";
import moment from "moment-timezone";

export default function CommentDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetTransactionByIdQuery(id, {
    populate: ["user", "cameras"],
  });

  const { user, cameras, status, date } = data?.details ?? {};

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_TRANSACTIONS_ERROR}</div>
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
              <strong>User:</strong> {user?.name ?? ""}
            </Typography>
            <Typography variant="body2">
              <strong>Cameras:</strong>{" "}
              {cameras?.map((camera) => camera?.name).join(", ")}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {status ?? ""}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong>{" "}
              {moment(date).tz("Asia/Manila").format("YYYY-MM-DD")}
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
}
