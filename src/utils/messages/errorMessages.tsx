export const ERROR_MESSAGE_KEY = "invalid";
export const addPatientErrorMessages = {
  mrn: {
    invalid: "Only alphanumeric characters are allowed",
  },
  pan: {
    invalid: "Only alphanumeric characters are allowed",
  },
  patientFirstName: {
    empty: "First Name is mandatory",
    invalid: "Name can only contain letters or spaces",
  },
  patientMiddleName: {
    invalid: "Name can only contain letters or spaces",
  },
  patientLastName: {
    empty: "Last Name is mandatory",
    invalid: "Name can only contain letters or spaces",
  },
  patientEmail: {
    empty: "Email is mandatory",
    invalid: "Please enter a valid email",
  },
  patientDOB: {
    empty: "Date of birth is mandatory",
    invalid: "Please enter a valid date of birth",
  },
  patientPhone: {
    empty: "Phone number is mandatory",
    invalid: "Please enter a valid phone number",
  },
  zipCode: {
    empty: "Zip code is mandatory",
    invalid: "Please enter a valid zip code",
  },
  street: {
    empty: "Address line1 is mandatory",
    invalid: "Please enter a valid address line1",
  },
  addressLine2: {
    invalid: "Please enter a valid address line2",
  },
  city: {
    empty: "City is mandatory",
    invalid: "Please enter a valid city",
  },
  state: {
    empty: "State is mandatory",
  },
  ssn: {
    invalid: "SSN must be in format xxx-xx-xxxx",
  },
  genderOthers: {
    invalid: "Please enter a valid gender",
    empty: "Please enter gender here",
  },
  sexOthers: {
    invalid: "Please enter a valid sex",
    empty: "Please enter sex here",
  },
  preferredPronouns: {
    empty: "Preferred Pronouns is mandatory",
  },
  previousFirstName: {
    invalid: "Name can only contain letters or spaces",
  },
  previousMiddleName: {
    invalid: "Name can only contain letters or spaces",
  },
  previousLastName: {
    invalid: "Name can only contain letters or spaces",
  },
  previousAddressLine1: {
    empty: "Please enter address line1",
    invalid: "Please enter a valid address line1",
  },
  previousAddressLine2: {
    invalid: "Please enter a valid address line2",
  },
  previousAddressZip: {
    empty: "Please enter a zip code",
    invalid: "Please enter a valid zip code",
  },
  suffix: {
    invalid: "Please enter a valid suffix",
  },
  previousSuffix: {
    invalid: "Please enter a valid suffix",
  },
  previousCity: {
    empty: "Please enter a city",
    invalid: "Please enter a valid city",
  },
  preferredLanguageId: {
    empty: "Preferred language is mandatory",
  },
  sex: {
    empty: "Sex is mandatory",
  },
  gender: {
    empty: "Gender is mandatory",
  },
  previousState: {
    empty: "Please select a state",
  },
  recordsFrom: {
    invalid:
      "Date is invalid(must be between date of birth and 'Records To' date)",
  },
  recordsTo: {
    invalid:
      "Date is invalid(must be between 'Records From' date and current date)",
  },
  faxNumber: {
    empty: "Fax number is mandatory",
    invalid: "Invalid fax number",
  },
  thirdPartyApps: {
    empty: "Other formats is mandatory",
    invalid: "Invalid format",
  },
  phr: {
    empty: "Name of PHR app is mandatory",
    invalid: "Invalid name of PHR app",
  },
  provider: {
    empty: "Physician name is mandatory",
    invalid: "Please enter a valid physician name",
  },
  servicedDate: {
    invalid:
      "Please enter a valid date of service(must be between date of birth and current date)",
  },
  sourceNature: {
    empty: "Please select a nature of source",
  },
  Priority: {
    empty: "Please select priority",
  },
  institution: {
    empty: "Please select an institution",
  },
  department: {
    empty: "Please select a department",
  },
  assignedTo: {
    empty: "Please select a MRA",
  },
  requestType: {
    empty: "Please select a request type",
  },
  requestTypeOther: {
    empty: "Please enter a request type",
    invalid: "Please enter a valid request type",
  },
  requesterAddress: {
    empty: "Please enter address of requester here",
  },
  physicianAddress: {
    empty: "Please enter address of physician/practitioner here",
  },
  howLong: {
    empty: "Please select a duration",
  },
  howLongUnit: {
    empty: "Please select a period type",
  },
  changeRequest: {
    empty:
      "This field is mandatory. Please provide a detailed description of the change you are requesting.",
    invalid:
      "Please provide a valid detailed description of the change you are requesting.",
  },
  reason: {
    empty:
      "This field is mandatory. Please provide a detailed description of the reason of the change you are requesting.",
    invalid:
      "Please provide a valid detailed description of the reason of the change you are requesting.",
  },
  problemsFaced: {
    empty: "Please select problem type",
  },
  impactFaced: {
    empty: "Please select the impact",
  },
};
export const addNewPatientErrorMessages = {
  firstName: {
    empty: "First name is mandatory",
    invalid:
      "Name can only contain letters or spaces and must contain minimum 3 letters",
  },
  middleName: {
    invalid: "Name can only contain letters or spaces",
  },
  directAddress: {
    invalid: "Invalid direct address",
  },
  lastName: {
    empty: "Last name is mandatory",
    invalid:
      "Name can only contain letters or spaces and must contain minimum 3 letters",
  },
  previousFirstName: {
    invalid: "Name can only contain letters or spaces",
  },
  previousMiddleName: {
    invalid: "Name can only contain letters or spaces",
  },
  previousLastName: {
    invalid: "Name can only contain letters or spaces",
  },
  sex: {
    empty: "Sex is mandatory",
  },
  gender: {
    empty: "Gender is mandatory",
  },
  genderOthers: {
    invalid: "Please enter a valid gender",
    empty: "Please enter gender here",
  },
  sexOthers: {
    invalid: "Please enter a valid sex",
    empty: "Please enter sex here",
  },

  preferredLanguageId: {
    empty: "Preferred language is mandatory",
  },
  suffix: {
    invalid: "Please enter a valid suffix",
  },
  previousSuffix: {
    invalid: "Please enter a valid suffix",
  },
  preferredPronouns: {
    empty: "Preferred pronouns is mandatory",
  },
  electronicDetails: {
    empty: "Email is mandatory",
    invalid: "Please enter a valid email",
  },
  birthDate: {
    empty: "Date of birth is mandatory",
    invalid: "Please enter a valid date of birth",
  },
  number: {
    empty: "Phone number is mandatory",
    invalid: "Please enter a valid phone number",
  },
  addressLine1: {
    empty: "Address line 1 is mandatory",
    invalid: "Please enter a valid address line 1",
  },
  addressLine2: {
    invalid: "Please enter a valid address line 2",
  },
  city: {
    empty: "City is mandatory",
    invalid: "Please enter a valid city",
  },
  state: {
    empty: "State is mandatory",
  },

  addressZip: {
    empty: "Zip code is mandatory",
    invalid: "Please enter a valid zip code",
  },
  relationshipId: {
    empty: "Please select a relation type",
  },
  previousAddressLine1: {
    empty: "Please enter address line 1",
    invalid: "Please enter a valid address line 1",
  },
  previousAddressLine2: {
    invalid: "Please enter a valid address line 2",
  },
  previousCity: {
    empty: "Please enter a city",
    invalid: "Please enter a valid city",
  },
  previousState: {
    empty: "Please select a state",
  },
  previousAddressZip: {
    empty: "Please enter a zip code",
    invalid: "Please enter a valid zip code",
  },
  ssn: {
    invalid: "Please enter a valid SSN",
  },
};

