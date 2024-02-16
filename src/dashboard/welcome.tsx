import * as React from "react";
import { FC } from "react";
import { Box, Card, CardActions, Button, Typography } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import { useTranslate, usePermissions } from "react-admin";
import { styled } from '@mui/material/styles';

import BaseModal from "../components/baseModal";

import publishArticleImage from "./welcome_illustration.svg";
import { catchActivity } from "./../lib/universal/utils/analytics";
//import { CO_ROLE_PPA, CO_ROLE_PATIENT } from "../lib/universal/utils/roles";
import { CustomizedTooltip } from "../components/customizedTooltip";
import { CO_ROLE_PATIENT, CO_ROLE_PPA } from "../utils/roles";

const PREFIX = 'WelcomeCard';
const classes = {
  root: `${PREFIX}-root`,
  media: `${PREFIX}-media`,
  actions: `${PREFIX}-actions`,
}
const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    background:
      theme.palette.mode === "dark"
        ? "#535353"
        : `linear-gradient(to right, #8975fb 0%, #746be7 35%), linear-gradient(to bottom, #8975fb 0%, #6f4ceb 50%), #6f4ceb`,

    color: "#fff",
    padding: 20,
    marginTop: theme.spacing(2),
    marginBottom: "1em",
  },
  [`& .${classes.media}`]: {
    background: `url(${publishArticleImage}) top right / cover`,
    marginLeft: "auto",
  },
  [`& .${classes.actions}`]: {
    display: "flex",
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "flex-start",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  },
}))

const Welcome: FC = () => {
  const translate = useTranslate();
  // const userInfoReducer = useSelector(
  //   (state: AppState) => state.userInfoReducer,
  // );
  //const classes = useStyles();
  const navigate = useNavigate();
  const { permissions } = usePermissions();
  const [openBase, setOpenBase] = React.useState(false);
  const [emailNotVerified, setEmailNotVerified] = React.useState(false);
  // React.useEffect(() => {
  //   if (!userInfoReducer.emailVerified) {
  //     setEmailNotVerified(true);
  //   }
  // }, []);
  const clickRequestCreate = () => {
    catchActivity({
      eventType: {
        activityName: "Dashboard -> requestCreate Button Click",
        activityUrl: window.location.href,
      },
      eventStatus: true,
    });
    //  navigate("/requestCreate");
  };

  return (
    <StyledDiv className={classes.root}>
      {openBase && (
        <BaseModal
          open={openBase}
          confirmAction={() => {
            window.location.href = "https://www.unblock.health/";
          }}
          onClose={() => {
            setOpenBase(false);
          }}
          title={translate("auth.leave_app_title")}
          content={translate("auth.leave_app_message")}
          successButtonName="Continue to External Site"
          closeButtonName="Cancel" />
      )}
      <Box display="flex">
        <Box flex="1">
          <Typography variant="h5" component="h2" gutterBottom>
            {translate("pos.dashboard.welcome.title")}
          </Typography>
          <Box maxWidth="60em">
            <Typography variant="body1" component="p" gutterBottom>
              {translate("pos.dashboard.welcome.subtitle")}
            </Typography>
          </Box>
          <CardActions className={classes.actions}>
            {(permissions === CO_ROLE_PPA || permissions === CO_ROLE_PATIENT) &&
              !emailNotVerified && (
                <Button
                  variant="contained"
                  onClick={() => clickRequestCreate()}
                  startIcon={<PlaylistAddIcon />}
                  id="create-request"
                  style={{ textTransform: "none" }}
                >
                  {translate("pos.dashboard.welcome.demo_button")}
                </Button>
              )}
            <Button
              variant="contained"
              onClick={() => {
                setOpenBase(true);
              }}
              startIcon={<HomeIcon />}
              id="ubh"
              style={{ textTransform: "none" }}
            >
              {translate("pos.dashboard.welcome.ra_button")}
            </Button>
          </CardActions>
        </Box>

        <Box
          display={{ xs: "none", sm: "none", md: "block" }}
          className={classes.media}
          width="16em"
          height="9em"
          overflow="hidden"
        />
      </Box>
    </StyledDiv>
  );
};
export default Welcome;
