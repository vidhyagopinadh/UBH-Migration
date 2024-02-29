import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  Modal,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@material-ui/core";
import { WarningRounded } from "@material-ui/icons";
function InstitutionModal({
  open,
  onClose,
  title,
  confirmAction,
  subTitle1,
  content = {},
  subTitle2,
}): JSX.Element {
  const useStyles = makeStyles((theme) => ({
    root: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      outline: "none",
      backgroundColor: theme.palette.primary.light,
      boxShadow: theme.shadows[20],
      width: 550,
      maxHeight: "100%",
      overflowY: "auto",
      maxWidth: "100%",
    },
    container: {
      marginTop: theme.spacing(3),
      height: 200,
    },
    actions: {
      justifyContent: "flex-end",
    },
    content: {
      marginLeft: "30px",
    },
    mainContent: {
      marginLeft: "30px",
      fontWeight: 600,
    },
    closeButton: {
      borderRadius: "30px",
      color: "white",
      backgroundColor: "grey",
      textTransform: "none",
      marginBottom: "3%",
    },
    successButton: {
      borderRadius: "30px",
      textTransform: "none",
      marginBottom: "3%",
      marginRight: "10%",
    },
  }));
  const classes = useStyles();
  if (!open) {
    return null;
  }
  const confirm = (): void => {
    confirmAction(true);
  };
  return (
    <Modal
      onClose={onClose}
      open={open}
      data-testid="base-modal"
      disableBackdropClick
    >
      <Card className={clsx(classes.root)}>
        <div
          style={{
            fontWeight: "600",
            display: "flex",
            margin: "20px",
            marginBottom: "0px",
          }}
        >
          <WarningRounded
            style={{
              color: "Orange",
            }}
            fontSize={"large"}
          />

          <Typography variant="h6" style={{ paddingLeft: "10px" }}>
            {" "}
            {title}
          </Typography>
        </div>

        <CardContent style={{ textAlign: "justify" }}>
          <Typography variant="body1" className={classes.content}>
            {subTitle1}
          </Typography>
          <br></br>
          {Object.entries(content).map((value, key) =>
            value[1] !== null ? (
              <Typography
                variant="body1"
                key={key}
                className={classes.mainContent}
              >
                {value[0] + ": " + value[1]}
              </Typography>
            ) : (
              <></>
            ),
          )}
          <br></br>
          <Typography variant="body1" className={classes.content}>
            {subTitle2}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button
            onClick={onClose}
            variant="contained"
            className={classes.closeButton}
          >
            {"No"}
          </Button>
          <Button
            color="primary"
            onClick={() => confirm()}
            variant="contained"
            className={classes.successButton}
          >
            {"Yes"}
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
}

InstitutionModal.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  confirmAction: PropTypes.func,
  content: PropTypes.object,
  subTitle2: PropTypes.string,
};

InstitutionModal.defaultProps = {
  open: false,
};
export default InstitutionModal;
