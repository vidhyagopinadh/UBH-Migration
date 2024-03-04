import type { BaseSyntheticEvent } from "react";
import React, { useState, useEffect } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Card, CardContent, Container, Grid, IconButton, LinearProgress, TextField, Typography } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import {
  validateEmail,
  validatePhone,
  validateString,
} from "../utils/validator";
import CardHeader from "./cardHeader";
import type { IInviteError } from "../types/types";
import { useTranslate } from "react-admin";
import type {
  InviteUserV1Mutation,
  InviteUserV1Input,
  VerifyUserExistsInput,
} from "../__generated__/typescript-operations_all";
import { useMutation } from "@apollo/react-hooks";
import BaseModal from "./baseModal";
import CreatePageHeader from "./createPageHeader";
import inviteUserQuery from "../queries/inviteUser/inviteUserQuery";
import { inviteErrorMessages } from "../utils/messages/errorMessages";
import verifyUserExists from "../queries/verifyUserExistQuery/verifyUserExists";
import { styled } from '@mui/styles';

const { REACT_APP_BASE_URL } = import.meta.env;

const PREFIX = "PatientInvite";
const classes = {
  root: `${PREFIX}-root`,
  infoText: `${PREFIX}-infoText`,
  subTitle: `${PREFIX}-SubTitle`,
  cancel: `${PREFIX}-cancel`,
  myOrg: `${PREFIX}-myOrg`,
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    width: "100%",
    "& label": {
      marginTop: -3,
    },
  },
  [`& .${classes.infoText}`]: {
    fontSize: 14, fontWeight: 500
  },
  [`& .${classes.subTitle}`]: {
    fontSize: 16,
    fontWeight: 500,
  },
  [`& .${classes.cancel}`]: {
    marginRight: "10px",
    backgroundColor: "grey",
    color: "white",
  },
  [`& .${classes.myOrg}`]: {
    display: "inline-flex", width: "100%"
  }
}));


