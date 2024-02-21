import type { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import moment from "moment";
import type { BaseSyntheticEvent } from "react";
import React, { useState } from "react";
import { useNotify, usePermissions, useTranslate } from "react-admin";
import { useMutation } from "@apollo/react-hooks";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import RequestCreationQuery from "../../queries/createRequest/createRequestQuery";
import type {
  CreateMedicalRecordsRequestMutation,
  CreateMedicalRecordsRequestMutationVariables,
  FileUploadInput,
  SentRequestToProviderMutation,
  SentRequestToProviderMutationVariables,
} from "../../__generated__/typescript-operations_all";
import createFileUploadQuery from "../../queries/createFileUpload/createFileUploadQuery";
import createIssueDescriptionMasters from "../../queries/createIssueDescriptionMasters/createIssueDescriptionMasters";
import createIssueImpactMasters from "../../queries/createIssueImpactMasters/createIssueImpactMasters";
import { HOW_LONG_LIST, STANDARD_PRIORITY } from "../../utils/constants";
// import useTraces from "../useTraces";
import type {
  AppState,
  ICheckPatientValidatorProps,
  IFileResponse,
  IHowLongVal,
} from "../../types";
import { correlationConstants } from "../../utils/OT/correlationConstants";
import { useSelector } from "react-redux";
// import { messages } from "../../utils/formUrls";
import { useHistory } from "react-router";
import useMedicalrequestGetFunctions from "./useMedicalRequestGetFunctions";
import useHandleValidateOnBlur from "./useHandleValidateOnBlur";
import sentToProviderQuery from "../../queries/sentToProvider/sentToProviderQuery";
import { CO_ROLE_PATIENT, CO_ROLE_PPA } from "../../utils/roles";
import { ERROR_MESSAGE_KEY } from "../../utils/messages/errorMessages";
const useCreateRequest = () => {
  const {
    setAssignedList,
    problemsFacedList,
    priorityList,
    obtainRecordList,
    impactFacedList,
    contactData,
    organizationList,
    assignToList,
    requestTypeList,
    institutionList,
    sourcesNatureList,
    sensitiveInfoList,
    disorderFileData,
    hipaaFileData,
    medicalFileData,
    personalRepData,
    getProblemsFaced,
    getReqStat,
    getContactData,
    getImpactings,
    getOrganization,
    getPriorityList,
    getFileDetails,
    getImpactFaced,
    getSourcesNature,
    getObtainRecord,
    getSensitiveInfoOption,
    getDepartmentHeadsId,
    getRequestData,
    requestData,
    obtainData,
    getObtainRecordDetails,
  } = useMedicalrequestGetFunctions();
  const translate = useTranslate();
  const notify = useNotify();
  const history = useHistory();
  const { permissions } = usePermissions();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [responseRequestId, setResponseRequestId] = useState(null);
  const [alertAddPatient, setAlertAddPatient] = useState(false);
  const today = moment(new Date()).format("YYYY-MM-DD");
  const [DOB, setDOB] = useState("");
  const [showFax, setShowFax] = useState(false);
  const [showPHR, setShowPHR] = useState(false);
  const [showOthers, setShowOthers] = useState(false);
  const [checkPatientValidation, setCheckPatientValidation] = useState(false);
  const [doSubmit, setDoSubmit] = useState(true);
  const [errorSet, setErrorSet] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);
  const [errorSensitive, setErrorSensitive] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inspectChecked, setInspectChecked] = useState(false);
  const [showDisorder, setShowDisorder] = useState(false);
  const [showHipaa, setShowHipaa] = useState(false);
  const [errorCode, setErrorCode] = useState("404");
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState(new Date(today));
  const [selectedToDate, setSelectedToDate] = useState(new Date(today));
  const [obtainCopyChecked, setObtainCopyChecked] = useState(false);
  const [showContactPersonal, setShowContactPersonal] = useState(false);
  const [showObtainRecords, setShowObtainRecords] = useState<boolean>(false);
  const [uploadStack, setUploadStack] = useState({});
  const [submittedProvider, setSubmittedProvider] = useState({});
  const [howLongVal, setHowLongVal] = useStateWithCallbackLazy<IHowLongVal>({
    howLong: translate("resources.requests.dropdown.duration"),
    howLongUnit: translate("resources.requests.dropdown.periodType"),
  });
  const [obtainedSet, setObtainedSet] = useState([]);
  const [departmentList, setDepartmentList] = useStateWithCallbackLazy([]);
  const { getTrace, handleTrace } = useTraces();
  const [mrrStatus, setMrrStatus] = useState(false);
  const [prStatus, setPrStatus] = useState(false);
  const [hipaaStatus, setHipaaStatus] = useState(false);
  const [sodStatus, setSodStatus] = useState(false);
  const [disableSaveAsDraft, setDisableSaveAsDraft] = useState(true);
  const [addInstitution, setAddInstitution] = useState(false);
  let howLongArray = HOW_LONG_LIST;
  const [problemStatus, setProblemStatus] = React.useState(false);
  const [priority, setPriority] = useState(0);
  const [impactStatus, setImpactStatus] = React.useState(false);
  const [howLongValue, setHowLongValue] = useState(HOW_LONG_LIST);
  const [openSubmitBase, setOpenSubmitBase] = useState(false);
  const [openErrorBase, setOpenErrorBase] = useState(false);
  const [openBase, setOpenBase] = useState(false);
  const [openProviderSubmitBase, setOpenProviderSubmitBase] = useState(false);
  const [openProviderErrorBase, setOpenProviderErrorBase] = useState(false);
  const [institutionAddError, setInstitutionAddError] = useState(false);
  const [source, setSource] = useState({
    id: "",
    organizationName: translate(
      "resources.requests.dropdown.sourceInstitution",
    ),
  });
  const [sourceNature, setSourceNature] = useState({
    id: "",
    value: translate("resources.requests.dropdown.sourceNature"),
  });
  const [department, setDepartment] = useState({
    id: "",
    organizationName: translate("resources.requests.dropdown.department"),
  });
  const [assignedTo, setAssignedTo] = useState({
    id: "",
    firstName: translate("resources.requests.dropdown.mra"),
  });
  const [requestType, setRequestType] = useState({
    id: "",
    value: translate("resources.requests.dropdown.requestType"),
  });

  const [submittedProviderView, setSubmittedProviderView] = useState(false);
  const [subscribeFileUploadMutation] = useMutation(createFileUploadQuery, {});
  const [type, setType] = useState("myself");
  const [subscribeMutation] = useMutation<
    CreateMedicalRecordsRequestMutation,
    CreateMedicalRecordsRequestMutationVariables
  >(RequestCreationQuery, {});
  const [subscribeSendToProviderMutation] = useMutation<
    SentRequestToProviderMutation,
    SentRequestToProviderMutationVariables
  >(sentToProviderQuery, {});
  const [subscribeUpdateIssueDescriptionMasterMutation] = useMutation(
    createIssueDescriptionMasters,
    {},
  );
  const [subscribeCreateIssueImpactMasterMutation] = useMutation(
    createIssueImpactMasters,
    {},
  );
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      backgroundColor: theme.palette.primary.light,
      marginTop: 20,
    },
    cardContent: {
      backgroundColor: theme.palette.primary.light,
    },
    select: {
      minWidth: "40%",
    },
    fileOuterComponent: {
      width: "300px",
      height: "150px",
      overflow: "hidden",
      paddingTop: "20px",
      paddingBottom: "20px",
    },
    image: {
      width: "300px",
    },
    imageDocument: {
      width: "150px",
    },
    arrowUp: {
      color: "green",
      fontSize: "12px",
      backgroundColor: "white",
      borderRadius: "50%",
    },
    arrowDown: {
      color: "blue",
      fontSize: "12px",
      backgroundColor: "white",
      borderRadius: "50%",
    },
    button: {
      margin: theme.spacing(1),
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      marginBottom: theme.spacing(2),
    },
    info: {
      cursor: "auto",
      marginTop: "0px",
      width: "15px",
      height: "15px",
      color: "grey",
    },
  }));
  const [mailToAddress, setMailToAddress] = useState(null);
  const [checked, setChecked] = useState({
    myself: false,
    physician: false,
    both: false,
  });
  const [formvalues, setFormvalues] = useStateWithCallbackLazy({
    problemsFaced: translate("resources.requests.dropdown.problemsFaced"),
    hippaAuth: true,
    substanceDisorderAuth: false,
    recordsFrom: today,
    recordsTo: today,
    obtainCopyMethodId: null,
    requestPriority: STANDARD_PRIORITY,
    rti: {
      id: 0,
      value: null,
      other: false,
      otherValue: null,
    },
    sourceInstitution: null,
    sourceNature: null,
    timePeriod: "",
    type: "request",
    assignedTo: null,
    attachment: null,
    contactByMail: 0,
    contactByPhone: 0,
    contactBySms: 0,
    communicationRequestId: null,
    obtainCopyDiffAddress: false,
    obtainCopyByPostalService: null,
    physicianAddress: null,
    requesterAddress: null,
    contactPersonally: 0,
    requester: userInfoReducer.id,
    servicedDate: new Date(),
    isRequestedSupport: false,
    isInspect: false,
    isObtainCopy: false,
    department: null,
    hasSensitiveInformation: false,
    hasPersonalRepresentative: false,
    disorderDisclosureAuthorizationFile: null,
    hasSignedRequest: false,
    hipaaAuthorizationFile: null,
    disorderRequestAuth: false,
    healthInformationAuth: false,
    mentalHealthCondition: false,
    sexualReproductiveCondition: false,
    impactFaced: "",
    impactOnPatients: 1,
    proxyDocument: null,
    mrn: "",
    obtainRecordType: [],
    inputs: [],
    faxNumber: null,
    phr: "",
    otherFormat: "",
    additionalNotes: "",
    isDependent: false,
    dependentPartyId: null,
    pdr: {
      city: "",
      country: 1,
      addressLine1: "",
      state: null,
      addressZip: "",
      birthDate: new Date(),
      electronicDetails: "",
      gender: {
        id: null,
        value: "",
        other: false,
        otherValue: "",
      },
      number: "",
      firstName: "",
      lastName: "",
      middleName: null,
      personType: 1,
      suffix: "",
      previousSuffix: "",
      preferredLanguageId: null,
      preferredPronouns: null,
      sex: {
        id: null,
        value: "",
        other: false,
        otherValue: "",
      },
      relationshipId: null,
      previousFirstName: "",
      previousLastName: "",
      previousMiddleName: "",
      previousAddressLine1: "",
      previousCity: "",
      previousState: null,
      previousCountry: 1,
      previousAddressZip: "",
      isPreviousAddress: false,
      ssn: null,
    },
    fingerPrint: "",
    otContext: {
      spanId: "",
      traceFlags: 1,
      traceId: "",
    },
    otTags: {
      name: "",
    },
  });
  const {
    handleValidateOnBlur,
    howLongStatus,
    howLongUnitStatus,
    sourceStatus,
    requestTypeStatus,
    sourceInstitutionStatus,
    priorityStatus,
    departmentStatus,
    assignedToStatus,
    setSourceStatus,
    setRequestTypeStatus,
    setSourceInstitutionStatus,
    setPriorityStatus,
    setDepartmentStatus,
    setAssignedToStatus,
    errorMsg,
    setErrorMsg,
    setError,
    setHowLongStatus,
    setHowLongUnitStatus,
  } = useHandleValidateOnBlur({ DOB, formvalues });
  const handleObtainCopyMethodChange = (event: BaseSyntheticEvent) => {
    if (event.target.value === "1" || event.target.value === "3") {
      setError("physicianAddress", "", false);
      setError("requesterAddress", "", false);
      setChecked({ myself: false, physician: false, both: false });
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          obtainCopyByPostalService: null,
          obtainCopyDiffAddress: false,
          physicianAddress: "",
          requesterAddress: "",
        }),
        () => {
          // set form
        },
      );
    } else {
      setChecked({ myself: true, physician: false, both: false });
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          obtainCopyByPostalService: 1,
          physicianAddress: "",
          requesterAddress: mailToAddress,
        }),
        () => {
          // set form
        },
      );
    }
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        obtainCopyMethodId: Number(event.target.value),
      }),
      () => {
        // set form
      },
    );
  };
  const handleChangeSensitive = (event: BaseSyntheticEvent) => {
    event.persist();
    if (event.target.value === "1") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          mentalHealthCondition: event.target.checked ? true : false,
        }),
        () => {
          // set form
        },
      );
    }

    if (event.target.value === "2") {
      setShowDisorder(event.target.checked ? true : false);
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          substanceDisorderAuth: event.target.checked ? true : false,
        }),
        () => {
          // set form
        },
      );
    }
    if (event.target.value === "3") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          sexualReproductiveCondition: event.target.checked ? true : false,
        }),
        () => {
          // set form
        },
      );
    }
  };
  const handleHowLongChange = (event: BaseSyntheticEvent) => {
    howLongArray = [];
    HOW_LONG_LIST.forEach((data) => {
      howLongArray.push(data);
    });

    setHowLongValue(howLongArray);
    event.persist();

    setHowLongVal(
      (prevHLFormState: IHowLongVal) => ({
        ...prevHLFormState,
        [event.target.name]: String(event.target.value),
      }),
      (currentVal: IHowLongVal) => {
        if (currentVal.howLong !== "0") {
          setFormvalues(
            (prevFormState) => ({
              ...prevFormState,
              timePeriod: String(
                currentVal.howLong + " " + currentVal.howLongUnit,
              ),
            }),
            () => {
              // set form
            },
          );
        } else {
          setFormvalues(
            (prevFormState) => ({
              ...prevFormState,
              timePeriod: "",
            }),
            () => {
              // set form
            },
          );
        }
      },
    );
  };
  const handleNumberChange = (event: BaseSyntheticEvent) => {
    event.persist();
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : Number(event.target.value),
      }),
      () => {
        // set form
      },
    );
  };
  const requestTypehandleNumberChange = (e: BaseSyntheticEvent, newValue) => {
    e.persist();
    if (newValue) {
      const { id, value } = newValue;
      setRequestType({ id: id, value: value });
    }
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        rti: {
          id: Number(newValue.id),
          value: newValue.value,
          other: Number(newValue.id) === 8 ? true : false,
          otherValue: "",
        },
        problemsFaced: translate("resources.requests.dropdown.problemsFaced"),
      }),
      () => {
        // set form
      },
    );
    getProblemsFaced(Number(newValue.id));
  };
  const sourceNaturehandleNumberChange = (e: BaseSyntheticEvent, newValue) => {
    e.persist();
    if (newValue) {
      const { id, value } = newValue;
      setSourceNature({ id: id, value: value });
    }
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        sourceNature: Number(newValue.id),
      }),
      () => {
        // set form
      },
    );
  };

  const handleToggleChange = (event: BaseSyntheticEvent) => {
    event.persist();
    if (event.target.value === "yes") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          [event.target.name]: true,
        }),
        () => {
          //set form
        },
      );
    } else {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          [event.target.name]: false,
        }),
        () => {
          //set form
        },
      );
    }
  };
  const handleCCChange = (event: BaseSyntheticEvent) => {
    event.persist();

    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        [event.target.name]:
          event.target.type === "checkbox" && event.target.checked ? 1 : 0,
      }),
      () => {
        //set form
      },
    );
  };
  const handleObtainChange = (event: BaseSyntheticEvent) => {
    event.persist();
    if (event.target.name === "phr") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          phr: event.target.value,
        }),
        () => {
          //set form
        },
      );
    }
    if (event.target.name === "faxNumber") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          faxNumber: event.target.value,
        }),
        () => {
          //set form
        },
      );
    } else if (event.target.name === "thirdPartyApps") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          otherFormat: event.target.value,
        }),
        () => {
          //set form
        },
      );
    }
  };
  const handleObtainCopyChange = (event: BaseSyntheticEvent) => {
    event.persist();
    const tempArr = [...formvalues.obtainRecordType];

    if (event.target.checked === true) {
      tempArr.push(Number(event.target.value));
      setObtainedSet(tempArr);
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          obtainRecordType: tempArr,
        }),
        () => {
          // set form
        },
      );

      if (event.target.name === "FAX") {
        setShowFax(true);
      }
      if (event.target.name === "Personal Health Record") {
        setShowPHR(true);
      }
      if (event.target.name === "OTHERS") {
        setShowOthers(true);
      }
    } else {
      const index = obtainedSet.indexOf(Number(event.target.value));
      if (index > -1) {
        setObtainedSet(obtainedSet.splice(index, 1));
      }

      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          obtainRecordType: obtainedSet,
        }),
        () => {
          // set form
        },
      );

      if (event.target.name === "FAX") {
        setShowFax(false);
      }
      if (event.target.name === "Personal Health Record") {
        setShowPHR(false);
      }
      if (event.target.name === "OTHERS") {
        setShowOthers(false);
      }
    }
  };
  const handleChangeFromDate = (value) => {
    let validationStatus: boolean;
    if (!value) {
      validationStatus = true;
      setSelectedFromDate(null);
    } else {
      validationStatus = false;
    }
    if (!validationStatus) {
      const format = "MM/DD/YYYY";
      const formattedValue = moment(value, format).format(format);
      const formatvalid = moment(formattedValue, format, true).isValid();
      const valid =
        moment(value).isAfter(new Date()) ||
        moment(value).isBefore(DOB) ||
        !formatvalid;
      setError("recordsFrom", valid && ERROR_MESSAGE_KEY, valid);
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          recordsFrom: value,
        }),
        () => {
          // set form
        },
      );
      setSelectedFromDate(value);
    }
    if (validationStatus) {
      setError("recordsFrom", "empty", true);
      setSelectedFromDate(null);
    }
  };
  const handleChangeToDate = (value) => {
    let validationStatus: boolean;
    if (!value) {
      validationStatus = true;
      setSelectedToDate(null);
    } else {
      validationStatus = false;
    }
    if (!validationStatus) {
      const format = "MM/DD/YYYY";
      const formattedValue = moment(value, format).format(format);
      const formatvalid = moment(formattedValue, format, true).isValid();
      const valid =
        moment(value).isAfter(new Date()) ||
        moment(value).isBefore(formvalues.recordsFrom) ||
        !formatvalid;
      setError("recordsTo", valid && ERROR_MESSAGE_KEY, valid);
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          recordsTo: value,
        }),
        () => {
          // set form
        },
      );
      setSelectedToDate(value);
    }
    if (validationStatus) {
      setError("recordsTo", "empty", true);
      setSelectedToDate(null);
    }
  };

  const handleChange = (event: BaseSyntheticEvent) => {
    event.persist();
    if (event.target.name === "requestTypeOther") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          rti: {
            ...prevFormState.rti,
            otherValue: event.target.value,
          },
        }),
        () => {
          // set form
        },
      );
    }
    if (event.target.name === "obtainCopyDiffAddress") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          requesterAddress: event.target.checked ? "" : mailToAddress,
        }),
        () => {
          // set form
        },
      );
    }
    if (event.target.name === "requestPriority") {
      setPriority(Number(event.target.value));
    }
    if (event.target.name === "contactPersonally") {
      if (event.target.checked) {
        setShowContactPersonal(true);
      } else {
        setShowContactPersonal(false);
      }

      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          [event.target.name]:
            event.target.type === "checkbox" && event.target.checked ? 1 : 0,
        }),
        () => {
          // set form
        },
      );
    } else if (event.target.name !== "requestTypeOther") {
      if (event.target.name === "isInspect") {
        setInspectChecked(event.target.checked);
        setShowObtainRecords(false);
      } else if (event.target.name === "isObtainCopy") {
        if (!event.target.checked) {
          setFormvalues(
            (prevFormState) => ({
              ...prevFormState,
              obtainRecordType: [],
              obtainCopyByPostalService: null,
              obtainCopyDiffAddress: false,
              physicianAddress: null,
              obtainCopyMethodId: null,
            }),
            () => {
              // set form
            },
          );
        }
        setObtainedSet([]);
        setObtainCopyChecked(event.target.checked);
        setShowObtainRecords(event.target.checked);
      }
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          [event.target.name]:
            event.target.type === "checkbox"
              ? event.target.checked
              : event.target.value,
        }),
        () => {
          // set form
        },
      );
    }
    if (event.target.name === "isRequestedSupport") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          [event.target.name]:
            event.target.type === "checkbox"
              ? event.target.checked
              : event.target.value,
        }),
        (curr) => {
          if (curr.isRequestedSupport === false) {
            setFormvalues(
              (prevFormState) => ({
                ...prevFormState,
                inputs: null,
              }),
              () => {
                // set form
              },
            );
          }
        },
      );
    }
    if (event.target.name === "hasSignedRequest") {
      if (event.target.value === "true") {
        errorMsg["MRR"][0] = false;
        errorMsg["MRR"][1] = "";
      }

      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          [event.target.name]:
            event.target.type === "checkbox"
              ? event.target.checked
              : event.target.value,
        }),
        (curr) => {
          if (curr.hasSignedRequest === false) {
            delete uploadStack["upload_file_patient_record_request"];
          }
        },
      );
    }
    if (event.target.name === "healthInformationAuth") {
      if (event.target.value === "true") {
        errorMsg["HIPAA"][0] = false;
        errorMsg["HIPAA"][1] = "";
      }
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          [event.target.name]:
            event.target.type === "checkbox"
              ? event.target.checked
              : event.target.value,
        }),
        (curr) => {
          if (curr.healthInformationAuth === false) {
            delete uploadStack["upload_file_health_information_auth"];
          }
        },
      );
    }
    if (event.target.name === "disorderRequestAuth") {
      if (event.target.value === "true") {
        errorMsg["SOD"][0] = false;
        errorMsg["SOD"][1] = "";
      }
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          [event.target.name]:
            event.target.type === "checkbox"
              ? event.target.checked
              : event.target.value,
        }),
        (curr) => {
          if (curr.disorderRequestAuth === false) {
            delete uploadStack["upload_file_disorder_Request_Auth"];
          }
        },
      );
    }
    if (event.target.name === "hasSensitiveInformation") {
      if (!event.target.checked) {
        setShowHipaa(false);
        setShowDisorder(false);
        setFormvalues(
          (prevFormState) => ({
            ...prevFormState,
            hippaAuth: false,
            substanceDisorderAuth: false,
          }),
          () => {
            // set form
          },
        );
      }
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          [event.target.name]:
            event.target.type === "checkbox"
              ? event.target.checked
              : event.target.value,
        }),
        (curr) => {
          if (curr.healthInformationAuth === false) {
            delete uploadStack["upload_file_health_information_auth"];
          }
          if (curr.hasSensitiveInformation === false) {
            delete uploadStack["upload_file_disorder_Request_Auth"];
          }
        },
      );
    }
  };
  const departmentHandleChange = (e: BaseSyntheticEvent, newValue) => {
    if (newValue) {
      const { id, organizationName } = newValue;
      setDepartment({ id: id, organizationName: organizationName });
      setAssignedList([]);
      getDepartmentHeadsId(newValue.id);
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          department: newValue.id,
          assignedTo: null,
        }),
        () => {
          // set form
        },
      );
      setAssignedTo({
        id: "",
        firstName: translate("resources.requests.dropdown.mra"),
      });
    }
  };
  const assignedToHandleChange = (e: BaseSyntheticEvent, newValue) => {
    e.persist();
    if (newValue) {
      const { id, firstName, middleName, lastName } = newValue;
      setAssignedTo({
        id: id,
        firstName: firstName + " " + middleName + " " + lastName,
      });
    }
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        assignedTo: newValue.assignedPersonId,
      }),
      () => {
        // set form
      },
    );
  };
  const getpatient = (patient) => {
    setDOB(patient.patientDOB);
    if (submittedEmail) {
      if (submittedEmail !== patient.patientEmail) {
        setDisableSubmit(false);
      } else {
        setDisableSubmit(true);
      }
    }
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        pdr: {
          city: patient.city,
          addressLine1: patient.street,
          addressLine2: patient.addressLine2,
          state: Number(patient.state),
          country: patient.street ? 1 : 0,
          addressZip: patient.zipCode,
          birthDate: new Date(patient.patientDOB),
          electronicDetails: patient.patientEmail,
          gender: {
            id: Number(patient.gender.id),
            value: patient.gender.value,
            other: patient.gender.other,
            otherValue: patient.gender.otherValue,
          },
          relationshipId: Number(patient.relationshipId),
          number: patient.patientPhone,
          firstName: patient.patientFirstName,
          lastName: patient.patientLastName,
          middleName: patient.patientMiddleName,
          personType: 1,
          ssn: patient.ssn ? patient.ssn.split("-").join("") : null,
          suffix: patient.suffix,
          previousSuffix: patient.previousSuffix,
          preferredLanguageId: Number(patient.preferredLanguageId),
          preferredPronouns: Number(patient.preferredPronouns),
          sex: {
            id: Number(patient.sex.id),
            value: patient.sex.value,
            other: patient.sex.other,
            otherValue: patient.sex.otherValue,
          },
          previousFirstName: patient.previousFirstName,
          previousLastName: patient.previousLastName,
          previousMiddleName: patient.previousMiddleName,
          previousAddressLine1: patient.previousAddressLine1,
          previousAddressLine2: patient.previousAddressLine2,
          previousCity: patient.previousCity,
          previousState: Number(patient.previousState),
          previousCountry: Number(patient.previousCountry),
          previousAddressZip: patient.previousAddressZip,
          isPreviousAddress: patient.isPreviousAddress,
        },
      }),
      () => {
        if (permissions === CO_ROLE_PATIENT) {
          setMailToAddress(
            (patient.street ? patient.street + "\n" : "") +
            (patient.addressLine2 ? patient.addressLine2 + "\n" : "") +
            (patient.city ? patient.city + "\n" : "") +
            (patient.stateValue ? patient.stateValue + ", " : "") +
            patient.countryValue +
            "\n" +
            (patient.zipCode !== "" ? patient.zipCode : ""),
          );
        }
      },
    );
  };
  const getContact = (contactDetail) => {
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        inputs: contactDetail.map((value) => ({
          name: value.contactName,
          email: value.email,
          phone: value.phone,
        })),
      }),
      () => {
        // set form
      },
    );
  };
  const getInstitution = (institution) => {
    setSubmittedProvider(institution);
    setSource({
      id: "",
      organizationName: institution.companyName,
    });
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        communicationRequestId: institution.communicationRequestId,
      }),
      () => {
        // set form
      },
    );
  };

  const onAddOption = (value, type) => {
    let valueAltered = value;
    if (typeof value !== "string") {
      valueAltered = value.value;
    } else {
      if (type === "IssueDescriptionMastersMedical") {
        if (formvalues.rti.id === 0) {
          setRequestTypeStatus(true);
        } else {
          subscribeUpdateIssueDescriptionMasterMutation({
            variables: {
              input: {
                rti: formvalues.rti,
                title: valueAltered,
              },
            },
          }).then(() => {
            // console.log(res);
          });
        }
      }
      if (type === "IssueImpactMaster") {
        subscribeCreateIssueImpactMasterMutation({
          variables: {
            input: {
              issueImpact: valueAltered,
            },
          },
        }).then(() => {
          // console.log(res);
        });
      }
    }
    if (type === "IssueDescriptionMastersMedical") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          problemsFaced: valueAltered,
        }),
        () => {
          //set form
        },
      );
    }
    if (type === "IssueImpactMaster") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          impactFaced: valueAltered,
        }),
        () => {
          //set form
        },
      );
    }
  };

  const mutationFunction = (bodyData) => {
    const eventObj =
      correlationConstants[permissions === CO_ROLE_PPA ? "ev-062" : "ev-141"];
    const inputContext = {
      action: "Submitted Medical record Request",
      aecId: eventObj.aecId,
      aecIeId: eventObj.aecIeId,
    };
    handleTrace(
      eventObj.eventTitle,
      inputContext,
      (spanContext: any, fingerprint: any) => {
        bodyData.otContext = JSON.stringify(spanContext);
        bodyData.fingerPrint = fingerprint;
        bodyData.otTags = JSON.stringify({
          name: "Attempt to submit Medical Records Request",
        });
        subscribeMutation({ variables: { input: bodyData } }).then(
          async (response) => {
            setIsLoading(false);
            setErrorSet(false);
            setErrorUpload(false);
            if (
              response.data.createMedicalRecordsRequest.requestResult.success
            ) {
              await setId(
                JSON.parse(
                  response.data.createMedicalRecordsRequest.requestResult
                    .result,
                )["request id"],
              );
              setSubmitted(true);
              setOpenSubmitBase(true);
              if (permissions === CO_ROLE_PPA)
                getTrace(
                  "Display 'Successfully created request'  message",
                  "ev-063",
                  userInfoReducer.email,
                );
              else
                getTrace(
                  "Display 'Successfully created request'  message",
                  "ev-142",
                  userInfoReducer.email,
                );
            } else {
              if (
                JSON.parse(
                  response.data.createMedicalRecordsRequest.requestResult
                    .status,
                ).code === 403
              ) {
                setErrorCode("403");
              } else {
                setErrorCode("404");
              }
              setOpenErrorBase(true);
            }
          },
        );
      },
    ); //end of handletrace
  };
  const saveAsDraftHandler = () => {
    // subscribeMutation({ variables: { input: formvalues } }).then((response) => {
    //   if (response.data.createMedicalRecordsRequest.requestResult.success) {
    //     notify(messages.saveAsDraft.success, {
    //       type: "success",
    //     });
    //   } else {
    //     notify(messages.saveAsDraft.failed, {
    //       type: "warning",
    //     });
    //   }
    // });
  };
  const submitRequestConfirmed = () => {
    setOpenBase(false);
    setIsLoading(true);
    if (permissions === CO_ROLE_PPA)
      getTrace(
        "Valid Data Filled by User in Medical Record Request",
        "ev-055",
        userInfoReducer.email,
      );
    else if (permissions === CO_ROLE_PATIENT)
      getTrace(
        "Valid Data Filled by User in Medical Record Request",
        "ev-137",
        userInfoReducer.email,
      );
    if (Object.entries(uploadStack).length > 0) {
      let fileUploadResponse: any = {};
      Object.entries(uploadStack).forEach(async (indvUploadAct, key) => {
        fileUploadResponse = await uploadFileMutation(
          uploadStack[indvUploadAct[0]],
          key,
          Object.entries(uploadStack).length,
          fileUploadResponse,
        );
      });
    } else {
      mutationFunction(formvalues);
    }
  };
  const handleSendToProvider = (requestId) => {
    setIsLoading(true);

    subscribeSendToProviderMutation({
      variables: {
        input: {
          pendingRequestId: requestId,
        },
      },
    }).then((res) => {
      setIsLoading(false);
      if (res.data.sentRequestToProvider.userInviteId) {
        setOpenProviderSubmitBase(true);
      } else {
        setOpenProviderErrorBase(true);
      }
    });
  };
  async function alert() {
    setAlertAddPatient(false);
  }
  async function setId(id) {
    setResponseRequestId(id);
  }
  const submitHandler = async () => {
    await alert();
    if (
      (howLongVal.howLong ===
        translate("resources.requests.dropdown.duration") ||
        howLongVal.howLong === "0") &&
      howLongVal.howLongUnit !==
      translate("resources.requests.dropdown.periodType")
    ) {
      setHowLongStatus(true);
    }
    if (
      howLongVal.howLong !==
      translate("resources.requests.dropdown.duration") &&
      howLongVal.howLong !== "0" &&
      howLongVal.howLongUnit ===
      translate("resources.requests.dropdown.periodType")
    ) {
      setHowLongUnitStatus(true);
    }
    if (!addInstitution && !submittedProviderView) {
      setInstitutionAddError(false);

      if (formvalues.sourceNature === 0 || formvalues.sourceNature === null) {
        setSourceStatus(true);
        formvalues.sourceNature = null;
      }
      if (
        formvalues.sourceInstitution === 0 ||
        formvalues.sourceInstitution === null
      ) {
        setSourceInstitutionStatus(true);
        formvalues.sourceInstitution = null;
      }
      if (formvalues.department === "" || formvalues.department === null) {
        setDepartmentStatus(true);
        formvalues.department = null;
      }
    } else {
      setSourceStatus(false);
      formvalues.sourceNature = null;
      setSourceInstitutionStatus(false);
      formvalues.sourceInstitution = null;
      setDepartmentStatus(false);
      formvalues.department = null;
      setAssignedToStatus(false);
      formvalues.assignedTo = null;
      if (formvalues.communicationRequestId === null) {
        setInstitutionAddError(true);
      } else {
        setInstitutionAddError(false);
      }
    }

    setErrorUpload(false);
    let noSensitiveSelect = false;
    if (
      formvalues.hasSensitiveInformation &&
      !formvalues.mentalHealthCondition &&
      !formvalues.substanceDisorderAuth &&
      !formvalues.sexualReproductiveCondition
    ) {
      noSensitiveSelect = true;
      setErrorSensitive(translate(`resources.requests.error.sensitive_error`));
    } else {
      noSensitiveSelect = false;
      setErrorSensitive("");
    }
    if (formvalues.impactFaced === "") {
      setImpactStatus(true);
    }
    if (formvalues.rti.id === 0) {
      setRequestTypeStatus(true);
    }
    if (formvalues.rti.id === 8 && !formvalues.rti.otherValue) {
      setError("requestTypeOther", "empty", true);
    }
    if (
      (formvalues.obtainCopyByPostalService === 1 ||
        formvalues.obtainCopyByPostalService === 3) &&
      !formvalues.requesterAddress
    ) {
      setError("requesterAddress", "empty", true);
    } else {
      setError("requesterAddress", "", false);
    }
    if (
      (formvalues.obtainCopyByPostalService === 2 ||
        formvalues.obtainCopyByPostalService === 3) &&
      !formvalues.physicianAddress
    ) {
      setError("physicianAddress", "empty", true);
    } else {
      setError("physicianAddress", "", false);
    }
    if (formvalues.requestPriority === 0) {
      setPriorityStatus(true);
    }
    let isRequestValid = true;
    if (!formvalues.hasPersonalRepresentative) {
      setPrStatus(false);
    }
    if (!formvalues.hasSignedRequest) {
      setMrrStatus(false);
    }
    if (!formvalues.healthInformationAuth) {
      setHipaaStatus(false);
    }
    if (!formvalues.disorderRequestAuth) {
      setSodStatus(false);
    }
    Object.entries(errorMsg).forEach((indv) => {
      if (indv[1][0]) {
        isRequestValid = false;
      }
    });
    if (checkPatientValidation) {
      setAlertAddPatient(true);
    }
    if (!checkPatientValidation) {
      setAlertAddPatient(false);
    }
    if (checkPatientValidation && isRequestValid) {
      setErrorSet(false);
    }
    if (formvalues.hasSignedRequest && !mrrStatus && !errorMsg["MRR"][0]) {
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["MRR"]: {
          0: true,
          1: "Please Attach a Medical Record Request",
        },
      }));
    }
    if (
      formvalues.hasPersonalRepresentative &&
      !prStatus &&
      !errorMsg["PR"][0]
    ) {
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["PR"]: {
          0: true,
          1: "Please Attach a Valid Documentation of Personal Representative ",
        },
      }));
    }
    if (
      formvalues.healthInformationAuth &&
      !hipaaStatus &&
      !errorMsg["HIPAA"][0]
    ) {
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["HIPAA"]: {
          0: true,
          1: "Please Attach a HIPAA form",
        },
      }));
    }
    if (formvalues.disorderRequestAuth && !sodStatus && !errorMsg["SOD"][0]) {
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["SOD"]: {
          0: true,
          1: "Please Attach a Substance Use Disorder form",
        },
      }));
    }
    if (
      !doSubmit ||
      noSensitiveSelect ||
      !formvalues.pdr.birthDate ||
      !formvalues.pdr.firstName ||
      !formvalues.pdr.lastName ||
      !formvalues.pdr.sex.id ||
      !formvalues.pdr.gender.id ||
      (formvalues.pdr.sex.id === 8 && formvalues.pdr.sex.otherValue === "") ||
      (formvalues.pdr.gender.id === 9 &&
        formvalues.pdr.gender.otherValue === "") ||
      (formvalues.rti.id === 8 && !formvalues.rti.otherValue) ||
      (type !== "dependent" &&
        (!formvalues.pdr.electronicDetails ||
          !formvalues.pdr.number ||
          !formvalues.pdr.city ||
          !formvalues.pdr.addressLine1 ||
          !formvalues.pdr.state ||
          !formvalues.pdr.addressZip ||
          !formvalues.pdr.preferredLanguageId ||
          !formvalues.pdr.preferredPronouns ||
          !formvalues.pdr.state)) ||
      ((formvalues.obtainCopyByPostalService === 1 ||
        formvalues.obtainCopyByPostalService === 3) &&
        !formvalues.requesterAddress) ||
      ((formvalues.obtainCopyByPostalService === 2 ||
        formvalues.obtainCopyByPostalService === 3) &&
        !formvalues.physicianAddress) ||
      sourceStatus ||
      sourceInstitutionStatus ||
      departmentStatus ||
      ((howLongVal.howLong ===
        translate("resources.requests.dropdown.duration") ||
        howLongVal.howLong === "0") &&
        howLongVal.howLongUnit !==
        translate("resources.requests.dropdown.periodType")) ||
      (howLongVal.howLong !==
        translate("resources.requests.dropdown.duration") &&
        howLongVal.howLong !== "0" &&
        howLongVal.howLongUnit ===
        translate("resources.requests.dropdown.periodType")) ||
      (!addInstitution &&
        !submittedProviderView &&
        (formvalues.sourceNature === 0 ||
          formvalues.sourceNature === null ||
          formvalues.sourceInstitution === 0 ||
          formvalues.sourceInstitution === null ||
          formvalues.department === 0 ||
          formvalues.department === null)) ||
      formvalues.rti.id === 0 ||
      formvalues.impactFaced === "" ||
      formvalues.requestPriority === 0 ||
      !isRequestValid ||
      (formvalues.hasSignedRequest && !mrrStatus) ||
      (formvalues.healthInformationAuth && !hipaaStatus) ||
      (formvalues.disorderRequestAuth && !sodStatus) ||
      (formvalues.hasPersonalRepresentative && !prStatus) ||
      (!formvalues.communicationRequestId &&
        (addInstitution || submittedProviderView))
    ) {
      setIsLoading(false);
      if (
        errorMsg.MRR[0] ||
        errorMsg.HIPAA[0] ||
        errorMsg.SOD[0] ||
        errorMsg.PR[0]
      ) {
        setErrorUpload(true);
      } else if (
        (formvalues.hasSignedRequest && !mrrStatus) ||
        (formvalues.healthInformationAuth && !hipaaStatus) ||
        (formvalues.disorderRequestAuth && !sodStatus) ||
        (formvalues.hasPersonalRepresentative && !prStatus)
      ) {
        setErrorUpload(true);
      } else {
        setErrorSet(true);
      }
    } else {
      if (checkPatientValidation) {
        setOpenBase(true);
      } else {
        setIsLoading(false);
        setErrorSet(true);
      }
    }
  };
  async function uploadFileMutation(
    attachmentResponse: { response: any; name: string },
    key: number,
    leng: number,
    fileUploadResponse: any,
  ) {
    if (attachmentResponse.response) {
      const fileUpload: FileUploadInput = {
        fileName: attachmentResponse.response,
        fileType: attachmentResponse.name || "",
      };

      await subscribeFileUploadMutation({
        variables: { input: { fileUpload: fileUpload } },
      }).then((res) => {
        if (res.data.createFileUpload.fileUpload.id) {
          const fieldSet =
            attachmentResponse.name === "upload_file_patient_record_request"
              ? "attachment"
              : attachmentResponse.name ===
                "upload_file_health_information_auth"
                ? "hipaaAuthorizationFile"
                : attachmentResponse.name ===
                  "upload_file_personal_representative_document"
                  ? "proxyDocument"
                  : "disorderDisclosureAuthorizationFile";
          fileUploadResponse[fieldSet] =
            res.data.createFileUpload.fileUpload.id;

          if (Object.entries(fileUploadResponse).length === leng) {
            setFormvalues(
              (prev) => ({
                ...prev,
                ...fileUploadResponse,
              }),
              (currentValue) => {
                mutationFunction(currentValue);
              },
            );
          } else {
            return fileUploadResponse;
          }
        }
        //   }
        // );
      });
    }
  }

  const checkPatientValidator = ({
    isValid,
    isInit,
  }: ICheckPatientValidatorProps) => {
    setCheckPatientValidation(isValid ? isValid : isInit);
    if (isValid) {
      setDisableSaveAsDraft(false);
    } else {
      setDisableSaveAsDraft(true);
    }
    setDoSubmit(isValid);
  };

  const fileResponseHandler = (response: IFileResponse) => {
    if (
      response.name === "upload_file_personal_representative_document" &&
      formvalues.hasPersonalRepresentative &&
      response.response === ""
    ) {
      setPrStatus(false);
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["PR"]: {
          0: true,
          1: "",
        },
      }));
    } else if (
      response.name === "upload_file_personal_representative_document" &&
      formvalues.hasPersonalRepresentative &&
      response.response !== ""
    ) {
      setPrStatus(true);
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["PR"]: {
          0: false,
          1: "",
        },
      }));
    }
    if (
      response.name === "upload_file_patient_record_request" &&
      formvalues.hasSignedRequest &&
      response.response === ""
    ) {
      setMrrStatus(false);
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["MRR"]: {
          0: true,
          1: "",
        },
      }));
    } else if (
      response.name === "upload_file_patient_record_request" &&
      formvalues.hasSignedRequest &&
      response.response !== ""
    ) {
      setMrrStatus(true);
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["MRR"]: {
          0: false,
          1: "",
        },
      }));
    }
    if (
      response.name === "upload_file_disorder_Request_Auth" &&
      formvalues.disorderRequestAuth &&
      response.response === ""
    ) {
      setSodStatus(false);
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["SOD"]: {
          0: true,
          1: "",
        },
      }));
    } else if (
      response.name === "upload_file_disorder_Request_Auth" &&
      formvalues.disorderRequestAuth &&
      response.response !== ""
    ) {
      setSodStatus(true);
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["SOD"]: {
          0: false,
          1: "",
        },
      }));
    }
    if (
      response.name === "upload_file_health_information_auth" &&
      formvalues.healthInformationAuth &&
      response.response === ""
    ) {
      setHipaaStatus(false);
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["HIPAA"]: {
          0: true,
          1: "",
        },
      }));
    } else if (
      response.name === "upload_file_health_information_auth" &&
      formvalues.healthInformationAuth &&
      response.response !== ""
    ) {
      setHipaaStatus(true);
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["HIPAA"]: {
          0: false,
          1: "",
        },
      }));
    }

    if (response.name === "upload_file_patient_record_request") {
      if (permissions === CO_ROLE_PPA)
        getTrace(
          "Patient Record Request Form attached",
          "ev-056",
          userInfoReducer.email,
        );
      else if (permissions === CO_ROLE_PATIENT)
        getTrace(
          "Patient Record Request Form attached",
          "ev-138",
          userInfoReducer.email,
        );
    } else if (response.name === "upload_file_disorder_Request_Auth") {
      if (permissions === CO_ROLE_PPA)
        getTrace(
          "Substance Use Disorders form attached",
          "ev-058",
          userInfoReducer.email,
        );
      else if (permissions === CO_ROLE_PATIENT)
        getTrace(
          "Substance Use Disorders form attached",
          "ev-139",
          userInfoReducer.email,
        );
    } else if (response.name === "upload_file_health_information_auth") {
      if (permissions === CO_ROLE_PPA)
        getTrace(
          "HIPAA authorization Form attached",
          "ev-060",
          userInfoReducer.email,
        );
      else if (permissions === CO_ROLE_PATIENT)
        getTrace(
          "HIPAA authorization Form attached",
          "ev-140",
          userInfoReducer.email,
        );
    }
    setUploadStack((prev) => ({
      ...prev,
      [response.name]: response,
    }));
  };

  return {
    useStyles,
    formvalues,
    setFormvalues,
    today,
    handleValidateOnBlur,
    setError,
    submitHandler,
    openSubmitBase,
    setOpenSubmitBase,
    setAssignedTo,
    errorSet,
    translate,
    errorUpload,
    getTrace,
    userInfoReducer,
    permissions,
    setPriorityStatus,
    notify,
    setMailToAddress,
    history,
    setHowLongVal,
    getImpactings,
    getReqStat,
    getImpactFaced,
    getSourcesNature,
    getOrganization,
    getPriorityList,
    getObtainRecord,
    getSensitiveInfoOption,
    handleChange,
    errorMsg,
    source,
    checkPatientValidator,
    obtainData,
    getObtainRecordDetails,
    getpatient,
    alertAddPatient,
    getFileDetails,
    handleCCChange,
    handleChangeSensitive,
    handleHowLongChange,
    handleNumberChange,
    setErrorMsg,
    getInstitution,
    handleObtainChange,
    handleObtainCopyChange,
    requestTypeList,
    problemsFacedList,
    onAddOption,
    impactFacedList,
    howLongVal,
    howLongValue,
    DOB,
    howLongStatus,
    howLongUnitStatus,
    sourcesNatureList,
    institutionList,
    departmentList,
    assignToList,
    setSource,
    getContact,
    obtainCopyChecked,
    inspectChecked,
    showObtainRecords,
    obtainRecordList,
    setAssignedList,
    organizationList,
    setDepartmentList,
    getDepartmentHeadsId,
    disableSaveAsDraft,
    setAddInstitution,
    addInstitution,
    showFax,
    showOthers,
    showPHR,
    showContactPersonal,
    priorityList,
    fileResponseHandler,
    errorSensitive,
    disorderFileData,
    hipaaFileData,
    medicalFileData,
    personalRepData,
    showHipaa,
    showDisorder,
    setShowDisorder,
    sensitiveInfoList,
    setShowObtainRecords,
    isLoading,
    handleToggleChange,
    saveAsDraftHandler,
    sourceStatus,
    requestTypeStatus,
    sourceInstitutionStatus,
    priorityStatus,
    departmentStatus,
    assignedToStatus,
    type,
    setType,
    sourceNature,
    setSourceNature,
    department,
    setDepartment,
    handleSendToProvider,
    departmentHandleChange,
    sourceNaturehandleNumberChange,
    assignedTo,
    assignedToHandleChange,
    setSourceStatus,
    setSourceInstitutionStatus,
    setDepartmentStatus,
    setAssignedToStatus,
    checked,
    setChecked,
    requestType,
    requestTypehandleNumberChange,
    problemStatus,
    impactStatus,
    setProblemStatus,
    setImpactStatus,
    setOpenErrorBase,
    openErrorBase,
    setOpenBase,
    openProviderSubmitBase,
    setOpenProviderSubmitBase,
    institutionAddError,
    openProviderErrorBase,
    setOpenProviderErrorBase,
    openBase,
    submitRequestConfirmed,
    priority,
    setPriority,
    submittedProviderView,
    setSubmittedProviderView,
    setIsLoading,
    getContactData,
    contactData,
    requestData,
    getRequestData,
    setRequestType,
    setShowFax,
    errorCode,
    setShowPHR,
    setSubmittedEmail,
    submittedEmail,
    setShowOthers,
    setShowContactPersonal,
    submittedProvider,
    responseRequestId,
    handleObtainCopyMethodChange,
    selectedFromDate,
    selectedToDate,
    handleChangeFromDate,
    handleChangeToDate,
    setSelectedFromDate,
    setSelectedToDate,
    submitted,
    setSubmitted,
    disableSubmit,
    setDisableSubmit,
  };
};

export default useCreateRequest;
