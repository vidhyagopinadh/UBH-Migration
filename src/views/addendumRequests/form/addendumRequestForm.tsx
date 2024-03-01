import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router";
// import {
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   Container,
//   Divider,
//   Grid,
//   InputLabel,
//   List,
//   ListItem,
//   Typography,
// } from "@material-ui/core";
import { SignatureBox } from "../../../components/signature";
import { tommddyyyy } from "../../../utils/dateFormator";
import Acknowledge from "../../../components/acknowledge";
import BaseModal from "../../../components/baseModal";
// import type {
//   IAddendumRequestFormProps,
//   IAlreadyLoggedIn,
// } from "../../../types";
import { CO_NAME_GUEST, CO_ROLE_PATIENT } from "../../../utils/roles";
import useAddendumForm from "../../../hooks/useAddendumForm";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  InputLabel,
  List,
  ListItem,
  Typography,
} from "@mui/material";

function AddendumRequestForm({ id }: IAddendumRequestFormProps): JSX.Element {
  const {
    useStyles,
    alreadyLoggedIn,
    userInfo,
    doLogin,
    requestViewList,
    onSubmit,
    alreadyConfirmation,
    getSign,
    getTrace,
    successAck,
    setAlreadyLoggedIn,
    getRequestViewsPatient,
    error,
  } = useAddendumForm({ id });
  const classes = useStyles();
  const navigate = useNavigate();
  const [openBase, setOpenBase] = useState(false);
  const addendumForm = document.getElementById("addendumForm");
  useEffect(() => {
    if (addendumForm) {
      if (addendumForm.hidden === false) {
        getTrace("Addendum Form Loaded", "ev-115", userInfo.email);
      }
    }
  }, [addendumForm]);

  useEffect(() => {
    if (alreadyLoggedIn.role === CO_ROLE_PATIENT) {
      setAlreadyLoggedIn((prevFormState: IAlreadyLoggedIn) => ({
        ...prevFormState,
        alreadyThere: false,
      }));
      getRequestViewsPatient();
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

  return (
    <Container>
      {alreadyLoggedIn.alreadyThere &&
      alreadyLoggedIn.role !== CO_ROLE_PATIENT ? (
        <>
          {openBase && (
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
          {Object.entries(requestViewList).length > 0 &&
            (requestViewList.signatureId &&
            alreadyLoggedIn.role !== CO_ROLE_PATIENT ? (
              <Acknowledge type="request_signed" />
            ) : (
              <>
                {successAck ? (
                  <Acknowledge type="successfully_signed" />
                ) : (
                  <div id="addendumForm">
                    <Grid
                      alignItems="flex-end"
                      container
                      justifyContent="space-between"
                      spacing={3}
                    >
                      <Grid item>
                        <Typography
                          component="h1"
                          variant="h5"
                          style={{
                            fontWeight: 600,
                            marginTop: "20px",
                            marginBottom: "20px",
                          }}
                        >
                          Addendum Request Form
                        </Typography>
                      </Grid>
                    </Grid>
                    <form autoComplete="off" noValidate>
                      <Card className={clsx(classes.root)}>
                        <CardContent>
                          <Grid item md={12} xs={12}>
                            <Typography
                              component="h2"
                              gutterBottom
                              variant="h5"
                              className={classes.subHead}
                            >
                              REQUEST TO AMEND MY PROTECTED HEALTH INFORMATION
                            </Typography>
                            <Divider />
                          </Grid>
                          {Object.entries(requestViewList).length > 0 && (
                            <>
                              <Typography
                                variant="subtitle1"
                                style={{
                                  width: "98%",
                                  padding: "8px 9px",
                                  color: "rgb(135, 135, 135)",
                                  border: "1px solid #718cc7",
                                  borderRadius: "5px",
                                  background: "aliceblue",
                                  fontWeight: 600,
                                  marginTop: "5px",
                                }}
                              >
                                {`Requested by`}
                                <b
                                  style={{
                                    color: "#718cc7",
                                  }}
                                >
                                  {` ${requestViewList.createdfname} ${requestViewList.createdlastname}`}
                                </b>
                              </Typography>
                            </>
                          )}
                          <Grid
                            container
                            spacing={3}
                            style={{ marginTop: "5px" }}
                          >
                            <Grid item md={12} xs={12}>
                              <Grid item md={12} xs={12}>
                                <InputLabel
                                  style={{
                                    fontSize: "14px",
                                    padding: "0",
                                    lineHeight: "1.6",
                                  }}
                                >
                                  I{" "}
                                  <b
                                    style={{
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {`${requestViewList.firstName} ${
                                      requestViewList.middleName
                                        ? requestViewList.middleName
                                        : ""
                                    } ${requestViewList.lastName}`}
                                  </b>
                                  , request a change to my record(s) for my
                                  visit to <b>{requestViewList.provider}</b>{" "}
                                  {`(Physician)`},
                                  <b>{requestViewList.sourceinstitutionname}</b>{" "}
                                  {`(Clinic)`},
                                  <b>{requestViewList.departmentname}</b>{" "}
                                  {` (Department)`} on the following date(s) of
                                  service:{" "}
                                  <b>
                                    {`${tommddyyyy(
                                      requestViewList.servicedDate
                                    )}`}
                                  </b>
                                  .
                                </InputLabel>

                                <List>
                                  <ListItem
                                    className={classes.listitemStyle}
                                    disableGutters
                                  >
                                    <Typography
                                      className={classes.contentText1}
                                    >
                                      I request the following change to be made:
                                      &nbsp;
                                    </Typography>
                                    <Typography
                                      variant="subtitle2"
                                      className={classes.subtitle}
                                    >
                                      {requestViewList.changeRequest}
                                    </Typography>
                                  </ListItem>
                                  <ListItem
                                    className={classes.listitemStyle}
                                    disableGutters
                                  >
                                    <Typography
                                      className={classes.contentText1}
                                    >
                                      I request the change because: &nbsp;
                                    </Typography>
                                    <Typography
                                      variant="subtitle2"
                                      className={classes.subtitle}
                                    >
                                      {requestViewList.reason}
                                    </Typography>
                                  </ListItem>
                                </List>

                                <Typography
                                  component="h2"
                                  gutterBottom
                                  variant="h5"
                                  className={classes.subHead}
                                >
                                  <b>Patient Information:</b>The individual
                                  whose information is to requested to be
                                  corrected/amended
                                </Typography>
                                <Divider />
                                <List>
                                  {requestViewList.mrn && (
                                    <ListItem
                                      className={classes.listitemStyle}
                                      disableGutters
                                    >
                                      <Typography
                                        className={classes.contentText1}
                                      >
                                        MRN: &nbsp;
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        className={classes.subtitle}
                                      >
                                        {requestViewList.mrn}
                                      </Typography>
                                    </ListItem>
                                  )}
                                  <ListItem
                                    className={classes.listitemStyle}
                                    disableGutters
                                  >
                                    <Grid
                                      item
                                      md={12}
                                      xs={12}
                                      style={{
                                        display: "inline-flex",
                                        width: "100%",
                                      }}
                                    >
                                      <Grid item md={4} xs={12}>
                                        <Typography
                                          className={classes.contentText1}
                                        >
                                          First Name: &nbsp;
                                        </Typography>
                                        <Typography
                                          variant="subtitle2"
                                          className={classes.subtitle}
                                        >
                                          {requestViewList.firstName}
                                        </Typography>
                                      </Grid>
                                      <Grid item md={3} xs={12}>
                                        <Typography
                                          className={classes.contentText1}
                                        >
                                          Middle Name: &nbsp;
                                        </Typography>
                                        <Typography
                                          variant="subtitle2"
                                          className={classes.subtitle}
                                        >
                                          {requestViewList.middleName
                                            ? requestViewList.middleName
                                            : ""}
                                        </Typography>
                                      </Grid>
                                      <Grid item md={3} xs={12}>
                                        <Typography
                                          className={classes.contentText1}
                                        >
                                          Last Name: &nbsp;
                                        </Typography>
                                        <Typography
                                          variant="subtitle2"
                                          className={classes.subtitle}
                                        >
                                          {requestViewList.lastName}
                                        </Typography>
                                      </Grid>
                                      {requestViewList.suffix && (
                                        <Grid item md={2} xs={12}>
                                          <Typography
                                            className={classes.contentText1}
                                          >
                                            Suffix: &nbsp;
                                          </Typography>
                                          <Typography
                                            variant="subtitle2"
                                            className={classes.subtitle}
                                          >
                                            {requestViewList.suffix
                                              ? requestViewList.suffix
                                              : ""}
                                          </Typography>
                                        </Grid>
                                      )}
                                    </Grid>
                                    {requestViewList.previousName.trim() && (
                                      <Grid
                                        item
                                        md={12}
                                        xs={12}
                                        style={{
                                          display: "inline-flex",
                                          width: "100%",
                                        }}
                                      >
                                        <Grid item md={12} xs={12}>
                                          <Typography
                                            className={classes.contentText1}
                                          >
                                            Previous Name: &nbsp;
                                          </Typography>
                                          <Typography
                                            variant="subtitle2"
                                            className={classes.subtitle}
                                          >
                                            {requestViewList.previousName}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    )}
                                  </ListItem>
                                  <ListItem
                                    className={classes.listitemStyle}
                                    disableGutters
                                  >
                                    <Grid
                                      item
                                      md={12}
                                      xs={12}
                                      style={{
                                        display: "inline-flex",
                                        width: "100%",
                                      }}
                                    >
                                      <Grid item md={4} xs={12}>
                                        <Typography
                                          className={classes.contentText1}
                                        >
                                          Email: &nbsp;
                                        </Typography>
                                        <Typography
                                          variant="subtitle2"
                                          className={classes.subtitle}
                                        >
                                          {requestViewList.electronicDetails}
                                        </Typography>
                                      </Grid>
                                      <Grid item md={3} xs={12}>
                                        <Typography
                                          className={classes.contentText1}
                                        >
                                          Date of Birth: &nbsp;
                                        </Typography>
                                        <Typography
                                          variant="subtitle2"
                                          className={classes.subtitle}
                                        >
                                          {`${tommddyyyy(
                                            requestViewList.birthDate
                                          )}`}
                                        </Typography>
                                      </Grid>
                                      <Grid item md={3} xs={12}>
                                        <Typography
                                          className={classes.contentText1}
                                        >
                                          Phone Number: &nbsp;
                                        </Typography>
                                        <Typography
                                          variant="subtitle2"
                                          className={classes.subtitle}
                                        >
                                          {requestViewList.phoneNumber}
                                        </Typography>
                                      </Grid>
                                      {requestViewList.ssn && (
                                        <Grid item md={2} xs={12}>
                                          <Typography
                                            className={classes.contentText1}
                                          >
                                            SSN: &nbsp;
                                          </Typography>
                                          <Typography
                                            variant="subtitle2"
                                            className={classes.subtitle}
                                          >
                                            {requestViewList.ssn.slice(0, 3) +
                                              "-" +
                                              requestViewList.ssn.slice(3, 5) +
                                              "-" +
                                              requestViewList.ssn.slice(5)}
                                          </Typography>
                                        </Grid>
                                      )}
                                    </Grid>
                                  </ListItem>
                                </List>
                                <ListItem
                                  className={classes.listitemStyle}
                                  disableGutters
                                >
                                  <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    style={{
                                      display: "inline-flex",
                                      width: "100%",
                                    }}
                                  >
                                    <Grid item md={4} xs={12}>
                                      <Typography
                                        className={classes.contentText1}
                                      >
                                        Preferred Language: &nbsp;
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        className={classes.subtitle}
                                      >
                                        {requestViewList.preferredLanguageValue}
                                      </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12}>
                                      <Typography
                                        className={classes.contentText1}
                                      >
                                        Preferred Pronouns: &nbsp;
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        className={classes.subtitle}
                                      >
                                        {requestViewList.preferredPronouns}
                                      </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12}>
                                      <Typography
                                        className={classes.contentText1}
                                      >
                                        Sex Assigned at Birth: &nbsp;
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        className={classes.subtitle}
                                      >
                                        {JSON.parse(requestViewList.sex).other
                                          ? JSON.parse(requestViewList.sex)
                                              .other_value
                                          : JSON.parse(requestViewList.sex)
                                              .value}
                                      </Typography>
                                    </Grid>
                                    <Grid item md={2} xs={12}>
                                      <Typography
                                        className={classes.contentText1}
                                      >
                                        Gender: &nbsp;
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        className={classes.subtitle}
                                      >
                                        {JSON.parse(requestViewList.gender)
                                          .other
                                          ? JSON.parse(requestViewList.gender)
                                              .other_value
                                          : JSON.parse(requestViewList.gender)
                                              .value}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </ListItem>

                                <Grid
                                  item
                                  md={12}
                                  xs={12}
                                  style={{
                                    display: "inline-flex",
                                    width: "100%",
                                  }}
                                >
                                  <Typography
                                    style={{
                                      fontSize: 14,
                                      fontWeight: "bold",
                                      position: "absolute",
                                      marginTop: "5px",
                                      color: "#333",
                                    }}
                                    gutterBottom
                                  >
                                    Address
                                  </Typography>

                                  <List
                                    style={{
                                      display: "inline-flex",
                                      width: "100%",
                                      marginTop: "20px",
                                    }}
                                  >
                                    <Grid
                                      item
                                      md={12}
                                      xs={12}
                                      style={{
                                        display: "inline-flex",
                                        width: "100%",
                                      }}
                                    >
                                      <ListItem
                                        className={classes.listitemStyle}
                                        disableGutters
                                      >
                                        <Typography
                                          className={classes.contentText1}
                                        >
                                          Address line 1: &nbsp;
                                        </Typography>
                                        <Typography
                                          variant="subtitle2"
                                          className={classes.subtitle}
                                        >
                                          {requestViewList.addressLine1}
                                        </Typography>
                                      </ListItem>
                                      {requestViewList.addressLine2 && (
                                        <>
                                          <ListItem
                                            className={classes.listitemStyle}
                                          >
                                            <Typography variant="subtitle1">
                                              Address line 2: &nbsp;
                                            </Typography>
                                            <Typography
                                              variant="subtitle2"
                                              className={classes.subtitle}
                                            >{`${requestViewList.addressLine2}`}</Typography>
                                          </ListItem>
                                          <Divider />
                                        </>
                                      )}
                                      <ListItem
                                        className={classes.listitemStyle}
                                        disableGutters
                                      >
                                        <Typography
                                          className={classes.contentText1}
                                        >
                                          City: &nbsp;
                                        </Typography>
                                        <Typography
                                          variant="subtitle2"
                                          className={classes.subtitle}
                                        >
                                          {requestViewList.city}
                                        </Typography>
                                      </ListItem>
                                      <ListItem
                                        className={classes.listitemStyle}
                                        disableGutters
                                      >
                                        <Typography
                                          className={classes.contentText1}
                                        >
                                          State: &nbsp;
                                        </Typography>
                                        <Typography
                                          variant="subtitle2"
                                          className={classes.subtitle}
                                        >
                                          {requestViewList.state}
                                        </Typography>
                                      </ListItem>
                                      <ListItem
                                        className={classes.listitemStyle}
                                        disableGutters
                                      >
                                        <Typography
                                          className={classes.contentText1}
                                        >
                                          Country: &nbsp;
                                        </Typography>
                                        <Typography
                                          variant="subtitle2"
                                          className={classes.subtitle}
                                        >
                                          {requestViewList.country}
                                        </Typography>
                                      </ListItem>
                                      <ListItem
                                        className={classes.listitemStyle}
                                        disableGutters
                                      >
                                        <Typography
                                          className={classes.contentText1}
                                        >
                                          Zip Code: &nbsp;
                                        </Typography>
                                        <Typography
                                          variant="subtitle2"
                                          className={classes.subtitle}
                                        >
                                          {requestViewList.addressZip}
                                        </Typography>
                                      </ListItem>
                                    </Grid>
                                  </List>
                                </Grid>
                              </Grid>
                            </Grid>
                            {JSON.parse(requestViewList.previousAddress)
                              .is_previous_address && (
                              <Grid
                                item
                                md={12}
                                xs={12}
                                style={{
                                  display: "inline-flex",
                                  width: "100%",
                                }}
                              >
                                <Typography
                                  style={{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    position: "absolute",
                                    marginTop: "5px",
                                    color: "#333",
                                  }}
                                  gutterBottom
                                >
                                  Previous Address
                                </Typography>

                                <List
                                  style={{
                                    display: "inline-flex",
                                    width: "100%",
                                    marginTop: "20px",
                                  }}
                                >
                                  <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    style={{
                                      display: "inline-flex",
                                      width: "100%",
                                    }}
                                  >
                                    <ListItem
                                      className={classes.listitemStyle}
                                      disableGutters
                                    >
                                      <Typography
                                        className={classes.contentText1}
                                      >
                                        Address line 1: &nbsp;
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        className={classes.subtitle}
                                      >
                                        {
                                          JSON.parse(
                                            requestViewList.previousAddress
                                          ).previous_address1
                                        }
                                      </Typography>
                                    </ListItem>
                                    {JSON.parse(requestViewList.previousAddress)
                                      .previous_address2 && (
                                      <>
                                        <ListItem
                                          className={classes.listitemStyle}
                                        >
                                          <Typography variant="subtitle1">
                                            Address line 2: &nbsp;
                                          </Typography>
                                          <Typography
                                            variant="subtitle2"
                                            className={classes.subtitle}
                                          >{`${
                                            JSON.parse(
                                              requestViewList.previousAddress
                                            ).previous_address2
                                          }`}</Typography>
                                        </ListItem>
                                        <Divider />
                                      </>
                                    )}
                                    <ListItem
                                      className={classes.listitemStyle}
                                      disableGutters
                                    >
                                      <Typography
                                        className={classes.contentText1}
                                      >
                                        City: &nbsp;
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        className={classes.subtitle}
                                      >
                                        {
                                          JSON.parse(
                                            requestViewList.previousAddress
                                          ).previous_city
                                        }
                                      </Typography>
                                    </ListItem>
                                    <ListItem
                                      className={classes.listitemStyle}
                                      disableGutters
                                    >
                                      <Typography
                                        className={classes.contentText1}
                                      >
                                        State: &nbsp;
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        className={classes.subtitle}
                                      >
                                        {
                                          JSON.parse(
                                            requestViewList.previousAddress
                                          ).previous_state
                                        }
                                      </Typography>
                                    </ListItem>
                                    <ListItem
                                      className={classes.listitemStyle}
                                      disableGutters
                                    >
                                      <Typography
                                        className={classes.contentText1}
                                      >
                                        Country: &nbsp;
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        className={classes.subtitle}
                                      >
                                        {
                                          JSON.parse(
                                            requestViewList.previousAddress
                                          ).previous_country
                                        }
                                      </Typography>
                                    </ListItem>
                                    <ListItem
                                      className={classes.listitemStyle}
                                      disableGutters
                                    >
                                      <Typography
                                        className={classes.contentText1}
                                      >
                                        Zip Code: &nbsp;
                                      </Typography>
                                      <Typography
                                        variant="subtitle2"
                                        className={classes.subtitle}
                                      >
                                        {
                                          JSON.parse(
                                            requestViewList.previousAddress
                                          ).previous_zip
                                        }
                                      </Typography>
                                    </ListItem>
                                  </Grid>
                                </List>
                              </Grid>
                            )}
                            <Grid item md={12} xs={12}>
                              <Grid
                                item
                                md={6}
                                style={{
                                  marginTop: "35px",
                                  float: "right",
                                }}
                                xs={12}
                              >
                                <div
                                  style={{
                                    position: "relative",
                                    width: "500px",
                                  }}
                                >
                                  <SignatureBox getSign={getSign} />
                                </div>
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
                          {error.status && (
                            <Typography
                              style={{
                                color: "red",
                                textTransform: "capitalize",
                              }}
                            >
                              {error.message}
                            </Typography>
                          )}
                        </CardActions>
                      </Card>
                    </form>
                  </div>
                )}
              </>
            ))}
        </>
      )}
    </Container>
  );
}

export default AddendumRequestForm;
