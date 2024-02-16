import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useDataProvider, usePermissions, useTranslate } from "react-admin";
import { getImagesByFileUploadId } from "./../../../../service/restConfig";
import {
  Card,
  CardContent,
  Typography,
  ListItem,
  Grid,
  InputLabel,
  TextField,
  Checkbox,
  Divider,
  TextareaAutosize,
  FormControl,
  FormControlLabel,
  IconButton,
} from "@material-ui/core";
import { perPageList, perPageMax } from "./../../../../utils/pageConstants";
import {
  CO_ROLE_MRA,
  CO_ROLE_PATIENT,
  CO_ROLE_PPA,
} from "../../../../utils/roles";
import ReviewForm from "../Activities/ReviewForm";
import DenialForm from "../Activities/DenialForm";
import { BootstrapTooltip as Tooltip } from "../../../../components/Tooltip";
import { Info } from "@material-ui/icons";
import moment from "moment";
import DenialFormDetail from "../Activities/DenialFormDetail";
import ContentGenerator from "./contentGenerator";
import useBrief from "../../../../hooks/useBrief";
import BaseModal from "../../../../components/baseModal";

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

function Brief({ request, ...rest }): JSX.Element {
  const {
    useStyles,
    deniedReasonList,
    requestDenial,
    getDenialFormViews,
    fileData,
    blobToFile,
    handleInternalChangeReason,
    internalReasonList,
    showInternalOptions,
    handleInternalDenialChange,
    submitRequestDenial,
    submitStatusChangeSet,
    handleChangeReason,
    handleStatusChange,
    shareInternalDenial,
    setReasonList,
    setShowAlert,
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
    showAlert,
    confirmRequestDenial,
    onCancel,
    setShowInternalOptions,
    setInternalReasonList,
  } = useBrief({ request });
  const classes = useStyles();
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const [highlight, setHighlight] = useState("");
  const [infBlockingData, setInfBlockingData] = useState([]);
  const [authStatus, setAuthStatus] = useState<IRequestToken[]>([]);
  const { permissions } = usePermissions();
  const [highlightSensitive, setHighlightSensitive] = useState("");
  const [showDenyOptions, setShowDenyOptions] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setEmailNotVerified(true);
    }
  }, [userInfoReducer]);
  useEffect(() => {
    let mounted = true;
    function getRequestStatus(): void {
      dataProvider
        .getList("requestStatusMasters", {
          pagination: { page: 1, perPage: perPageList },
          sort: { field: "id", order: "ASC" },
          filter: {},
        })
        .then(({ data }) => {
          if (mounted) {
            setRequestStatusList(data);
          }
        })
        .catch(() => {
          //
        });
    }
    if (userInfoReducer.role !== CO_ROLE_PATIENT) {
      getRequestStatus();
    }
    return () => {
      mounted = false;
    };
  }, [userInfoReducer]);

  useEffect(() => {
    if (request.requeststatus === "Denied") {
      getDenialFormViews();
    }
  }, [request.requeststatus]);

  useEffect(() => {
    let isHipaa = false,
      isSud = false;
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        requestId: request.id,
      },
    };
    async function getToken(): Promise<void> {
      try {
        const { data } = await dataProvider.getList(
          "requestTokenV1s",
          queryOption,
        );
        setAuthStatus(data);

        authStatus.forEach((authIndiv: IRequestToken) => {
          if (authIndiv.authFormType === 1) {
            isHipaa = true;
          }
          if (authIndiv.authFormType === 2) {
            isSud = true;
          }
        });

        if (permissions === CO_ROLE_MRA) {
          if (
            !request.healthInformationAuth &&
            !request.hipaaAuthorizationFileId &&
            isHipaa
          ) {
            setHighlight("red");
          }
          if (
            !request.disorderDisclosureAuthorizationFileId &&
            !request.disorderRequestAuth &&
            isSud
          ) {
            setHighlightSensitive("red");
          }
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    if (request.categoryType === "request") {
      getToken();
    }
  }, [highlightSensitive, highlight, permissions, authStatus]);

  useEffect(() => {
    let mounted = true;
    const queryOptionFile = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        id: request.signatureId,
      },
    };

    const queryOptionInf = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {},
    };
    function getInfBlockingDetails(): void {
      dataProvider
        .getList("informationBlockingExceptionsMaster", queryOptionInf)
        .then(({ data }) => {
          if (mounted) {
            setInfBlockingData(data);
          }
        });
    }

    function getFileDetails(): void {
      dataProvider.getList("fileUploads", queryOptionFile).then(({ data }) => {
        if (data.length > 0) {
          getImagesByFileUploadId({
            fileName: data[0].fileName,
          }).then((res: Blob) => {
            blobToFile(res, data[0].fileName);
          });
        }
      });
    }
    if (request.signatureId !== null) {
      if (mounted) {
        getFileDetails();
      }
    }
    if (mounted) {
      if (userInfoReducer.role === CO_ROLE_MRA) {
        getInfBlockingDetails();
      }
    }
    return () => {
      mounted = false;
    };
  }, [request]);

  const listClass = classNames(classes.listitemStyle);

  return (
    <>
      {showAlert && (
        <BaseModal
          open={showAlert}
          confirmAction={submitRequestDenial}
          onClose={() => {
            setShowAlert(false);
          }}
          title={translate("resources.requests.deny.denyTitle")}
          content={translate("resources.requests.deny.denyMessage")}
          subContent={[translate("resources.requests.deny.denySubMessage")]}
          successButtonName="Continue"
        />
      )}

      <Card {...rest} className={classes.root}>
        <CardContent style={{ wordBreak: "break-word" }}>
          {request && Object.entries(request).length > 0 && (
            <>
              <Typography
                variant="subtitle1"
                className={classes.requestedBy}
                style={{
                  width: "98%",
                  padding: "8px 9px",
                  color:
                    localStorage.getItem("Theme") === "dark"
                      ? "white"
                      : "rgb(135, 135, 135)",
                  border: "1px solid #718cc7",
                  borderRadius: "5px",
                  background:
                    localStorage.getItem("Theme") === "dark"
                      ? "grey"
                      : "aliceblue",
                  fontWeight: 600,
                }}
              >
                {request.categoryType === "request"
                  ? "Medical Record Requested By: "
                  : request.categoryType === "addendum"
                  ? "Correction/Amendment Requested By: "
                  : "Billing/Insurance Question Requested By: "}
                <b
                  style={{
                    color:
                      localStorage.getItem("Theme") === "dark"
                        ? "lightblue"
                        : "#718cc7",
                  }}
                >
                  {`${request.createdfname} ${request.createdlastname}`}
                </b>
              </Typography>
            </>
          )}

          {request && <ContentGenerator request={request} />}
          {request.categoryType === "request" && (
            <ListItem className={listClass} disableGutters>
              <Typography
                variant="subtitle1"
                className={classes.h6_title}
                style={{ color: highlightSensitive ? highlightSensitive : "" }}
              >
                These records contain sensitive information such as substance
                use disorder or mental health condition?: &nbsp;
              </Typography>
              <Typography
                variant="subtitle2"
                className={classes.subtitle}
                style={{ color: highlightSensitive ? highlightSensitive : "" }}
              >
                {Object.entries(request).length > 0 && (
                  <>{request.hasSensitiveInformation ? "Yes" : "No"}</>
                )}
              </Typography>
            </ListItem>
          )}
          {request.categoryType === "request" && (
            <ListItem className={listClass} disableGutters>
              <Typography
                variant="subtitle1"
                className={classes.h6_title}
                style={{ color: highlight ? highlight : "" }}
              >
                Do you have a signed HIPAA authorization form?: &nbsp;
              </Typography>
              <Typography
                variant="subtitle2"
                className={classes.subtitle}
                style={{ color: highlight ? highlight : "" }}
              >
                {Object.entries(request).length > 0 && (
                  <>
                    {request.healthInformationAuth ? "Yes" : "No"}
                    {permissions === CO_ROLE_MRA && (
                      <>
                        {!request.healthInformationAuth && highlight
                          ? " (An email with HIPAA form link is sent at " +
                            (authStatus[0].resendDate
                              ? moment(authStatus[0].resendDate).format(
                                  "DD MMM YYYY hh:mm a",
                                )
                              : moment(request.createdat).format(
                                  "DD MMM YYYY hh:mm a",
                                ) + ")")
                          : ""}
                        {!request.healthInformationAuth && !highlight
                          ? " (Filled HIPAA authorization form is received)"
                          : ""}
                      </>
                    )}
                  </>
                )}
              </Typography>
            </ListItem>
          )}
          {request.categoryType === "request" && request.additionalNotes && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.notesTitle}>
                Additional Notes: &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.notes}>
                {request.additionalNotes}
              </Typography>
            </ListItem>
          )}
          {fileData && (
            <div style={{ float: "right", paddingBottom: "30px" }}>
              <Typography variant="subtitle1" className={classes.h6_title}>
                Signature: &nbsp;
              </Typography>
              <img
                src={URL.createObjectURL(fileData)}
                style={{ width: "150px", height: "150px" }}
              />
            </div>
          )}
        </CardContent>
      </Card>
      {request.requeststatus !== "Pending" &&
        permissions !== CO_ROLE_PATIENT &&
        !emailNotVerified && (
          <Card className={classes.root}>
            <CardContent className={classes.cardContent}>
              <Grid alignItems="flex-end" container justify="space-between">
                <Grid item md={12} style={{ paddingTop: "16px" }} xs={12}>
                  <Typography
                    variant="h5"
                    style={{ fontSize: 16, fontWeight: 500 }}
                    gutterBottom
                  >
                    {request.requeststatus === "Cancelled"
                      ? "Request Status"
                      : "Change Request Status"}
                  </Typography>
                  {request.requeststatus !== "Cancelled" && (
                    <Typography
                      variant="h5"
                      style={{ fontSize: 14, fontWeight: 500 }}
                      gutterBottom
                    >
                      (Select the new status from the status dropdown)
                    </Typography>
                  )}
                  <Divider style={{ marginBottom: "20px" }} />
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={12}
                  style={{ display: "inline-flex", marginBottom: "2px" }}
                >
                  <InputLabel style={{ fontSize: "12px" }}>
                    Current Status
                  </InputLabel>
                </Grid>
                <Grid
                  item
                  md={2}
                  xs={12}
                  style={{ display: "inline-flex", marginBottom: "2px" }}
                ></Grid>

                <Grid
                  item
                  md={4}
                  xs={12}
                  style={{ display: "inline-flex", marginBottom: "2px" }}
                >
                  {(permissions === CO_ROLE_PPA &&
                    request.requeststatus !== "Cancelled") ||
                    (permissions === CO_ROLE_MRA &&
                      request.requeststatus !== "Denied" && (
                        <InputLabel style={{ fontSize: "12px" }}>
                          New Status
                        </InputLabel>
                      ))}
                </Grid>

                <Grid item md={4} xs={12} style={{ display: "inline-flex" }}>
                  <Typography
                    variant="h5"
                    style={{ fontSize: 16 }}
                    gutterBottom
                  >
                    <IconButton
                      size="small"
                      disabled
                      style={{ marginBottom: "0px" }}
                    >
                      {request.requeststatus === "New" && (
                        <CheckCircleIcon style={{ color: "Orange" }} />
                      )}
                      {request.requeststatus === "Acknowledged" && (
                        <CheckCircleIcon style={{ color: "Green" }} />
                      )}
                      {request.requeststatus === "Cancelled" && (
                        <CancelIcon style={{ color: "Red" }} />
                      )}
                      {request.requeststatus === "Resolved" && (
                        <VerifiedIcon style={{ color: "Blue" }} />
                      )}
                      {request.requeststatus === "Denied" && (
                        <DoDisturbIcon style={{ color: "Red" }} />
                      )}
                    </IconButton>{" "}
                    {request.requeststatus}
                  </Typography>
                </Grid>

                <Grid item md={2} xs={12} style={{ display: "inline-flex" }}>
                  {(permissions === CO_ROLE_PPA &&
                    request.requeststatus !== "Cancelled") ||
                  (permissions === CO_ROLE_MRA &&
                    request.requeststatus !== "Denied") ? (
                    <Typography
                      variant="h5"
                      style={{ fontSize: 14 }}
                      gutterBottom
                    >
                      To
                    </Typography>
                  ) : (
                    ""
                  )}
                </Grid>

                {(permissions === CO_ROLE_PPA &&
                  request.requeststatus !== "Cancelled") ||
                (permissions === CO_ROLE_MRA &&
                  request.requeststatus !== "Denied") ? (
                  <Grid item md={4} xs={12} style={{ display: "inline-flex" }}>
                    <TextField
                      fullWidth
                      margin="dense"
                      // label="New Status"
                      name="requestStatus"
                      onChange={handleStatusChange}
                      select
                      className={classes.dropdown}
                      style={{ fontSize: "14px" }}
                      SelectProps={{ native: true }}
                      value={requestStatus}
                    >
                      <option
                        key="-1"
                        value="-1"
                        className={classes.dropdown}
                        hidden
                      >
                        {translate("resources.requests.dropdown.statusChange")}
                      </option>
                      {requestStatusList.map((option) =>
                        permissions === CO_ROLE_PPA
                          ? option.code !== "NEW" &&
                            option.code === "CANCELLED" &&
                            option.value !== request.requeststatus && (
                              <option
                                key={option.id.toString()}
                                value={option.id}
                                className={classes.dropdown}
                              >
                                {option.value}
                              </option>
                            )
                          : Number(option.id) >
                              Number(request.requestStatusId) && (
                              <option
                                key={option.id.toString()}
                                value={option.id}
                                className={classes.dropdown}
                              >
                                {option.value}
                              </option>
                            ),
                      )}
                    </TextField>
                  </Grid>
                ) : (
                  ""
                )}
                <Grid item md={12} xs={12}>
                  {showReviewForm && (
                    <ReviewForm submitStatusChange={submitStatusChangeSet} />
                  )}
                  {showDenialForm && request.requeststatus !== "Denied" && (
                    <Card {...rest} className={classes.root}>
                      <CardContent style={{ wordBreak: "break-word" }}>
                        <Typography
                          variant="h5"
                          style={{ fontSize: 16, fontWeight: 500 }}
                          gutterBottom
                        >
                          <b>Deny Request:</b>
                        </Typography>
                        <Divider />
                        <Grid
                          container
                          spacing={3}
                          style={{ marginTop: "15px" }}
                        >
                          <Grid item md={12} xs={12}>
                            <FormControlLabel
                              name="isRequestCannotFilled"
                              onChange={() => {
                                setShowDenyOptions(!showDenyOptions);
                                setIsExceptionId(!isExceptionId);
                                if (showDenyOptions) {
                                  setShowInternalOptions(false);
                                  setNotes("");
                                  setInternalReasonList([]);
                                  setReasonList([]);
                                }
                              }}
                              control={<Checkbox color="primary" />}
                              label={
                                <Typography
                                  variant="h5"
                                  style={{ fontSize: 14, fontWeight: 500 }}
                                >
                                  Unfortunately we cannot honor all or part of
                                  your request because:
                                </Typography>
                              }
                            />
                          </Grid>
                          <Grid item lg={12} xl={12} xs={12}>
                            {showDenyOptions && (
                              <>
                                {Object.entries(deniedReasonList).length >
                                  0 && (
                                  <>
                                    {deniedReasonList.map((each) => (
                                      <>
                                        <FormControlLabel
                                          name={each.code}
                                          value={reasonList[each.code]}
                                          onChange={(e) =>
                                            handleChangeReason(e, each.id)
                                          }
                                          control={<Checkbox color="primary" />}
                                          label={each.value}
                                        />
                                        <br />
                                        <br />
                                      </>
                                    ))}
                                  </>
                                )}
                              </>
                            )}

                            {showInternalOptions && (
                              <Grid item md={12} xs={12} spacing={0}>
                                {infBlockingData.map((individuals, key) => (
                                  <>
                                    <div
                                      style={{ width: "50%", float: "left" }}
                                      key={key}
                                    >
                                      <FormControlLabel
                                        name={individuals.value}
                                        value={individuals.id}
                                        onChange={(e) =>
                                          handleInternalChangeReason(
                                            e,
                                            individuals.id,
                                          )
                                        }
                                        control={<Checkbox color="primary" />}
                                        label={individuals.value}
                                      />
                                      <br />
                                    </div>
                                  </>
                                ))}
                                <Grid item md={12} xs={12}>
                                  <FormControl fullWidth>
                                    <TextareaAutosize
                                      className={classes.notesArea}
                                      name="notes"
                                      onChange={handleChange}
                                      style={{ fontSize: "14px" }}
                                      required
                                      value={notes}
                                      placeholder="Add notes for internal use here ..."
                                      minRows={6}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12}>
                                  <FormControlLabel
                                    name="shareInternalDenial"
                                    onChange={handleInternalDenialChange}
                                    disabled={
                                      Object.entries(internalReasonList)
                                        .length > 0
                                        ? false
                                        : true
                                    }
                                    control={<Checkbox color="primary" />}
                                    label={
                                      <div
                                        style={{
                                          display: "flex",
                                          marginTop: "3px",
                                        }}
                                      >
                                        <Typography
                                          variant="h5"
                                          style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                          }}
                                        >
                                          Share these internal notes with
                                          patient
                                        </Typography>
                                        <Tooltip
                                          arrow
                                          placement="top"
                                          title={translate(
                                            "tooltip.brief.denial_checkbox",
                                          )}
                                        >
                                          <Info className={classes.info} />
                                        </Tooltip>
                                      </div>
                                    }
                                  />
                                </Grid>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                        <DenialForm
                          onSubmit={confirmRequestDenial}
                          deniedReasonList={deniedReasonList}
                          request={request}
                          onCancel={onCancel}
                          history={history}
                          idVal={request.id}
                          isExceptionId={isExceptionId}
                          exceptionIds={internalReasonList}
                          selectedReasons={reasonList}
                          shareInternalDenial={shareInternalDenial}
                          notes={notes}
                        />
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      {request.requeststatus === "Denied" && (
        <Grid item lg={12} xl={12} xs={12} style={{ marginBottom: "15px" }}>
          <DenialFormDetail
            deniedReasonList={deniedReasonList}
            request={request}
            requestDenial={requestDenial}
            history={history}
          />
        </Grid>
      )}
    </>
  );
}

Brief.propTypes = {
  request: PropTypes.object,
  className: PropTypes.string,
};

export default Brief;
