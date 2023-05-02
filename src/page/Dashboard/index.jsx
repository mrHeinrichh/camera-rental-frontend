import React from "react";
import { Box } from "@mui/material";
import GetAllUser from "./getAllUser";
import GetAllAdmin from "./GetAllAdmin";
import GetAllEmployee from "./GetAllEmployee";
import GetAllCustomer from "./GetAllCustomer";
import ShowActiveUser from "./ShowActiveUser";
import AllUserCamera from "./AllUserCamera";
import MonthlySales from "./MonthlySales";
import TotalProfitPerYear from "./TotalProfitPerYear";
import { useSelector } from "react-redux";
import CreateTransaction from "../Transactions/createTransaction";

export default function () {
  const auth = useSelector((state) => state.auth);

  return (
    <>
      {(auth?.user?.roles?.includes("Admin") ||
        auth?.user?.roles?.includes("Employee")) && (
        <>
          <Box sx={{ mb: "1rem", mt: ".5rem" }}>
            <GetAllUser />
          </Box>
          <Box sx={{ mb: "1rem", mt: ".5rem" }}>
            <GetAllAdmin />
          </Box>
          <Box sx={{ mb: "1rem", mt: ".5rem" }}>
            <GetAllEmployee />
          </Box>
          <Box sx={{ mb: "1rem", mt: ".5rem" }}>
            <GetAllCustomer />
          </Box>
          <Box sx={{ mb: "1rem", mt: ".5rem" }}>
            <ShowActiveUser />
          </Box>
          <Box sx={{ mb: "1rem", mt: ".5rem" }}>
            <AllUserCamera />
          </Box>
          <Box sx={{ mb: "1rem", mt: ".5rem" }}>
            <MonthlySales />
          </Box>
          <Box sx={{ mb: "1rem", mt: ".5rem" }}>
            <TotalProfitPerYear />
          </Box>
        </>
      )}
      {auth?.user?.roles?.includes("Customer") && (
        <>
          <CreateTransaction />
        </>
      )}
    </>
  );
}
