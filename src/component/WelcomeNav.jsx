import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../assets/logo-main-white-transparent.png";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  logo: {
    marginRight: theme.spacing(2),
    width: "70px",
    height: "auto",
  },
  loginBtn: {
    marginLeft: "auto",
    marginRight: theme.spacing(2),
  },
  transparent: {
    backgroundColor: "#2c3e50",
  },
}));

export default function () {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleLogin = () => {
    navigate(`/login`);
  };

  const handleRegister = () => {
    navigate(`/register`);
  };

  return (
    <AppBar position="static" className={classes.transparent}>
      <Toolbar>
        <img src={logo} alt="Logo" className={classes.logo} />
        <Typography variant="h6">RedFrame Camera Rentals</Typography>
        <Button
          color="inherit"
          className={classes.loginBtn}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button color="inherit" onClick={handleRegister}>
          Signup
        </Button>
      </Toolbar>
    </AppBar>
  );
}
