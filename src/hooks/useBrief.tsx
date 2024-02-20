import type { BaseSyntheticEvent } from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { perPageMax } from "../utils/pageConstants";
import {
  useDataProvider,
  useNotify,
  usePermissions,
  useRefresh,
  useTranslate,
} from "react-admin";
import updateRequestStatus from "../queries/updateRequestStatus/updateRequestStatus";
import createRequestDenialQuery from "../queries/createRequestDenial/createRequestDenialQuery";
import type {
  CreateRequestDenialLetterInput,
  CreateRequestDenialLetterMutation,
  CreateRequestDenialLetterMutationVariables,
  CreateRequestResponseV1Input,
  UpdateRequestStatusV2Input,
  UpdateRequestStatusV2Mutation,
  UpdateRequestStatusV2MutationVariables,
} from "../__generated__/typescript-operations_all";
import { useMutation } from "@apollo/react-hooks";
import useTraces from "./useTraces";
import createRequestResponseQuery from "../queries/createRequestResponse/createRequestResponseQuery";
import { useSelector } from "react-redux";
import { correlationConstants } from "../utils/OT/correlationConstants";
import { CO_ROLE_MRA, CO_ROLE_PPA } from "../utils/roles";
import type { AppState, IGenericType } from "../types";
import { synapsePostCommentQuery } from "../service/keycloakQueries";
import { isCommentProviderIsCactusComment } from "../utils/comments";
import { Base64 } from "js-base64";
import { INTERNAL_DENIAL_TYPE } from "../utils/constants";
const useBrief = ({ request }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.primary.light,
      marginBottom: "15px",
    },
    notesArea: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.dark,
    },
    dropdown: {
      backgroundColor: theme.palette.primary.light,
    },
    cardContent: {
      backgroundColor: theme.palette.primary.light,
    },
    requestedBy: {
      backgroundColor: theme.palette.primary.light,
    },
    h6_title: {
      width: "55%",
      float: "left",
      fontWeight: 600,
    },
    notes: {
      width: "100%",
      textAlign: "justify",
      fontWeight: 400,
      whiteSpace: "pre-line",
    },
    notesTitle: {
      width: "100%",
      fontWeight: 600,
    },
    h4_title: {
      float: "left",
      fontWeight: 600,
    },
    subtitle: {
      width: "40%",
      float: "left",
      marginLeft: "5%",
    },
    listitemStyle: {
      display: "inline-block !important",
      borderBottom: "1px solid #eaeaea !important",
    },
    listitemStyle2: {
      display: "inline-block !important",
      borderBottom: "unset !important",
    },
    info: {
      cursor: "auto",
      width: "20px",
      height: "15px",
      color: "grey",
    },
  }));
  const dataProvider = useDataProvider();
  const { permissions } = usePermissions();
  const refresh = useRefresh();
  const notify = useNotify();
  const translate = useTranslate();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [denialValue, setDenialValue] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [to, setTo] = useState("");
  const [isExceptionId, setIsExceptionId] = useState(false);
  const [showInternalOptions, setShowInternalOptions] = useState(false);
  const [deniedReasonList, setDeniedReasonList] = useState([]);
  const [requestDenial, setRequestDenial] = useState([]);
  const [reasonList, setReasonList] = useState([]);
  const [requestStatus, setRequestStatus] = useState();
  const [notes, setNotes] = useState("");
  const [requestStatusList, setRequestStatusList] = useState<IGenericType[]>(
    [],
  );
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showDenialForm, setShowDenialForm] = useState(false);
  const [shareInternalDenial, setShareInternalDenial] = useState(false);
  const [fileData, setFileData] = useState<File>();
  const { handleTrace } = useTraces();
  const [subscribeReplyMutation] = useMutation(createRequestResponseQuery, {});
  const [internalReasonList, setInternalReasonList] = useState([]);
  const [subscribeStatusChangeMutation] = useMutation<
    UpdateRequestStatusV2Mutation,
    UpdateRequestStatusV2MutationVariables
  >(updateRequestStatus, {});
  const [subscribeRequestDenialMutation] = useMutation<
    CreateRequestDenialLetterMutation,
    CreateRequestDenialLetterMutationVariables
  >(createRequestDenialQuery, {});
  const queryOption = {
    pagination: { page: 1, perPage: perPageMax },
    sort: { field: "id", order: "ASC" },
    filter: {},
  };
  function getDenialFormViews() {
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "createdAt", order: "DESC" },
      filter: { requestId: request.id },
    };
    dataProvider
      .getList("denialFormV1", queryOption)
      .then(({ data }) => {
        setRequestDenial(data);
      })
      .catch((error) => error);
  }
  function getDenialReasonList() {
    dataProvider
      .getList("denialLetterReasonMasters", queryOption)
      .then(({ data }) => {
        setDeniedReasonList(data);
      })
      .catch((error) => error);
  }
  const blobToFile = function (blob, name) {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    setFileData(blob);
  };
  const handleInternalDenialChange = (event: BaseSyntheticEvent) => {
    event.persist();
    if (event.target.checked) {
      setShareInternalDenial(true);
    } else {
      setShareInternalDenial(false);
    }
  };

  const handleChangeReason = (event, id) => {
    event.persist();
    if (id === INTERNAL_DENIAL_TYPE) {
      if (event.target.checked) setShowInternalOptions(true);
      else {
        setShowInternalOptions(false);
        setNotes("");
        setInternalReasonList([]);
      }
    }
    const reasonTempArray = [...reasonList];
    if (event.target.checked === true) {
      reasonTempArray.push(id);
    } else {
      const index = reasonTempArray.indexOf(id);
      if (index > -1) {
        reasonTempArray.splice(index, 1);
      }
    }
    setReasonList(reasonTempArray);
  };
  const handleInternalChangeReason = (event, id) => {
    event.persist();
    const reasonTempArray = [...internalReasonList];
    if (event.target.checked === true) {
      reasonTempArray.push(id);
    } else {
      const index = reasonTempArray.indexOf(id);
      if (index > -1) {
        reasonTempArray.splice(index, 1);
      }
    }
    setInternalReasonList(reasonTempArray);
  };

  const handleChange = (event) => {
    setNotes(event.target.value);
  };
  const confirmRequestDenial = (val) => {
    if (val.reason !== "" && val.errorMsg === "") {
      setShowAlert(true);
      setDenialValue(val);
    }
  };
  const onCancel = () => {
    setShowDenialForm(false);
    refresh();
  };
  const postNotes = () => {
    if (notes !== "") {
      if (isCommentProviderIsCactusComment) synapsePostCommentQuery(notes);
      else {
        let eventObj = {
          eventTitle: "",
          aecId: "",
          aecIeId: "",
        };
        eventObj = correlationConstants["ev-097"];
        const inputContext = {
          action: "Post reply and post internal notes are filled by user",
          aecId: eventObj.aecId,
          aecIeId: eventObj.aecIeId,
        };
        const createRequestInternalNoteInput: CreateRequestResponseV1Input = {
          type: 3,
          response: notes,
          requestId: request.id,
          repliedBy: userInfoReducer.id,
          responseType: 3,
          fingerPrint: "",
          otContext: {
            spanId: "",
            traceFlags: 1,
            traceId: "",
          },
          otTags: {
            name: "",
          },
        };
        handleTrace(
          eventObj.eventTitle,
          inputContext,
          (spanContext: any, fingerprint: any) => {
            createRequestInternalNoteInput.otContext =
              JSON.stringify(spanContext);
            createRequestInternalNoteInput.fingerPrint = fingerprint;
            createRequestInternalNoteInput.otTags = JSON.stringify({
              name: "Attempt to Post Internal Notes ",
            });
            subscribeReplyMutation({
              variables: {
                input: createRequestInternalNoteInput,
              },
            }).then(() => {
              // refresh();
            });
          },
        );
      }
    }
  };

  const handleStatusChange = (event) => {
    setRequestStatus(event.target.value);
    requestStatusList.map((option) => {
      if (option.id === Number(event.target.value)) {
        setTo(option.value);
      }
    });
    if (event.target.value === "5") {
      setShowDenialForm(true);
      getDenialReasonList();
      setShowReviewForm(false);
    } else {
      setShowReviewForm(true);
      setShowDenialForm(false);
    }
  };

  const submitStatusChangeSet = (val) => {
    let eventObj = {
      eventTitle: "",
      aecId: "",
      aecIeId: "",
    };
    if (permissions === CO_ROLE_PPA) {
      eventObj = correlationConstants["ev-047"];
    } else if (permissions === CO_ROLE_MRA) {
      eventObj = correlationConstants["ev-098"];
    }
    const updateRequestStatusInput: UpdateRequestStatusV2Input = {
      fromStatus: request.requeststatus,
      requestId: request.id,
      toStatus: to,
      content: val,
      type: 1,
      requestStatus: Number(requestStatus),
      fingerPrint: "",
      otContext: {
        spanId: "",
        traceFlags: 1,
        traceId: "",
      },
      otTags: {
        name: "",
      },
    };

    const inputContext = {
      action: "Click on Change request status",
      aecId: eventObj.aecId,
      aecIeId: eventObj.aecIeId,
    };
    handleTrace(
      eventObj.eventTitle,
      inputContext,
      (spanContext: any, fingerprint: any) => {
        updateRequestStatusInput.otContext = JSON.stringify(spanContext);
        updateRequestStatusInput.fingerPrint = fingerprint;
        updateRequestStatusInput.otTags = JSON.stringify({
          name: "Attempt to change Request Status",
        });
        subscribeStatusChangeMutation({
          variables: { input: updateRequestStatusInput },
        }).then((response) => {
          {
            if (response.data.updateRequestStatusV2.requestResult.success) {
              refresh();
            } else {
              notify(translate("resources.update.submit_failure"), "warning");
            }
          }
        });
      },
    );
  };

  const submitRequestDenial = () => {
    setShowAlert(false);
    if (!showInternalOptions) {
      setReasonList([]);
      setNotes("");
    }
    const encodedNotes = Base64.btoa(notes);
    if (denialValue.reason !== "" && denialValue.errorMsg === "") {
      let eventObj = {
        eventTitle: "",
        aecId: "",
        aecIeId: "",
      };
      if (permissions === CO_ROLE_PPA) {
        eventObj = correlationConstants["ev-049"];
      } else if (permissions === CO_ROLE_MRA) {
        eventObj = correlationConstants["ev-100"];
      }
      console.group(
        "%cOT Traces",
        "background-color: #008000 ; color: #ffffff ; font-weight: bold ; padding: 4px ;",
      );
      console.log(eventObj);
      console.groupEnd();

      const createRequestDenialLetterInput: CreateRequestDenialLetterInput = {
        patientId: request.patientId,
        reasonids: reasonList,
        remarks: denialValue.reason,
        fromStatus: request.requeststatus,
        requestId: request.id,
        type: 1,
        exceptionids: internalReasonList,
        isExceptionid: isExceptionId,
        notes: encodedNotes,
        toStatus: to,
        content: denialValue.reason,
        requestStatus: Number(requestStatus),
        denialType: denialValue.type,
        fingerPrint: "",
        hasShareInternalDenial: shareInternalDenial,
        otContext: {
          spanId: "",
          traceFlags: 1,
          traceId: "",
        },
        otTags: {
          name: "",
        },
      };

      const inputContext = {
        action: "Click on Submit Denial Form",
        aecId: eventObj.aecId,
        aecIeId: eventObj.aecIeId,
      };
      handleTrace(
        eventObj.eventTitle,
        inputContext,
        (spanContext: any, fingerprint: any) => {
          createRequestDenialLetterInput.otContext =
            JSON.stringify(spanContext);
          createRequestDenialLetterInput.fingerPrint = fingerprint;
          createRequestDenialLetterInput.otTags = JSON.stringify({
            name: "Attempt to click on submit Denial Form ",
          });
          subscribeRequestDenialMutation({
            variables: { input: createRequestDenialLetterInput },
          }).then((response) => {
            if (response.data.createRequestDenialLetter.requestResult.success) {
              postNotes();
              refresh();
            } else {
              notify(translate("resources.denial.submit_failure"), "warning");
            }
          });
        },
      ); //end of handletrace
    }
  };
  return {
    useStyles,
    deniedReasonList,
    requestDenial,
    getDenialFormViews,
    getDenialReasonList,
    fileData,
    blobToFile,
    handleInternalDenialChange,
    submitRequestDenial,
    submitStatusChangeSet,
    handleChangeReason,
    handleStatusChange,
    handleChange,
    reasonList,
    userInfoReducer,
    notes,
    setRequestStatusList,
    requestStatus,
    requestStatusList,
    showReviewForm,
    showDenialForm,
    setIsExceptionId,
    isExceptionId,
    setNotes,
    handleInternalChangeReason,
    internalReasonList,
    shareInternalDenial,
    showAlert,
    confirmRequestDenial,
    setShowAlert,
    showInternalOptions,
    onCancel,
    setShowInternalOptions,
    setInternalReasonList,
    setReasonList,
  };
};

export default useBrief;
