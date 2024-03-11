import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  makeStyles,
} from "@material-ui/core";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Popover,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useDataProvider, useNotify, useTranslate } from "react-admin";
import { getImagesByFileUploadId } from "../service/restConfig";
import IdVerificationAgreement from "./idVerification/idVerificationAgreement";
import noLogo from "../images/noLogo.png";
import { ExpandableText } from "./expandableText";
import { AccessTimeFilled, TaskAlt } from "@mui/icons-material";
import {
  Cancel,
  CheckCircle,
  DeleteSweep,
  Error,
  ErrorOutline,
  ExpandMore,
  FileCopy,
  Info,
  KeyboardArrowDown,
  Sync,
} from "@material-ui/icons";
import { blobToFile } from "../utils/images/blobToFile";
import type {
  GetIdVerificationTransactionMutation,
  GetIdVerificationTransactionMutationVariables,
  Integration,
  UpdateIdentityVerificationV1Input,
  UpdateIdentityVerificationV1Mutation,
  UpdateIdentityVerificationV1MutationVariables,
  TransactionLogResponse,
  UnenrollPatientMutation,
  UnenrollPatientMutationVariables,
} from "../__generated__/typescript-operations_all";
import { BootstrapTooltip as Tooltip } from "./Tooltip";
import useTraces from "../hooks/useTraces";
import { useSelector } from "react-redux";
import type { AppState, IIntegrationProps, IStatusProps } from "../types";
import moment from "moment";
import { useMutation } from "@apollo/react-hooks";
import getIdVerificationTransaction from "../queries/getIdVerificationTransaction/getIdVerificationTransaction";
import { correlationConstants } from "../utils/OT/correlationConstants";
import updateIdentityVerification from "../queries/updateIdentityVerification/updateIdentityVerification";
import BaseModal from "./baseModal";
import VerificationSuccessModal from "./idVerification/verificationSuccessModal";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { titleCase } from "../utils/titleCase";
import unenrollPatient from "../queries/unenrollPatient/unenrollPatient";
import UnEnrollConfirm from "./unEnrollConfirm";

