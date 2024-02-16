import type { TranslationMessages } from "react-admin";
import englishMessages from "ra-language-english";
const { REACT_APP_SUPPORT_MAIL_ADDRESS } = import.meta.env;
const customEnglishMessages: TranslationMessages = {
  ...englishMessages,
  tooltip: {
    feature_in_progress: "This feature is currently in progress.",
    tour: {
      startTour: "Click here to take a tour about Unblock Health",
    },
    unenroll: {
      buttonTooltip: "Opt out Id verification",
    },
    email_unverified:
      "This feature is exclusively available to users who have verified their email. Verify your email now to access this feature!",
    formResend: {
      hipaa: "Send reminder mail to fill HIPAA form.",
      sud: "Send reminder mail to fill Substance Use Disorder form.",
      institution: "Send reminder mail to approve institution",
    },
    integration: {
      notifyMe:
        "Select this checkbox to receive notifications when providers are available to ID verification.",
      copySystemId: "Copy System Id",
      copySystemCode: "Copy System code",
      copyTransId: "Copy Transaction Reference Id",
      editIcon: "Edit details",
      comingSoon: "This integration system is in progress",
      partyIdVerification:
        "This field specifies whether individuals are required to complete a formal procedure to verify their identity in order to access and obtain electronic health records from a healthcare provider, a health insurance company, or a health information exchange (HIEs) organization.",
      systemCode:
        "The 'System Code' field is used to specify a unique identifier for the external system integration. This code should consist of a combination of alphabets, numbers, and underscores or hyphens (e.g., sample_ext_system_123). It's important to ensure that the code you enter here is not already in use within the system to maintain data integrity and prevent conflicts.",
      idVerifiedIcon:
        "Personal identity verification is necessary in order to utilize the service",
      optout:
        "This field specifies whether individuals are required to opt out their Id verification. ",
    },
    invite: {
      noInfo: "No information available",
      noFullname: "Full name not provided by the inviter",
      noPhone: "Mobile number not provided by inviter",
      inviteNotUsed: "The invite has not yet been opened by the user",
      provider: "Providers will be listed by hospital or clinic name.",
      // provider:
      // "Providers will be listed by hospital or clinic name. If you are unable to find your provider, please leave the hospital or clinic name field empty.",

      userGroup:
        "This list contains the different types of users under the selected service category",
    },
    patient: {
      close: "Close user account",
      invite: "Send invitation to join Unblock Health",
      editIdVerified:
        "The patient's personal ID has been verified, and their information can only be edited by them directly.",
      editEmailNotVerified:
        "Editing is allowed only for users who have verified their email.",
      edit: "Edit Patient",
      inviteRegistered:
        "Inviting an already registered patient is not permitted.",
      inviteIcon: "Invite Patient",
      idVerified: "The patient's personal ID has been verified.",
      searchMrr: "Track medical record request search",
      featureUnavailable:
        "This feature is available only for Id verified users",
    },
    register: {
      organization:
        "To view your organization details with us, simply click the arrow to expand the section",
    },
    guidelines: {
      create_request: "Create a new Medical Record request",
      create_addendum: "Create a new Addendum/Amendment request",
      create_billing: "Create a new Billing/Insurance Question request",
      request_list: "Shows list of all created requests",
      patient_list: "Shows list of all active patients",
      request_list_mra: "Shows list of all requests in the institution",
      add_institution: "Add a new institution",
      visit_ubh: "Go to UnblockHealth Webpage",
    },
    request: {
      provider_data:
        "We are currently awaiting the status on the research, verification and validation of the institution from our support team. Once the process is complete, we will notify you, allowing you to review your request. You can then send it to the institution/provider for further necessary action.",
      institution_additional:
        "Use this space for any additional information need to fill about the institution / provider",
      prr_toggle:
        "A Patient Record Request Form will be sent to the registered email address of the patient.",
      prr_toggle_patient:
        "Patient Record Request Form can be filled from the overview page.",
      prr: "If the answer is YES, then allow the user to upload the Patient Record Request Form. If the answer is NO, then the Patient Record Request Form link send via patient email once the request is submitted.",
      hipaa:
        "If the answer is YES, then allow the user to upload the HIPAA Authorization Form. If the answer is NO, then the HIPAA Authorization Form link send via patient email once the request is submitted.",
      sod: "If the answer is YES, then allow the user to upload the Substance use disorder authorization form. If the answer is NO, then the Substance use disorder authorization form link send via patient email once the request is submitted.",
      hipaa_patient:
        "If the answer is YES, then allow the user to upload the HIPAA Authorization Form. If the answer is NO, then the HIPAA Authorization Form can be filled from the request detailed view after submitting the request. ",
      sod_patient:
        "If the answer is YES, then allow the user to upload the Substance use disorder authorization form. If the answer is NO, then the Substance use disorder authorization form can be filled from the request detailed view after submitting the request.",
      prr_patient:
        "If the answer is YES, then allow the user to upload the Patient Record Request Form. If the answer is NO, then the Patient Record Request Form can be filled from the request detailed view after submitting the request",

      sod_toggle:
        "A Substance use disorder authorization form will be sent to the registered email address of the patient.",
      sod_toggle_patient:
        "Substance use disorder authorization can be filled from the overview page.",
      hipaa_toggle:
        "A HIPAA authorization form will be sent to the registered email address of the patient.",
      hipaa_toggle_patient:
        "HIPAA authorization form can be filled from the overview page.",
      approved_title_same:
        "The research and verification process has been successfully completed. You can find the verified details in the 'More Info' section.",
      approved_title_diff:
        "The research and verification process has been successfully completed. The verified details can be viewed in the 'Verified Provider Profile' tab, while the suggested details are available in the 'Suggested Provider Profile' tab.",
      approval_progress:
        "We are currently awaiting the status on the research, verification and validation of the institution from our support team. Once the process is complete, we will notify you, allowing you to review your request. You can then send it to the institution/provider for further necessary actions.",
      disable_submit:
        "Please change the email address provided to proceed with request submission.",
    },
    brief: {
      denial_checkbox:
        "If this box is selected, any internal notes documented here will be included in the denial letter that is communicated with patient/requester.",
    },
  },

  auth: {
    insufficient_role_title: "Role Assignment Required",
    email_unverified_title: "Email is not verified",
    regenerate_link_title: "Email verification link sent successfully",
    already_verified_title: "Email already verified",
    regenerate_link_error_title: "Link regeneration failed",
    insufficient_permission_title: "Insufficient Privileges",
    leave_app_title: "You're leaving our app",
    leave_app_message:
      "You’re about to leave the Unblock Health App and go to the external website of Unblock Health. Would you like to continue? ",
    insufficient_role_subtitle1:
      "It seems that your account doesn't have a role assigned in the system. To assist you further and assign a role, please provide us with your registered email address associated with your account. ",
    insufficient_role_subtitle2:
      "Please clear your browser's cache and try again. If you continue to experience this issue, feel free to reach out to our support team by sending an email to " +
      REACT_APP_SUPPORT_MAIL_ADDRESS,
    already_verified_subtitle: "Your email is already verified.",
    insufficient_role_subtitle3:
      " Once assigned, you will be able to access the corresponding features and functionalities of the application.",
    regenerate_link_subtitle:
      "An email verification link has been sent to your email address. Kindly check your inbox and follow the instructions provided in the email to successfully complete the verification process.",
    email_unverified_subtitle:
      "In order to access all the features of Unblock Health, please verify your email using the link provided during your signup. To generate a new verification link, click on the 'Re-Generate Link' button below. If you need assistance, please contact ",
    insufficient_permission_subtitle1:
      "To assist you further and assign the necessary permissions, please provide us with your registered email address associated with your account. ",
    insufficient_permission_subtitle2:
      "You can reach out to the support team by sending an email to " +
      REACT_APP_SUPPORT_MAIL_ADDRESS,
    insufficient_permission_subtitle3:
      "Once assigned, you will be able to access the corresponding features and functionalities of the application.",

    dropdown: {
      relation: "Please select a relation",
    },
    titles: {
      successfully_filled: "Thanks! Successfully submitted authorization form.",
      ack_filled: "Already submitted authorization form.",
      invalid_token: "Something is not correct.",
      request_signed: "Already submitted signed form.",
      successfully_signed: "Thanks! Successfully submitted signed form.",
      permission: "Permission Denied",
      thank_you: "Thank You",
      thanks_message:
        "Thank you for your interest in the Contract Orchestrator service",
      session_expire: "Session Expired",
    },
    messages: {
      access_denied: "Access Denied..! Please contact your PPA",
      insufficient_role:
        "You dont have an assigned role to access this service.",
      insufficient_permission: "Insufficient privilege for mra",
      forgot_mail_sent_success:
        "A password reset mail sent to your email. Please reset your password.",
      successfully_filled:
        "Authorization form has been submitted. For more details please contact your PPA.",
      ack_filled:
        "Authorization form already submitted. For more details please contact your PPA",
      invalid_token:
        "You have provided an invalid url. For more details please contact your PPA.",
      empty_request_token:
        "You have provided an invalid url. For more details please contact your PPA.",
      request_signed:
        "Signed form already submitted. For more details please contact your PPA.",
      successfully_signed:
        "Signed form has been submitted. For more details please contact your PPA.",
      thanks_message:
        "You dont have enough permission to access this service. For more details please visit ",
      error_message:
        "Some internal issue has occured.Please contact Administrator",
      session_expire:
        "Sessions are logged out due to inactivity. Mouse or keyboard activity must be registered to keep your session active. Please log in again.",
    },
    errors: {
      invalid_username_password: "Invalid username or password",
      permission:
        "You don't have enough permission to use this service. Please contact administrator.",
      unfilledMandatoryError: "Please fill all Mandatory fields",
      filledMandatoryError: "Please fill all Mandatory fields Correctly",
      signError: "Please add a signature",
      legalidError: "Please attach a Legal ID",
    },
  },
  pos: {
    search: "Search",
    configuration: "Configuration",
    profile: "My Profile",
    language: "Language",
    theme: {
      name: "Theme",
      light: "Light",
      dark: "Dark",
    },
    dashboard: {
      request_list_total: "Total Requests",
      month_history: "30 Day Revenue History",
      new_orders: "New Orders",
      pending_reviews: "Pending Reviews",
      all_reviews: "See all reviews",
      new_customers: "New Customers",
      all_customers: "See all customers",
      pending_orders: "Pending Orders",
      userTag: {
        title: "Home",
        greetings: "Good Day, ",
        tagLine: "Here's what's happening",
      },
      order: {
        items:
          "by %{customer_name}, one item |||| by %{customer_name}, %{nb_items} items",
      },
      welcome: {
        title: "Welcome to Unblock Health",
        subtitle:
          "Unblock Health is a first-in-class, comprehensive suite of patient advocacy services designed for patients and consumers who are determined to be empowered in their health care journey and are no longer willing to accept traditional barriers to their information.",
        ra_button: "Visit Unblock Health",
        demo_button: "Let's Create Medical Record Request",
      },
    },
    menu: {
      sales: "Sales",
      catalog: "Catalog",
      customers: "Customers",
    },
  },
  resources: {
    hgSearch: {
      refreshed: "Successfully refreshed the request",
    },
    unenroll: {
      successTitle: "Successfully opted out",
      successMessage: "You've successfully opted out of ID verification.",
      errorTitle: "Unenroll Failed",
      errorMessage:
        "There was an error while processing your request.Please try again later.If this continues, please reach out to ",
    },
    integration: {
      note: "No confirmation from the partner system yet. Please check your status by clicking on the 'Verify my status' button. Use 'More info' to see details.",

      systemIdCopyMessage: "System Id copied to clipboard",
      systemCodeCopyMessage: "System Code copied to clipboard",
      transactionIdCopyMessage: "Transaction Id copied to clipboard",
      iasLoadingTitle: "Validating Your Profile . . .",
      iasLoadingMessage:
        "Please wait while we validate your profile. Do not close this window until the validation process is complete.",
      addFormSubtitle:
        "To add a new integration system to Unblock Health, please fill out the form below:",
      editFormSubtitle:
        "To update integration system, press edit button and add new details:",
      updateFormSubtitle:
        "To update integration system, please fill out the form below:",
      addFormTitle: "Add a new integration system",
      editFormTitle: "Edit integration system",
      confirmTitle: "Add New Integration System",
      confirmMessage:
        "Are you sure you are going to add this external integration system?",
      successTitle: "Integration added successfully",
      deleteConfirmTitle: "Delete Confirmation",
      deleteConfirmMessage:
        "Are you sure you want to delete this integration system?",
      deleteTitle: "Successfully deleted",
      deleteMessage: "Integration system deleted successfully",
      editConfirmTitle: "Update Confirmation",
      editConfirmMessage:
        "Are you sure you want to update this integration system?",
      editTitle: "Successfully updated",
      editMessage: "Integration system details updated successfully",
      successMessage:
        "Successfully added new integration system to Unblock Health.",
      cancelTitle: "Are you sure you want to leave?",
      cancelMessage:
        "You have unsaved changes. Are you sure you want to leave this page without completing the process of adding a new integration? Unsaved changes will be lost.",
      cancelVerificationTitle: "Are you sure you want to leave?",
      cancelVerificationMessage:
        "Are you sure you want to leave this page without completing the Id verification? ",
      alreadyExistsTitle: "Add new integration system",
      alreadyExistsMessage:
        "The system code you are trying to add has already been used. Please modify the system code and try again.",
      errorTitle: "Add Integration Failed",
      errorMessage:
        "There was an error while processing your request.Please try again later.If this continues, please reach out to ",
      idVerificationSuccessTitle: "Id verification completed successfully",
      idVerificationSuccessMessage:
        "Your id verification process has been completed successfully.",
      verificationStatusFailedMessage1:
        "Your last Id verification attempt was unsuccessful. Please try again. If the issue continues, feel free to contact ",
      verificationStatusFailedMessage2: " for assistance.",

      patientCreationErrorMessage:
        "We are having trouble creating your account with the partner application. Account creation is required to continue with the identity verification process. You can try again by clicking the 'Retry' button, or wait a while and try again later.",
      idVerificationErrorTitle: "Id verification failed",
      idVerificationLinkErrorMessage:
        "The link you used for identity verification has expired. If you wish to verify again, please try after some time. If you need any assistance from our Support team, do not hesitate to contact us at ",
      idVerificationServerErrorMessage:
        "The Id verification failed due to technical issues. If you wish to verify again, please try after some time.If you need any assistance from our Support team, do not hesitate to contact us at ",
      verificationError:
        "We're sorry, but we can't continue with the identity verification process due to the following data validation errors. Please review and correct them and try again later.",
      verificationSuccess:
        "Your profile has been successfully validated for identity verification. Please review the verified details and click 'Allow and Continue' button to proceed.",
      name: "Integrations",
      list: "Integrations",
      add: "Add New",
      dropdown: {
        status: "Select status",
      },
    },

    accountSetting: {
      title: "Account Settings",
      editProfile: "Edit profile details",
      editProfilePic: "Change profile picture",
      idNotVerified: "ID NOT VERIFIED",
      idVerified: "ID VERIFIED",
      verifyIdTitle: "Verify Identity",
      uploadSuccess: "Successfully updated profile picture",
      uploadError: "Failed to update profile picture. Please try again.",
      cancelTitle: "Are you sure you want to leave?",
      cancelMessage:
        "You have unsaved changes. Are you sure you want to leave this page without completing the process of updating your profile? Unsaved changes will be lost.",
      removeSuccess: "Successfuly removed profile picture",
      removeError: "Failed to remove profile picture. Please try again.",
      editProfileSuccessTitle: "Profile Updated",
      editProfileSuccessMessage:
        "Your profile details have been updated successfully",
      editProfileConfirmTitle: "Update Profile Confirmation",
      editProfileConfirmMessage:
        "Are you sure you want to update your profile?",
      deleteConfirmTitle: "Remove profile picture",
      deleteConfirmMessage:
        "Are you sure you want to remove your profile picture?",
    },
    institutions: {
      list: "Institution List",
      fields: {
        institution_name: "Institution name",
        institution_type: "Type of institution",
        institution_email: "Email",
        institution_phone: "Phone number",
        institution_fax: "Fax number",
        institution_website: "Website",
        requester_name: "Requested by",
        requester_email: "Requester email",
        approver_name: "Approved by",
        institution_address: "Address",
        institution_city: "City",
        institution_state: "State",
        institution_country: "Country",
        institution_zipCode: "Zip code",
        pending: "Pending",
        approved: "Approved",
        status: "Status",
        description: "Description",
        institution_directAddress: "Direct Address",
      },
    },
    feedback: {
      submit_success: "Successfully submitted your support and feedback",
      submit_failure: "Failure in submitting your support and feedback",
      upload_failure: "Failure in uploading feedback screenshot",
      upload_Failure_Again:
        "Again have failed uploads. We are sending feedback without failed uploads",
      cancelTitle: "Discard your feedback?",
      successTitle: "Thanks for contacting us!",
      cancelMessage:
        "We would really like to hear from you. Are you sure you don’t want to send this?",
      failedTitle: "Feedback submission failed!",
      failedMessage:
        "We're sorry, but we were unable to send your feedback to our support staff. Do you want to try again?",
      finalFailedMessage:
        "We apologize, but we were unable to send your feedback to our support staff. Try sending again later. If you need assistance, please contact ",
      successMessage: "We have received your support and feedback request.",
      successModalTitle: "Success",
      successModalSubTitle: "Thanks for contacting us!",
      successModalMessage:
        "We have received your support and feedback request.",
      fileUploadFailedTitle: "Upload Failed!",
      fileUploadFailedSubTitle:
        " If this problem persists, contact support team at ",
      fileUploadFinallyFailedSubTitle:
        "Please try again later.  If you need help, please don't hesitate to reach out to our support team at ",
      fileUploadFailedMessage:
        "Some files were not successfully uploaded. Would you like to retry uploading these files? ",
      finallyUploadFailedMessage:
        "We're sorry, but we are currently experiencing technical difficulties to upload the below file(s). ",
      screenShotfailedMessage:
        "We’re sorry, but we are currently experiencing technical difficulties to upload attachment. Please try again later. If you need help, please don’t hesitate to reach out to our support team at ",
    },
    denial: {
      submit_failure: "Request denial failed.Please try again later.",
    },
    delete: {
      submit_failure: "Request deletion failed.Please try again later.",
    },
    update: {
      submit_failure: "Request status updation failed.Please try again later.",
    },
    customers: {
      name: "Customer |||| Customers",
      fields: {
        commands: "Orders",
        first_seen: "First seen",
        groups: "Segments",
        last_seen: "Last seen",
        last_seen_gte: "Visited Since",
        name: "Name",
        total_spent: "Total spent",
        password: "Password",
        confirm_password: "Confirm password",
        stateAbbr: "State",
      },
      filters: {
        last_visited: "Last visited",
        today: "Today",
        this_week: "This week",
        last_week: "Last week",
        this_month: "This month",
        last_month: "Last month",
        earlier: "Earlier",
        has_ordered: "Has ordered",
        has_newsletter: "Has newsletter",
        group: "Segment",
      },
      fieldGroups: {
        identity: "Identity",
        address: "Address",
        stats: "Stats",
        history: "History",
        password: "Password",
        change_password: "Change Password",
      },
      page: {
        delete: "Delete Customer",
      },
      errors: {
        password_mismatch:
          "The password confirmation is not the same as the password.",
      },
    },
    commands: {
      name: "Order |||| Orders",
      amount: "1 order |||| %{smart_count} orders",
      title: "Order %{reference}",
      fields: {
        basket: {
          delivery: "Delivery",
          reference: "Reference",
          quantity: "Quantity",
          sum: "Sum",
          tax_rate: "Tax Rate",
          taxes: "Tax",
          total: "Total",
          unit_price: "Unit Price",
        },
        address: "Address",
        customer_id: "Customer",
        date_gte: "Passed Since",
        date_lte: "Passed Before",
        nb_items: "Nb Items",
        total_gte: "Min amount",
        status: "Status",
        returned: "Returned",
      },
      section: {
        order: "Order",
        customer: "Customer",
        shipping_address: "Shipping Address",
        items: "Items",
        total: "Totals",
      },
    },
    invoices: {
      name: "Invoice |||| Invoices",
      fields: {
        date: "Invoice date",
        customer_id: "Customer",
        command_id: "Order",
        date_gte: "Passed Since",
        date_lte: "Passed Before",
        total_gte: "Min amount",
        address: "Address",
      },
    },
    products: {
      name: "Poster |||| Posters",
      fields: {
        category_id: "Category",
        height_gte: "Min height",
        height_lte: "Max height",
        height: "Height",
        image: "Image",
        price: "Price",
        reference: "Reference",
        sales: "Sales",
        stock_lte: "Low Stock",
        stock: "Stock",
        thumbnail: "Thumbnail",
        width_gte: "Min width",
        width_lte: "Max width",
        width: "Width",
      },
      tabs: {
        image: "Image",
        details: "Details",
        description: "Description",
        reviews: "Reviews",
      },
      filters: {
        categories: "Categories",
        stock: "Stock",
        no_stock: "Out of stock",
        low_stock: "1 - 9 items",
        average_stock: "10 - 49 items",
        enough_stock: "50 items & more",
        sales: "Sales",
        best_sellers: "Best sellers",
        average_sellers: "Average",
        low_sellers: "Low",
        never_sold: "Never sold",
      },
    },
    categories: {
      name: "Category |||| Categories",
      fields: {
        products: "Products",
      },
    },
    patients: {
      accountClose: "Account closed successfully.",
      accountCloseError: "Error while closing account.",
      confirmSearchTitle: "Confirm search medical record",
      confirmSearchMessage:
        "Are you sure you want to search medical records in QHIN network?",
      noInfoDetails: {
        noInfo: "No information available",
        noFirstname: "First name not provided by the patient",
        noMiddlename: "Middle name not provided by the patient",
        noLastname: "Last name not provided by the patient",
        noPhone: "Mobile number not provided by patient",
        noDependentFirstname: "First name not provided by the patient",
        noDependentMiddlename: "Middle name not provided by the patient",
        noDependentLastname: "Last name not provided by the patient",
        noDependentPhone: "Mobile number not provided by patient",
      },
      dropdown: {
        lang: "Select Language",
        sex: "Select Sex",
        gender: "Select Gender",
        country: "Select Country",
        preferredPronouns: "Select Preferred Pronouns",
        state: "Select State",
      },
      expandFields: {
        firstName: "First Name:",
        middleName: "Middle Name:",
        lastName: "Last Name:",
        birthDate: "DOB(mm/dd/yyyy) :",
        suffix: "Suffix",
        ssn: "SSN:",
        sex: "Sex:",
        gender: "Gender:",
        email: "Email:",
        phone: "Mobile Number:",
        relation: "Relationship:",
        idStatus: "Id verification status",
        Address: {
          address1: "Address Line 1:",
          address2: "Address Line 2:",
          country: "Country:",
          state: "State:",
          city: "City:",
          zip: "Zip:",
        },
        moreInfo: "More info",
        lessInfo: "Less info",
        previousAddressHead: "Previous Address Details :",
        previousFirstName: "Previous First Name:",
        previousMiddleName: "Previous Middle Name:",
        previousLastName: "Previous Last Name:",
        previousAddressDetails: {
          previous_address1: "Address Line 1:",
          previous_address2: "Address Line 2:",
          previous_country: "Country:",
          previous_state: "State:",
          previous_city: "City:",
          previous_zip: "Zip:",
        },
        inviteDetailsHead: "Invite Details:",
        inviteDetails: {
          invite_status: "Invite Status",
          signup_completed_date: "Signup Date:",
          first_sign_in_date: "First Login Date:",
        },
      },
      filters: {
        status: "Status",
      },
      add: "Add new",
      name: "Patient |||| Patients",
      patientList: "Patients",
      dependentList: "Dependents",
      patientInf: "Patient Information:",
      indivPatientInf: "(Individual whose information will be released)",
      amount: "1 review |||| %{smart_count} reviews",
      relative_to_poster: "Review on poster",
      detail: "Review detail",
      list: "Patient List",
      dependentslist: "Dependent List",
      noInviteTitle: "Multiple invite is not allowed",
      noInviteMessage:
        "You have already sent an invitation to this patient and the invite is active. So you are not allowed to sent invite again. ",
      delete: {
        deleteTitle: "Delete Patient",
        deleteMessage:
          "Please note that this operation cannot be undone. Are you sure you want to continue and delete this patient? ",
        deleteDependentTitle: "Delete Dependent",
        deleteDependentMessage:
          "Please note that this operation cannot be undone. Are you sure you want to continue and delete this dependent? ",
      },
      fields: {
        patient_name: "Patient Name",
        dependent_name: "Dependent Name",
        address: "Address",
        suffix: "Suffix",
        person_type: "Person Type",
        phone_number: "Phone Number",
        relation: "Relationship",
        dob: "DOB(mm/dd/yyyy)",
        ssn: "SSN",
        email: "Email",
        status: "Status",
        registrationStatusVirtual: "Virtual",
        registrationStatus: "Registered",
        active: "Active",
        inactive: "Inactive",
        previous_name: "Previous Name",
        previous_address: "Previous Address",
        sex: "Sex",
        gender: "Gender",
        language: "Language",
        dialoge: {
          title: "Close User Account",
          content: "Do you want to close account?",
          confirm: "Close",
          cancel: "Cancel",
        },
      },
      addPatient: {
        formSubtitle: "ADD PATIENT",
        formTitle: "Add New Patient",
        editFormSubtitle: "EDIT PATIENT",
        editFormTitle: "Edit Patient Details",

        cancel: {
          cancelTitle: "Are you sure you want to leave?",
          cancelMessage:
            "You have unsaved changes. Are you sure you want to leave this page without completing the process of adding a new patient? Unsaved changes will be lost.",
          dependentEditCancelMessage:
            "You have unsaved changes. Are you sure you want to leave this page without completing the process of adding a new dependent? Unsaved changes will be lost.",
          editCancelMessage:
            "You have unsaved changes. Are you sure you want to leave this page without save the changes. Unsaved changes will be lost.",
        },

        success: {
          successMessage1: "The patient  ",
          dependentSuccessMessage1: "The dependent  ",
          successMessage2: "  added successfully! ",
          editSuccessMessage1: "The details of the patient  ",
          dependentEditSuccessMessage1: "The details of the dependent  ",
          editSuccessMessage2: "  have been updated successfully! ",
        },
        fail: {
          failedTitleByisEmailNotVerified: "Access Denied",
          failedMessageByisEmailNotVerified1:
            "We're sorry, but you cannot add new patient until your email has been verified. ",
          dependendFailedMessageByisEmailNotVerified1:
            "We're sorry, but you cannot add new dependent until your email has been verified. ",
          failedMessageByisEmailNotVerified2:
            "Please check your inbox for a verification email from us during your signup and follow the instructions to verify your email address.",
          failedMessageByisEmailNotVerified3:
            "If you still haven't received the verification email, please check your spam folder or need to request a new one, click on the ‘Re-Generate Link' button below.",
          failedTitleByIsUserAlreadyExist: "Patient Already Exists",
          dependentFailedTitleByIsUserAlreadyExist: "Dependent Already Exists",
          failedMessageByIsUserAlreadyExist1: "A patient with this email ",
          dependentFailedMessageByIsUserAlreadyExist1:
            "A dependent with this email ",
          failedMessageByIsUserAlreadyExist2: " already exists!",
          failedMessageByIsUserAlreadyExist3:
            " Do you want to cancel this action, or update the email address and continue?",
        },
        confirm: {
          confirmTitle: "Add Patient",
          confirmMessage1: " Are you sure you are going to add the patient ",
          dependentConfirmTitle: "Add Dependent",
          dependentConfirmMessage1:
            " Are you sure you are going to add the dependent ",
          confirmMessage2: "?",
          editConfirmTitle: "Edit Patient",
          dependentEditConfirmTitle: "Edit Dependent",
          editConfirmMessage: "Are you sure you want to save the changes?",
        },
        instructions: {
          required: "Required fields are marked *",
          info: "Please leave optional fields blank if they are not applicable or if details are not known.",
        },
      },
      addDepedent: {
        formSubtitle: "ADD DEPENDENT",
        formTitle: "Add New Dependent",
        editFormSubtitle: "EDIT DEPENDENT",
        editFormTitle: "Edit Dependent Details",
      },
      action: {
        accept: "Accept",
        reject: "Reject",
      },
      notification: {
        approved_success: "Review approved",
        approved_error: "Error: Review not approved",
        rejected_success: "Review rejected",
        rejected_error: "Error: Review not rejected",
      },
    },

    billingRequest: {
      mainMenuName: "Billing/Insurance Question Request",
      list: "Billing/Insurance Question Request List",
      create: "Create Billing/Insurance Question Request",
      formSubtitle: "REQUEST FOR BILLING/INSURANCE",
      formTitle: "Billing/Insurance Question Request Form",
      empty: {
        title: "No Billing/Insurance Request Available",
        buttonTitle: "Create Billing/Insurance Request",
      },
    },
    addendumRequests: {
      createName: "Create Addendum Request",
      formName: "Correction/Amendment Request Form",
      detail: "Addendum Request detail",
      formSubtitle: "REQUEST TO AMEND MY PROTECTED HEALTH INFORMATION",
      fields: {
        customer_id: "Customer",
        command_id: "Order",
        product_id: "Product",
        date_gte: "Posted since",
        date_lte: "Posted before",
        date: "Date",
        comment: "Comment",
        rating: "Rating",
      },
      doctor: {
        error: "Please fill in the details and try again",
      },
      action: {
        accept: "Accept",
        reject: "Reject",
      },
      notification: {
        approved_success: "Review approved",
        approved_error: "Error: Review not approved",
        rejected_success: "Review rejected",
        rejected_error: "Error: Review not rejected",
      },
    },
    register: {
      confirmTitle: "User Registration",
      successTitle: "SUCCESS",
      successButton: "Let's Get Started",
      successMessage: "Registration has been completed successfully!",
      successSubMessage1:
        "In order to fully activate your account, please verify your email address.",
      successSubMessage2:
        "Please check your inbox and follow the instructions in the email to complete the verification process.",
      successSubMessage3:
        "Once your email address is successfully verified, you will be able to start using our services. ",

      confirmMessage:
        "Are you sure you want to submit this request? Please review the information you've provided carefully before submitting.",
      disableTitle: "Link already used/expired",
      errorTitle: "User Registration Failed",
      errorMessage:
        "There was an error while processing your request.Please try again later.If this continues, please reach out to  ",

      disableMessage: "This invite link is already used or expired",
      registerTitle: "Register Your Account",
      registerSubTitleMra:
        "To get started using Unblock Health, please provide us with a few details about yourself and verify your organization's information with us.",
      registerSubTitle:
        "To get started using Unblock Health, please provide us with a few details about yourself.",
      orgTitle: "Organization Information",
      ubhTitle: "It's time to Unblock Health",
      passwordRule:
        "Password must be at least 8 characters long and include at least one number, one lowercase letter, one uppercase letter, and one special character.",

      termsError: "Please accept Privacy Policy and Terms of Service",
      error: {
        termsError: "Please accept Privacy Policy and Terms of Service",
      },
    },
    emailVerify: {
      successTitle: "Account Setup Complete",
      successSubtitle: "To begin using Unblock Health, click the login button.",
      loading: "Email verification in progress",
    },
    invite: {
      name: "Invite Users",
      formSubtitle: "Invite User",
      formTitle: "Initiate User Enrollment",
      add: "Invite User",
      reminder: {
        confirmTitle: "Invite Reminder",
        sendReminderConfirmMessage:
          "Are you sure you are going to send a reminder to this user?",
        reminderSend: "Your request has been sent for processing.",
        reminderExeedsLimit:
          "The maximum number of reminders for this invitation has been exceeded. For further assistance or any inquiries, please feel free to contact us at ",
        reminderErrorMessage:
          "There was an error while sending invite reminder .Please try again later. If this continues, please reach out to ",
        reminderNotSend: "Reminder not send",
      },
      advancedSearch: {
        noDataErrorMessage:
          "We could not find the Provider/Organization.Try performing a broader search. For example, U.S.A Eye Institute may be searched as USA Eye Institute or US Eye Institute or simply Eye Institute. If you still cannot find your provider, please email ",
      },

      expandFields: {
        invitedDate: "Invite Date:",
        invitedBy: "Invited By:",
        status: "Status:",
        linkOpenedOn: "Link Opened On:",
        group: "User Group:",
        name: "Full Name:",
        email: "Email:",
        phone: "Mobile Number:",
        emailStatus: "Email Delivery Status:",
      },
      fields: {
        name: "Full Name",
        email: "Email",
        group: "User Group",
        invitedBy: "Invited By",
        invitedDate: "Invited Date",
        days: "Days Open",
        status: "Status",
        actions: "Actions",
      },
      instructions: {
        required: "Required fields are marked *",
        myOrg:
          "When inviting your colleagues or patients, please check the option labeled 'Invite members to join My Organization'.",
        allInfo: "Please provide us with as much information as possible.",
      },
      filters: {
        status: "Status",
        accountType: "User Type",
      },
      dropdown: {
        userGroup: "Select a User Group",
        state: "Select a state",
      },
      errorTitle: "Invite User Request Failed",
      errorMessage:
        "There was an error while processing your request.Please try again later.If this continues, please reach out to  ",

      confirmTitle: "Invite User",
      confirmMessagePatient:
        "Are you sure you are going to invite this patient to Unblock Health?",
      confirmMessageUser:
        "Are you sure you are going to invite this user to Unblock Health?",
      confirmMessageDependent:
        "Are you sure you are going to invite this dependent to Unblock Health?",

      submitTitle: " has been invited to join Unblock Health",
      submitMessage:
        "They will receive an email to this effect with login instructions",
      alreadyExistsTitle: "Duplicate Invitation Detected",
      alreadyExistsMessage:
        "The user you are trying to invite has already been invited. Instead of sending another invitation, you can send a reminder to the user. To send a reminder, please follow these steps:",
      deleteTitle: "Invite User",
      cancelTitle: "Are you sure you want to leave?",
      cancelMessage:
        "You have unsaved changes. Are you sure you want to leave this page without completing the invite? Unsaved changes will be lost.",
      sendReminderMessage:
        "Are you sure you are going to send a reminder to this user?",
      deleteMessage: "Are you sure do you want to delete this invite?",
      deleteInvite: "Invitation entry deleted successfully!",
    },
    requests: {
      label: {
        contact:
          "Please share the contact information (such as name, email address or phone number) of those you have already communicated with.",
      },

      dropdown: {
        sourceInstitution: "Select Source Institution",
        sourceNature: "Select Nature of Source",
        department: "Select Department",
        mra: "Select MRA",
        requestType: "Select Request Type",
        problemsFaced: "First time requesting: No problems to report",
        impactFaced: "Select Impact Faced",
        duration: "Select Duration",
        periodType: "Select Period Types",
        priority: "Select Priority",
        companyType: "Select medical group of institution / provider",
        statusChange: "Select New Status",
        noData: "No data found.Do you want to add new item?",
      },
      institution: {
        alreadyInCoTitle: "Do you want to continue with this provider?",
        alreadyInCoSubTitle1:
          "The suggested institution already exists. Please see the details given below:",
        alreadyInCoSubTitle2: "Do you want to continue with this?",
        addTitle: "Add Institution",
        addMessage: "Are you sure you want to add this institution?",
        submitTitle: "Add Institution Request Received",
        submitMessage:
          "Thanks for your suggestion. Your request is currently under review. You'll receive a notification from us once the institution is approved. Please fill the rest of the detail and submit your request. The request kept as Pending and forwarded to the records custodian once the institution has been approved. If you need any assistance, feel free to reach us at ",
        saveConfirmTitle: "Edit Institution",
        saveConfirmMessage: "Are you sure you want to save the changes?",
        approveConfirmTitle: "Approve Institution",
        approveConfirmMessage:
          "Are you sure you want to approve this institution?",
        saveTitle: "Institution saved successfully",
        saveMessage: "Institution details saved successfully",
        cancelTitle: "Are you sure you want to leave?",
        cancelMessage:
          "You have unsaved changes. Are you sure you want to leave this page without saving the changes? Unsaved changes will be lost.",
        approveTitle: "Institution approved successfully",
        approveMessage1: "Your request to approve '",
        approveMessage2: "' has been processed successfully.",
        approvedTitle: "Institution already approved",
        approvedMessage: "This institution is already approved by ",
        errorTitle: "Add Institution Request Failed",
        errorMessage:
          "There was an error while processing your request. Please try again later. If this continues, please reach out to  ",
        alreadyExistsTitle: "Institution Already Exists",
      },
      deny: {
        denyMessage: "Are you sure you want to deny the request?",
        denyTitle: "Denial Confirmation",
        denySubMessage:
          "The notes documented here will also be included in the denial letter that is communicated with the patient/requester.",
      },
      name: "My Requests",
      mraname: "My Tasks",
      createName: "Create Medical Records Request",
      formSubtitle: "Create request",
      formTitle: "Patient Record Request Form",
      amount: "1 review |||| %{smart_count} reviews",
      relative_to_poster: "Review on poster",
      detail: "Review detail",
      see: "See the latest requests",
      browse: "Browse requests",
      create: "Create Request",
      hipaa_success: "Successfully sent HIPAA reminder email.",
      institution_success:
        "Successfully send reminder email for institution approval.",
      sud_success: "Successfully send Substance Use Disorder reminder email.",
      hipaa_error: "Failed to send reminder email.Please try again later.",
      institution_error:
        "Failed to send reminder email.Please try again later.",
      sud_error: "Failed to send reminder email.Please try again later.",
      notificationIntervalError1: "Your last reminder was sent ",
      notificationIntervalError2:
        ". As per our policy, you are allowed to send the next reminder after ",
      notificationIntervalError3:
        ". If you require further assistance, please feel free to reach out to us at " +
        REACT_APP_SUPPORT_MAIL_ADDRESS,
      notificationLimitExceeded:
        "The maximum number of reminders has been exceeded. For further assistance or any inquiries, please feel free to contact us at " +
        REACT_APP_SUPPORT_MAIL_ADDRESS,

      outstanding: "Outstanding Requests",
      expiring: "Expired Requests",
      filters: {
        priority: "Priority",
        status: "Status",
        requestType: "Request Type",
        requestCategory: "Category",
      },
      fields: {
        customer_id: "Customer",
        command_id: "Order",
        product_id: "Product",
        date_gte: "Posted since",
        date_lte: "Posted before",
        date: "Date",
        comment: "Comment",
        rating: "Rating",
      },
      action: {
        accept: "Accept",
        reject: "Reject",
      },
      notification: {
        create_success_medical: "Successfully created medical record request.",
        create_success_addendum: "Successfully created addendum request.",
        create_success_billing:
          "Successfully created billing/insurance request.",
        create_failed: "Error: Request not Created",
        rejected_success: "Review rejected",
        rejected_error: "Error: Review not rejected",
        errorTitleMrr: "Request Creation Failed",
        errorTitleSendToProvider: "Request Submission Failed",
        errorMessageMrr:
          "There was an error while processing your request.Please try again later.If this continues, please reach out to  ",
      },
      error: {
        invalid_file: "Please upload image/pdf file",
        invalid_image_file: "Please upload image file",
        upload_error: "Please upload required files",
        institution_error:
          "Please add the new institution details and submit the institution first before submitting the request",
        sensitive_error: "Please select any Sensitive Information Option",
        mandatory_error: "Please fill in the mandatory fields",
        permission_error: "You don't have enough permission to create request",
        contact:
          "Please fill in the contact name, their email address or phone number and try again",
      },
    },
    segments: {
      name: "Segment |||| Segments",
      fields: {
        customers: "Customers",
        name: "Name",
      },
      data: {
        compulsive: "Compulsive",
        collector: "Collector",
        ordered_once: "Ordered once",
        regular: "Regular",
        returns: "Returns",
        reviewer: "Reviewer",
      },
    },
  },
};

export default customEnglishMessages;
