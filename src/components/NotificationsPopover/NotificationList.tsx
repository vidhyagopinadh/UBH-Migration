import React from "react";
import { usePermissions } from "react-admin";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import gradients from "../../utils/gradients";
import CommentIcon from '@mui/icons-material/Comment';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { CO_ROLE_PATIENT } from "../../utils/roles";
import CreateIcon from "@mui/icons-material/Create";
import SendIcon from "@mui/icons-material/Send";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import { NOTIFICATION_TYPE } from "../../utils/constants";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
//import { useSelector } from "react-redux";
//import type { AppState } from "../../types";
import { styled } from '@mui/material/styles';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography, colors } from "@mui/material";



const PREFIX = 'NotifList';
const classes = {
  root: `${PREFIX}-root`,
  listItem: `${PREFIX}-listItem`,
  avatarBlue: `${PREFIX}-avatarBlue`,
  avatarGreen: `${PREFIX}-avatarGreen`,
  avatarOrange: `${PREFIX}-avatarOrange`,
  avatarIndigo: `${PREFIX}-avatarIndigo`,
  arrowForwardIcon: `${PREFIX}-arrowForwardIcon`,
}
const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
  },
  [`& .${classes.listItem}`]: {
    "&:hover": {
      backgroundColor: theme.palette.background.default,
    },
  },
  [`&.${classes.avatarBlue}`]: {
    backgroundImage: gradients.blue,
  },
  [`& .${classes.avatarGreen}`]: {
    backgroundImage: gradients.green,
  },
  [`&.${classes.avatarOrange}`]: {
    backgroundImage: gradients.orange,
  },
  [`& .${classes.avatarIndigo}`]: {
    backgroundImage: gradients.indigo,
  },
  [`&.${classes.arrowForwardIcon}`]: {
    color: colors.blueGrey[600],
  }
}))


