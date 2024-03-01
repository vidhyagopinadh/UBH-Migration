import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Typography,
  ListItem,
  IconButton,
  Button,
  Popover,
  Accordion,
  AccordionSummary,
  Tabs,
  Tab,
  AccordionDetails,
} from "@material-ui/core";
import { BootstrapTooltip as Tooltip } from "../components/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNotify, useRefresh, useTranslate } from "react-admin";
import type { IProviderViewProps } from "../types";
import { AccessTimeFilled } from "@mui/icons-material";
import { AccessTime, CheckCircle } from "@material-ui/icons";
import { InstitutionDetails } from "../views/requests/details/Overview/institutionDetails";
import getNotificationDetails from "../queries/getNotificationDetails/getNotificationDetails";
import sendReminderEmail from "../queries/sendReminderEmail/sendReminderEmail";
import { useMutation } from "@apollo/react-hooks";
import { REMINDER_MESSAGES } from "../utils/messages/reminderConstants";
import type {
  GetNotificationDetailsInput,
  SendReminderEmailInput,
} from "../__generated__/typescript-operations_all";
import moment from "moment";
const useStyles = makeStyles(() => ({
  h6_title: {
    width: "55%",
    float: "left",
    fontWeight: 600,
  },
  reminder: {
    color: "blue",
    padding: "0px",
    marginLeft: "5px",
  },
  icon: {
    cursor: "auto",
    marginTop: "0px",
    width: "23px",
    height: "20px",
  },
  tab: {
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
  },
  listitemStyle: {
    display: "inline-block !important",
    borderBottom: "1px solid #eaeaea !important",
  },
  subtitle: {
    width: "40%",
    float: "left",
    marginLeft: "5%",
  },
}));
const { REACT_APP_SUPPORT_MAIL_ADDRESS } = process.env;

