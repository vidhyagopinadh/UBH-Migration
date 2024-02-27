import type { BaseSyntheticEvent } from "react";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Typography,
  colors,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
} from "@material-ui/core";
import MuiPhoneNumber from "material-ui-phone-number";
import {
  validatePhone,
  validateString,
  validateSentance,
} from "../../../utils/validator";
import { AddCircle, Cancel } from "@material-ui/icons";
import CardHeader from "./../../../components/cardHeader";
import type { IAddContactProps, IDoctorDetails } from "../../../types";
import { useTranslate } from "react-admin";

const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(0, 2),
    maxWidth: 720,
    margin: "0 auto",
  },
  helperText: {
    textAlign: "right",
    marginRight: 0,
  },
  author: {
    margin: theme.spacing(4, 0),
    display: "flex",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  actions: {
    backgroundColor: colors.grey[100],
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
  applyButton: {
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    "&:hover": {
      backgroundColor: colors.green[900],
    },
  },
  addButton: {
    borderRadius: "unset",
    float: "right",
    padding: "0px",
    textTransform: "none",
    backgroundColor: theme.palette.primary.light,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

function DoctorDetails({ getContact }: IAddContactProps): JSX.Element {
  const classes = useStyles();
  const translate = useTranslate();
  const handleRemove = (i): void => {
    const values = [...contactCount];
    values.splice(i, 1);
    setcontactCount(values);
    getContact(values);
  };
  const [contactCount, setcontactCount] = useState<IDoctorDetails[]>([
    {
      name: "",
      institution: "",
      address: "",
      phone: "",
      error: {
        name: {
          status: false,
          message: "",
        },
        institution: {
          status: false,
          message: "",
        },
        address: {
          status: false,
          message: "",
        },
        phone: {
          status: false,
          message: "",
        },
      },
    },
  ]);

  const [addError, setAddError] = useState(false);

  const handleValidateOnBlur = (
    event: BaseSyntheticEvent,
    id: number,
  ): void => {
    event.persist();
    let validationStatus: boolean;
    if (event.target.type === "tel") {
      if (event.target.value === "+1") {
        validationStatus = true;
        setError(event.target.name, "", false, id);
      } else {
        validationStatus = false;
      }
    } else if (event.target.type !== "checkbox") {
      validationStatus = !event.target.value;
    }
    if (!validationStatus) {
      switch (event.target.name) {
        case "phone": {
          const valid = validatePhone(event.target.value);
          setError(
            event.target.name,
            !valid && "Invalid phone number",
            !valid,
            id,
          );
          break;
        }
        case "name": {
          const valid = validateString(event.target.value);
          setError(event.target.name, !valid && "Invalid name", !valid, id);
          break;
        }
        case "institution": {
          const valid = validateString(event.target.value);
          setError(
            event.target.name,
            !valid && "Invalid institution",
            !valid,
            id,
          );
          break;
        }
        case "address": {
          const valid = validateSentance(event.target.value);
          setError(event.target.name, !valid && "Invalid address ", !valid, id);
          break;
        }
        default: {
          setError(event.target.name, "", false, id);
          break;
        }
      }
    }
  };

  const setError = (
    fieldName: string,
    type: string,
    setError: boolean,
    id: number,
  ): void => {
    const values = [...contactCount];

    values[id].error[fieldName].status = setError;
    values[id].error[fieldName].message = type;

    setcontactCount(values);
  };
  const handleChangePhone = (value, id: number): void => {
    const values = [...contactCount];
    values[id].phone = value;
    setcontactCount(values);
  };
  const handleChange = (event: BaseSyntheticEvent, id: number): void => {
    const values = [...contactCount];
    if (event.target.name === "name") {
      values[id].name = event.target.value;
    } else if (event.target.name === "institution") {
      values[id].institution = event.target.value;
    } else if (event.target.name === "address") {
      values[id].address = event.target.value;
    }
    setcontactCount(values);
  };

  const handleAdd = (): void => {
    const values = [...contactCount];
    const lastItem = contactCount[contactCount.length - 1];
    if (
      lastItem.name === "" ||
      lastItem.institution === "" ||
      lastItem.address === "" ||
      lastItem.phone === ""
    ) {
      setAddError(true);
    } else if (
      lastItem.error.name.status === true ||
      lastItem.institution === "" ||
      lastItem.address === "" ||
      lastItem.error.phone.status === true
    ) {
      setAddError(true);
    } else {
      setAddError(false);
      values.push({
        name: "",
        institution: "",
        address: "",
        phone: "",
        error: {
          name: {
            status: false,
            message: "",
          },
          institution: {
            status: false,
            message: "",
          },
          address: {
            status: false,
            message: "",
          },
          phone: {
            status: false,
            message: "",
          },
        },
      });
      setcontactCount(values);
    }
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <CardHeader>
          <Typography variant="h5" style={{ fontSize: 16, fontWeight: 400 }}>
            Doctor Details:
          </Typography>
          <Button
            className={classes.addButton}
            aria-label="directions"
            color="primary"
            onClick={handleAdd}
            startIcon={<AddCircle />}
          >
            Add More Contacts
          </Button>
        </CardHeader>
        {addError && (
          <Grid item md={12} xs={12}>
            <Typography style={{ color: "red" }}>
              {translate("resources.addendumRequests.doctor.error")}
            </Typography>
          </Grid>
        )}
        {contactCount.map((each, idx) => (
          <div>
            <Grid
              alignItems="flex-end"
              container
              spacing={0}
              style={{ display: "inline-flex", width: "100%" }}
              key={`${each}-${idx}`}
            >
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="Name of the Doctor"
                  margin="dense"
                  name="name"
                  value={contactCount[idx].name}
                  onChange={(event) => handleChange(event, idx)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e, idx);
                    getContact(contactCount, idx);
                  }}
                  error={contactCount[idx].error.name.status}
                  helperText={
                    contactCount[idx].error.name.status
                      ? contactCount[idx].error.name.message
                      : " "
                  }
                ></TextField>
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="Name of the Institution"
                  margin="dense"
                  name="institution"
                  value={contactCount[idx].institution}
                  onChange={(event) => handleChange(event, idx)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e, idx);
                    getContact(contactCount, idx);
                  }}
                  error={contactCount[idx].error.institution.status}
                  helperText={
                    contactCount[idx].error.institution.status
                      ? contactCount[idx].error.institution.message
                      : " "
                  }
                ></TextField>
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  margin="dense"
                  name="address"
                  value={contactCount[idx].address}
                  onChange={(event) => handleChange(event, idx)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e, idx);
                    getContact(contactCount, idx);
                  }}
                  error={contactCount[idx].error.address.status}
                  helperText={
                    contactCount[idx].error.address.status
                      ? contactCount[idx].error.address.message
                      : " "
                  }
                ></TextField>
              </Grid>

              <Grid item md={2} xs={12}>
                <MuiPhoneNumber
                  defaultCountry={"us"}
                  onlyCountries={["us"]}
                  disableAreaCodes={true}
                  fullWidth
                  countryCodeEditable={false}
                  value={contactCount[idx].phone}
                  onChange={(value) => handleChangePhone(value, idx)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e, idx);
                    getContact(contactCount, idx);
                  }}
                  error={contactCount[idx].error.phone.status}
                  helperText={
                    contactCount[idx].error.phone.status
                      ? contactCount[idx].error.phone.message
                      : " "
                  }
                  margin="dense"
                  label="Phone Number"
                  name="phone"
                  variant="standard"
                />
              </Grid>
              {idx !== 0 && (
                <IconButton
                  aria-label="directions"
                  onClick={() => handleRemove(idx)}
                  color="primary"
                >
                  <Cancel />
                </IconButton>
              )}
            </Grid>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

DoctorDetails.propTypes = {
  getContact: PropTypes.string,
};

export default DoctorDetails;
