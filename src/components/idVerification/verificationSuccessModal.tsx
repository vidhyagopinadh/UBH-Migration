import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Button, Dialog, Typography } from "@material-ui/core";
import { KeyboardDoubleArrowRight, TaskAlt } from "@mui/icons-material";
import { useHistory } from "react-router";
import { useTranslate } from "react-admin";
import { ErrorOutline } from "@material-ui/icons";
import IdVerificationRedirection from "./idVerificationRedirection";
import useTraces from "../../hooks/useTraces";
import { useSelector } from "react-redux";
import type { AppState, VerificationSuccessModalProps } from "../../types";
const { REACT_APP_SUPPORT_MAIL_ADDRESS } = process.env;

function VerificationSuccessModal({
  open,
  onClose,
  modalType,
  errorType,
  selectedSystem,
  setReloadIntegrations,
  ...rest
}: VerificationSuccessModalProps): JSX.Element {
  const useStyles = makeStyles(() => ({
    root: {
      padding: "30px",
      width: "100%",
      alignItems: "center",
    },
    cancel: {
      marginRight: "10px",
      backgroundColor: "grey",
      color: "white",
      textTransform: "none",
    },
    agree: {
      textTransform: "none",
    },
    dialogContainer: {
      overflow: "hidden",
    },
    dialogContent: {
      maxHeight: "100%",
      overflow: "auto",
    },
    header: {
      maxWidth: 420,
      margin: "0 auto",
      textAlign: "center",
      marginBottom: "20px",
    },
    content: {
      maxWidth: 420,
      margin: "0 auto",
      textAlign: "justify",
      marginTop: "20px",
    },
    closeIcon: {
      position: "absolute",
      top: "8px",
      right: "8px",
    },
  }));
  const classes = useStyles();
  const history = useHistory();
  const translate = useTranslate();
  const [openRedirection, setOpenRedirection] = useState<boolean>(false);
  const { getTrace } = useTraces();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  useEffect(() => {
    if (open) {
      if (modalType === "success")
        getTrace(
          "Success popup displayed after verification",
          "ev-165",
          userInfoReducer.email,
        );
      else
        getTrace(
          "Error popup displayed after verification",
          "ev-166",
          userInfoReducer.email,
        );
    }
  }, []);
  return (
    <>
      {open && (
        <Dialog
          maxWidth="sm"
          onClose={onClose}
          open={open}
          classes={{ container: classes.dialogContainer }}
          disableBackdropClick
        >
          <div {...rest} className={clsx(classes.root)}>
            <div className={classes.header}>
              <Typography
                variant="h5"
                component="h2"
                style={{ fontWeight: "700" }}
              >
                {modalType === "success"
                  ? translate(
                      "resources.integration.idVerificationSuccessTitle",
                    )
                  : translate("resources.integration.idVerificationErrorTitle")}
              </Typography>
              {modalType === "success" ? (
                <TaskAlt
                  style={{ color: "#2AAA8A", width: "50px", height: "50px" }}
                />
              ) : (
                <ErrorOutline
                  style={{ color: "red", width: "50px", height: "50px" }}
                />
              )}
              <Typography
                variant="h5"
                component="h2"
                style={{
                  color: modalType === "success" ? "#2AAA8A" : "red",
                  fontWeight: "700",
                }}
              >
                {modalType === "success" ? "Success" : "Failed"}
              </Typography>
              <Typography
                id="transition-modal-title"
                variant="subtitle1"
                component="h2"
              >
                {modalType === "success" &&
                  translate(
                    "resources.integration.idVerificationSuccessMessage",
                  )}
                {modalType === "error" && (
                  <>
                    {errorType === "link_expired"
                      ? translate(
                          "resources.integration.idVerificationLinkErrorMessage",
                        )
                      : errorType === "patientCreationError"
                      ? translate(
                          "resources.integration.patientCreationErrorMessage",
                        )
                      : errorType === "error"
                      ? translate(
                          "resources.integration.verificationStatusFailedMessage1",
                        )
                      : translate(
                          "resources.integration.idVerificationServerErrorMessage",
                        )}
                    {errorType !== "patientCreationError" && (
                      <a href={"mailto:support@unblock.health"}>
                        {REACT_APP_SUPPORT_MAIL_ADDRESS}
                      </a>
                    )}
                    {errorType === "error" && (
                      <>
                        {translate(
                          "resources.integration.verificationStatusFailedMessage2",
                        )}
                      </>
                    )}
                  </>
                )}
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "30px",
                }}
              >
                {modalType === "success" && (
                  <Button
                    variant="contained"
                    className={classes.cancel}
                    onClick={() => {
                      onClose();
                      history.push("/");
                    }}
                  >
                    Home
                  </Button>
                )}
                {errorType === "error" && (
                  <Button
                    variant="contained"
                    className={classes.cancel}
                    onClick={() => {
                      onClose();
                      setReloadIntegrations(true);
                    }}
                  >
                    Close
                  </Button>
                )}
                {errorType === "patientCreationError" && (
                  <Button
                    variant="contained"
                    className={classes.cancel}
                    onClick={() => {
                      onClose();
                      setOpenRedirection(true);
                    }}
                    data-testid="retry"
                  >
                    Retry
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.agree}
                  onClick={() => {
                    onClose();
                    history.push("/profile/myAccount");
                  }}
                  endIcon={<KeyboardDoubleArrowRight />}
                >
                  Go to profile
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
      {openRedirection && (
        <IdVerificationRedirection
          open={openRedirection}
          onClose={() => {
            setOpenRedirection(false);
          }}
          selectedSystem={selectedSystem}
        />
      )}
    </>
  );
}

VerificationSuccessModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  modalType: PropTypes.string,
  errorType: PropTypes.string,
  selectedSystem: PropTypes.array,
  setReloadIntegrations: PropTypes.func,
};

export default VerificationSuccessModal;
