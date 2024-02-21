import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import moment from "moment";
// import { makeStyles } from "@material-ui/core/styles";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  colors,
  Divider,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@material-ui/core";
import { BootstrapTooltip as Tooltip } from "./Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Label from "./label";
import BaseModal from "./baseModal";
import Truncate from "react-truncate";
import { useMutation } from "@apollo/react-hooks";
import deleteRequest from "../queries/deleteRequest/deleteRequest";
import type {
  AddendumDoctorsDetail,
  DeleteRequestV2Input,
  RequestContactDetail,
  RequestObtainRecordType,
} from "../__generated__/typescript-operations_all";
import { useSelector } from "react-redux";
import HIPAAFilled from "./../images/HIPAAFilled.png";
import HIPAANotFilled from "./../images/HIPAANotFilled.png";
import signingFilled from "./../images/signingFilled.png";
import signingNotFilled from "./../images/signingNotFilled.png";
import substancedisorderFilled from "./../images/substancedisorderFilled.png";
import substancedisorderNotFilled from "./../images/substancedisorderNotFilled.png";
import {
  useDataProvider,
  useRefresh,
  usePermissions,
  useNotify,
  useTranslate,
} from "react-admin";
import { CO_ROLE_MRA, CO_ROLE_PATIENT, CO_ROLE_PPA } from "../utils/roles";
import { perPageMax } from "../utils/pageConstants";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import MyDocument from "./download/downloadGenerator";
import { getImagesByFileUploadId } from "../service/restConfig";
import useTraces from "../hooks/useTraces";
import { correlationConstants } from "../utils/OT/correlationConstants";
import type { AppState, IImageStack } from "../types";
import { HourglassFullTwoTone } from "@material-ui/icons";
import { AccessTimeFilled, Edit } from "@mui/icons-material";
interface IRequestToken {
  id?: string | number;
  requestId?: string;
  partyId?: string;
  token?: string;
  authFormType?: number;
  isFilled?: boolean;
  isResend?: boolean;
  resendDate?: string;
}
function ProjectCard({ project, ...rest }) {
  const history = useHistory();
  const { permissions } = usePermissions();
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const useStyles = makeStyles((theme) => ({
    rotateIcon: {
      animation: `$rotateY 5s ease-in-out infinite `,
    },
    "@keyframes rotateY": {
      "0%": {
        transform: " rotateX(180deg)",
      },
      "100%": {
        transform: " rotateX(-180deg)",
      },
    },
    "@keyframes bentY": {
      "0%": {
        transform: " rotateX(30deg)",
      },
      "100%": {
        transform: " rotateX(-30deg)",
      },
    },
    root: {
      position: "relative",
      overflow: "hidden",
      animation:
        permissions === CO_ROLE_MRA && project.expired
          ? `$blinker 1.8s linear infinite`
          : "",
    },
    "@keyframes blinker": {
      "0%": {
        background: "#ffccee",
      },
      "20%": {
        background: "#ffff",
      },
      "40%": {
        background: "#ffccee",
      },
      "60%": {
        background: "#fffff",
      },
      "80%": {
        background: "#ffccee",
      },
      "100%": {
        background: "#fffff",
      },
    },
    header: {
      paddingBottom: 0,
    },
    content: {
      padding: 0,
      "&:last-child": {
        paddingBottom: 0,
      },
    },
    description: {
      padding: "16px 10px 16px 16px",
    },
    tags: {
      padding: "0 0 16px 16px",
      flexWrap: "wrap",
      "& > * + *": {
        marginLeft: theme.spacing(1),
      },
      display: "inline-flex",
    },
    learnMoreButton: {
      marginLeft: theme.spacing(2),
    },
    likedButton: {
      color: colors.red[600],
    },
    shareButton: {
      marginLeft: theme.spacing(1),
    },
    timerIcon: {
      animation: `$bentY 2s ease-in-out infinite `,
    },
    timer: {
      display: "flex",
      flexDirection: "column",
      borderRadius: "0px",
      opacity: "0.5",
      position: "absolute",
      backgroundColor: "grey",
      height: "100%",
      width: "100%",
      overflow: "hidden",
      zIndex: 9999,
      "&:hover": {
        backgroundColor: "grey",
      },
    },
    details: {
      padding: "16px",
    },
    authImage: {
      height: "30px",
      margin: "12px 5px",
    },
    loader: {
      color: "grey",
      marginLeft: theme.spacing(1),
    },
  }));
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const notify = useNotify();
  const translate = useTranslate();
  const [disorderFileData, setDisorderFileData] = useState({});
  const [hipaaFileData, setHipaaFileData] = useState({});
  const [medicalFileData, setMedicalFileData] = useState({});
  const [legalIdData, setLegalIdData] = useState({});
  const [proxyData, setProxyData] = useState({});
  const [attachmentData, setAttachmentData] = useState({});
  const [hipaaSignData, setHipaaSignData] = useState({});
  const [sudSignData, setSudSignData] = useState({});
  const [fileData, setFileData] = useState({});
  const [editedImageData, setEditedImageData] = useState({});
  const [billingData, setBillingData] = useState({});
  const { getTrace, handleTrace } = useTraces();
  const [imageStack, setImageStack] = useState<IImageStack>({
    disorderDisclosureAuthorizationFileId:
      project.disorderDisclosureAuthorizationFileId || null,
    hipaaAuthorizationFileId: project.hipaaAuthorizationFileId || null,
    medicalRequestFormFileId: project.medicalRequestFormFileId || null,
    addendumRequestFileId: project.addendumRequestFileId || null,
    editedImageId: project.editedImageId || null,
    proxyDocument: project.proxyDocument || null,
    signatureId: project.signatureId || null,
    attachment: project.attachment || null,
  });
  const [imageStackHipaa, setImageStackHipaa] = useState({
    legalId: null,
    signatureFile: null,
  });
  const [imageStackSud, setImageStackSud] = useState({
    signatureFile: null,
  });
  const [hideTimer, setHideTimer] = useState(false);
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [authStatus, setAuthStatus] = useState<IRequestToken[]>([]);
  const [obtainData, setObtainData] = useState<RequestObtainRecordType[]>([]);
  const [contactData, setContactData] = useState<RequestContactDetail[]>([]);
  const [doctorData, setDoctorData] = useState<AddendumDoctorsDetail[]>([]);
  const [hipaaData, setHipaaData] = useState({});
  const [submittedInstitution, setSubmittedInstitution] = useState([]);
  const [sudData, setSudData] = useState({});

  useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setEmailNotVerified(true);
    }
  }, []);
  useEffect(() => {
    let mounted = true;
    setImageStack({
      disorderDisclosureAuthorizationFileId:
        project.disorderDisclosureAuthorizationFileId || null,
      hipaaAuthorizationFileId: project.hipaaAuthorizationFileId || null,
      medicalRequestFormFileId: project.medicalRequestFormFileId || null,
      addendumRequestFileId: project.addendumRequestFileId || null,
      editedImageId: project.editedImageId || null,
      proxyDocument: project.proxyDocument || null,
      signatureId: project.signatureId || null,
      attachment: project.attachment || null,
    });
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        requestId: project.id,
      },
    };
    function getNewInstitutionDetails() {
      if (project.communicationRequestId) {
        dataProvider
          .getList("communicationRequestMasterV1", {
            pagination: { page: 1, perPage: perPageMax },
            sort: { field: "id", order: "ASC" },
            filter: { id: project.communicationRequestId },
          })
          .then(({ data }) => {
            setSubmittedInstitution(
              JSON.parse(data[0].communicationMetaValue).metaData,
            );
          })
          .catch(() => {
            //
          });
      }
    }
    function getToken() {
      dataProvider
        .getList("requestTokenV1s", queryOption)
        .then(({ data }) => {
          if (mounted) {
            setAuthStatus(data);
          }
        })
        .catch((error) => error);
    }
    function getHipaa() {
      dataProvider
        .getList("healthInfoAuthorizationV2", queryOption)
        .then(({ data }) => {
          if (mounted) {
            if (data[0]) {
              setHipaaData(data[0]);
              imageStackHipaa.legalId = data[0].legalId;
              imageStackHipaa.signatureFile = data[0].signatureFile;
              setImageStackHipaa({
                legalId: data[0].legalId,
                signatureFile: data[0].signatureFile,
              });
              Object.entries(imageStackHipaa).forEach((indvImageStack) => {
                if (indvImageStack[1]) {
                  getFileDetails(indvImageStack);
                }
              });
            }
          }
        });
    }
    function getSud() {
      dataProvider
        .getList("substanceDisorderAuthorizationV1s", queryOption)
        .then(({ data }) => {
          if (mounted) {
            if (data[0]) {
              setSudData(data[0]);
              imageStackSud.signatureFile = data[0].signatureFile;
              setImageStackSud({
                signatureFile: data[0].signatureFile,
              });
              Object.entries(imageStackSud).forEach((indvImageStack) => {
                if (indvImageStack[1]) {
                  getFileDetails(indvImageStack, "sud");
                }
              });
            }
          }
        });
    }
    function getFileDetails(indvImageStack, type = "default") {
      const queryOptionFile = {
        pagination: { page: 1, perPage: perPageMax },
        sort: { field: "id", order: "ASC" },
        filter: {
          id: indvImageStack[1],
        },
      };
      dataProvider.getList("fileUploads", queryOptionFile).then(({ data }) => {
        if (data.length > 0) {
          getImagesByFileUploadId({
            fileName: data[0].fileName,
          }).then((res: Blob) => {
            blobToBase64(res, indvImageStack[0], type);
          });
        }
      });
    }

    if (project.expired) {
      Object.entries(imageStack).forEach((indvImageStack) => {
        if (indvImageStack[1]) {
          getFileDetails(indvImageStack);
        }
      });
      getHipaa();
      getSud();
    }
    if (project.requeststatus === "Pending") {
      getNewInstitutionDetails();
    }
    if (project.categoryType === "request") {
      getToken();
    }

    return () => {
      mounted = false;
    };
  }, [project.id]);

  useEffect(() => {
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        requestId: project.id,
      },
    };
    const addendumQueryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        requestId: project.id,
      },
    };
    function getContactDetails() {
      dataProvider
        .getList("requestContactDetails", queryOption)
        .then(({ data }) => {
          setContactData(data);
        });
    }
    function getDoctorDetails() {
      dataProvider
        .getList("addendumDoctorsDetails", addendumQueryOption)
        .then(({ data }) => {
          setDoctorData(data);
        });
    }
    function getObtainRecordDetails() {
      dataProvider
        .getList("requestObtainRecordTypes", queryOption)
        .then(({ data }) => {
          setObtainData(data);
        });
    }

    if (project.expired) {
      getObtainRecordDetails();
      getContactDetails();
      getDoctorDetails();
    }
  }, []);

  const [openBase, setOpenBase] = useState(false);
  function editRequest(trackId: string) {
    if (permissions === CO_ROLE_PATIENT) {
      getTrace(
        "Clicked on Edit Button(Patient)",
        "ev-132",
        userInfoReducer.email,
      );
    }
    history.push(`/requestView/requestId=${trackId}`);
  }
  function viewMoreRequest(id: string) {
    if (permissions === CO_ROLE_PPA) {
      getTrace(
        "Clicked on View More Button(PPA)",
        "ev-043",
        userInfoReducer.email,
      );
      history.push(`/requests/${id}/overview`);
    } else if (permissions === CO_ROLE_MRA) {
      getTrace(
        "Clicked on View More Button(MRA)",
        "ev-094",
        userInfoReducer.email,
      );
      history.push(`/requests/${id}/overview`);
    } else if (permissions === CO_ROLE_PATIENT) {
      getTrace(
        "Clicked on View More Button(Patient)",
        "ev-127",
        userInfoReducer.email,
      );
      history.push(
        `/` + window.location.href.split("/")[3] + `/${id}/overview`,
      );
    }
  }

  const deleteConfirmation = (val: boolean) => {
    setOpenBase(false);
    let eventObj = {
      eventTitle: "",
      aecId: "",
      aecIeId: "",
    };
    if (permissions === CO_ROLE_PPA) {
      eventObj = correlationConstants["ev-050"];
    } else if (permissions === CO_ROLE_MRA) {
      eventObj = correlationConstants["ev-101"];
    } else if (permissions === CO_ROLE_PATIENT) {
      eventObj = correlationConstants["ev-131"];
    }
    const inputContext = {
      action: "Click on Delete Button",
      aecId: eventObj.aecId,
      aecIeId: eventObj.aecIeId,
    };

    if (val) {
      const deleteRequestInput: DeleteRequestV2Input = {
        requestId: project.id,
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
          deleteRequestInput.otContext = JSON.stringify(spanContext);
          deleteRequestInput.fingerPrint = fingerprint;
          deleteRequestInput.otTags = JSON.stringify({
            name: "Attempt to delete Medical/Addendum/Billing Request ",
          });
          subscribeDeletionMutation({
            variables: { input: deleteRequestInput },
          }).then((response) => {
            if (response.data.deleteRequestV2.requestResult.success) {
              refresh();
            } else {
              notify(translate("resources.delete.submit_failure"), "warning");
            }
          });
        },
      ); //end of handletrace
    }
  };

  const [subscribeDeletionMutation] = useMutation(deleteRequest, {});

  const blobToBase64 = (blob, fieldName, type) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      if (fieldName === "disorderDisclosureAuthorizationFileId") {
        setDisorderFileData(reader.result);
      }
      if (fieldName === "hipaaAuthorizationFileId") {
        setHipaaFileData(reader.result);
      }
      if (fieldName === "medicalRequestFormFileId") {
        setMedicalFileData(reader.result);
      }
      if (fieldName === "addendumRequestFileId") {
        setFileData(reader.result);
      }
      if (fieldName === "editedImageId") {
        setEditedImageData(reader.result);
      }
      if (fieldName === "legalId") {
        setLegalIdData(reader.result);
      }
      if (fieldName === "signatureId") {
        setAttachmentData(reader.result);
      }
      if (fieldName === "attachment") {
        setBillingData(reader.result);
      }
      if (fieldName === "proxyDocument") {
        setProxyData(reader.result);
      }
      if (fieldName === "signatureFile") {
        if (type === "sud") {
          setSudSignData(reader.result);
        } else {
          setHipaaSignData(reader.result);
        }
      }
    };
  };
  const openInNewTab = (url) => {
    event.preventDefault();
    if (permissions === CO_ROLE_PPA) {
      getTrace(
        " Clicked on Download Button(PPA)",
        "ev-051",
        userInfoReducer.email,
      );
    } else if (permissions === CO_ROLE_MRA) {
      getTrace(
        " Clicked on Download Button(MRA)",
        "ev-102",
        userInfoReducer.email,
      );
    } else if (permissions === CO_ROLE_PATIENT) {
      getTrace(
        " Clicked on Download Button(Patient)",
        "ev-133",
        userInfoReducer.email,
      );
    }
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow === null && permissions === CO_ROLE_PPA) {
      getTrace("Files Downloaded by PPA", "ev-052", userInfoReducer.email);
    } else if (newWindow === null && permissions === CO_ROLE_MRA) {
      getTrace("Files Downloaded by MRA", "ev-103", userInfoReducer.email);
    } else if (newWindow === null && permissions === CO_ROLE_PATIENT) {
      getTrace("Files Downloaded by Patient", "ev-134", userInfoReducer.email);
    }
  };
  let backgroundval = "rgb(255, 255, 255)";
  if (localStorage.getItem("Theme") === "dark") {
    backgroundval = "rgb(128,128,128)";
  }
  let statuscolor = "rgba(76, 175, 80)";
  if (project.requestpriority === "High") {
    backgroundval = "rgba(255, 0, 0, 0.13)";
  } else if (project.requestpriority === "Normal") {
    backgroundval = "rgb(255, 252, 234)";
  }

  if (project.requeststatus === "New") {
    statuscolor = "rgba(255, 152, 0)";
  } else if (project.requeststatus === "Acknowledged") {
    statuscolor = "#0ea34a";
  } else if (project.requeststatus === "Resolved") {
    statuscolor = "#3c57aa";
    if (localStorage.getItem("Theme") === "dark") {
      backgroundval = "rgb(70,70,70)";
    } else {
      backgroundval = "rgb(220,220,220)";
    }
  } else if (project.requeststatus === "Pending") {
    statuscolor = "#82b3ff";
  } else if (project.requeststatus === "Denied") {
    statuscolor = "#e41e25";
  } else if (project.requeststatus === "Cancelled") {
    statuscolor = "#838383";
    if (localStorage.getItem("Theme") === "dark") {
      backgroundval = "rgb(70,70,70)";
    } else {
      backgroundval = "rgb(220,220,220)";
    }
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root)}
      style={{
        background: backgroundval,
      }}
    >
      {permissions === CO_ROLE_MRA &&
        project.outstandingRequest &&
        !project.expired ? (
        <IconButton
          className={classes.timer}
          size="medium"
          style={{ visibility: hideTimer ? "hidden" : "visible" }}
          onClick={() => {
            setHideTimer(true);
          }}
        >
          <HourglassFullTwoTone
            className={classes.timerIcon}
            style={{ color: "white", fontSize: "100px", opacity: "1" }}
          />
        </IconButton>
      ) : (
        ""
      )}

      <CardHeader
        className={classes.header}
        disableTypography
        style={{
          filter:
            !hideTimer &&
              permissions === CO_ROLE_MRA &&
              project.outstandingRequest &&
              !project.expired
              ? "blur(2px)"
              : "none",
        }}
        subheader={
          <div>
            <br style={{ display: "block" }} />
            <Typography
              variant="body2"
              style={{ display: "inline-flex", flexWrap: "wrap" }}
            >
              Patient:{" "}
              <Typography
                color="primary"
                variant="subtitle1"
                style={{ lineHeight: "1.3" }}
              >
                &nbsp;
                {project.firstName} {project.lastName}
              </Typography>
            </Typography>
            <br />
            <Typography
              variant="body2"
              style={{ display: "inline-flex", flexWrap: "wrap" }}
            >
              Created:{"  "}
              {moment(project.createdat).fromNow()}
            </Typography>
          </div>
        }
        title={
          <Link
            color="textPrimary"
            component={RouterLink}
            to={
              permissions === CO_ROLE_PATIENT
                ? `/` +
                window.location.href.split("/")[3] +
                `/${project.trackId}/overview`
                : `/requests/${project.trackId}/overview`
            }
            variant="h4"
            style={{ marginBottom: "10px", fontSize: "18px", width: "100%" }}
          >
            {project.categoryType === "addendum" ? (
              <>Addendum Request</>
            ) : (
              <Truncate lines={1} ellipsis="...">
                {project.requestCategoryName === null
                  ? project.issueImpactMasterValue
                    ? project.issueImpactMasterValue
                    : " "
                  : project.requestCategoryName}
              </Truncate>
            )}
          </Link>
        }
      />
      <CardContent
        className={classes.content}
        style={{
          filter:
            !hideTimer &&
              permissions === CO_ROLE_MRA &&
              project.outstandingRequest &&
              !project.expired
              ? "blur(2px)"
              : "none",
        }}
      >
        <div className={classes.description}>
          <Typography color="textSecondary" variant="subtitle2">
            {project.communicationRequestId &&
              project.requeststatus === "Pending" ? (
              <>
                <Truncate lines={1} ellipsis="...">
                  <b style={{ color: "#263238" }}>Institution:</b>{" "}
                  {submittedInstitution["institutionName"]
                    ? submittedInstitution["institutionName"]
                    : ""}
                </Truncate>
                <br />
              </>
            ) : (
              <>
                <Truncate lines={1} ellipsis="...">
                  <b style={{ color: "#263238" }}>Institution:</b>{" "}
                  {project.sourceinstitutionname
                    ? project.sourceinstitutionname
                    : ""}
                </Truncate>
                <br />
              </>
            )}
            {project.categoryType === "addendum" ? (
              <Truncate lines={1} ellipsis={<span>...</span>}>
                <b style={{ color: "#263238" }}>Department:</b>{" "}
                {project.departmentname ? project.departmentname : ""}
              </Truncate>
            ) : (
              <Truncate lines={1} ellipsis={<span>...</span>}>
                <b style={{ color: "#263238" }}>Request Type:</b>{" "}
                {JSON.parse(project.requestType)?.other
                  ? JSON.parse(project.requestType)?.other_value
                  : JSON.parse(project.requestType)?.value}
              </Truncate>
            )}
            <br />
          </Typography>
        </div>
        <div className={classes.tags}>
          <Label
            color={statuscolor}
            variant="contained"
            shape="square"
            id="status"
            className=""
            style={{}}
          >
            {project.requeststatus}
          </Label>
          {!project.expired &&
            project.categoryType === "request" &&
            (project.requeststatus.toLowerCase() ===
              project.requestTriggerStatus.toLowerCase() ||
              (project.requestTriggerStatus.toLowerCase() === "new" &&
                project.requeststatus.toLowerCase() === "acknowledged")) && (
              <Chip
                variant="outlined"
                size="small"
                id="hourglass"
                icon={
                  <HourglassBottomIcon
                    fontSize="small"
                    className={classes.rotateIcon}
                    id="hourglass"
                    style={{
                      color: project.noOfDays < 10 ? "#d50f0f" : "#008000",
                    }}
                  />
                }
                style={{
                  color: project.noOfDays < 10 ? "#d50f0f" : "#008000",
                  border:
                    project.noOfDays < 10
                      ? "1px solid #d50f0f"
                      : "1px solid #008000",
                  alignSelf: "center",
                }}
                label={
                  project.noOfDays > 0
                    ? `${project.noOfDays} days to expire`
                    : project.noOfDaysToExpire
                }
              />
            )}
          {!project.expired &&
            project.categoryType !== "request" &&
            (project.requeststatus.toLowerCase() === "new" ||
              project.requeststatus.toLowerCase() === "acknowledged") && (
              <Chip
                variant="outlined"
                size="small"
                id="hourglass"
                icon={
                  <HourglassBottomIcon
                    fontSize="small"
                    className={classes.rotateIcon}
                    style={{
                      color: project.noOfDays > 20 ? "#d50f0f" : "#008000",
                    }}
                  />
                }
                style={{
                  color: project.noOfDays > 20 ? "#d50f0f" : "#008000",
                  border:
                    project.noOfDays > 20
                      ? "1px solid #d50f0f"
                      : "1px solid #008000",
                  alignSelf: "center",
                }}
                label={
                  project.noOfDays !== 29
                    ? `${29 - project.noOfDays} days to expire`
                    : "Expires Today"
                }
              />
            )}
          {(permissions === CO_ROLE_PPA || permissions === CO_ROLE_PATIENT) &&
            project.categoryType === "request" &&
            project.expired &&
            (project.requeststatus.toLowerCase() ===
              project.requestTriggerStatus.toLowerCase() ||
              (project.requestTriggerStatus.toLowerCase() === "new" &&
                project.requeststatus.toLowerCase() === "acknowledged")) && (
              <Chip
                variant="outlined"
                size="small"
                id="hourglass"
                icon={
                  <AccessTimeFilled
                    fontSize="small"
                    style={{
                      color: "#d50f0f",
                    }}
                  />
                }
                style={{
                  color: "#d50f0f",
                  border: "1px solid #d50f0f",
                  alignSelf: "center",
                }}
                label={"Expired"}
              />
            )}
          {(permissions === CO_ROLE_PPA || permissions === CO_ROLE_PATIENT) &&
            (project.requeststatus.toLowerCase() === "new" ||
              project.requeststatus.toLowerCase() === "acknowledged") &&
            project.categoryType !== "request" &&
            project.expired && (
              <Chip
                variant="outlined"
                size="small"
                id="hourglass"
                icon={
                  <AccessTimeFilled
                    fontSize="small"
                    style={{
                      color: "#d50f0f",
                    }}
                  />
                }
                style={{
                  color: "#d50f0f",
                  border: "1px solid #d50f0f",
                  alignSelf: "center",
                }}
                label={"Expired"}
              />
            )}
        </div>

        <Divider />
        <div className={classes.details}>
          <Grid
            alignItems="center"
            container
            justify="space-between"
            spacing={3}
          >
            {project.categoryType !== "addendum" &&
              !project.communicationRequestId &&
              project.requeststatus !== "Pending" && (
                <Grid item>
                  <Typography variant="body2">
                    {project.assignedfname !== null ? "Assigned To" : ""}
                  </Typography>
                  <Typography variant="h5" style={{ fontSize: "15px" }}>
                    {project.assignedfname !== null
                      ? project.assignedfname +
                      " " +
                      project.assignedmname +
                      " " +
                      project.assignedlastname
                      : " "}
                  </Typography>
                </Grid>
              )}
            {project.categoryType !== "billing" && (
              <Grid item>
                <Typography variant="body2">Priority</Typography>
                <Typography variant="h5" style={{ fontSize: "15px" }}>
                  {project.requestpriority}
                </Typography>
              </Grid>
            )}
          </Grid>
          <div style={{ display: "inline-flex", width: "100%" }}>
            {project.categoryType === "request" && (
              <Grid
                alignItems="flex-start"
                container
                justify="flex-start"
                spacing={3}
                style={{ padding: "5px 10px" }}
              >
                {authStatus && (
                  <>
                    {authStatus.map((authIndiv: IRequestToken) => (
                      <>
                        {authIndiv.authFormType === 1 && (
                          <>
                            {authIndiv.isFilled === true ? (
                              <img
                                src={HIPAAFilled}
                                className={classes.authImage}
                                alt="..."
                                id="hipaa-filled"
                              />
                            ) : (
                              <img
                                src={HIPAANotFilled}
                                className={classes.authImage}
                                alt="..."
                                id="hipaa-not-filled"
                              />
                            )}
                          </>
                        )}
                        {authIndiv.authFormType === 2 && (
                          <>
                            {authIndiv.isFilled === true ? (
                              <img
                                src={substancedisorderFilled}
                                className={classes.authImage}
                                alt="..."
                                id="substance-disorder-filled"
                              />
                            ) : (
                              <img
                                src={substancedisorderNotFilled}
                                className={classes.authImage}
                                alt="..."
                                id="substance-disorder-not-filled"
                              />
                            )}
                          </>
                        )}
                      </>
                    ))}
                  </>
                )}
                {project.healthInformationAuth ? (
                  <img
                    src={HIPAAFilled}
                    className={classes.authImage}
                    alt="..."
                    id="hipaa-filled"
                  />
                ) : (
                  ""
                )}
                {project.disorderRequestAuth ? (
                  <img
                    src={substancedisorderFilled}
                    className={classes.authImage}
                    alt="..."
                    id="substance-disorder-filled"
                  />
                ) : (
                  ""
                )}
                {project.signatureId && project.isRequestedSupport ? (
                  <img
                    src={signingFilled}
                    className={classes.authImage}
                    alt="..."
                    id="signing-filled"
                  />
                ) : project.hasSignedRequest && project.isRequestedSupport ? (
                  <img
                    src={signingFilled}
                    className={classes.authImage}
                    alt="..."
                    id="signing-filled"
                  />
                ) : (
                  project.isRequestedSupport && (
                    <img
                      src={signingNotFilled}
                      className={classes.authImage}
                      alt="..."
                      id="signing-not-filled"
                    />
                  )
                )}
              </Grid>
            )}

            <Grid
              alignItems="flex-end"
              container
              justify="flex-end"
              spacing={3}
            >
              <Grid item>
                {project.expired &&
                  project.requeststatus !== "Pending" &&
                  !emailNotVerified && (
                    <PDFDownloadLink
                      document={
                        <MyDocument
                          data={project}
                          obtainData={obtainData}
                          contactData={contactData}
                          doctorData={doctorData}
                          hipaa={hipaaFileData}
                          medical={medicalFileData}
                          disorder={disorderFileData}
                          addendumForm={fileData}
                          screenshot={editedImageData}
                          hipaaData={hipaaData}
                          sudData={sudData}
                          legalIdData={legalIdData}
                          hipaaSignData={hipaaSignData}
                          sudSignData={sudSignData}
                          attachmentData={attachmentData}
                          proxyData={proxyData}
                          billingData={billingData}
                        />
                      }
                      fileName="request.pdf"
                    >
                      {({ url, loading }) =>
                        loading ? (
                          <CircularProgress
                            color="inherit"
                            className={classes.loader}
                            size={18}
                          />
                        ) : (
                          <Tooltip title="Download">
                            <IconButton
                              id="download"
                              className={classes.shareButton}
                              size="small"
                              onClick={() => openInNewTab(url)}
                              disabled={emailNotVerified}
                            >
                              <GetAppIcon />
                            </IconButton>
                          </Tooltip>
                        )
                      }
                    </PDFDownloadLink>
                  )}
                {project.requeststatus === "Pending" &&
                  project.communicationRequestId && (
                    <Tooltip title="Review request and send to provider">
                      <IconButton
                        onClick={() => editRequest(project.trackId)}
                        className={classes.shareButton}
                        size="small"
                        disabled={emailNotVerified}
                        id="edit"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                <Tooltip title="View more">
                  <IconButton
                    id="view-more"
                    onClick={() => viewMoreRequest(project.trackId)}
                    style={{ color: "#009900" }}
                    className={classes.shareButton}
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => setOpenBase(true)}
                    className={classes.shareButton}
                    size="small"
                    id="delete"
                    disabled={emailNotVerified}
                    style={{ color: "#f20029", width: "20px" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                {openBase && (
                  <BaseModal
                    open={openBase}
                    confirmAction={deleteConfirmation}
                    onClose={() => setOpenBase(false)}
                    title="Delete Request"
                    content={`Do you want to delete request?`}
                    successButtonName="Confirm"
                    type="delete"
                  />
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectCard;
