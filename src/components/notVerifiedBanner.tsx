import React from "react";
import { makeStyles } from "@material-ui/styles";
import { IconButton, Typography } from "@material-ui/core";
import { Close, Error } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  root: {
    position: "relative",
    borderLeft: "5px solid  #FF5733 ",
    backgroundColor: "#FFFFE0",
    borderRadius: "8px",
    padding: "10px",
    color: "#585858",
  },
  close: {
    position: "absolute",
    top: "0px",
    right: "0px",
    color: "black",
    padding: "10px",
  },
  icon: {
    color: "#FF5733",
    marginRight: "10px",
  },
  text: {
    color: "#FF5733",
    fontSize: "14px",
  },
}));

function NotVerifiedBanner({ setShowBanner }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <IconButton
        onClick={() => {
          setShowBanner(false);
        }}
        className={classes.close}
      >
        <Close style={{ fontSize: "18px" }} />
      </IconButton>
      <div style={{ display: "flex" }}>
        <Error className={classes.icon} />
        <Typography variant="h6" className={classes.text}>
          Your email is not verified yet! Please verify your email to access the
          full features. <br></br>
          To verify your email, please follow these simple steps: <br></br>
          <ol>
            <li>Go to account settings My Profile.</li>
            <li>Click on the "Verify Email" link provided near your email.</li>
            <li>
              Follow the instructions to complete the verification process.
            </li>
          </ol>
        </Typography>
      </div>
    </div>
  );
}

export default NotVerifiedBanner;
