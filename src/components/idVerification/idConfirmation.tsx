import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Loader from "react-js-loader";
import { Button, Dialog, Grid, Typography } from "@material-ui/core";
import noLogo from "../../images/noLogo.png";
import { CardHeader, Divider } from "semantic-ui-react";
import logo from "../../images/logo.png";
import { TaskAlt } from "@mui/icons-material";
import { useTranslate } from "react-admin";
import { useMutation } from "@apollo/react-hooks";
import type {
  AppState,
  IValidationValues,
  IdConfirmationProps,
} from "../../types";
import { Cancel, CheckCircle, ErrorOutline } from "@material-ui/icons";
import { useHistory } from "react-router";
import BaseModal from "../baseModal";
import validateUserProfile from "../../queries/validateUserProfile/validateUserProfile";
import IdVerificationRedirection from "./idVerificationRedirection";
import type {
  ValidateUserProfileV1Mutation,
  ValidateUserProfileV1MutationVariables,
  ValidateUserProfileV1Payload,
} from "../../__generated__/typescript-operations_all";
import useTraces from "../../hooks/useTraces";
import { useSelector } from "react-redux";
function IdConfirmation({
  open,
  onClose,
  selectedSystem,
  systemLogo,
  ...rest
}: IdConfirmationProps): JSX.Element {
  const useStyles = makeStyles(() => ({
    root: {
      padding: "30px",
      overflow: "scroll",
    },
    image: {
      maxWidth: "200px",
      height: "50px",
      marginRight: "30px",
    },
    cancel: {
      backgroundColor: "grey",
      width: "200px",
      color: "white",
      textTransform: "none",
    },
    agree: {
      textTransform: "none",
      width: "200px",
      marginBottom: "10px",
    },
    dialogContainer: {
      overflow: "hidden",
    },
    subtitle: {
      fontWeight: 700,
      margin: "20px",
    },
    header: {
      margin: "0 auto",
      textAlign: "center",
      marginBottom: "20px",
    },
    content: {
      margin: "0 auto",
      textAlign: "center",
      marginTop: "20px",
      overflow: "hidden",
    },
    closeIcon: {
      position: "absolute",
      top: "8px",
      right: "8px",
    },
    description: {
      wordWrap: "break-word",
      marginTop: "20px",
    },
    tickIcon: {
      color: "#2AAA8A",
      margin: "20px",
    },
    warningIcon: {
      color: "red",
      margin: "20px",
    },
    list: {
      fontSize: "12px",
      fontWeight: 500,
    },
    buttonContainer: {
      justifyContent: "center",
      marginTop: "10px",
      marginBottom: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  }));
  const classes = useStyles();
  const translate = useTranslate();
  const { getTrace } = useTraces();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const history = useHistory();
  const [validationValues, setValidationValues] = useState<IValidationValues[]>(
    [],
  );
  const [response, setResponse] = useState<ValidateUserProfileV1Payload>({
    validationInfo: {
      status: null,
      message: null,
      data: [],
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openRedirection, setOpenRedirection] = useState<boolean>(false);
  const [verificationCompleted, setVerificationCompleted] =
    useState<boolean>(false);
  const [openCancelBase, setOpenCancelBase] = useState<boolean>(false);
  const [subscribeValidateProfileMutation] = useMutation<
    ValidateUserProfileV1Mutation,
    ValidateUserProfileV1MutationVariables
  >(validateUserProfile, {});
  useEffect(() => {
    if (open) {
      verifyIdentity();
      getTrace(
        "Id validation popup is displayed",
        "ev-161",
        userInfoReducer.email,
      );
    }
  }, [open]);
  const redirectToIas = (): void => {
    onClose();
    setOpenRedirection(true);
  };
  const closeVerification = (): void => {
    setOpenCancelBase(false);
    onClose();
    history.push("/profile/myAccount");
  };
  const verifyIdentity = (): void => {
    subscribeValidateProfileMutation({
      variables: { input: { externalSystemId: selectedSystem.id } },
    }).then((res) => {
      setResponse(res.data.validateUserProfileV1);
      setValidationValues(res.data.validateUserProfileV1.validationInfo.data);
    });
    setIsLoading(false);
    setVerificationCompleted(true);
  };
  return (
    <>
      {response.validationInfo.status && (
        <Dialog
          maxWidth={"sm"}
          onClose={onClose}
          open={open}
          classes={{ container: classes.dialogContainer }}
          disableBackdropClick
        >
          {openCancelBase && (
            <BaseModal
              open={openCancelBase}
              confirmAction={closeVerification}
              onClose={() => {
                setOpenCancelBase(false);
              }}
              title={translate("resources.integration.cancelVerificationTitle")}
              content={translate(
                "resources.integration.cancelVerificationMessage",
              )}
              successButtonName="Yes"
              closeButtonName="No"
            />
          )}
          <div {...rest} className={clsx(classes.root)}>
            {isLoading && !verificationCompleted ? (
              <div className={classes.content}>
                <Typography
                  variant="h5"
                  component="h2"
                  className={classes.subtitle}
                >
                  {translate("resources.integration.iasLoadingTitle")}
                </Typography>
                <Loader
                  type="spinner-cub"
                  title={""}
                  bgColor="#516FC4"
                  size={100}
                />{" "}
                <Typography
                  variant="subtitle1"
                  component="h5"
                  className={classes.subtitle}
                >
                  {translate("resources.integration.iasLoadingMessage")}
                </Typography>
              </div>
            ) : (
              <>
                <div className={classes.header}>
                  <CardHeader>
                    <img src={logo} className={classes.image} />
                    <img
                      src={systemLogo ? systemLogo : noLogo}
                      className={classes.image}
                    />
                  </CardHeader>
                  <Divider />
                </div>
                <div className={classes.content}>
                  {verificationCompleted && (
                    <>
                      {" "}
                      <Typography
                        variant="h5"
                        component="h1"
                        style={{ fontWeight: 700 }}
                      >
                        Verify your identity
                      </Typography>
                      {response?.validationInfo.status === "Success" ? (
                        <TaskAlt
                          className={classes.tickIcon}
                          style={{ width: "50px", height: "50px" }}
                        />
                      ) : (
                        <ErrorOutline
                          className={classes.warningIcon}
                          style={{ width: "50px", height: "50px" }}
                        />
                      )}
                      <Typography
                        variant="h6"
                        component="h1"
                        style={{ fontWeight: 700 }}
                      >
                        {response?.validationInfo.status === "Success"
                          ? "Profile Validation Successful!"
                          : "Profile Validation Failed!"}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        component="h5"
                        className={classes.subtitle}
                      >
                        {response?.validationInfo.status === "Success"
                          ? translate(
                              "resources.integration.verificationSuccess",
                            )
                          : translate(
                              "resources.integration.verificationError",
                            )}
                      </Typography>
                      <Divider />
                      <Grid container spacing={1}>
                        {validationValues
                          .slice(0, validationValues.length / 2)
                          .map((value) => (
                            <Grid item md={6}>
                              <div
                                style={{
                                  display: "flex",
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                {value.status === "Success" ? (
                                  <CheckCircle style={{ color: "green" }} />
                                ) : (
                                  <Cancel style={{ color: "red" }} />
                                )}
                                <Typography
                                  variant="subtitle1"
                                  component="h5"
                                  className={classes.list}
                                >
                                  {value.field}:{" "}
                                  {value.status === "Success"
                                    ? value.fieldValue
                                    : (value.fieldValue === null
                                        ? "N/A"
                                        : value.fieldValue) +
                                      " (" +
                                      value.message +
                                      ")"}
                                </Typography>
                              </div>
                            </Grid>
                          ))}
                        {validationValues
                          .slice(
                            validationValues.length / 2,
                            validationValues.length,
                          )
                          .map((value) => (
                            <Grid item md={6}>
                              <div
                                style={{
                                  display: "flex",
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                {value.status === "Success" ? (
                                  <CheckCircle style={{ color: "green" }} />
                                ) : (
                                  <Cancel style={{ color: "red" }} />
                                )}{" "}
                                <Typography
                                  variant="subtitle1"
                                  component="h5"
                                  className={classes.list}
                                >
                                  {value.field}:{" "}
                                  {value.status === "Success"
                                    ? value.fieldValue
                                    : (value.fieldValue === null
                                        ? "N/A"
                                        : value.fieldValue) +
                                      " (" +
                                      value.message +
                                      ")"}
                                </Typography>
                              </div>
                            </Grid>
                          ))}
                      </Grid>
                    </>
                  )}
                </div>
                <Divider />
                <div className={classes.buttonContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.agree}
                    onClick={() => {
                      getTrace(
                        "Click allow and continue",
                        "ev-162",
                        userInfoReducer.email,
                      );
                      response?.validationInfo.status === "Success"
                        ? redirectToIas()
                        : onClose();
                    }}
                  >
                    {response?.validationInfo.status === "Success"
                      ? "Allow and continue"
                      : "Close"}
                  </Button>
                  {response?.validationInfo.status === "Success" && (
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.cancel}
                      onClick={() => {
                        getTrace(
                          "Click cancel",
                          "ev-163",
                          userInfoReducer.email,
                        );
                        setOpenCancelBase(true);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </Dialog>
      )}
      <IdVerificationRedirection
        open={openRedirection}
        onClose={() => {
          setOpenRedirection(false);
        }}
        selectedSystem={selectedSystem}
      />
    </>
  );
}

IdConfirmation.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  selectedSystem: PropTypes.array,
  systemLogo: PropTypes.string,
};

export default IdConfirmation;
