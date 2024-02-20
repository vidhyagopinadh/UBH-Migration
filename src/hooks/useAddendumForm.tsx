import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core";
import {
  useDataProvider,
  useLogin,
  useNotify,
  useTranslate,
} from "react-admin";
import { useSelector } from "react-redux";
import useTraces from "./useTraces";
import createFileUploadQuery from "../queries/createFileUpload/createFileUploadQuery";
import updateRequestFiledetail from "../queries/updateRequestFiledetail/updateRequestFiledetail";
import type {
  AppState,
  IAddendumRequestFormProps,
  IAlreadyLoggedIn,
} from "../types";
import b64toBlob from "../utils/images/b64toBlob";
import { blobToFile } from "../utils/images/blobToFile";
import { perPageMax } from "../utils/pageConstants";
import { CO_NAME_GUEST, CO_ROLE_GUEST, CO_ROLE_PATIENT } from "../utils/roles";
import type {
  FileUploadInput,
  UpdateRequestFiledetailV1Input,
} from "../__generated__/typescript-operations_all";
import secureLocalStorage from "react-secure-storage";
import { useHistory } from "react-router";
const { REACT_APP_GUEST_USERNAME, REACT_APP_GUEST_PASSWORD } = process.env;
const useAddendumForm = ({ id }: IAddendumRequestFormProps) => {
  const login = useLogin();
  const notify = useNotify();
  const translate = useTranslate();
  const history = useHistory();
  const dataProvider = useDataProvider();
  const [signature, setSignature] = useState("");
  const { getTrace } = useTraces();
  const [successAck, setSuccessAck] = useState(false);
  const [error, setError] = useState({
    status: false,
    message: "",
  });
  const [requestViewList, setRequestViewList] = useState<any>({});
  const userInfo = useSelector((state: AppState) => state.userInfoReducer);
  const useStyles = makeStyles(() => ({
    root: {
      margin: "10px",
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
    },
    imageContainer: {
      marginTop: "5px",
      display: "flex",
      justifyContent: "center",
    },
    image: {
      maxWidth: "100%",
      width: 560,
      maxHeight: 300,
      height: "auto",
    },
    buttonContainer: {
      marginTop: "5px",
      display: "flex",
      justifyContent: "center",
    },

    additionalClass: {
      border: "2px solid #7c7c7c",
      borderRadius: "10px",
      background: 'url("/images/signature.jpg")',
      backgroundSize: "400px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom left",
    },
    contentText1: {
      width: "25%",
      float: "left",
      fontWeight: 400,
    },
    subHead: {
      background: "#fafafa",
      padding: "5px 10px",
      marginBottom: "0px",
      fontWeight: 600,
      fontSize: "16px",
    },
    subtitle: {
      width: "70%",
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
  }));

  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState<IAlreadyLoggedIn>({
    alreadyThere: localStorage.getItem("authState") == "true" ? true : false,
    userName: localStorage.getItem("User") || CO_NAME_GUEST,
    role: secureLocalStorage.getItem("role")
      ? String(secureLocalStorage.getItem("role"))
      : CO_ROLE_GUEST,
    email: userInfo ? userInfo.email : "",
  });

  function doLogin() {
    login(
      {
        username: REACT_APP_GUEST_USERNAME,
        password: REACT_APP_GUEST_PASSWORD,
      },
      `/addendumRequestForm/${id}`,
    )
      .then(() => {
        setAlreadyLoggedIn((prevFormState: IAlreadyLoggedIn) => ({
          ...prevFormState,
          alreadyThere: false,
        }));
        getRequestViews();
      })
      .catch(() => {
        notify(translate(`auth.messages.access_denied`), { type: "warning" });
      });
  }

  const queryOption = {
    pagination: { page: 1, perPage: perPageMax },
    sort: { field: "id", order: "ASC" },
    filter: { id: id },
  };
  function getRequestViews() {
    dataProvider
      .getList("requests", queryOption)
      .then(({ data }) => {
        setRequestViewList(data[0]);
      })
      .catch((error) => error);
  }
  function getRequestViewsPatient() {
    dataProvider
      .getList("requests", queryOption)
      .then(({ data }) => {
        setRequestViewList(data[0]);
      })
      .catch((error) => error);
  }

  const onSuccess = () => {
    setSuccessAck(true);
  };

  const onSubmit = () => {
    if (signature) {
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
          getTrace(
            "Upload signature in Addendum Form",
            "ev-116",
            userInfo.email,
          );
          updateRequest(res.data?.createFileUpload.fileUpload.id);
        }
      });
    } else {
      setError({
        status: true,
        message: translate("auth.errors.signError"),
      });
    }
  };

  const [subscribeFileUploadMutation] = useMutation(createFileUploadQuery, {});
  const [subscribeUpdateMutation] = useMutation(updateRequestFiledetail, {});

  const updateRequest = (signatureId: string) => {
    const updateRequestFiledetailInput: UpdateRequestFiledetailV1Input = {
      requestIid: id,
      signatureId: signatureId,
    };
    subscribeUpdateMutation({
      variables: { input: updateRequestFiledetailInput },
    }).then((res) => {
      if (res.data) {
        onSuccess();
        if (secureLocalStorage.getItem("role") === CO_ROLE_PATIENT) {
          notify(translate(`auth.messages.successfully_signed`), {
            type: "success",
          });
          history.push("/requests/" + requestViewList.trackId + "/overview");
        }
      }
    });
  };

  const getSign = (val) => {
    setSignature(val);
  };

  const alreadyConfirmation = () => {
    localStorage.setItem("User", CO_NAME_GUEST);
    localStorage.setItem("Loggedout", "true");
    doLogin();
  };

  return {
    useStyles,
    alreadyLoggedIn,
    userInfo,
    doLogin,
    requestViewList,
    onSubmit,
    alreadyConfirmation,
    getSign,
    getTrace,
    successAck,
    error,
    setAlreadyLoggedIn,
    getRequestViewsPatient,
  };
};

export default useAddendumForm;
