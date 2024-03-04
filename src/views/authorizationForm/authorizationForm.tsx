import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Header } from "./header";
import { AuthorizationComponent } from "./../../components/authorizationComponent";
import { SignatureBox } from "./../../components/signature";
import Acknowledge from "../../components/acknowledge";
import BaseModal from "../../components/baseModal";
import type { IAlreadyLoggedIn, IAuthorizationProps } from "../../types/types";
import { useNavigate } from "react-router";
import { CO_NAME_GUEST, CO_ROLE_PATIENT } from "../../utils/roles";
import moment from "moment";
import UploadFile from "../../components/uploadFile";
import useAuthorizationForm from "../../hooks/useAuthorizationForm";
import {
  AUTHORIZATION_SERVICE_PROVIDERS_TYPE,
  FORM_CONTENT,
} from "../../utils/constants";
import useTraces from "../../hooks/useTraces";

const AuthorizationForm = ({
  formType,
  token,
}: IAuthorizationProps): JSX.Element => {
  const {
    useStyles,
    requestDetails,
    authTokenValidity,
    fileResponseHandler,
    alreadyLoggedIn,
    alreadyConfirmation,
    doLogin,
    bodyData,
    userInfo,
    setbodyData,
    getTitle,
    getRequestTokenByToken,
    setAlreadyLoggedIn,
    authTitle,
    requestToken,
    successAck,
    handleChange,
    showOther,
    handleValidateOnBlur,
    errorSet,
    toDisable,
    showProviderOther,
    authExpiresOrNot,
    disableAuthExpires,
    setRepresentative,
    getSign,
    onSubmit,
    errorsubmit,
    isLoading,
    patientRelationStatus,
    setpatientRelationStatus,
  } = useAuthorizationForm({ formType, token });
  const classes = useStyles();
  const navigate = useNavigate();
  const { getTrace } = useTraces();
  const today = moment(new Date()).format("YYYY-MM-DD");
  const [openBase, setOpenBase] = useState(false);
  const authForm = document.getElementById("authForm");
  useEffect(() => {
    if (formType === "hipaa") {
      if (authForm) {
        if (authForm.hidden === false) {
          getTrace("HIPAA form loaded", "ev-105", userInfo.email);
        }
      }
    } else {
      if (authForm) {
        if (authForm.hidden === false) {
          getTrace("SUD form loaded", "ev-109", userInfo.email);
        }
      }
    }
  }, [authForm]);
  useEffect(() => {
    if (alreadyLoggedIn.role === CO_ROLE_PATIENT) {
      getTitle();
      getRequestTokenByToken();
      setAlreadyLoggedIn((prevFormState: IAlreadyLoggedIn) => ({
        ...prevFormState,
        alreadyThere: false,
      }));
    } else {
      if (alreadyLoggedIn.userName === CO_NAME_GUEST) {
        setOpenBase(false);
        doLogin();
      } else {
        if (alreadyLoggedIn.alreadyThere) {
          setOpenBase(true);
        } else {
          setOpenBase(false);
          doLogin();
        }
      }
      localStorage.setItem("User", CO_NAME_GUEST);
    }
  }, []);

  useEffect(() => {
    if (formType === "hipaa") {
      setbodyData((prevFormState) => ({
        ...prevFormState,
        is_valid_after_death: true,
        authorization_expire_event: "",
        authorization_expire_date: "",
      }));
    } else {
      setbodyData((prevFormState) => ({
        ...prevFormState,
        is_valid_after_death: false,
      }));
    }
  }, [formType]);

  return (
    <Container>
      {alreadyLoggedIn.alreadyThere &&
      alreadyLoggedIn.role !== CO_ROLE_PATIENT ? (
        <>
          {alreadyConfirmation && (
            <BaseModal
              open={openBase}
              confirmAction={alreadyConfirmation}
              onClose={() => {
                setOpenBase(false);
                navigate("/");
              }}
              content={`${alreadyLoggedIn.userName} is already loggedin on this browser. If you continue, ${alreadyLoggedIn.userName} will disconnect. Do you want to continue?`}
              title="User Already Logged In"
              successButtonName="Continue"
            />
          )}
        </>
      ) : (
        <>
          {Object.entries(requestToken).length > 0 &&
            (requestToken.isFilled &&
            alreadyLoggedIn.role !== CO_ROLE_PATIENT ? (
              <Acknowledge type="ack_filled" />
            ) : (
              <>
                {authTokenValidity ? (
                  <>
                    {successAck && alreadyLoggedIn.role !== CO_ROLE_PATIENT ? (
                      <Acknowledge type="successfully_filled" />
                    ) : (
                      <div id="authForm">
                        <Grid
                          container
                          alignItems="flex-end"
                          justify="space-between"
                          style={{ marginTop: 50 }}
                        >
                          <Grid item>
                            <Header
                              title={FORM_CONTENT[formType].headerTitle}
                            />
                          </Grid>
                        </Grid>
                        <form>
                          <Card className={classes.root}>
                            <CardContent>
                              <Grid item md={12} xs={12}>
                                <Typography
                                  component="h2"
                                  gutterBottom
                                  variant="h5"
                                  className={classes.subHead}
                                >
                                  {FORM_CONTENT[formType].cardTitle}
                                </Typography>
                                <Divider />
                              </Grid>

                              <Grid
                                container
                                spacing={3}
                                style={{ marginTop: "5px" }}
                              >
                                <Grid item md={12} xs={12}>
                                  <Typography
                                    variant="h5"
                                    style={{
                                      fontSize: 15,
                                      margin: "13px 0",
                                      fontWeight: 600,
                                    }}
                                    gutterBottom
                                  >
                                    {FORM_CONTENT[formType].title}
                                  </Typography>
                                  <Grid item md={12} xs={12}>
                                    <InputLabel
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "13px",
                                      }}
                                    >
                                      1. This authorization applies to the
                                      following information:
                                    </InputLabel>
                                    <Grid
                                      item
                                      md={12}
                                      xs={12}
                                      style={{
                                        display: "inline-flex",
                                        width: "100%",
                                      }}
                                    >
                                      <TextField
                                        style={{ width: "100%" }}
                                        fullWidth
                                        label="Authorization Title"
                                        margin="dense"
                                        name="authorization_title"
                                        required
                                        onChange={handleChange}
                                        select
                                        SelectProps={{ native: true }}
                                        value={bodyData.authorization_title}
                                        variant="standard"
                                      >
                                        {Object.entries(authTitle).length >
                                          0 && (
                                          <>
                                            {authTitle.map((option) => (
                                              <option
                                                key={option.id}
                                                value={option.id}
                                              >
                                                {option.value}
                                              </option>
                                            ))}
                                          </>
                                        )}
                                      </TextField>
                                      {showOther && (
                                        <TextField
                                          fullWidth
                                          margin="dense"
                                          label="Please Specify"
                                          name="authorization_others"
                                          onChange={handleChange}
                                          required
                                          onBlur={(e) =>
                                            handleValidateOnBlur(e)
                                          }
                                          error={
                                            errorSet.authorization_others[0]
                                          }
                                          helperText={
                                            errorSet.authorization_others[0]
                                              ? errorSet.authorization_others[1]
                                              : " "
                                          }
                                          value={bodyData.authorization_others}
                                          variant="standard"
                                        />
                                      )}
                                    </Grid>

                                    <Grid
                                      item
                                      md={12}
                                      xs={12}
                                      style={{
                                        display: "inline-flex",
                                        width: "100%",
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        margin="dense"
                                        label="Time Period From"
                                        name="time_period_from"
                                        type="date"
                                        onChange={handleChange}
                                        value={bodyData.time_period_from}
                                        required
                                        variant="standard"
                                        onBlur={(e) => handleValidateOnBlur(e)}
                                        error={errorSet.time_period_from[0]}
                                        helperText={
                                          errorSet.time_period_from[0]
                                            ? errorSet.time_period_from[1]
                                            : " "
                                        }
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        inputProps={{
                                          max: bodyData.time_period_to
                                            ? bodyData.time_period_to < today
                                              ? bodyData.time_period_to
                                              : today
                                            : today,
                                        }}
                                      />

                                      <TextField
                                        fullWidth
                                        margin="dense"
                                        label="Time Period To"
                                        name="time_period_to"
                                        onChange={handleChange}
                                        value={bodyData.time_period_to}
                                        disabled={toDisable}
                                        required
                                        type="date"
                                        variant="standard"
                                        onBlur={(e) => handleValidateOnBlur(e)}
                                        error={errorSet.time_period_to[0]}
                                        helperText={
                                          errorSet.time_period_to[0]
                                            ? errorSet.time_period_to[1]
                                            : " "
                                        }
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        inputProps={{
                                          min: bodyData.time_period_from,
                                          max: today,
                                        }}
                                      />
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                      <InputLabel
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "13px",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        2. {FORM_CONTENT[formType].formfield2}
                                      </InputLabel>
                                      <Grid
                                        item
                                        md={12}
                                        xs={12}
                                        style={{
                                          display: "inline-flex",
                                          width: "100%",
                                        }}
                                      >
                                        {formType === "hipaa" ? (
                                          <div>
                                            <TextField
                                              fullWidth
                                              margin="dense"
                                              style={{
                                                paddingBottom: "20px",
                                              }}
                                              label={
                                                FORM_CONTENT[formType]
                                                  .formField2Label
                                              }
                                              name="authorization_service_providers_type"
                                              required
                                              variant="standard"
                                              select
                                              value={
                                                bodyData.authorization_service_providers_type
                                              }
                                              onChange={handleChange}
                                              SelectProps={{
                                                native: true,
                                              }}
                                            >
                                              {Object.entries(
                                                AUTHORIZATION_SERVICE_PROVIDERS_TYPE,
                                              ).length > 0 && (
                                                <>
                                                  {AUTHORIZATION_SERVICE_PROVIDERS_TYPE.map(
                                                    (option) => (
                                                      <option
                                                        key={option.id}
                                                        value={option.id}
                                                      >
                                                        {option.value}
                                                      </option>
                                                    ),
                                                  )}
                                                </>
                                              )}
                                            </TextField>
                                            {showProviderOther && (
                                              <TextField
                                                margin="dense"
                                                fullWidth
                                                label="Please Specify Authorization Service Providers"
                                                name="authorization_service_providers_others"
                                                onChange={handleChange}
                                                required
                                                onBlur={(e) =>
                                                  handleValidateOnBlur(e)
                                                }
                                                error={
                                                  errorSet
                                                    .authorization_service_providers_others[0]
                                                }
                                                helperText={
                                                  errorSet
                                                    .authorization_service_providers_others[0]
                                                    ? errorSet
                                                        .authorization_service_providers_others[1]
                                                    : " "
                                                }
                                                value={
                                                  bodyData.authorization_service_providers_others
                                                }
                                                variant="standard"
                                              />
                                            )}
                                          </div>
                                        ) : (
                                          <TextField
                                            fullWidth
                                            margin="dense"
                                            label={
                                              FORM_CONTENT[formType]
                                                .formField2Label
                                            }
                                            name="disorder_treatment_program"
                                            value={
                                              bodyData.disorder_treatment_program
                                            }
                                            onBlur={(e) =>
                                              handleValidateOnBlur(e)
                                            }
                                            error={
                                              errorSet
                                                .disorder_treatment_program[0]
                                            }
                                            helperText={
                                              errorSet
                                                .disorder_treatment_program[0]
                                                ? errorSet
                                                    .disorder_treatment_program[1]
                                                : " "
                                            }
                                            required
                                            variant="standard"
                                            onChange={handleChange}
                                          ></TextField>
                                        )}
                                      </Grid>
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                      <InputLabel
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "13px",
                                        }}
                                      >
                                        3. {FORM_CONTENT[formType].formField3}
                                      </InputLabel>
                                      <TextField
                                        fullWidth
                                        margin="dense"
                                        label="Receive Person"
                                        name="receive_person"
                                        onChange={handleChange}
                                        required
                                        onBlur={(e) => handleValidateOnBlur(e)}
                                        error={errorSet.receive_person[0]}
                                        helperText={
                                          errorSet.receive_person[0]
                                            ? errorSet.receive_person[1]
                                            : " "
                                        }
                                        value={bodyData.receive_person}
                                        variant="standard"
                                      />
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                      <InputLabel
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "13px",
                                        }}
                                      >
                                        4. Purpose of proposed use or
                                        disclosure:
                                      </InputLabel>
                                      <TextField
                                        fullWidth
                                        margin="dense"
                                        label="Purpose"
                                        name="purpose"
                                        onChange={handleChange}
                                        required
                                        onBlur={(e) => handleValidateOnBlur(e)}
                                        error={errorSet.purpose[0]}
                                        helperText={
                                          errorSet.purpose[0]
                                            ? errorSet.purpose[1]
                                            : " "
                                        }
                                        value={bodyData.purpose}
                                        variant="standard"
                                      />
                                    </Grid>
                                    {formType === "hipaa" ? (
                                      <div>
                                        <Grid item md={12} xs={12}>
                                          <InputLabel
                                            style={{
                                              fontWeight: "bold",
                                              fontSize: "14px",
                                              display: "inline-flex",
                                            }}
                                          >
                                            <RadioGroup
                                              aria-label="quiz"
                                              name="authExpiresOrNot"
                                              value={authExpiresOrNot}
                                              style={{
                                                fontWeight: "bold",
                                                fontSize: "14px",
                                                display: "inline",
                                              }}
                                              onChange={handleChange}
                                            >
                                              5.
                                              <FormControlLabel
                                                value="is_valid_after_death"
                                                classes={{
                                                  label: classes.label,
                                                  root: classes.rootLabel,
                                                }}
                                                control={
                                                  <Radio color="primary" />
                                                }
                                                label="This authorization does not expire & is valid until after my death."
                                              />
                                              {"  "}
                                              <span
                                                style={{
                                                  color: "#888",
                                                  marginLeft: "5px",
                                                }}
                                              >
                                                OR
                                              </span>
                                              <FormControlLabel
                                                value="authExpires"
                                                classes={{
                                                  label: classes.label,
                                                  root: classes.rootLabel,
                                                }}
                                                control={
                                                  <Radio color="primary" />
                                                }
                                                label=" This authorization expires [Insert a date or event on which the authorization will expire]:"
                                              />
                                            </RadioGroup>
                                          </InputLabel>
                                        </Grid>
                                        <Grid
                                          item
                                          md={12}
                                          xs={12}
                                          style={{
                                            display: "inline-flex",
                                            width: "100%",
                                          }}
                                        >
                                          <TextField
                                            fullWidth
                                            margin="dense"
                                            disabled={disableAuthExpires}
                                            label="Authorization Expire Event"
                                            name="authorization_expire_event"
                                            onChange={handleChange}
                                            required
                                            onBlur={(e) =>
                                              handleValidateOnBlur(e)
                                            }
                                            error={
                                              errorSet
                                                .authorization_expire_event[0]
                                            }
                                            helperText={
                                              errorSet
                                                .authorization_expire_event[0]
                                                ? errorSet
                                                    .authorization_expire_event[1]
                                                : " "
                                            }
                                            value={
                                              bodyData.authorization_expire_event
                                            }
                                            variant="standard"
                                          />
                                          <TextField
                                            fullWidth
                                            margin="dense"
                                            disabled={disableAuthExpires}
                                            label="Authorization Expire Date"
                                            name="authorization_expire_date"
                                            onChange={handleChange}
                                            required
                                            value={
                                              bodyData.authorization_expire_date
                                            }
                                            onBlur={(e) =>
                                              handleValidateOnBlur(e)
                                            }
                                            error={
                                              errorSet
                                                .authorization_expire_date[0]
                                            }
                                            helperText={
                                              errorSet
                                                .authorization_expire_date[0]
                                                ? errorSet
                                                    .authorization_expire_date[1]
                                                : " "
                                            }
                                            variant="standard"
                                            type="date"
                                            InputLabelProps={{
                                              shrink: true,
                                            }}
                                            inputProps={{ min: today }}
                                          />
                                        </Grid>
                                      </div>
                                    ) : (
                                      <div>
                                        <Grid item md={12} xs={12}>
                                          <InputLabel
                                            style={{
                                              fontWeight: "bold",
                                              fontSize: "13px",
                                            }}
                                          >
                                            5. This authorization expires
                                            [Insert a date or event on which the
                                            authorization will expire.]:
                                          </InputLabel>
                                        </Grid>
                                        <Grid
                                          item
                                          md={12}
                                          xs={12}
                                          style={{
                                            display: "inline-flex",
                                            width: "100%",
                                          }}
                                        >
                                          <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Authorization Expire Event"
                                            name="authorization_expire_event"
                                            onChange={handleChange}
                                            required
                                            onBlur={(e) =>
                                              handleValidateOnBlur(e)
                                            }
                                            error={
                                              errorSet
                                                .authorization_expire_event[0]
                                            }
                                            helperText={
                                              errorSet
                                                .authorization_expire_event[0]
                                                ? errorSet
                                                    .authorization_expire_event[1]
                                                : " "
                                            }
                                            value={
                                              bodyData.authorization_expire_event
                                            }
                                            variant="standard"
                                          />
                                          <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Authorization Expire Date"
                                            name="authorization_expire_date"
                                            onChange={handleChange}
                                            required
                                            onBlur={(e) =>
                                              handleValidateOnBlur(e)
                                            }
                                            error={
                                              errorSet
                                                .authorization_expire_date[0]
                                            }
                                            helperText={
                                              errorSet
                                                .authorization_expire_date[0]
                                                ? errorSet
                                                    .authorization_expire_date[1]
                                                : " "
                                            }
                                            value={
                                              bodyData.authorization_expire_date
                                            }
                                            variant="standard"
                                            type="date"
                                            InputLabelProps={{
                                              shrink: true,
                                            }}
                                            inputProps={{ min: today }}
                                          />
                                        </Grid>
                                      </div>
                                    )}
                                    <Grid>
                                      <AuthorizationComponent
                                        requestDetails={requestDetails}
                                        setRepresentative={setRepresentative}
                                        patientRelationStatus={
                                          patientRelationStatus
                                        }
                                        setpatientRelationStatus={
                                          setpatientRelationStatus
                                        }
                                      />
                                    </Grid>
                                    {formType === "hipaa" && (
                                      <>
                                        <Grid
                                          item
                                          md={12}
                                          style={{ paddingTop: "16px" }}
                                          xs={12}
                                        >
                                          <InputLabel
                                            style={{
                                              fontWeight: "bold",
                                              paddingBottom: "10px",
                                            }}
                                          >
                                            Legal ID :
                                          </InputLabel>
                                        </Grid>
                                        <Grid
                                          item
                                          md={6}
                                          style={{ marginBottom: "20px" }}
                                          xs={12}
                                          className="attachmentContainer"
                                        >
                                          <InputLabel>
                                            Please upload Legal ID here:
                                            <sup>*</sup>{" "}
                                          </InputLabel>
                                          <UploadFile
                                            name="legal_id"
                                            fileResponse={fileResponseHandler}
                                            description=""
                                          />
                                        </Grid>
                                      </>
                                    )}
                                    <Grid
                                      item
                                      xs={12}
                                      md={12}
                                      lg={6}
                                      //style={{ display: "inline-flex" }}
                                    >
                                      <SignatureBox getSign={getSign} />
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </CardContent>
                            <Divider />
                            <CardActions>
                              <Button
                                onClick={() => onSubmit()}
                                color="primary"
                                variant="contained"
                              >
                                Submit Form
                              </Button>
                              {errorsubmit.status && (
                                <Typography
                                  style={{
                                    color: "red",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {errorsubmit.message}
                                </Typography>
                              )}
                              {isLoading && (
                                <div className="loader-container">
                                  <div className="loader">Loading...</div>
                                </div>
                              )}
                            </CardActions>
                          </Card>
                        </form>
                      </div>
                    )}
                  </>
                ) : (
                  <Acknowledge type="invalid_token" />
                )}
              </>
            ))}{" "}
        </>
      )}
    </Container>
  );
};

export default AuthorizationForm;
