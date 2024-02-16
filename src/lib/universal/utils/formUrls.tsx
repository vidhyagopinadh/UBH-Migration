export const formUrls = {
  patientRecordRequestFormUrl: {
    part1: "patientRequests/",
    part2: "/overview",
  },
  disorderRequestAuthUrl: "authorizationForm/sud/",
  healthInformationAuthUrl: "authorizationForm/hipaa/",
  addendumRequestFormUrl: "addendumRequestForm/",
};

export const fromMail = "contacts@unblockHealth.com";

export const messages = {
  patientRecordRequestForm: {
    success: "Successfully sent Patient Record Request Form email",
    failed: "Error : Failed to sent Patient Record Request Form email",
  },
  disorderRequestAuth: {
    success: "Successfully sent Substance Use Disorder Form email",
    failed: "Error : Failed to sent Substance Use Disorder Form email",
  },
  healthInformationAuth: {
    success:
      "The HIPAA Authorization Form will be emailed to the email provided above and should be completed electronically as soon as possible",
    failed: "Error : Failed to sent HIPAA Authorization Form email",
  },
  addendumRequestForm: {
    success: "Successfully sent Addendum Request Form email",
    failed: "Error : Failed to sent Addendum Request Form email",
  },
  institutionAdd: {
    success: "Successfully added institution details",
    failed: "Error : Failed to added institution details",
  },
  saveAsDraft: {
    success: "Successfully saved the details as draft",
    failed: "Error : Failed to save as draft",
  },
};
