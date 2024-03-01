import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
// import {
//   Typography,
//   useTheme,
//   useMediaQuery,
//   Container,
// } from "@material-ui/core";
import displayImage from "../images/undraw_resume_folder_2_arse.svg";
import emptyDisplayImage from "../images/undraw_empty_xct9.svg";
import { useTranslate } from "react-admin";
// import type { IAckProps } from "../types";
import { Container, Typography } from "@mui/material";

// const useStyles = makeStyles(() => ({
//   root: {
//     padding: "5px",
//     paddingTop: "10vh",
//     display: "flex",
//     flexDirection: "column",
//     alignContent: "center",
//     maxWidth: "900px",
//   },
//   title: {
//     fontSize: "38px",
//     marginBottom: "15px",
//   },
//   imageContainer: {
//     marginTop: "10px",
//     display: "flex",
//     justifyContent: "center",
//   },
//   image: {
//     maxWidth: " 474px%",
//     width: 500,
//     maxHeight: 400,
//     height: "396px",
//     marginTop: 50,
//   },
//   buttonContainer: {
//     display: "flex",
//     justifyContent: "center",
//   },
// }));
const PREFIX = "Acknowledge";
const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  imageContainer: `${PREFIX}-imageContainer`,
  image: `${PREFIX}-image`,
  buttonContainer: `${PREFIX}-buttonContainer`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: "5px",
    paddingTop: "10vh",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    maxWidth: "900px",
  },
  [`& .${classes.title}`]: {
    fontSize: "38px",
    marginBottom: "15px",
  },
  [`& .${classes.imageContainer}`]: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
  },
  [`& .${classes.image}`]: {
    maxWidth: " 474px%",
    width: 500,
    maxHeight: 400,
    height: "396px",
    marginTop: 50,
  },
  [`& .${classes.buttonContainer}`]: {
    display: "flex",
    justifyContent: "center",
  },
}));
function Acknowledge({ type }: IAckProps): JSX.Element {
  const translate = useTranslate();

  const theme = useTheme();
  const ackContent = {
    successfully_filled: {
      title: translate(`auth.titles.successfully_filled`),
      description: translate(`auth.messages.successfully_filled`),
      image: displayImage,
    },
    ack_filled: {
      title: translate(`auth.titles.ack_filled`),
      description: translate(`auth.messages.ack_filled`),
      image: displayImage,
    },
    invalid_token: {
      title: translate(`auth.titles.invalid_token`),
      description: translate(`auth.messages.invalid_token`),
      image: emptyDisplayImage,
    },
    empty_request_token: {
      title: translate(`auth.titles.invalid_token`),
      description: translate(`auth.messages.empty_request_token`),
      image: emptyDisplayImage,
    },
    request_signed: {
      title: translate(`auth.titles.request_signed`),
      description: translate(`auth.messages.request_signed`),
      image: displayImage,
    },
    successfully_signed: {
      title: translate(`auth.titles.successfully_signed`),
      description: translate(`auth.messages.successfully_signed`),
      image: displayImage,
    },
    thanks_message: {
      title: translate(`auth.titles.thanks_message`),
      description: translate(`auth.messages.thanks_message`),
      image: displayImage,
    },
    error_message: {
      title: translate(`auth.titles.invalid_token`),
      description: translate(`auth.messages.error_message`),
      image: emptyDisplayImage,
    },
  };
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    //
  }, [type]);
  return (
    <Container
      className={classes.root}
      title="Thanks!"
      data-testid="acknowledge"
    >
      <Typography
        align="center"
        variant={mobileDevice ? "h4" : "h3"}
        className={classes.title}
        data-testid="acknowledge-title"
      >
        {ackContent[type].title}
      </Typography>
      <Typography
        align="center"
        variant="h5"
        data-testid="acknowledge-description"
      >
        {ackContent[type].description}
      </Typography>
      {type === "thanks_message" ? (
        <a
          href="https://www.unblock.health/"
          style={{
            textDecoration: "none",
            color: "blue",
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          https://www.unblock.health/
        </a>
      ) : (
        ""
      )}
      <div className={classes.imageContainer}>
        <img
          alt="Under development"
          className={classes.image}
          src={ackContent[type].image}
          data-testid="acknowledge-img"
        />
      </div>
    </Container>
  );
}

export default Acknowledge;
