import type { BaseSyntheticEvent } from "react";
import React, { useEffect, useState } from "react";
import { useDataProvider, useTranslate, useVersion } from "react-admin";
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
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router";
import RequestCreationQuery from "../../../queries/createAddendum/createAddendumQuery";
import type {
  CreateAddendumRecordsRequestMutation,
  CreateAddendumRecordsRequestMutationVariables,
  FileUploadInput,
} from "../../../__generated__/typescript-operations_all";
import CreatePageHeader from "../../../components/createPageHeader";
import AddPatient from "../../../components/addPatient";
import CardHeader from "../../../components/cardHeader";
import UploadFile from "../../../components/uploadFile";
import type {
  AppState,
  ICheckPatientValidatorProps,
  IFileResponse,
  IGenericType,
  IOrganization,
} from "../../../types";
import { useSelector } from "react-redux";
import createFileUploadQuery from "../../../queries/createFileUpload/createFileUploadQuery";
import { perPageMax } from "../../../utils/pageConstants";
import Upload from "../../../components/MedicalRecord";
import DoctorDetails from "./doctorDetails";
import {
  validateEmail,
  validateMRN,
  validateSentance,
  validateString,
} from "../../../utils/validator";
import {
  addPatientErrorMessages,
  ERROR_MESSAGE_KEY,
} from "../../../utils/messages/errorMessages";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import useTraces from "../../../hooks/useTraces";
import { correlationConstants } from "../../../utils/OT/correlationConstants";
import moment from "moment";
import { CREATE_ADDENDUM_REQUEST_ERROR_INIT } from "../../../utils/messages/initializeConstants";
import BaseModal from "../../../components/baseModal";
import { REQUEST_MESSAGES } from "../../../utils/messages/requestMessages";
import PageNotFound from "../../../components/pageNotFound";
import { CO_ROLE_PATIENT, CO_ROLE_PPA } from "../../../utils/roles";
import { Warning } from "@material-ui/icons";
const { REACT_APP_BASE_URL } = process.env;
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.light,
    marginTop: 20,
  },
  select: {
    minWidth: "40%",
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
}));

