import type { BaseSyntheticEvent } from "react";
import React, { useEffect, useState } from "react";
import { useDataProvider, useTranslate } from "react-admin";
import {
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  InputLabel,
  LinearProgress,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
//import type { Theme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { useMutation } from "@apollo/react-hooks";
import createInsuranceRequestQuery from "../../../queries/createInsuranceRequest/createInsuranceRequestQuery";
import createFileUploadQuery from "../../../queries/createFileUpload/createFileUploadQuery";
import type { FileUploadInput } from "../../../__generated__/typescript-operations_all";
import AddPatient from "../../../components/addPatient";
import CardHeader from "../../../components/cardHeader";
import UploadFile from "../../../components/uploadFile";
import type {
  IBillingOrganization,
  ICheckPatientValidatorProps,
  IContactType,
  IFileResponse,
  IGenericType,
} from "../../../types/types";
import CreatePageHeader from "../../../components/createPageHeader";
import { useNavigate } from "react-router";
//import type { AppState } from "../../../types";
//import { useSelector } from "react-redux";
import { perPageMax } from "../../../utils/pageConstants";
// import useTraces from "../../../hooks/useTraces";
import { correlationConstants } from "../../../utils/OT/correlationConstants";
import { validateMRN } from "../../../utils/validator";
import {
  addPatientErrorMessages,
  ERROR_MESSAGE_KEY,
} from "../../../utils/messages/errorMessages";
import { CREATE_MEDICAL_RECORD_ERROR_INIT } from "../../../utils/messages/initializeConstants";
import BaseModal from "../../../components/baseModal";
import { REQUEST_MESSAGES } from "../../../utils/messages/requestMessages";
import PageNotFound from "../../../components/pageNotFound";
import { CO_ROLE_PATIENT, CO_ROLE_PPA } from "../../../utils/roles";

// const useStyles = makeStyles((theme: Theme) => ({
//   root: {
//     backgroundColor: theme.palette.primary.light,
//     marginTop: 20,
//   },
//   select: {
//     minWidth: "40%",
//   },
//   button: {
//     margin: theme.spacing(1),
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     marginBottom: theme.spacing(2),
//   },
// }));
const PREFIX = "BillingRequest";
const classes = {
  root: `${PREFIX}-root`,
  select: `${PREFIX}-select`,
  button: `${PREFIX}-button`,
  header: `${PREFIX}-header`,
};
const StyledDiv = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    backgroundColor: theme.palette.primary.light,
    marginTop: 20,
  },
  [`& .${classes.select}`]: {
    minWidth: "40%",
  },
  [`& .${classes.button}`]: {
    margin: theme.spacing(1),
  },
  [`& .${classes.header}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: theme.spacing(2),
  },
}));
interface IOrganization {
  id: string | number;
  name?: string;
}
export default function BillingRequest(): JSX.Element {
  const dataProvider = useDataProvider();
  const navigate = useNavigate();
  const translate = useTranslate();
  const [doSubmit, setDoSubmit] = useState(true);
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer
  );
  const [errorMsg, setErrorMsg] = useState(CREATE_MEDICAL_RECORD_ERROR_INIT);
  const [alertAddPatient, setAlertAddPatient] = useState(false);
  const [openSubmitBase, setOpenSubmitBase] = useState(false);
  const [openErrorBase, setOpenErrorBase] = useState(false);
  const [openBase, setOpenBase] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [formvalues, setFormvalues] = useState({
    attachment: null,
    assignToPersonId: "",
    organizationGroupId: "",
    billingRequestCategoryId: 1,
    billingRequestTypeId: "1",
    organizationId: "",
    contactData: "",
    requester: userInfoReducer.id,
    contactChannelId: 1,
    pan: "",
    others: "",
    mrn: "",
    requestStatus: 1,
    signature: null,
    sourceNatureId: 2,
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

  const [checkPatientValidation, setCheckPatientValidation] = useState(false);
  const [assignToList, setAssignedList] = useState([]);
  const [errorSet, setErrorSet] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);
  //const { getTrace, handleTrace } = useTraces();
  const [contactType, setContactType] = useState<IContactType>({
    isPhone: false,
    istext: false,
    contactDataTitle: "Email Address",
    isEmail: true,
  });
  const [billingInsurance, setBillingionsurance] = useState("billing");
  const [isLoading, setIsLoading] = useState(false);
  const [billingRequestCategoriesList, setBillingRequestCategoriesList] =
    useState<IGenericType[]>([]);
  const [organizationGroupList, setOrganizationGroupList] = useState<
    IOrganization[]
  >([]);
  const [attachmentResponse, setAttachmentResponse] = useState<IFileResponse>(
    {}
  );
  const [billingOrganizationList, setBillingOrganizationList] = useState<
    IBillingOrganization[]
  >([]);

  const [billingRequestTypeContent, setBillingRequestTypeContent] = useState({
    primaryRequestType: "",
    primaryRequestTypeList: [],
    presetPrimaryRequestTypeList: [],
    secondaryRequestTypeListData: [],
    showSecondaryList: false,
    secondaryRequestTypeList: [],
    secondaryRequestType: "",
    showTertiaryList: false,
    tertiaryRequestTypeList: [],
    tertiaryRequestType: "",
    showOthersRemark: false,
    otherRemark: "",
  });
  useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setEmailNotVerified(true);
    }
  }, []);
  const setSecondaryList = (currentName, currentValue): void => {
    const sampleSetindiv =
      billingRequestTypeContent.secondaryRequestTypeListData.filter(
        (individuals) => currentValue === individuals.parentId
      );

    const currentIndiv =
      billingRequestTypeContent.primaryRequestTypeList.filter(
        (individuals) => currentValue === individuals.billingRequestTypeId
      );

    if (currentName === "primaryRequestType") {
      if (currentIndiv[0].code === "Other") {
        setBillingRequestTypeContent((prevFormState) => ({
          ...prevFormState,
          showOthersRemark: true,
          showSecondaryList: false,
          showTertiaryList: false,
          secondaryRequestType: "",
          tertiaryRequestType: "",
          secondaryRequestTypeList: [],
        }));
      } else {
        if (sampleSetindiv.length > 0) {
          setBillingRequestTypeContent((prevFormState) => ({
            ...prevFormState,
            showSecondaryList: true,
            showOthersRemark: false,
            secondaryRequestTypeList: sampleSetindiv,
            secondaryRequestType: sampleSetindiv[0].billingRequestTypeId,
            tertiaryRequestType: "",
          }));
          setSecondaryList(
            "secondaryRequestType",
            sampleSetindiv[0].billingRequestTypeId
          );
        } else {
          setBillingRequestTypeContent((prevFormState) => ({
            ...prevFormState,
            showSecondaryList: false,
            showTertiaryList: false,
            showOthersRemark: false,
            secondaryRequestType: "",
            tertiaryRequestType: "",
            secondaryRequestTypeList: [],
          }));
        }
      }
    } else if (currentName === "secondaryRequestType") {
      if (sampleSetindiv.length > 0) {
        setBillingRequestTypeContent((prevFormState) => ({
          ...prevFormState,
          showTertiaryList: true,
          showOthersRemark: false,
          tertiaryRequestTypeList: sampleSetindiv,
          tertiaryRequestType: sampleSetindiv[0].billingRequestTypeId,
        }));
      } else {
        setBillingRequestTypeContent((prevFormState) => ({
          ...prevFormState,
          showTertiaryList: false,
          showOthersRemark: false,
          tertiaryRequestType: "",
          tertiaryRequestTypeList: [],
        }));
      }
    }
  };
  const resetRequestType = (categoryId): void => {
    const presetVal = billingRequestTypeContent.presetPrimaryRequestTypeList;
    const primaryRequestTypeList = [];
    if (presetVal.length > 0) {
      for (let i = 0; i < presetVal.length; i++) {
        if (presetVal[i].billingRequestCategoryId === categoryId) {
          primaryRequestTypeList.push(presetVal[i]);
        }
      }
      setBillingRequestTypeContent((prevFormState) => ({
        ...prevFormState,
        primaryRequestTypeList: primaryRequestTypeList,
        primaryRequestType:
          primaryRequestTypeList.length > 0
            ? primaryRequestTypeList[0].billingRequestTypeId
            : "",
      }));
      if (primaryRequestTypeList.length > 0) {
        setSecondaryList(
          "primaryRequestType",
          primaryRequestTypeList[0].billingRequestTypeId
        );
      }
    }
  };
  const handleValidateOnBlur = (event: BaseSyntheticEvent): void => {
    let validationStatus: boolean;
    if (event.target.type !== "checkbox") {
      validationStatus = !event.target.value;
    }
    if (!validationStatus) {
      switch (event.target.name) {
        case "mrn":
        case "pan": {
          if (event.target.value !== "") {
            const valid = validateMRN(event.target.value);
            setError(event.target.name, !valid && ERROR_MESSAGE_KEY, !valid);
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
      setError(event.target.name, "", false);
    }
  };

  const setError = (
    fieldName: string,
    type: string,
    setError: boolean
  ): void => {
    setErrorMsg((prevFormState) => ({
      ...prevFormState,
      [fieldName]: {
        0: setError,
        1: setError ? addPatientErrorMessages[fieldName][type] : "",
      },
    }));
  };

  const handleContactChange = (event: BaseSyntheticEvent): void => {
    event.persist();
    if (event.target.name === "isEmail") {
      if (event.target.checked === true) {
        setContactType({
          isPhone: false,
          istext: false,
          contactDataTitle: "Email Address",
        });
        setFormvalues((prevFormState) => ({
          ...prevFormState,
          contactData: formvalues.pdr.electronicDetails,
        }));
      } else {
        setContactType({
          isEmail: true,
          isPhone: false,
          istext: false,
          contactDataTitle: "Email Address",
        });
        setFormvalues((prevFormState) => ({
          ...prevFormState,
          contactData: formvalues.pdr.electronicDetails,
        }));
      }
    } else if (event.target.name === "isPhone") {
      if (event.target.checked === true) {
        setContactType({
          isEmail: false,
          istext: false,
          contactDataTitle: "Phone Number",
        });
        setFormvalues((prevFormState) => ({
          ...prevFormState,
          contactData: formvalues.pdr.number,
        }));
      } else {
        setContactType({
          isEmail: true,
          isPhone: false,
          istext: false,
          contactDataTitle: "Email Address",
        });
        setFormvalues((prevFormState) => ({
          ...prevFormState,
          contactData: formvalues.pdr.electronicDetails,
        }));
      }
    } else if (event.target.name === "istext") {
      if (event.target.checked === true) {
        setContactType({
          isEmail: false,
          isPhone: false,
          contactDataTitle: "Phone Number",
        });
        setFormvalues((prevFormState) => ({
          ...prevFormState,
          contactData: formvalues.pdr.number,
        }));
      } else {
        setContactType({
          isEmail: true,
          isPhone: false,
          istext: false,
          contactDataTitle: "Email Address",
        });
        setFormvalues((prevFormState) => ({
          ...prevFormState,
          contactData: formvalues.pdr.electronicDetails,
        }));
      }
    }
    setContactType((prevFormState: IContactType) => ({
      ...prevFormState,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    }));
  };

  const handleChange = (event: BaseSyntheticEvent): void => {
    event.persist();

    if (
      event.target.name === "pan" ||
      event.target.name === "mrn" ||
      event.target.name === "contactData" ||
      event.target.name === "assignToPersonId" ||
      event.target.name === "others"
    ) {
      setFormvalues((prevFormState) => ({
        ...prevFormState,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      }));
    } else if (event.target.name === "billingRequestCategoryId") {
      setFormvalues((prevFormState) => ({
        ...prevFormState,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : Number(event.target.value),
      }));
      getRequestType(Number(event.target.value));
      setBillingionsurance(
        event.target.value === "1" ? "billing" : "insurance"
      );
      resetRequestType(Number(event.target.value));
    } else if (event.target.name === "organizationGroupId") {
      setAssignedList([]);
      setBillingOrganizationList([]);
      getOrganization();
      setFormvalues((prevFormState) => ({
        ...prevFormState,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      }));
    } else if (event.target.name === "organizationId") {
      setAssignedList([]);
      getAssignedTo(event.target.value);
      setFormvalues((prevFormState) => ({
        ...prevFormState,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      }));
    } else {
      setBillingRequestTypeContent((prevFormState) => ({
        ...prevFormState,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      }));
      setSecondaryList(event.target.name, event.target.value);
    }
  };

  function getOrganization(): void {
    const queryOrgOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {},
    };
    dataProvider
      .getList("organizationMasterV1s", queryOrgOption)
      .then(({ data }) => {
        setBillingOrganizationList(data);
        setFormvalues((prevFormState) => ({
          ...prevFormState,
          organizationId: data.length > 0 ? String(data[0].id) : "",
        }));
        getAssignedTo(data.length > 0 ? data[0].id : "");
      })
      .catch((error) => error);
  }

  function getAssignedTo(organizationId): void {
    const queryassignToOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "partyId", order: "ASC" },
      filter: {
        organizationId: organizationId,
      },
    };
    dataProvider
      .getList("assignToMraMasterV1s", queryassignToOption)
      .then(({ data }) => {
        if (data.length > 0) {
          setAssignedList(data);
          setFormvalues((prevFormState) => ({
            ...prevFormState,
            assignToPersonId: data[0].partyId || "",
          }));
        }
      })
      .catch((error) => error);
  }

  const billingRequest = document.getElementById("billingRequest");
  useEffect(() => {
    if (billingRequest) {
      if (billingRequest.hidden === false) {
        getTrace(
          "Billing/Insurance Question Request Form loaded",
          "ev-074",
          userInfoReducer.email
        );
      }
    }
  }, [billingRequest]);
  useEffect(() => {
    if (userInfoReducer.id) {
      setFormvalues((prevFormState) => ({
        ...prevFormState,
        requester: userInfoReducer.id,
      }));
    }
  }, [userInfoReducer.id]);
  useEffect(() => {
    let mounted = true;

    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {},
    };
    function getBillingRequestCategories(): void {
      dataProvider
        .getList("billingRequestCategoryMasters", queryOption)
        .then(({ data }) => {
          if (mounted) {
            setBillingRequestCategoriesList(data);
            setFormvalues((prevFormState) => ({
              ...prevFormState,
              billingRequestCategoryId: Number(data[0].id),
            }));
            getRequestType(Number(data[0].id));
          }
        })
        .catch((error) => error);
    }

    function getOrganizationGroup(): void {
      dataProvider
        .getList("organizationGroupMasterV1", queryOption)
        .then(({ data }) => {
          if (mounted) {
            setOrganizationGroupList(data);
            getOrganization();
            setFormvalues((prevFormState) => ({
              ...prevFormState,
              organizationGroupId: String(data[0].id),
            }));
          }
        })
        .catch((error) => error);
    }

    getBillingRequestCategories();
    getOrganizationGroup();

    return () => {
      mounted = false;
    };
  }, [userInfoReducer]);

  function getRequestType(categoryId): void {
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: { billingRequestCategoryId: categoryId },
    };
    dataProvider
      .getList("billingRequestCategories", queryOption)
      .then(({ data }) => {
        if (data.length > 0) {
          const primaryRequestTypeList = [];
          const presetPrimaryRequestTypeList = [];
          const secondaryRequestTypeListData = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === null) {
              presetPrimaryRequestTypeList.push(data[i]);
              primaryRequestTypeList.push(data[i]);
            } else {
              secondaryRequestTypeListData.push(data[i]);
            }
          }

          setBillingRequestTypeContent((prevFormState) => ({
            ...prevFormState,
            presetPrimaryRequestTypeList: presetPrimaryRequestTypeList,
            primaryRequestTypeList: primaryRequestTypeList,
            billingRequestTypeList: data,
            secondaryRequestTypeListData: secondaryRequestTypeListData,
            primaryRequestType:
              primaryRequestTypeList.length > 0
                ? primaryRequestTypeList[0].billingRequestTypeId
                : "",
          }));

          if (primaryRequestTypeList.length > 0) {
            setSecondaryList(
              "primaryRequestType",
              primaryRequestTypeList[0].billingRequestTypeId
            );
          }
        }
      })
      .catch((error) => error);
  }

  const getpatient = (patient): void => {
    setFormvalues((prevFormState) => ({
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
    }));
  };
  const checkPatientValidator = ({
    isValid,
    isInit,
  }: ICheckPatientValidatorProps): void => {
    setCheckPatientValidation(isValid ? isValid : isInit);
    setDoSubmit(isValid);
  };

  const submitHandler = (): void => {
    if (checkPatientValidation) {
      setAlertAddPatient(true);
    }
    if (!checkPatientValidation) {
      setAlertAddPatient(false);
    }
    if (!checkPatientValidation) {
      setErrorSet(false);
    }
    if (
      !doSubmit ||
      !checkPatientValidation ||
      !formvalues.pdr.electronicDetails ||
      !formvalues.pdr.number ||
      !formvalues.pdr.city ||
      !formvalues.pdr.addressLine1 ||
      !formvalues.pdr.state ||
      !formvalues.pdr.birthDate ||
      !formvalues.pdr.firstName ||
      !formvalues.pdr.lastName ||
      !formvalues.pdr.addressZip ||
      errorUpload ||
      errorMsg["mrn"][0] ||
      errorMsg["pan"][0]
    ) {
      setIsLoading(false);
      if (errorUpload) {
        setErrorUpload(true);
      } else {
        setErrorSet(true);
      }
    } else {
      if (checkPatientValidation) {
        setOpenBase(true);
      }
    }
  };
  const mutationFunction = (formvalues): void => {
    getTrace(
      "Data filled by the user in Billing Request",
      "ev-076",
      userInfoReducer.email
    );

    const eventObj = correlationConstants["ev-078"];
    const inputContext = {
      action: "Submitted Billing Request",
      aecId: eventObj.aecId,
      aecIeId: eventObj.aecIeId,
    };
    handleTrace(
      eventObj.eventTitle,
      inputContext,
      (spanContext: any, fingerprint: any) => {
        formvalues.otContext = JSON.stringify(spanContext);
        formvalues.fingerPrint = fingerprint;
        formvalues.otTags = JSON.stringify({
          name: "Attempt to submit Billing Request",
        });

        if (attachmentResponse.response) {
          const fileUpload: FileUploadInput = {
            fileName: attachmentResponse.response,
            fileType: attachmentResponse.name || "",
          };
          subscribeFileUploadMutation({
            variables: { input: { fileUpload: fileUpload } },
          }).then((res) => {
            if (res.data) {
              const formValueToUpload = formvalues;
              formValueToUpload.attachment =
                res.data.createFileUpload.fileUpload.id;
              subscribeMutation({
                variables: { input: formValueToUpload },
              }).then(() => {
                setIsLoading(false);
                setErrorSet(false);
                setErrorUpload(false);
              });
              setOpenSubmitBase(true);
              getTrace(
                "Billing request created and success message is displayed",
                "ev-079",
                userInfoReducer.email
              );
            }
          });
        } else {
          subscribeMutation({
            variables: { input: formvalues },
          }).then(() => {
            setIsLoading(false);
            setErrorSet(false);
            setOpenSubmitBase(true);
            getTrace(
              "Billing request created and success message is displayed",
              "ev-079",
              userInfoReducer.email
            );
          });
        }
      }
    );
  };

  const submitRequestConfirmed = (): void => {
    setOpenBase(false);
    setIsLoading(true);
    mutationFunction(formvalues);
  };

  const setRequestType = (): void => {
    if (billingRequestTypeContent.tertiaryRequestType === "") {
      if (billingRequestTypeContent.secondaryRequestType === "") {
        formvalues.billingRequestTypeId =
          billingRequestTypeContent.primaryRequestType;
      } else {
        formvalues.billingRequestTypeId =
          billingRequestTypeContent.secondaryRequestType;
      }
    } else {
      formvalues.billingRequestTypeId =
        billingRequestTypeContent.tertiaryRequestType;
    }
    let channelId = 0;
    if (contactType.isEmail === true) {
      channelId = 1;
    } else if (contactType.isPhone === true) {
      channelId = 2;
    } else if (contactType.istext === true) {
      channelId = 3;
    }
    formvalues.contactChannelId = channelId;

    submitHandler();
  };

  const [subscribeMutation] = useMutation(createInsuranceRequestQuery, {});
  const fileResponseHandler = (responseSet: IFileResponse): void => {
    if (responseSet.response !== "") {
      getTrace("Attach Supporting Document", "ev-077", userInfoReducer.email);
      setAttachmentResponse(responseSet);
      setErrorUpload(false);
    } else {
      setErrorUpload(true);
    }
  };

  const [subscribeFileUploadMutation] = useMutation(createFileUploadQuery, {});

  return !emailNotVerified &&
    (userInfoReducer.role === CO_ROLE_PPA ||
      userInfoReducer.role === CO_ROLE_PATIENT) ? (
        <StyledDiv>
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
            REQUEST_MESSAGES["billing"].confirmTitle +
            '"' +
            formvalues.pdr.firstName +
            " " +
            formvalues.pdr.lastName +
            '"'
          }
          content={REQUEST_MESSAGES["billing"].confirmContent}
          successButtonName="Confirm"
        />
      )}
      {openSubmitBase && (
        <BaseModal
          open={openSubmitBase}
          confirmAction={() => {
            setOpenSubmitBase(false);
            if (userInfoReducer.role === CO_ROLE_PATIENT) {
              navigate("/myRequests");
            } else {
              navigate("/requests");
            }
          }}
          onClose={() => {
            setOpenSubmitBase(false);
            if (userInfoReducer.role === CO_ROLE_PATIENT) {
              navigate("/myRequests");
            } else {
              navigate("/requests");
            }
          }}
          title={
            REQUEST_MESSAGES["billing"].successTitle[0] +
            '"' +
            formvalues.pdr.firstName +
            " " +
            formvalues.pdr.lastName +
            '"' +
            REQUEST_MESSAGES["billing"].successTitle[1]
          }
          content={REQUEST_MESSAGES["billing"].successContent}
          successButtonName="Go to My Requests"
          type="success"
        />
      )}
      {openErrorBase && (
        <BaseModal
          open={openErrorBase}
          confirmAction={() => {
            setOpenErrorBase(false);
            if (userInfoReducer.role === CO_ROLE_PATIENT) {
              navigate("/myRequests");
            } else {
              navigate("/requests");
            }
          }}
          onClose={() => {
            setOpenErrorBase(false);
            if (userInfoReducer.role === CO_ROLE_PATIENT) {
              history.push("/myRequests");
            } else {
              history.push("/requests");
            }
          }}
          title={
            REQUEST_MESSAGES["billing"].errorTitle[0] +
            '"' +
            formvalues.pdr.firstName +
            " " +
            formvalues.pdr.lastName +
            '"' +
            REQUEST_MESSAGES["billing"].errorTitle[1]
          }
          content={translate("resources.requests.notification.errorMessageMrr")}
          closeButtonName="Close"
          type="requestError"
        />
      )}
      <div
        id="billingRequest"
        style={{
          filter: openSubmitBase || openErrorBase ? "blur(2px)" : "none",
        }}
      >
        <div
          style={{
            filter: isLoading ? "blur(1px)" : "none",
          }}
        >
          <CreatePageHeader
            subTitle="resources.billingRequest.formSubtitle"
            mainTitle="resources.billingRequest.formTitle"
          />
          <Card className={classes.root} id="billing-patient-info">
            <CardContent>
              <CardHeader>
                <Typography
                  variant="h5"
                  style={{ fontSize: 16, fontWeight: 500 }}
                  gutterBottom
                >
                  <b>Patient Information:</b>
                </Typography>
              </CardHeader>
              <Grid
                container
                style={{ marginTop: "5px" }}
                alignItems="flex-end"
              >
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    name="mrn"
                    // required
                    onChange={handleChange}
                    value={formvalues.mrn}
                    onBlur={(e) => handleValidateOnBlur(e)}
                    error={errorMsg.mrn[0]}
                    helperText={errorMsg.mrn[0] ? errorMsg.mrn[1] : " "}
                    label="MRN (Optional)"
                    variant="standard"
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    name="pan"
                    onChange={handleChange}
                    value={formvalues.pan}
                    onBlur={(e) => handleValidateOnBlur(e)}
                    error={errorMsg.pan[0]}
                    helperText={errorMsg.pan[0] ? errorMsg.pan[1] : " "}
                    label="Patient Account Number (PAN) (Optional)"
                    variant="standard"
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
                style={{ marginTop: "5px" }}
                alignItems="flex-end"
              >
                <AddPatient
                  checkPatientValidator={(
                    checkPatientValidatorProps: ICheckPatientValidatorProps
                  ) => checkPatientValidator(checkPatientValidatorProps)}
                  getpatient={getpatient}
                  alertAddPatient={alertAddPatient}
                  requestData={null}
                  dependentData={null}
                  setDisableSelection={null}
                />
              </Grid>
            </CardContent>
          </Card>
          <form
            className={classes.root}
            noValidate
            autoComplete="off"
            encType={"multipart/form-data"}
            id="billing-description"
          >
            <Card className={classes.root}>
              <CardContent>
                <CardHeader>
                  <Typography
                    variant="h5"
                    style={{ fontSize: 16, fontWeight: 500 }}
                    gutterBottom
                  >
                    <b>Request Details:</b>
                  </Typography>
                </CardHeader>

                <div>
                  <Grid
                    alignItems="flex-end"
                    container
                    justify="space-between"
                    spacing={3}
                  >
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Request Type"
                        margin="dense"
                        name="billingRequestCategoryId"
                        onChange={handleChange}
                        required
                        select
                        SelectProps={{ native: true }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={formvalues.billingRequestCategoryId}
                        variant="standard"
                      >
                        {billingRequestCategoriesList.map(
                          (option: IGenericType) => (
                            <option key={option.id} value={option.id}>
                              {option.value}
                            </option>
                          )
                        )}
                      </TextField>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Organization Group"
                        margin="dense"
                        name="organizationGroupId"
                        onChange={handleChange}
                        required
                        select
                        InputLabelProps={{
                          shrink: true,
                        }}
                        SelectProps={{ native: true }}
                        value={formvalues.organizationGroupId}
                        variant="standard"
                      >
                        {organizationGroupList.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Organization"
                        margin="dense"
                        name="organizationId"
                        onChange={handleChange}
                        required
                        select
                        InputLabelProps={{
                          shrink: true,
                        }}
                        SelectProps={{ native: true }}
                        value={formvalues.organizationId}
                        variant="standard"
                      >
                        {billingOrganizationList.map(
                          (option: IBillingOrganization) => (
                            <option key={option.id} value={option.id}>
                              {option.organization}
                            </option>
                          )
                        )}
                      </TextField>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Assigned To"
                        margin="dense"
                        name="assignToPersonId"
                        onChange={handleChange}
                        style={{ fontSize: "14px" }}
                        required
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        value={formvalues.assignToPersonId}
                        variant="standard"
                      >
                        {assignToList.map((option) => (
                          <option key={option.partyId} value={option.partyId}>
                            {option.name}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item md={12} style={{ paddingTop: "16px" }} xs={12}>
                      <InputLabel style={{ marginTop: "10px" }}>
                        Description of{" "}
                        {billingInsurance === "billing"
                          ? "Billing"
                          : "Insurance"}{" "}
                        Question Request
                      </InputLabel>
                    </Grid>
                    <Grid
                      item
                      md={12}
                      xs={12}
                      style={{ display: "inline-flex", width: "98%" }}
                    >
                      <TextField
                        fullWidth
                        label="Request Type"
                        margin="none"
                        name="primaryRequestType"
                        onChange={handleChange}
                        required
                        select
                        helperText=" "
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        value={billingRequestTypeContent.primaryRequestType}
                        variant="standard"
                      >
                        {billingRequestTypeContent.primaryRequestTypeList.map(
                          (option) => (
                            <option
                              key={option.billingRequestTypeId}
                              value={option.billingRequestTypeId}
                            >
                              {option.value}
                            </option>
                          )
                        )}
                      </TextField>
                      {billingRequestTypeContent.showSecondaryList &&
                        billingRequestTypeContent.secondaryRequestTypeList && (
                          <TextField
                            fullWidth
                            label="Request Type"
                            margin="none"
                            name="secondaryRequestType"
                            onChange={handleChange}
                            required
                            select
                            helperText=" "
                            // eslint-disable-next-line react/jsx-sort-props
                            SelectProps={{ native: true }}
                            value={
                              billingRequestTypeContent.secondaryRequestType
                            }
                            variant="standard"
                          >
                            {billingRequestTypeContent.secondaryRequestTypeList.map(
                              (option) => (
                                <option
                                  key={option.billingRequestTypeId}
                                  value={option.billingRequestTypeId}
                                >
                                  {option.value}
                                </option>
                              )
                            )}
                          </TextField>
                        )}
                      {billingRequestTypeContent.showTertiaryList &&
                        billingRequestTypeContent.tertiaryRequestTypeList && (
                          <TextField
                            fullWidth
                            label="Request Type"
                            margin="none"
                            name="tertiaryRequestType"
                            onChange={handleChange}
                            required
                            select
                            // eslint-disable-next-line react/jsx-sort-props
                            SelectProps={{ native: true }}
                            helperText=" "
                            value={
                              billingRequestTypeContent.tertiaryRequestType
                            }
                            variant="standard"
                          >
                            {billingRequestTypeContent.tertiaryRequestTypeList.map(
                              (option) => (
                                <option
                                  key={option.billingRequestTypeId}
                                  value={option.billingRequestTypeId}
                                >
                                  {option.value}
                                </option>
                              )
                            )}
                          </TextField>
                        )}
                      {billingRequestTypeContent.showOthersRemark && (
                        <TextField
                          fullWidth
                          label="Remarks"
                          margin="none"
                          name="others"
                          onChange={handleChange}
                          required
                          helperText=" "
                          value={formvalues.others}
                          variant="standard"
                        ></TextField>
                      )}
                    </Grid>
                    <Grid item md={6} xs={12} alignItems="flex-end">
                      <Grid item md={12} xs={12}>
                        <Typography>
                          How would you like to be contacted regarding this
                          request:
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        style={{ display: "inline-flex" }}
                      >
                        <FormControlLabel
                          name="isEmail"
                          onChange={handleContactChange}
                          value={contactType.isEmail}
                          control={
                            <Checkbox
                              color="primary"
                              defaultChecked
                              checked={contactType.isEmail}
                            />
                          }
                          label="Email"
                        />
                        <FormControlLabel
                          name="isPhone"
                          onChange={handleContactChange}
                          value={contactType.isPhone}
                          control={
                            <Checkbox
                              color="primary"
                              checked={contactType.isPhone}
                            />
                          }
                          label="Phone call"
                        />
                        <FormControlLabel
                          name="istext"
                          onChange={handleContactChange}
                          value={contactType.istext}
                          control={
                            <Checkbox
                              color="primary"
                              checked={contactType.istext}
                            />
                          }
                          label="Text Message"
                        />

                        <TextField
                          fullWidth
                          label={`Specify ${contactType.contactDataTitle}`}
                          margin="none"
                          name="contactData"
                          style={{ margin: "0px 0px" }}
                          onChange={handleChange}
                          required
                          value={formvalues.contactData}
                          variant="standard"
                        ></TextField>
                      </Grid>
                    </Grid>
                    <Grid item md={6} xs={12} className="attachmentContainer">
                      <Typography>
                        Attach any document to support ( e.g. a copy of the bill
                        in question, the insurance denial copy, insurance card,
                        denied claim, etc):
                      </Typography>
                      <>
                        <UploadFile
                          name="attach_billing_insurance_file"
                          fileResponse={fileResponseHandler}
                        />
                      </>
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
              <Divider />
            </Card>
          </form>
        </div>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            // type="submit"
            onClick={() => {
              setRequestType();
            }}
            startIcon={
              isLoading ? <CircularProgress color="secondary" size={20} /> : ""
            }
          >
            {!isLoading ? "Submit" : "Sending Request"}
          </Button>
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
    </StyledDiv>
  ) : (
    <PageNotFound />
  );
}
