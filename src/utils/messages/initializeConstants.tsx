export const ADD_PATIENT_FORM_INIT = {
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
  ssn: null,
  preferredLanguageId: "",
  state: "",
  sex: {
    id: null,
    value: "",
    other: false,
    otherValue: "",
  },
  gender: {
    id: null,
    value: "",
    other: false,
    otherValue: "",
  },
  preferredPronouns: "",
  relationshipId: null,
  suffix: "",
  previousSuffix: "",
  previousFirstName: "",
  previousMiddleName: "",
  previousLastName: "",
  previousAddressLine1: "",
  previousAddressLine2: "",
  previousAddressZip: "",
  previousCity: "",
  previousState: "",
  previousCountry: "",
  isPreviousAddress: false,
  stateValue: "",
  countryValue: "",
};
export const ADD_PROFILE_FORM_INIT = {
  firstName: "",
  middleName: "",
  lastName: "",
  electronicDetails: "",
  birthDate: "",
  number: "",
  addressZip: "",
  addressLine1: "",
  addressLine2: "",
  // directAddress: "",
  city: "",
  ssn: null,
  state: null,
  previousFirstName: null,
  previousMiddleName: null,
  previousLastName: null,
  preferredLanguageId: null,
  preferredPronouns: null,
  isPreviousAddress: false,
  previousAddressLine1: null,
  previousAddressLine2: null,
  previousCity: null,
  previousState: null,
  previousCountry: null,
  previousAddressZip: null,
  relationshipId: null,
  suffix: null,
  personType: null,
  sex: {
    id: null,
    value: "",
    other: false,
    otherValue: "",
  },
  gender: {
    id: null,
    value: "",
    other: false,
    otherValue: "",
  },
  country: null,
};
export const ADD_NEW_PATIENT_FORM_INIT = {
  pdr: {
    firstName: "",
    middleName: "",
    lastName: "",
    previousFirstName: "",
    previousMiddleName: "",
    previousLastName: "",
    directAddress: "",
    sex: {
      id: null,
      value: "",
      other: false,
      otherValue: "",
    },
    gender: {
      id: null,
      value: "",
      other: false,
      otherValue: "",
    },
    preferredLanguageId: null,
    suffix: "",
    previousSuffix: "",
    preferredPronouns: null,
    electronicDetails: "",
    birthDate: "",
    personType: null,
    number: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: null,
    country: null,
    addressZip: "",
    isPreviousAddress: false,
    previousAddressLine1: "",
    previousAddressLine2: "",
    previousCity: "",
    previousState: null,
    previousCountry: null,
    previousAddressZip: "",
    ssn: null,
    relationshipId: null,
  },
};
export const PROFILE_ERROR_INIT = {
  firstName: {
    status: false,
    message: "",
  },
  middleName: {
    status: false,
    message: "",
  },
  lastName: {
    status: false,
    message: "",
  },
  birthDate: {
    status: false,
    message: "",
  },
  electronicDetails: {
    status: false,
    message: "",
  },
  preferredLanguageId: {
    status: false,
    message: "",
  },
  preferredPronouns: {
    status: false,
    message: "",
  },
  directAddress: {
    status: false,
    message: "",
  },
  number: {
    status: false,
    message: "",
  },
  ssn: {
    status: false,
    message: "",
  },
  sex: {
    status: false,
    message: "",
  },
  gender: {
    status: false,
    message: "",
  },
  sexOthers: {
    status: false,
    message: "",
  },
  genderOthers: {
    status: false,
    message: "",
  },
  addressLine1: {
    status: false,
    message: "",
  },
  addressLine2: {
    status: false,
    message: "",
  },
  city: {
    status: false,
    message: "",
  },
  state: {
    status: false,
    message: "",
  },
  addressZip: {
    status: false,
    message: "",
  },
};
export const DEPENDENT_ERROR_INIT = {
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
};
export const ADD_NEW_PATIENT_FORM_ERROR_INIT = {
  firstName: {
    isInit: true,
    message: "First name is mandatory",
  },
  middleName: {
    isInit: false,
    message: "",
  },
  lastName: {
    isInit: true,
    message: "Last name is mandatory",
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
  sexId: {
    isInit: true,
    message: "Sex is mandatory",
  },
  preferredLanguageId: {
    isInit: true,
    message: "Preferred language is mandatory",
  },
  suffix: {
    isInit: true,
    message: "",
  },
  previousSuffix: {
    isInit: true,
    message: "",
  },
  preferredPronouns: {
    isInit: true,
    message: "Preferred pronouns is mandatory",
  },
  electronicDetails: {
    isInit: true,
    message: "Email is mandatory",
  },
  birthDate: {
    isInit: true,
    message: "Date of birth is mandatory",
  },
  gender: {
    isInit: true,
    message: "",
  },
  number: {
    isInit: true,
    message: "Phone number is mandatory",
  },
  addressLine1: {
    isInit: true,
    message: "Address line1 is mandatory",
  },
  addressLine2: {
    isInit: true,
    message: "",
  },
  city: {
    isInit: true,
    message: "City is mandatory",
  },
  state: {
    isInit: true,
    message: "State is mandatory",
  },
  addressZip: {
    isInit: true,
    message: "Zip code is mandatory",
  },
  isPreviousAddress: {
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
  previousCity: {
    isInit: true,
    message: "",
  },
  previousState: {
    isInit: true,
    message: "",
  },
  previousAddressZip: {
    isInit: true,
    message: "",
  },
  ssn: {
    isInit: true,
    message: "",
  },
};

export const CREATE_MEDICAL_RECORD_ERROR_INIT = {
  mrn: {
    0: false,
    1: "",
  },
  pan: {
    0: false,
    1: "",
  },
  faxNumber: {
    0: false,
    1: "",
  },
  thirdPartyApps: {
    0: false,
    1: "",
  },
  phr: {
    0: false,
    1: "",
  },
  requesterAddress: {
    0: false,
    1: "",
  },
  physicianAddress: {
    0: false,
    1: "",
  },
  recordsFrom: {
    0: false,
    1: "",
  },
  requestTypeOther: {
    0: false,
    1: "",
  },
  recordsTo: {
    0: false,
    1: "",
  },
  MRR: {
    0: false,
    1: "",
  },
  HIPAA: {
    0: false,
    1: "",
  },
  SOD: {
    0: false,
    1: "",
  },
  PR: {
    0: false,
    1: "",
  },
};
export const CREATE_ADDENDUM_REQUEST_ERROR_INIT = {
  mrn: {
    0: false,
    1: "",
  },
  provider: {
    0: false,
    1: "",
  },
  servicedDate: {
    0: false,
    1: "",
  },
  MRR: {
    0: false,
    1: "",
  },
  ARR: {
    0: false,
    1: "",
  },
  changeRequest: {
    0: false,
    1: "",
  },
  reason: {
    0: false,
    1: "",
  },
  assignedTo: {
    0: false,
    1: "",
  },
};
export const AUTH_FORM_ERROR_INIT = {
  authorization_others: {
    0: false,
    1: "",
  },
  time_period_from: {
    0: false,
    1: "",
  },
  time_period_to: {
    0: false,
    1: "",
  },
  authorization_service_providers_others: {
    0: false,
    1: "",
  },
  disorder_treatment_program: {
    0: false,
    1: "",
  },
  receive_person: {
    0: false,
    1: "",
  },
  purpose: {
    0: false,
    1: "",
  },
  authorization_expire_event: {
    0: false,
    1: "",
  },
  authorization_expire_date: {
    0: false,
    1: "",
  },
};
export const INTEGRATION_ERROR_INIT = {
  systemName: {
    status: false,
    message: "",
  },
  description: {
    status: false,
    message: "",
  },
  logoFileId: {
    status: false,
    message: "",
  },
  recordStatusId: {
    status: false,
    message: "",
  },
  systemCode: {
    status: false,
    message: "",
  },
};
