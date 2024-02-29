import React, { useEffect, useState } from "react";
import { useDataProvider, useRefresh, useVersion } from "react-admin";
// import {
//   Box,
//   Checkbox,
//   CircularProgress,
//   Container,
//   Divider,
//   FormControlLabel,
//   Grid,
//   InputLabel,
//   LinearProgress,
//   Radio,
//   RadioGroup,
//   Typography,
// } from "@material-ui/core";
import { TOOLTIP } from "../../../utils/toolTip";
import type {
  GetInstitutionApprovalInfoMutation,
  GetInstitutionApprovalInfoMutationVariables,
} from "../../../__generated__/typescript-operations_all";
// import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
// import CardActions from "@material-ui/core/CardActions";
import AddPatient from "../../../components/addPatient";
import CardHeader from "./../../../components/cardHeader";
import UploadFile from "./../../../components/uploadFile";
import ContactDetails from "./contactDetails";
// import type {
//   ICheckPatientValidatorProps,
//   IHowLongVal,
//   IOrganization,
// } from "../../../types";
import CreatePageHeader from "../../../components/createPageHeader";
import { addPatientErrorMessages } from "../../../utils/messages/errorMessages";
import { HOW_LONG_UNITS } from "../../../utils/constants";
import AutoCompleteWithCreateOption from "../../../components/autocomplete";
import useCreateRequest from "../../../hooks/MedicalRecord/useCreateRequest";
import {
  CO_ROLE_MRA,
  CO_ROLE_PATIENT,
  CO_ROLE_PPA,
} from "../../../utils/roles";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  InputLabel,
  LinearProgress,
  TextField,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { BootstrapTooltip as Tooltip } from "../../../components/Tooltip";
import MuiToggleButton from "@mui/material/ToggleButton";
import { styled } from "@mui/material/styles";
import InstitutionDetails from "./institutionDetails";
import { Info } from "@mui/icons-material";
import "semantic-ui-css/semantic.min.css";
import BaseModal from "../../../components/baseModal";
import { REQUEST_MESSAGES } from "../../../utils/messages/requestMessages";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import moment from "moment";
import ProviderView from "../../../components/providerView";
import { useMutation } from "@apollo/react-hooks";
import getInstitutionApprovalInfoQuery from "../../../queries/getInstitutionApprovalInfoQuery/getInstitutionApprovalInfoQuery";
import { compareObjects } from "../../../utils/compareObjects";
import PageNotFound from "../../../components/pageNotFound";
import ProviderData from "./providerData";
import { perPageMax } from "../../../utils/pageConstants";
import { tommddyyyy } from "../../../utils/dateFormator";
import MuiPhoneNumber from "material-ui-phone-number";
import DatePickerWithMonthAndYearDropdown from "../../../components/datePicker";
import DependentTable from "../../../components/dependentTable";

