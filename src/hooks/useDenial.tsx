import type { BaseSyntheticEvent } from "react";
import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core";
import { useDataProvider, usePermissions } from "react-admin";
import type { AppState, IPersonDemographic } from "../types";
import b64toBlob from "../utils/images/b64toBlob";
import { blobToFile } from "../utils/images/blobToFile";
import { perPageMax } from "../utils/pageConstants";
import { CO_ROLE_MRA, CO_ROLE_PPA } from "../utils/roles";
import { validateSentance } from "../utils/validator";
import type {
  FileUploadInput,
  UpdateRequestFiledetailV1Input,
} from "../__generated__/typescript-operations_all";
import useTraces from "./useTraces";
import updateRequestFiledetail from "../queries/updateRequestFiledetail/updateRequestFiledetail";
import createFileUploadQuery from "../queries/createFileUpload/createFileUploadQuery";
import { useSelector } from "react-redux";
const useDenial = ({ request, onSubmit, idVal }) => {
  const [error, setError] = useState({
    status: false,
    message: "",
  });
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [deniedReasonLists, setDeniedReasonLists] = useState([]);
  const [infBlockingData, setInfBlockingData] = useState([]);
  const [signature, setSignature] = useState("");
  const dataProvider = useDataProvider();
  const [reasonList, setReasonList] = useState([]);
  const [extraDetails, setExtraDetails] = useState<IPersonDemographic[]>([]);
  const [type, setType] = useState("all");
  const [reason, setReason] = useState("");
  const { getTrace } = useTraces();
  const { permissions } = usePermissions();
  const getSign = (val) => {
    setSignature(val);
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      alignItems: "center",
    },
    notesArea: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.dark,
    },
    card: {
      marginLeft: theme.spacing(2),
      flexGrow: 1,
      display: "flex",
      padding: theme.spacing(2),
      alignItems: "center",
    },
    date: {
      marginLeft: "auto",
      flexShrink: 0,
    },
    // avatarBlue: {
    //   backgroundImage: gradients.blue
    // },
    // avatarGreen: {
    //   backgroundImage: gradients.green
    // },
    // avatarOrange: {
    //   backgroundImage: gradients.orange
    // },
    // avatarIndigo: {
    //   backgroundImage: gradients.indigo
    // }
  }));
  const handleValidateOnBlur = (event: BaseSyntheticEvent) => {
    event.persist();
    if (event.target.value === "") {
      setErrorMsg("Please enter remarks");
    } else if (event.target.value) {
      const valid = validateSentance(event.target.value);
      if (valid) {
        setErrorMsg("");
      } else {
        setErrorMsg("Please enter valid remarks");
      }
    } else {
      setErrorMsg("");
    }
  };
  function getAssignedTo() {
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: { id: request.assignToPersonId },
    };
    dataProvider
      .getList("personDemographicsDetailsV2", queryOption)
      .then(({ data }) => {
        setExtraDetails(data);
      })
      .catch((error) => error);
  }
  const handleChange = (event) => {
    setReason(event.target.value);
  };

  const handleChangeReason = (event, id) => {
    event.persist();
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
  const queryOptionInf = {
    pagination: { page: 1, perPage: perPageMax },
    sort: { field: "id", order: "ASC" },
    filter: {},
  };
  function getInfBlockingDetails() {
    dataProvider
      .getList("informationBlockingExceptionsMaster", queryOptionInf)
      .then(({ data }) => {
        setInfBlockingData(data);
      });
  }

  const handleTypeChange = (event) => {
    event.persist();
    if (event.target.type === "checkbox") {
      setType(event.target.checked);
    } else {
      setType(event.target.value);
    }
  };

  const onSubmitTrigger = () => {
    if (reason === "") {
      setErrorMsg("Please enter valid remarks");
    }
    if (signature) {
      if (permissions === CO_ROLE_PPA) {
        getTrace(" Signature Uploaded(PPA)", "ev-048", userInfoReducer.email);
      }
      if (permissions === CO_ROLE_MRA) {
        getTrace(" Signature Uploaded(MRA)", "ev-099", userInfoReducer.email);
      }
      const block = encodeURI(signature).split(";");
      const contentType = block[0].split(":")[1];
      const realData = block[1].split(",")[1];
      const blob = b64toBlob(realData, contentType);
      setError({
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
          updateRequest(res.data?.createFileUpload.fileUpload.id);
        }
      });
    } else {
      setError({
        status: true,
        message: "Please add a signature",
      });
    }
    onSubmit(
      {
        errorMsg,
        reasonList,
        type,
        reason,
        assignTo: request.assignToPersonId,
        patientId: request.patientId,
        requestId: idVal,
      },
      "denied",
    );
  };

  const [subscribeFileUploadMutation] = useMutation(createFileUploadQuery, {});
  const [subscribeUpdateMutation] = useMutation(updateRequestFiledetail, {});
  const updateRequest = (signatureId: string) => {
    const updateRequestFiledetailInput: UpdateRequestFiledetailV1Input = {
      requestIid: request.id,
      deniedSignatureId: signatureId,
    };
    subscribeUpdateMutation({
      variables: { input: updateRequestFiledetailInput },
    }).then((res) => {
      if (res.data) {
        // console.log("res.data after update", res.data);
      }
    });
  };
  return {
    useStyles,
    handleValidateOnBlur,
    getAssignedTo,
    setDeniedReasonLists,
    deniedReasonLists,
    reasonList,
    handleChangeReason,
    extraDetails,
    type,
    error,
    handleTypeChange,
    errorMsg,
    handleChange,
    reason,
    getSign,
    onSubmitTrigger,
    getInfBlockingDetails,
    infBlockingData,
  };
};

export default useDenial;
