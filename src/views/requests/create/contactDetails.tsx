import type { BaseSyntheticEvent } from "react";
import React, { useState } from "react";
import PropTypes from "prop-types";

// import {
//   TextField,
//   Typography,
//   colors,
//   Grid,
//   CardContent,
//   IconButton,
//   Button,
// } from "@material-ui/core";
import MuiPhoneNumber from "material-ui-phone-number";
import {
  validateEmail,
  validatePhone,
  validateString,
} from "../../../utils/validator";
import { AddCircle, Cancel } from "@mui/icons-material";
import CardHeader from "./../../../components/cardHeader";
// import type { IContactDetails, IContactDetailsProps } from "../../../types";
import { useTranslate } from "react-admin";
import { styled } from "@mui/material/styles";
import {
  Button,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
  colors,
} from "@mui/material";
// const useStyles = makeStyles((theme) => ({
//   root: {},
//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     marginBottom: theme.spacing(2),
//   },
//   content: {
//     padding: theme.spacing(0, 2),
//     maxWidth: 720,
//     margin: "0 auto",
//   },
//   helperText: {
//     textAlign: "right",
//     marginRight: 0,
//   },
//   author: {
//     margin: theme.spacing(4, 0),
//     display: "flex",
//   },
//   avatar: {
//     marginRight: theme.spacing(2),
//   },
//   actions: {
//     backgroundColor: colors.grey[100],
//     padding: theme.spacing(2),
//     display: "flex",
//     justifyContent: "center",
//   },
//   applyButton: {
//     color: theme.palette.common.white,
//     backgroundColor: colors.green[600],
//     "&:hover": {
//       backgroundColor: colors.green[900],
//     },
//   },
//   addButton: {
//     borderRadius: "unset",
//     float: "right",
//     padding: "0px",
//     textTransform: "none",
//     backgroundColor: theme.palette.primary.light,
//     "&:hover": {
//       backgroundColor: theme.palette.primary.light,
//     },
//   },
// }));

const PREFIX = "ContactDetails";
const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  content: `${PREFIX}-content`,
  helperText: `${PREFIX}-helperText`,
  author: `${PREFIX}-author`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`,
  applyButton: `${PREFIX}-applyButton`,
  addButton: `${PREFIX}-addButton`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {},
  [`& .${classes.header}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.content}`]: {
    padding: theme.spacing(0, 2),
    maxWidth: 720,
    margin: "0 auto",
  },
  [`& .${classes.helperText}`]: {
    textAlign: "right",
    marginRight: 0,
  },
  [`& .${classes.author}`]: {
    margin: theme.spacing(4, 0),
    display: "flex",
  },
  [`& .${classes.avatar}`]: {
    marginRight: theme.spacing(2),
  },
  [`& .${classes.actions}`]: {
    backgroundColor: colors.grey[100],
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
  [`& .${classes.applyButton}`]: {
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    "&:hover": {
      backgroundColor: colors.green[900],
    },
  },
  [`& .${classes.addButton}`]: {
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
function ContactDetails({
  getContact,
  contactData,
  requestView,
}: IContactDetailsProps): JSX.Element {
  const translate = useTranslate();
  const handleRemove = (i): void => {
    const values = [...contactCount];
    values.splice(i, 1);
    setcontactCount(values);
    getContact(values);
  };

  const [contactCount, setcontactCount] = useState<IContactDetails[]>([
    {
      contactName: "",
      email: "",
      phone: "",
      error: {
        contactName: {
          status: false,
          message: "",
        },
        email: {
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
  React.useEffect(() => {
    if (contactData.length > 0) {
      const tempContact = [];
      contactData.map((value) => {
        tempContact.push({
          contactName: value.contactPersonName,
          email: value.contactPersonEmail,
          phone: value.contactPersonPhone,
          error: {
            contactName: {
              status: false,
              message: "",
            },
            email: {
              status: false,
              message: "",
            },
            phone: {
              status: false,
              message: "",
            },
          },
        });
      });
      setcontactCount(tempContact);
    }
  }, [contactData]);

  const handleValidateOnBlur = (
    event: BaseSyntheticEvent,
    id: number
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
            id
          );
          break;
        }
        case "email": {
          const valid = validateEmail(event.target.value);
          setError(event.target.name, !valid && "Invalid email", !valid, id);
          break;
        }
        case "contactName": {
          const valid = validateString(event.target.value);
          setError(event.target.name, !valid && "Invalid name", !valid, id);
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
    id: number
  ): void => {
    const values = [...contactCount];

    values[id].error[fieldName].status = setError;
    values[id].error[fieldName].message = type;

    setcontactCount(values);
  };

  const handleChange = (event: BaseSyntheticEvent, id: number): void => {
    const values = [...contactCount];
    if (event.target.name === "contactName") {
      values[id].contactName = event.target.value;
    } else if (event.target.name === "email") {
      values[id].email = event.target.value;
    } else if (event.target.name === "phone") {
      values[id].phone = event.target.value;
    }
    setcontactCount(values);
  };
  const handleChangePhone = (value, id: number): void => {
    const values = [...contactCount];
    values[id].phone = value;
    setcontactCount(values);
  };

  const handleAdd = (): void => {
    const values = [...contactCount];
    const lastItem = contactCount[contactCount.length - 1];
    if (
      lastItem.contactName === "" ||
      (lastItem.email === "" && lastItem.phone === "")
    ) {
      setAddError(true);
    } else if (
      lastItem.error.contactName.status === true ||
      lastItem.error.email.status === true ||
      lastItem.error.phone.status === true
    ) {
      setAddError(true);
    } else {
      setAddError(false);
      values.push({
        contactName: "",
        email: "",
        phone: "",
        error: {
          contactName: {
            status: false,
            message: "",
          },
          email: {
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
    <CardContent>
      <Root>
        <CardHeader>
          <Typography variant="h5" style={{ fontSize: 16, fontWeight: 400 }}>
            {translate("resources.requests.label.contact")}
          </Typography>
          {!requestView && (
            <Button
              aria-label="directions"
              color="primary"
              className={classes.addButton}
              onClick={handleAdd}
              startIcon={<AddCircle />}
            >
              Add More Contacts
            </Button>
          )}
        </CardHeader>
      </Root>
      {addError && (
        <Grid item md={12} xs={12}>
          <Typography style={{ color: "red" }}>
            {translate("resources.requests.error.contact")}
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
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="Contact Name"
                margin="dense"
                name="contactName"
                value={contactCount[idx].contactName}
                onChange={(event) => handleChange(event, idx)}
                onBlur={(e) => {
                  handleValidateOnBlur(e, idx);
                  getContact(contactCount, idx);
                }}
                error={contactCount[idx].error.contactName.status}
                helperText={
                  contactCount[idx].error.contactName.status
                    ? contactCount[idx].error.contactName.message
                    : " "
                }
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                margin="dense"
                name="email"
                onChange={(event) => handleChange(event, idx)}
                value={contactCount[idx].email}
                onBlur={(e) => {
                  handleValidateOnBlur(e, idx);
                  getContact(contactCount, idx);
                }}
                error={contactCount[idx].error.email.status}
                helperText={
                  contactCount[idx].error.email.status
                    ? contactCount[idx].error.email.message
                    : " "
                }
              ></TextField>
            </Grid>
            <Grid item md={3} xs={12}>
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
            {idx !== 0 && !requestView && (
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
  );
}

ContactDetails.propTypes = {
  getContact: PropTypes.string,
};

export default ContactDetails;
