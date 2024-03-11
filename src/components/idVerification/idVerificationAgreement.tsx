import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Button, Dialog, IconButton, Typography } from "@material-ui/core";
import { CardHeader, Divider } from "semantic-ui-react";
import IdConfirmation from "./idConfirmation";
import { GridCloseIcon } from "@mui/x-data-grid";
import useTraces from "../../hooks/useTraces";
import { useSelector } from "react-redux";
import type { AppState, IdVerificationAgreementProps } from "../../types";
const useStyles = makeStyles(() => ({
  root: {
    padding: "30px",
    width: "100%",
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

function IdVerificationAgreement({
  open,
  onClose,
  selectedSystem,
  systemLogo,
  ...rest
}: IdVerificationAgreementProps): JSX.Element {
  const classes = useStyles();
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const { getTrace } = useTraces();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  useEffect(() => {
    if (open) getTrace("Agreement loaded", "ev-158", userInfoReducer.email);
  }, []);
  return (
    <>
      <Dialog
        maxWidth="sm"
        onClose={onClose}
        open={open}
        classes={{ container: classes.dialogContainer }}
        disableBackdropClick
      >
        <IconButton
          className={classes.closeIcon}
          onClick={() => {
            onClose();
          }}
        >
          <GridCloseIcon />
        </IconButton>
        <div {...rest} className={clsx(classes.root)}>
          <div className={classes.header}>
            <CardHeader>
              <Typography align="center" gutterBottom variant="h5">
                <b>Unblock Health Medical Records Retrieval Agreement</b>{" "}
              </Typography>
            </CardHeader>
            <Divider />
          </div>
          <div className={classes.content}>
            <p>
              You are about to use an Unblock Health feature to find and
              retrieve your medical records from healthcare providers, health
              insurance companies, or health information exchange (HIEs)
              organizations.
            </p>
            <p>
              {" "}
              To aid in finding and retrieving your medical information, Unblock
              Health uses US-based health data connector services. These
              services serve as data access relays for health organizations and
              maintain strict compliance with HIPAA and federal privacy
              regulations.
            </p>
            <p>
              {" "}
              By continuing, you acknowledge that you are directing the Unblock
              Health application to verify your identity with partner you have
              selected to retrieve your medical records and you consent to
              allowing Unblock Health data connector services to search for your
              records by yourself, as well as to those individuals or entities
              whom you have granted authorization to access your medical
              records.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <Button
              variant="contained"
              className={classes.cancel}
              onClick={() => {
                getTrace(
                  "Click on cancel agreement",
                  "ev-160",
                  userInfoReducer.email,
                );
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.agree}
              onClick={() => {
                getTrace("Click on agree", "ev-159", userInfoReducer.email);
                setOpenConfirmation(true);
                onClose();
              }}
            >
              Agree
            </Button>
          </div>
        </div>
      </Dialog>
      <IdConfirmation
        open={openConfirmation}
        onClose={() => {
          setOpenConfirmation(false);
        }}
        selectedSystem={selectedSystem}
        systemLogo={systemLogo}
      />
    </>
  );
}

IdVerificationAgreement.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  selectedSystem: PropTypes.array,
  systemLogo: PropTypes.string,
};

export default IdVerificationAgreement;
