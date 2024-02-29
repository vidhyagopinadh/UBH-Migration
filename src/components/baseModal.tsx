import React from "react";
import clsx from "clsx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from '@mui/icons-material/Schedule';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { INVITE_ALREADY_EXISTS_SUBTITLE, } from "../lib/universal/utils/constants";
import { REMINDER_MESSAGES } from "../lib/universal/utils/messages/reminderConstants";
const { REACT_APP_SUPPORT_MAIL_ADDRESS } = import.meta.env;
import { styled } from '@mui/material/styles';
import { Button, Card, CardActions, CardContent, Modal, Typography } from "@mui/material";
import { BaseModalProps } from "../types/comptypes";
const PREFIX = 'BaseModal';
const classes = {
  root: `${PREFIX}-root`,
  container: `${PREFIX}-container`,
  actions: `${PREFIX}-actions`,
  content: `${PREFIX}-content`,
  closeButton: `${PREFIX}-closeButton`,
  successButton: `${PREFIX}-successButton`
}

const BaseModal: React.FC<BaseModalProps> = (props): JSX.Element => {

  const StyledDiv = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      outline: "none",
      backgroundColor:
        type === "logout" ||
          type === "emailNotVerified" ||
          type === "regenerateSuccess" ||
          type === "patientEmailNotVerified" ||
          type === "regenerateError"
          ? "#ffffff"
          : theme.palette.primary.light,
      boxShadow: theme.shadows[20],
      width:
        type === "logout" ? 600 : type === "patientAlreadyExist" ? null : 550,
      maxHeight: "100%",
      overflowY: "auto",
      maxWidth: "100%",
    },
    [`& .${classes.container}`]: {
      marginTop: theme.spacing(3),
      height: 200,
    },
    [`& .${classes.actions}`]: {
      justifyContent: "flex-end",
    },
    [`& .${classes.content}`]: {
      marginLeft: "30px",
    },
    [`& .${classes.closeButton}`]: {
      borderRadius: "30px",
      color: "white",
      backgroundColor: type === "emailNotVerified" ? "#93C572" : "grey",
      textTransform: "none",
      marginBottom: "3%",
      marginRight:
        type === "reminderError"
          ? "10%"
          : type === "reminderWarning"
            ? "10%"
            : type === "feedbackFinalFileUploadError"
              ? "10%"
              : type === "reminderIntervalError"
                ? "10%"
                : type === "feedbackError"
                  ? "10%"
                  : type === "editPatientSuccess"
                    ? "10%"
                    : type === "feedbackFileUploadError"
                      ? "2%"
                      : "",
    },
    [`& .${classes.successButton}`]: {
      borderRadius: "30px",
      backgroundColor: type === "delete" ? "red" : "",
      textTransform: "none",
      marginBottom: "3%",
      marginRight: "10%",
    }
  }))

  //const classes = useStyles();
  const INFO_MODALS = [
    "info",
    "logout",
    "success_info",
    "alreadyExistInvite",
    "regenerateSuccess",
    "regenerateError",
  ];
  const ERROR_MODALS = [
    "emailNotVerified",
    "info",
    "requestError",
    "alreadyExists",
    "reminderError",
    "reminderIntervalError",
    "successProvider",
    "regenerateError",
    "feedbackError",
    "feedbackFileUploadError",
    "feedbackFinalFileUploadError",
  ];
  const CLOSE_ICON_MODAL = [
    "error",
    "requestError",
    "alreadyExistInvite",
    "alreadyExists",
    "alreadyExistsIntegration",
    "delete",
    "regenerateError",
    "idVerificationError",
  ];
  const TICK_ICON_MODAL = [
    "regenerateSuccess",
    "success",
    "info",
    "success_info",
    "successProvider",
    "feedbackSuccess",
    "addNewPatientSuccess",
    "editPatientSuccess",
    "successInstitution",
  ];
  const WARNING_MODALS = [
    "warning",
    "authConfirm",
    "logout",
    "reminderError",
    "reminderIntervalError",
    "reminderWarning",
    "emailNotVerified",
    "feedbackError",
    "feedbackFileUploadError",
    "feedbackFinalFileUploadError",
    "patientEmailNotVerified",
    "patientAlreadyExist",
  ];
  const ONE_BUTTON_TYPE = [
    "reminderError",
    "reminderIntervalError",
    "reminderWarning",
    "feedbackError",
    "feedbackSuccess",
    "feedbackFinalFileUploadError",
    "editPatientSuccess",
    "successInstitution",
    "requestError",

    "alreadyExistsIntegration",
    "idVerificationError",
  ];
  // if (!props.open) {
  //   return null;
  // }
  const confirm = (): void => {
    props.confirmAction(true);
  };
  let type = props.type || "warning";
  let feedbackFailedUploads = props.feedbackFailedUploads || [];
  let subContent = props.subContent || []

  return (
    <Modal
      open={props.open}
      data-testid="base-modal"
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          props.onClose(event, reason);
        }
      }}
    >
      <StyledDiv>
        <Card className={clsx(classes.root)}>
          <div
            style={{
              fontWeight: "600",
              display: "flex",
              margin: "20px",
              marginBottom: "0px",
            }}
          >
            {WARNING_MODALS.includes(type) && (
              <WarningRoundedIcon
                style={{
                  color: type === "authConfirm" ? "red" : "Orange",
                }}
                fontSize={"large"}
              />
            )}
            {TICK_ICON_MODAL.includes(type) && (
              <CheckCircleIcon
                style={{
                  color: "green",
                }}
                fontSize={"large"}
              />
            )}
            {CLOSE_ICON_MODAL.includes(type) && (
              <CancelIcon
                style={{
                  color: "red",
                }}
                fontSize={"large"}
              />
            )}
            <Typography variant="h6" style={{ paddingLeft: "10px" }}>
              {" "}
              {props.title}
            </Typography>
          </div>

          <CardContent
            style={{ textAlign: props.content?.length > 30 ? "justify" : "left" }}
          >
            {type === "reminderIntervalError" ? (
              <Typography variant="body1" className={classes.content}>
                {REMINDER_MESSAGES["reminder"].reminderExeedsLimit[0] +
                  props.lastReminderSendAt +
                  REMINDER_MESSAGES["reminder"].reminderExeedsLimit[1] +
                  props.timeRemaining +
                  REMINDER_MESSAGES["reminder"].reminderExeedsLimit[2]}
                {ERROR_MODALS.includes(type) && (
                  <a href="mailto:support@unbockhealth.com">
                    {REACT_APP_SUPPORT_MAIL_ADDRESS}{" "}
                  </a>
                )}
              </Typography>
            ) : type === "feedbackFileUploadError" ||
              type === "feedbackFinalFileUploadError" ? (
              <>
                <Typography variant="body1" className={classes.content}>
                  {props.content}
                  <br />
                  {feedbackFailedUploads.length > 0 && (
                    <ul>
                      {feedbackFailedUploads.map((name, index) => (
                        <li key={index}>{name}</li>
                      ))}
                    </ul>
                  )}
                  {""}
                  {props.feedbackFailedSubTitle}
                  {ERROR_MODALS.includes(type) && (
                    <a href="mailto:support@unbockhealth.com">
                      {REACT_APP_SUPPORT_MAIL_ADDRESS}{" "}
                    </a>
                  )}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" className={classes.content}>
                {props.content}
                {subContent.length > 0 &&
                  (type === "patientEmailNotVerified" ||
                    type === "patientAlreadyExist") ? (
                  <>
                    {" "}
                    <br />
                    {subContent.map((value: any, key: number) => (
                      <>
                        {value}
                        {key !== subContent.length - 1 && <br />}{" "}
                      </>
                    ))}
                  </>
                ) : null}
                {ERROR_MODALS.includes(type) && (
                  <a href="mailto:support@unbockhealth.com">
                    {REACT_APP_SUPPORT_MAIL_ADDRESS}{" "}
                  </a>
                )}
              </Typography>
            )}

            {type === "alreadyExistInvite" ? (
              <ol>
                {INVITE_ALREADY_EXISTS_SUBTITLE.map((value, key) => (
                  <>
                    <Typography variant="body1" className={classes.content}>
                      {key !== 2 ? (
                        <li>{value}</li>
                      ) : (
                        <li>
                          {value[0]}
                          <ScheduleIcon style={{ color: "blue", fontSize: "15px" }} />
                          {value[1]}
                        </li>
                      )}
                    </Typography>
                  </>
                ))}
              </ol>
            ) : (
              ""
            )}
            {(subContent.length > 0 && type === "logout") ||
              type === "authConfirm" ? (
              <>
                {subContent.map((value: any, key: any) => (
                  <>
                    <Typography
                      variant="body1"
                      key={key}
                      className={classes.content}
                    >
                      {type === "authConfirm" ? <p>{value}</p> : <li>{value}</li>}
                    </Typography>
                  </>
                ))}
              </>
            ) : (
              ""
            )}
          </CardContent>
          <CardActions className={classes.actions}>
            {!INFO_MODALS.includes(type) && (
              <Button
                onClick={() => props.onClose()}
                variant="contained"
                className={classes.closeButton}
              >
                {props.closeButtonName ? props.closeButtonName : "Cancel"}
              </Button>
            )}
            {!ONE_BUTTON_TYPE.includes(type) && (
              <Button
                color="primary"
                onClick={() => confirm()}
                variant="contained"
                className={classes.successButton}
              >
                {props.successButtonName || "Confirm"}
              </Button>
            )}
          </CardActions>
        </Card>
      </StyledDiv>

    </Modal>
  );
}

// BaseModal.propTypes = {
//   title: PropTypes.string,
//   onClose: PropTypes.func,
//   open: PropTypes.bool,
//   confirmAction: PropTypes.func,
//   content: PropTypes.string,
//   successButtonName: PropTypes.string,
//   type: PropTypes.string,
// };

// BaseModal.defaultProps = {
//   open: false,
// };

export default BaseModal;
