import moment from "moment";
import type { BaseSyntheticEvent } from "react";
import { useState } from "react";
import { useTranslate } from "react-admin";
import {
  addPatientErrorMessages,
  ERROR_MESSAGE_KEY,
} from "../../utils/messages/errorMessages";
import { CREATE_MEDICAL_RECORD_ERROR_INIT } from "../../utils/messages/initializeConstants";
import {
  validateAlphaNumeric,
  validateMRN,
  validatePhone,
  validateSentance,
} from "../../utils/validator";
const useHandleValidateOnBlur = ({ DOB, formvalues }) => {
  const translate = useTranslate();
  const [howLongStatus, setHowLongStatus] = useState(false);
  const [howLongUnitStatus, setHowLongUnitStatus] = useState(false);
  const [sourceStatus, setSourceStatus] = useState(false);
  const [requestTypeStatus, setRequestTypeStatus] = useState(false);
  const [sourceInstitutionStatus, setSourceInstitutionStatus] = useState(false);
  const [priorityStatus, setPriorityStatus] = useState(false);
  const [departmentStatus, setDepartmentStatus] = useState(false);
  const [assignedToStatus, setAssignedToStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState(CREATE_MEDICAL_RECORD_ERROR_INIT);
  const handleValidateOnBlur = (event: BaseSyntheticEvent) => {
    event.persist();
    let validationStatus: boolean;
    if (event.target.type !== "checkbox") {
      validationStatus = !event.target.value;
    }
    if (!validationStatus) {
      switch (event.target.name) {
        case "mrn": {
          if (event.target.value !== "") {
            const valid = validateMRN(event.target.value);
            setError(event.target.name, !valid && ERROR_MESSAGE_KEY, !valid);
          }
          break;
        }
        case "recordsFrom": {
          const valid =
            moment(event.target.value).isAfter(new Date()) ||
            moment(event.target.value).isBefore(DOB) ||
            moment(event.target.value).isAfter(formvalues.recordsTo);
          setError(event.target.name, valid && ERROR_MESSAGE_KEY, valid);
          break;
        }
        case "recordsTo": {
          const valid =
            moment(event.target.value).isAfter(new Date()) ||
            moment(event.target.value).isBefore(formvalues.recordsFrom);
          setError(event.target.name, valid && ERROR_MESSAGE_KEY, valid);
          break;
        }
        case "faxNumber": {
          const valid = validatePhone(event.target.value);
          setError(event.target.name, !valid && ERROR_MESSAGE_KEY, !valid);
          break;
        }
        case "thirdPartyApps": {
          const valid = validateAlphaNumeric(event.target.value);
          setError(event.target.name, !valid && ERROR_MESSAGE_KEY, !valid);
          break;
        }
        case "phr": {
          const valid = validateAlphaNumeric(event.target.value);
          setError(event.target.name, !valid && ERROR_MESSAGE_KEY, !valid);
          break;
        }
        case "requestTypeOther": {
          if (formvalues.rti.id === 8) {
            const valid = validateSentance(event.target.value);
            setError(event.target.name, !valid && ERROR_MESSAGE_KEY, !valid);
          }
          break;
        }
        case "requestType": {
          if (
            event.target.value ===
            translate("resources.requests.dropdown.requestType")
          ) {
            setRequestTypeStatus(true);
          } else {
            setRequestTypeStatus(false);
          }
          if (formvalues.rti.id !== 8) {
            setError("requestTypeOther", "", false);
          }
          break;
        }
        case "sourceNature": {
          if (
            event.target.value ===
            translate("resources.requests.dropdown.sourceNature")
          ) {
            setSourceStatus(true);
          } else {
            setSourceStatus(false);
          }
          break;
        }
        case "sourceInstitution": {
          if (
            event.target.value ===
            translate("resources.requests.dropdown.sourceInstitution")
          ) {
            setSourceInstitutionStatus(true);
          } else {
            setSourceInstitutionStatus(false);
          }
          break;
        }
        case "department": {
          if (
            event.target.value ===
            translate("resources.requests.dropdown.department")
          ) {
            setDepartmentStatus(true);
          } else {
            setDepartmentStatus(false);
          }
          break;
        }
        case "requestPriority": {
          if (event.target.value === "0") {
            setPriorityStatus(true);
          } else {
            setPriorityStatus(false);
          }
          break;
        }
        case "howLong": {
          if (event.target.value !== "0") {
            setHowLongStatus(false);
          }
          if (
            (event.target.value === "0" ||
              event.target.value ===
                translate("resources.requests.dropdown.duration")) &&
            howLongUnitStatus
          ) {
            setHowLongUnitStatus(false);
          }
          break;
        }
        case "howLongUnit": {
          if (
            event.target.value !==
            translate("resources.requests.dropdown.periodType")
          ) {
            setHowLongUnitStatus(false);
          }
          if (
            event.target.value ===
              translate("resources.requests.dropdown.periodType") &&
            howLongStatus
          ) {
            setHowLongStatus(false);
          }
          break;
        }
        default: {
          setError(event.target.name, "", false);
          break;
        }
      }
    }
    if (validationStatus) {
      if (event.target.name === "mrn") {
        setError(event.target.name, "", false);
      } else {
        setError(event.target.name, "empty", true);
      }
    }
  };
  const setError = (fieldName: string, type: string, setError: boolean) => {
    setErrorMsg((prevFormState) => ({
      ...prevFormState,
      [fieldName]: {
        0: setError,
        1: setError ? addPatientErrorMessages[fieldName][type] : "",
      },
    }));
  };
  return {
    handleValidateOnBlur,
    howLongStatus,
    howLongUnitStatus,
    sourceStatus,
    requestTypeStatus,
    setError,
    sourceInstitutionStatus,
    priorityStatus,
    departmentStatus,
    assignedToStatus,
    setHowLongStatus,
    setHowLongUnitStatus,
    setSourceStatus,
    setRequestTypeStatus,
    setSourceInstitutionStatus,
    setPriorityStatus,
    setDepartmentStatus,
    setAssignedToStatus,
    errorMsg,
    setErrorMsg,
  };
};

export default useHandleValidateOnBlur;
