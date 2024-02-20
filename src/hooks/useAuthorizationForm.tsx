import type { BaseSyntheticEvent } from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core";
import type {
  AppState,
  IAlreadyLoggedIn,
  IAuthorizationProps,
  IFileResponse,
  IGenericType,
  IRequestPayload,
} from "../types";
import {
  useDataProvider,
  useLogin,
  useNotify,
  useTranslate,
} from "react-admin";
import { CO_NAME_GUEST, CO_ROLE_GUEST, CO_ROLE_PATIENT } from "../utils/roles";
import { useMutation } from "@apollo/react-hooks";
import createFileUploadQuery from "../queries/createFileUpload/createFileUploadQuery";
import updateRequestFiledetail from "../queries/updateRequestFiledetail/updateRequestFiledetail";
import updateRequestToken from "../queries/updateRequestToken/updateRequestToken";
import createHealthInformationAuthorizationQuery from "../queries/createHealthInformationAuthorization/createHealthInformationAuthorizationQuery";
import createSubstanceUseDisorderAuthorizationQuery from "../queries/createSubstanceUseDisorderAuthorization/createSubstanceUseDisorderAuthorizationQuery";

import { useSelector } from "react-redux";
import { perPageMax } from "../utils/pageConstants";
import type {
  CreateHealthInformationAuthorizationInput,
  CreateSubstanceUseDisorderAuthorizationInput,
  FileUploadInput,
  UpdateRequestFiledetailV1Input,
  UpdateRequestTokensInput,
} from "../__generated__/typescript-operations_all";
import { validateString } from "../utils/validator";
import {
  addAuthFormErrorMessages,
  ERROR_MESSAGE_KEY,
} from "../utils/messages/errorMessages";
import moment from "moment";
import b64toBlob from "../utils/images/b64toBlob";
import { blobToFile } from "../utils/images/blobToFile";
import useTraces from "./useTraces";
import { AUTH_FORM_ERROR_INIT } from "../utils/messages/initializeConstants";
import secureLocalStorage from "react-secure-storage";
import { useHistory } from "react-router";
interface IRequestToken {
  token?: string;
  requestId?: string;
  requestTokenId?: string;
  isFilled?: boolean;
  patientId?: string;
  authFormType?: number;
  trackId?: string;
  createdBy?: string;
}
const { REACT_APP_GUEST_USERNAME, REACT_APP_GUEST_PASSWORD } = process.env;
const useAuthorizationForm = ({ formType, token }: IAuthorizationProps) => {
  const login = useLogin();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const { getTrace } = useTraces();
  const history = useHistory();
  const translate = useTranslate();
  const userRoleInfo = useSelector(
    (state: AppState) => state.userRoleInfoReducer,
  );
  const userInfo = useSelector((state: AppState) => state.userInfoReducer);
  const [uploadStack, setUploadStack] = useState({});
  const [errorSet, setErrorSet] = useState(AUTH_FORM_ERROR_INIT);
  const [successAck, setSuccessAck] = useState(false);
  const [legalIdResponse, setLegalIdResponse] = useState<IFileResponse>({});
  const [requestToken, setRequestToken] = useState<IRequestToken>({});
  const [authTokenValidity, setAuthTokenValidity] = useState(false);
  const [requestDetails, setRequestDetails] = useState<IRequestPayload>({});
  const [authTitle, setAuthTitle] = useState<IGenericType[]>([]);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState<IAlreadyLoggedIn>({
    alreadyThere: localStorage.getItem("authState") == "true" ? true : false,
    userName: localStorage.getItem("User") || CO_NAME_GUEST,
    role: secureLocalStorage.getItem("role")
      ? String(secureLocalStorage.getItem("role"))
      : CO_ROLE_GUEST,
    email: userInfo ? userInfo.email : "",
  });
  const [disableAuthExpires, setDisableAuthExpires] = useState(true);

  const [authExpiresOrNot, setAuthExpiresOrNot] = useState(
    "is_valid_after_death",
  );

  const [signature, setSignature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOther, setShowOther] = useState(false);

  const [showProviderOther, setShowProviderOther] = useState(false);
  const [errorsubmit, setErrorSubmit] = useState({
    status: false,
    message: "",
  });
  const [patientRepErr, setPatientRepErr] = useState(false);
  const [patientRelationStatus, setpatientRelationStatus] = useState(false);

  const [toDisable, setToDisable] = useState(true);
  const [bodyData, setbodyData] = useState({
    authorization_title: 0,
    authorization_expire_event: "",
    authorization_expire_date: "",
    authorization_others: "",
    authorization_service_providers_others: "",
    time_period_from: "",
    time_period_to: "",
    authorization_service_providers_type: 1,
    disorder_treatment_program: "",
    receive_person: "",
    purpose: "",
    is_valid_after_death: false,
    signature: "",
    patientRepresentative: "",
    patientRelation: null,
    legalId: null,
  });
  const [subscribeUpdateRequestTokenMutation] = useMutation(
    updateRequestToken,
    {},
  );
  const [subscribeFileUploadMutation] = useMutation(createFileUploadQuery, {});
  const [subscribeUpdateMutation] = useMutation(updateRequestFiledetail, {});
  const [subscribeHipaaMutation] = useMutation(
    createHealthInformationAuthorizationQuery,
    {},
  );
  const [subscribeSudMutation] = useMutation(
    createSubstanceUseDisorderAuthorizationQuery,
    {},
  );
  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
      },
      backgroundColor: "#FFFFFF",
    },
    fullWidth: {
      marginBottom: theme.spacing(1),
      width: "100%",
    },
    fields: {
      margin: theme.spacing(-1),
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        flexGrow: 1,
        margin: theme.spacing(1),
      },
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
    subHead: {
      background: "#fafafa",
      padding: "5px 10px",
      marginBottom: "0px",
      fontWeight: 600,
      fontSize: "16px",
    },
    label: {
      fontWeight: "bold",
      fontSize: "13px",
    },
    rootLabel: {
      marginLeft: "0px",
      marginRight: "0px",
    },
  }));
  const queryOption = {
    pagination: { page: 1, perPage: perPageMax },
    sort: { field: "id", order: "ASC" },
    filter: {},
  };
  const fileResponseHandler = (response: IFileResponse) => {
    setLegalIdResponse(response);
    getTrace("Upload legal id in HIPAA form", "ev-106", userInfo.email);
    setUploadStack((prev) => ({
      ...prev,
      [response.name]: response,
    }));
  };
  function getTitle() {
    dataProvider
      .getList(
        formType === "hipaa"
          ? "healthAuthAuthorizationTitleMasters"
          : "useDisorderAuthorizationTitleMasters",
        queryOption,
      )
      .then(({ data }) => {
        setAuthTitle(data);
        setbodyData((prevFormState) => ({
          ...prevFormState,
          authorization_title: Number(data[0].id),
        }));
      })
      .catch((error) => error);
  }

  function getRequestDetails(requestUuid: string) {
    const queryOptionForToken = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: { id: requestUuid },
    };
    dataProvider
      .getList("requests", queryOptionForToken)
      .then(({ data }) => {
        setRequestDetails((prevFormState) => ({
          ...prevFormState,
          createdfname: String(data[0].createdfname),
          createdlastname: String(data[0].createdlastname),
          // createdmname: String(data[0].createdmname),
          firstName: String(data[0].firstName),
          lastName: String(data[0].lastName),
          middleName: data[0].middleName ? String(data[0].middleName) : "",
          persontype: Number(data[0].persontype),
        }));
      })
      .catch((error) => error);
  }

  function getRequestTokenByToken() {
    const queryOptionForToken = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: { token },
    };
    dataProvider
      .getList("requestTokenV1s", queryOptionForToken)
      .then(({ data }) => {
        getRequestDetails(data[0].requestId);
        setRequestToken((prevFormState) => ({
          ...prevFormState,
          token: String(data[0].token),
          requestId: data[0].requestId,
          isFilled: data[0].isFilled,
          patientId: data[0].partyId,
          trackId: data[0].trackId,
          requestTokenId: String(data[0].id),
          authFormType: Number(data[0].authFormType),
          createdBy: data[0].createdBy,
        }));
        if (formType === "hipaa" && Number(data[0].authFormType) === 1) {
          setAuthTokenValidity(true);
        } else if (formType === "sud" && Number(data[0].authFormType) === 2) {
          setAuthTokenValidity(true);
        } else {
          setAuthTokenValidity(false);
        }
      })
      .catch((error) => error);
  }
  function doLogin() {
    login(
      {
        username: REACT_APP_GUEST_USERNAME,
        password: REACT_APP_GUEST_PASSWORD,
      },
      token,
    )
      .then(() => {
        setAlreadyLoggedIn((prevFormState: IAlreadyLoggedIn) => ({
          ...prevFormState,
          alreadyThere: false,
        }));
        getTitle();
        getRequestTokenByToken();
      })
      .catch(() => {
        notify(translate(`auth.messages.access_denied`), { type: "warning" });
      });
  }
  const alreadyConfirmation = () => {
    localStorage.setItem("Loggedout", "true");
    localStorage.setItem("User", CO_NAME_GUEST);
    doLogin();
  };

  const handleValidateOnBlur = (event: BaseSyntheticEvent) => {
    event.persist();
    let validationStatus: boolean;
    if (event.target.type !== "checkbox") {
      validationStatus = !event.target.value;
    }
    if (!validationStatus) {
      switch (event.target.name) {
        case "authorization_others":
        case "authorization_service_providers_others":
        case "disorder_treatment_program":
        case "receive_person":
        case "purpose":
        case "authorization_expire_event": {
          const valid = validateString(event.target.value);
          setError(event.target.name, !valid && ERROR_MESSAGE_KEY, !valid);
          break;
        }
        case "time_period_from": {
          const valid =
            moment(event.target.value).isBefore(new Date()) ||
            moment(event.target.value).isAfter(bodyData.time_period_to);
          setError(event.target.name, !valid && ERROR_MESSAGE_KEY, !valid);
          break;
        }
        case "time_period_to": {
          const valid =
            moment(event.target.value).isAfter(new Date()) ||
            moment(event.target.value).isBefore(bodyData.time_period_from);
          setError(event.target.name, valid && ERROR_MESSAGE_KEY, valid);
          break;
        }
        case "authorization_expire_date": {
          const valid = moment(event.target.value).isAfter(new Date());
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
      switch (event.target.name) {
        case "authorization_expire_event": {
          const valid = !!bodyData.authorization_expire_date;
          if (!valid) setError(event.target.name, !valid && "empty", !valid);
          break;
        }
        case "authorization_expire_date": {
          const valid = !!bodyData.authorization_expire_event;
          if (!valid) setError(event.target.name, !valid && "empty", !valid);
          break;
        }
        default: {
          setError(event.target.name, "empty", true);
          break;
        }
      }
    }
  };

  const setError = (fieldName: string, type: string, setError: boolean) => {
    setErrorSet((prevFormState) => ({
      ...prevFormState,
      [fieldName]: {
        0: setError,
        1: setError ? addAuthFormErrorMessages[fieldName][type] : "",
      },
    }));
  };

  const validate = (fileId: string) => {
    if (formType === "hipaa") {
      const createHealthInformationAuthorizationInput: CreateHealthInformationAuthorizationInput =
        {
          authorizationExpireEvent: bodyData.authorization_expire_event,
          authorizationOthers: bodyData.authorization_others,
          authorizationServiceProvidersOthers:
            bodyData.authorization_service_providers_others,
          authorizationServiceProvidersType: Number(
            bodyData.authorization_service_providers_type,
          ),
          endTo: new Date(bodyData.time_period_to),
          expiryDate: bodyData.authorization_expire_date
            ? new Date(bodyData.authorization_expire_date)
            : null,
          healthAuthAuthorizationTitleId: Number(bodyData.authorization_title),
          image: null,
          isValidAfterDeath: bodyData.is_valid_after_death,
          others: "",
          patientId: requestToken.patientId,
          purpose: bodyData.purpose,
          receivePerson: bodyData.receive_person,
          mrrRequestId: requestToken.requestId,
          signatureFile: fileId,
          startFrom: new Date(bodyData.time_period_from),
          patientRepresentative: bodyData.patientRepresentative,
          patientRelation: bodyData.patientRelation,
          legalId: bodyData.legalId,
        };
      subscribeHipaaMutation({
        variables: { input: createHealthInformationAuthorizationInput },
      }).then((res) => {
        if (res.data) {
          updateRequest(
            res.data?.createHealthInformationAuthorization.recordId,
          );
        }
      });
    } else {
      const createSubstanceUseDisorderAuthorizationInput: CreateSubstanceUseDisorderAuthorizationInput =
        {
          authorizationExpireEvent: bodyData.authorization_expire_event,
          authorizationOthers: bodyData.authorization_others,
          authorizationServiceProvidersOthers:
            bodyData.authorization_service_providers_others,
          authorizationServiceProvidersType: Number(
            bodyData.authorization_service_providers_type,
          ),
          endTo: new Date(bodyData.time_period_to),
          expiryDate: bodyData.authorization_expire_date
            ? new Date(bodyData.authorization_expire_date)
            : null,
          image: null,
          others: "",
          patientId: requestToken.patientId,
          purpose: bodyData.purpose,
          receivePerson: bodyData.receive_person,
          mrrRequestId: requestToken.requestId,
          signatureFile: fileId,
          startFrom: new Date(bodyData.time_period_from),
          disorderTreatmentProgram: bodyData.disorder_treatment_program,
          useDisorderAuthorizationTitleId: Number(bodyData.authorization_title),
          patientRepresentative: bodyData.patientRepresentative,
          patientRelation: bodyData.patientRelation,
        };
      subscribeSudMutation({
        variables: { input: createSubstanceUseDisorderAuthorizationInput },
      }).then((res) => {
        if (res.data) {
          updateRequest(
            res.data?.createSubstanceUseDisorderAuthorization.recordId,
          );
        }
      });
    }
  };

  const updateRequest = (formId: string) => {
    const updateRequestFiledetailInput: UpdateRequestFiledetailV1Input = {
      requestIid: requestToken.requestId,
      disorderDisclosureAuthorizationFileId:
        formType !== "hipaa" ? formId : null,
      hipaaAuthorizationFileId: formType === "hipaa" ? formId : null,
    };
    subscribeUpdateMutation({
      variables: { input: updateRequestFiledetailInput },
    }).then((res) => {
      if (res.data) {
        updateRequestTokened();
      }
    });
  };
  const updateRequestTokened = () => {
    const updateRequestTokenInput: UpdateRequestTokensInput = {
      hasFilled: true,
      requestTokenId: requestToken.requestTokenId,
    };
    subscribeUpdateRequestTokenMutation({
      variables: { input: updateRequestTokenInput },
    }).then((res) => {
      if (res.data) {
        setSuccessAck(true);
        if (alreadyLoggedIn.role === CO_ROLE_PATIENT) {
          notify(translate(`auth.messages.successfully_filled`), {
            type: "success",
          });
          if (requestToken.createdBy === userInfo.id) {
            history.push("/myRequests/" + requestToken.trackId + "/overview");
          } else {
            history.push(
              "/requestsOnBehalf/" + requestToken.trackId + "/overview",
            );
          }
        }
      }
    });
  };

  async function uploadFileMutation(attachmentResponse: {
    response: any;
    name: string;
  }) {
    if (attachmentResponse.response) {
      const fileUpload: FileUploadInput = {
        fileName: attachmentResponse.response,
        fileType: attachmentResponse.name || "",
      };
      await subscribeFileUploadMutation({
        variables: { input: { fileUpload: fileUpload } },
      }).then((res) => {
        if (res.data.createFileUpload.fileUpload.id) {
          bodyData.legalId = res.data.createFileUpload.fileUpload.id;
        }
        const block = encodeURI(signature).split(";");
        const contentType = block[0].split(":")[1];
        const realData = block[1].split(",")[1];
        const blob = b64toBlob(realData, contentType);

        const fileFromBlob = blobToFile(blob, "feedback.png");
        const fileUpload: FileUploadInput = {
          fileName: fileFromBlob,
          fileType: "upload_file_signature",
        };
        subscribeFileUploadMutation({
          variables: { input: { fileUpload: fileUpload } },
        }).then((res) => {
          if (res.data) {
            if (formType === "hipaa") {
              getTrace(
                "Upload Signature in HIPAA form",
                "ev-107",
                userInfo.email,
              );
            } else {
              getTrace(
                "Upload Signature in SUD form",
                "ev-110",
                userInfo.email,
              );
            }
            validate(res.data?.createFileUpload.fileUpload.id);
          }
        });
      });
    }
  }
  const submitWithErrorMandatoryHipaa = (): boolean => {
    return (
      patientRepErr ||
      !bodyData.purpose ||
      !bodyData.receive_person ||
      !bodyData.time_period_from ||
      !bodyData.time_period_to ||
      (authExpiresOrNot === "authExpires" &&
        !bodyData.authorization_expire_date &&
        !bodyData.authorization_expire_event)
    );
  };
  const submitWithErrorHipaa = (): boolean => {
    return (
      errorSet.authorization_service_providers_others[1] !== "" ||
      errorSet.purpose[1] !== "" ||
      errorSet.authorization_expire_event[1] !== "" ||
      errorSet.authorization_others[1] !== "" ||
      errorSet.receive_person[1] !== "" ||
      errorSet.time_period_from[1] !== "" ||
      errorSet.time_period_to[1] !== "" ||
      errorSet.authorization_expire_date[1] !== "" ||
      (bodyData.patientRepresentative !== "" && bodyData.patientRelation === 0)
    );
  };
  const submitWithMandatoryErrorSud = (): boolean => {
    return (
      !bodyData.disorder_treatment_program ||
      (!bodyData.authorization_expire_date &&
        !bodyData.authorization_expire_event) ||
      !bodyData.purpose ||
      !bodyData.receive_person ||
      !bodyData.time_period_from ||
      !bodyData.time_period_to
    );
  };
  const submitWithErrorSud = (): boolean => {
    return (
      patientRepErr ||
      errorSet.disorder_treatment_program[1] !== "" ||
      errorSet.purpose[1] !== "" ||
      errorSet.authorization_expire_event[1] !== "" ||
      errorSet.authorization_others[1] !== "" ||
      errorSet.receive_person[1] !== "" ||
      errorSet.time_period_from[1] !== "" ||
      errorSet.time_period_to[1] !== "" ||
      errorSet.authorization_expire_date[1] !== "" ||
      (bodyData.patientRepresentative !== "" && bodyData.patientRelation === 0)
    );
  };
  const handleChange = (event) => {
    event.persist();
    if (event.target.name === "time_period_from") {
      setToDisable(false);
    }
    if (event.target.name === "authorization_expire_event") {
      setError("authorization_expire_date", "empty", false);
      bodyData.authorization_expire_date = "";
    }
    if (event.target.name === "authorization_expire_date") {
      setError("authorization_expire_event", "empty", false);
      bodyData.authorization_expire_event = "";
    }

    if (event.target.name === "authExpiresOrNot") {
      setAuthExpiresOrNot(event.target.value);
      if (event.target.value === "is_valid_after_death") {
        setError("authorization_expire_event", "", false);
        setError("authorization_expire_date", "", false);
        setDisableAuthExpires(true);
        setbodyData((prevFormState) => ({
          ...prevFormState,
          is_valid_after_death: true,
          authorization_expire_event: "",
          authorization_expire_date: "",
        }));
      } else if (event.target.value === "authExpires") {
        setDisableAuthExpires(false);
        setbodyData((prevFormState) => ({
          ...prevFormState,
          is_valid_after_death: false,
        }));
      }
    } else {
      if (event.target.name === "authorization_title") {
        if (Object.entries(authTitle).length > 0) {
          let code = "";
          for (const key in authTitle) {
            if (authTitle[key].id === JSON.parse(event.target.value)) {
              code = authTitle[key].code;
            }
          }
          if (code.length > 0) {
            if (code.includes("Others")) {
              setShowOther(true);
            } else {
              setShowOther(false);
            }
          }
        }
      } else if (event.target.name === "authorization_service_providers_type") {
        if (JSON.parse(event.target.value) === 2) {
          setShowProviderOther(true);
        } else {
          setShowProviderOther(false);
        }
      }
      setbodyData((prevFormState) => ({
        ...prevFormState,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      }));
    }
  };

  const setRepresentative = (val) => {
    setPatientRepErr(val.error);
    setbodyData((prevFormState) => ({
      ...prevFormState,
      patientRepresentative: val.patientRepresentative,
      patientRelation: Number(val.patientRelation),
    }));
  };

  const getSign = (val) => {
    setSignature(val);
  };

  const onSubmit = () => {
    if (formType === "hipaa") {
      if (bodyData.patientRepresentative !== "") {
        if (bodyData.patientRelation === 0) {
          setpatientRelationStatus(true);
        } else {
          setpatientRelationStatus(false);
        }
      } else {
        setpatientRelationStatus(false);
      }
      if (submitWithErrorMandatoryHipaa()) {
        if (!bodyData.purpose) {
          setError("purpose", "empty", true);
        }
        if (!bodyData.receive_person) {
          setError("receive_person", "empty", true);
        }
        if (!bodyData.time_period_from) {
          setError("time_period_from", "empty", true);
        }
        if (!bodyData.time_period_to) {
          setError("time_period_to", "empty", true);
        }
        if (
          !bodyData.authorization_expire_event &&
          authExpiresOrNot === "authExpires"
        ) {
          setError("authorization_expire_event", "empty", true);
        }
        if (
          !bodyData.authorization_expire_date &&
          authExpiresOrNot === "authExpires"
        ) {
          setError("authorization_expire_date", "empty", true);
        }
        setErrorSubmit({
          status: true,
          message: translate("auth.errors.unfilledMandatoryError"),
        });
      } else if (submitWithErrorHipaa()) {
        setErrorSubmit({
          status: true,
          message: translate("auth.errors.filledMandatoryError"),
        });
      } else if (!legalIdResponse.name) {
        setErrorSubmit({
          status: true,
          message: translate("auth.errors.legalidError"),
        });
      } else if (!signature) {
        setErrorSubmit({
          status: true,
          message: translate("auth.errors.signError"),
        });
      } else {
        if (bodyData.patientRelation === 0) {
          bodyData.patientRelation = null;
        }
        setIsLoading(true);
        const block = encodeURI(signature).split(";");
        const contentType = block[0].split(":")[1];
        const realData = block[1].split(",")[1];
        const blob = b64toBlob(realData, contentType);

        setErrorSubmit({
          status: false,
          message: "",
        });
        const fileFromBlob = blobToFile(blob, "feedback.png");
        const fileUpload: FileUploadInput = {
          fileName: fileFromBlob,
          fileType: "upload_file_signature",
        };
        if (Object.entries(uploadStack).length > 0) {
          Object.entries(uploadStack).forEach(async (indvUploadAct) => {
            await uploadFileMutation(uploadStack[indvUploadAct[0]]);
          });
        } else {
          subscribeFileUploadMutation({
            variables: { input: { fileUpload: fileUpload } },
          }).then((res) => {
            if (res.data) {
              validate(res.data?.createFileUpload.fileUpload.id);
            }
          });
        }
      }
    } else if (formType === "sud") {
      if (bodyData.patientRepresentative !== "") {
        if (bodyData.patientRelation === 0) {
          setpatientRelationStatus(true);
        } else {
          setpatientRelationStatus(false);
        }
      } else {
        setpatientRelationStatus(false);
      }
      if (submitWithMandatoryErrorSud()) {
        if (!bodyData.disorder_treatment_program) {
          setError("disorder_treatment_program", "empty", true);
        }
        if (!bodyData.purpose) {
          setError("purpose", "empty", true);
        }
        if (!bodyData.receive_person) {
          setError("receive_person", "empty", true);
        }
        if (!bodyData.time_period_from) {
          setError("time_period_from", "empty", true);
        }
        if (!bodyData.time_period_to) {
          setError("time_period_to", "empty", true);
        }
        if (
          !bodyData.authorization_expire_date &&
          !bodyData.authorization_expire_event
        ) {
          setError("authorization_expire_event", "empty", true);
          setError("authorization_expire_date", "empty", true);
        }
        setErrorSubmit({
          status: true,
          message: translate("auth.errors.unfilledMandatoryError"),
        });
      } else if (submitWithErrorSud()) {
        setErrorSubmit({
          status: true,
          message: translate("auth.errors.filledMandatoryError"),
        });
      } else if (!signature) {
        setErrorSubmit({
          status: true,
          message: translate("auth.errors.signError"),
        });
      } else {
        if (bodyData.patientRelation === 0) {
          bodyData.patientRelation = null;
        }
        setIsLoading(true);
        const block = encodeURI(signature).split(";");
        const contentType = block[0].split(":")[1];
        const realData = block[1].split(",")[1];
        const blob = b64toBlob(realData, contentType);
        setErrorSubmit({
          status: false,
          message: "",
        });
        const fileFromBlob = blobToFile(blob, "feedback.png");
        const fileUpload: FileUploadInput = {
          fileName: fileFromBlob,
          fileType: "upload_file_signature",
        };
        subscribeFileUploadMutation({
          variables: { input: { fileUpload: fileUpload } },
        }).then((res) => {
          if (res.data) {
            validate(res.data?.createFileUpload.fileUpload.id);
          }
        });
      }
    }
  };
  return {
    useStyles,
    fileResponseHandler,
    uploadStack,
    legalIdResponse,
    doLogin,
    userRoleInfo,
    alreadyLoggedIn,
    bodyData,
    setbodyData,
    getTitle,
    getRequestTokenByToken,
    setAlreadyLoggedIn,
    userInfo,
    authTitle,
    requestToken,
    notify,
    authTokenValidity,
    requestDetails,
    alreadyConfirmation,
    updateRequestTokened,
    successAck,
    handleChange,
    showOther,
    handleValidateOnBlur,
    errorSet,
    toDisable,
    showProviderOther,
    authExpiresOrNot,
    disableAuthExpires,
    setRepresentative,
    getSign,
    onSubmit,
    errorsubmit,
    isLoading,
    patientRelationStatus,
    setpatientRelationStatus,
  };
};

export default useAuthorizationForm;