export default function CreateRequest(): JSX.Element {
  const version = useVersion();
  const [refreshCount, setRefreshCount] = React.useState(1);
  React.useEffect(() => {
    setRefreshCount(refreshCount + 1);
    if (refreshCount % 2 === 0) {
      window.location.reload();
    }
  }, [version]);
  const [doSubmit, setDoSubmit] = useState(true);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [openSubmitBase, setOpenSubmitBase] = useState(false);
  const [openBase, setOpenBase] = useState(false);
  const [openErrorBase, setOpenErrorBase] = useState(false);
  const today = moment(new Date()).format("YYYY-MM-DD");
  const classes = useStyles();
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const history = useHistory();
  const { getTrace, handleTrace } = useTraces();
  const [DOB, setDOB] = useState("");
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [alertAddPatient, setAlertAddPatient] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);
  const [formvalues, setFormvalues] = useStateWithCallbackLazy({
    domain: REACT_APP_BASE_URL + "/",
    requestPriority: 0,
    sourceInstitution: 4,
    assignedTo: "",
    attachment: null,
    image: null,
    hasSignedRequest: false,
    isRequestSupported: false,
    requester: userInfoReducer.id,
    servicedDate: today,
    department: "",
    mrn: "",
    list: [],
    changeRequest: "",
    provider: "",
    reason: "",
    representMail: "",
    representName: "",
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
  const [errorSet, setErrorSet] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [organizationList, setOrganizationList] = useState<IOrganization[]>([]);
  const [institutionList, setInstitutionList] = useState<IOrganization[]>([]);
  const [priorityList, setPriorityList] = useState<IGenericType[]>([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [assignToList, setAssignedList] = useState([]);
  const [uploadStack, setUploadStack] = useState({});
  const [arrStatus, setArrStatus] = useState(false);

  const addendumRecordRequest = document.getElementById(
    "addendumRecordRequest",
  );
  const [errorMsg, setErrorMsg] = useState(CREATE_ADDENDUM_REQUEST_ERROR_INIT);
  useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setEmailNotVerified(true);
    }
  }, []);
  const handleValidateOnBlur = (event: BaseSyntheticEvent): void => {
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
        case "servicedDate": {
          const valid =
            moment(event.target.value).isAfter(new Date()) ||
            moment(event.target.value).isBefore(DOB);
          setError(event.target.name, valid && ERROR_MESSAGE_KEY, valid);
          break;
        }
        case "provider": {
          const valid = validateString(event.target.value);
          setError(event.target.name, !valid && ERROR_MESSAGE_KEY, !valid);
          break;
        }
        case "changeRequest":
        case "reason": {
          const valid = validateSentance(event.target.value);
          setError(event.target.name, !valid && ERROR_MESSAGE_KEY, !valid);
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

  const setError = (
    fieldName: string,
    type: string,
    setError: boolean,
  ): void => {
    setErrorMsg((prevFormState) => ({
      ...prevFormState,
      [fieldName]: {
        0: setError,
        1: setError ? addPatientErrorMessages[fieldName][type] : "",
      },
    }));
  };

  useEffect(() => {
    if (addendumRecordRequest) {
      if (addendumRecordRequest.hidden === false) {
        getTrace(
          " Correction/Amendment Request Form loaded",
          "ev-065",
          userInfoReducer.email,
        );
      }
    }
  }, [addendumRecordRequest]);

  const handleValidate = (event: BaseSyntheticEvent): void => {
    event.persist();
    let validationStatus: boolean;
    if (event.target.type !== "checkbox") {
      validationStatus = !event.target.value;
    }
    if (validationStatus) {
      setEmailError(true);
    } else {
      const valid = validateEmail(event.target.value);
      if (valid === false) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
  };

  const handleChange = (event: BaseSyntheticEvent): void => {
    event.persist();

    if (
      event.target.name === "mrn" ||
      event.target.name === "provider" ||
      event.target.name === "servicedDate" ||
      event.target.name === "changeRequest" ||
      event.target.name === "reason"
    ) {
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
    } else if (event.target.name === "requestPriority") {
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
    } else if (event.target.name === "isRequestSupported") {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          [event.target.name]:
            event.target.type === "checkbox"
              ? event.target.checked
              : event.target.value,
        }),
        (curr) => {
          // set form

          if (curr.isRequestSupported === false) {
            setFormvalues(
              (prevFormState) => ({
                ...prevFormState,
                representName: "",
                representMail: "",
              }),
              () => {
                // set form
              },
            );
          }
        },
      );
    } else if (event.target.name === "hasSignedRequest") {
      if (event.target.value === "true") {
        errorMsg["ARR"][0] = false;
        errorMsg["ARR"][1] = "";
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
          // set form

          if (curr.hasSignedRequest === false) {
            delete uploadStack["upload_file_addendum_form"];
          }
        },
      );
    } else {
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
    if (event.target.name === "sourceInstitution") {
      const deptTemp = [];
      setAssignedList([]);
      organizationList.map((indv) => {
        if (indv.parentOrgId === event.target.value) {
          deptTemp.push(indv);
        }
      });
      setDepartmentList(deptTemp);
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          department: deptTemp.length > 0 ? deptTemp[0].id : "",
          assignedTo: null,
        }),
        () => {
          // set form
        },
      );
      getDepartmentHeadsId(deptTemp.length > 0 ? deptTemp[0].id : "");
    }
    if (event.target.name === "department") {
      setAssignedList([]);

      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          assignedTo: null,
        }),
        () => {
          // set form
        },
      );
      getDepartmentHeadsId(event.target.value);
    }
  };

  const getpatient = (patient): void => {
    setDOB(patient.patientDOB);
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
        //
      },
    );
  };
  const getDoctorDetail = (doctorDetail): void => {
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        list: doctorDetail.map((value) => ({
          name: value.name,
          phone: value.phone,
          institution: value.institution,
          address: value.address,
        })),
      }),
      () => {
        // set form
      },
    );
  };

  function getDepartmentHeadsId(organizationId): void {
    const queryDeptHeadOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "firstName", order: "ASC" },
      filter: { depId: organizationId },
    };
    dataProvider
      .getList("departmentHeadMasterDetailsV1", queryDeptHeadOption)
      .then(({ data }) => {
        if (data.length > 0) {
          getAssigned(data);
        }
      })
      .catch((error) => error);
  }

  function getAssigned(depHeads): void {
    const samArr = [];
    for (const key in depHeads) {
      samArr.push(depHeads[key]);
    }
    setAssignedList(samArr);
    if (depHeads[0].assignedPersonId) {
      setError("assignedTo", "empty", false);
    }
    setFormvalues(
      (prevFormState) => ({
        ...prevFormState,
        assignedTo: depHeads[0].assignedPersonId,
      }),
      () => {
        // set form
      },
    );
  }
  useEffect(() => {
    if (userInfoReducer.id) {
      setFormvalues(
        (prevFormState) => ({
          ...prevFormState,
          requester: userInfoReducer.id,
        }),
        () => {
          // set form
        },
      );
    }
  }, [userInfoReducer.id]);
  useEffect(() => {
    let mounted = true;
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "value", order: "ASC" },
      filter: {},
    };
    const queryOptionOrg = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "organizationName", order: "ASC" },
      filter: {},
    };

    function getOrganization(): void {
      dataProvider
        .getList("organizationMaster", queryOptionOrg)
        .then(({ data }) => {
          if (mounted) {
            const curOrg = [];
            setOrganizationList(data);
            const elseDept = [];
            for (const key in data) {
              if (data[key].parentOrgId === null) {
                curOrg.push(data[key]);
              } else {
                elseDept.push(data[key]);
              }
            }
            setInstitutionList(curOrg);
            setDepartmentList(
              elseDept.filter((indv) => indv.parentOrgId === curOrg[0].id),
            );
            const deptTemp = elseDept.filter(
              (indv) => indv.parentOrgId === curOrg[0].id,
            );
            getDepartmentHeadsId(deptTemp[0].id);
            setFormvalues(
              (prevFormState) => ({
                ...prevFormState,
                sourceInstitution: curOrg[0].id,
                department: deptTemp.length > 0 ? deptTemp[0].id : "",
                assignedTo: null,
              }),
              () => {
                // set form
              },
            );
          }
        })
        .catch((error) => error);
    }

    function getPriorityList(): void {
      dataProvider
        .getList("requestPriorityMasters", queryOption)
        .then(({ data }) => {
          if (mounted) {
            setPriorityList(data);
            setFormvalues(
              (prevFormState) => ({
                ...prevFormState,
                requestPriority: Number(data[0].id),
              }),
              () => {
                // set form
              },
            );
          }
        })
        .catch((error) => error);
    }

    getOrganization();
    getPriorityList();
    return () => {
      mounted = false;
    };
  }, [userInfoReducer]);
  let count = 0;
  const submitHandler = (): void => {
    setErrorUpload(false);
    let isRequestValid = true;
    if (!formvalues.hasSignedRequest) {
      setArrStatus(false);
    }
    if (!formvalues.assignedTo) {
      setError("assignedTo", "empty", true);
    } else {
      setError("assignedTo", "empty", false);
    }
    if (!formvalues.provider) {
      setError("provider", "empty", true);
    }
    if (!formvalues.changeRequest) {
      setError("changeRequest", "empty", true);
    }
    if (!formvalues.reason) {
      setError("reason", "empty", true);
    }
    Object.entries(errorMsg).forEach((indv) => {
      if (indv[1][0]) {
        isRequestValid = false;
      }
    });
    if (checkPatientValidation) {
      setAlertAddPatient(true);
    } else {
      setAlertAddPatient(false);
    }
    if (
      !checkPatientValidation &&
      formvalues.provider &&
      formvalues.servicedDate &&
      formvalues.changeRequest &&
      formvalues.reason &&
      formvalues.assignedTo &&
      isRequestValid
    ) {
      setErrorSet(false);
    }
    if (formvalues.hasSignedRequest && !arrStatus && !errorMsg["ARR"][0]) {
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["ARR"]: {
          0: true,
          1: "Please Attach Addendum Request Form",
        },
      }));
    }

    if (
      !doSubmit ||
      !formvalues.provider ||
      !formvalues.servicedDate ||
      !formvalues.changeRequest ||
      !formvalues.reason ||
      !formvalues.assignedTo ||
      departmentList.length === 0 ||
      !isRequestValid ||
      (formvalues.hasSignedRequest && !arrStatus)
    ) {
      setIsLoading(false);
      if (errorMsg.MRR[0] || errorMsg.ARR[0]) {
        setErrorUpload(true);
      } else if (formvalues.hasSignedRequest && !arrStatus) {
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
  const submitRequestConfirmed = (): void => {
    setIsLoading(true);
    setOpenBase(false);
    getTrace(
      "Data filled in Addendum Request",
      "ev-067",
      userInfoReducer.email,
    );
    if (Object.entries(uploadStack).length > 0) {
      Object.entries(uploadStack).forEach(async (indvUploadAct, key) => {
        await uploadFileMutation(
          uploadStack[indvUploadAct[0]],
          key,
          Object.entries(uploadStack).length,
        );
      });
    } else {
      mutationFunction(formvalues);
    }
  };

  const mutationFunction = (bodyData): void => {
    const eventObj = correlationConstants["ev-071"];
    const inputContext = {
      action: "Submit Addendum Request",
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
          name: "Attempt to submit Addendum Request Forml",
        });
        subscribeMutation({ variables: { input: bodyData } }).then(
          (addendumInsertionResponse) => {
            setIsLoading(false);
            setErrorSet(false);
            setErrorUpload(false);
            if (
              addendumInsertionResponse.data.createAddendumRecordsRequest
                .recordId
            ) {
              setOpenSubmitBase(true);
              getTrace(
                "Display 'Successfully created Addendum request'  message",
                "ev-072",
                userInfoReducer.email,
              );
            } else {
              setOpenErrorBase(true);
            }
          },
        );
      },
    ); //end of handletrace
  };

  async function uploadFileMutation(
    attachmentResponse: { response: any; name: string },
    key: number,
    leng: number,
  ): Promise<void> {
    try {
      if (attachmentResponse.response) {
        const fileUpload: FileUploadInput = {
          fileName: attachmentResponse.response,
          fileType: attachmentResponse.name || "",
        };
        await subscribeFileUploadMutation({
          variables: { input: { fileUpload: fileUpload } },
        }).then((res) => {
          if (res.data.createFileUpload.fileUpload.id) {
            setFormvalues(
              (prev) => ({
                ...prev,
                [attachmentResponse.name === "upload_file_addendum_form"
                  ? "attachment"
                  : "image"]: res.data.createFileUpload.fileUpload.id,
              }),
              (currentValue) => {
                count++;

                if (count === leng) {
                  mutationFunction(currentValue);
                }
              },
            );
          }
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  const [subscribeMutation] = useMutation<
    CreateAddendumRecordsRequestMutation,
    CreateAddendumRecordsRequestMutationVariables
  >(RequestCreationQuery, {});

  const [subscribeFileUploadMutation] = useMutation(createFileUploadQuery, {});

  const checkPatientValidator = ({
    isValid,
    isInit,
  }: ICheckPatientValidatorProps): void => {
    setCheckPatientValidation(isValid ? isValid : isInit);
    setDoSubmit(isValid);
  };

  const deleteImage = (): void => {
    delete uploadStack["upload_file_screenshot"];
  };
  const fileResponseHandler = (response: IFileResponse): void => {
    if (
      response.name === "upload_file_screenshot" &&
      response.response === ""
    ) {
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["MRR"]: {
          0: true,
          1: "Please Attach a Screenshot of Medical Record Request",
        },
      }));
    } else if (
      response.name === "upload_file_screenshot" &&
      response.response !== ""
    ) {
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["MRR"]: {
          0: false,
          1: "",
        },
      }));
    }
    if (
      response.name === "upload_file_addendum_form" &&
      formvalues.hasSignedRequest &&
      response.response === ""
    ) {
      setArrStatus(false);
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["ARR"]: {
          0: true,
          1: "",
        },
      }));
    } else if (
      response.name === "upload_file_addendum_form" &&
      formvalues.hasSignedRequest &&
      response.response !== ""
    ) {
      setArrStatus(true);
      setErrorMsg((prevFormState) => ({
        ...prevFormState,
        ["ARR"]: {
          0: false,
          1: "",
        },
      }));
    }
    if (response.name === "upload_file_screenshot") {
      getTrace(
        "Attach Screen shot of the Medical Record",
        "ev-068",
        userInfoReducer.email,
      );
    } else if (response.name === "upload_file_addendum_form") {
      getTrace(
        "Attach signed addendum request form.",
        "ev-069",
        userInfoReducer.email,
      );
    }

    setUploadStack((prev) => ({
      ...prev,
      [response.name]: response,
    }));
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
            REQUEST_MESSAGES["addendum"].confirmTitle +
            '"' +
            formvalues.pdr.firstName +
            " " +
            formvalues.pdr.lastName +
            '"'
          }
          content={REQUEST_MESSAGES["addendum"].confirmContent}
          successButtonName="Confirm"
        />
      )}
      {openSubmitBase && (
        <BaseModal
          open={openSubmitBase}
          confirmAction={() => {
            setOpenSubmitBase(false);
            if (userInfoReducer.role === CO_ROLE_PATIENT) {
              history.push("/myRequests");
            } else {
              history.push("/requests");
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
            REQUEST_MESSAGES["addendum"].successTitle[0] +
            '"' +
            formvalues.pdr.firstName +
            " " +
            formvalues.pdr.lastName +
            '"' +
            REQUEST_MESSAGES["addendum"].successTitle[1]
          }
          content={
            formvalues.hasSignedRequest
              ? REQUEST_MESSAGES["addendum"].successContent
              : REQUEST_MESSAGES["addendum"].successContentEmail
          }
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
              history.push("/myRequests");
            } else {
              history.push("/requests");
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
            REQUEST_MESSAGES["addendum"].errorTitle[0] +
            '"' +
            formvalues.pdr.firstName +
            " " +
            formvalues.pdr.lastName +
            '"' +
            REQUEST_MESSAGES["addendum"].errorTitle[1]
          }
          content={translate("resources.requests.notification.errorMessageMrr")}
          closeButtonName="Close"
          type="requestError"
        />
      )}
      <div
        id="addendumRecordRequest"
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
            subTitle="resources.addendumRequests.formSubtitle"
            mainTitle="resources.addendumRequests.formName"
          />
          <Card className={classes.root} id="addendum-patient-info">
            <CardContent>
              <CardHeader>
                <Typography
                  variant="h5"
                  style={{ fontSize: 16, fontWeight: 500 }}
                  gutterBottom
                >
                  <b>Patient Information:</b> The individual whose information
                  is to requested to be corrected/amended.
                </Typography>
              </CardHeader>
              <Grid container spacing={3} style={{ marginTop: "5px" }}>
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
                      onBlur={(e) => handleValidateOnBlur(e)}
                      error={errorMsg.mrn[0]}
                      helperText={errorMsg.mrn[0] ? errorMsg.mrn[1] : " "}
                    />
                  </Grid>
                </Grid>
                <AddPatient
                  checkPatientValidator={(
                    checkPatientValidatorProps: ICheckPatientValidatorProps,
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
          <Card className={classes.root} id="addendum-description">
            <CardContent>
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
                <div style={{ marginTop: "40px", marginBottom: "30px" }}>
                  <Grid
                    alignItems="flex-end"
                    container
                    justifyContent="space-between"
                    spacing={3}
                  >
                    {" "}
                    <Grid
                      item
                      md={12}
                      xs={12}
                      style={{ display: "inline-flex", width: "100%" }}
                    >
                      <InputLabel>I,</InputLabel>
                      <TextField
                        fullWidth
                        label="Patient Name"
                        margin="none"
                        name="patient"
                        style={{
                          fontSize: "14px",
                          width: "50%",
                          margin: "-25px 10px 0",
                        }}
                        required
                        value={
                          formvalues.pdr.firstName
                            ? `${formvalues.pdr.firstName} ${formvalues.pdr.lastName}`
                            : ""
                        }
                        variant="standard"
                      ></TextField>
                      <InputLabel>
                        , request a change to my record(s) for my visit to{" "}
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
                        label="Physician Name"
                        margin="none"
                        name="provider"
                        onChange={handleChange}
                        required
                        value={formvalues.provider}
                        style={{ margin: "-15px 0px 0px" }}
                        variant="standard"
                        onBlur={(e) => handleValidateOnBlur(e)}
                        error={errorMsg.provider[0]}
                        helperText={
                          errorMsg.provider[0] ? errorMsg.provider[1] : " "
                        }
                      />
                      <TextField
                        fullWidth
                        label="Clinic name"
                        margin="none"
                        name="sourceInstitution"
                        style={{ fontSize: "14px", margin: "-15px 0px 0px" }}
                        onChange={handleChange}
                        required
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        value={formvalues.sourceInstitution}
                        variant="standard"
                      >
                        {institutionList.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.organizationName}
                          </option>
                        ))}
                      </TextField>
                      <TextField
                        fullWidth
                        label="Department"
                        margin="none"
                        name="department"
                        onChange={handleChange}
                        style={{ fontSize: "14px", margin: "-15px 0px 0px" }}
                        required
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        value={formvalues.department}
                        variant="standard"
                      >
                        {departmentList.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.organizationName}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid
                      item
                      md={12}
                      xs={12}
                      style={{ display: "inline-flex", width: "100%" }}
                    >
                      <TextField
                        fullWidth
                        required
                        label="Assigned To"
                        margin="none"
                        name="assignedTo"
                        onChange={handleChange}
                        style={{
                          fontSize: "14px",
                          width: "150px",
                          margin: "-15px 0px 0px",
                        }}
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        value={formvalues.assignedTo}
                        variant="standard"
                        onBlur={(e) => handleValidateOnBlur(e)}
                        error={errorMsg.assignedTo[0]}
                        helperText={
                          errorMsg.assignedTo[0] ? errorMsg.assignedTo[1] : " "
                        }
                      >
                        {assignToList.map((option) => (
                          <option
                            key={option.assignedPersonId}
                            value={option.assignedPersonId}
                          >
                            {option.firstName} {option.middleName}{" "}
                            {option.lastName}
                          </option>
                        ))}
                      </TextField>
                      <InputLabel style={{ marginTop: "10px" }}>
                        on the following date(s) of service:{" "}
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="none"
                        id="servicedDate"
                        style={{
                          fontSize: "14px",
                          width: "20%",
                          margin: "-15px 10px 0px",
                        }}
                        label="Date"
                        type="date"
                        required
                        name="servicedDate"
                        onChange={handleChange}
                        value={formvalues.servicedDate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onBlur={(e) => handleValidateOnBlur(e)}
                        error={errorMsg.servicedDate[0]}
                        helperText={
                          errorMsg.servicedDate[0]
                            ? errorMsg.servicedDate[1]
                            : " "
                        }
                        inputProps={{ min: DOB, max: today }}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <InputLabel style={{ marginTop: "10px" }}>
                        I request the following change to be made:<sup>*</sup>{" "}
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="outlined-multiline-static"
                        multiline
                        required
                        value={formvalues.changeRequest}
                        name="changeRequest"
                        onBlur={(e) => handleValidateOnBlur(e)}
                        onChange={handleChange}
                        error={errorMsg.changeRequest[0]}
                        helperText={
                          errorMsg.changeRequest[0]
                            ? errorMsg.changeRequest[1]
                            : " "
                        }
                        style={{ marginTop: "20px" }}
                        rows={4}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <InputLabel style={{ marginTop: "10px" }}>
                        I request the change because:<sup>*</sup>{" "}
                      </InputLabel>
                      <TextField
                        fullWidth
                        id="outlined-multiline-static"
                        multiline
                        required
                        name="reason"
                        value={formvalues.reason}
                        onChange={handleChange}
                        onBlur={(e) => handleValidateOnBlur(e)}
                        style={{ marginTop: "20px" }}
                        rows={4}
                        error={errorMsg.reason[0]}
                        helperText={
                          errorMsg.reason[0] ? errorMsg.reason[1] : " "
                        }
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <FormControlLabel
                        name="isRequestSupported"
                        onChange={handleChange}
                        value={formvalues.isRequestSupported}
                        control={
                          <Checkbox
                            color="primary"
                            defaultChecked={formvalues.isRequestSupported}
                          />
                        }
                        label="Would you like the response to be sent to a representative email address?"
                      />
                    </Grid>
                    {formvalues.isRequestSupported && (
                      <Grid
                        item
                        md={12}
                        style={{ width: "100%", display: "inline-flex" }}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          margin="dense"
                          id="repName"
                          required
                          name="representName"
                          value={formvalues.representName}
                          onChange={handleChange}
                          style={{ fontSize: "14px" }}
                          label="Representative Name"
                          variant="standard"
                        />
                        <TextField
                          fullWidth
                          margin="dense"
                          id="repMail"
                          name="representMail"
                          required
                          onChange={handleChange}
                          onBlur={handleValidate}
                          style={{ fontSize: "14px" }}
                          label="Representative email"
                          value={formvalues.representMail}
                          variant="standard"
                          helperText={emailError && "Enter valid email"}
                          error={emailError}
                        />
                      </Grid>
                    )}
                    <Grid item md={6} xs={12}>
                      <InputLabel>
                        Priority<sup>*</sup>
                      </InputLabel>
                      <TextField
                        fullWidth
                        margin="dense"
                        name="requestPriority"
                        onChange={handleChange}
                        required
                        style={{ fontSize: "14px" }}
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}
                        value={formvalues.requestPriority}
                        variant="standard"
                      >
                        {priorityList.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.value}
                          </option>
                        ))}
                      </TextField>

                      <Grid item md={12} xs={12}>
                        <InputLabel
                          style={{ marginTop: "20px", marginBottom: "20px" }}
                        >
                          Attach a screenshot or copy of the medical record
                        </InputLabel>
                        <Upload
                          name="screenshot"
                          fileResponse={fileResponseHandler}
                          deleteImage={deleteImage}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
                <DoctorDetails getContact={getDoctorDetail}></DoctorDetails>
              </form>
            </CardContent>
          </Card>

          <Card className={classes.root} id="addendum-form-attach">
            <CardContent>
              <Grid
                alignItems="flex-end"
                container
                justifyContent="space-between"
                spacing={2}
              >
                <Grid item md={12} xs={12}>
                  <Typography
                    component="h2"
                    gutterBottom
                    variant="h5"
                    style={{ fontSize: 16, fontWeight: 500 }}
                  >
                    {translate("resources.addendumRequests.formName")}
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControlLabel
                    name="hasSignedRequest"
                    value={formvalues.hasSignedRequest}
                    onChange={handleChange}
                    control={
                      <Checkbox
                        color="primary"
                        defaultChecked={formvalues.hasSignedRequest}
                      />
                    }
                    label="Has a signed addendum request been submitted?"
                  />
                </Grid>
                <Grid item md={4} xs={12} className="attachmentContainer">
                  {errorMsg["ARR"][0] ? (
                    <Typography
                      style={{ color: "red", textTransform: "capitalize" }}
                    >
                      {errorMsg["ARR"][1]}
                    </Typography>
                  ) : (
                    " "
                  )}
                  {formvalues.hasSignedRequest ? (
                    <UploadFile
                      name="addendum_form"
                      fileResponse={fileResponseHandler}
                    />
                  ) : (
                    <Typography gutterBottom>
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <Warning
                          style={{ marginRight: "8px", color: "orange" }}
                        />
                        A addendum request form will be sent via above email.
                      </span>
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              submitHandler();
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
  ) : (
    <PageNotFound />
  );
}
