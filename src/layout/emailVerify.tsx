import * as React from "react";
import { useHistory } from "react-router";
import type { ISignupProps } from "../types";
import { TaskAlt as SuccessIcon } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Box,
  CardMedia,
  Grid,
  makeStyles,
  CircularProgress,
  Modal,
} from "@material-ui/core";
import { Button, styled } from "@mui/material";
import logo from "../images/logo.png";
import { VerifyUserEmailQuery } from "../service/inviteQueries";
import { useTranslate } from "react-admin";
import Typography from "@mui/material/Typography";
import signUpImage from "../images/signUp.jpg";
import { SIGNUP_CONSTANTS } from "../utils/messages/signupConstants";
import { EMAIL_VERIFY_MESSAGES } from "../utils/messages/emailVerifyMessages";
import {
  CancelRounded,
  ErrorRounded,
  WarningRounded,
} from "@material-ui/icons";

const PREFIX = "EmailVerify";
const classes = {
  root: `${PREFIX}-root`,
  background: `${PREFIX}-background`,
  heading: `${PREFIX}-heading`,
  button: `${PREFIX}-button`,
  subheading: `${PREFIX}-subheading`,
  media: `${PREFIX}-media`,
  container: `${PREFIX}-container`,
  rightGridItems: `${PREFIX}-rightGridItems`,
  rightGridItemsImage: `${PREFIX}-rightGridItemsImage`,
  gridItemsText: `${PREFIX}-gridItemsText`,
  gridItem: `${PREFIX}-gridItem`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    "& .MuiTypography-root": {
      fontFamily: "'Poppins', sans-serif!important",
    },
  },
  [`& .${classes.background}`]: {
    backgroundColor: "dark grey",
  },
  [`& .${classes.heading}`]: {
    color: "#09143C",
    fontStyle: "bold",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif!important",
  },
  [`& .${classes.button}`]: {
    paddingBottom: "10%",
  },
  [`& .${classes.subheading}`]: {
    fontFamily: "'Poppins', sans-serif!important",
    "& .MuiInputLabel-root": {
      fontFamily: "Poppins, sans-serif",
    },
    "& .MuiTypography-root": {
      fontFamily: "'Poppins', sans-serif!important",
    },
    "& .MuiOutlinedInput-root": {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: "normal",
    },
  },
  [`& .${classes.media}`]: {
    height: "870px",
    width: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "absolute",
  },
  [`& .${classes.container}`]: {
    backgroundColor: "white",
    borderRadius: theme.spacing(2),
    position: "absolute",
    top: "55px",
    marginLeft: "34%",
    display: "flex",
    alignSelf: "center",
    width: "31%",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },
  [`& .${classes.rightGridItems}`]: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: "5%",
    fontFamily: "'Poppins', sans-serif!important",
  },
  [`& .${classes.rightGridItemsImage}`]: {
    width: "85px",
    height: "75px",
  },
  [`& .${classes.gridItemsText}`]: {
    padding: "5%",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif!important",
  },
  [`& .${classes.gridItem}`]: {
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontFamily: "'Poppins', sans-serif!important",
  },
}));
const style = {
  position: "absolute" as const,
  top: "35%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  borderRadius: "10px",
  bgcolor: "background.paper",
  outline: "none",
  overflowY: "auto",
  p: 4,
  textAlign: "center",
  zIndex: 99999,
};
export default function EmailVerify({
  enrollToken,
}: ISignupProps): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const translate = useTranslate();
  const [responseType, setResponseType] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [verifyEmail, setVerifyEmail] = React.useState(false);
  React.useEffect(() => {
    setIsLoading(true);
    VerifyUserEmailQuery(enrollToken + "").then((response) => {
      if (response) {
        setVerifyEmail(true);
        setIsLoading(false);
        if (JSON.parse(response.status).code === 200) {
          if (JSON.parse(response.result).linkStatus === "Active") {
            setResponseType("success");
          } else if (JSON.parse(response.result).linkStatus === "Used") {
            setResponseType("used");
          } else if (JSON.parse(response.result).linkStatus === "Expired") {
            setResponseType("expired");
          }
        } else if (JSON.parse(response.status).code === 404) {
          setResponseType("invalid_token");
        } else if (JSON.parse(response.status).code === 400) {
          setResponseType("error");
        }
      }
    });
  }, []);
  return (
    <>
      <style>
        {`
      .RaLayout-content-4 {
        padding:0;
      }
    `}
      </style>
      <Box sx={{ flexGrow: 1, padding: 0, margin: 0, border: 0 }}>
        <AppBar
          elevation={0}
          position="fixed"
          style={{ backgroundColor: "#09143C", zIndex: 999999 }}
        >
          <Toolbar variant="dense">
            <img src={logo} />
          </Toolbar>
        </AppBar>
      </Box>
      <Grid xs={12}>
        <div
          className={classes.background}
          style={{
            backgroundColor: "dark grey",
            filter: "blur(2px)",
            width: "100%",
            height: "100%",
            zIndex: 999,
          }}
        >
          <CardMedia image={signUpImage} title="" className={classes.media}>
            <Typography
              component="h1"
              variant="h3"
              className={classes.heading}
              style={{
                fontWeight: "bold",
                fontSize: "240%",
                fontFamily: "Poppins, sans-serif!important ",
              }}
            >
              {translate("resources.register.ubhTitle")}
            </Typography>
            <div className={classes.container}>
              <Grid container spacing={0} justify="center" alignItems="center">
                {SIGNUP_CONSTANTS.map((eachValue, key) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    key={key}
                    className={classes.rightGridItems}
                  >
                    <CardMedia
                      image={eachValue.icon}
                      title=""
                      className={classes.rightGridItemsImage}
                    />
                    <Typography
                      component="h1"
                      variant="h5"
                      className={classes.gridItemsText}
                      style={{ fontSize: "1.3rem" }}
                    >
                      {eachValue.text}
                    </Typography>
                  </Grid>
                ))}
                <div className={classes.button}>
                  <Button
                    className={classes.subheading}
                    size="large"
                    style={{
                      textTransform: "none",
                      // borderRadius: theme.spacing(1),
                      width: "100%",
                    }}
                    variant="outlined"
                    target="_blank"
                    href="https://www.unblock.health//"
                  >
                    Learn more
                  </Button>
                </div>
              </Grid>
            </div>
          </CardMedia>
        </div>
        <Modal open={true}>
          <Box sx={style}>
            {isLoading && (
              <>
                <CircularProgress
                  style={{ color: "#2AAA8A", width: "50px", height: "50px" }}
                />
                <Typography
                  variant="h5"
                  component="h2"
                  style={{
                    color: "#2AAA8A",
                    fontWeight: "700",
                    marginTop: "30px",
                  }}
                >
                  {translate("resources.emailVerify.loading")}
                </Typography>
              </>
            )}
            {verifyEmail && !isLoading && (
              <>
                {responseType && (
                  <>
                    {responseType === "success" && (
                      <SuccessIcon
                        style={{
                          width: "50px",
                          height: "50px",
                          color: "#2AAA8A",
                        }}
                      />
                    )}
                    {responseType === "used" && (
                      <WarningRounded
                        style={{
                          width: "50px",
                          height: "50px",
                          color: "orange",
                        }}
                      />
                    )}
                    {responseType === "expired" && (
                      <ErrorRounded
                        style={{ width: "50px", height: "50px", color: "red" }}
                      />
                    )}
                    {["error", "invalid_token"].includes(responseType) && (
                      <CancelRounded
                        style={{ width: "50px", height: "50px", color: "red" }}
                      />
                    )}
                  </>
                )}
                <Typography
                  variant="h5"
                  component="h2"
                  style={{
                    color:
                      responseType === "success"
                        ? "#2AAA8A"
                        : responseType === "used"
                        ? "orange"
                        : ["expired", "error", "invalid_token"].includes(
                            responseType
                          )
                        ? "red"
                        : "",
                    fontWeight: "700",
                  }}
                >
                  {responseType ? EMAIL_VERIFY_MESSAGES[responseType][0] : ""}{" "}
                </Typography>
                <Typography sx={{ mt: 2 }} variant="h5">
                  {responseType ? EMAIL_VERIFY_MESSAGES[responseType][1] : ""}
                </Typography>
                {!["error", "invalid_token"].includes(responseType) && (
                  <Button
                    type="submit"
                    onClick={() => {
                      history.push("/login");
                    }}
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    style={{
                      backgroundColor:
                        responseType === "success"
                          ? "#2AAA8A"
                          : responseType === "used"
                          ? "orange"
                          : responseType === "expired"
                          ? "red"
                          : "",
                      fontSize: "16px",
                      color: "#ffffff",
                      textTransform: "none",
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </>
            )}
          </Box>
        </Modal>
      </Grid>
    </>
  );
}