export const addAuthFormErrorMessages = {
  authorization_others: {
    empty: "Mandatory field",
    invalid: "Please enter a valid name",
  },
  time_period_from: {
    empty: "Mandatory field",
    invalid:
      "Please enter a valid date(must be before current date or 'Time Period To' date)",
  },
  time_period_to: {
    empty: "Mandatory field",
    invalid:
      "Please enter a valid date(must be between 'Time Period From' date and current date)",
  },
  authorization_service_providers_others: {
    empty: "Mandatory field",
    invalid: "Please enter a valid authorization service providers",
  },
  disorder_treatment_program: {
    empty: "Mandatory field",
    invalid: "Please enter a valid disorder treatment program",
  },
  receive_person: {
    empty: "Mandatory field",
    invalid: "Please enter a valid name",
  },
  purpose: {
    empty: "Mandatory field",
    invalid: "Please enter a valid purpose",
  },
  authorization_expire_event: {
    empty: "Mandatory field",
    invalid: "Please enter a valid authorization expire event",
  },
  authorization_expire_date: {
    empty: "Mandatory field",
    invalid: "Please enter a valid expiry date(must be after current date)",
  },
  patientRepresentative: {
    invalid: "Please enter a valid representative name",
    empty: "Please enter a name",
  },
  patientRelation: {
    empty: "Please select a relation",
  },
};

