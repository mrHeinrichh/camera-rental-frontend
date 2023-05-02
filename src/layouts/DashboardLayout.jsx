import React from "react";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import Breadcrumb from "../component/Breadcrumb";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";

export default function () {
  const links = [];
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Box sx={{ display: "flex", position: "relative", zIndex: 1 }}>
        <Navbar open={isOpen} toggleDrawer={toggleDrawer} />
        <Sidebar open={isOpen} toggleDrawer={toggleDrawer} links={links} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "90vh",
            overflow: "auto",
            marginBottom: "2rem",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Breadcrumb />
            <Outlet />
          </Container>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
