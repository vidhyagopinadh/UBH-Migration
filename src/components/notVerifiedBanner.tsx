import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import { IconButton, Typography, styled } from "@mui/material";


const PREFIX = 'NotVerifiedBanner';
const classes = {
  root: `${PREFIX}-root`,
  close: `${PREFIX}-close`,
  icon: `${PREFIX}-icon`,
  text: `${PREFIX}-text`,
}

const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    position: "relative",
    borderLeft: "5px solid  #FF5733 ",
    backgroundColor: "#FFFFE0",
    borderRadius: "8px",
    padding: "10px",
    color: "#585858",
  },
  [`& .${classes.close}`]: {
    position: "absolute",
    top: "0px",
    right: "0px",
    color: "black",
    padding: "10px",
  },
  [`& .${classes.icon}`]: {
    color: "#FF5733",
    marginRight: "10px"
  },
  [`& .${classes.text}`]: {
    color: "#FF5733",
    fontSize: "14px",
  },

}))

function NotVerifiedBanner({ setShowBanner }: any) {
  return (
    <StyledDiv className={classes.root}>
      <IconButton
        onClick={() => {
          setShowBanner(false);
        }}
        className={classes.close}
      >
        <CloseIcon style={{ fontSize: "18px" }} />
      </IconButton>
      <div style={{ display: "flex" }}>
        <ErrorIcon className={classes.icon} />
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
    </StyledDiv>
  );
}

export default NotVerifiedBanner;
