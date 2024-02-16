import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Button, Dialog, Typography } from "@material-ui/core";
import useLogout from "../hooks/useLogout";
import { Logout } from "@mui/icons-material";
const useStyles = makeStyles(() => ({
  root: {
    padding: "20px",
    width: "100%",
  },
  dialogContainer: {
    overflow: "hidden",
  },
  noButton: {
    backgroundColor: "grey",
    width: "150px",
    color: "white",
    textTransform: "none",
    marginRight: "10px",
  },
  yesButton: {
    textTransform: "none",
    width: "150px",
  },
  content: {
    maxWidth: 520,
    margin: "0 auto",
    textAlign: "center",
  },
}));

function LogoutModal({ open, onClose, ...rest }): JSX.Element {
  const classes = useStyles();
  const { keycloakLogout } = useLogout();
  const logOut = (): void => {
    keycloakLogout();
  };
  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      classes={{ container: classes.dialogContainer }}
      disableBackdropClick
    >
      <div {...rest} className={clsx(classes.root)}>
        <div className={classes.content}>
          <Logout style={{ width: "50px", height: "50px" }} />
          <Typography variant="subtitle1" component="h1">
            Are you sure you want to logout?
          </Typography>
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
            className={classes.noButton}
            onClick={() => {
              onClose();
            }}
          >
            No
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.yesButton}
            onClick={() => {
              onClose();
              logOut();
            }}
          >
            Yes
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

LogoutModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default LogoutModal;
