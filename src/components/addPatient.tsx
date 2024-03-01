import type { BaseSyntheticEvent } from "react";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import {
//   Checkbox,
//   FormControlLabel,
//   Grid,
//   Typography,
//   TextField,
//   makeStyles,
// } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import { formatSSN, validateAddPatient } from "../utils/validator";
import MuiPhoneNumber from "material-ui-phone-number";
import {
  addPatientErrorMessages,
  ERROR_MESSAGE_KEY,
} from "../utils/messages/errorMessages";
import moment from "moment";
import { ADD_PATIENT_FORM_INIT } from "../utils/messages/initializeConstants";
// import type { AppState, IAddPatientProps, IPatientParams } from "../types";
import { perPageMax } from "../utils/pageConstants";
import { useDataProvider, usePermissions, useTranslate } from "react-admin";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { CO_ROLE_PATIENT } from "../utils/roles";
// import { useSelector } from "react-redux";
import DatePickerWithMonthAndYearDropdown from "./datePicker";
import useMedicalrequestGetFunctions from "../hooks/MedicalRecord/useMedicalRequestGetFunctions";
// const useStyles = makeStyles((theme) => ({
//   address: {
//     width: "100%",
//     [theme.breakpoints.down("sm")]: {
//       display: "column",
//     },
//     [theme.breakpoints.up("sm")]: {
//       display: "flex",
//     },
//     gap: "10px",
//   },
// }));

const PREFIX = "AddPatient";
const classes = {
  address: `${PREFIX}-address`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.address}`]: {
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "column",
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
    gap: "10px",
  },
}));

function AddPatient({
  checkPatientValidator,
  getpatient,
  alertAddPatient,
  requestData,
  requestView = false,
  type = null,
  dependentData = null,
  setDisableSelection,
}: IAddPatientProps) {
  const {
    getStateList,
    getCountryList,
    getGenderList,
    getSexList,
    stateList,
    countryList,
    sexList,
    genderList,
    getPronounList,
    getLanguageList,
    pronounList,
    languageList,
    relationList,
    getRelationList,
  } = useMedicalrequestGetFunctions();
  const { permissions } = usePermissions();
  const classes = useStyles();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer
  );
  const translate = useTranslate();
  const [patient, setPatient] = useState<IPatientParams>(ADD_PATIENT_FORM_INIT);
  const [isPatient, setIsPatient] = useState(false);
  const dataProvider = useDataProvider();
  const [phonePresent, setPhonePresent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPrevName, setShowPrevName] = useState(false);

  const [showPrevAddress, setShowPrevAddress] = useState(false);
  const [firstRequest, setFirstRequest] = useState(false);
  const [lang, setLang] = useState({
    id: "0",
    value: translate("resources.patients.dropdown.lang"),
  });
  const [errors, setErrors] = useState({
    patientFirstName: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT
          ? ""
          : "First name is mandatory",
    },
    patientMiddleName: {
      isInit: false,
      message: "",
    },
    patientLastName: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT
          ? ""
          : "Last name is mandatory",
    },
    patientEmail: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT ? "" : "Email is mandatory",
    },
    patientDOB: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT
          ? ""
          : "Date of birth is mandatory",
    },
    ssn: {
      isInit: false,
      message: "",
    },
    patientPhone: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT
          ? ""
          : "Phone number is mandatory",
    },
    zipCode: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT ? "" : "Zip code is mandatory",
    },
    street: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT
          ? ""
          : "Address line1 is mandatory",
    },
    addressLine2: {
      isInit: false,
      message: "",
    },
    city: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT ? "" : "City is mandatory",
    },
    preferredLanguageId: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT
          ? ""
          : "Preferred language is mandatory",
    },
    sex: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT ? "" : "Sex is mandatory",
    },
    gender: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT ? "" : "Gender is mandatory",
    },
    preferredPronouns: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT
          ? ""
          : "Preferred pronouns is mandatory",
    },
    state: {
      isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
      message:
        userInfoReducer.role === CO_ROLE_PATIENT ? "" : "State is mandatory",
    },
    suffix: {
      isInit: true,
      message: "",
    },
    genderOthers: {
      isInit: true,
      message: "",
    },
    sexOthers: {
      isInit: true,
      message: "",
    },
    relationshipId: {
      isInit: true,
      message: "",
    },
    previousSuffix: {
      isInit: true,
      message: "",
    },
    previousFirstName: {
      isInit: true,
      message: "",
    },
    previousMiddleName: {
      isInit: true,
      message: "",
    },
    previousLastName: {
      isInit: true,
      message: "",
    },
    previousAddressLine1: {
      isInit: true,
      message: "",
    },
    previousAddressLine2: {
      isInit: true,
      message: "",
    },
    previousAddressZip: {
      isInit: true,
      message: "",
    },
    previousCity: {
      isInit: true,
      message: "",
    },
    previousState: {
      isInit: true,
      message: "",
    },
  });

  const queryOptionPatient = {
    pagination: { page: 1, perPage: perPageMax },
    sort: { field: "id", order: "ASC" },
    filter: { id: userInfoReducer.id },
  };
  useEffect(() => {
    if (type === "dependent" && !requestView && dependentData === null) {
      setSelectedDate(null);
      setFirstRequest(false);
      setIsPatient(false);
      setLang({
        id: "0",
        value: translate("resources.patients.dropdown.lang"),
      });
      setShowPrevName(false);
      setShowPrevAddress(false);
      setPatient({
        patientFirstName: "",
        patientMiddleName: "",
        patientLastName: "",
        patientEmail: "",
        patientDOB: "",
        patientPhone: "",
        zipCode: "",
        street: "",
        addressLine2: "",
        city: "",
        state: "",
        preferredLanguageId: "",
        preferredPronouns: "",
        sex: {
          id: 0,
          value: "",
          other: false,
          otherValue: "",
        },
        gender: {
          id: 0,
          value: "",
          other: false,
          otherValue: "",
        },
        ssn: "",
        suffix: "",
        previousSuffix: "",
        previousFirstName: "",
        previousMiddleName: "",
        previousLastName: "",
        previousAddressLine1: "",
        previousAddressLine2: "",
        previousAddressZip: "",
        previousCity: "",
        previousCountry: "",
        previousState: "",
        stateValue: "",
        countryValue: "",
      });
    }
    if (dependentData === null) {
      setErrors((prevFormState) => ({
        ...prevFormState,
        patientFirstName: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT && type !== "dependent"
              ? false
              : true,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT && type !== "dependent"
              ? ""
              : "First name is mandatory",
        },
        patientLastName: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT && type !== "dependent"
              ? false
              : true,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT && type !== "dependent"
              ? ""
              : "Last name is mandatory",
        },
        relationshipId: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT && type === "dependent"
              ? true
              : false,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT && type === "dependent"
              ? "Please select a relation"
              : "",
        },
        patientDOB: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            type !== "dependent" &&
            !firstRequest
              ? false
              : true,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            type !== "dependent" &&
            !firstRequest
              ? ""
              : "Date of birth is mandatory",
        },
        sex: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            type !== "dependent" &&
            !firstRequest
              ? false
              : true,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            type !== "dependent" &&
            !firstRequest
              ? ""
              : "Sex is mandatory",
        },
        gender: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            type !== "dependent" &&
            !firstRequest
              ? false
              : true,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            type !== "dependent" &&
            !firstRequest
              ? ""
              : "Gender is mandatory",
        },
        patientMiddleName: {
          isInit: false,
          message: "",
        },
        patientEmail: {
          isInit: userInfoReducer.role === CO_ROLE_PATIENT ? false : true,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT
              ? ""
              : "Email is mandatory",
        },
        ssn: {
          isInit: false,
          message: "",
        },
        patientPhone: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            (phonePresent || type === "dependent")
              ? false
              : true,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            (phonePresent || type === "dependent")
              ? ""
              : "Phone number is mandatory",
        },
        zipCode: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            firstRequest &&
            type !== "dependent"
              ? true
              : false,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            firstRequest &&
            type !== "dependent"
              ? "Zip code is mandatory"
              : "",
        },
        street: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            firstRequest &&
            type !== "dependent"
              ? true
              : false,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            firstRequest &&
            type !== "dependent"
              ? "Address line1 is mandatory"
              : "",
        },
        city: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            firstRequest &&
            type !== "dependent"
              ? true
              : false,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            firstRequest &&
            type !== "dependent"
              ? "City is mandatory"
              : "",
        },
        preferredLanguageId: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            firstRequest &&
            type !== "dependent"
              ? true
              : false,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            firstRequest &&
            type !== "dependent"
              ? "Preferred Language is mandatory"
              : "",
        },
        preferredPronouns: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            firstRequest &&
            type !== "dependent"
              ? true
              : false,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            firstRequest &&
            type !== "dependent"
              ? "Preferred Pronouns is mandatory"
              : "",
        },
        state: {
          isInit:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            firstRequest &&
            type !== "dependent"
              ? true
              : false,
          message:
            userInfoReducer.role === CO_ROLE_PATIENT &&
            firstRequest &&
            type !== "dependent"
              ? "State is mandatory"
              : "",
        },
        suffix: {
          isInit: true,
          message: "",
        },
        previousSuffix: {
          isInit: true,
          message: "",
        },
        previousFirstName: {
          isInit: true,
          message: "",
        },
        previousMiddleName: {
          isInit: true,
          message: "",
        },
        previousLastName: {
          isInit: true,
          message: "",
        },
        previousAddressLine1: {
          isInit: true,
          message: "",
        },
        previousAddressZip: {
          isInit: true,
          message: "",
        },
        previousCity: {
          isInit: true,
          message: "",
        },
        previousState: {
          isInit: true,
          message: "",
        },
      }));
    } else {
      setErrors((prevFormState) => ({
        ...prevFormState,
        patientFirstName: {
          isInit: false,
          message: "",
        },
        patientLastName: {
          isInit: false,
          message: "",
        },
        relationshipId: {
          isInit: false,
          message: "",
        },
        patientDOB: {
          isInit: false,
          message: "",
        },
        sex: {
          isInit: false,
          message: "",
        },
        gender: {
          isInit: false,
          message: "",
        },
        patientMiddleName: {
          isInit: false,
          message: "",
        },
        patientEmail: {
          isInit: false,
          message: "",
        },
        ssn: {
          isInit: false,
          message: "",
        },
        patientPhone: {
          isInit: false,
          message: "",
        },
        zipCode: {
          isInit: false,
          message: "",
        },
        street: {
          isInit: false,
          message: "",
        },
        city: {
          isInit: false,
          message: "",
        },
        preferredLanguageId: {
          isInit: false,
          message: "",
        },
        preferredPronouns: {
          isInit: false,
          message: "",
        },
        state: {
          isInit: false,
          message: "",
        },
      }));
    }
  }, [type, firstRequest, phonePresent, dependentData]);
  useEffect(() => {
    if (permissions === CO_ROLE_PATIENT && type === "myself" && !requestView) {
      setIsPatient(true);
      setPatient({
        patientFirstName: "",
        patientMiddleName: "",
        patientLastName: "",
        patientEmail: "",
        patientDOB: "",
        patientPhone: "",
        zipCode: "",
        street: "",
        addressLine2: "",
        city: "",
        state: "",
        preferredLanguageId: "",
        preferredPronouns: "",
        sex: {
          id: 0,
          value: "",
          other: false,
          otherValue: "",
        },
        gender: {
          id: 0,
          value: "",
          other: false,
          otherValue: "",
        },
        ssn: "",
        suffix: "",
        previousSuffix: "",
        previousFirstName: "",
        previousMiddleName: "",
        previousLastName: "",
        previousAddressLine1: "",
        previousAddressLine2: "",
        previousAddressZip: "",
        previousCity: "",
        previousCountry: "",
        previousState: "",
        stateValue: "",
        countryValue: "",
      });
      getRequestViews();
      getpatient(patient);
    }
  }, [permissions, userInfoReducer, type]);
  useEffect(() => {
    getEditView(requestData);
  }, [requestData]);
  useEffect(() => {
    if (dependentData !== null) {
      getDependentData(dependentData);
    }
  }, [dependentData]);
  useEffect(() => {
    getpatient(patient);
  }, [patient]);
  const handleChangeDOB = (value) => {
    let validationStatus: boolean;
    if (!value) {
      validationStatus = true;
      setSelectedDate(null);
    } else {
      validationStatus = false;
    }
    if (!validationStatus) {
      const date = moment(value).format("MM/DD/YYYY");
      const valid = validateAddPatient("patientDOB", date);
      setError("patientDOB", !valid && ERROR_MESSAGE_KEY, !valid);
      setPatient((prevFormState) => ({
        ...prevFormState,
        patientDOB: value,
      }));
      getpatient(patient);
      setSelectedDate(value);
    }
    if (validationStatus) {
      setError("patientDOB", "empty", true);
      setSelectedDate(null);
    }
  };

  const getEditView = (requestData) => {
    if (requestData) {
      if (requestData.length > 0) {
        setSelectedDate(new Date(requestData[0].birthDate));
        if (requestData[0].preferredLanguageId) {
          setLang({
            id: requestData[0].preferredLanguageId,
            value: requestData[0].preferredLanguageValue,
          });
        }
        if (requestData[0].previousName) {
          if (requestData[0].previousName.trim()) {
            setShowPrevName(true);
          }
        }
        if (JSON.parse(requestData[0].previousAddress).is_previous_address) {
          setShowPrevAddress(true);
        }
        setPatient((prevFormState) => ({
          ...prevFormState,
          patientFirstName: requestData[0].firstName,
          patientMiddleName: requestData[0].middleName,
          patientLastName: requestData[0].lastName,
          relationshipId: requestData[0].relationshipId,
          suffix: requestData[0].suffix,
          previousFirstName: requestData[0].previousName
            ? requestData[0].previousName.split(" ")[0]
            : "",
          previousMiddleName: requestData[0].previousName
            ? requestData[0].previousName.split(" ")[1]
            : "",
          previousLastName: requestData[0].previousName
            ? requestData[0].previousName.split(" ")[2]
            : "",
          previousSuffix: requestData[0].previousName
            ? requestData[0].previousName.split(" ")[3]
            : "",
          patientDOB: moment(requestData[0].birthDate).format("YYYY-MM-DD"),
          patientPhone: requestData[0].phoneNumber,
          zipCode: requestData[0].addressZip ? requestData[0].addressZip : "",
          street: requestData[0].addressLine1,
          addressLine2: requestData[0].addressLine2
            ? requestData[0].addressLine2
            : "",
          ssn: requestData[0].ssn
            ? requestData[0].ssn.slice(0, 3) +
              "-" +
              requestData[0].ssn.slice(3, 5) +
              "-" +
              requestData[0].ssn.slice(5)
            : "",
          city: requestData[0].city,
          state: requestData[0].stateId,
          patientEmail: requestData[0].electronicDetails,
          preferredLanguageId: requestData[0].preferredLanguageId,
          preferredPronouns: requestData[0].preferredPronounsId,
          sex: {
            id: JSON.parse(requestData[0].sex).id,
            value: JSON.parse(requestData[0].sex).value,
            other: JSON.parse(requestData[0].sex).other,
            otherValue: JSON.parse(requestData[0].sex).other_value,
          },
          gender: {
            id: JSON.parse(requestData[0].gender).id,
            value: JSON.parse(requestData[0].gender).value,
            other: JSON.parse(requestData[0].gender).other,
            otherValue: JSON.parse(requestData[0].gender).other_value,
          },
          isPreviousAddress: JSON.parse(requestData[0].previousAddress)
            .is_previous_address,
          previousAddressLine1: JSON.parse(requestData[0].previousAddress)
            .is_previous_address
            ? JSON.parse(requestData[0].previousAddress).previous_address1
            : null,
          previousAddressLine2: JSON.parse(requestData[0].previousAddress)
            .is_previous_address
            ? JSON.parse(requestData[0].previousAddress).previous_address2
            : null,
          previousCity: JSON.parse(requestData[0].previousAddress)
            .is_previous_address
            ? JSON.parse(requestData[0].previousAddress).previous_city
            : null,
          previousState: JSON.parse(requestData[0].previousAddress)
            .is_previous_address
            ? JSON.parse(requestData[0].previousAddress).previous_state_id
            : null,
          previousCountry: JSON.parse(requestData[0].previousAddress)
            .is_previous_address
            ? JSON.parse(requestData[0].previousAddress).previous_country_id
            : null,
          previousAddressZip: JSON.parse(requestData[0].previousAddress)
            .is_previous_address
            ? JSON.parse(requestData[0].previousAddress).previous_zip
            : null,
        }));
      }
    }
  };
  const getDependentData = (requestData) => {
    if (requestData.id) {
      setSelectedDate(new Date(requestData.birthDate));
      if (requestData.preferredLanguageId) {
        setLang({
          id: requestData.preferredLanguageId,
          value: requestData.preferredLanguage,
        });
      }
      if (requestData.previousFirstName) {
        setShowPrevName(true);
      } else {
        setShowPrevName(false);
      }
      if (requestData.previousAddress) {
        if (
          JSON.parse(requestData.previousAddress).previous_address_json
            .is_previous_address
        ) {
          setShowPrevAddress(true);
        } else {
          setShowPrevAddress(false);
        }
      }
      setPatient((prevFormState) => ({
        ...prevFormState,
        patientFirstName: requestData.firstName,
        patientMiddleName: requestData.middleName ? requestData.middleName : "",
        patientLastName: requestData.lastName,
        relationshipId: requestData.relatedPersonRelationshipId,
        suffix: requestData.suffix ? requestData.suffix : "",
        previousFirstName: requestData.previousFirstName
          ? requestData.previousFirstName
          : "",
        previousMiddleName: requestData.previousMiddleName
          ? requestData.previousMiddleName
          : "",
        previousLastName: requestData.previousLastName
          ? requestData.previousLastName
          : "",
        previousSuffix: requestData.previousSuffix
          ? requestData.previousSuffix
          : "",
        patientDOB: moment(requestData.birthDate).format("YYYY-MM-DD"),
        patientPhone: requestData.phoneNumber,
        zipCode: requestData.zip ? requestData.zip : "",
        street: requestData.address1 ? requestData.address1 : "",
        addressLine2: requestData.address2 ? requestData.address2 : "",
        ssn: requestData.ssn
          ? requestData.ssn.slice(0, 3) +
            "-" +
            requestData.ssn.slice(3, 5) +
            "-" +
            requestData.ssn.slice(5)
          : "",
        city: requestData.city ? requestData.city : "",
        state: requestData.stateId,
        patientEmail: requestData.email ? requestData.email : "",
        preferredLanguageId: requestData.preferredLanguageId,
        preferredPronouns: requestData.preferredPronounsId,
        sex: {
          id: JSON.parse(requestData.sex).id,
          value: JSON.parse(requestData.sex).value,
          other: JSON.parse(requestData.sex).other,
          otherValue: JSON.parse(requestData.sex).other_value
            ? JSON.parse(requestData.sex).other_value
            : "",
        },
        gender: {
          id: JSON.parse(requestData.gender).id,
          value: JSON.parse(requestData.gender).value,
          other: JSON.parse(requestData.gender).other,
          otherValue: JSON.parse(requestData.gender).other_value
            ? JSON.parse(requestData.gender).other_value
            : "",
        },
        isPreviousAddress: JSON.parse(requestData.previousAddress)
          .previous_address_json.is_previous_address,
        previousAddressLine1: JSON.parse(requestData.previousAddress)
          .previous_address_json.is_previous_address
          ? JSON.parse(requestData.previousAddress).previous_address_json
              .previous_address1
          : "",
        previousAddressLine2: JSON.parse(requestData.previousAddress)
          .previous_address_json.is_previous_address
          ? JSON.parse(requestData.previousAddress).previous_address_json
              .previous_address2
          : "",
        previousCity: JSON.parse(requestData.previousAddress)
          .previous_address_json.is_previous_address
          ? JSON.parse(requestData.previousAddress).previous_address_json
              .previous_city
          : "",
        previousState: JSON.parse(requestData.previousAddress)
          .previous_address_json.is_previous_address
          ? JSON.parse(requestData.previousAddress).previous_address_json
              .previous_state_id
          : "",
        previousCountry: JSON.parse(requestData.previousAddress)
          .previous_address_json.is_previous_address
          ? JSON.parse(requestData.previousAddress).previous_address_json
              .previous_country_id
          : "",
        previousAddressZip: JSON.parse(requestData.previousAddress)
          .previous_address_json.is_previous_address
          ? JSON.parse(requestData.previousAddress).previous_address_json
              .previous_zip
          : "",
      }));
    }
  };
  function getRequestViews() {
    if (userInfoReducer.id && type === "myself") {
      dataProvider
        .getList("patientProfileV1s", queryOptionPatient)
        .then(({ data }) => {
          if (!data[0].birthDate) {
            setFirstRequest(true);
          }
          if (data[0].birthDate === null) {
            setSelectedDate(null);
          } else {
            setSelectedDate(new Date(data[0].birthDate));
          }
          if (data[0].preferredLanguageId) {
            setLang({
              id: data[0].preferredLanguageId + "",
              value: data[0].preferredLanguageValue,
            });
          }
          if (data[0].phoneNumber) {
            setPhonePresent(true);
          }
          if (data[0].previousFirstName) {
            setShowPrevName(true);
          }
          if (JSON.parse(data[0].previousAddress).is_previous_address) {
            setShowPrevAddress(true);
          }
          setPatient({
            patientFirstName: data[0].firstName,
            patientMiddleName: data[0].middleName ? data[0].middleName : "",
            patientLastName: data[0].lastName,
            patientEmail: data[0].electronicDetails,
            patientDOB: data[0].birthDate
              ? moment(new Date(data[0].birthDate)).format("YYYY-MM-DD")
              : null,
            patientPhone: data[0].phoneNumber,
            zipCode: data[0].addressZip,
            street: data[0].addressLine1,
            addressLine2: data[0].addressLine2,
            city: data[0].city,
            state: data[0].state,
            stateValue: data[0].stateValue,
            country: data[0].country,
            countryValue: data[0].countryValue,
            preferredLanguageId: data[0].preferredLanguageId,
            preferredPronouns: data[0].preferredPronounsId,
            sex: {
              id: JSON.parse(data[0].sex).id,
              value: JSON.parse(data[0].sex).value,
              other: JSON.parse(data[0].sex).other,
              otherValue: JSON.parse(data[0].sex).other_value,
            },
            gender: {
              id: JSON.parse(data[0].gender).id,
              value: JSON.parse(data[0].gender).value,
              other: JSON.parse(data[0].gender).other,
              otherValue: JSON.parse(data[0].gender).other_value,
            },
            ssn: data[0].ssn
              ? data[0].ssn.slice(0, 3) +
                "-" +
                data[0].ssn.slice(3, 5) +
                "-" +
                data[0].ssn.slice(5)
              : "",
            suffix: data[0].suffix ? data[0].suffix : "",
            previousSuffix: data[0].previousSuffix
              ? data[0].previousSuffix
              : "",
            previousFirstName: data[0].previousFirstName
              ? data[0].previousFirstName
              : "",
            previousMiddleName: data[0].previousMiddleName
              ? data[0].previousMiddleName
              : "",
            previousLastName: data[0].previousLastName
              ? data[0].previousLastName
              : "",
            isPreviousAddress: JSON.parse(data[0].previousAddress)
              .is_previous_address,
            previousAddressLine1: JSON.parse(data[0].previousAddress)
              .is_previous_address
              ? JSON.parse(data[0].previousAddress).previous_address1
              : null,
            previousAddressLine2: JSON.parse(data[0].previousAddress)
              .is_previous_address
              ? JSON.parse(data[0].previousAddress).previous_address2
              : null,
            previousCity: JSON.parse(data[0].previousAddress)
              .is_previous_address
              ? JSON.parse(data[0].previousAddress).previous_city
              : null,
            previousState: JSON.parse(data[0].previousAddress)
              .is_previous_address
              ? JSON.parse(data[0].previousAddress).previous_state_id
              : null,
            previousCountry: JSON.parse(data[0].previousAddress)
              .is_previous_address
              ? JSON.parse(data[0].previousAddress).previous_country_id
              : null,
            previousAddressZip: JSON.parse(data[0].previousAddress)
              .is_previous_address
              ? JSON.parse(data[0].previousAddress).previous_zip
              : null,
          });
          setDisableSelection(false);
        })
        .catch((error) => error);
    }
  }
  const handleChangeAddPatient = (event: BaseSyntheticEvent) => {
    event.persist();
    if (event.target.name === "state") {
      const selectedId = event.target.options[event.target.selectedIndex].id;
      setPatient((prevFormState) => ({
        ...prevFormState,
        stateValue: selectedId,
      }));
    }

    if (event.target.name === "ssn") {
      const formattedSSN = formatSSN(event.target.value);
      setPatient((prevFormState) => ({
        ...prevFormState,
        [event.target.name]: formattedSSN,
      }));
    } else {
      setPatient((prevFormState) => ({
        ...prevFormState,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      }));
    }
    getpatient(patient);
  };
  const handleChange = (event: BaseSyntheticEvent) => {
    event.persist();
    if (event.target.name === "sexOthers") {
      setPatient((prevFormState) => ({
        ...prevFormState,
        sex: {
          ...prevFormState.sex,
          otherValue: event.target.value,
        },
      }));
    } else if (event.target.name === "genderOthers") {
      setPatient((prevFormState) => ({
        ...prevFormState,
        gender: {
          ...prevFormState.gender,
          otherValue: event.target.value,
        },
      }));
    } else {
      setPatient((prevFormState) => ({
        ...prevFormState,
        [event.target.name]: {
          id: event.target.value,
          value: event.target.options[event.target.selectedIndex].id,
          other:
            event.target.options[event.target.selectedIndex].id ===
            "Other (specify)"
              ? true
              : false,
          otherValue: "",
        },
      }));
    }
    getpatient(patient);
  };

  const handleChangePhone = (value) => {
    setPatient((prevFormState) => ({
      ...prevFormState,
      patientPhone: value,
    }));
    getpatient(patient);
  };
  const handlePrevChange = (event: BaseSyntheticEvent) => {
    event.persist();
    if (event.target.name === "prevName") {
      if (event.target.checked) {
        setShowPrevName(true);
      } else {
        setShowPrevName(false);
      }
    }
    if (event.target.name === "prevAddress") {
      if (event.target.checked) {
        setShowPrevAddress(true);
        setPatient((prevFormState: IPatientParams) => ({
          ...prevFormState,
          previousCountry: countryList[0].id + "",
          previousState: "",
          isPreviousAddress: true,
        }));
      } else {
        setShowPrevAddress(false);
        setError("previousAddressLine1", "empty", false);
        setError("previousAddressLine2", "empty", false);
        setError("previousCity", "empty", false);
        setError("previousState", "empty", false);
        setError("previousAddressZip", "empty", false);
        setPatient((prevFormState: IPatientParams) => ({
          ...prevFormState,
          previousAddressLine1: "",
          previousCity: "",
          previousAddressZip: "",
          previousCountry: "",
          previousState: "",
          isPreviousAddress: false,
        }));
      }
    }
  };

  const handleValidateOnBlur = (event: BaseSyntheticEvent) => {
    event.persist();
    let validationStatus: boolean;
    if (event.target.type !== "checkbox") {
      validationStatus = !event.target.value;
    }
    if (event.target.type === "tel" && type === "dependent") {
      if (event.target.value === "+1") {
        validationStatus = true;
        setError(event.target.name, "", false);
      } else {
        validationStatus = false;
      }
    }
    if (event.target.type === "select-one") {
      if (event.target.name === "sex") {
        if (event.target.value === "0") {
          validationStatus = true;
        } else {
          validationStatus = false;
        }
      } else if (event.target.name === "gender") {
        if (event.target.value === "0") {
          validationStatus = true;
        } else {
          validationStatus = false;
        }
      } else {
        if (event.target.value === "0" && type !== "dependent") {
          validationStatus = true;
        } else {
          validationStatus = false;
        }
      }
    }
    if (event.target.id === "preferredLanguageId") {
      if (
        event.target.value === translate("resources.patients.dropdown.lang") &&
        type !== "dependent"
      ) {
        validationStatus = true;
      } else {
        validationStatus = false;
      }
    }
    if (!validationStatus && event.target.type !== "select-one") {
      const valid = validateAddPatient(event.target.name, event.target.value);
      setError(event.target.name, !valid && ERROR_MESSAGE_KEY, !valid);
    }
    if (!validationStatus && event.target.type === "select-one") {
      setError(event.target.name, "empty", false);
    }
    if (validationStatus && event.target.name !== "patientMiddleName") {
      if (type !== "dependent") {
        setError(event.target.name, "empty", true);
      } else {
        if (
          event.target.name === "patientFirstName" ||
          event.target.name === "patientLastName" ||
          event.target.name === "patientDOB"
        ) {
          setError(event.target.name, "empty", true);
        } else {
          setError(event.target.name, "empty", false);
        }
      }
    }
    if (
      event.target.name === "patientMiddleName" &&
      event.target.value === ""
    ) {
      setError(event.target.name, "empty", false);
    }
    getpatient(patient);
  };

  const setError = (
    fieldName: string,
    type: string | undefined,
    errorFlag: boolean
  ) => {
    setErrors((prevFormState) => ({
      ...prevFormState,
      [fieldName]: {
        message: errorFlag ? addPatientErrorMessages[fieldName][type] : "",
        isInit: false,
      },
    }));
  };
  useEffect(() => {
    if (countryList?.length > 0) {
      setPatient((prevFormState: IPatientParams) => ({
        ...prevFormState,
        country: countryList[0].id + "",
        countryValue: countryList[0].value,
      }));
    }
  }, [countryList]);
  useEffect(() => {
    const tempError = { ...errors };
    if (type !== "dependent") {
      tempError.patientEmail.isInit = true;
      tempError.patientPhone.isInit = true;
      tempError.preferredLanguageId.isInit = true;
      tempError.preferredPronouns.isInit = true;
      tempError.street.isInit = true;
      tempError.city.isInit = true;
      tempError.zipCode.isInit = true;
      tempError.state.isInit = true;
    } else {
      tempError.relationshipId.isInit = true;
    }
    tempError.patientFirstName.isInit = true;
    tempError.patientLastName.isInit = true;
    tempError.suffix.isInit = true;
    tempError.previousFirstName.isInit = true;
    tempError.previousMiddleName.isInit = true;
    tempError.previousLastName.isInit = true;
    tempError.previousSuffix.isInit = true;
    tempError.patientDOB.isInit = true;
    tempError.sex.isInit = true;
    tempError.gender.isInit = true;
    setErrors(tempError);
    getCountryList();
    getStateList();
    getLanguageList();
    getSexList();
    getGenderList();
    getRelationList();
    getPronounList();
  }, []);
  useEffect(() => {
    const tempError = { ...errors };
    if (
      patient.isPreviousAddress &&
      permissions !== CO_ROLE_PATIENT &&
      type === "myself"
    ) {
      tempError.previousAddressLine1.isInit = true;
      tempError.previousAddressLine1.message = "Please enter address line1";
      tempError.previousCity.isInit = true;
      tempError.previousCity.message = "Please enter city";
      tempError.previousState.isInit = true;
      tempError.previousState.message = "Please enter state";
      tempError.previousAddressZip.isInit = true;
      tempError.previousAddressZip.message = "Please enter zip code";
    }
    setErrors(tempError);
  }, [patient.isPreviousAddress]);

  useEffect(() => {
    if (alertAddPatient) {
      const tempError = { ...errors };
      tempError.patientFirstName.isInit = false;
      tempError.patientLastName.isInit = false;
      tempError.suffix.isInit = false;
      tempError.previousFirstName.isInit = false;
      tempError.previousMiddleName.isInit = false;
      tempError.previousLastName.isInit = false;
      tempError.previousSuffix.isInit = false;
      tempError.patientDOB.isInit = false;
      tempError.sex.isInit = false;
      tempError.gender.isInit = false;
      if (Number(patient.sex.id) === 8 && patient.sex.otherValue === "") {
        tempError.sexOthers.isInit = false;
        tempError.sexOthers.message = "Please enter sex here";
      } else {
        tempError.sexOthers.isInit = true;
        tempError.sexOthers.message = "";
      }
      if (Number(patient.gender.id) === 9 && patient.gender.otherValue === "") {
        tempError.genderOthers.isInit = false;
        tempError.genderOthers.message = "Please enter gender here";
      } else {
        tempError.genderOthers.isInit = true;
        tempError.genderOthers.message = "";
      }
      if (type !== "dependent") {
        tempError.patientEmail.isInit = false;
        tempError.patientPhone.isInit = false;
        tempError.preferredLanguageId.isInit = false;
        tempError.preferredPronouns.isInit = false;
        tempError.street.isInit = false;
        tempError.city.isInit = false;
        tempError.state.isInit = false;
        tempError.zipCode.isInit = false;
      } else {
        tempError.relationshipId.isInit = false;
      }
      setErrors(tempError);
    }
  }, [alertAddPatient]);
  useEffect(() => {
    const tempError = { ...errors };
    if (patient.isPreviousAddress && alertAddPatient) {
      tempError.previousAddressLine1.isInit = false;
      tempError.previousCity.isInit = false;
      tempError.previousAddressZip.isInit = false;
      tempError.previousState.isInit = false;
    }
    setErrors(tempError);
  }, [patient.isPreviousAddress, alertAddPatient]);
  useEffect(() => {
    const isValidFlag = [];
    const isinitFlag = [];
    Object.entries(errors).forEach((indv) => {
      isValidFlag.push(!indv[1].message);
      isinitFlag.push(indv[1].isInit);
    });
    checkPatientValidator({
      isValid: !isValidFlag.includes(false),
      isInit: isinitFlag.includes(true),
    });
  }, [errors]);

  return (
    <>
      <Grid item md={3} xs={12}>
        <TextField
          margin="dense"
          label="First Name"
          error={
            errors.patientFirstName.isInit === false &&
            !!errors.patientFirstName.message
          }
          helperText={
            (errors.patientFirstName.isInit === false &&
              errors.patientFirstName.message) ||
            " "
          }
          name="patientFirstName"
          className="patientFirstName"
          id="patientFirstName"
          variant="standard"
          InputProps={{
            readOnly: isPatient,
            autoComplete: "off",
          }}
          fullWidth
          required
          onBlur={(e) => handleValidateOnBlur(e)}
          onChange={handleChangeAddPatient}
          SelectProps={{ native: true }}
          value={patient.patientFirstName}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <TextField
          fullWidth
          margin="dense"
          label="Middle Name"
          error={
            errors.patientMiddleName.isInit === false &&
            !!errors.patientMiddleName.message
          }
          helperText={
            (errors.patientMiddleName.isInit === false &&
              errors.patientMiddleName.message) ||
            " "
          }
          InputLabelProps={{
            shrink: patient.patientMiddleName ? true : false,
          }}
          name="patientMiddleName"
          onBlur={(e) => handleValidateOnBlur(e)}
          onChange={handleChangeAddPatient}
          value={patient.patientMiddleName}
          variant="standard"
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <TextField
          fullWidth
          margin="dense"
          label="Last Name"
          error={
            errors.patientLastName.isInit === false &&
            !!errors.patientLastName.message
          }
          helperText={
            (errors.patientLastName.isInit === false &&
              errors.patientLastName.message) ||
            " "
          }
          InputProps={{
            readOnly: isPatient,
            autoComplete: "off",
          }}
          name="patientLastName"
          onBlur={(e) => handleValidateOnBlur(e)}
          onChange={handleChangeAddPatient}
          required
          value={patient.patientLastName}
          variant="standard"
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <TextField
          fullWidth
          margin="dense"
          label="Suffix"
          error={errors.suffix.isInit === false && !!errors.suffix.message}
          helperText={
            (errors.suffix.isInit === false && errors.suffix.message) || " "
          }
          name="suffix"
          InputLabelProps={{
            shrink: patient.suffix ? true : false,
          }}
          onBlur={(e) => handleValidateOnBlur(e)}
          onChange={handleChangeAddPatient}
          value={patient.suffix}
          variant="standard"
        />
      </Grid>
      <Grid
        item
        md={12}
        xs={12}
        style={{ padding: "0px", paddingLeft: "12px" }}
      >
        <FormControlLabel
          name="prevName"
          onChange={handlePrevChange}
          control={<Checkbox color="primary" checked={showPrevName} />}
          label={
            <Typography variant="body2" color="textSecondary">
               Have you used any other names since birth (i.e, maiden name,
              previous legal name, preferred name)?
            </Typography>
          }
        />
      </Grid>
      {showPrevName && (
        <>
          <Grid item md={12} xs={12}>
            <Typography variant="body2" color="textSecondary">
              Full name at birth if different than above :
            </Typography>
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              margin="dense"
              label="Previous First Name"
              error={
                errors.previousFirstName.isInit === false &&
                !!errors.previousFirstName.message
              }
              helperText={
                (errors.previousFirstName.isInit === false &&
                  errors.previousFirstName.message) ||
                " "
              }
              InputLabelProps={{
                shrink: patient.previousFirstName ? true : false,
              }}
              name="previousFirstName"
              className="previousFirstName"
              id="previousFirstName"
              variant="standard"
              fullWidth
              onBlur={(e) => handleValidateOnBlur(e)}
              onChange={handleChangeAddPatient}
              SelectProps={{ native: true }}
              value={patient.previousFirstName}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              margin="dense"
              label="Previous Middle Name"
              InputLabelProps={{
                shrink: patient.previousMiddleName ? true : false,
              }}
              error={
                errors.previousMiddleName.isInit === false &&
                !!errors.previousMiddleName.message
              }
              helperText={
                (errors.previousMiddleName.isInit === false &&
                  errors.previousMiddleName.message) ||
                " "
              }
              name="previousMiddleName"
              onBlur={(e) => handleValidateOnBlur(e)}
              onChange={handleChangeAddPatient}
              value={patient.previousMiddleName}
              variant="standard"
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              margin="dense"
              label="Previous Last Name"
              error={
                errors.previousLastName.isInit === false &&
                !!errors.previousLastName.message
              }
              helperText={
                (errors.previousLastName.isInit === false &&
                  errors.previousLastName.message) ||
                " "
              }
              InputLabelProps={{
                shrink: patient.previousLastName ? true : false,
              }}
              name="previousLastName"
              onBlur={(e) => handleValidateOnBlur(e)}
              onChange={handleChangeAddPatient}
              value={patient.previousLastName}
              variant="standard"
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <TextField
              fullWidth
              margin="dense"
              label="Previous Suffix"
              InputLabelProps={{
                shrink: patient.previousSuffix ? true : false,
              }}
              error={
                errors.previousSuffix.isInit === false &&
                !!errors.previousSuffix.message
              }
              helperText={
                (errors.previousSuffix.isInit === false &&
                  errors.previousSuffix.message) ||
                " "
              }
              name="previousSuffix"
              onBlur={(e) => handleValidateOnBlur(e)}
              onChange={handleChangeAddPatient}
              value={patient.previousSuffix}
              variant="standard"
            />
          </Grid>
        </>
      )}

      <Grid item md={4} xs={12}>
        <TextField
          fullWidth
          error={
            errors.patientEmail.isInit === false &&
            !!errors.patientEmail.message
          }
          helperText={
            (errors.patientEmail.isInit === false &&
              errors.patientEmail.message) ||
            " "
          }
          InputProps={{
            readOnly: isPatient,
            autoComplete: "off",
          }}
          InputLabelProps={{
            shrink: patient.patientEmail ? true : false,
          }}
          margin="dense"
          label="Email Address"
          name="patientEmail"
          onBlur={(e) => handleValidateOnBlur(e)}
          onChange={handleChangeAddPatient}
          required={type === "dependent" ? false : true}
          value={patient.patientEmail}
          variant="standard"
        />
      </Grid>
      <Grid item md={4} xs={12}>
        <MuiPhoneNumber
          defaultCountry={"us"}
          onlyCountries={["us"]}
          disableAreaCodes={true}
          countryCodeEditable={false}
          fullWidth
          error={
            errors.patientPhone.isInit === false &&
            !!errors.patientPhone.message
          }
          helperText={
            (errors.patientPhone.isInit === false &&
              errors.patientPhone.message) ||
            " "
          }
          margin="dense"
          label="Phone Number"
          required={type === "dependent" ? false : true}
          name="patientPhone"
          onBlur={(e) => handleValidateOnBlur(e)}
          onChange={handleChangePhone}
          value={patient.patientPhone}
          variant="standard"
        />
      </Grid>

      <Grid item md={4} xs={12}>
        <div>
          <DatePickerWithMonthAndYearDropdown
            handleChangeFunction={handleChangeDOB}
            handleValidateOnBlurFunction={handleValidateOnBlur}
            errorStatus={
              errors.patientDOB.isInit === false && errors.patientDOB.message
            }
            errorMessage={errors.patientDOB.message}
            selectedDate={selectedDate}
            id={"patientDOB"}
            label={
              <>
                Date of Birth <sup>*</sup>
              </>
            }
          />
        </div>
      </Grid>

      <Grid item md={type === "dependent" ? 3 : 4} xs={12}>
        <Autocomplete
          id="preferredLanguageId"
          options={languageList}
          disableClearable
          autoHighlight
          value={lang}
          style={{ fontSize: "14px" }}
          getOptionLabel={(option) => option.value}
          onChange={(event, newValue) => {
            if (newValue) {
              const { id, value } = newValue;
              setLang({ id: id + "", value: value });
              setPatient((prevFormState) => ({
                ...prevFormState,
                ["preferredLanguageId"]: id + "",
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
              error={
                errors.preferredLanguageId.isInit === false &&
                !!errors.preferredLanguageId.message
              }
              helperText={
                (errors.preferredLanguageId.isInit === false &&
                  errors.preferredLanguageId.message) ||
                " "
              }
              onBlur={(e) => handleValidateOnBlur(e)}
              margin="dense"
              label="Preferred Language"
              name="preferredLanguageId"
              required={type === "dependent" ? false : true}
              style={{ fontSize: "14px" }}
              value={patient.preferredLanguageId}
              variant="standard"
            />
          )}
        />
      </Grid>
      <Grid item md={type === "dependent" ? 3 : 4} xs={12}>
        <TextField
          fullWidth
          margin="dense"
          name="preferredPronouns"
          label="Preferred Pronouns"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChangeAddPatient}
          required={type === "dependent" ? false : true}
          style={{ fontSize: "14px" }}
          error={
            errors.preferredPronouns.isInit === false &&
            !!errors.preferredPronouns.message
          }
          helperText={
            (errors.preferredPronouns.isInit === false &&
              errors.preferredPronouns.message) ||
            " "
          }
          onBlur={(e) => handleValidateOnBlur(e)}
          select
          // eslint-disable-next-line react/jsx-sort-props
          SelectProps={{ native: true }}
          value={patient.preferredPronouns}
          variant="standard"
        >
          <option key={0} value="0" hidden>
            {translate("resources.patients.dropdown.preferredPronouns")}
          </option>
          {pronounList.map((option) => (
            <option key={option.id} value={option.id}>
              {option.value}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item md={type === "dependent" ? 3 : 4} xs={12}>
        <TextField
          margin="dense"
          label="SSN (optional)"
          error={errors.ssn.isInit === false && !!errors.ssn.message}
          helperText={
            (errors.ssn.isInit === false && errors.ssn.message) || " "
          }
          name="ssn"
          className="ssn"
          id="ssn"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          onBlur={(e) => handleValidateOnBlur(e)}
          onChange={handleChangeAddPatient}
          SelectProps={{ native: true }}
          value={patient.ssn}
          placeholder="xxx-xx-xxxx"
          inputProps={{
            pattern: "\\d{3}-\\d{2}-\\d{4}",
            maxLength: 11,
            autoComplete: "off",
          }}
        />
      </Grid>
      {type === "dependent" && (
        <Grid item md={3} xs={12}>
          <TextField
            fullWidth
            margin="dense"
            name="relationshipId"
            label="Relation"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChangeAddPatient}
            required
            style={{ fontSize: "14px" }}
            error={
              errors.relationshipId.isInit === false &&
              !!errors.relationshipId.message
            }
            helperText={
              (errors.relationshipId.isInit === false &&
                errors.relationshipId.message) ||
              " "
            }
            onBlur={(e) => handleValidateOnBlur(e)}
            select
            SelectProps={{ native: true }}
            value={patient.relationshipId}
            variant="standard"
          >
            <option key={0} value="0" hidden>
              {translate("auth.dropdown.relation")}
            </option>
            {relationList.map((option) => (
              <option key={option.id} value={option.id}>
                {option.value}
              </option>
            ))}
          </TextField>
        </Grid>
      )}
      <Grid item md={3} xs={12}>
        <TextField
          fullWidth
          margin="dense"
          name="sex"
          label="Sex Assigned at Birth"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
          required
          style={{ fontSize: "14px" }}
          error={errors.sex.isInit === false && !!errors.sex.message}
          helperText={
            (errors.sex.isInit === false && errors.sex.message) || " "
          }
          onBlur={(e) => handleValidateOnBlur(e)}
          select
          SelectProps={{ native: true }}
          value={patient.sex.id}
          variant="standard"
        >
          <option key={0} value="0" hidden>
            {translate("resources.patients.dropdown.sex")}
          </option>
          {sexList.map((option) => (
            <option key={option.id} value={option.id} id={option.value}>
              {option.value}
            </option>
          ))}
        </TextField>
      </Grid>
      {Number(patient.sex.id) === 8 && (
        <Grid item md={3} xs={12}>
          <TextField
            fullWidth
            margin="dense"
            label="Please specify sex"
            required
            error={
              errors.sexOthers.isInit === false && !!errors.sexOthers.message
            }
            helperText={
              (errors.sexOthers.isInit === false && errors.sexOthers.message) ||
              " "
            }
            name="sexOthers"
            onBlur={(e) => handleValidateOnBlur(e)}
            onChange={handleChange}
            value={patient.sex.otherValue}
            variant="standard"
          />
        </Grid>
      )}
      <Grid item md={3} xs={12}>
        <TextField
          fullWidth
          margin="dense"
          name="gender"
          label="Gender"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
          required
          style={{ fontSize: "14px" }}
          error={errors.gender.isInit === false && !!errors.gender.message}
          helperText={
            (errors.gender.isInit === false && errors.gender.message) || " "
          }
          onBlur={(e) => handleValidateOnBlur(e)}
          select
          SelectProps={{ native: true }}
          value={patient.gender.id}
          variant="standard"
        >
          <option key={0} value="0" hidden>
            {translate("resources.patients.dropdown.gender")}
          </option>
          {genderList.map((option) => (
            <option key={option.id} value={option.id} id={option.value}>
              {option.value}
            </option>
          ))}
        </TextField>
      </Grid>
      {Number(patient.gender.id) === 9 && (
        <Grid item md={3} xs={12}>
          <TextField
            fullWidth
            margin="dense"
            label="Please specify gender"
            required
            error={
              errors.genderOthers.isInit === false &&
              !!errors.genderOthers.message
            }
            helperText={
              (errors.genderOthers.isInit === false &&
                errors.genderOthers.message) ||
              " "
            }
            name="genderOthers"
            onBlur={(e) => handleValidateOnBlur(e)}
            onChange={handleChange}
            value={patient.gender.otherValue}
            variant="standard"
          />
        </Grid>
      )}
      <Root item md={12} xs={12} className={classes.address}>
        <Typography
          style={{ fontSize: 14, position: "absolute", marginTop: "-15px" }}
          color="textPrimary"
          gutterBottom
        >
          Address
        </Typography>
        <TextField
          fullWidth
          margin="dense"
          label="Address Line1"
          name="street"
          error={errors.street.isInit === false && !!errors.street.message}
          helperText={
            (errors.street.isInit === false && errors.street.message) || " "
          }
          onChange={handleChangeAddPatient}
          required={type === "dependent" ? false : true}
          inputProps={{
            autoComplete: "off",
          }}
          onBlur={(e) => handleValidateOnBlur(e)}
          value={patient.street}
          variant="standard"
        />
        <TextField
          fullWidth
          margin="dense"
          label="Address Line2"
          name="addressLine2"
          inputProps={{
            autoComplete: "off",
          }}
          error={
            errors.addressLine2.isInit === false &&
            !!errors.addressLine2.message
          }
          helperText={
            (errors.addressLine2.isInit === false &&
              errors.addressLine2.message) ||
            " "
          }
          onChange={handleChangeAddPatient}
          onBlur={(e) => handleValidateOnBlur(e)}
          value={patient.addressLine2}
          variant="standard"
        />
        <TextField
          fullWidth
          margin="dense"
          label="City"
          name="city"
          inputProps={{
            autoComplete: "off",
          }}
          error={errors.city.isInit === false && !!errors.city.message}
          helperText={
            (errors.city.isInit === false && errors.city.message) || " "
          }
          onChange={handleChangeAddPatient}
          onBlur={(e) => handleValidateOnBlur(e)}
          value={patient.city}
          required={type === "dependent" ? false : true}
          variant="standard"
        />
        <TextField
          fullWidth
          label="Country"
          margin="dense"
          name="country"
          onChange={handleChangeAddPatient}
          required={type === "dependent" ? false : true}
          select
          InputLabelProps={{
            shrink: true,
          }}
          SelectProps={{ native: true }}
          value={patient.country}
          variant="standard"
        >
          {countryList.map((option) => (
            <option key={option.id} value={option.id}>
              {option.value}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="State"
          margin="dense"
          name="state"
          onChange={handleChangeAddPatient}
          required={type === "dependent" ? false : true}
          select
          InputLabelProps={{
            shrink: true,
          }}
          error={errors.state.isInit === false && !!errors.state.message}
          helperText={
            (errors.state.isInit === false && errors.state.message) || " "
          }
          onBlur={(e) => handleValidateOnBlur(e)}
          SelectProps={{ native: true }}
          value={patient.state}
          variant="standard"
        >
          <option key={0} value="0" hidden>
            {translate("resources.patients.dropdown.state")}
          </option>
          {stateList.map((option) => (
            <option key={option.id} value={option.id} id={option.value}>
              {option.value}
            </option>
          ))}
        </TextField>
        <TextField
          fullWidth
          margin="dense"
          label="Zip Code"
          name="zipCode"
          error={errors.zipCode.isInit === false && !!errors.zipCode.message}
          helperText={
            (errors.zipCode.isInit === false && errors.zipCode.message) || " "
          }
          onChange={handleChangeAddPatient}
          onBlur={(e) => handleValidateOnBlur(e)}
          inputProps={{
            autoComplete: "off",
            maxLength: 5,
          }}
          value={patient.zipCode}
          required={type === "dependent" ? false : true}
          variant="standard"
        />
      </Root>

      <Grid
        item
        md={12}
        xs={12}
        style={{ padding: "0px", paddingLeft: "12px" }}
      >
        <FormControlLabel
          name="prevAddress"
          onChange={handlePrevChange}
          control={<Checkbox color="primary" checked={showPrevAddress} />}
          label={
            <Typography variant="body2" color="textSecondary">
              Is there a prior or alternative address?
            </Typography>
          }
        />
      </Grid>
      {showPrevAddress && (
        <Grid item md={12} xs={12} className={classes.address}>
          <TextField
            fullWidth
            margin="dense"
            label="Address Line1"
            name="previousAddressLine1"
            error={
              errors.previousAddressLine1.isInit === false &&
              !!errors.previousAddressLine1.message &&
              patient.isPreviousAddress
            }
            helperText={
              (errors.previousAddressLine1.isInit === false &&
                errors.previousAddressLine1.message) ||
              " "
            }
            onChange={handleChangeAddPatient}
            onBlur={(e) => handleValidateOnBlur(e)}
            value={patient.previousAddressLine1}
            variant="standard"
          />
          <TextField
            fullWidth
            margin="dense"
            label="Address Line2"
            name="previousAddressLine2"
            error={
              errors.previousAddressLine2.isInit === false &&
              !!errors.previousAddressLine2.message &&
              patient.isPreviousAddress
            }
            helperText={
              (errors.previousAddressLine2.isInit === false &&
                errors.previousAddressLine2.message) ||
              " "
            }
            onChange={handleChangeAddPatient}
            onBlur={(e) => handleValidateOnBlur(e)}
            value={patient.previousAddressLine2}
            variant="standard"
          />
          <TextField
            fullWidth
            margin="dense"
            label="City"
            name="previousCity"
            error={
              errors.previousCity.isInit === false &&
              !!errors.previousCity.message &&
              patient.isPreviousAddress
            }
            helperText={
              (errors.previousCity.isInit === false &&
                errors.previousCity.message) ||
              " "
            }
            onChange={handleChangeAddPatient}
            onBlur={(e) => handleValidateOnBlur(e)}
            value={patient.previousCity}
            variant="standard"
          />
          <TextField
            fullWidth
            label="Country"
            margin="dense"
            name="previousCountry"
            onChange={handleChangeAddPatient}
            select
            InputLabelProps={{
              shrink: true,
            }}
            SelectProps={{ native: true }}
            value={patient.previousCountry}
            variant="standard"
          >
            {countryList.map((option) => (
              <option key={option.id} value={option.id}>
                {option.value}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="State"
            margin="dense"
            name="previousState"
            onChange={handleChangeAddPatient}
            select
            InputLabelProps={{
              shrink: true,
            }}
            error={
              errors.previousState.isInit === false &&
              !!errors.previousState.message &&
              patient.isPreviousAddress
            }
            helperText={
              (errors.previousState.isInit === false &&
                errors.previousState.message) ||
              " "
            }
            onBlur={(e) => handleValidateOnBlur(e)}
            SelectProps={{ native: true }}
            value={patient.previousState}
            variant="standard"
          >
            <option key={0} value="0" hidden>
              {translate("resources.patients.dropdown.state")}
            </option>
            {stateList.map((option) => (
              <option key={option.id} value={option.id}>
                {option.value}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="dense"
            label="Zip Code"
            name="previousAddressZip"
            error={
              errors.previousAddressZip.isInit === false &&
              !!errors.previousAddressZip.message &&
              patient.isPreviousAddress
            }
            helperText={
              (errors.previousAddressZip.isInit === false &&
                errors.previousAddressZip.message) ||
              " "
            }
            inputProps={{
              maxLength: 5,
            }}
            onChange={handleChangeAddPatient}
            onBlur={(e) => handleValidateOnBlur(e)}
            value={patient.previousAddressZip}
            variant="standard"
          />
        </Grid>
      )}
    </>
  );
}

AddPatient.propTypes = {
  checkPatientValidator: PropTypes.bool,
};

export default AddPatient;
