import type { BaseSyntheticEvent } from "react";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
// import {
//   TextField,
//   Typography,
//   colors,
//   Grid,
//   CardContent,
//   FormControl,
//   Button,
//   CircularProgress,
//   LinearProgress,
//   InputLabel,
//   Box,
// } from "@material-ui/core";
import { BootstrapTooltip as Tooltip } from "../../../components/Tooltip";
import MuiPhoneNumber from "material-ui-phone-number";
import {
  validateEmail,
  validatePhone,
  validateWebAddress,
  validateSentance,
  validateZipCode,
  validateCompanyName,
} from "../../../utils/validator";
import { Info } from "@mui/icons-material";
import CardHeader from "./../../../components/cardHeader";
// import type {
//   IInstitution,
//   IGenericType,
//   IInstitutionError,
// } from "../../../types";
import { perPageMax } from "../../../utils/pageConstants";
import { useDataProvider, useTranslate } from "react-admin";
import createNewGroupEntryQuery from "../../../queries/createNewGroupEntry/createNewGroupEntryQuery";
import type {
  CreateNewGroupEntryInput,
  CreateNewGroupEntryMutation,
  CreateNewGroupEntryMutationVariables,
} from "../../../__generated__/typescript-operations_all";
import { useMutation } from "@apollo/react-hooks";
import BaseModal from "../../../components/baseModal";
import { Base64 } from "js-base64";

