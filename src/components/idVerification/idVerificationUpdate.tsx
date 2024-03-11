import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  IconButton,
  Typography,
} from "@material-ui/core";
import { CardHeader, Divider } from "semantic-ui-react";
import { BootstrapTooltip as Tooltip } from "../Tooltip";
import { GridCloseIcon } from "@mui/x-data-grid";
import type { IdVerificationUpdateProps } from "../../types";
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
    maxWidth: 600,
    margin: "0 auto",
    textAlign: "center",
    marginBottom: "20px",
  },
  content: {
    maxWidth: 520,
    margin: "0 auto",
    textAlign: "justify",
    marginTop: "20px",
  },
  closeIcon: {
    position: "absolute",
    top: "8px",
    right: "8px",
  },
  terms: {
    fontSize: 14,
    fontWeight: 500,
    color: "grey",
    textAlign: "center",
  },
}));

function IdVerificationUpdate({
  open,
  onClose,
  setEditView,
  ...rest
}: IdVerificationUpdateProps): JSX.Element {
  const classes = useStyles();
  const [termsSelected, setTermsSelected] = useState<boolean>(false);
  return (
    <>
      <Dialog
        maxWidth="sm"
        onClose={onClose}
        open={open}
        classes={{ container: classes.dialogContainer }}
        disableBackdropClick
      >
        <Tooltip arrow placement="top" title="close">
          <IconButton
            className={classes.closeIcon}
            onClick={() => {
              onClose();
              setTermsSelected(false);
            }}
          >
            <GridCloseIcon />
          </IconButton>
        </Tooltip>
        <div {...rest} className={clsx(classes.root)}>
          <div className={classes.header}>
            <CardHeader>
              <Typography align="center" gutterBottom variant="h5">
                <b>Edit Profile </b>{" "}
              </Typography>
            </CardHeader>
            <Divider />
          </div>
          <div className={classes.content}>
            <Typography
              align="center"
              gutterBottom
              variant="h6"
              style={{ fontWeight: 500 }}
            >
              Declaration
            </Typography>
            <ul>
              <li>
                {" "}
                Your ID verification has been successfully completed and we
                locked your profile for security purposes.
              </li>

              <li>
                {" "}
                With an identity verified account, you can securely access and
                retrieve your medical records from healthcare providers, health
                insurance companies, and health information exchange (HIEs)
                organizations through National Networks and interoperability
                frameworks/channels.
              </li>

              <li>
                {" "}
                If you modify your profile, you will need go through all the
                identity verification process to re-verify your account, so
                please confirm the necessity of updating your account.
              </li>
            </ul>
            <FormControlLabel
              style={{ marginLeft: "5%" }}
              control={
                <Checkbox
                  value="terms"
                  name="terms"
                  onChange={() => {
                    setTermsSelected(!termsSelected);
                  }}
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" className={classes.terms}>
                  I understand and agree to the declaration
                </Typography>
              }
            />
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
                onClose();
                setTermsSelected(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.agree}
              disabled={!termsSelected}
              onClick={() => {
                setTermsSelected(false);
                onClose();
                setEditView(true);
              }}
            >
              Confirm Update
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

IdVerificationUpdate.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  setEditView: PropTypes.func,
};

export default IdVerificationUpdate;