function ProviderView({
  commRequestId,
  approvedInstitution,
  sameInstitutionData,
  submittedInstitution,
}: IProviderViewProps) {
  const translate = useTranslate();
  const classes = useStyles();
  const notify = useNotify();
  const refresh = useRefresh();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const open = Boolean(anchorEl);
  const [currTab, setCurrTab] = React.useState("");
  const [subscribeGetNotificationDetailsMutation] = useMutation(
    getNotificationDetails,
    {},
  );
  const [lastReminderSentAt, setLastReminderSendAt] = React.useState(null);
  const [resendTime, setResendTime] = React.useState(null);
  const [subscribeSendReminderMutation] = useMutation(sendReminderEmail, {});
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const id = open ? "simple-popover" : undefined;
  useEffect(() => {
    if (commRequestId) {
      const getNotificationDetailsInput: GetNotificationDetailsInput = {
        notificationCode: "INSTITUTION_NOTIFICATION",
        recordId: commRequestId,
      };
      subscribeGetNotificationDetailsMutation({
        variables: { input: getNotificationDetailsInput },
      }).then((response) => {
        const responseDetails = JSON.parse(
          response.data.getNotificationDetails.json,
        );
        const notificationLimit = responseDetails.notification_limit;
        const attempt = responseDetails.no_reminder_sent;
        setLastReminderSendAt(
          moment(responseDetails.last_reminder_sent_at).calendar(null, {
            sameDay: "[today at] h:mm A",
            lastDay: "[yesterday at] h:mm A",
            lastWeek: " 'at' MMM DD, YYYY h:mm A",
            sameElse: " 'at' MMM DD, YYYY h:mm A",
          }),
        );
        setResendTime(
          responseDetails.last_reminder_sent_at
            ? responseDetails.last_reminder_sent_at
            : null,
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
                translate("resources.request.notificationLimitExceeded"),
              );
            }
          } else {
            const differenceMilliseconds = Math.abs(
              intervalTotalMilliseconds - timeDiffTotalMilliseconds,
            );
            const differenceMinutes =
              Math.floor(differenceMilliseconds / (1000 * 60)) % 60;
            const differenceHours =
              Math.floor(differenceMilliseconds / (1000 * 60 * 60)) % 24;
            const differenceDays = Math.floor(
              differenceMilliseconds / (1000 * 60 * 60 * 24),
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
                REACT_APP_SUPPORT_MAIL_ADDRESS,
            );
          }
        }
      });
    }
  }, [lastReminderSentAt]);
  useEffect(() => {
    if (approvedInstitution) {
      setCurrTab("verified");
    } else {
      setCurrTab("suggested");
    }
  }, [approvedInstitution]);
  const resendMail = (notificationCode): void => {
    const sendReminderEmailInput: SendReminderEmailInput = {
      transactionRecordId: commRequestId,
      notificationCode: notificationCode,
    };
    subscribeSendReminderMutation({
      variables: { input: sendReminderEmailInput },
    }).then((response) => {
      if (response.data.sendReminderEmail.reminderNotificationResult.success) {
        notify(translate("resources.requests.institution_success"), {
          type: "success",
        });
        refresh();
      } else {
        notify(translate("resources.requests.institution_error"), {
          type: "warning",
        });
      }
    });
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };
  const handleTabsChange = (
    event: React.ChangeEvent<{}>,
    value: string,
  ): void => {
    setCurrTab(value);
  };

  const handleAccordionChange = (event, expanded) => {
    setIsExpanded(expanded);
  };
  return (
    <ListItem className={classes.listitemStyle} disableGutters>
      <Typography variant="subtitle1" className={classes.h6_title}>
        Source Institution/Provider: &nbsp;
      </Typography>

      <Typography variant="subtitle2" className={classes.subtitle}>
        {submittedInstitution && (
          <>
            <IconButton disabled style={{ margin: "0px", padding: "0px" }}>
              {submittedInstitution && !approvedInstitution && (
                <AccessTimeFilled
                  className={classes.icon}
                  style={{
                    color: "orange",
                  }}
                />
              )}
              {approvedInstitution && (
                <CheckCircle
                  className={classes.icon}
                  style={{
                    color: "green",
                  }}
                />
              )}
            </IconButton>{" "}
            {submittedInstitution && !approvedInstitution && (
              <>Research and verification in progress</>
            )}
            {approvedInstitution && <>Institution Approved</>}
          </>
        )}
        <Button
          onClick={handleClick}
          variant="text"
          aria-describedby={id}
          style={{
            color: "blue",
            textTransform: "none",
            fontSize: "10px",
            fontWeight: 600,
            pointerEvents: "auto",
          }}
        >
          View More
        </Button>
        {commRequestId && approvedInstitution === null && (
          <>
            <Tooltip
              arrow
              placement="top"
              title={
                errorMsg
                  ? errorMsg
                  : translate("tooltip.formResend.institution")
              }
            >
              <IconButton
                onClick={() => {
                  resendMail("INSTITUTION_NOTIFICATION");
                }}
                className={classes.reminder}
                disabled={errorMsg ? true : false}
                style={{ pointerEvents: "auto" }}
              >
                {" "}
                <AccessTime />
              </IconButton>
            </Tooltip>
            {resendTime && (
              <>
                <br></br>
                Last Reminder Sent: {moment(resendTime).fromNow(true)} ago{}
              </>
            )}
          </>
        )}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{ style: { width: "400px" } }}
        >
          <>
            <Typography
              variant="subtitle2"
              style={{
                margin: "10px",
                alignContent: "justify",
                textAlign: "justify",
              }}
            >
              {approvedInstitution === null
                ? translate("tooltip.request.approval_progress")
                : sameInstitutionData
                ? translate("tooltip.request.approved_title_same")
                : translate("tooltip.request.approved_title_diff")}
            </Typography>
            <Accordion expanded={isExpanded} onChange={handleAccordionChange}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{ backgroundColor: "#f5f5f5" }}
              >
                <Typography variant="subtitle2" className={classes.subtitle}>
                  {isExpanded ? "View less" : "View more"}
                </Typography>
              </AccordionSummary>

              <Tabs
                onChange={handleTabsChange}
                scrollButtons="auto"
                style={{ marginTop: "0px" }}
                variant="scrollable"
                value={currTab}
              >
                {approvedInstitution && (
                  <Tab
                    key={"2"}
                    label={
                      <Typography className={classes.tab}>
                        Verified Provider Profile
                      </Typography>
                    }
                    value={"verified"}
                  />
                )}{" "}
                {!sameInstitutionData && (
                  <Tab
                    key={"1"}
                    label={
                      <Typography className={classes.tab}>
                        Suggested Provider Profile
                      </Typography>
                    }
                    value={"suggested"}
                  />
                )}
              </Tabs>
              {currTab === "suggested" && (
                <AccordionDetails>
                  <InstitutionDetails institutionData={submittedInstitution} />
                </AccordionDetails>
              )}
              {currTab === "verified" && (
                <AccordionDetails>
                  <InstitutionDetails institutionData={approvedInstitution} />
                </AccordionDetails>
              )}
            </Accordion>
          </>
        </Popover>
      </Typography>
    </ListItem>
  );
}

export default ProviderView;
