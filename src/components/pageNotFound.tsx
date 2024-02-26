import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import placeHolderImage from "../images/access-denied.png";
import { Button } from "@mui/material";
import { useHistory } from "react-router";

const useStyles = makeStyles(() => ({
  root: {
    textAlign: "center",
    padding: 20,
    alignItems: "center",
    marginTop: "10%",
  },
  image: {
    height: "140px",
    width: "150px",
  },
  centeredText: {
    display: "flex",
    justifyContent: "center",
  },
  narrowWidth: {
    width: "40%",
    fontSize: "20px",
    paddingTop: "20px",
  },
  newLine: {
    whiteSpace: "pre-line",
  },
}));

function PageNotFound({ ...rest }) {
  const classes = useStyles();
  const history = useHistory();
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
          history.push("/");
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