export default function CreateRequest({ trackId }): JSX.Element {
  const {
    useStyles,
    formvalues,
    setFormvalues,
    handleValidateOnBlur,
    setSource,
    setHowLongVal,
    sensitiveInfoList,
    setSelectedFromDate,
    setSelectedToDate,
    isLoading,
    submitHandler,
    setSubmittedEmail,
    responseRequestId,
    institutionAddError,
    errorSet,
    setError,
    translate,
    setOpenBase,
    openBase,
    errorUpload,
    setShowFax,
    setShowContactPersonal,
    setShowPHR,
    priorityStatus,
    setShowOthers,
    setAssignedList,
    setShowDisorder,
    organizationList,
    setDepartmentList,
    submitRequestConfirmed,
    setPriorityStatus,
    type,
    setType,
    setIsLoading,
    submitted,
    getTrace,
    userInfoReducer,
    getFileDetails,
    permissions,
    getContactData,
    contactData,
    notify,
    history,
    source,
    openSubmitBase,
    setOpenSubmitBase,
    openErrorBase,
    setOpenErrorBase,
    problemStatus,
    impactStatus,
    setProblemStatus,
    setShowObtainRecords,
    priority,
    setPriority,
    setImpactStatus,
    setSourceNature,
    getImpactings,
    getReqStat,
    getImpactFaced,
    getSourcesNature,
    getPriorityList,
    getObtainRecord,
    getRequestData,
    getSensitiveInfoOption,
    handleChange,
    errorMsg,
    setSourceStatus,
    setSourceInstitutionStatus,
    setDepartmentStatus,
    setAssignedToStatus,
    setErrorMsg,
    checkPatientValidator,
    checked,
    setChecked,
    getpatient,
    alertAddPatient,
    handleCCChange,
    handleChangeSensitive,
    handleHowLongChange,
    obtainData,
    getObtainRecordDetails,
    handleToggleChange,
    handleObtainChange,
    handleObtainCopyMethodChange,
    handleObtainCopyChange,
    requestTypeList,
    problemsFacedList,
    onAddOption,
    impactFacedList,
    howLongVal,
    howLongValue,
    showContactPersonal,
    priorityList,
    fileResponseHandler,
    errorSensitive,
    setAssignedTo,
    showDisorder,
    errorCode,
    sourcesNatureList,
    institutionList,
    departmentList,
    assignToList,
    getContact,
    getInstitution,
    submittedProvider,
    obtainCopyChecked,
    inspectChecked,
    showObtainRecords,
    obtainRecordList,
    getOrganization,
    showFax,
    showOthers,
    showPHR,
    sourceStatus,
    sourceInstitutionStatus,
    departmentStatus,
    sourceNature,
    department,
    setDepartment,
    departmentHandleChange,
    sourceNaturehandleNumberChange,
    assignedTo,
    assignedToHandleChange,
    requestType,
    requestTypehandleNumberChange,
    requestTypeStatus,
    howLongStatus,
    howLongUnitStatus,
    submittedProviderView,
    setSubmittedProviderView,
    addInstitution,
    setAddInstitution,
    openProviderSubmitBase,
    setOpenProviderSubmitBase,
    openProviderErrorBase,
    setOpenProviderErrorBase,
    setRequestType,
    disorderFileData,
    hipaaFileData,
    medicalFileData,
    selectedFromDate,
    disableSubmit,
    setDisableSubmit,
    selectedToDate,
    handleChangeFromDate,
    handleChangeToDate,
    personalRepData,
    requestData,
    handleSendToProvider,
  } = useCreateRequest();
  const StatusToIgnore = "status";
  const SourceToIgnore = "sourceOfInvitation";
  const PHYSICAL_RECORD_TYPE = [1, 2, 3];
  const version = useVersion();
  const classes = useStyles();
  const refresh = useRefresh();
  const [refreshCount, setRefreshCount] = React.useState(1);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const ToggleButton = styled(MuiToggleButton)({});
  const [sameInstitutionData, setSameInstitutionData] = useState(false);
  const [submittedInstitution, setSubmittedInstitution] = useState([]);
  const [approvedInstitution, setApprovedInstitution] = useState([]);
  const [toggleYes, setToggleYes] = useState(false);
  const [toggleNo, setToggleNo] = useState(true);

  const [hipaaToggleYes, setHipaaToggleYes] = useState(false);
  const [selectedDependentValue, setSelectedDependentValue] = useState(null);
  const [hipaaToggleNo, setHipaaToggleNo] = useState(true);
  const [sudToggleYes, setSudToggleYes] = useState(false);
  const [sudToggleNo, setSudToggleNo] = useState(true);
  const [prrToggleYes, setPrrToggleYes] = useState(false);
  const [prrToggleNo, setPrrToggleNo] = useState(true);
  const [requestView, setRequestView] = useState(false);
  const [problem, setProblem] = useState({ id: "", value: "" });
  const [impact, setImpact] = useState({ id: "", value: "" });
  const [mrrMsg, setMrrMsg] = useState("No");
  const [hipaaMsg, setHipaaMsg] = useState("No");
  const [sudMsg, setSudMsg] = useState("No");
  const [openProviderConfirmBase, setOpenProviderConfirmBase] = useState(false);
  const [openAuthBase, setOpenAuthBase] = useState(false);
  const [proxyMsg, setProxyMsg] = useState("No");
  const patientRecordRequest = document.getElementById("patientRecordRequest");
  const [requestId, setRequestId] = useState(null);
  const [institutionName, setInstitutionName] = useState("");
  const [disableSelection, setDisableSelection] = useState(true);
  const [subscribeCommunicationMutation] = useMutation<
    GetInstitutionApprovalInfoMutation,
    GetInstitutionApprovalInfoMutationVariables
  >(getInstitutionApprovalInfoQuery, {});
  const dataProvider = useDataProvider();
  const hipaaFill = (responseRequestId): void => {
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: { requestId: responseRequestId },
    };
    dataProvider.getList("requestTokenV1s", queryOption).then(({ data }) => {
      if (data) {
        if (data[0].authFormType === 1) {
          history.push("/authorizationForm/hipaa/" + data[0].token);
        }
      }
    });
  };

  const handleChangeFax = (value): void => {
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        faxNumber: value,
      }),
      () => {
        // set form
      }
    );
  };
  const handleTypeChange = (event): void => {
    setType(event.target.value);
    if (event.target.value === "dependent") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          isDependent: true,
          dependentPartyId: null,
        }),
        () => {
          // set form
        }
      );
    } else {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          isDependent: false,
          dependentPartyId: null,
        }),
        () => {
          // set form
        }
      );
      setSelectedDependentValue(null);
    }
  };
  const handleAddressSelectionChange = (event): void => {
    const { name, checked } = event.target;
    if (name === "physician" && checked) {
      setError("requesterAddress", "", false);
    }
    if (name === "myself" && checked) {
      setError("physicianAddress", "", false);
    }
    setChecked({ myself: false, physician: false, both: false });
    setChecked((prevChecked) => ({
      ...prevChecked,
      [name]: checked,
    }));
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        obtainCopyByPostalService: Number(event.target.value),
      }),
      () => {
        // set form
      }
    );
  };
  React.useEffect(() => {
    setRefreshCount(refreshCount + 1);
    if (refreshCount % 2 === 0) {
      window.location.reload();
    }
  }, [version]);
  useEffect(() => {
    if (patientRecordRequest) {
      if (patientRecordRequest.hidden === false) {
        if (permissions === CO_ROLE_PPA)
          getTrace(
            " Patient record request form loaded",
            "ev-054",
            userInfoReducer.email
          );
        else if (permissions === CO_ROLE_PATIENT)
          getTrace(
            " Patient record request form loaded",
            "ev-136",
            userInfoReducer.email
          );
      }
    }
  }, [patientRecordRequest]);
  useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setEmailNotVerified(true);
    }
  }, []);
  useEffect(() => {
    if (trackId !== undefined) {
      subscribeCommunicationMutation({
        variables: { input: { reqTrackId: trackId, commReqId: null } },
      }).then((response) => {
        if (response) {
          setSubmittedInstitution(
            JSON.parse(
              response.data.getInstitutionApprovalInfo.results[0]
                .communicationMetaValue
            ).metaData
          );
          setApprovedInstitution(
            response.data.getInstitutionApprovalInfo.results[0]
              .approvedMetaValue
              ? JSON.parse(
                  response.data.getInstitutionApprovalInfo.results[0]
                    .approvedMetaValue
                ).metaData
              : null
          );
          if (
            response.data.getInstitutionApprovalInfo.results[0]
              .approvedMetaValue
          ) {
            const isInstitutionEqual = compareObjects(
              submittedInstitution,
              approvedInstitution,
              StatusToIgnore,
              SourceToIgnore
            );
            setSameInstitutionData(isInstitutionEqual);
          }
        }
      });
      setRequestView(true);
      getRequestData(trackId);
      if (requestData.length > 0) {
        setType(requestData[0].isDependent ? "dependent" : "myself");
        setRequestId(requestData[0].id);
        setSelectedFromDate(new Date(requestData[0].recordsRequestedFrom));
        setSelectedToDate(new Date(requestData[0].recordsRequestedTo));
        setInstitutionName(requestData[0].sourceinstitutionname);
        if (requestData[0].hasSubstanceUseDisorderCondition) {
          setShowDisorder(true);
        }
        if (requestData[0].disorderDisclosureAuthorizationFileId) {
          setSudMsg("Yes");
          getFileDetails(
            requestData[0].disorderDisclosureAuthorizationFileId,
            "disorderDisclosureAuthorizationFileId"
          );
        }
        if (
          requestData[0].disorderDisclosureAuthorizationFileId &&
          !requestData[0].disorderRequestAuth
        ) {
          setShowDisorder(true);
          setSudMsg("Filled Substance Use Disorder form is submitted");
        }
        if (requestData[0].proxyDocument) {
          setProxyMsg("Yes");
          getFileDetails(requestData[0].proxyDocument, "proxyDocument");
        }
        if (
          requestData[0].hipaaAuthorizationFileId &&
          requestData[0].healthInformationAuth
        ) {
          setHipaaMsg("Yes");
          getFileDetails(
            requestData[0].hipaaAuthorizationFileId,
            "hipaaAuthorizationFileId"
          );
        }
        if (
          requestData[0].hipaaAuthorizationFileId &&
          !requestData[0].healthInformationAuth
        ) {
          setHipaaMsg("Filled HIPAA form is submitted");
        }
        if (
          requestData[0].medicalRequestFormFileId &&
          requestData[0].hasSignedRequest
        ) {
          setMrrMsg("Yes");
          getFileDetails(
            requestData[0].medicalRequestFormFileId,
            "medicalRequestFormFileId"
          );
        }
        if (requestData[0].signatureId) {
          setMrrMsg("Filled Patient Record Request Form is submitted");
        }

        if (requestData[0].isObtainCopy) {
          getObtainRecordDetails(requestData[0].id);
          setShowObtainRecords(true);
        }
        if (requestData[0].isRequestedSupport) {
          getContactData(requestData[0].id);
        }
        const duration = requestData[0].durationOfProblemEncountering
          ? requestData[0].durationOfProblemEncountering.split(" ")
          : "";
        setProblem({
          id: requestData[0].issueDescriptionMasterId,
          value: requestData[0].issueDescriptionMasterValue,
        });
        setImpact({
          id: requestData[0].issueImpactMasterId,
          value: requestData[0].issueImpactMasterValue,
        });
        if (duration !== "") {
          setHowLongVal(
            (prevHLFormState: IHowLongVal) => ({
              ...prevHLFormState,
              howLong: duration[0],
              howLongUnit: duration[1],
            }),
            (currentVal: IHowLongVal) => {
              setFormvalues(
                (prevFormState) => ({
                  ...prevFormState,
                  timePeriod: String(
                    currentVal.howLong + " " + currentVal.howLongUnit
                  ),
                }),
                () => {
                  // set form
                }
              );
            }
          );
        }
        if (requestData[0].contactPersonallyValue === 1) {
          setShowContactPersonal(true);
        }
        if (requestData[0].hasPersonalRepresentative) {
          setToggleYes(true);
          setToggleNo(false);
        }
        if (requestData[0].disorderRequestAuth) {
          setSudToggleYes(true);
          setSudToggleNo(false);
        }
        if (requestData[0].healthInformationAuth) {
          setHipaaToggleYes(true);
          setHipaaToggleNo(false);
        }
        if (requestData[0].hasSignedRequest) {
          setPrrToggleYes(true);
          setPrrToggleNo(false);
        }
        setPriority(requestData[0].requestPriorityId);
        setRequestType({
          id: JSON.parse(requestData[0].requestType).id,
          value: JSON.parse(requestData[0].requestType).value,
        });
        if (requestData[0].postalServiceId === 1) {
          setChecked({ myself: true, physician: false, both: false });
        } else if (requestData[0].postalServiceId === 2) {
          setChecked({ myself: false, physician: true, both: false });
        } else if (requestData[0].postalServiceId === 3) {
          setChecked({ myself: false, physician: false, both: true });
        }
        setFormvalues(
          (prevFormState) => ({
            ...prevFormState,
            track: requestData[0].trackId,
            problemsFaced: requestData[0].issueDescriptionMasterValue,
            hippaAuth: true,
            isDependent: requestData[0].isDependent,
            substanceDisorderAuth:
              requestData[0].hasSubstanceUseDisorderCondition,
            mentalHealthCondition: requestData[0].hasMentalHealthCondition,
            sexualReproductiveCondition:
              requestData[0].hasSexualReproductiveHealthCondition,
            recordsFrom: moment(requestData[0].recordsRequestedFrom).format(
              "YYYY-MM-DD"
            ),
            recordsTo: moment(requestData[0].recordsRequestedTo).format(
              "YYYY-MM-DD"
            ),
            requestPriority: requestData[0].requestPriorityId,
            rti: {
              id: JSON.parse(requestData[0].requestType).id,
              value: JSON.parse(requestData[0].requestType).value,
              other: JSON.parse(requestData[0].requestType).other,
              otherValue: JSON.parse(requestData[0].requestType).other_value,
            },
            sourceInstitution: requestData[0].deliverFrom,
            sourceNature: requestData[0].sourceNatureId,
            obtainCopyMethodId: requestData[0].obtainCopyMethodId,
            obtainCopyDiffAddress: requestData[0].obtainCopyDiffAddress,
            physicianAddress: requestData[0].physicianPostalAddress,
            requesterAddress: requestData[0].postalAddress,
            obtainCopyByPostalService: requestData[0].postalServiceId,
            otherFormat: requestData[0].otherFormat,
            timePeriod: "",
            type: "request",
            assignedTo: requestData[0].assignToPersonId,
            attachment: null,
            contactPersonally: requestData[0].contactPersonallyValue,
            contactByMail: requestData[0].contactByMailValue,
            contactByPhone: requestData[0].contactByPhoneValue,
            contactBySms: requestData[0].contactBySmsValue,
            communicationRequestId: requestData[0].communicationRequestId,
            requester: requestData[0].requester,
            servicedDate: new Date(),
            isRequestedSupport: requestData[0].isRequestedSupport,
            isInspect: requestData[0].isInspect,
            isObtainCopy: requestData[0].isObtainCopy,
            department: requestData[0].departmentId,
            hasSensitiveInformation: requestData[0].hasSensitiveInformation,
            hasPersonalRepresentative: requestData[0].hasPersonalRepresentative,
            disorderDisclosureAuthorizationFile:
              requestData[0].disorderDisclosureAuthorizationFileId,
            hasSignedRequest: requestData[0].hasSignedRequest,
            hipaaAuthorizationFile: requestData[0].hipaaAuthorizationFileId,
            disorderRequestAuth: requestData[0].disorderRequestAuth,
            healthInformationAuth: requestData[0].healthInformationAuth,
            impactFaced: requestData[0].issueImpactMasterValue,
            impactOnPatients: 1,
            proxyDocument: null,
            mrn: requestData[0].mrn,
            obtainRecordType: [],
            inputs: [],
            additionalNotes: requestData[0].additionalNotes,
          }),
          () => {
            // console.log("after filling", formvalues);
          }
        );
      }
    }
  }, [requestData, contactData, sameInstitutionData]);
  const copyArr = [];

  useEffect(() => {
    obtainData.map((eachContent) => {
      copyArr.push(eachContent.obtainRecordType);
      if (eachContent.obtainRecordType === "Fax") {
        setShowFax(true);
        setFormvalues(
          (prevFormState) => ({
            ...prevFormState,
            faxNumber: eachContent.remark,
          }),
          () => {
            //
          }
        );
      }
      if (eachContent.obtainRecordType === "Personal Health Record") {
        setShowPHR(true);
        setFormvalues(
          (prevFormState) => ({
            ...prevFormState,
            phr: eachContent.remark,
          }),
          () => {
            //
          }
        );
      }
      if (eachContent.obtainRecordType === "Other forms (please specify)") {
        setShowOthers(true);
        setFormvalues(
          (prevFormState) => ({
            ...prevFormState,
            otherFormat: eachContent.remark,
          }),
          () => {
            //
          }
        );
      }
    });
  }, [approvedInstitution, submittedInstitution, obtainData]);
  useEffect(() => {
    if (permissions === CO_ROLE_MRA) {
      history.push("/");
      notify(translate("resources.requests.error.permission_error"), {
        type: "warning",
      });
    }
  }, [permissions]);

  useEffect(() => {
    if (userInfoReducer.id) {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          requester: userInfoReducer.id,
        }),
        () => {
          // set form
        }
      );
    }
  }, [userInfoReducer.id]);
  useEffect(() => {
    if (userInfoReducer.id) {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          requestPriority: priority,
        }),
        () => {
          // set form
        }
      );
    }
  }, [priority]);
  useEffect(() => {
    let mounted = true;
    getReqStat(mounted);
    getImpactings(mounted);
    getImpactFaced(mounted);
    getSourcesNature(mounted);
    getOrganization(mounted);
    getPriorityList(mounted);
    getObtainRecord(mounted);
    getSensitiveInfoOption(mounted);
    return () => {
      mounted = false;
    };
  }, []);
  const getSelectedDependent = (selectedDependent): void => {
    setSelectedDependentValue(selectedDependent);
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        dependentPartyId: selectedDependent.id,
        pdr: {
          city: selectedDependent.city,
          addressLine1: selectedDependent.address1,
          addressLine2: selectedDependent.address2,
          state: Number(selectedDependent.stateId),
          country: selectedDependent.address1 ? 1 : 0,
          addressZip: selectedDependent.zip,
          birthDate: new Date(selectedDependent.birthDate),
          electronicDetails: selectedDependent.email,
          gender: {
            id: Number(selectedDependent.gender.id),
            value: selectedDependent.gender.value,
            other: selectedDependent.gender.other,
            otherValue: selectedDependent.gender.otherValue,
          },
          relationshipId: Number(selectedDependent.relatedPersonRelationshipId),
          number: selectedDependent.phoneNumber,
          firstName: selectedDependent.firstName,
          lastName: selectedDependent.lastName,
          middleName: selectedDependent.middleName,
          personType: 1,
          ssn: selectedDependent.ssn
            ? selectedDependent.ssn.split("-").join("")
            : null,
          suffix: selectedDependent.suffix,
          previousSuffix: selectedDependent.previousSuffix,
          preferredLanguageId: Number(selectedDependent.preferredLanguageId),
          preferredPronouns: Number(selectedDependent.preferredPronounsId),
          sex: {
            id: Number(selectedDependent.sex.id),
            value: selectedDependent.sex.value,
            other: selectedDependent.sex.other,
            otherValue: selectedDependent.sex.otherValue,
          },
          previousFirstName: selectedDependent.previousFirstName,
          previousLastName: selectedDependent.previousLastName,
          previousMiddleName: selectedDependent.previousMiddleName,
          isPreviousAddress: JSON.parse(selectedDependent.previousAddress)
            .is_previous_address,
          previousAddressLine1: JSON.parse(selectedDependent.previousAddress)
            .previous_address_json.is_previous_address
            ? JSON.parse(selectedDependent.previousAddress)
                .previous_address_json.previous_address1
            : null,
          previousAddressLine2: JSON.parse(selectedDependent.previousAddress)
            .previous_address_json.is_previous_address
            ? JSON.parse(selectedDependent.previousAddress)
                .previous_address_json.previous_address2
            : null,
          previousCity: JSON.parse(selectedDependent.previousAddress)
            .previous_address_json.is_previous_address
            ? JSON.parse(selectedDependent.previousAddress)
                .previous_address_json.previous_city
            : null,
          previousState: JSON.parse(selectedDependent.previousAddress)
            .previous_address_json.is_previous_address
            ? JSON.parse(selectedDependent.previousAddress)
                .previous_address_json.previous_state_id
            : null,
          previousCountry: JSON.parse(selectedDependent.previousAddress)
            .previous_address_json.is_previous_address
            ? JSON.parse(selectedDependent.previousAddress)
                .previous_address_json.previous_country_id
            : null,
          previousAddressZip: JSON.parse(selectedDependent.previousAddress)
            .previous_address_json.is_previous_address
            ? JSON.parse(selectedDependent.previousAddress)
                .previous_address_json.previous_zip
            : null,
        },
      }),
      () => {
        //
      }
    );
  };
  const selectAlreadyExistingProvider = (providerSelected): void => {
    setSource({
      id: providerSelected["institutionPartyId"],
      organizationName: providerSelected["institutionName"],
    });
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        sourceInstitution: providerSelected["institutionPartyId"],
      }),
      () => {
        const deptTemp: IOrganization[] = [];
        setAssignedList([]);
        organizationList.map((indv: IOrganization) => {
          if (indv.parentOrgId === providerSelected["institutionPartyId"]) {
            deptTemp.push(indv);
          }
        });
        setDepartmentList(deptTemp, () => {
          // set form
        });
      }
    );
  };
  return !emailNotVerified &&
    (userInfoReducer.role === CO_ROLE_PPA ||
      userInfoReducer.role === CO_ROLE_PATIENT) ? (
    <Container maxWidth="xl" style={{ maxWidth: "unset" }}>
      {isLoading && <LinearProgress color="secondary" />}

      {openBase && (
        <BaseModal
          open={openBase}
          confirmAction={submitRequestConfirmed}
          onClose={() => {
            setOpenBase(false);
          }}
          title={
            permissions === CO_ROLE_PATIENT
              ? REQUEST_MESSAGES["mrr"].confirmTitlePatient
              : REQUEST_MESSAGES["mrr"].confirmTitle +
                '"' +
                formvalues.pdr.firstName +
                " " +
                formvalues.pdr.lastName +
                '"'
          }
          content={
            permissions === CO_ROLE_PATIENT
              ? REQUEST_MESSAGES["mrr"].confirmContentPatient[0] +
                "'" +
                (formvalues.rti.other
                  ? formvalues.rti.otherValue
                  : formvalues.rti.value) +
                "'" +
                REQUEST_MESSAGES["mrr"].confirmContentPatient[1] +
                tommddyyyy(formvalues.recordsFrom) +
                REQUEST_MESSAGES["mrr"].confirmContentPatient[2] +
                tommddyyyy(formvalues.recordsTo) +
                REQUEST_MESSAGES["mrr"].confirmContentPatient[3] +
                source.organizationName +
                "?"
              : REQUEST_MESSAGES["mrr"].confirmContent +
                source.organizationName +
                " ?"
          }
          successButtonName="Confirm"
        />
      )}
      {openSubmitBase && (
        <BaseModal
          open={openSubmitBase}
          confirmAction={() => {
            setOpenSubmitBase(false);
            if (
              permissions === CO_ROLE_PPA ||
              (permissions === CO_ROLE_PATIENT &&
                formvalues.healthInformationAuth)
            ) {
              refresh();
            } else {
              hipaaFill(responseRequestId);
            }
          }}
          onClose={() => {
            setOpenSubmitBase(false);
            if (userInfoReducer.role === CO_ROLE_PATIENT) {
              history.push("/myRequests");
            } else {
              history.push("/requests");
            }
          }}
          title={
            permissions === CO_ROLE_PATIENT
              ? REQUEST_MESSAGES["mrr"].successTitlePatient
              : REQUEST_MESSAGES["mrr"].successTitle[0] +
                '"' +
                formvalues.pdr.firstName +
                " " +
                formvalues.pdr.lastName +
                '"' +
                REQUEST_MESSAGES["mrr"].successTitle[1]
          }
          content={
            permissions === CO_ROLE_PATIENT
              ? !formvalues.healthInformationAuth
                ? REQUEST_MESSAGES["mrr"].successContentPatientHipaa
                : REQUEST_MESSAGES["mrr"].successContentPatient
              : !formvalues.healthInformationAuth &&
                formvalues.hasSensitiveInformation &&
                !formvalues.disorderRequestAuth &&
                formvalues.isRequestedSupport &&
                !formvalues.hasSignedRequest
              ? REQUEST_MESSAGES["mrr"].successContentHipaaSudPrr
              : !formvalues.healthInformationAuth &&
                formvalues.hasSensitiveInformation &&
                !formvalues.disorderRequestAuth
              ? REQUEST_MESSAGES["mrr"].successContentHipaaSud
              : formvalues.hasSensitiveInformation &&
                !formvalues.disorderRequestAuth &&
                formvalues.isRequestedSupport &&
                !formvalues.hasSignedRequest
              ? REQUEST_MESSAGES["mrr"].successContentSudPrr
              : !formvalues.healthInformationAuth &&
                formvalues.isRequestedSupport &&
                !formvalues.hasSignedRequest
              ? REQUEST_MESSAGES["mrr"].successContentHipaaPrr
              : !formvalues.healthInformationAuth
              ? REQUEST_MESSAGES["mrr"].successContentHipaa
              : formvalues.hasSensitiveInformation &&
                !formvalues.disorderRequestAuth
              ? REQUEST_MESSAGES["mrr"].successContentSud
              : formvalues.isRequestedSupport && !formvalues.hasSignedRequest
              ? REQUEST_MESSAGES["mrr"].successContentPrr
              : REQUEST_MESSAGES["mrr"].successContent
          }
          successButtonName={
            permissions === CO_ROLE_PATIENT && !formvalues.healthInformationAuth
              ? "Fill HIPAA form"
              : "Make Another Request"
          }
          closeButtonName="Go to My Requests"
          type="success"
        />
      )}
      {openErrorBase && (
        <BaseModal
          open={openErrorBase}
          confirmAction={() => {
            if (errorCode === "403") {
              setDisableSubmit(true);
              setSubmittedEmail(formvalues.pdr.electronicDetails);
            }
            setOpenErrorBase(false);
            setIsLoading(false);
          }}
          onClose={() => {
            if (errorCode === "403") {
              setDisableSubmit(true);
              setSubmittedEmail(formvalues.pdr.electronicDetails);
            }
            setOpenErrorBase(false);
            setIsLoading(false);
          }}
          title={
            REQUEST_MESSAGES["mrr"].errorTitle[0] +
            '"' +
            formvalues.pdr.firstName +
            " " +
            formvalues.pdr.lastName +
            '"' +
            REQUEST_MESSAGES["mrr"].errorTitle[1]
          }
          content={REQUEST_MESSAGES["mrr"].errorContent[errorCode]}
          closeButtonName="Close"
          type="requestError"
        />
      )}
      {/* modals for sent to provider */}
      {openProviderConfirmBase && (
        <BaseModal
          open={openProviderConfirmBase}
          confirmAction={() => {
            setOpenProviderConfirmBase(false);
            handleSendToProvider(requestId);
          }}
          onClose={() => {
            setOpenProviderConfirmBase(false);
          }}
          title={
            REQUEST_MESSAGES["mrr"].sentToProvider.confirmTitle +
            '"' +
            formvalues.pdr.firstName +
            " " +
            formvalues.pdr.lastName +
            '"'
          }
          content={
            REQUEST_MESSAGES["mrr"].sentToProvider.confirmContent +
            institutionName +
            "?"
          }
          successButtonName="Send"
        />
      )}

      {openAuthBase && (
        <BaseModal
          open={openAuthBase}
          confirmAction={() => {
            setOpenAuthBase(false);
            if (permissions === CO_ROLE_PATIENT) {
              if (formvalues.requester === userInfoReducer.id) {
                history.push(`/myRequests/${requestData[0].trackId}/overview`);
              } else {
                history.push(
                  `/requestsOnBehalf/${requestData[0].trackId}/overview`
                );
              }
            } else {
              history.push(`/requests/${requestData[0].trackId}/overview`);
            }
          }}
          onClose={() => {
            setOpenAuthBase(false);
          }}
          title={REQUEST_MESSAGES["mrr"].sentToProvider.authTitle}
          content={
            REQUEST_MESSAGES["mrr"].sentToProvider.authMessage[0] +
            (!formvalues.hipaaAuthorizationFile &&
            formvalues.substanceDisorderAuth &&
            !formvalues.disorderDisclosureAuthorizationFile
              ? "HIPAA and SUD forms were"
              : !formvalues.hipaaAuthorizationFile &&
                !formvalues.substanceDisorderAuth
              ? "HIPAA form was"
              : "SUD form was") +
            REQUEST_MESSAGES["mrr"].sentToProvider.authMessage[1]
          }
          subContent={[
            REQUEST_MESSAGES["mrr"].sentToProvider.authMessage[2] +
              (!formvalues.hipaaAuthorizationFile &&
              formvalues.substanceDisorderAuth &&
              !formvalues.disorderDisclosureAuthorizationFile
                ? "both the HIPAA and SUD consent forms."
                : !formvalues.hipaaAuthorizationFile &&
                  !formvalues.substanceDisorderAuth
                ? "HIPAA form."
                : "SUD form.") +
              (!formvalues.hipaaAuthorizationFile &&
              formvalues.substanceDisorderAuth &&
              !formvalues.disorderDisclosureAuthorizationFile
                ? REQUEST_MESSAGES["mrr"].sentToProvider.authMessage[3]
                : REQUEST_MESSAGES["mrr"].sentToProvider.authMessage[4]),
          ]}
          type="authConfirm"
          successButtonName="Fill Forms"
          closeButtonName="Close"
        />
      )}
      {openProviderSubmitBase && (
        <BaseModal
          open={openProviderSubmitBase}
          confirmAction={() => {
            setOpenProviderSubmitBase(false);
            if (userInfoReducer.role === CO_ROLE_PATIENT) {
              history.push("/myRequests");
            } else {
              history.push("/requests");
            }
          }}
          onClose={() => {
            setOpenProviderSubmitBase(false);
            if (userInfoReducer.role === CO_ROLE_PATIENT) {
              history.push("/myRequests");
            } else {
              history.push("/requests");
            }
          }}
          title={REQUEST_MESSAGES["mrr"].sentToProvider.successTitle}
          content={
            REQUEST_MESSAGES["mrr"].sentToProvider.successContent[0] +
            institutionName +
            REQUEST_MESSAGES["mrr"].sentToProvider.successContent[1]
          }
          successButtonName="Ok"
          closeButtonName="Close"
          type="successProvider"
        />
      )}
      {openProviderErrorBase && (
        <BaseModal
          open={openProviderErrorBase}
          confirmAction={() => {
            setOpenProviderErrorBase(false);
            setIsLoading(false);
          }}
          onClose={() => {
            setOpenProviderErrorBase(false);
            setIsLoading(false);
          }}
          title={translate(
            "resources.requests.notification.errorTitleSendToProvider"
          )}
          content={translate("resources.requests.notification.errorMessageMrr")}
          closeButtonName="Close"
          type="requestError"
        />
      )}
      <div
        id="patientRecordRequest"
        style={{
          filter: openSubmitBase || openErrorBase ? "blur(1px)" : "none",
        }}
      >
        <div
          style={{
            filter: isLoading ? "blur(1px)" : "none",
            pointerEvents: requestView ? "none" : "all",
          }}
        >
          <Grid
            alignItems="flex-end"
            container
            justify="space-between"
            spacing={1}
          >
            <Grid item id="top">
              <CreatePageHeader
                subTitle="resources.requests.formSubtitle"
                mainTitle="resources.requests.formTitle"
              />
            </Grid>
          </Grid>
          <Card className={classes.root} id="source-institution">
            <CardContent className={classes.cardContent}>
              {requestView && (
                <>
                  <CardHeader>
                    <Typography
                      variant="h5"
                      style={{ fontSize: 16, fontWeight: 500 }}
                      gutterBottom
                    >
                      <b>Provider Information:</b>
                    </Typography>
                  </CardHeader>
                  <ProviderView
                    commRequestId={null}
                    approvedInstitution={approvedInstitution}
                    sameInstitutionData={sameInstitutionData}
                    submittedInstitution={submittedInstitution}
                  />
                </>
              )}
              {!requestView && !submittedProviderView && (
                <CardHeader>
                  <Typography
                    variant="h5"
                    style={{ fontSize: 16, fontWeight: 500 }}
                    gutterBottom
                  >
                    <b>
                      Please provide the name of the healthcare facility,
                      physician, or practice from which you'd like to request
                      records
                    </b>
                  </Typography>

                  <Typography
                    variant="h5"
                    style={{ fontSize: 14, fontWeight: 500 }}
                    gutterBottom
                  >
                    The source institution / provider you are requesting records
                    from is not exists , then{" "}
                    <Button
                      aria-label="directions"
                      color="primary"
                      style={{
                        borderRadius: "unset",
                        marginBottom: "3px",
                        padding: "0px",
                        textTransform: "none",
                        textDecoration: "Underline",
                      }}
                      onClick={() => {
                        setAddInstitution(true);
                        setSourceStatus(false);
                        setSourceInstitutionStatus(false);
                        setDepartmentStatus(false);
                        setAssignedToStatus(false);
                        setFormvalues(
                          (prevFormState) => ({
                            ...prevFormState,
                            sourceNature: null,
                            sourceInstitution: null,
                            department: null,
                            assignedTo: null,
                          }),
                          () => {
                            // set form
                          }
                        );
                        setSource({
                          id: "",
                          organizationName: translate(
                            "resources.requests.dropdown.sourceInstitution"
                          ),
                        });
                        setSourceNature({
                          id: "",
                          value: translate(
                            "resources.requests.dropdown.sourceNature"
                          ),
                        });
                        setDepartment({
                          id: "",
                          organizationName: translate(
                            "resources.requests.dropdown.department"
                          ),
                        });
                        setAssignedTo({
                          id: "",
                          firstName: translate(
                            "resources.requests.dropdown.mra"
                          ),
                        });
                      }}
                    >
                      click here
                    </Button>{" "}
                    to fill the details
                  </Typography>
                  {addInstitution && (
                    <div
                      style={{
                        borderLeft: "5px solid  #FF5733 ",
                        backgroundColor: "#FFFFE0",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "#585858",
                      }}
                    >
                      <Typography
                        variant="h5"
                        style={{ fontSize: 14, fontWeight: 500 }}
                        gutterBottom
                      >
                        Required fields are marked * <br></br>
                        To help us effectively, please provide us with as much
                        information as possible
                      </Typography>
                    </div>
                  )}
                </CardHeader>
              )}

              <form className={classes.root} noValidate autoComplete="off">
                <div>
                  <Grid
                    alignItems="flex-end"
                    container
                    justify="space-between"
                    spacing={1}
                  >
                    {submittedProviderView && (
                      <ProviderData submittedProviderData={submittedProvider} />
                    )}
                    {!addInstitution &&
                      !requestView &&
                      !submittedProviderView && (
                        <>
                          <Grid item md={6} xs={12}>
                            <InputLabel
                              style={{
                                paddingBottom: addInstitution ? "10px" : "",
                              }}
                            >
                              Nature of source<sup>*</sup>
                            </InputLabel>
                            <Autocomplete
                              id="sourceNature"
                              options={sourcesNatureList}
                              autoHighlight
                              disableClearable
                              value={sourceNature}
                              style={{
                                fontSize: "14px",
                                marginRight: "30px",
                              }}
                              getOptionLabel={(option) => option.value}
                              onChange={sourceNaturehandleNumberChange}
                              renderOption={(props, option) => (
                                <Box component="li" {...props} key={option.id}>
                                  {option.value}
                                </Box>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  onBlur={(e) => handleValidateOnBlur(e)}
                                  error={sourceStatus ? true : false}
                                  helperText={
                                    sourceStatus === true
                                      ? addPatientErrorMessages.sourceNature
                                          .empty
                                      : " "
                                  }
                                  margin="dense"
                                  name="sourceNature"
                                  required
                                  style={{ fontSize: "14px" }}
                                  value={formvalues.sourceNature}
                                  variant="standard"
                                />
                              )}
                            />
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
                              <InputLabel>
                                Source Institution<sup>*</sup>
                              </InputLabel>
                            </div>

                            <Autocomplete
                              id="sourceInstitution"
                              options={institutionList}
                              autoHighlight
                              disableClearable
                              value={source}
                              style={{
                                fontSize: "14px",
                                marginRight: "30px",
                              }}
                              getOptionLabel={(option) =>
                                option.organizationName
                              }
                              onChange={(e, newValue) => {
                                if (newValue) {
                                  const { id, organizationName } = newValue;
                                  setSource({
                                    id: id,
                                    organizationName: organizationName,
                                  });
                                  setFormvalues(
                                    (prevFormState) => ({
                                      ...prevFormState,
                                      sourceInstitution: id,
                                      department: null,
                                      assignedTo: null,
                                    }),
                                    () => {
                                      const deptTemp: IOrganization[] = [];
                                      setAssignedList([]);
                                      organizationList.map(
                                        (indv: IOrganization) => {
                                          if (indv.parentOrgId === id) {
                                            deptTemp.push(indv);
                                          }
                                        }
                                      );
                                      setDepartmentList(deptTemp, () => {
                                        // set form
                                      });
                                      setDepartment({
                                        id: "",
                                        organizationName: translate(
                                          "resources.requests.dropdown.department"
                                        ),
                                      });
                                      setAssignedTo({
                                        id: "",
                                        firstName: translate(
                                          "resources.requests.dropdown.mra"
                                        ),
                                      });
                                    }
                                  );
                                }
                              }}
                              renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                  {option.organizationName}
                                </Box>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  onBlur={(e) => handleValidateOnBlur(e)}
                                  error={sourceInstitutionStatus ? true : false}
                                  helperText={
                                    sourceInstitutionStatus === true
                                      ? addPatientErrorMessages.institution
                                          .empty
                                      : " "
                                  }
                                  margin="dense"
                                  name="sourceInstitution"
                                  required
                                  style={{ fontSize: "14px" }}
                                  value={formvalues.sourceInstitution}
                                  variant="standard"
                                />
                              )}
                            />
                          </Grid>

                          <Grid item md={6} xs={12}>
                            <InputLabel>
                              Department<sup>*</sup>
                            </InputLabel>
                            <Autocomplete
                              id="department"
                              options={departmentList}
                              autoHighlight
                              disableClearable
                              value={department}
                              style={{
                                fontSize: "14px",
                                marginRight: "30px",
                              }}
                              getOptionLabel={(option) =>
                                option.organizationName
                              }
                              onChange={departmentHandleChange}
                              renderOption={(props, option) => (
                                <Box component="li" {...props} key={option.id}>
                                  {option.organizationName}
                                </Box>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  onBlur={(e) => handleValidateOnBlur(e)}
                                  error={
                                    departmentStatus === true ? true : false
                                  }
                                  helperText={
                                    departmentStatus === true
                                      ? addPatientErrorMessages.department.empty
                                      : " "
                                  }
                                  margin="dense"
                                  name="department"
                                  required
                                  style={{ fontSize: "14px" }}
                                  value={formvalues.department}
                                  variant="standard"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <InputLabel>Assigned To (Optional)</InputLabel>
                            <Autocomplete
                              id="assignedTo"
                              options={assignToList}
                              autoHighlight
                              disableClearable
                              value={assignedTo}
                              style={{
                                fontSize: "14px",
                                marginRight: "30px",
                              }}
                              getOptionLabel={(option) => option.firstName}
                              onChange={assignedToHandleChange}
                              renderOption={(props, option) => (
                                <Box
                                  component="li"
                                  {...props}
                                  key={option.assignedPersonId}
                                >
                                  {option.firstName}{" "}
                                  {option.middleName ? option.middleName : ""}
                                  {option.lastName}
                                </Box>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  helperText={" "}
                                  margin="dense"
                                  name="assignedTo"
                                  style={{ fontSize: "14px" }}
                                  value={formvalues.assignedTo}
                                  variant="standard"
                                />
                              )}
                            />
                          </Grid>
                        </>
                      )}

                    {addInstitution && (
                      <InstitutionDetails
                        getInstitution={getInstitution}
                        setAddInstitution={setAddInstitution}
                        setSubmittedProviderView={setSubmittedProviderView}
                        institutionAddError={institutionAddError}
                        selectAlreadyExistingProvider={
                          selectAlreadyExistingProvider
                        }
                      />
                    )}
                    <Grid item md={6} xs={12}>
                      <FormControlLabel
                        name="isRequestedSupport"
                        onChange={handleChange}
                        control={
                          <Checkbox
                            color="primary"
                            checked={formvalues.isRequestedSupport}
                          />
                        }
                        label={
                          requestView
                            ? "Requested support from corresponding facility"
                            : "Have you requested support from the corresponding facility?"
                        }
                      />
                    </Grid>
                  </Grid>
                </div>

                {formvalues.isRequestedSupport && (
                  <Card className={classes.root}>
                    <div>
                      <ContactDetails
                        getContact={getContact}
                        contactData={contactData}
                        requestView={requestView}
                      />
                    </div>
                    <CardContent className={classes.cardContent}>
                      <Grid
                        alignItems="flex-end"
                        container
                        justify="space-between"
                        spacing={1}
                      >
                        <Grid
                          item
                          md={12}
                          style={{ paddingTop: "16px" }}
                          xs={12}
                        >
                          <Typography
                            variant="h5"
                            style={{ fontSize: 16, fontWeight: 500 }}
                            gutterBottom
                          >
                            Patient Medical Record Request Form
                          </Typography>

                          <Divider />
                        </Grid>
                        <Grid
                          item
                          md={6}
                          style={{ paddingTop: "16px" }}
                          xs={12}
                        >
                          <Typography
                            variant="h5"
                            style={{ fontSize: 14 }}
                            gutterBottom
                          >
                            Has a signed medical records request been submitted?
                            <Tooltip
                              arrow
                              placement="top"
                              title={
                                userInfoReducer.role === CO_ROLE_PATIENT
                                  ? translate("tooltip.request.prr_patient")
                                  : translate("tooltip.request.prr")
                              }
                            >
                              <Info className={classes.info} />
                            </Tooltip>
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          md={6}
                          xs={12}
                          style={{ display: "inline-flex" }}
                        >
                          <Grid item md={8} xs={12}>
                            {requestView ? (
                              <Typography
                                variant="h5"
                                style={{ fontSize: 14 }}
                                gutterBottom
                              >
                                {mrrMsg}
                              </Typography>
                            ) : (
                              <ToggleButtonGroup
                                color="primary"
                                exclusive
                                onChange={handleToggleChange}
                                aria-label="Platform"
                              >
                                <ToggleButton
                                  value="yes"
                                  name="hasSignedRequest"
                                  onClick={() => {
                                    setPrrToggleYes(true);
                                    setPrrToggleNo(false);
                                  }}
                                  style={{
                                    background: prrToggleYes ? "aliceBlue" : "",
                                    border: "1px solid #D3D3D3",
                                  }}
                                >
                                  Yes
                                </ToggleButton>
                                <Tooltip
                                  arrow
                                  placement="top"
                                  title={
                                    permissions === CO_ROLE_PATIENT
                                      ? translate(
                                          "tooltip.request.prr_toggle_patient"
                                        )
                                      : translate("tooltip.request.prr_toggle")
                                  }
                                >
                                  <ToggleButton
                                    value="no"
                                    name="hasSignedRequest"
                                    onClick={() => {
                                      setPrrToggleYes(false);
                                      setPrrToggleNo(true);
                                      setErrorMsg((prevFormState) => ({
                                        ...prevFormState,
                                        ["MRR"]: {
                                          0: false,
                                          1: "",
                                        },
                                      }));
                                    }}
                                    style={{
                                      background: prrToggleNo
                                        ? "aliceBlue"
                                        : "",
                                      border: "1px solid #D3D3D3",
                                    }}
                                  >
                                    No
                                  </ToggleButton>
                                </Tooltip>
                              </ToggleButtonGroup>
                            )}
                          </Grid>
                        </Grid>
                        <Grid
                          md={12}
                          xs={12}
                          style={{ display: "inline-flex" }}
                        >
                          <Grid
                            item
                            md={6}
                            xs={12}
                            style={{ marginLeft: "10px" }}
                            className="attachmentContainer"
                          >
                            {errorMsg["MRR"][0] ? (
                              <Typography
                                style={{
                                  color: "red",
                                }}
                              >
                                {errorMsg["MRR"][1]}
                              </Typography>
                            ) : (
                              " "
                            )}
                            {formvalues.hasSignedRequest && !medicalFileData ? (
                              <UploadFile
                                name="patient_record_request"
                                fileResponse={fileResponseHandler}
                                description="Please upload a Patient Record Request Form"
                              />
                            ) : (
                              ""
                            )}
                            {medicalFileData && (
                              <div
                                className={classes.fileOuterComponent}
                                style={{ width: "60%", float: "right" }}
                              >
                                <img
                                  src={URL.createObjectURL(medicalFileData)}
                                  className={classes.image}
                                  alt={"..."}
                                />
                              </div>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
              </form>
            </CardContent>
          </Card>
          <Card className={classes.root} id="patient-info">
            <CardContent className={classes.cardContent}>
              <CardHeader>
                <Typography
                  variant="h5"
                  style={{ fontSize: 16, fontWeight: 500 }}
                  gutterBottom
                >
                  <b>Patient Information:</b>{" "}
                  {!requestView && (
                    <>
                      Please provide details for the person whose information
                      will be released.
                    </>
                  )}
                </Typography>
              </CardHeader>
              <Grid container spacing={1} style={{ marginTop: "5px" }}>
                {userInfoReducer.role === CO_ROLE_PATIENT && (
                  <Grid item md={12} xs={12}>
                    <Typography
                      variant="h5"
                      style={{ fontSize: 14, fontWeight: 500 }}
                      gutterBottom
                    >
                      Who is the patient that you are requesting records for?
                    </Typography>
                    <RadioGroup
                      name="type"
                      value={type}
                      onChange={handleTypeChange}
                      style={{ display: "inline-block" }}
                    >
                      <FormControlLabel
                        name="type"
                        value="myself"
                        disabled={disableSelection}
                        control={
                          requestView ? (
                            <Radio
                              color="primary"
                              defaultChecked={!formvalues.isDependent}
                            />
                          ) : (
                            <Radio
                              color="primary"
                              defaultChecked={true}
                              disabled={disableSelection}
                            />
                          )
                        }
                        style={{ marginLeft: "auto", fontWeight: "500" }}
                        label="Myself"
                      />
                      <FormControlLabel
                        name="type"
                        value="dependent"
                        disabled={disableSelection}
                        style={{ marginLeft: "auto", fontWeight: "500" }}
                        control={
                          requestView ? (
                            <Radio
                              color="primary"
                              defaultChecked={formvalues.isDependent}
                            />
                          ) : (
                            <Radio
                              color="primary"
                              disabled={disableSelection}
                            />
                          )
                        }
                        label="My Dependent"
                      />
                    </RadioGroup>
                  </Grid>
                )}
                {type === "dependent" && !requestView && (
                  <Grid container spacing={1} style={{ marginLeft: "10px" }}>
                    <Grid item md={12} xs={12}>
                      <Typography
                        variant="h5"
                        style={{ fontSize: 16, fontWeight: 500 }}
                        gutterBottom
                      >
                        <b>Dependents List</b>{" "}
                      </Typography>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Typography
                        variant="h5"
                        style={{ fontSize: 14 }}
                        gutterBottom
                      >
                        Here is a list of dependents.Please select one by simply
                        click on the radio button. If the patient is not in the
                        dependent list, then fill their details under patient
                        information
                      </Typography>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <DependentTable
                        getSelectedDependent={getSelectedDependent}
                      />
                    </Grid>
                  </Grid>
                )}
                <Grid item md={12} xs={12}>
                  <Grid item md={4} xs={12}>
                    <TextField
                      fullWidth
                      margin="dense"
                      name="mrn"
                      onChange={handleChange}
                      label="MRN (Optional)"
                      // required
                      variant="standard"
                      value={formvalues.mrn}
                      onBlur={(e) => handleValidateOnBlur(e)}
                      error={errorMsg.mrn[0]}
                      helperText={errorMsg.mrn[0] ? errorMsg.mrn[1] : " "}
                    />
                  </Grid>
                </Grid>
                <AddPatient
                  checkPatientValidator={(
                    checkPatientValidatorProps: ICheckPatientValidatorProps
                  ) => checkPatientValidator(checkPatientValidatorProps)}
                  getpatient={getpatient}
                  alertAddPatient={alertAddPatient}
                  requestData={requestData}
                  requestView={requestView}
                  dependentData={selectedDependentValue}
                  type={type}
                  setDisableSelection={setDisableSelection}
                />
              </Grid>
            </CardContent>
          </Card>
          <Card className={classes.root} id="description">
            <CardContent className={classes.cardContent}>
              <CardHeader>
                <Typography
                  variant="h5"
                  style={{ fontSize: 16, fontWeight: 500 }}
                  gutterBottom
                >
                  <b>Description of requested records:</b>
                </Typography>
              </CardHeader>
              <form className={classes.root} noValidate autoComplete="off">
                <div>
                  <Grid
                    alignItems="flex-end"
                    container
                    justify="space-between"
                    spacing={1}
                  >
                    <Grid
                      item
                      md={Number(formvalues.rti.id) === 8 ? 3 : 6}
                      xs={12}
                    >
                      <InputLabel
                        style={{ fontSize: "12px", marginBottom: "8px" }}
                      >
                        Request Type <sup>*</sup>:
                      </InputLabel>
                      <Autocomplete
                        id="requestType"
                        options={requestTypeList}
                        autoHighlight
                        disableClearable
                        value={requestType}
                        style={{
                          fontSize: "14px",
                          // marginBottom: "-7px",
                        }}
                        getOptionLabel={(option) => option.value}
                        onChange={requestTypehandleNumberChange}
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
                            error={requestTypeStatus ? true : false}
                            helperText={
                              requestTypeStatus === true
                                ? addPatientErrorMessages.requestType.empty
                                : " "
                            }
                            margin="dense"
                            name="requestType"
                            required
                            style={{
                              fontSize: "14px",
                              // marginBottom: "-25px",
                            }}
                            value={formvalues.rti.id}
                            variant="standard"
                          />
                        )}
                      />
                    </Grid>
                    {Number(formvalues.rti.id) === 8 && (
                      <Grid item md={3} xs={12}>
                        <TextField
                          fullWidth
                          margin="dense"
                          label="Please specify Request Type"
                          required
                          error={errorMsg.requestTypeOther[0]}
                          helperText={
                            errorMsg.requestTypeOther[0]
                              ? errorMsg.requestTypeOther[1]
                              : " "
                          }
                          name="requestTypeOther"
                          onBlur={(e) => handleValidateOnBlur(e)}
                          onChange={handleChange}
                          value={formvalues.rti.otherValue}
                          variant="standard"
                        />
                      </Grid>
                    )}
                    <Grid item md={6} xs={12}>
                      <InputLabel style={{ fontSize: "12px" }}>
                        Please select the problem you are facing <sup>*</sup>:
                        <Tooltip
                          title={
                            <>
                              <Typography
                                variant="subtitle1"
                                style={{ fontSize: "14px" }}
                              >
                                {TOOLTIP.overview.problemface.title}
                              </Typography>
                              <br />
                              <Typography
                                variant="body1"
                                style={{ fontSize: "12px" }}
                              >
                                {TOOLTIP.overview.problemface.text1}
                                <ArrowUpward className={classes.arrowUp} />{" "}
                                {TOOLTIP.overview.problemface.text2}{" "}
                                <ArrowDownward className={classes.arrowDown} />{" "}
                                {TOOLTIP.overview.problemface.text3}
                              </Typography>
                            </>
                          }
                        >
                          <Info
                            className={classes.info}
                            style={{
                              display: "inline",
                              verticalAlign: "middle",
                            }}
                          />
                        </Tooltip>
                      </InputLabel>

                      {requestView ? (
                        problem.id && (
                          <AutoCompleteWithCreateOption
                            title="	"
                            variant="standard"
                            fullWidth={true}
                            optionData={problemsFacedList}
                            type={"problemsFaced"}
                            onAddOption={onAddOption}
                            problemStatus={problemStatus}
                            selectedValue={problem}
                            problem={
                              addPatientErrorMessages.problemsFaced.empty
                            }
                            setPriorityStatus={setPriorityStatus}
                            statusChange={setProblemStatus}
                            setPriority={setPriority}
                          />
                        )
                      ) : (
                        <AutoCompleteWithCreateOption
                          title="	"
                          variant="standard"
                          fullWidth={true}
                          optionData={problemsFacedList}
                          type={"problemsFaced"}
                          onAddOption={onAddOption}
                          problemStatus={problemStatus}
                          selectedValue={problem}
                          setPriorityStatus={setPriorityStatus}
                          problem={addPatientErrorMessages.problemsFaced.empty}
                          statusChange={setProblemStatus}
                          setPriority={setPriority}
                        />
                      )}
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <InputLabel style={{ fontSize: "12px" }}>
                        How does this impact your care or access to information?{" "}
                        <sup>*</sup>:
                      </InputLabel>
                      {requestView ? (
                        impact.id && (
                          <AutoCompleteWithCreateOption
                            title="	"
                            variant="standard"
                            fullWidth={true}
                            optionData={impactFacedList}
                            type={"impactFaced"}
                            onAddOption={onAddOption}
                            selectedValue={impact}
                            problemStatus={impactStatus}
                            setPriorityStatus={setPriorityStatus}
                            problem={addPatientErrorMessages.impactFaced.empty}
                            statusChange={setImpactStatus}
                            setPriority={setPriority}
                          />
                        )
                      ) : (
                        <AutoCompleteWithCreateOption
                          title="	"
                          variant="standard"
                          fullWidth={true}
                          optionData={impactFacedList}
                          type={"impactFaced"}
                          onAddOption={onAddOption}
                          selectedValue={impact}
                          problemStatus={impactStatus}
                          setPriorityStatus={setPriorityStatus}
                          problem={addPatientErrorMessages.impactFaced.empty}
                          statusChange={setImpactStatus}
                          setPriority={setPriority}
                        />
                      )}
                    </Grid>{" "}
                    <Grid item md={6} xs={12}>
                      <InputLabel
                        style={{ fontSize: "12px", marginBottom: "8px" }}
                      >
                        Priority<sup>*</sup>:
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="dense"
                        name="requestPriority"
                        onChange={handleChange}
                        select
                        style={{
                          fontSize: "14px",
                          marginBottom: "3px",
                        }}
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        value={priority}
                        variant="standard"
                        onBlur={(e) => handleValidateOnBlur(e)}
                        error={priorityStatus ? true : false}
                        helperText={
                          priorityStatus === true
                            ? addPatientErrorMessages.Priority.empty
                            : " "
                        }
                      >
                        <option key={0} value="0" hidden>
                          {translate("resources.requests.dropdown.priority")}
                        </option>
                        {priorityList.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.value}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid item xs={12}>
                        <InputLabel style={{ fontSize: "12px" }}>
                          How long has this problem been ongoing?
                        </InputLabel>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              margin="dense"
                              name="howLong"
                              label="How Long"
                              onChange={handleHowLongChange}
                              select
                              SelectProps={{ native: true }}
                              value={howLongVal.howLong}
                              variant="standard"
                              onBlur={(e) => handleValidateOnBlur(e)}
                              error={howLongStatus ? true : false}
                              helperText={
                                howLongStatus === true
                                  ? addPatientErrorMessages.howLong.empty
                                  : " "
                              }
                            >
                              <option key={0} value="0" hidden>
                                {translate(
                                  "resources.requests.dropdown.duration"
                                )}
                              </option>
                              {howLongValue.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              margin="dense"
                              label="Period Types"
                              name="howLongUnit"
                              onChange={handleHowLongChange}
                              select
                              SelectProps={{ native: true }}
                              value={howLongVal.howLongUnit}
                              variant="standard"
                              onBlur={(e) => handleValidateOnBlur(e)}
                              error={howLongUnitStatus ? true : false}
                              helperText={
                                howLongUnitStatus === true
                                  ? addPatientErrorMessages.howLongUnit.empty
                                  : " "
                              }
                            >
                              <option key={0} value="0" hidden>
                                {translate(
                                  "resources.requests.dropdown.periodType"
                                )}
                              </option>
                              {HOW_LONG_UNITS.map((option) => (
                                <option key={option.id} value={option.label}>
                                  {option.label}
                                </option>
                              ))}
                            </TextField>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid item xs={12}>
                        <InputLabel style={{ fontSize: "12px" }}>
                          Records requested
                        </InputLabel>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <DatePickerWithMonthAndYearDropdown
                              handleChangeFunction={handleChangeFromDate}
                              handleValidateOnBlurFunction={
                                handleValidateOnBlur
                              }
                              errorStatus={errorMsg.recordsFrom[0]}
                              errorMessage={
                                errorMsg.recordsFrom[1]
                                  ? errorMsg.recordsFrom[1]
                                  : " "
                              }
                              selectedDate={selectedFromDate}
                              id={"recordsFrom"}
                              label={
                                <>
                                  From<sup>*</sup>
                                </>
                              }
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <DatePickerWithMonthAndYearDropdown
                              handleChangeFunction={handleChangeToDate}
                              handleValidateOnBlurFunction={
                                handleValidateOnBlur
                              }
                              errorStatus={errorMsg.recordsTo[0]}
                              errorMessage={
                                errorMsg.recordsTo[1]
                                  ? errorMsg.recordsTo[1]
                                  : " "
                              }
                              selectedDate={selectedToDate}
                              id={"recordsTo"}
                              label={
                                <>
                                  To<sup>*</sup>
                                </>
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card className={classes.root} id="inspect-copy">
            <CardContent className={classes.cardContent}>
              <CardHeader>
                <Typography
                  variant="h5"
                  style={{ fontSize: 15, fontWeight: 500 }}
                  gutterBottom
                >
                  Please indicate whether you would like to inspect or receive a
                  copy of your records:
                </Typography>
              </CardHeader>
              <div style={{ display: "flex" }}>
                <Grid item md={6} xs={12}>
                  <FormControlLabel
                    name="isInspect"
                    value={formvalues.isInspect}
                    disabled={obtainCopyChecked}
                    onChange={handleChange}
                    // value={formvalues}
                    control={
                      <Checkbox
                        color="primary"
                        checked={formvalues.isInspect}
                      />
                    }
                    label="Inspect"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControlLabel
                    name="isObtainCopy"
                    value={formvalues.isObtainCopy}
                    disabled={inspectChecked}
                    onChange={handleChange}
                    control={
                      <Checkbox
                        color="primary"
                        checked={formvalues.isObtainCopy}
                      />
                    }
                    label="Obtain Copy"
                  />
                  {showObtainRecords && (
                    <div>
                      {obtainRecordList.length > 0 && (
                        <>
                          {requestView ? (
                            <>
                              {obtainData.map((individuals) => (
                                <>
                                  <FormControlLabel
                                    name={individuals.obtainRecordType}
                                    value={individuals.id}
                                    control={
                                      <Checkbox
                                        color="primary"
                                        id={individuals.id}
                                        checked={true}
                                      />
                                    }
                                    label={individuals.obtainRecordType}
                                  />
                                  <br />
                                </>
                              ))}
                            </>
                          ) : (
                            <>
                              {obtainRecordList.map((individuals) => (
                                <>
                                  <Tooltip
                                    arrow
                                    placement="top"
                                    title={
                                      individuals.recordStatusValue ===
                                      "Deleted"
                                        ? translate(
                                            "tooltip.feature_in_progress"
                                          )
                                        : ""
                                    }
                                  >
                                    <FormControlLabel
                                      name={individuals.code}
                                      value={individuals.id}
                                      onChange={handleObtainCopyChange}
                                      disabled={
                                        individuals.recordStatusValue ===
                                        "Deleted"
                                          ? true
                                          : false
                                      }
                                      control={
                                        <Checkbox
                                          color="primary"
                                          id={individuals.value}
                                        />
                                      }
                                      label={individuals.value}
                                    />
                                  </Tooltip>
                                  <br />
                                </>
                              ))}
                            </>
                          )}
                          {showFax && (
                            <MuiPhoneNumber
                              defaultCountry={"us"}
                              onlyCountries={["us"]}
                              disableAreaCodes={true}
                              fullWidth
                              countryCodeEditable={false}
                              onBlur={(e) => {
                                handleValidateOnBlur(e);
                              }}
                              error={errorMsg.faxNumber[0]}
                              helperText={
                                errorMsg.faxNumber[0]
                                  ? errorMsg.faxNumber[1]
                                  : " "
                              }
                              margin="dense"
                              label="Fax Number"
                              value={formvalues.faxNumber}
                              name="faxNumber"
                              onChange={handleChangeFax}
                              variant="standard"
                            />
                          )}
                          {showOthers && (
                            <TextField
                              fullWidth
                              label="Please specify other formats"
                              error={errorMsg.thirdPartyApps[0]}
                              helperText={
                                errorMsg.thirdPartyApps[0]
                                  ? errorMsg.thirdPartyApps[1]
                                  : " "
                              }
                              margin="dense"
                              name="thirdPartyApps"
                              onChange={handleObtainChange}
                              onBlur={handleValidateOnBlur}
                              required
                              value={formvalues.otherFormat}
                              variant="standard"
                            />
                          )}
                          {showPHR && (
                            <TextField
                              fullWidth
                              label="Specify name of PHR app"
                              error={errorMsg.phr[0]}
                              helperText={
                                errorMsg.phr[0] ? errorMsg.phr[1] : " "
                              }
                              margin="dense"
                              name="phr"
                              onChange={handleObtainChange}
                              onBlur={handleValidateOnBlur}
                              required
                              value={formvalues.phr}
                              variant="standard"
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}
                </Grid>
              </div>
            </CardContent>
          </Card>
          {showObtainRecords &&
            (!requestView
              ? PHYSICAL_RECORD_TYPE.some((value) =>
                  formvalues.obtainRecordType.includes(value)
                )
              : true) && (
              <Card className={classes.root}>
                <CardContent className={classes.cardContent}>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    style={{ paddingTop: "0", paddingBottom: "0" }}
                  >
                    <CardHeader>
                      <Typography
                        variant="h5"
                        style={{ fontSize: 16, fontWeight: 500 }}
                        gutterBottom
                      >
                        If you are requesting to obtain a copy:
                      </Typography>
                    </CardHeader>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <RadioGroup
                      name="obtainCopyMethodId"
                      onChange={handleObtainCopyMethodChange}
                      style={{ display: "inline-block" }}
                    >
                      <FormControlLabel
                        name="inPerson"
                        value="1"
                        control={
                          <Radio
                            color="primary"
                            checked={formvalues.obtainCopyMethodId === 1}
                          />
                        }
                        style={{ marginLeft: "0px", padding: "0px" }}
                        label="In person"
                      />{" "}
                      <FormControlLabel
                        name="postal"
                        value="2"
                        style={{ marginLeft: "0px", padding: "0px" }}
                        control={
                          <Radio
                            color="primary"
                            checked={formvalues.obtainCopyMethodId === 2}
                          />
                        }
                        label="Use Postal Service to Mail records"
                      />
                      <FormControlLabel
                        name="expedited"
                        value="3"
                        style={{ marginLeft: "0px", padding: "0px" }}
                        control={
                          <Radio
                            color="primary"
                            checked={formvalues.obtainCopyMethodId === 3}
                          />
                        }
                        label="Expedited Mailing (i.e., FedEx)"
                      />
                    </RadioGroup>{" "}
                    {formvalues.obtainCopyMethodId === 2 && (
                      <Grid item md={12} xs={12} style={{ marginLeft: "12px" }}>
                        <Typography
                          variant="h5"
                          style={{ fontSize: 14 }}
                          gutterBottom
                        >
                          Select the person(s) who receives the copies :{" "}
                          <FormControlLabel
                            name="myself"
                            value="1"
                            onChange={handleAddressSelectionChange}
                            control={
                              <Checkbox
                                color="primary"
                                checked={checked.myself}
                              />
                            }
                            label="My Self"
                          />
                          <FormControlLabel
                            name="physician"
                            value="2"
                            onChange={handleAddressSelectionChange}
                            control={
                              <Checkbox
                                color="primary"
                                checked={checked.physician}
                              />
                            }
                            label="Physician/Practitioner"
                          />
                          <FormControlLabel
                            name="both"
                            value="3"
                            onChange={handleAddressSelectionChange}
                            control={
                              <Checkbox
                                color="primary"
                                checked={checked.both}
                              />
                            }
                            label="Both"
                          />
                        </Typography>

                        <div style={{ display: "flex" }}>
                          {(formvalues.obtainCopyByPostalService === 1 ||
                            formvalues.obtainCopyByPostalService === 3) && (
                            <Grid item md={6} xs={12}>
                              <Typography
                                variant="h5"
                                style={{
                                  fontSize: 14,
                                  fontWeight: 500,
                                }}
                                gutterBottom
                              >
                                Your Postal Address<sup>*</sup>{" "}
                                {permissions === CO_ROLE_PATIENT && (
                                  <FormControlLabel
                                    name="obtainCopyDiffAddress"
                                    value={formvalues.obtainCopyDiffAddress}
                                    onChange={handleChange}
                                    control={
                                      <Checkbox
                                        color="primary"
                                        checked={
                                          formvalues.obtainCopyDiffAddress
                                        }
                                      />
                                    }
                                    label="I want to use a different Postal Address"
                                  />
                                )}
                              </Typography>
                              <TextField
                                name="requesterAddress"
                                onChange={(event) => handleChange(event)}
                                error={errorMsg.requesterAddress[0]}
                                helperText={
                                  errorMsg.requesterAddress[0]
                                    ? errorMsg.requesterAddress[1]
                                    : " "
                                }
                                onBlur={(e) => handleValidateOnBlur(e)}
                                multiline
                                style={{ width: "50%" }}
                                rows={4}
                                value={formvalues.requesterAddress}
                                variant="outlined"
                                placeholder="Enter the Postal Address "
                              />
                            </Grid>
                          )}
                          {(formvalues.obtainCopyByPostalService === 2 ||
                            formvalues.obtainCopyByPostalService === 3) && (
                            <Grid item md={6} xs={12}>
                              <Typography
                                variant="h5"
                                style={{
                                  fontSize: 14,
                                  fontWeight: 500,
                                  marginTop:
                                    permissions === CO_ROLE_PATIENT
                                      ? "10px"
                                      : "",
                                  marginBottom:
                                    permissions === CO_ROLE_PATIENT
                                      ? "15px"
                                      : "",
                                }}
                                gutterBottom
                              >
                                Physician/Practitioner Postal Address
                                <sup>*</sup>
                              </Typography>
                              <TextField
                                name="physicianAddress"
                                onChange={(event) => handleChange(event)}
                                error={errorMsg.physicianAddress[0]}
                                helperText={
                                  errorMsg.physicianAddress[0]
                                    ? errorMsg.physicianAddress[1]
                                    : " "
                                }
                                onBlur={(e) => handleValidateOnBlur(e)}
                                multiline
                                style={{ width: "50%" }}
                                rows={4}
                                value={formvalues.physicianAddress}
                                variant="outlined"
                                placeholder="Enter the Postal Address "
                              />
                            </Grid>
                          )}
                        </div>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <FormControlLabel
                      name="contactPersonally"
                      value={formvalues.contactPersonally}
                      onChange={handleChange}
                      style={{ marginLeft: "2px" }}
                      control={
                        <Checkbox
                          color="primary"
                          checked={Boolean(formvalues.contactPersonally)}
                        />
                      }
                      label="Would you like to be contacted personally regarding this request?"
                    />
                    {showContactPersonal && (
                      <>
                        <FormControlLabel
                          name="contactByMail"
                          value={formvalues.contactByMail}
                          onChange={handleCCChange}
                          control={
                            <Checkbox
                              color="primary"
                              checked={Boolean(formvalues.contactByMail)}
                            />
                          }
                          label="By Email"
                        />
                        <FormControlLabel
                          name="contactByPhone"
                          value={formvalues.contactByPhone}
                          onChange={handleCCChange}
                          control={
                            <Checkbox
                              color="primary"
                              checked={Boolean(formvalues.contactByPhone)}
                            />
                          }
                          label="By Call"
                        />
                        <FormControlLabel
                          name="contactBySms"
                          value={formvalues.contactBySms}
                          onChange={handleCCChange}
                          control={
                            <Checkbox
                              color="primary"
                              checked={Boolean(formvalues.contactBySms)}
                            />
                          }
                          label="By SMS"
                        />
                      </>
                    )}
                  </Grid>
                  {/* <Grid
                      item
                      md={12}
                      xs={12}
                      style={{ display: 'inline-flex', width: '100%' }}
                    >
                      <FormControlLabel
                        name="messageToEmail"
                        value={messageToEmail}
                        onChange={this.handleChange}
                        style={{ width: '65%' }}
                        control={<Checkbox
                          color="primary"
                        />}
                        label="Email or send secure message to the following email address:"
                      />
                      <TextField
                        fullWidth
                        margin="dense"
                        disabled={!this.state.messageToEmail}
                        // label="Last Name"
                        name="messageToEmailAddress"
                        style={{ fontSize: '14px' }}
                        onChange={this.handleChange}
                        required
                        value={this.state.messageToEmailAddress}
                        variant="standard"
                      />
                    </Grid> */}
                </CardContent>
              </Card>
            )}

          <Card className={classes.root} id="hipaa">
            <CardContent className={classes.cardContent}>
              <Grid
                alignItems="flex-end"
                container
                justify="space-between"
                spacing={1}
              >
                <Grid item md={12} style={{ paddingTop: "16px" }} xs={12}>
                  <Typography
                    variant="h5"
                    style={{ fontSize: 16, fontWeight: 500 }}
                    gutterBottom
                  >
                    HIPAA Authorization Form
                  </Typography>

                  <Divider />
                </Grid>
                <Grid item md={6} style={{ paddingTop: "16px" }} xs={12}>
                  <Typography
                    variant="h5"
                    style={{ fontSize: 14 }}
                    gutterBottom
                  >
                    Do you have a completed signed HIPAA authorization form that
                    you can upload?&nbsp;
                    <sup>*</sup>
                    <Tooltip
                      arrow
                      placement="top"
                      title={
                        userInfoReducer.role === CO_ROLE_PATIENT
                          ? translate("tooltip.request.hipaa_patient")
                          : translate("tooltip.request.hipaa")
                      }
                    >
                      <Info className={classes.info} />
                    </Tooltip>
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12} style={{ display: "inline-flex" }}>
                  <Grid item md={8} xs={12}>
                    {requestView ? (
                      <Typography
                        variant="h5"
                        style={{ fontSize: 14 }}
                        gutterBottom
                      >
                        {hipaaMsg}
                      </Typography>
                    ) : (
                      <ToggleButtonGroup
                        color="primary"
                        // value={}
                        exclusive
                        onChange={handleToggleChange}
                        aria-label="Platform"
                      >
                        <ToggleButton
                          value="yes"
                          name="healthInformationAuth"
                          onClick={() => {
                            setHipaaToggleYes(true);
                            setHipaaToggleNo(false);
                          }}
                          style={{
                            background: hipaaToggleYes ? "aliceBlue" : "",
                            border: "1px solid #D3D3D3",
                          }}
                        >
                          Yes
                        </ToggleButton>
                        <Tooltip
                          arrow
                          placement="top"
                          title={
                            permissions === CO_ROLE_PATIENT
                              ? translate(
                                  "tooltip.request.hipaa_toggle_patient"
                                )
                              : translate("tooltip.request.hipaa_toggle")
                          }
                        >
                          <ToggleButton
                            value="no"
                            name="healthInformationAuth"
                            onClick={() => {
                              setHipaaToggleYes(false);
                              setHipaaToggleNo(true);
                              setErrorMsg((prevFormState) => ({
                                ...prevFormState,
                                ["HIPAA"]: {
                                  0: false,
                                  1: "",
                                },
                              }));
                            }}
                            style={{
                              background: hipaaToggleNo ? "aliceBlue" : "",
                              border: "1px solid #D3D3D3",
                            }}
                          >
                            No
                          </ToggleButton>
                        </Tooltip>
                      </ToggleButtonGroup>
                    )}
                  </Grid>
                </Grid>
                <Grid md={12} xs={12} style={{ display: "inline-flex" }}>
                  <Grid
                    item
                    md={6}
                    xs={12}
                    style={{ marginLeft: "10px" }}
                    className="attachmentContainer"
                  >
                    {errorMsg["HIPAA"][0] ? (
                      <Typography style={{ color: "red" }}>
                        {errorMsg["HIPAA"][1]}
                      </Typography>
                    ) : (
                      " "
                    )}
                    {formvalues.healthInformationAuth && !hipaaFileData ? (
                      <UploadFile
                        name="health_information_auth"
                        fileResponse={fileResponseHandler}
                        description="Please upload a HIPAA form"
                      />
                    ) : (
                      ""
                    )}
                    {hipaaFileData && (
                      <div
                        className={classes.fileOuterComponent}
                        style={{ width: "60%", float: "right" }}
                      >
                        <img
                          src={URL.createObjectURL(hipaaFileData)}
                          className={classes.image}
                          alt={"..."}
                        />
                      </div>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card className={classes.root} id="sud">
            <CardContent>
              <Grid
                alignItems="flex-end"
                container
                justify="space-between"
                spacing={1}
              >
                <Grid item md={12} style={{ paddingTop: "16px" }} xs={12}>
                  <Typography
                    variant="h5"
                    style={{ fontSize: 16, fontWeight: 500 }}
                    gutterBottom
                  >
                    Substance Use Disorders and Mental Health
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item md={12} xs={12} style={{ display: "inline-flex" }}>
                  <Grid item md={6} xs={12}>
                    <FormControlLabel
                      name="hasSensitiveInformation"
                      value={formvalues.hasSensitiveInformation}
                      onChange={handleChange}
                      control={
                        <Checkbox
                          color="primary"
                          checked={formvalues.hasSensitiveInformation}
                        />
                      }
                      label="Do these records contain sensitive information about Substance Use Disorder, a Mental Health, Sexual/Reproductive Health condition or treatment?"
                    />
                    {errorSensitive && (
                      <Typography
                        style={{
                          color: "red",
                          marginLeft: "30px",
                        }}
                      >
                        {errorSensitive}
                      </Typography>
                    )}
                  </Grid>
                  {formvalues.hasSensitiveInformation && (
                    <Grid item md={4} xs={12}>
                      {sensitiveInfoList.map((individuals) => (
                        <>
                          <FormControlLabel
                            name={individuals.value}
                            value={individuals.id}
                            onChange={handleChangeSensitive}
                            control={
                              requestView ? (
                                individuals.id === 1 ? (
                                  <Checkbox
                                    color="primary"
                                    checked={formvalues.mentalHealthCondition}
                                  />
                                ) : individuals.id === 2 ? (
                                  <Checkbox
                                    color="primary"
                                    checked={formvalues.substanceDisorderAuth}
                                  />
                                ) : individuals.id === 3 ? (
                                  <Checkbox
                                    color="primary"
                                    checked={
                                      formvalues.sexualReproductiveCondition
                                    }
                                  />
                                ) : (
                                  <></>
                                )
                              ) : (
                                <Checkbox color="primary" />
                              )
                            }
                            label={individuals.value}
                          />
                          <br />
                        </>
                      ))}
                    </Grid>
                  )}
                </Grid>

                {formvalues.hasSensitiveInformation && showDisorder && (
                  <>
                    <Grid item md={6} style={{ paddingTop: "16px" }} xs={12}>
                      <Typography
                        variant="h5"
                        style={{ fontSize: 14 }}
                        gutterBottom
                      >
                        Do you have a completed signed Substance Use Disorder
                        authorization form that you can upload?
                        <Tooltip
                          arrow
                          placement="top"
                          title={
                            userInfoReducer.role === CO_ROLE_PATIENT
                              ? translate("tooltip.request.sod_patient")
                              : translate("tooltip.request.sod")
                          }
                        >
                          <Info className={classes.info} />
                        </Tooltip>
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                      style={{ display: "inline-flex" }}
                    >
                      <Grid item md={8} xs={12}>
                        {requestView ? (
                          <Typography
                            variant="h5"
                            style={{ fontSize: 14 }}
                            gutterBottom
                          >
                            {sudMsg}
                          </Typography>
                        ) : (
                          <ToggleButtonGroup
                            color="primary"
                            // value={}
                            exclusive
                            onChange={handleToggleChange}
                            aria-label="Platform"
                          >
                            <ToggleButton
                              value="yes"
                              name="disorderRequestAuth"
                              onClick={() => {
                                setSudToggleYes(true);
                                setSudToggleNo(false);
                              }}
                              style={{
                                background: sudToggleYes ? "aliceBlue" : "",
                                border: "1px solid #D3D3D3",
                              }}
                            >
                              Yes
                            </ToggleButton>
                            <Tooltip
                              arrow
                              placement="top"
                              title={
                                permissions === CO_ROLE_PATIENT
                                  ? translate(
                                      "tooltip.request.sod_toggle_patient"
                                    )
                                  : translate("tooltip.request.sod_toggle")
                              }
                            >
                              <ToggleButton
                                value="no"
                                name="disorderRequestAuth"
                                onClick={() => {
                                  setSudToggleYes(false);
                                  setSudToggleNo(true);
                                  setErrorMsg((prevFormState) => ({
                                    ...prevFormState,
                                    ["SOD"]: {
                                      0: false,
                                      1: "",
                                    },
                                  }));
                                }}
                                style={{
                                  background: sudToggleNo ? "aliceBlue" : "",
                                  border: "1px solid #D3D3D3",
                                }}
                              >
                                No
                              </ToggleButton>
                            </Tooltip>
                          </ToggleButtonGroup>
                        )}
                      </Grid>
                    </Grid>
                    <Grid md={12} xs={12} style={{ display: "inline-flex" }}>
                      <Grid
                        item
                        md={6}
                        xs={12}
                        style={{ marginLeft: "10px" }}
                        className="attachmentContainer"
                      >
                        {errorMsg["SOD"][0] ? (
                          <Typography style={{ color: "red" }}>
                            {errorMsg["SOD"][1]}
                          </Typography>
                        ) : (
                          " "
                        )}
                        {formvalues.disorderRequestAuth && !disorderFileData ? (
                          <UploadFile
                            name="disorder_Request_Auth"
                            fileResponse={fileResponseHandler}
                            description="Please upload a Substance Use Disorder Form"
                          />
                        ) : (
                          ""
                        )}
                        {disorderFileData && (
                          <div
                            className={classes.fileOuterComponent}
                            style={{ width: "60%", float: "right" }}
                          >
                            <img
                              src={URL.createObjectURL(disorderFileData)}
                              className={classes.image}
                              alt={"..."}
                            />
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
          <Card className={classes.root} id="patient-rep">
            <CardContent className={classes.cardContent}>
              <Grid
                alignItems="flex-end"
                container
                justify="space-between"
                spacing={1}
              >
                <Grid item md={12} style={{ paddingTop: "16px" }} xs={12}>
                  <Typography
                    variant="h5"
                    style={{ fontSize: 16, fontWeight: 500 }}
                    gutterBottom
                  >
                    Personal Representative
                  </Typography>

                  <Divider />
                </Grid>
                <Grid item md={6} style={{ paddingTop: "16px" }} xs={12}>
                  <Typography
                    variant="h5"
                    style={{ fontSize: 14 }}
                    gutterBottom
                  >
                    Does the patient have a legally designated personal
                    representative?
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12} style={{ display: "inline-flex" }}>
                  <Grid item md={8} xs={12}>
                    {requestView ? (
                      <Typography
                        variant="h5"
                        style={{ fontSize: 14 }}
                        gutterBottom
                      >
                        {proxyMsg}
                      </Typography>
                    ) : (
                      <ToggleButtonGroup
                        color="primary"
                        exclusive
                        onChange={handleToggleChange}
                        aria-label="Platform"
                      >
                        <ToggleButton
                          value="yes"
                          name="hasPersonalRepresentative"
                          onClick={() => {
                            setToggleYes(true);
                            setToggleNo(false);
                          }}
                          style={{
                            background: toggleYes ? "aliceBlue" : "",
                            border: "1px solid #D3D3D3",
                          }}
                        >
                          Yes
                        </ToggleButton>
                        <ToggleButton
                          value="no"
                          name="hasPersonalRepresentative"
                          onClick={() => {
                            setToggleYes(false);
                            setToggleNo(true);
                            setErrorMsg((prevFormState) => ({
                              ...prevFormState,
                              ["PR"]: {
                                0: false,
                                1: "",
                              },
                            }));
                          }}
                          style={{
                            background: toggleNo ? "aliceBlue" : "",
                            border: "1px solid #D3D3D3",
                          }}
                        >
                          No
                        </ToggleButton>
                      </ToggleButtonGroup>
                    )}
                  </Grid>
                </Grid>
                <Grid item md={12} xs={12} style={{ display: "inline-flex" }}>
                  <Grid item md={6} xs={12} className="attachmentContainer">
                    {errorMsg["PR"][0] ? (
                      <Typography
                        style={{
                          color: "red",
                          textTransform: "capitalize",
                        }}
                      >
                        {errorMsg["PR"][1]}
                      </Typography>
                    ) : (
                      " "
                    )}
                    {formvalues.hasPersonalRepresentative &&
                    !personalRepData ? (
                      <UploadFile
                        name="personal_representative_document"
                        fileResponse={fileResponseHandler}
                        description="Please upload documentation of Personal Representative"
                      />
                    ) : (
                      ""
                    )}
                    {personalRepData && (
                      <div
                        className={classes.fileOuterComponent}
                        style={{ width: "60%", float: "right" }}
                      >
                        <img
                          src={URL.createObjectURL(personalRepData)}
                          className={classes.image}
                          alt={"..."}
                        />
                      </div>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card className={classes.root} id="additional-info">
            <CardContent className={classes.cardContent}>
              <Grid
                alignItems="flex-end"
                container
                justify="space-between"
                spacing={1}
              >
                <Grid item md={12} xs={12}>
                  <Typography
                    variant="h5"
                    style={{ fontSize: 16, fontWeight: 500 }}
                    gutterBottom
                  >
                    Special Notes to Provider
                  </Typography>
                  <Divider />
                  <InputLabel
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    If you have specific requirements about this request to
                    communicate directly to the provider (such as a specific
                    record within the date range), please note them here. (max
                    2000 characters)
                  </InputLabel>

                  <TextField
                    name="additionalNotes"
                    onChange={(event) => handleChange(event)}
                    multiline
                    fullWidth
                    rows={4}
                    value={formvalues.additionalNotes}
                    variant="outlined"
                    placeholder="Enter a description (max 2000 characters)"
                    inputProps={{
                      maxLength: 2000,
                    }}
                    helperText={`${
                      formvalues.additionalNotes
                        ? formvalues.additionalNotes.length
                        : 0
                    }/2000 characters`}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>

        <CardActions>
          {/* <Button
            variant="contained"
            onClick={() => {
              saveAsDraftHandler();
            }}
            style={{
              backgroundColor: disableSaveAsDraft ? "#808080" : "#93C572",
              color: "white",
            }}
            disabled={disableSaveAsDraft}
          >
            Save as Draft
          </Button> */}
          <Button
            variant="contained"
            onClick={() => {
              if (permissions === CO_ROLE_PATIENT) {
                history.push(`/myRequests`);
              } else {
                history.push(`/requests`);
              }
            }}
            style={{
              backgroundColor: "grey",
              color: "white",
            }}
          >
            Close
          </Button>
          {!requestView ? (
            <Tooltip
              arrow
              placement="top"
              title={
                disableSubmit ? translate("tooltip.request.disable_submit") : ""
              }
            >
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    submitHandler();
                  }}
                  disabled={submitted || disableSubmit}
                  startIcon={
                    isLoading ? (
                      <CircularProgress color="secondary" size={20} />
                    ) : (
                      ""
                    )
                  }
                >
                  {!isLoading ? "Submit" : "Sending Request"}
                </Button>
              </span>
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled={!formvalues.sourceInstitution ? true : false}
              onClick={() => {
                if (
                  permissions === CO_ROLE_PATIENT &&
                  (!formvalues.hipaaAuthorizationFile ||
                    (formvalues.substanceDisorderAuth &&
                      !formvalues.disorderDisclosureAuthorizationFile))
                ) {
                  setOpenAuthBase(true);
                } else {
                  setOpenProviderConfirmBase(true);
                }
              }}
              startIcon={
                isLoading ? (
                  <CircularProgress color="secondary" size={20} />
                ) : (
                  ""
                )
              }
            >
              {!isLoading ? "Send to Provider" : "Sending Request"}
            </Button>
          )}

          {errorSet && (
            <Typography style={{ color: "red" }}>
              {translate(`resources.requests.error.mandatory_error`)}
            </Typography>
          )}
          {errorUpload && (
            <Typography style={{ color: "red" }}>
              {translate(`resources.requests.error.upload_error`)}
            </Typography>
          )}
        </CardActions>
      </div>
    </Container>
  ) : (
    <PageNotFound />
  );
}
