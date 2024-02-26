import React from "react";
import clsx from "clsx";

import { Typography } from "@material-ui/core";
import placeHolderImage from "../images/access-denied.png";
import { Button } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const PREFIX = "MyCard";
const classes = {
  root: `${PREFIX}-root`,
  image: `${PREFIX}-image`,
  centeredText: `${PREFIX}-centeredText`,
  narrowWidth: `${PREFIX}-narrowWidth`,
  newLine: `${PREFIX}-newLine`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    textAlign: "center",
    padding: 20,
    alignItems: "center",
    marginTop: "10%",
  },
  [`& .${classes.image}`]: {
    height: "140px",
    width: "150px",
  },
  [`& .${classes.centeredText}`]: {
    display: "flex",
    justifyContent: "center",
  },
  [`& .${classes.narrowWidth}`]: {
    width: "40%",
    fontSize: "20px",
    paddingTop: "20px",
  },
  [`& .${classes.newLine}`]: {
    whiteSpace: "pre-line",
  },
}));

function PageNotFound({ ...rest }) {
  const navigate = useNavigate();
  return (
    <div {...rest} className={clsx(classes.root)}>
      <img src={placeHolderImage} className={classes.image} />
      <Typography
        variant="h2"
        style={{ fontWeight: "600", paddingTop: "20px" }}
      >
        Access Denied
      </Typography>{" "}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" align="center" className={classes.narrowWidth}>
          You dont't have permissions to access this page. Contact an
          administrator to get permissions or go to the home page and browse
          other pages.
        </Typography>
      </div>
      <Button
        type="submit"
        onClick={() => {
          navigate("/");
        }}
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        style={{
          backgroundColor: "#2AAA8A",
          fontSize: "16px",
          color: "#ffffff",
          textTransform: "none",
        }}
      >
        Go to home
      </Button>
    </div>
  );
}

export default PageNotFound;
