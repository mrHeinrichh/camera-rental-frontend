import React from "react";
import { useParams } from "react-router-dom";
import { useGetNoteByIdQuery } from "@/state/api/reducer";
import { Card, CardContent, Typography } from "@mui/material";
import { ERROR } from "../../constants";
import { PacmanLoader } from "react-spinners";

export default function () {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetNoteByIdQuery(id, {
    populate: "user",
  });

  const { title, text, completed, user } = data?.details ?? {};

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_NOTES_ERROR}</div>
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
              Note Details
            </Typography>
            <Typography variant="body2">
              <strong>Title:</strong> {title}
            </Typography>
            <Typography variant="body2">
              <strong>Text:</strong> {text}
            </Typography>
            <Typography variant="body2">
              <strong>Completed:</strong> {completed ? "Yes" : "No"}
            </Typography>
            <Typography variant="body2">
              <strong>Employee:</strong> {user.name}
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
}
