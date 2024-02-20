import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
//import { makeStyles } from "@material-ui/styles";
import useLogout from "../hooks/useLogout";
import { Logout } from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import { Button, Dialog, Typography } from "@mui/material";

const PREFIX = 'LogoutModal';
const classes = {
  root: `${PREFIX}-root`,
  dialogContainer: `${PREFIX}-dialogContainer`,
  noButton: `${PREFIX}-noButton`,
  yesButton: `${PREFIX}-yesButton`,
  content: `${PREFIX}-content`,
}
const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: "20px",
    width: "100%",
  },
  [`& .${classes.dialogContainer}`]: {
    overflow: "hidden",
  },
  [`& .${classes.noButton}`]: {
    backgroundColor: "grey",
    width: "150px",
    color: "white",
    textTransform: "none",
    marginRight: "10px",
  },
  [`& .${classes.yesButton}`]: {
    textTransform: "none",
    width: "150px",
  },
  [`& .${classes.content}`]: {
    maxWidth: 520,
    margin: "0 auto",
    textAlign: "center",
  },
}))


function LogoutModal({ open, onClose, ...rest }: any): JSX.Element {
  // const classes = useStyles();
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
      disableBackdropClick={true}
    >
      <StyledDiv>
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
      </StyledDiv>

    </Dialog>
  );
}

LogoutModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default LogoutModal;
