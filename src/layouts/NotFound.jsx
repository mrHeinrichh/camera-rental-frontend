import React from "react";
import Broken from "../assets/broken-camera.jpg";
import { Button } from "@/component";
import { Typography } from "@material-ui/core";

export default function () {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img src={Broken} alt="Broken Image" style={{ width: "500px" }} />
          <Typography variant="h2">Not Found</Typography>
          <Typography variant="h5">
            The requested page could not be found.
          </Typography>
          <br />
          <Button title="Go Back" onClick={goBack} />
        </div>
      </div>
    </div>
  );
}
