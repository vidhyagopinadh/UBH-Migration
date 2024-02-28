export const REQUEST_MESSAGES = {
  mrr: {
    confirmTitle: "Medical Record Request for ",
    confirmTitlePatient: "Medical Record Request ",
    confirmContent: "Are you sure you want to submit the request to ",
    confirmContentPatient: [
      "Are you sure you want to proceed with submitting the request for ",
      " covering the period from ",
      " to ",
      " from ",
    ],
    successTitle: [
      "Your Medical Record Request for patient ",
      " has been submitted successfully.",
    ],
    errorTitle: ["Medical Record Request for patient ", " has failed."],
    errorContent: {
      "404":
        "There was an error while processing your request.Please try again later.If this continues, please reach out to  ",
      "403":
        "There was an error while processing your request. The patient's email address you're attempting to use is already linked to another user within our system. To proceed with submitting your request, kindly update the email address. If you need assistance, please contact   ",
    },
    successTitlePatient:
      "Your Medical Record Request has been submitted successfully.",
    successContentPatientHipaa:
      "Your request will remain in 'Pending' status until the HIPAA form is completed.  You can check the status of a request any time by going to ‘My Request’ page.",
    successContentPatient:
      "You can check the status of a request any time by going to ‘My Request’ page.",
    successContentHipaa:
      "We’ll send emails to the patient to fill the HIPAA form. You can check the status of a request any time by going to ‘My Request’ page.",
    successContentSud:
      "We’ll send emails to the patient to fill the Substance Use Disorder form. You can check the status of a request any time by going to ‘My Request’ page.",
    successContentPrr:
      "We’ll send emails to the patient to fill the Patient Record Request form. You can check the status of a request any time by going to ‘My Request’ page.",
    successContentHipaaSud:
      "We’ll send emails to the patient to fill the HIPAA and Substance Use Disorder form. You can check the status of a request any time by going to ‘My Request’ page.",
    successContentHipaaPrr:
      "We’ll send emails to the patient to fill the HIPAA and Patient Record Request form. You can check the status of a request any time by going to ‘My Request’ page.",
    successContentSudPrr:
      "We’ll send emails to the patient to fill the Substance Use Disorder and Patient Record Request Form. You can check the status of a request any time by going to ‘My Request’ page.",
    successContentHipaaSudPrr:
      "We’ll send emails to the patient to fill the HIPAA, Substance Use Disorder and Patient Record Request form. You can check the status of a request any time by going to ‘My Request’ page.",
    successContent:
      "You can check the status of a request any time by going to ‘My Request’ page.",
    institutionAlreadyContent: [
      "The institution named ",
      " that you are attempting to add already exists. Please select it from the provider/institution list. If you need support, please reach out to us at ",
    ],
    problems_faced: [
      "Please choose the option that best describes the reason for your record request. The priority is indicated by symbols (",
      " for high priority, ",
      "for standard priority). By default, 'First time requesting: No problems to report' will be selected, but you can modify it to match your needs.",
    ],
    sentToProvider: {
      authTitle: "Required Consent Form(s) Not Provided Yet!",
      authMessage: [
        "We're sorry, but we were unable to send your request to the provider since the ",
        " not yet attached or filled in.",
        "To proceed correctly and meet legal requirements, please complete ",
        "These forms are essential to authorize access to your medical records.",
        "This form is essential to authorize access to your medical records.",
      ],
      successTitle: "Medical Record Request",
      successContent: [
        "Your request has been successfully submitted to ",
        "! You will receive an email notification once the provider begins processing your request.  For further assistance or any inquiries, please feel to contact us at ",
      ],
      confirmTitle: "Medical Record Request for ",
      confirmContent:
        "Are you sure you are going to send the request to the provider, ",
    },
  },
  addendum: {
    confirmTitle: "Addendum Request for ",
    confirmContent: "Are you sure you want to submit the Addendum Request?",
    successTitle: [
      "Your Addendum Request for patient ",
      " has been submitted successfully.",
    ],
    errorTitle: ["Addendum Request for patient ", " has failed."],
    successContentEmail:
      "We’ll send emails to the patient to fill the Addendum form. You can check the status of a request any time by going to ‘My Request’ page.",
    successContent:
      "You can check the status of a request any time by going to ‘My Request’ page.",
  },
  billing: {
    confirmTitle: "Billing/Insurance Request for ",
    confirmContent:
      "Are you sure you want to submit the Billing/Insurance Request? ",
    successTitle: [
      "Your Billing/Insurance Request for patient ",
      " has been submitted successfully.",
    ],

    errorTitle: ["Billing/Insurance Request for patient ", " has failed."],
    successContent:
      "You can check the status of a request any time by going to ‘My Request’ page.",
  },
};
