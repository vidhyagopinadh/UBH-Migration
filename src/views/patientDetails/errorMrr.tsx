import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
//import { makeStyles } from "@material-ui/styles";
import { Button, Dialog, Typography } from "@mui/material";
import { CardHeader } from "semantic-ui-react";
import type { IErrorMrrProps } from "../../types/types";
import { Error } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const PREFIX = "errorMrr";

const classes = {
  root: `${PREFIX}-root`,
  dialogContainer: `${PREFIX}-dialogContainer`,
  header: `${PREFIX}-header`,
  content: `${PREFIX}-content`,
  dialogContent: `${PREFIX}-dialogContent`,
  image: `${PREFIX}-image`,
  ok: `${PREFIX}-ok`,
  agree: `${PREFIX}-agree`,
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: "30px",
    width: "100%",
  },
  [`& .${classes.dialogContainer}`]: {
    overflow: "hidden",
  },
  [`& .${classes.header}`]: {
    maxWidth: "350px",
    margin: "0 auto",
    textAlign: "center",
    marginBottom: "20px",
  },
  [`&.${classes.content}`]: {
    overflow: "hidden",
  },
  [`& .${classes.dialogContent}`]: {
    maxWidth: "350px",
    margin: "0 auto",
    textAlign: "center",
    marginTop: "20px",
  },
  [`& .${classes.image}`]: {
    width: "40px",
    height: "40px",
  },
  [`&.${classes.ok}`]: {
    marginTop: "20px",
    backgroundColor: "grey",
    color: "white",
    textTransform: "none",
  },
  [`& .${classes.agree}`]: {
    textTransform: "none",
  },
}));

function ErrorMrr({ open, onClose, ...rest }: IErrorMrrProps): JSX.Element {
  return (
    <>
    <StyledDiv>
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
      </StyledDiv>
    </>
  );
}

ErrorMrr.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default ErrorMrr;