import { REQUEST_MESSAGES } from "../../../utils/messages/requestMessages";
import {
  Autocomplete,
  Box,
  Button,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  TextField,
  Typography,
  colors,
} from "@mui/material";
import { correlationConstants } from "../../../utils/OT/correlationConstants";
// import useTraces from "../../../hooks/useTraces";
import InstitutionModal from "../../../components/institutionModal";
import moment from "moment";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: "100%",
//     "& label": {
//       marginTop: -3,
//     },
//   },
//   cardContent: {
//     backgroundColor: theme.palette.primary.light,
//   },
//   notesArea: {
//     backgroundColor: theme.palette.primary.light,
//     color: theme.palette.primary.dark,
//   },
//   label: {
//     display: "inline-flex",
//     alignItems: "center",
//   },
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
//   info: {
//     cursor: "auto",
//     width: "18px",
//     height: "18px",
//     color: "grey",
//   },
// }));
const PREFIX = "InstitutionDetails";
const classes = {
  root: `${PREFIX}-root`,
  cardContent: `${PREFIX}-cardContent`,

  notesArea: `${PREFIX}-notesArea`,
  label: `${PREFIX}- label`,
  content: `${PREFIX}-content`,
  header: `${PREFIX}-header`,
  helperText: `${PREFIX}-helperText`,
  author: `${PREFIX}-author`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`,
  applyButton: `${PREFIX}-applyButton`,
  info: `${PREFIX}-info`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    width: "100%",
    "& label": {
      marginTop: -3,
    },
  },
  [`& .${classes.cardContent}`]: {
    backgroundColor: theme.palette.primary.light,
  },
  [`& .${classes.notesArea}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
  },
  [`& .${classes.label}`]: {
    display: "inline-flex",
    alignItems: "center",
  },
  [`& .${classes.content}`]: {
    padding: theme.spacing(0, 2),
    maxWidth: 720,
    margin: "0 auto",
  },
  [`& .${classes.header}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: theme.spacing(2),
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
  [`& .${classes.info}`]: {
    cursor: "auto",
    width: "18px",
    height: "18px",
    color: "grey",
  },
}));

function InstitutionDetails({
  getInstitution,
  setAddInstitution,
  setSubmittedProviderView,
  institutionAddError,
  selectAlreadyExistingProvider,
}): JSX.Element {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  // const { handleTrace } = useTraces();
  const [stateList, setStateList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [institutionInCo, setInstitutionInCo] = useState({});
  const [sourceNature, setSourceNature] = useState({
    id: 0,
    value: translate("resources.requests.dropdown.companyType"),
  });
  const [errorInstitution, setErrorInstitution] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(false);
  const [openBase, setOpenBase] = useState(false);
  const [description, setDescription] = useState();
  const [openSubmitBase, setOpenSubmitBase] = useState(false);
  const [openErrorBase, setOpenErrorBase] = useState(false);
  const [openAlreadyExistsErrorBase, setOpenAlreadyExistsErrorBase] =
    useState(false);
  const [alreadyInCoModal, setAlreadyInCoModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [institutionError, setInstitutionError] = useState<IInstitutionError>({
    companyName: {
      status: false,
      message: "",
    },
    workEmail: {
      status: false,
      message: "",
    },
    directAddress: {
      status: false,
      message: "",
    },
    workPhone: {
      status: false,
      message: "",
    },
    website: {
      status: false,
      message: "",
    },
    addressHouseBuilding: {
      status: false,
      message: "",
    },
    addressTownCity: {
      status: false,
      message: "",
    },
    addressStateProvince: {
      status: false,
      message: "",
    },
    addressCountryRegion: {
      status: false,
      message: "",
    },
    addressZipPostalCode: {
      status: false,
      message: "",
    },
    companyType: {
      status: false,
      message: "",
    },
    faxNumber: {
      status: false,
      message: "",
    },
    companyDescription: {
      status: false,
      message: "",
    },
  });
  const [providerDetails, setProviderDetails] = useState<IInstitution>();
  const [formvalues, setFormValues] = useState<CreateNewGroupEntryInput>({
    jsr: {
      authToken: "",
      companyName: "",
      companySize: "",
      companyType: "",
      currency: "",
      status: "add",
      directAddress: "",
      addressCountryRegion: "",
      addressHouseBuilding: "",
      addressStateProvince: "",
      addressTownCity: "",
      addressZipPostalCode: "",
      companyTypeId: null,
      faxNumber: "",
      companyDescription: "",
      incorporationDate: "",
      industry: "",
      networth: "",
      ownerJobTitle: "",
      ownerType: "",
      registrationNumber: "",
      website: "",
      workEmail: "",
      workPhone: "",
      sourceOfInvitation: { key: "UBH", name: "UBH" },
    },
    fingerPrint: "",
    otContext: null,
    otTags: null,
    appArea: "MRR",
  });
  const [sourcesNatureList, setSourcesNatureList] = useState<IGenericType[]>(
    []
  );
  useEffect(() => {
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "value", order: "ASC" },
      filter: {},
    };
    function getSourcesNature(): void {
      dataProvider
        .getList("sourceNatureMasters", queryOption)
        .then(({ data }) => {
          setSourcesNatureList(data);
        })
        .catch((error: any) => error);
    }
    function getStateList(): void {
      dataProvider
        .getList("stateMasterV1", queryOption)
        .then(({ data }) => {
          setStateList(data);
        })
        .catch((error) => error);
    }
    function getCountryList(): void {
      dataProvider
        .getList("countryMasterV1", queryOption)
        .then(({ data }) => {
          setCountryList(data);
        })
        .catch((error) => error);
    }
    getSourcesNature();
    getStateList();
    getCountryList();
  }, []);
  useEffect(() => {
    if (institutionAddError) {
      if (!formvalues.jsr.companyName) {
        setError("companyName", "Institution Name is mandatory", true);
      }
      if (!formvalues.jsr.companyType) {
        setError("companyType", "Institution type is mandatory", true);
      }
      // if (!formvalues.jsr.workEmail) {
      //   setError("workEmail", "Institution email is mandatory", true);
      // }
      setErrorInstitution(true);
    } else {
      setError("companyName", "", false);
      setError("companyType", "", false);
      setError("workEmail", "", false);
    }
  }, [institutionAddError]);
  const handleValidateOnBlur = (event: BaseSyntheticEvent): void => {
    event.persist();
    let validationStatus: boolean;
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
        case "workPhone": {
          const valid = validatePhone(event.target.value);
          setError(
            event.target.name,
            "Please enter a valid phone number",
            !valid
          );
          break;
        }
        case "workEmail": {
          const valid = validateEmail(event.target.value);
          setError(event.target.name, "Please enter a valid email", !valid);
          break;
        }
        case "directAddress": {
          const valid = validateEmail(event.target.value);
          setError(
            event.target.name,
            "Please enter a valid direct address",
            !valid
          );
          break;
        }
        case "companyName": {
          const valid = validateCompanyName(event.target.value);
          setError(
            event.target.name,
            "Please enter a valid institution name",
            !valid
          );
          break;
        }
        case "website": {
          const valid = validateWebAddress(event.target.value);
          setError(
            event.target.name,
            "Please enter a valid website address",
            !valid
          );
          break;
        }
        case "addressHouseBuilding":
        case "addressTownCity":
        case "addressStateProvince":
        case "addressCountryRegion": {
          const valid = validateSentance(event.target.value);
          setError(event.target.name, "Please enter a valid address", !valid);
          break;
        }
        case "addressZipPostalCode": {
          const valid = validateZipCode(event.target.value);
          setError(event.target.name, "Please enter a valid zip code", !valid);
          break;
        }
        case "anotherPhone": {
          const valid = validatePhone(event.target.value);
          setError(
            event.target.name,
            "Please enter a valid fax number",
            !valid
          );
          break;
        }
        case "companyDescription": {
          const valid = validateSentance(event.target.value);
          setError(
            event.target.name,
            "Please enter a valid Information",
            !valid
          );
          break;
        }
        default: {
          setError(event.target.name, "", false);
          break;
        }
      }
    } else {
      if (event.target.name === "companyName") {
        setError(event.target.name, "Mandatory Field", true);
      } else {
        setError(event.target.name, "", false);
      }
    }
  };

  const setError = (
    fieldName: string,
    type: string,
    setError: boolean
  ): void => {
    setInstitutionError((prevFormState) => ({
      ...prevFormState,
      [fieldName]: {
        status: setError,
        message: setError ? type : "",
      },
    }));
  };

  const handleChange = (event: BaseSyntheticEvent): void => {
    if (event.target.name === "companyDescription") {
      setDescription(event.target.value);
      setFormValues((prevFormState) => ({
        ...prevFormState,
        jsr: {
          ...prevFormState.jsr,
          [event.target.name]: Base64.btoa(event.target.value),
        },
      }));
    } else {
      setFormValues((prevFormState) => ({
        ...prevFormState,
        jsr: {
          ...prevFormState.jsr,
          [event.target.name]: event.target.value,
        },
      }));
    }
  };
  const submitHandler = (): void => {
    setOpenBase(false);

    setShowLoader(true);
    const eventObj = correlationConstants["ev-118"];
    const inputContext = {
      action: "Attempt to add new institution",
      aecId: eventObj.aecId,
      aecIeId: eventObj.aecIeId,
    };
    handleTrace(
      eventObj.eventTitle,
      inputContext,
      (spanContext: any, fingerprint: any) => {
        formvalues.otContext = JSON.stringify(spanContext);
        formvalues.fingerPrint = fingerprint;
        formvalues.otTags = JSON.stringify({
          name: "Attempt to add new institution",
        });

        subscribeInstitutionMutation({
          variables: { input: formvalues },
        }).then((institutionAddResponse) => {
          if (
            JSON.parse(
              institutionAddResponse.data.createNewGroupEntry.institutionResult
                .status
            ).code === 200
          ) {
            if (
              institutionAddResponse.data.createNewGroupEntry.institutionResult
                .message === "Institution is present"
            ) {
              setInstitutionInCo(
                institutionAddResponse.data.createNewGroupEntry
                  .institutionResult.data
              );
              setProviderDetails({
                Name: institutionAddResponse.data.createNewGroupEntry
                  .institutionResult.data.institutionName,
                Website:
                  institutionAddResponse.data.createNewGroupEntry
                    .institutionResult.data.institutionWebsite,
                Country:
                  institutionAddResponse.data.createNewGroupEntry
                    .institutionResult.data.institutionCountry,
                Address:
                  institutionAddResponse.data.createNewGroupEntry
                    .institutionResult.data.institutionAddress,
                State:
                  institutionAddResponse.data.createNewGroupEntry
                    .institutionResult.data.institutionState,
                City: institutionAddResponse.data.createNewGroupEntry
                  .institutionResult.data.institutionCity,
                Zipcode:
                  institutionAddResponse.data.createNewGroupEntry
                    .institutionResult.data.institutionZipcode,
                phone:
                  institutionAddResponse.data.createNewGroupEntry
                    .institutionResult.data.institutionPhone,
                Fax: institutionAddResponse.data.createNewGroupEntry
                  .institutionResult.data.institutionFax,
                timeOfSubmission: moment.now(),
              });
              setAlreadyInCoModal(true);
              setShowLoader(false);
            } else {
              setErrorInstitution(false);
              setOpenSubmitBase(true);
              setShowLoader(false);
              getInstitution({
                addressCountryRegion: formvalues.jsr.addressCountryRegion,
                addressHouseBuilding: formvalues.jsr.addressHouseBuilding,
                addressStateProvince: formvalues.jsr.addressStateProvince,
                addressTownCity: formvalues.jsr.addressTownCity,
                addressZipPostalCode: formvalues.jsr.addressZipPostalCode,
                workEmail: formvalues.jsr.workEmail,
                workPhone: formvalues.jsr.workPhone,
                companyType: formvalues.jsr.companyType,
                website: formvalues.jsr.website,
                anotherPhone: formvalues.jsr.faxNumber,
                companyDescription: formvalues.jsr.companyDescription,
                companyName: formvalues.jsr.companyName,
                communicationRequestId:
                  institutionAddResponse.data.createNewGroupEntry
                    .institutionResult.communicationRequestId,
              });
            }
          } else if (
            JSON.parse(
              institutionAddResponse.data.createNewGroupEntry.institutionResult
                .status
            ).success === false
          ) {
            if (
              institutionAddResponse.data.createNewGroupEntry.institutionResult.error.includes(
                "has already been taken"
              )
            ) {
              setOpenAlreadyExistsErrorBase(true);
              setShowLoader(false);
            } else {
              setOpenErrorBase(true);
              setShowLoader(false);
            }
          } else {
            setOpenErrorBase(true);
            setShowLoader(false);
          }
        });
      }
    );
    setSubmitDisable(true);
  };

  const [subscribeInstitutionMutation] = useMutation<
    CreateNewGroupEntryMutation,
    CreateNewGroupEntryMutationVariables
  >(createNewGroupEntryQuery, {});
  const handleChangePhone = (value): void => {
    setFormValues((prevFormState) => ({
      ...prevFormState,
      jsr: {
        ...prevFormState.jsr,
        workPhone: value,
      },
    }));
  };
  const handleChangeFax = (value): void => {
    setFormValues((prevFormState) => ({
      ...prevFormState,
      jsr: {
        ...prevFormState.jsr,
        faxNumber: value,
      },
    }));
  };
  const confirmSubmission = (): void => {
    if (
      formvalues.jsr.companyName === "" ||
      formvalues.jsr.companyType === ""
    ) {
      if (formvalues.jsr.companyType === "") {
        setError("companyType", "Please select an institution type", true);
      }
      if (formvalues.jsr.companyName === "") {
        setError("companyName", "Please enter an institution name", true);
      }
      // if (formvalues.jsr.workEmail === "") {
      //   setError("workEmail", "Please enter an institution email", true);
      // }
    } else if (
      !institutionError.companyName.status &&
      !institutionError.companyDescription.status &&
      !institutionError.addressHouseBuilding.status &&
      !institutionError.addressTownCity.status &&
      !institutionError.addressStateProvince.status &&
      !institutionError.addressCountryRegion.status &&
      !institutionError.addressZipPostalCode.status &&
      !institutionError.workPhone.status &&
      !institutionError.workEmail.status &&
      !institutionError.faxNumber.status &&
      !institutionError.directAddress.status &&
      !institutionError.website.status
    ) {
      setOpenBase(true);
    }
  };
  return (
    <>
      {openBase && (
        <BaseModal
          open={openBase}
          confirmAction={submitHandler}
          onClose={() => {
            setOpenBase(false);
          }}
          title={translate("resources.requests.institution.addTitle")}
          content={translate("resources.requests.institution.addMessage")}
          successButtonName="Continue"
        />
      )}
      {alreadyInCoModal && (
        <InstitutionModal
          open={alreadyInCoModal}
          confirmAction={() => {
            setAlreadyInCoModal(false);
            setAddInstitution(false);
            selectAlreadyExistingProvider(institutionInCo);
          }}
          onClose={() => {
            setAlreadyInCoModal(false);
            setSubmitDisable(false);
          }}
          title={translate("resources.requests.institution.alreadyInCoTitle")}
          subTitle1={translate(
            "resources.requests.institution.alreadyInCoSubTitle1"
          )}
          content={providerDetails}
          subTitle2={translate(
            "resources.requests.institution.alreadyInCoSubTitle2"
          )}
        />
      )}

      {openSubmitBase && (
        <BaseModal
          open={openSubmitBase}
          confirmAction={() => {
            setOpenSubmitBase(false);
          }}
          onClose={() => {
            setOpenSubmitBase(false);
          }}
          title={translate("resources.requests.institution.submitTitle")}
          content={translate("resources.requests.institution.submitMessage")}
          successButtonName="Close"
          type="info"
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
          title={translate("resources.requests.institution.errorTitle")}
          content={translate("resources.requests.institution.errorMessage")}
          closeButtonName="Close"
          type="requestError"
        />
      )}
      {openAlreadyExistsErrorBase && (
        <BaseModal
          open={openAlreadyExistsErrorBase}
          confirmAction={() => {
            setOpenAlreadyExistsErrorBase(false);
            setAddInstitution(false);
          }}
          onClose={() => {
            setOpenAlreadyExistsErrorBase(false);
            setSubmitDisable(false);
          }}
          title={translate("resources.requests.institution.alreadyExistsTitle")}
          content={
            REQUEST_MESSAGES["mrr"].institutionAlreadyContent[0] +
            '"' +
            formvalues.jsr.companyName +
            '"' +
            REQUEST_MESSAGES["mrr"].institutionAlreadyContent[1]
          }
          successButtonName="Ok"
          type="alreadyExists"
        />
      )}

      <div>
        {showLoader && <LinearProgress color="secondary" />}
        <CardContent>
          <div
            style={{
              filter: showLoader ? "blur(1px)" : "none",
            }}
          >
            <CardHeader>
              <Typography
                variant="h5"
                style={{ fontSize: 16, fontWeight: 400 }}
              >
                Please provide details of the new Institution to be added:
              </Typography>
            </CardHeader>
            <Grid
              alignItems="flex-end"
              container
              spacing={1}
              style={{ display: "inline-flex", width: "100%" }}
            >
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Name of institution/provider"
                  margin="dense"
                  name="companyName"
                  disabled={submitDisable}
                  required
                  value={formvalues.jsr.companyName}
                  onChange={(event) => handleChange(event)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e);
                  }}
                  error={institutionError.companyName.status}
                  helperText={
                    institutionError.companyName.status
                      ? institutionError.companyName.message
                      : " "
                  }
                ></TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <div
                  style={{
                    display: "inline-flex",
                    alignContent: "space-between",
                    width: "95%",
                    justifyContent: "space-between",
                  }}
                >
                  <InputLabel
                    style={{
                      color: institutionError.companyType.status
                        ? "#ff2800"
                        : "",
                    }}
                  >
                    Medical group of institution/provider<sup>*</sup>
                  </InputLabel>
                </div>

                <Autocomplete
                  id="companyType"
                  options={sourcesNatureList}
                  autoHighlight
                  disableClearable
                  value={sourceNature}
                  style={{ fontSize: "14px", marginRight: "30px" }}
                  getOptionLabel={(option) => option.value}
                  onChange={(e, newValue) => {
                    if (newValue && typeof newValue !== "string") {
                      const { id, value } = newValue;
                      setSourceNature({ id: Number(id), value: value });
                      setFormValues((prevFormState) => ({
                        ...prevFormState,
                        jsr: {
                          ...prevFormState.jsr,
                          companyType: value,
                          companyTypeId: Number(id),
                        },
                      }));
                    }
                  }}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option.value}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      onBlur={(e) => handleValidateOnBlur(e)}
                      error={institutionError.companyType.status}
                      helperText={
                        institutionError.companyType.status
                          ? institutionError.companyType.message
                          : " "
                      }
                      margin="dense"
                      name="companyType"
                      required
                      style={{ fontSize: "14px" }}
                      value={formvalues.jsr.companyType}
                      variant="standard"
                      disabled={submitDisable}
                    />
                  )}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  margin="dense"
                  // required
                  name="workEmail"
                  disabled={submitDisable}
                  value={formvalues.jsr.workEmail}
                  onChange={(event) => handleChange(event)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e);
                  }}
                  error={institutionError.workEmail.status}
                  helperText={
                    institutionError.workEmail.status
                      ? institutionError.workEmail.message
                      : " "
                  }
                ></TextField>
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label="Direct Address"
                  margin="dense"
                  name="directAddress"
                  disabled={submitDisable}
                  value={formvalues.jsr.directAddress}
                  onChange={(event) => handleChange(event)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e);
                  }}
                  error={institutionError.directAddress.status}
                  helperText={
                    institutionError.directAddress.status
                      ? institutionError.directAddress.message
                      : " "
                  }
                ></TextField>
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label="Website Address"
                  margin="dense"
                  name="website"
                  disabled={submitDisable}
                  value={formvalues.jsr.website}
                  onChange={(event) => handleChange(event)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e);
                  }}
                  error={institutionError.website.status}
                  helperText={
                    institutionError.website.status
                      ? institutionError.website.message
                      : " "
                  }
                ></TextField>
              </Grid>

              <Grid item md={6} xs={12}>
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
                  error={institutionError.workPhone.status}
                  helperText={
                    institutionError.workPhone.status
                      ? institutionError.workPhone.message
                      : " "
                  }
                  margin="dense"
                  label="Phone Number"
                  value={formvalues.jsr.workPhone}
                  name="workPhone"
                  onChange={handleChangePhone}
                  variant="standard"
                />
              </Grid>
              <Grid item md={6} xs={12}>
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
                  error={institutionError.faxNumber.status}
                  helperText={
                    institutionError.faxNumber.status
                      ? institutionError.faxNumber.message
                      : " "
                  }
                  margin="dense"
                  label="Fax Number"
                  value={formvalues.jsr.faxNumber}
                  name="faxNumber"
                  onChange={handleChangeFax}
                  variant="standard"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  margin="dense"
                  name="addressHouseBuilding"
                  disabled={submitDisable}
                  value={formvalues.jsr.addressHouseBuilding}
                  onChange={(event) => handleChange(event)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e);
                  }}
                  error={institutionError.addressHouseBuilding.status}
                  helperText={
                    institutionError.addressHouseBuilding.status
                      ? institutionError.addressHouseBuilding.message
                      : " "
                  }
                ></TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="City"
                  margin="dense"
                  name="addressTownCity"
                  disabled={submitDisable}
                  value={formvalues.jsr.addressTownCity}
                  onChange={(event) => handleChange(event)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e);
                  }}
                  error={institutionError.addressTownCity.status}
                  helperText={
                    institutionError.addressTownCity.status
                      ? institutionError.addressTownCity.message
                      : " "
                  }
                ></TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Country"
                  margin="dense"
                  name="addressCountryRegion"
                  disabled={submitDisable}
                  select
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{ native: true }}
                  value={formvalues.jsr.addressCountryRegion}
                  onChange={(event) => handleChange(event)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e);
                  }}
                  error={institutionError.addressCountryRegion.status}
                  helperText={
                    institutionError.addressCountryRegion.status
                      ? institutionError.addressCountryRegion.message
                      : " "
                  }
                  variant="standard"
                >
                  <option key={0} value="0" hidden>
                    {translate("resources.patients.dropdown.country")}
                  </option>
                  {countryList.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="State/Province"
                  margin="dense"
                  name="addressStateProvince"
                  disabled={submitDisable}
                  select
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{ native: true }}
                  value={formvalues.jsr.addressStateProvince}
                  onChange={(event) => handleChange(event)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e);
                  }}
                  error={institutionError.addressStateProvince.status}
                  helperText={
                    institutionError.addressStateProvince.status
                      ? institutionError.addressStateProvince.message
                      : " "
                  }
                  variant="standard"
                >
                  <option key={0} value="0" hidden>
                    {translate("resources.patients.dropdown.state")}
                  </option>
                  {stateList.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="Zipcode"
                  margin="dense"
                  name="addressZipPostalCode"
                  disabled={submitDisable}
                  value={formvalues.jsr.addressZipPostalCode}
                  onChange={(event) => handleChange(event)}
                  onBlur={(e) => {
                    handleValidateOnBlur(e);
                  }}
                  inputProps={{
                    maxLength: 5,
                  }}
                  error={institutionError.addressZipPostalCode.status}
                  helperText={
                    institutionError.addressZipPostalCode.status
                      ? institutionError.addressZipPostalCode.message
                      : " "
                  }
                ></TextField>
              </Grid>
              <Grid item md={12} xs={12}>
                <div style={{ display: "flex" }}>
                  <Typography
                    variant="h5"
                    style={{ fontSize: 14 }}
                    gutterBottom
                  >
                    Fill additional details of the institution/ provider
                  </Typography>
                  <Tooltip
                    arrow
                    placement="top"
                    title={translate("tooltip.request.institution_additional")}
                  >
                    <Info className={classes.info} />
                  </Tooltip>
                </div>
                <FormControl fullWidth>
                  <TextField
                    name="companyDescription"
                    onChange={(event) => handleChange(event)}
                    disabled={submitDisable}
                    multiline
                    rows={4}
                    value={description}
                    placeholder="Please provide additional details about institution/provider"
                    onBlur={(e) => {
                      handleValidateOnBlur(e);
                    }}
                    variant="outlined"
                    error={institutionError.companyDescription.status}
                    helperText={
                      institutionError.companyDescription.status
                        ? institutionError.companyDescription.message
                        : " "
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "right",
              float: "right",
            }}
          >
            {errorInstitution && (
              <Typography style={{ color: "red", marginRight: "10px" }}>
                {translate(`resources.requests.error.institution_error`)}
              </Typography>
            )}
            <Button
              variant="contained"
              style={{
                marginRight: "10px",
                backgroundColor: "grey",
                color: "white",
              }}
              onClick={() => {
                if (!submitDisable) {
                  setAddInstitution(false);
                } else {
                  setAddInstitution(false);
                  setSubmittedProviderView(true);
                }
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
              onClick={confirmSubmission}
              disabled={submitDisable}
              startIcon={
                showLoader ? (
                  <CircularProgress color="secondary" size={20} />
                ) : (
                  ""
                )
              }
            >
              {showLoader ? "Sending Request" : "Submit"}
            </Button>
          </div>
        </CardContent>
      </div>
    </>
  );
}

InstitutionDetails.propTypes = {
  getInstitution: PropTypes.func,
  setAddInstitution: PropTypes.func,
};

export default InstitutionDetails;
