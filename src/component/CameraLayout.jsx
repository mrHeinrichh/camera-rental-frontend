import React from "react";
import { Box, Paper } from "@mui/material";
import CameraImages from "./CameraImages";
import CameraDetails from "./CameraDetails";

export default function (props) {
  const { data, onAddToCart, cartItems } = props;

  return (
    <>
      {data?.map((detail) => {
        const isInCart = cartItems.some(
          (cartItem) => cartItem._id === detail._id
        );

        return (
          <Paper key={detail?._id} sx={{ mb: 6 }}>
            <Box
              sx={{
                p: 5,
                display: "flex",
                justifyContent: "space-evenly",
                gap: 5,
              }}
            >
              <CameraImages image={detail?.image} />
              <CameraDetails
                item={detail}
                onAddToCart={() => onAddToCart(detail)}
                isInCart={isInCart}
              />
            </Box>
          </Paper>
        );
      })}
    </>
  );
}
