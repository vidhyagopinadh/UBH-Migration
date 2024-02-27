import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Button, Dialog, Typography } from "@material-ui/core";
import { CardHeader } from "semantic-ui-react";
import type { IErrorMrrProps } from "../../types";
import { Error } from "@material-ui/icons";
const useStyles = makeStyles(() => ({
  root: {
    padding: "30px",
    width: "100%",
  },
  dialogContainer: {
    overflow: "hidden",
  },
  header: {
    maxWidth: "350px",
    margin: "0 auto",
    textAlign: "center",
    marginBottom: "20px",
  },
  content: {
    maxWidth: "350px",
    margin: "0 auto",
    textAlign: "center",
    marginTop: "20px",
  },
  image: {
    width: "40px",
    height: "40px",
  },
  ok: {
    marginTop: "20px",
    backgroundColor: "grey",
    color: "white",
    textTransform: "none",
  },
  agree: {
    textTransform: "none",
  },
}));

function ErrorMrr({ open, onClose, ...rest }: IErrorMrrProps): JSX.Element {
  const classes = useStyles();
  return (
    <>
      <Dialog
        maxWidth="sm"
        onClose={onClose}
        open={open}
        classes={{ container: classes.dialogContainer }}
        disableBackdropClick
      >
        <div {...rest} className={clsx(classes.root)}>
          <div className={classes.header}>
            <CardHeader>
              <Error style={{ color: "red", width: "40px", height: "40px" }} />
              <Typography style={{ fontWeight: 500 }} variant="h5">
                Request Failed
              </Typography>
            </CardHeader>
          </div>
          <div className={classes.content}>
            <Typography variant="subtitle1" component="h5">
              Failed to process your request. Please try again later
            </Typography>
            <Button
              variant="contained"
              className={classes.ok}
              onClick={() => {
                onClose();
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

ErrorMrr.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default ErrorMrr;