function NotificationList({ notifications, ...rest }: any) {
  const { permissions } = usePermissions();
  // const userInfoReducer = useSelector(
  //   (state: AppState) => state.userInfoReducer,
  // );
  const avatars = {
    comment: (
      <Avatar className={classes.avatarBlue}>
        <CommentIcon />
      </Avatar>
    ),
    pending: (
      <Avatar className={classes.avatarOrange}>
        <PendingActionsIcon />
      </Avatar>
    ),
    expired: (
      <Avatar className={classes.avatarIndigo}>
        <HourglassBottomIcon />
      </Avatar>
    ),
    approve: (
      <Avatar className={classes.avatarGreen}>
        <AssignmentTurnedInIcon />
      </Avatar>
    ),
    note: (
      <Avatar className={classes.avatarOrange}>
        <SpeakerNotesIcon />
      </Avatar>
    ),
    change: (
      <Avatar className={classes.avatarGreen}>
        <AssignmentReturnIcon />
      </Avatar>
    ),
    feature: (
      <Avatar className={classes.avatarIndigo}>
        <CodeIcon />
      </Avatar>
    ),
    create: (
      <Avatar className={classes.avatarGreen}>
        <CreateIcon />
      </Avatar>
    ),
    send: (
      <Avatar className={classes.avatarOrange}>
        <SendIcon />
      </Avatar>
    ),
    submit: (
      <Avatar className={classes.avatarBlue}>
        <BeenhereIcon />
      </Avatar>
    ),
  };

  return (
    <List {...rest} className={clsx(classes.root)} disablePadding>
      {notifications.map((notification: any, i: number) => (
        <ListItem
          className={classes.listItem}
          component={RouterLink}
          divider={i < notifications.length - 1}
          key={notification.id}
          to={
            permissions === CO_ROLE_PATIENT
              ? notification.createdBy === userInfoReducer.id
                ? `/myRequests/${notification.trackId}/activity`
                : `/requestsOnBehalf/${notification.trackId}/activity`
              : `/requests/${notification.trackId}/activity`
          }
        >
          <ListItemAvatar>
            {notification.types === NOTIFICATION_TYPE["reply_notification_type"]
              ? avatars["comment"]
              : notification.types ===
                NOTIFICATION_TYPE["internal_note_notification_type"]
                ? avatars["note"]
                : notification.types ===
                  NOTIFICATION_TYPE["request_notification_type"][0]
                  ? avatars["create"]
                  : notification.types ===
                    NOTIFICATION_TYPE["request_notification_type"][1]
                    ? avatars["send"]
                    : notification.types ===
                      NOTIFICATION_TYPE["request_notification_type"][2]
                      ? avatars["submit"]
                      : notification.types ===
                        NOTIFICATION_TYPE["pending_institution_notification_type"]
                        ? avatars["pending"]
                        : notification.types ===
                          NOTIFICATION_TYPE["approved_institution_notification_type"]
                          ? avatars["approve"]
                          : notification.types === NOTIFICATION_TYPE["expired_request_type"]
                            ? avatars["expired"]
                            : avatars["change"]}
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                variant="subtitle2"
                style={{
                  fontSize: "13px",
                  lineHeight: "15px",
                  color: "blue",
                }}
              >
                {notification.types !==
                  NOTIFICATION_TYPE["pending_institution_notification_type"] &&
                  notification.types !==
                  NOTIFICATION_TYPE[
                  "approved_institution_notification_type"
                  ] &&
                  notification.types !==
                  NOTIFICATION_TYPE["expired_request_type"] && (
                    <span style={{ fontWeight: "bold", color: "#808080" }}>
                      {`${notification.name} `}
                    </span>
                  )}
                {notification.types ===
                  NOTIFICATION_TYPE["reply_notification_type"] && (
                    <>{` added a reply in `}</>
                  )}
                {notification.types ===
                  NOTIFICATION_TYPE["internal_note_notification_type"] && (
                    <>{` added an internal note in `}</>
                  )}
                {notification.types ===
                  NOTIFICATION_TYPE["status_change_notification_type"] && (
                    <>
                      {` changed status from`}
                      <span style={{ fontWeight: "bold", color: "#808080" }}>
                        {` ${notification.fromStatus}`}
                      </span>
                      {` to `}
                      <span style={{ fontWeight: "bold", color: "#808080" }}>
                        {` ${notification.toStatus}`}
                      </span>
                      {` in `}
                    </>
                  )}
                {notification.types ===
                  NOTIFICATION_TYPE["expired_request_type"] && (
                    <>
                      {" "}
                      <span>
                        {notification.type === "addendum"
                          ? "Addendum Request "
                          : notification.type === "medical"
                            ? "Medical Record Request "
                            : "Billing / Insurance Request "}
                      </span>
                      <span style={{ fontWeight: "bold", color: "#808080" }}>
                        has Expired
                      </span>
                    </>
                  )}
                {(NOTIFICATION_TYPE["request_notification_type"].includes(
                  notification.types,
                ) ||
                  notification.types ===
                  NOTIFICATION_TYPE[
                  "pending_institution_notification_type"
                  ] ||
                  notification.types ===
                  NOTIFICATION_TYPE[
                  "approved_institution_notification_type"
                  ]) && <>{notification.content}</>}
                {(notification.types ===
                  NOTIFICATION_TYPE["status_change_notification_type"] ||
                  notification.types ===
                  NOTIFICATION_TYPE["reply_notification_type"] ||
                  notification.types ===
                  NOTIFICATION_TYPE["internal_note_notification_type"]) && (
                    <span style={{ fontWeight: "bold", color: "#808080" }}>
                      {notification.type === "addendum"
                        ? "Addendum Request"
                        : notification.type === "medical"
                          ? "Medical Record Request"
                          : "Billing / Insurance Request"}
                    </span>
                  )}
                {notification.types !==
                  NOTIFICATION_TYPE["request_notification_type"][2] &&
                  notification.types !==
                  NOTIFICATION_TYPE["reply_notification_type"] &&
                  notification.types !==
                  NOTIFICATION_TYPE["internal_note_notification_type"] && (
                    <>
                      &nbsp;for patient :&nbsp;
                      <span style={{ fontWeight: "bold", color: "#808080" }}>
                        {notification.patientName}
                      </span>
                    </>
                  )}
              </Typography>
            }
            primaryTypographyProps={{ variant: "body1" }}
            secondary={
              <Typography
                variant="subtitle2"
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#718cc7",
                }}
              >
                {" "}
                {moment(notification.createdAt).fromNow()}
              </Typography>
            }
          />
          <ArrowForwardIcon className={classes.arrowForwardIcon} />
        </ListItem>
      ))}
    </List>
  );
}

NotificationList.propTypes = {
  notifications: PropTypes.array.isRequired,
};

export default NotificationList;