function InvitePatient({ open, patientData, handleClose }: any): JSX.Element {
  const translate = useTranslate();
  const [disableWhileEmailCheck, setDisableWhileEmailCheck] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(false);
  const [openBase, setOpenBase] = useState(false);
  const [openSubmitBase, setOpenSubmitBase] = useState(false);
  const [openErrorBase, setOpenErrorBase] = useState(false);
  const [openCancelBase, setOpenCancelBase] = useState(false);
  const [openAlreadyExistsErrorBase, setOpenAlreadyExistsErrorBase] =
    useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const [subscribeInvitationMutation] = useMutation<InviteUserV1Mutation>(
    inviteUserQuery,
    {},
  );
  const [subscribeVerifyUserMutation] = useMutation(verifyUserExists, {});
  const [inviteError, setInviteError] = useState<IInviteError>({
    fName: {
      status: false,
      message: "",
    },
    mName: {
      status: false,
      message: "",
    },
    lName: {
      status: false,
      message: "",
    },
    emailAddress: {
      status: false,
      message: "",
    },
    phoneNumber: {
      status: false,
      message: "",
    },
    groupId: {
      status: false,
      message: "",
    },
    providerName: {
      status: false,
      message: "",
    },
  });
  const [formvalues, setFormValues] = useState<InviteUserV1Input>({
    domain: REACT_APP_BASE_URL + "/",
    fName: null,
    lName: null,
    mName: null,
    emailAddress: "",
    serviceCategoryId: 1,
    groupId: 8,
    isMyOrg: false,
    phoneNumber: null,
    providerPartyId: null,
  });
  const handleValidateOnBlur = (event: BaseSyntheticEvent): void => {
    event.persist();
    let validationStatus: boolean;
    if (event.target.name === "emailAddress") {
      if (event.target.value === "") {
        validationStatus = true;
        setError(
          "emailAddress",
          inviteErrorMessages["emailAddress"]["empty"],
          true,
        );
      } else {
        validationStatus = false;
      }
    }
    if (event.target.type === "tel") {
      if (event.target.value === "+1") {
        validationStatus = true;
        setError(event.target.name, "", false);
      } else {
        validationStatus = false;
      }
    } else if (event.target.type !== "checkbox") {
      validationStatus = !event.target.value;
    }
    if (!validationStatus) {
      switch (event.target.name) {
        case "phoneNumber": {
          const valid = validatePhone(event.target.value);
          setError(
            event.target.name,
            inviteErrorMessages[event.target.name]["invalid"],
            !valid,
          );
          break;
        }
        case "emailAddress": {
          const valid = validateEmail(event.target.value);
          setError(
            event.target.name,
            inviteErrorMessages[event.target.name]["invalid"],
            !valid,
          );
          if (valid) {
            setDisableWhileEmailCheck(true);
            const verifyUserInput: VerifyUserExistsInput = {
              username: event.target.value,
            };
            subscribeVerifyUserMutation({
              variables: { input: verifyUserInput },
            }).then((response) => {
              setDisableWhileEmailCheck(false);
              if (response.data.verifyUserExists.userExists) {
                setError(
                  event.target.name,
                  inviteErrorMessages[event.target.name]["alreadyExists"],
                  true,
                );
              }
            });
          }
          break;
        }
        case "fName":
        case "mName":
        case "lName": {
          const valid = validateString(event.target.value);
          setError(
            event.target.name,
            inviteErrorMessages[event.target.name]["invalid"],
            !valid,
          );
          break;
        }
        default: {
          setError(event.target.name, "", false);
          break;
        }
      }
    }
  };

  const setError = (
    fieldName: string,
    type: string,
    setError: boolean,
  ): void => {
    setInviteError((prevFormState) => ({
      ...prevFormState,
      [fieldName]: {
        status: setError,
        message: setError ? type : "",
      },
    }));
  };

  const handleChange = (event: BaseSyntheticEvent): void => {
    setFormFilled(true);
    setFormValues((prevFormState) => ({
      ...prevFormState,
      [event.target.name]: event.target.value,
    }));
  };
  const submitHandler = (): void => {
    setOpenBase(false);
    setShowLoader(true);
    subscribeInvitationMutation({
      variables: { input: formvalues },
    }).then((invitationResponse) => {
      if (!invitationResponse.data.inviteUserV1.results[0].userExist) {
        setOpenSubmitBase(true);
        setShowLoader(false);
      } else if (invitationResponse.data.inviteUserV1.results[0].userExist) {
        setOpenAlreadyExistsErrorBase(true);
        setShowLoader(false);
      } else {
        setOpenErrorBase(true);
        setShowLoader(false);
      }
    });
    setSubmitDisable(true);
  };
  const handleChangePhone = (value): void => {
    setFormFilled(true);
    formvalues.phoneNumber = value;
  };
  const confirmSubmission = (): void => {
    if (formvalues.phoneNumber === "+1") {
      setFormValues((prevFormState) => ({
        ...prevFormState,
        phoneNumber: null,
      }));
    }
    let isInviteValid = true;
    Object.entries(inviteError).forEach((indv) => {
      if (indv[1].status) {
        isInviteValid = false;
      }
    });
    if (formvalues.emailAddress === null || formvalues.emailAddress === "") {
      setError(
        "emailAddress",
        inviteErrorMessages["emailAddress"]["empty"],
        true,
      );
    } else if (isInviteValid) {
      setOpenBase(true);
    }
  };

  useEffect(() => {
    if (patientData) {
      setFormValues((prevFormState) => ({
        ...prevFormState,
        fName: patientData.firstName,
        mName: patientData.middleName,
        lName: patientData.lastName,
        emailAddress: patientData.email,
        phoneNumber: patientData.phoneNumber,
        userPartyId: patientData.id,
      }));
    }
  }, [patientData]);
  return (
  <StyledDiv>
    {/* <Modal onClose={handleClose} open={open} disableBackdropClick> */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "470px",
          bgcolor: "transparent",
          overflowX: "auto",
          backgroundColor: "white",
          borderRadius: "20px",
        }}
      >
        <div>
          <Container
            maxWidth="xl"
            style={{ maxWidth: "unset", paddingTop: "30px" }}
          >
            <Grid
              alignItems="flex-end"
              container
              justify="space-between"
              spacing={3}
            >
              <Grid item id="top" style={{ paddingBottom: "25px" }}>
                <CreatePageHeader
                  subTitle=""
                  mainTitle="resources.invite.formTitle"
                />
              </Grid>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                size="small"
                style={{ paddingBottom: "35px" }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>

            <Card className={classes.root}>
              <div>
                {showLoader && <LinearProgress color="secondary" />}
                <CardContent>
                  <div
                    style={{
                      filter: showLoader ? "blur(1px)" : "none",
                    }}
                  >
                    <CardHeader>
                      <Typography variant="h6" gutterBottom>
                        To invite a user to join Unblock Health, please fill out
                        the form below:{" "}
                      </Typography>
                      <div
                        style={{
                          borderLeft: "5px solid  #FF5733 ",
                          backgroundColor: "#FFFFE0",
                          borderRadius: "8px",
                          padding: "10px",
                          color: "#585858",
                        }}
                      >
                        <Typography
                          variant="h5"
                          className={classes.infoText}
                          gutterBottom
                        >
                          {translate("resources.invite.instructions.required")}
                          <br></br>
                          {translate("resources.invite.instructions.allInfo")}
                        </Typography>
                      </div>
                    </CardHeader>
                    <Grid
                      alignItems="flex-end"
                      container
                      spacing={1}
                      className={classes.myOrg}
                    >
                      <Grid item md={4} xs={12}>
                        <TextField
                          fullWidth
                          label="First Name"
                          margin="dense"
                          name="fName"
                          disabled={submitDisable}
                          value={formvalues.fName}
                          onChange={(event) => handleChange(event)}
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={inviteError.fName.status}
                          helperText={
                            inviteError.fName.status
                              ? inviteError.fName.message
                              : " "
                          }
                        ></TextField>
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <TextField
                          fullWidth
                          label="Middle Name"
                          margin="dense"
                          name="mName"
                          disabled={submitDisable}
                          value={formvalues.mName}
                          onChange={(event) => handleChange(event)}
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={inviteError.mName.status}
                          helperText={
                            inviteError.mName.status
                              ? inviteError.mName.message
                              : " "
                          }
                        ></TextField>
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          margin="dense"
                          name="lName"
                          disabled={submitDisable}
                          value={formvalues.lName}
                          onChange={(event) => handleChange(event)}
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={inviteError.lName.status}
                          helperText={
                            inviteError.lName.status
                              ? inviteError.lName.message
                              : " "
                          }
                        ></TextField>
                      </Grid>

                      <Grid item md={4} xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          margin="dense"
                          name="emailAddress"
                          required
                          disabled={
                            submitDisable ||
                            (patientData?.email !== "" &&
                              patientData?.email !== null)
                          }
                          value={formvalues.emailAddress}
                          onChange={(event) => handleChange(event)}
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={inviteError.emailAddress.status}
                          helperText={
                            inviteError.emailAddress.status
                              ? inviteError.emailAddress.message
                              : " "
                          }
                        ></TextField>
                      </Grid>

                      <Grid item md={4} xs={12}>
                        <MuiPhoneNumber
                          defaultCountry={"us"}
                          onlyCountries={["us"]}
                          disableAreaCodes={true}
                          fullWidth
                          countryCodeEditable={false}
                          disabled={submitDisable}
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={inviteError.phoneNumber.status}
                          helperText={
                            inviteError.phoneNumber.status
                              ? inviteError.phoneNumber.message
                              : " "
                          }
                          margin="dense"
                          label="Phone Number"
                          value={formvalues.phoneNumber}
                          name="phoneNumber"
                          onChange={handleChangePhone}
                          variant="standard"
                        />
                      </Grid>
                    </Grid>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "right",
                    }}
                  >
                    <Button
                      variant="contained"
                      className={classes.cancel}
                      onClick={() => {
                        if (formFilled) {
                          setOpenCancelBase(true);
                        } else {
                          handleClose();
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={confirmSubmission}
                      disabled={submitDisable || disableWhileEmailCheck}
                      startIcon={
                        showLoader ? (
                          <CircularProgress color="secondary" size={20} />
                        ) : (
                          ""
                        )
                      }
                    >
                      {showLoader ? "Sending Invitation" : "Send invitation"}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </Container>
        </div>
        {openBase && (
          <BaseModal
            open={openBase}
            confirmAction={submitHandler}
            onClose={() => {
              setOpenBase(false);
            }}
            title={translate("resources.invite.confirmTitle")}
            content={
              patientData?.__typename === "Dependent"
                ? translate("resources.invite.confirmMessageDependent")
                : translate("resources.invite.confirmMessagePatient")
            }
            successButtonName="Send"
          />
        )}
        {openSubmitBase && (
          <BaseModal
            open={openSubmitBase}
            confirmAction={() => {
              setOpenSubmitBase(false);
              setSubmitDisable(false);
              handleClose();
            }}
            onClose={() => {
              setOpenSubmitBase(false);
              setSubmitDisable(false);
              handleClose();
            }}
            title={
              formvalues.emailAddress +
              translate("resources.invite.submitTitle")
            }
            content={translate("resources.invite.submitMessage")}
            successButtonName="Okay, got it"
            type="success_info"
          />
        )}
        {openErrorBase && (
          <BaseModal
            open={openErrorBase}
            confirmAction={() => {
              setOpenErrorBase(false);
              setSubmitDisable(false);
            }}
            onClose={() => {
              setOpenErrorBase(false);
              setSubmitDisable(false);
            }}
            title={translate("resources.invite.errorTitle")}
            content={translate("resources.invite.errorMessage")}
            closeButtonName="Close"
            type="requestError"
          />
        )}
        {openAlreadyExistsErrorBase && (
          <BaseModal
            open={openAlreadyExistsErrorBase}
            confirmAction={() => {
              setOpenAlreadyExistsErrorBase(false);
              setSubmitDisable(false);
            }}
            onClose={() => {
              setOpenAlreadyExistsErrorBase(false);
              setSubmitDisable(false);
            }}
            title={translate("resources.invite.alreadyExistsTitle")}
            content={translate("resources.invite.alreadyExistsMessage")}
            successButtonName="Ok"
            type="alreadyExistInvite"
          />
        )}
        {openCancelBase && (
          <BaseModal
            open={openCancelBase}
            confirmAction={() => {
              setOpenCancelBase(false);
              if (patientData) {
                setFormValues((prevFormState) => ({
                  ...prevFormState,
                  fName: patientData.firstName,
                  mName: patientData.middleName,
                  lName: patientData.lastName,
                  emailAddress: patientData.email,
                  phoneNumber: patientData.phoneNumber,
                  userPartyId: patientData.id,
                }));
                setInviteError({
                  fName: {
                    status: false,
                    message: "",
                  },
                  mName: {
                    status: false,
                    message: "",
                  },
                  lName: {
                    status: false,
                    message: "",
                  },
                  emailAddress: {
                    status: false,
                    message: "",
                  },
                  phoneNumber: {
                    status: false,
                    message: "",
                  },
                  groupId: {
                    status: false,
                    message: "",
                  },
                  providerName: {
                    status: false,
                    message: "",
                  },
                });
              }
              setFormFilled(false);
              handleClose();
            }}
            onClose={() => {
              setOpenCancelBase(false);
            }}
            title={translate("resources.invite.cancelTitle")}
            content={translate("resources.invite.cancelMessage")}
            successButtonName="Yes"
            closeButtonName="No"
          />
        )}
      </Box>
    {/* </Modal> */}
    </StyledDiv>
  );
}

export default InvitePatient;
