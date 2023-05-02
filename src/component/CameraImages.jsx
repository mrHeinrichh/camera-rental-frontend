import React from "react";
import { Box, CardMedia } from "@mui/material";

export default function (props) {
  const { image } = props;
  const numImages = image.length;
  let height = "100px";
  let width = "100px";
  let margin = "0";
  let flexBasis = "100px";

  if (numImages > 1 && numImages <= 4) {
    margin = "5px";
    flexBasis = "calc(25% - 10px)";
  } else if (numImages > 4 && numImages <= 9) {
    margin = "5px";
    flexBasis = "calc(11.1% - 10px)";
  } else if (numImages > 9) {
    margin = "5px";
    flexBasis = "calc(8.33% - 10px)";
  }

  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          borderRadius: 2,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {image?.map((imageItem, index) => (
          <CardMedia
            key={index}
            component="img"
            sx={{
              height: height,
              width: width,
              borderRadius: 2,
              margin: margin,
              flexBasis: flexBasis,
            }}
            image={imageItem.url}
            alt={imageItem.alt}
          />
        ))}
      </Box>
    </>
  );
}