function IntegrationListItem({
  eachIntegration,
  setReloadIntegrations,
}: IIntegrationProps) {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      margin: "10px",
      "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
        {
          display: "none",
        },
      "& .MuiDataGrid-menuOpen": {
        display: "none",
      },
      "& .MuiDataGrid-root .MuiDataGrid-columnHeader:focus, .MuiDataGrid-root .MuiDataGrid-cell:focus":
        {
          outline: "none !important",
        },
      "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
        outline: "none !important",
      },
    },
    image: {
      [theme.breakpoints.down("sm")]: {
        width: "50%",
        height: "30%",
      },
      [theme.breakpoints.up("sm")]: {
        width: "100%",
        height: "auto",
      },
      marginRight: "20px",
    },
    verified: {
      marginRight: "20px",
      fontWeight: 500,
    },
    tickIcon: {
      color: "#2AAA8A",
      width: "30px",
      height: "30px",
      marginRight: "10px",
    },
    moreInfo: {
      textTransform: "none",
      fontWeight: 600,
      pointerEvents: "auto",
    },
    button: {
      textTransform: "none",
      color: "white",
      width: "150px",
      marginTop: "5px",
      backgroundColor: eachIntegration.recordStatusId !== 1 ? "grey" : "",
    },
    infoText: { fontSize: 12, fontWeight: 500 },
  }));
  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const { getTrace, handleTrace } = useTraces();
  const dataProvider = useDataProvider();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [openErrorBase, setOpenErrorBase] = useState<boolean>(false);
  const [openBase, setOpenBase] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<string>(null);
  const [fileResult, setFileResult] = useState<string>(null);
  const [selectedId, setSelectedId] = useState<string>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [openAgreement, setOpenAgreement] = useState<boolean>(false);
  const [openUnenrollSuccess, setOpenUnenrollSuccess] =
    useState<boolean>(false);
  const [openUnenrollError, setOpenUnenrollError] = useState<boolean>(false);
  const [openUnenrollConfirm, setOpenUnenrollConfirm] =
    useState<boolean>(false);
  const [selectedSystem, setSelectedSystem] = useState<Integration>();
  const [loading, setLoading] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [visibleAccordions, setVisibleAccordions] = useState<number>(5);
  const [transactionList, setTransactionList] = useState<
    TransactionLogResponse[]
  >([]);
  const [subscribeGetIdVerificationTransaction] = useMutation<
    GetIdVerificationTransactionMutation,
    GetIdVerificationTransactionMutationVariables
  >(getIdVerificationTransaction, {});
  const [unenrollPatientMutation] = useMutation<
    UnenrollPatientMutation,
    UnenrollPatientMutationVariables
  >(unenrollPatient, {});
  const [subscribeUpdateIdentityVerificationMutation] = useMutation<
    UpdateIdentityVerificationV1Mutation,
    UpdateIdentityVerificationV1MutationVariables
  >(updateIdentityVerification, {});
  useEffect(() => {
    if (eachIntegration.logoFileId) {
      getFileDetails(eachIntegration.logoFileId);
    } else {
      setFileResult(noLogo);
    }
  }, [eachIntegration.logoFileId]);
  useEffect(() => {
    //
  }, [openUnenrollSuccess]);
  const handleViewMoreClick = (): void => {
    setVisibleAccordions(visibleAccordions + 5);
  };
  const copyTransactionId = (transactionId: string): void => {
    navigator.clipboard.writeText(transactionId);
    notify(translate(`resources.integration.transactionIdCopyMessage`), {
      type: "info",
    });
  };
  const verifyAction = (eachIntegration: Integration): void => {
    if (
      eachIntegration.verificationStatus === 0 &&
      eachIntegration.transactionId
    ) {
      checkStatus({
        transId: eachIntegration.transactionId,
        partyId: eachIntegration.id,
      });
    } else {
      getTrace("Click on Start verify", "ev-157", userInfoReducer.email);
      setSelectedSystem(eachIntegration);
      setOpenAgreement(true);
    }
  };
  const unEnrollPatient = (eachIntegration: Integration): void => {
    unenrollPatientMutation({
      variables: {
        input: {
          externalSystemId: eachIntegration.id,
          patientId: userInfoReducer.id,
        },
      },
    }).then((res) => {
      if (res.data.unenrollPatient.requestApiResponse.success) {
        setOpenUnenrollSuccess(true);
      } else {
        setOpenUnenrollError(true);
      }
    });
  };
  function getFileDetails(picId: string): void {
    const queryOptionFile = {
      pagination: { page: 1, perPage: 1 },
      sort: { field: "id", order: "ASC" },
      filter: {
        id: picId,
      },
    };
    dataProvider.getList("fileUploads", queryOptionFile).then(({ data }) => {
      if (data.length > 0) {
        getImagesByFileUploadId({
          fileName: data[0].fileName,
        }).then((res: Blob) => {
          setFileResult(URL.createObjectURL(blobToFile(res, data[0].fileName)));
        });
      }
    });
  }
  const checkStatus = ({ transId, partyId }: IStatusProps): void => {
    const eventObj = correlationConstants["ev-165"];
    const identityVerificationInput: UpdateIdentityVerificationV1Input = {
      updateData: {
        externalSystemPatientId: partyId,
        transactionId: transId,
        status: "SUCCESS",
        errorType: null,
      },
      event: "manual_user_status_verification",
    };
    const inputContext = {
      action: "Verification completed and message displayed",
      aecId: eventObj.aecId,
      aecIeId: eventObj.aecIeId,
    };
    handleTrace(
      eventObj.eventTitle,
      inputContext,
      (spanContext: any, fingerprint: any) => {
        identityVerificationInput.otContext = JSON.stringify(spanContext);
        identityVerificationInput.fingerPrint = fingerprint;
        identityVerificationInput.otTags = JSON.stringify({
          name: "Verification completed and message displayed",
        });
        subscribeUpdateIdentityVerificationMutation({
          variables: {
            input: identityVerificationInput,
          },
        }).then((response) => {
          handleClose();
          if (
            response.data.updateIdentityVerificationV1.requestResult.success
          ) {
            if (
              response.data.updateIdentityVerificationV1.requestResult
                .status === "error"
            ) {
              setErrorType("error");
            }
            setOpenBase(true);
          } else {
            setOpenErrorBase(true);
          }
        });
      },
    );
  };
  async function handleAccordionExpand(event, transId) {
    setSelectedId(transId);
    event.stopPropagation();
    setExpanded(!expanded);
  }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setVisibleAccordions(5);
    subscribeGetIdVerificationTransaction({
      variables: {
        input: {
          externalSystemId: eachIntegration.id,
        },
      },
    }).then((res) => {
      if (
        res.data.getIdVerificationTransaction.transactionRequestLogResponse.data
      ) {
        setTransactionList(
          res.data.getIdVerificationTransaction.transactionRequestLogResponse
            .data,
        );
        setLoading(false);
      } else {
        setTransactionList([]);
        setLoading(false);
      }
    });
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorEl(null);
    setExpanded(false);
    setSelectedId(null);
  };
  return (
    <Card className={classes.root}>
      {openBase && (
        <VerificationSuccessModal
          open={openBase}
          onClose={() => {
            setOpenBase(false);
          }}
          modalType={errorType ? "error" : "success"}
          errorType={errorType}
          selectedSystem={null}
          setReloadIntegrations={setReloadIntegrations}
        />
      )}
      {openErrorBase && (
        <BaseModal
          open={openErrorBase}
          confirmAction={() => {
            setOpenErrorBase(false);
          }}
          onClose={() => {
            setOpenErrorBase(false);
          }}
          title={"Error"}
          content={translate("resources.requests.notification.errorMessageMrr")}
          closeButtonName="Close"
          type="requestError"
        />
      )}
      <CardContent>
        <Grid container alignItems="center" spacing={3}>
          <Grid item md={1} sm={12}>
            {fileResult ? (
              <img src={fileResult} className={classes.image} />
            ) : (
              <CircularProgress className={classes.image} />
            )}
          </Grid>
          <Grid item md={4} sm={12}>
            <Typography variant="h5" style={{ fontWeight: 600 }} gutterBottom>
              {eachIntegration.systemName}
            </Typography>
            <Typography variant="body1">
              <ExpandableText text={eachIntegration.description} maxLines={2} />
            </Typography>
          </Grid>
          <Grid item md={7} sm={12}>
            <div className="verificationContainer">
              {eachIntegration.verificationStatus === 1 ? (
                <>
                  <TaskAlt className={classes.tickIcon} />
                  <Typography className={classes.verified}>
                    Verified on{" "}
                    {moment(eachIntegration.verifiedAt).format("DD, MMMM YYYY")}{" "}
                    at {moment(eachIntegration.verifiedAt).format("HH:mm:ss")}
                  </Typography>
                </>
              ) : (
                <>
                  {eachIntegration.verificationStatus === 0 &&
                    eachIntegration.transactionId && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginRight: "20px",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <AccessTimeFilled
                            style={{
                              color: "orange",
                              marginRight: "10px",
                            }}
                          />
                          <Typography
                            variant="subtitle1"
                            style={{ fontWeight: 500 }}
                          >
                            ID verification in progress
                          </Typography>
                        </div>
                        <div
                          style={{
                            borderLeft: "5px solid #0a2472 ",
                            backgroundColor: "#d7ecff ",
                            borderRadius: "8px",
                            padding: "10px",
                            color: "#0a2472",
                            maxWidth: "100%",
                            wordWrap: "break-word",
                            textAlign: "left",
                          }}
                        >
                          <div style={{ display: "flex" }}>
                            <ErrorOutline
                              style={{
                                color: "#0a2472",
                                marginRight: "10px",
                              }}
                            />
                            <Typography
                              variant="subtitle1"
                              className={classes.infoText}
                              gutterBottom
                            >
                              Note
                            </Typography>
                          </div>
                          <Typography
                            variant="body1"
                            className={classes.infoText}
                            gutterBottom
                          >
                            {translate("resources.integration.note")}
                          </Typography>
                        </div>
                      </div>
                    )}
                  <div style={{ display: "flex" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        verifyAction(eachIntegration);
                      }}
                      disabled={eachIntegration.recordStatusId !== 1}
                      className={classes.button}
                    >
                      {eachIntegration.recordStatusId === 1
                        ? eachIntegration.verificationStatus === 2
                          ? "Reverify"
                          : eachIntegration.verificationStatus === 0 &&
                            eachIntegration.transactionId
                          ? "Verify my status"
                          : "Start Verify"
                        : eachIntegration.recordStatusId === 2
                        ? "Coming Soon"
                        : "Inactive"}
                    </Button>
                  </div>
                </>
              )}
              {eachIntegration.transactionId && (
                <>
                  <div style={{ display: "flex" }}>
                    <Button
                      onClick={handleClick}
                      variant="text"
                      aria-describedby={id}
                      className={classes.moreInfo}
                      endIcon={<ExpandMore />}
                      style={{
                        width: "100px",
                        marginTop: "5px",
                        marginLeft: "10px",
                      }}
                    >
                      More info
                    </Button>
                  </div>
                  {!loading && (
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      PaperProps={{
                        style: {
                          width: "450px",
                          maxHeight: "420px",
                          overflow: "scroll",
                        },
                      }}
                    >
                      <>
                        {transactionList.length > 0 ? (
                          <>
                            {transactionList
                              .slice(0, visibleAccordions)
                              .map((trans, key) => (
                                <>
                                  <Accordion
                                    expanded={
                                      expanded && selectedId === trans.id
                                    }
                                    style={{ border: "none" }}
                                    key={key}
                                  >
                                    <AccordionSummary
                                      onClick={(event) => {
                                        handleAccordionExpand(event, trans.id);
                                      }}
                                      expandIcon={
                                        <GridExpandMoreIcon
                                          onClick={(event) => {
                                            handleAccordionExpand(
                                              event,
                                              trans.id,
                                            );
                                          }}
                                        />
                                      }
                                    >
                                      <Grid item md={12}>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            margin: "0px",
                                            padding: "0px",
                                          }}
                                        >
                                          {trans?.verificationStatus === 0 ? (
                                            <Sync style={{ color: "orange" }} />
                                          ) : trans?.verificationStatus ===
                                              10 ||
                                            trans?.verificationStatus === 11 ? (
                                            <Error style={{ color: "red" }} />
                                          ) : trans?.verificationStatus === 1 ||
                                            trans?.verificationStatus === 2 ? (
                                            <TaskAlt
                                              style={{ color: "green" }}
                                            />
                                          ) : (
                                            ""
                                          )}
                                          <b style={{ marginLeft: "20px" }}>
                                            {trans?.verificationStatus === 0 ||
                                            trans?.verificationStatus === 16
                                              ? "Processing"
                                              : trans?.verificationStatus ===
                                                  10 ||
                                                trans?.verificationStatus === 11
                                              ? "Failed"
                                              : trans?.verificationStatus ===
                                                  1 ||
                                                trans?.verificationStatus === 2
                                              ? "Completed"
                                              : ""}
                                          </b>
                                        </div>
                                        <div
                                          style={{
                                            margin: "0px",
                                            padding: "0px",
                                            marginLeft: "10%",
                                          }}
                                        >
                                          {/* Ref Id: {trans.transactionId}
                                          <br /> */}
                                          {moment(trans.createdAt).format(
                                            "DD MMM YYYY , HH:mm:ss",
                                          )}
                                          {trans?.verificationStatus === 10 && (
                                            <Typography
                                              style={{ color: "red" }}
                                            >
                                              {" "}
                                              Reason:{" "}
                                              {trans?.verificationResponse
                                                ? titleCase(
                                                    trans?.verificationResponse?.replaceAll(
                                                      "_",
                                                      " ",
                                                    ),
                                                  )
                                                : "No response received"}
                                            </Typography>
                                          )}
                                        </div>
                                      </Grid>
                                    </AccordionSummary>
                                    <Divider />
                                    <AccordionDetails>
                                      <div
                                        style={{
                                          width: "100%",
                                          display: "column",
                                        }}
                                      >
                                        <Typography
                                          style={{
                                            fontWeight: "500",
                                            marginLeft: "10%",
                                          }}
                                          variant="body2"
                                        >
                                          {" "}
                                          Ref Id: {trans.transactionId}
                                          <Tooltip
                                            arrow
                                            placement="top"
                                            title={translate(
                                              "tooltip.integration.copyTransId",
                                            )}
                                          >
                                            <IconButton
                                              onClick={() => {
                                                copyTransactionId(
                                                  trans.transactionId,
                                                );
                                              }}
                                              style={{
                                                color: "grey",
                                                fontSize: "20px",
                                              }}
                                            >
                                              <FileCopy />
                                            </IconButton>
                                          </Tooltip>
                                        </Typography>

                                        <Stepper
                                          activeStep={
                                            trans.transactionLog?.length
                                          }
                                          orientation="vertical"
                                          style={{
                                            border: "none",
                                            width: "100%",
                                            overflow: "auto",
                                          }}
                                        >
                                          {trans.transactionLog ? (
                                            JSON.parse(
                                              trans.transactionLog,
                                            ).transactionLog.steps.map(
                                              (step, index) => (
                                                <Step key={index}>
                                                  <StepLabel
                                                    optional={
                                                      <Typography variant="caption">
                                                        {moment(
                                                          step.timestamp,
                                                        ).format(
                                                          "DD MMM YYYY , HH:mm:ss",
                                                        )}
                                                      </Typography>
                                                    }
                                                    icon={
                                                      step.status?.toLowerCase() ===
                                                      "processing" ? (
                                                        <AccessTimeFilled
                                                          style={{
                                                            color: "orange",
                                                          }}
                                                        />
                                                      ) : step.status?.toLowerCase() ===
                                                        "success" ? (
                                                        <CheckCircle
                                                          style={{
                                                            color: "green",
                                                          }}
                                                        />
                                                      ) : (
                                                        <Cancel
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        />
                                                      )
                                                    }
                                                  >
                                                    {titleCase(step.stepName)}:{" "}
                                                    {step.status?.toLowerCase() ===
                                                    "failed"
                                                      ? "Failure reason- "
                                                      : ""}
                                                    {step.message
                                                      ? titleCase(
                                                          step.message?.replaceAll(
                                                            "_",
                                                            " ",
                                                          ),
                                                        )
                                                      : "No response received"}
                                                  </StepLabel>
                                                </Step>
                                              ),
                                            )
                                          ) : (
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Info
                                                style={{
                                                  color: "grey",
                                                  marginRight: "10px",
                                                }}
                                              />{" "}
                                              <Typography
                                                style={{ fontWeight: "500" }}
                                                variant="body2"
                                              >
                                                No data found
                                              </Typography>
                                            </div>
                                          )}
                                        </Stepper>
                                      </div>{" "}
                                    </AccordionDetails>
                                  </Accordion>
                                  <Divider />
                                </>
                              ))}
                            {transactionList.length > visibleAccordions && (
                              <div
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                }}
                              >
                                <Button
                                  onClick={handleViewMoreClick}
                                  endIcon={<KeyboardArrowDown />}
                                >
                                  View More
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <Typography style={{ margin: "20px" }}>
                            No transactions found
                          </Typography>
                        )}
                      </>
                    </Popover>
                  )}
                  {eachIntegration.enableOptOut && (
                    <>
                      {eachIntegration.verificationStatus === 1 && (
                        <Tooltip
                          arrow
                          placement="top"
                          title={translate("tooltip.unenroll.buttonTooltip")}
                        >
                          <IconButton
                            style={{
                              border: "1px solid red",
                              color: "red",
                              marginLeft: "20px",
                            }}
                            onClick={() => {
                              setOpenUnenrollConfirm(true);
                            }}
                          >
                            <DeleteSweep />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </CardContent>
      <IdVerificationAgreement
        open={openAgreement}
        onClose={() => {
          setOpenAgreement(false);
        }}
        selectedSystem={selectedSystem}
        systemLogo={fileResult}
      />
      {openUnenrollConfirm && (
        <UnEnrollConfirm
          open={openUnenrollConfirm}
          onClose={() => {
            setOpenUnenrollConfirm(false);
          }}
          unEnrollPatient={unEnrollPatient}
          eachIntegration={eachIntegration}
        />
      )}
      {openUnenrollSuccess && (
        <BaseModal
          open={openUnenrollSuccess}
          confirmAction={() => {
            setOpenUnenrollSuccess(false);
          }}
          onClose={() => {
            setOpenUnenrollSuccess(false);
          }}
          title={translate("resources.unenroll.successTitle")}
          content={translate("resources.unenroll.successMessage")}
          successButtonName="Okay, got it"
          type="success_info"
        />
      )}
      {openUnenrollError && (
        <BaseModal
          open={openErrorBase}
          confirmAction={() => {
            setOpenUnenrollError(false);
          }}
          onClose={() => {
            setOpenUnenrollError(false);
          }}
          title={translate("resources.unenroll.errorTitle")}
          content={translate("resources.unenroll.errorMessage")}
          closeButtonName="Close"
          type="requestError"
        />
      )}
    </Card>
  );
}
IntegrationListItem.propTypes = {
  eachIntegration: PropTypes.object.isRequired,
  setReloadIntegrations: PropTypes.func,
};

export default IntegrationListItem;
