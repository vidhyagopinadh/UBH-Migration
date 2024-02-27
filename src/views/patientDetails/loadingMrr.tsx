import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import Loader from "react-js-loader";
import { makeStyles } from "@material-ui/styles";
import { Button, Dialog, Typography } from "@material-ui/core";
import { CardHeader } from "semantic-ui-react";
import type { ILoadingMrrProps } from "../../types";
import calenderImage from "../../images/calender.png";
import { TaskAlt } from "@mui/icons-material";
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
    backgroundColor: "#2AAA8A",
    color: "white",
    textTransform: "none",
  },
  agree: {
    textTransform: "none",
  },
}));

function LoadingMrr({
  open,
  onClose,
  setOpenSearchBase,
  ...rest
}: ILoadingMrrProps): JSX.Element {
  const classes = useStyles();
  const [responseReceived, setResponseReceived] =
    React.useState<boolean>(false);
  React.useEffect(() => {
    setResponseReceived(true);
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
        <div {...rest} className={clsx(classes.root)}>
          <div className={classes.header}>
            {responseReceived ? (
              <CardHeader>
                <TaskAlt
                  style={{ color: "#2AAA8A", width: "40px", height: "40px" }}
                />
                <Typography style={{ fontWeight: 500 }} variant="h5">
                  Success
                </Typography>
              </CardHeader>
            ) : (
              <CardHeader style={{ textAlign: "center" }}>
                <Loader
                  type="spinner-cub"
                  title={""}
                  bgColor="#516FC4"
                  size={40}
                />
                <div
                  style={{
                    alignItems: "center",
                    display: "inline-flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={calenderImage}
                    className={classes.image}
                    alt="Calendar"
                  />
                  <Typography
                    style={{
                      fontWeight: 500,
                    }}
                    variant="h5"
                    align="center"
                  >
                    Please wait
                  </Typography>
                </div>
              </CardHeader>
            )}
          </div>
          <div className={classes.content}>
            <Typography variant="subtitle1" component="h5">
              {" "}
              {responseReceived
                ? "Your request has been accepted by our health data connector partner services and queued for processing."
                : "Please wait while we submit your medical records request to our health data connector partner services for processing!"}
            </Typography>
            {responseReceived && (
              <Button
                variant="contained"
                className={classes.ok}
                onClick={() => {
                  onClose();
                  setOpenSearchBase(true);
                }}
              >
                Okay, got it
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}

LoadingMrr.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  setOpenSearchBase: PropTypes.func,
};

export default LoadingMrr;
