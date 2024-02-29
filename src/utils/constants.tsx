export const NOTIFICATION_TYPE = {
  request_notification_type: [4, 5, 6],
  status_change_notification_type: 1,
  pending_institution_notification_type: 7,
  approved_institution_notification_type: 8,
  reply_notification_type: 2,
  expired_request_type: 9,
  internal_note_notification_type: 3,
};
export const INTERNAL_DENIAL_TYPE = 7;
export const HOW_LONG_UNITS = [
  {
    id: "0",
    label: "Select Period Types",
  },
  {
    id: "1",
    label: "days",
  },
  {
    id: "2",
    label: "weeks",
  },
  {
    id: "3",
    label: "months",
  },
  {
    id: "4",
    label: "years",
  },
];

export const HOW_LONG_LIST = [
  {
    id: "0",
    label: "Select Duration",
  },
  {
    id: "1",
    label: "1",
  },
  {
    id: "2",
    label: "2",
  },
  {
    id: "3",
    label: "3",
  },
  {
    id: "4",
    label: "4",
  },
  {
    id: "5",
    label: "5",
  },
  {
    id: "6",
    label: "6",
  },
  {
    id: "7",
    label: "7",
  },
  {
    id: "8",
    label: "8",
  },
  {
    id: "9",
    label: "9",
  },
  {
    id: "10",
    label: "10",
  },
  {
    id: "11",
    label: "11",
  },
  {
    id: "12",
    label: "12",
  },
  {
    id: "13",
    label: "13",
  },
  {
    id: "14",
    label: "14",
  },
  {
    id: "15",
    label: "15",
  },
  {
    id: "16",
    label: "16",
  },
  {
    id: "17",
    label: "17",
  },
  {
    id: "18",
    label: "18",
  },
  {
    id: "19",
    label: "19",
  },
  {
    id: "20",
    label: "20",
  },
  {
    id: "21",
    label: "21",
  },
  {
    id: "22",
    label: "22",
  },
  {
    id: "23",
    label: "23",
  },
  {
    id: "24",
    label: "24",
  },
  {
    id: "25",
    label: "25",
  },
  {
    id: "26",
    label: "26",
  },
  {
    id: "27",
    label: "27",
  },
  {
    id: "28",
    label: "28",
  },
  {
    id: "29",
    label: "29",
  },
  {
    id: "30",
    label: "30",
  },
  {
    id: "31",
    label: "31",
  },
];

export const FORM_CONTENT = {
  hipaa: {
    headerTitle: "HIPAA Authorization",
    cardTitle: "AUTHORIZATION FOR USE AND DISCLOSURE OF HEALTH INFORMATION",
    title:
      "I authorize the use and disclosure of my health information as described below:",
    formfield2:
      "I authorize the following persons (or class of persons) to make the authorized use and/or disclosure of my health information:",
    formField2Label: "Authorization Service Providers",
    formField3:
      "I authorize the following persons (or class of persons) to receive my health information [name or describe specifically]:",
  },
  sud: {
    headerTitle: "Substance Use Disorder Information",
    cardTitle: "AUTHORIZATION FOR DISCLOSURE OF SUBSTANCE USE DISORDER RECORDS",
    title:
      "I request the disclosure of my substance use disorder treatment information as described below:",
    formfield2:
      "I authorize the following substance use disorder treatment program(s) to make the disclosure of my substance use disorder treatment information:",
    formField2Label: "Disorder Treatment Program",
    formField3:
      "I authorize the following persons to receive my health information [Unless disclosure is to a treating provider or third-party payer, the specific name of an individual is required].",
  },
};
export const AUTHORIZATION_SERVICE_PROVIDERS_TYPE = [
  {
    id: 1,
    value: "All past, current, and future health care providers",
  },
  {
    id: 2,
    value: "Other health care providers",
  },
];
export const STANDARD_PRIORITY = 2;
export const HIGH_PRIORITY = 1;
export const SERVICE_CATEGORY = {
  RECORDS_REQUESTER:
    "Examples of Record Requestors are Insurance Companies, Record Retrieval Organizations, Law Firms, Professional Patient Advocates etc. ",
  RECORDS_PROVIDER:
    "Examples of Record Providers are Hospitals, Labs, Imaging Centres, Cancer Centres, Emergency Services, Doctors Offices and Pharmacies",
  PATIENT_SDM:
    "A person who acts as a replacement decision maker on behalf of a patient in regards to healthcare or medical treatment can include a parent or guardian, power of attorney, spouse, child, sibling, other relative, or executor of estate.",
};
export const INVITE_ALREADY_EXISTS_SUBTITLE = [
  "Navigate to your invitation list.",
  "Locate the existing invitation for this user.",
  ["Click on the 'Send Reminder' ", " button associated with the invitation."],
];

export const DESCRIPTION_MAP: any = {
  AWAITING_LOGIN: "Awaiting login",
  INVITE_NOT_USED: "Not Opened",
  OPENED: "Invitation opened, registration not completed",
  LOGGED_IN: "Login successful",
  EXPIRED: "Expired",
  CANCELLED: "Invitation cancelled",
};
