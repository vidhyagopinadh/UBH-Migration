import React from "react";
import { makeStyles } from "@material-ui/styles";
import emptyDisplayImage from "../images/emptyImage.png";
import patientDisplayImage from "../images/patient.png";
import inviteDisplayImage from "../images/invite.png";
import integrationImage from "../images/integration.png";
import noResultsImage from "../images/noResultsFound.png";
import { Add } from "@material-ui/icons";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import type { AppState } from "../types";
import { CO_ROLE_MRA } from "../utils/roles";
import { Button, Container, Typography } from "@mui/material";

const useStyles = makeStyles(() => ({
  root: {
    padding: "5px",
    paddingTop: "40px",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    maxWidth: "900px",
    textAlign: "center",
    alignItems: "center",
  },
  title: {
    fontSize: "38px",
    marginBottom: "15px",
  },
  imageContainer: {
    marginTop: "10px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
  },
  image: {
    marginTop: 10,
  },
  button: {
    flex: "1",
    minWidth: "30%",
    textTransform: "none",
    fontSize: "16px",
    marginTop: "10px",
  },
}));

function CustomEmpty({ type }: any) {
  const classes = useStyles();
  const history = useHistory();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const emptyContent = {
    myself: {
      title: "No requests have been submitted yet!",
      image: emptyDisplayImage,
    },
    behalf: {
      title: "No requests have been made on your behalf yet!",
      image: emptyDisplayImage,
    },
    invite: {
      title: "No invites have been made yet!",
      image: inviteDisplayImage,
    },
    patient: {
      title: "No patients added yet!",
      image: patientDisplayImage,
    },
    dependent: {
      title: "No dependents added yet!",
      image: patientDisplayImage,
    },
    institution: {
      title: "No institutions added yet!",
      image: patientDisplayImage,
    },
    integrations: {
      title: "No integrations added yet!",
      image: integrationImage,
    },
    noResults: {
      title: "No matching search results found. Please try a different search.",
      image: noResultsImage,
    },
  };
  return (
    <Container className={classes.root}>
      <div className={classes.imageContainer}>
        <img alt="" className={classes.image} src={emptyContent[type].image} />
      </div>
      <Typography align="center" variant="h5">
        {emptyContent[type].title}
      </Typography>
      {(type === "myself" || type === "behalf") &&
        userInfoReducer.role !== CO_ROLE_MRA && (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              history.push("/requestCreate");
            }}
            startIcon={<Add />}
          >
            Create your first request
          </Button>
        )}
    </Container>
  );
}

export default CustomEmpty;
