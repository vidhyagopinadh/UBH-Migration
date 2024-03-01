import React from "react";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Grid,
  Popover,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  makeStyles,
} from "@mui/material";
import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import { useMutation } from "@apollo/react-hooks";
import getMedicalRecordImportStatus from "../../queries/getMedicalRecordImportStatus/getMedicalRecordImportStatus";
import type {
  GetMedicalRecordImportStatusMutation,
  GetMedicalRecordImportStatusMutationVariables,
  GetPatientIndividualMedicalRecordDocumentMutation,
  GetPatientIndividualMedicalRecordDocumentMutationVariables,
  UserMedicalRecordOperationStatusHistoryMutation,
  UserMedicalRecordOperationStatusHistoryMutationVariables,
} from "../../__generated__/typescript-operations_all";
import {
  Cancel,
  CheckCircle,
  Error,
  ExpandMore,
  ExpandMoreOutlined,
  Sync,
} from "@mui/icons-material";
import { AccessTimeFilled, TaskAlt } from "@mui/icons-material";
import getPatientIndividualMedicalRecordDocument from "../../queries/getPatientIndividualMedicalRecordDocument/getPatientIndividualMedicalRecordDocument";
import { useDataProvider, useNotify } from "react-admin";
import { perPageMax } from "../../utils/pageConstants";
import userMedicalRecordOperationStatusHistory from "../../queries/userMedicalRecordOperationStatusHistory/userMedicalRecordOperationStatusHistory";
import { titleCase } from "../../utils/titleCase";
import type { IDetails } from "../../types/types";
import { styled } from "@mui/material/styles";

const PREFIX = "loadingMrr";

