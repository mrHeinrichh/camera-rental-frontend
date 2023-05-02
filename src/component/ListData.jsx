import * as React from "react";
import { Card, CardContent, Typography, ListItemIcon } from "@mui/material";
import { generateKey } from "../services/generateKey";

export default function (props) {
  const { title, icon, data } = props;
  return (
    <div key={generateKey(5)}>
      <Card sx={{ display: "flex", justifyContent: "space-between" }}>
        <CardContent sx={{ flex: 1, alignItems: "end" }}>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="h2" component="div">
            {data}
          </Typography>
        </CardContent>
        <ListItemIcon sx={{ fontSize: "3rem" }}>{icon}</ListItemIcon>
      </Card>
    </div>
  );
}
