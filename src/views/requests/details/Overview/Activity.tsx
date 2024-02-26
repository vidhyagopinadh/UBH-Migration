import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/react-hooks";
import { Avatar, Card, IconButton, Typography } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { CO_ROLE_MRA, CO_ROLE_PATIENT } from "../../../../utils/roles";
import {
  useNotify,
  usePermissions,
  useRefresh,
  useTranslate,
} from "react-admin";
import { Button } from "@mui/material";
import CopyToClipboardButton from "../../../../components/CopyToClipboardButton";
import { AccessTime, Schedule } from "@material-ui/icons";
import { BootstrapTooltip as Tooltip } from "../../../../components/Tooltip";
import type {
  GetNotificationDetailsInput,
  SendReminderEmailInput,
} from "../../../../__generated__/typescript-operations_all";
import sendReminderEmail from "../../../../queries/sendReminderEmail/sendReminderEmail";
import moment from "moment";
import getNotificationDetails from "../../../../queries/getNotificationDetails/getNotificationDetails";
import { REMINDER_MESSAGES } from "../../../../utils/messages/reminderConstants";

const PREFIX = "Activity";
const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  listItems: `${PREFIX}-content`,
  reminder: `${PREFIX}-  reminder`,
  date: `${PREFIX}-date`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.primary.light,
  },
  [`& .${classes.card}`]: {
    flexGrow: 1,
    display: "flex",
    border: 0,
    marginLeft: "10px",
    alignItems: "center",
  },
  [`& .${classes.listItems}`]: {
    "&.MuiListItem-gutters": {
      paddingLeft: 0,

      paddingRight: 0,
    },
  },
  [`& .${classes.reminder}`]: {
    color: "blue",
    padding: "0px",
    marginLeft: "5px",
  },
  [`& .${classes.date}`]: {
    marginLeft: "auto",
    flexShrink: 0,
  },
}));
function Activity({ activity, className, ...rest }): JSX.Element {
  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const refresh = useRefresh();
  const [to, setTo] = useState("");
  const { permissions } = usePermissions();
  const [highlight, setHighlight] = useState("#718cc7");
  const history = useHistory();
  const [subscribeGetNotificationDetailsMutation] = useMutation(
    getNotificationDetails,
    {}
  );
  const [resendTime, setResendTime] = React.useState(null);
  const [lastReminderSentAt, setLastReminderSendAt] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [subscribeSendReminderMutation] = useMutation(sendReminderEmail, {});
  const avatars = {
    upload_file: (
      <Avatar>
        <GetAppIcon />
      </Avatar>
    ),
    document: (
      <Avatar>
        <ListAltIcon />
      </Avatar>
    ),
    price_change: (
      <Avatar>
        <AttachMoneyIcon />
      </Avatar>
    ),
    contest_created: (
      <Avatar>
        <DashboardIcon />
      </Avatar>
    ),
  };
  useEffect(() => {
    if (permissions === CO_ROLE_MRA) {
      setHighlight("red");
    }
  }, [permissions]);
  useEffect(() => {
    const getNotificationDetailsInput: GetNotificationDetailsInput = {
      notificationCode:
        activity.subject_type === "hippaAuthDetails" ? "HIPAA" : "SUD",
      recordId: activity.requestToken.requestId,
    };
    if (activity.requestToken.resendDate) {
      subscribeGetNotificationDetailsMutation({
        variables: { input: getNotificationDetailsInput },
      }).then((response) => {
        const responseDetails = JSON.parse(
          response.data.getNotificationDetails.json
        );
        const notificationLimit = responseDetails.notification_limit;
        const attempt = responseDetails.no_reminder_sent;
        setLastReminderSendAt(
          moment(responseDetails.last_reminder_sent_at).calendar(null, {
            sameDay: "[today at] h:mm A",
            lastDay: "[yesterday at] h:mm A",
            lastWeek: " 'at' MMM DD, YYYY h:mm A",
            sameElse: " 'at' MMM DD, YYYY h:mm A",
          })
        );
        setResendTime(
          responseDetails.last_reminder_sent_at
            ? responseDetails.last_reminder_sent_at
            : null
        );
        const interval = responseDetails.notification_interval;
        const timeDiff = responseDetails.time_difference;
        if (timeDiff !== null) {
          const [days, hours, mins] = interval.split(":").map(parseFloat);
          const intervalTotalMilliseconds =
            ((days * 24 + hours) * 60 + mins) * 60 * 1000;

          const [dayss, hourss, minss] = timeDiff.split(":").map(parseFloat);
          const timeDiffTotalMilliseconds =
            ((dayss * 24 + hourss) * 60 + minss) * 60 * 1000;
          if (intervalTotalMilliseconds <= timeDiffTotalMilliseconds) {
            if (attempt >= notificationLimit) {
              setErrorMsg(
                translate("resources.request.notificationLimitExceeded")
              );
            }
          } else {
            const differenceMilliseconds = Math.abs(
              intervalTotalMilliseconds - timeDiffTotalMilliseconds
            );
            const differenceMinutes =
              Math.floor(differenceMilliseconds / (1000 * 60)) % 60;
            const differenceHours =
              Math.floor(differenceMilliseconds / (1000 * 60 * 60)) % 24;
            const differenceDays = Math.floor(
              differenceMilliseconds / (1000 * 60 * 60 * 24)
            );

            let formattedDifference = "";
            if (differenceDays > 0) {
              formattedDifference += `${differenceDays} day${
                differenceDays > 1 ? "s" : ""
              } `;
            }
            if (differenceHours > 0) {
              if (differenceHours > 1) {
                formattedDifference += `${differenceHours} hour${
                  differenceHours > 1 ? "s" : ""
                } `;
              } else {
                formattedDifference += `1 hour `;
              }
            }
            if (differenceMinutes > 0) {
              if (differenceMinutes > 1) {
                formattedDifference += `${differenceMinutes} minute${
                  differenceMinutes > 1 ? "s" : ""
                }`;
              } else {
                formattedDifference += `1 minute`;
              }
            }
            setErrorMsg(
              REMINDER_MESSAGES["reminder"].reminderExeedsLimit[0] +
                lastReminderSentAt +
                REMINDER_MESSAGES["reminder"].reminderExeedsLimit[1] +
                formattedDifference.trim() +
                REMINDER_MESSAGES["reminder"].reminderExeedsLimit[2] +
                REACT_APP_SUPPORT_MAIL_ADDRESS
            );
          }
        }
      });
    }
  }, [lastReminderSentAt]);
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (activity.requestType === "request") {
        if (activity.subject_type === "hippaAuthDetails") {
          if (activity.requestToken.token) {
            let toVal = "";
            toVal = `/authDetails/hipaa/${activity.requestToken.token}`;
            setTo(toVal);
          }
        } else {
          if (activity.requestToken.token) {
            let toVal = "";
            toVal = `/authDetails/sud/${activity.requestToken.token}`;
            setTo(toVal);
          }
        }
      }
    }
    return () => {
      mounted = false;
    };
  }, [activity]);

  const resendMail = (notificationCode): void => {
    const sendReminderEmailInput: SendReminderEmailInput = {
      transactionRecordId: activity.requestToken.requestId,
      notificationCode: notificationCode,
    };
    subscribeSendReminderMutation({
      variables: { input: sendReminderEmailInput },
    }).then((response) => {
      if (response.data.sendReminderEmail.reminderNotificationResult.success) {
        notify(
          notificationCode === "HIPAA"
            ? translate("resources.requests.hipaa_success")
            : translate("resources.requests.sud_success"),
          {
            type: "success",
          }
        );
        refresh();
      } else {
        notify(
          notificationCode === "HIPAA"
            ? translate("resources.requests.hipaa_error")
            : translate("resources.requests.sud_error"),
          {
            type: "warning",
          }
        );
      }
    });
  };
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {avatars[activity.action_type]}
      <Card className={classes.card}>
        <Typography variant="body1">
          {activity.requestToken.isFilled ? (
            <Typography
              color="textPrimary"
              component={RouterLink}
              to={to}
              variant="subtitle2"
            >
              {activity.subject}
            </Typography>
          ) : (
            <>
              <Typography color="textPrimary" variant="subtitle2">
                {activity.subject}

                {permissions !== CO_ROLE_PATIENT &&
                  activity.requestStatus !== "Resolved" &&
                  activity.requestStatus !== "Cancelled" && (
                    <Tooltip
                      arrow
                      placement="top"
                      title={
                        errorMsg
                          ? errorMsg
                          : activity.subject_type === "hippaAuthDetails"
                          ? translate("tooltip.formResend.hipaa")
                          : translate("tooltip.formResend.sud")
                      }
                    >
                      <IconButton
                        onClick={() => {
                          resendMail(
                            activity.subject_type === "hippaAuthDetails"
                              ? "HIPAA"
                              : "SUD"
                          );
                        }}
                        className={classes.reminder}
                        disabled={errorMsg ? true : false}
                        style={{ pointerEvents: "auto" }}
                      >
                        {" "}
                        <AccessTime />
                      </IconButton>
                    </Tooltip>
                  )}
              </Typography>
            </>
          )}{" "}
          {activity.requestType === "request" ? (
            activity.requestToken.isFilled ? (
              <>
                <span style={{ fontWeight: "bold", color: "#718cc7" }}>
                  Filled
                </span>{" "}
              </>
            ) : (
              <>
                {permissions === CO_ROLE_PATIENT ? (
                  activity.subject_type === "hippaAuthDetails" ? (
                    <Button
                      style={{
                        color: "#228B22",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                      onClick={() => {
                        history.push(
                          "/authorizationForm/hipaa/" +
                            activity.requestToken.token
                        );
                      }}
                    >
                      Fill Now
                    </Button>
                  ) : (
                    <Button
                      style={{
                        color: "#228B22",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                      onClick={() => {
                        history.push(
                          "/authorizationForm/sud/" +
                            activity.requestToken.token
                        );
                      }}
                    >
                      Fill Now
                    </Button>
                  )
                ) : activity.subject_type === "hippaAuthDetails" ? (
                  <>
                    <Button
                      style={{
                        fontWeight: "bold",
                        color: highlight,
                        textTransform: "none",
                      }}
                      disabled
                    >
                      Not Filled
                    </Button>
                    {permissions === CO_ROLE_MRA && (
                      <CopyToClipboardButton
                        urlLink={
                          VITE_BASE_URL +
                          "/authorizationForm/hipaa/" +
                          activity.requestToken.token
                        }
                      />
                    )}
                    {resendTime && (
                      <>
                        <span>
                          <Schedule
                            style={{
                              color: "#ff9800",
                              fontSize: "15px",
                              marginRight: "5px",
                            }}
                          />
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          Last Reminder Sent: {moment(resendTime).fromNow(true)}{" "}
                          ago{}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      style={{
                        fontWeight: "bold",
                        color: highlight,
                        textTransform: "none",
                      }}
                      disabled
                    >
                      Not Filled
                    </Button>
                    {activity.requestToken.resendDate && (
                      <>
                        <span>
                          <Schedule
                            style={{
                              color: "#ff9800",
                              fontSize: "15px",
                              marginRight: "5px",
                            }}
                          />
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          Last Reminder Sent:{" "}
                          {moment(activity.requestToken.resendDate).fromNow()}
                        </span>
                      </>
                    )}
                    {permissions === CO_ROLE_MRA && (
                      <CopyToClipboardButton
                        urlLink={
                          VITE_BASE_URL +
                          "/authorizationForm/sud/" +
                          activity.requestToken.token
                        }
                      />
                    )}
                  </>
                )}
              </>
            )
          ) : (
            ""
          )}
        </Typography>
        <br />
      </Card>
    </div>
  );
}

Activity.propTypes = {
  activity: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default Activity;