export const errorMessages = {
  systemName: {
    empty: "Name is mandatory",
    invalid: "Please enter a valid integration name(min 3 alphabets)",
  },
  description: {
    empty: "Description is mandatory",
    invalid: "Please enter a valid description",
  },
  logoFileId: {
    empty: "Logo is mandatory",
  },
  systemCode: {
    empty: "Integration code is mandatory",
    invalid: "Please enter a valid system code",
  },
  recordStatusId: {
    empty: "Please select a status",
  },
};
export const inviteErrorMessages = {
  fName: {
    empty: "First name is mandatory",
    invalid: "Please enter a valid first name",
  },
  mName: {
    empty: "Middle name is mandatory",
    invalid: "Please enter a valid middle name",
  },
  lName: {
    empty: "Last name is mandatory",
    invalid: "Please enter a valid last name",
  },
  emailAddress: {
    empty: "Email is mandatory",
    invalid: "Please enter a valid email",
    alreadyExists:
      "This email address is already registered with Unblock Health. Please try another email address",
  },
  phoneNumber: {
    invalid: "Please enter a valid phone number",
  },
  groupId: {
    empty: "Please select a user group",
  },
  providerName: {
    empty: "Please select a provider",
  },
};
export const registerErrorMessages = {
  fName: {
    empty: "First name is mandatory",
    invalid: "Please enter a valid first name",
  },
  mName: {
    empty: "Middle name is mandatory",
    invalid: "Please enter a valid middle name",
  },
  lName: {
    empty: "Last name is mandatory",
    invalid: "Please enter a valid last name",
  },
  emailAddress: {
    empty: "Email is mandatory",
    invalid: "Please enter a valid email",
    sameAsOrg:
      "Email is same as organization email. Please try another email address",
    alreadyExists:
      "We're sorry, but this email address is already registered with Unblock Health. Please try another email address",
  },
  phoneNumber: {
    invalid: "Please enter a valid phone number",
  },
  password: {
    empty: "Password is mandatory",
    invalid:
      "Password must be at least 8 characters long and include at least one number, one lowercase letter, one uppercase letter, and one special character",
  },
  confirmPassword: {
    invalid: "Password and confirm password does not match",
  },
  orgName: {
    invalid: "Please enter a valid organization name",
    empty: "Organization name is mandatory",
  },
  orgWebsite: {
    invalid: "Please enter a valid website address",
  },
  orgEmail: {
    invalid: "Please enter a valid email",
    empty: "Organization email is mandatory",
  },
  orgPhone: {
    invalid: "Please enter a valid phone number",
  },
  orgFax: {
    invalid: "Please enter a valid fax number",
  },
  orgAddress: {
    invalid: "Please enter a valid address",
  },
  city: {
    invalid: "Please enter a valid city",
  },
  orgZipcode: {
    invalid: "Please enter a valid zipcode",
  },
};