const classes = {
  root: `${PREFIX}-root`,
  tickIcon: `${PREFIX}-tickIcon`,
  errorIcon: `${PREFIX}-errorIcon`,
  moreInfo: `${PREFIX}-moreInfo`,
  message: `${PREFIX}-message`,
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
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
  [`& .${classes.message}`]: {
    marginRight: "20px",
    fontWeight: 600,
  },
  [`& .${classes.tickIcon}`]: {
    color: "#2AAA8A",
    width: "30px",
    height: "30px",
    marginRight: "10px",
  },
  [`&.${classes.errorIcon}`]: {
    color: "red",
    width: "30px",
    height: "30px",
    marginRight: "10px",
  },
  [`& .${classes.moreInfo}`]: {
    textTransform: "none",
    fontWeight: 600,
    pointerEvents: "auto",
  },
}));
function MedicalRecordSearchTable({ mrrList, setResponse }): JSX.Element {
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [stepLoader, setStepLoader] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>(null);
  const [steps, setSteps] = useState([]);
  const CustomMoveIcon = (props: { colDef }): JSX.Element => {
    return <div>{props.colDef.headerName}</div>;
  };
  const [details, setDetails] = useState<IDetails>({
    partnerSysRequestRefId: "",
    patientExternalRefId: "",
  });
  const [subscribeGetMedicalRecordImportStatus] = useMutation<
    GetMedicalRecordImportStatusMutation,
    GetMedicalRecordImportStatusMutationVariables
  >(getMedicalRecordImportStatus, {});
  const [subscribeGetMedicalRecordDocument] = useMutation<
    GetPatientIndividualMedicalRecordDocumentMutation,
    GetPatientIndividualMedicalRecordDocumentMutationVariables
  >(getPatientIndividualMedicalRecordDocument, {});
  const [subscribeGetHistory] = useMutation<
    UserMedicalRecordOperationStatusHistoryMutation,
    UserMedicalRecordOperationStatusHistoryMutationVariables
  >(userMedicalRecordOperationStatusHistory, {});
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const open = Boolean(anchorEl);

  const importMedicalRecords = (id, extSystemId, requestResultId): void => {
    subscribeGetMedicalRecordImportStatus({
      variables: {
        input: {
          transId: id,
          externalSystemId: extSystemId,
          requestResultId: requestResultId,
        },
      },
    }).then((res) => {
      setResponse(null);
      if (res.data.getMedicalRecordImportStatus.requestApiResponse.success) {
        setResponse("completed");
        if (
          !res.data.getMedicalRecordImportStatus.requestApiResponse.status.message.includes(
            "completed",
          )
        ) {
          notify(
            res.data.getMedicalRecordImportStatus.requestApiResponse.status
              .message,
            "success",
          );
        }
      } else {
        setResponse("failed");
        notify(
          res.data.getMedicalRecordImportStatus.requestApiResponse.status
            .message,
          "warning",
        );
      }
    });
  };
  const viewMedicalRecords = (extSystemId, partyId, transId): void => {
    dataProvider
      .getList("patientExternalDocumentLists", {
        pagination: { page: 1, perPage: perPageMax },
        sort: { field: "id", order: "ASC" },
        filter: { partyId: partyId },
      })
      .then(({ data }) => {
        if (data) {
          const documentUrls = data[0].documentUrl.split(",");
          documentUrls.map((eachValue) => {
            subscribeGetMedicalRecordDocument({
              variables: {
                input: {
                  externalSystemId: extSystemId,
                  resourceParam: eachValue?.replace("{", ""),
                  patientId: partyId,
                  transId: transId,
                },
              },
            }).then((res) => {
              if (
                res.data.getPatientIndividualMedicalRecordDocument
                  .requestApiResponse.success
              ) {
                const blob = new Blob(
                  [
                    res.data.getPatientIndividualMedicalRecordDocument
                      .requestApiResponse.data,
                  ],
                  { type: "text/html" },
                );
                const url = URL.createObjectURL(blob);
                window.open(url);
                URL.revokeObjectURL(url);
              }
            });
          });
        }
      });
  };
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    logId,
  ): void => {
    setAnchorEl(event.currentTarget);
    subscribeGetHistory({
      variables: {
        input: {
          medicalQueryLogId: logId,
        },
      },
    }).then((res) => {
      if (
        res.data.userMedicalRecordOperationStatusHistory.requestApiResponse
          .success
      ) {
        const parsedData = JSON.parse(
          res.data.userMedicalRecordOperationStatusHistory.requestApiResponse.data.replace(
            /'/g,
            '"',
          ),
        );
        setDetails({
          partnerSysRequestRefId: parsedData.partner_sys_request_ref_id,
          patientExternalRefId: parsedData.patient_external_ref_id,
        });
        const dataArray = parsedData.data;
        setSteps(dataArray);
        setStepLoader(false);
      }
    });
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (mrrList?.length > 0) {
      setShowLoader(false);
    }
  }, []);

  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 180,
      renderCell: (params) => (
        <>{moment(params.value).format("MMM DD, YYYY hh:mm:ss a")}</>
      ),
    },
    {
      field: "systemName",
      headerName: "Partner Network",
      width: 180,
    },
    {
      field: "importStatus",
      headerName: "Status",
      width: 300,
      headerAlign: "center",
      renderCell: (params) => {
        let backgroundColor = "";
        let color = "";
        if (params.value?.toLowerCase() === "processing") {
          backgroundColor = "#FFD580";
          color = "#dd571c";
        } else if (params.value?.toLowerCase() === "completed") {
          backgroundColor = "#90EE90";
          color = "green";
        } else if (params.value?.toLowerCase() === "failed") {
          backgroundColor = "#ffcbd1";
          color = "red";
        }
        return (
          <StyledDiv
            style={{
              backgroundColor: backgroundColor,
              color: color,
              padding: "4px",
              width: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none",
              borderRadius: "20px",
            }}
          >
            {params.value?.toLowerCase() === "processing" ? (
              <Sync />
            ) : params.value?.toLowerCase() === "failed" ? (
              <Error />
            ) : (
              <TaskAlt />
            )}{" "}
            <b style={{ marginLeft: "20px" }}>
              {params.value}

              {params.value?.toLowerCase() === "completed" &&
                ": " + params.row.totalNoOfDocuments + " record(s) found"}
            </b>
          </StyledDiv>
        );
      },
    },

    {
      field: "",
      headerName: "Action",
      width: 280,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div style={{ width: "100%", textAlign: "center" }}>
            {params.row.recordStatus === 7 && (
              <Button
                variant="outlined"
                color="primary"
                style={{ textTransform: "none", borderRadius: "20px" }}
                onClick={() => {
                  importMedicalRecords(
                    params.row.id,
                    params.row.extSystemId,
                    params.row.partnerSysRequestRefId,
                  );
                }}
              >
                Refresh
              </Button>
            )}
            {params.row.recordStatus === 9 && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ textTransform: "none", borderRadius: "20px" }}
                  // disabled
                  onClick={() => {
                    viewMedicalRecords(
                      params.row.extSystemId,
                      params.row.partyId,
                      params.row.id,
                    );
                  }}
                >
                  View/Download
                </Button>
                <Button
                  onClick={(event) => {
                    setSteps([]);
                    setStepLoader(true);
                    handleClick(event, params.row.id);
                    setSelectedId(params.row.id);
                  }}
                  variant="text"
                  aria-describedby={params.row.id}
                  className={classes.moreInfo}
                  endIcon={<ExpandMore />}
                  style={{ marginLeft: "5px" }}
                >
                  Details
                </Button>
                {selectedId === params.row.id && (
                  <HistoryPopover id={params.row.id} />
                )}
              </>
            )}
            {params.row.recordStatus === 8 && (
              <>
                <Button
                  onClick={(event) => {
                    setSteps([]);
                    setStepLoader(true);
                    handleClick(event, params.row.id);
                    setSelectedId(params.row.id);
                  }}
                  variant="text"
                  aria-describedby={params.row.id}
                  className={classes.moreInfo}
                  endIcon={<ExpandMore />}
                >
                  Details
                </Button>
                {selectedId === params.row.id && (
                  <HistoryPopover id={params.row.id} />
                )}
              </>
            )}
          </div>
        );
      },
    },
  ];

  const getRowHeight = (): number => 50;
  const HistoryPopover = ({ id }): JSX.Element => {
    return (
      <Popover
        open={open}
        id={id}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          style: { width: "550px" },
        }}
      >
        {stepLoader ? (
          <div style={{ width: "100%", textAlign: "center", margin: "30px" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            {steps.length > 0 && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Typography variant="h6" style={{ marginRight: "16px" }}>
                    {titleCase(steps[steps.length - 1].status)}{" "}
                  </Typography>
                  {steps[steps.length - 1].status === "processing" ? (
                    <AccessTimeFilled style={{ color: "orange" }} />
                  ) : steps[steps.length - 1].status === "success" ? (
                    <CheckCircle style={{ color: "green" }} />
                  ) : (
                    <Cancel style={{ color: "red" }} />
                  )}
                </div>
                <Divider />
                <Stepper
                  style={{ border: "none" }}
                  activeStep={steps.length}
                  orientation="vertical"
                >
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepLabel
                        optional={
                          <Typography variant="caption">
                            {moment(step.timestamp).format(
                              "DD MMM YYYY , HH:mm:ss",
                            )}
                          </Typography>
                        }
                        icon={
                          step.status === "processing" ? (
                            <AccessTimeFilled style={{ color: "orange" }} />
                          ) : step.status === "success" ? (
                            <CheckCircle style={{ color: "green" }} />
                          ) : (
                            <Cancel style={{ color: "red" }} />
                          )
                        }
                      >
                        {titleCase(step.status)}: {step.message}
                      </StepLabel>
                      <StepContent>
                        <Typography>{step.message}</Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreOutlined />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Typography variant="subtitle2">Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{ margin: "0", padding: "12px" }}>
                    <Typography>
                      <Grid container>
                        <Grid md={6}>
                          <b> Patient External Reference Id:</b>
                        </Grid>
                        <Grid md={6}>{details?.patientExternalRefId}</Grid>
                        <Grid md={6}>
                          <b>Partner System Request Ref Id:</b>
                        </Grid>
                        <Grid md={6}>{details?.partnerSysRequestRefId}</Grid>
                      </Grid>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            )}
          </>
        )}
      </Popover>
    );
  };
  return (
    <div
      style={{
        height: 360,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "0px",
        marginTop: "10px",
      }}
    >
      {showLoader ? (
        <div>
          <Typography variant="h6" style={{ marginTop: "-47%" }}>
            Loading ...
          </Typography>
          <CircularProgress
            color="secondary"
            style={{ marginLeft: "10px", marginTop: "10px" }}
          />
        </div>
      ) : (
        <Box
          sx={{
            overflow: "auto",
            width: "95%",
            height: "100%",
          }}
        >
          <DataGrid
            className={classes.root}
            rows={mrrList}
            columns={columns}
            getRowHeight={getRowHeight}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            checkboxSelection={false}
            disableRowSelectionOnClick
            slots={{
              columnSelectorIcon: CustomMoveIcon,
            }}
            disableColumnSelector={true}
            disableColumnMenu
          />
        </Box>
      )}
    </div>
  );
}

export default MedicalRecordSearchTable;
