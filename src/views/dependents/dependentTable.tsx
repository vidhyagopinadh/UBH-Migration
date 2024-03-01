import React, { useEffect } from "react";
import type { ListProps } from "react-admin";
import type { ReactElement } from "react";

import { BootstrapTooltip as Tooltip } from "../../components/Tooltip";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import type { UpdatePersonRecordStatusV1Input } from "../../__generated__/typescript-operations_all";
import { correlationConstants } from "../../utils/OT/correlationConstants";
import { useMutation } from "@apollo/react-hooks";
import updatePersonRecordStatus from "../../queries/updatePersonRecordStatus/updatePersonRecordStatus";
import BaseModal from "../../components/baseModal";
import InvitePatient from "../../components/patientInvite";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Link } from "react-router-dom";
import PlaylistAddSharpIcon from "@mui/icons-material/PlaylistAddSharp";
import { Grid, Box, Divider, Card, Button, IconButton } from "@mui/material";
import CreatePageHeader from "../../components/createPageHeader";
import Chip from "@mui/material/Chip";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import InfoIcon from '@mui/icons-material/Info';
import { formatSSN } from "../../utils/validator";
import {
  Datagrid,
  TextField,
  List,
  FunctionField,
  useTranslate,
  useRecordContext,
  useExpanded,
  useRefresh,
  useNotify,
  downloadCSV,
} from "react-admin";
import { useSelector } from "react-redux";
import useTraces from "../../hooks/useTraces";
import type { AppState } from "../../types";
import jsonExport from "jsonexport/dist";
import { tommddyyyy } from "../../utils/dateFormator";
import { StatusFilter } from "./filters";
import CustomEmpty from "../../components/customEmpty";
import CustomFilter from "../../components/customFilter";
import NotVerifiedBanner from "../../components/notVerifiedBanner";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
    flex: "1 1 auto",
    overflowY: "hidden",
    overflowX: "scroll",
  },
  filterBar: {
    marginBottom: "20px",
    marginTop: "-30px",
  },
  tableContainer: {
    width: "100%",
    overflowX: "auto",
  },
  icons: { margin: "0px", padding: "0px", paddingRight: "3px" },
  addIcon: {
    marginRight: theme.spacing(1),
  },
  dependentInviteButton: {
    "&:hover": {
      backgroundColor: "#ffffff",
    },
    marginTop: "15px",
    float: "right",
  },
  dependentTable: {
    "& th": {
      borderBottom: "2px solid #ccc",
    },
  },
  item: {
    fontSize: "12px",
    lineHeight: "1",
  },
  fullName: {
    maxWidth: 100,
    paddingLeft: "0px",
    paddingRight: "3px",
  },
  email: {
    maxWidth: 150,
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-all",
    paddingLeft: "3px",
    paddingRight: "3px",
  },
  userGroup: {
    maxWidth: 100,
    paddingLeft: "10px",
    paddingRight: "3px",
  },
  createdAt: {
    maxWidth: 120,
    paddingLeft: "3px",
    paddingRight: "3px",
  },
  invitationStatus: {
    maxWidth: 100,
    paddingLeft: "3px",
    paddingRight: "3px",
  },
  showIcon: {
    color: "green",
  },
  reminderIcon: {
    color: "blue",
  },
  iconDiv: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
  },
  filterContainer: {
    display: "flex",
    order: -1,
    paddingRight: "20px",
  },
  filter: {
    backgroundColor: theme.palette.primary.light,
    width: 200,
    display: "flex",
    flexDirection: "column",
  },
  filterContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  customHeader: {
    width: "200px",
  },
  dataGridContainer: {
    width: "700px",
    maxWidth: "100%",
  },
  hideHeader: {
    "& .MuiDataGrid-columnHeaders": {
      minHeight: "0!important",
      maxHeight: "0!important",
      lineHeight: "0!important",
    },
  },
  customColumn: {
    width: "200px",
  },
  customDivider: {
    margin: 0,
    borderStyle: "hidden!important ",
    borderColor: "rgba(0, 0, 0, 0.12)",
    borderBottomWidth: "inherit!important",
    disply: "none",
  },
  dob: {},
  ssn: {
    maxWidth: 150,
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-all",
    paddingLeft: "3px",
    paddingRight: "3px",
  },
  sex: {},
  phone: {},
}));

export const DependentList = (props: ListProps): ReactElement => {
  const classes = useStyles();
  const refresh = useRefresh();
  const notify = useNotify();
  const translate = useTranslate();
  const [filterValue, setFilterValue] = React.useState("");
  const { getTrace, handleTrace } = useTraces();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(false);
  const [emailNotVerified, setEmailNotVerified] = React.useState(false);
  const [openDependentInvitePopup, setDependentInvitePopup] =
    React.useState(false);
  const [openDeleteBase, setOpenDeleteBase] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");
  const [selectedDependentData, setSelectedDependentData] =
    React.useState(null);
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [subscribeUpdateRequestTokenMutation] = useMutation(
    updatePersonRecordStatus,
    {},
  );
  useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setEmailNotVerified(true);
      setShowBanner(true);
    }
  }, []);
  const handleCloseDependentInvite = (): void => {
    setDependentInvitePopup(false);
    refresh();
  };
  const deleteDependent = (): void => {
    setOpenDeleteBase(false);
    const updatePersonRecordStatusInput: UpdatePersonRecordStatusV1Input = {
      partyOid: selectedId,
      updatedDate: new Date(),
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
    const eventObj = correlationConstants["ev-084"];
    console.group(
      "%cOT Traces",
      "background-color: #008000 ; color: #ffffff ; font-weight: bold ; padding: 4px ;",
    );
    console.log(eventObj);
    console.groupEnd();
    const inputContext = {
      action: "Closed Dependent Account",
      aecId: eventObj.aecId,
      aecIeId: eventObj.aecIeId,
    };
    handleTrace(
      eventObj.eventTitle,
      inputContext,
      (spanContext: any, fingerprint: any) => {
        updatePersonRecordStatusInput.otContext = JSON.stringify(spanContext);
        updatePersonRecordStatusInput.fingerPrint = fingerprint;
        updatePersonRecordStatusInput.otTags = JSON.stringify({
          name: "Attempt to close Dependent Account",
        });
        subscribeUpdateRequestTokenMutation({
          variables: { input: updatePersonRecordStatusInput },
        }).then((res) => {
          if (res.data) {
            refresh();
            setIsOpen(!isOpen);
            notify(translate("resources.patients.accountClose"), {
              type: "success",
            });
            getTrace(
              "Account Closed Successfully",
              "ev-085",
              userInfoReducer.email,
            );
          } else {
            notify(
              translate("resources.patients.accountCloseError"),
              "warning",
            );
          }
        });
      },
    );
  };

  function exportDependent(patientDemographics): void {
    getTrace("Export Clicked", "ev-086", userInfoReducer.email);
    jsonExport(patientDemographics, (err, csv) => {
      downloadCSV(csv, "dependents");
      getTrace(
        "Dependent Demographics file downloaded as csv format",
        "ev-087",
        userInfoReducer.email,
      );
    });
  }

  const rowStyle = (): { borderBottom: string } => {
    return { borderBottom: "1px solid #ccc" };
  };

  const FormattedDateField = (props): JSX.Element => {
    const { record, source } = props;
    const formattedDate = tommddyyyy(record[source]);
    return <span>{formattedDate}</span>;
  };

  const CustomButtonLinkField = (props): JSX.Element => {
    const [expanded, toggleExpanded] = useExpanded(
      "dependents",
      props.record.id,
    );
    useEffect(() => {
      if (props.record.id !== selectedId) {
        if (expanded) {
          toggleExpanded();
        }
      }
    }, []);
    const handleInviteClick = (): void => {
      setSelectedDependentData(props.record);
      setDependentInvitePopup(true);
    };
    const handleEditClick = (): void => {
      setSelectedDependentData(props.record);
    };

    const onExpandClick = (): void => {
      toggleExpanded();
      setSelectedId(props.record.id);
    };
    const isDisabled = emailNotVerified;

    return (
      <div className={classes.iconDiv}>
        <IconButton
          className={classes.icons}
          color="primary"
          onClick={onExpandClick}
        >
          {!expanded ? (
            <Tooltip title="View More">
              <VisibilityIcon className={classes.showIcon} />
            </Tooltip>
          ) : (
            <Tooltip title="View Less">
              <VisibilityOffIcon className={classes.showIcon} />
            </Tooltip>
          )}
        </IconButton>
        <Tooltip
          title={
            isDisabled
              ? "Editing is allowed only for users who have verified their email."
              : "Edit Dependent"
          }
        >
          <IconButton
            className={classes.icons}
            color="primary"
            onClick={handleEditClick}
            component={Link}
            to={{
              pathname: `/addDependents/${props.record.id}`,
              state: {
                patientDetails: props.record,
                isForEdit: true,
                type: "dependent",
              },
            }}
            disabled={isDisabled}
          >
            <EditIcon
              style={{
                color: isDisabled ? "grey" : "primary",
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            props.record.registrationStatus === "REGISTERED"
              ? "Inviting an already registered dependent is not permitted."
              : "Invite Dependent"
          }
        >
          <div>
            <IconButton
              className={classes.icons}
              color="primary"
              onClick={handleInviteClick}
              disabled={
                props.record.registrationStatus === "REGISTERED" ? true : false
              }
            >
              <PersonAddAltIcon
                style={{
                  width: "20px",
                  height: "20px",
                  color:
                    props.record.registrationStatus === "REGISTERED"
                      ? "grey"
                      : "blue",
                }}
              />
            </IconButton>
          </div>
        </Tooltip>
        <Tooltip
          title={
            isDisabled
              ? "Deleting is allowed only for users who have verified their email."
              : "Cancel Dependent"
          }
        >
          <div>
            <IconButton
              className={classes.icons}
              color="primary"
              disabled={isDisabled ? true : false}
              onClick={() => {
                setOpenDeleteBase(true);
                setSelectedId(props.record.id);
              }}
            >
              <DeleteIcon
                style={{
                  color: isDisabled ? "grey" : "red",
                }}
              />
            </IconButton>
          </div>
        </Tooltip>
      </div>
    );
  };

  CustomButtonLinkField.defaultProps = { label: "Actions" };

  const FilterSidebar = (): JSX.Element => {
    return (
      <div className={classes.filterContainer}>
        <Card className={classes.filter}>
          <CardContent className={classes.filterContent}>
            <StatusFilter />
          </CardContent>
        </Card>
      </div>
    );
  };

  const ExpandPanel = (): JSX.Element => {
    const record = useRecordContext();
    const translate = useTranslate();
    const [FirstNameTooltipTitle, setFirstNameTooltipTitle] = React.useState(
      translate(`resources.patients.noInfoDetails.noDependentFirstname`),
    );
    const [MiddleNameTooltipTitle, setMiddleNameTooltipTitle] = React.useState(
      translate(`resources.patients.noInfoDetails.noDependentMiddlename`),
    );
    const [LastNameTooltipTitle, setLastNameTooltipTitle] = React.useState(
      translate(`resources.patients.noInfoDetails.noDependentLastname`),
    );
    const [phoneTooltipTitle, setPhoneTooltipTitle] = React.useState(
      translate(`resources.patients.noInfoDetails.noDependentPhone`),
    );

    const [showPreviousAddressDetails, setShowPreviousAddressDetails] =
      React.useState(false);
    const togglePreviousAddressDetails = (): void => {
      setShowPreviousAddressDetails(!showPreviousAddressDetails);
    };
    const [showInviteDetails, setShowInviteDetails] = React.useState(false);
    const [showInviteStatusDetails, setShowInviteStatusDetails] =
      React.useState(false);
    const toggleInviteDetails = (): void => {
      setShowInviteDetails(!showInviteDetails);
      if (InviteData !== null) {
        setShowInviteStatusDetails(true);
      }
    };

    const useStyles = makeStyles({
      customHeader: {
        width: "200px",
      },
      dataGridContainer: {
        width: "700px",
        maxWidth: "100%",
      },
      hideHeader: {
        "& .MuiDataGrid-columnHeaders": {
          minHeight: "0!important",
          maxHeight: "0!important",
          lineHeight: "0!important",
        },
      },
      customColumn: {
        width: "200px",
      },
      customValue: {
        marginLeft: "20px",
      },
      customDivider: {
        margin: 0,
        borderStyle: "hidden!important ",
        borderColor: "rgba(0, 0, 0, 0.12)",
        borderBottomWidth: "inherit!important",
        disply: "none",
      },
      info: {
        cursor: "auto",
        width: "20px",
        height: "15px",
        color: "grey",
      },
    });
    const classes = useStyles();
    const getRowHeight = (): number => {
      return 35;
    };

    const previousAddressData = record.previousAddress
      ? JSON.parse(record.previousAddress).previous_address_json
      : null;
    const sexObject = JSON.parse(record.sex);
    const sexValue = sexObject.other ? sexObject.other_value : sexObject.value;

    const genderObject = JSON.parse(record.gender);
    const genderValue = genderObject.other
      ? genderObject.other_value
      : genderObject.value;

    const InviteData = record.inviteDetails
      ? JSON.parse(record.inviteDetails).invite_details_json
      : null;

    const columns: GridColDef[] = [
      {
        field: "label",
        headerName: "",
        flex: 1,
        headerClassName: classes.customColumn,
        cellClassName: classes.customColumn,
      },
      {
        field: "value",
        headerName: "",
        flex: 1,
      },
    ];
    const rows = [
      {
        id: 1,
        label: translate(`resources.patients.expandFields.firstName`),
        value:
          record.firstName && record.firstName.trim() ? record.firstName : null,
      },

      {
        id: 2,
        label: translate(`resources.patients.expandFields.middleName`),
        value:
          record.middleName && record.middleName.trim()
            ? record.middleName
            : null,
      },
      {
        id: 3,
        label: translate(`resources.patients.expandFields.lastName`),
        value:
          record.lastName && record.lastName.trim() ? record.lastName : null,
      },
      {
        id: 28,
        label: translate(`resources.patients.expandFields.previousFirstName`),
        value:
          record.previousFirstName && record.previousFirstName.trim()
            ? record.previousFirstName
            : null,
      },

      {
        id: 29,
        label: translate(`resources.patients.expandFields.previousMiddleName`),
        value:
          record.previousMiddleName && record.previousMiddleName.trim()
            ? record.previousMiddleName
            : null,
      },
      {
        id: 30,
        label: translate(`resources.patients.expandFields.previousLastName`),
        value:
          record.previousLastName && record.previousLastName.trim()
            ? record.previousLastName
            : null,
      },
      {
        id: 4,
        label: translate(`resources.patients.expandFields.birthDate`),
        value: record.birthDate ? tommddyyyy(record.birthDate) : null,
      },
      {
        id: 5,
        label: translate(`resources.patients.expandFields.ssn`),
        value: record.ssn ? formatSSN(record.ssn) : null,
      },
      {
        id: 6,
        label: translate(`resources.patients.expandFields.sex`),
        value: record.sex ? sexValue : null,
      },
      {
        id: 7,
        label: translate(`resources.patients.expandFields.gender`),
        value: record.gender ? genderValue : null,
      },
      {
        id: 8,
        label: translate(`resources.patients.expandFields.email`),
        value: record.email ? record.email : null,
      },
      {
        id: 9,
        label: translate(`resources.patients.expandFields.phone`),
        value: record.phoneNumber ? record.phoneNumber : null,
      },
      {
        id: 10,
        label: translate(`resources.patients.expandFields.relation`),
        value: record.relatedPersonRelationshipValue
          ? record.relatedPersonRelationshipValue
          : null,
      },
      {
        id: 11,
        label: translate(`resources.patients.expandFields.Address.address1`),
        value: record.address1 ? record.address1 : null,
      },
      {
        id: 12,
        label: translate(`resources.patients.expandFields.Address.address2`),
        value: record.address2 ? record.address2 : null,
      },
      {
        id: 13,
        label: translate(`resources.patients.expandFields.Address.country`),
        value: record.country ? record.country : null,
      },
      {
        id: 14,
        label: translate(`resources.patients.expandFields.Address.state`),
        value: record.state ? record.state : null,
      },
      {
        id: 15,
        label: translate(`resources.patients.expandFields.Address.city`),
        value: record.city ? record.city : null,
      },
      {
        id: 16,
        label: translate(`resources.patients.expandFields.Address.zip`),
        value: record.zip ? record.zip : null,
      },
      {
        id: 17,
        label: (
          <span style={{ fontWeight: "bold", fontSize: "12px" }}>
            {translate(`resources.patients.expandFields.previousAddressHead`)}
          </span>
        ),
        value: (
          <>
            <span
              onClick={togglePreviousAddressDetails}
              style={{ display: "flex", alignItems: "center" }}
            >
              <span>
                {showPreviousAddressDetails
                  ? translate(`resources.patients.expandFields.lessInfo`)
                  : translate(`resources.patients.expandFields.moreInfo`)}
              </span>
              <span style={{ marginLeft: "5px", marginTop: "4px" }}>
                {showPreviousAddressDetails ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </span>
            </span>
          </>
        ),
      },
      ...(showPreviousAddressDetails
        ? [
          {
            id: 18,
            label: translate(
              `resources.patients.expandFields.previousAddressDetails.previous_address1`,
            ),
            value: previousAddressData?.previous_address1 || null,
          },
          {
            id: 19,
            label: translate(
              `resources.patients.expandFields.previousAddressDetails.previous_address2`,
            ),
            value: previousAddressData?.previous_address2 || null,
          },
          {
            id: 20,
            label: translate(
              `resources.patients.expandFields.previousAddressDetails.previous_country`,
            ),
            value: previousAddressData?.previous_country || null,
          },
          {
            id: 21,
            label: translate(
              `resources.patients.expandFields.previousAddressDetails.previous_state`,
            ),
            value: previousAddressData?.previous_state || null,
          },
          {
            id: 22,
            label: translate(
              `resources.patients.expandFields.previousAddressDetails.previous_city`,
            ),
            value: previousAddressData?.previous_city || null,
          },
          {
            id: 23,
            label: translate(
              `resources.patients.expandFields.previousAddressDetails.previous_zip`,
            ),
            value: previousAddressData?.previous_zip || null,
          },
        ]
        : []),
      {
        id: 24,
        label: (
          <span style={{ fontWeight: "bold", fontSize: "12px" }}>
            {translate(`resources.patients.expandFields.inviteDetailsHead`)}
          </span>
        ),
        value: (
          <>
            <span
              onClick={toggleInviteDetails}
              style={{ display: "flex", alignItems: "center" }}
            >
              <span>
                {showInviteDetails
                  ? translate(`resources.patients.expandFields.lessInfo`)
                  : translate(`resources.patients.expandFields.moreInfo`)}
              </span>
              <span style={{ marginLeft: "5px", marginTop: "4px" }}>
                {showInviteDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </span>
            </span>
          </>
        ),
      },
      ...(showInviteDetails
        ? [
          ...(showInviteStatusDetails
            ? [
              {
                id: 25,
                label: translate(
                  `resources.patients.expandFields.inviteDetails.invite_status`,
                ),
                value: InviteData?.invite_status || null,
              },
              {
                id: 26,
                label: translate(
                  `resources.patients.expandFields.inviteDetails.signup_completed_date`,
                ),

                value: InviteData?.signup_completed_date
                  ? tommddyyyy(InviteData.signup_completed_date)
                  : null,
              },
              {
                id: 27,
                label: translate(
                  `resources.patients.expandFields.inviteDetails.first_sign_in_date`,
                ),
                value: InviteData?.first_sign_in_date
                  ? tommddyyyy(InviteData.first_sign_in_date)
                  : null,
              },
            ]
            : [
              {
                id: 28,
                label: (
                  <div
                    style={{
                      marginLeft: "250px",
                    }}
                  >
                    Not yet invited
                  </div>
                ),
                value: "    ",
              },
            ]),
        ]
        : []),
    ];

    useEffect(() => {
      setFirstNameTooltipTitle(
        translate(`resources.patients.noInfoDetails.noDependentFirstname`),
      );
      setMiddleNameTooltipTitle(
        translate(`resources.patients.noInfoDetails.noDependentMiddlename`),
      );
      setLastNameTooltipTitle(
        translate(`resources.patients.noInfoDetails.noDependentLastname`),
      );
      setPhoneTooltipTitle(
        translate(`resources.patients.noInfoDetails.noDependentPhone`),
      );
    }, []);
    return (
      <Box
        sx={{
          width: "100%",
          bgcolor: "transparent",
          marginLeft: "30px",
          overflowX: "auto",
        }}
      >
        <Divider className={classes.customDivider} />
        <div className={classes.dataGridContainer}>
          <DataGrid
            rows={rows}
            columns={columns.map((column) => ({
              ...column,
              renderCell: (params) => {
                if (params.value) {
                  return params.value;
                } else {
                  if (
                    params.row.label ===
                    translate(`resources.patients.expandFields.firstName`)
                  ) {
                    return (
                      <span>
                        {translate(`resources.patients.noInfoDetails.noInfo`)}
                        <Tooltip title={FirstNameTooltipTitle}>
                          <InfoIcon className={classes.info} />
                        </Tooltip>
                      </span>
                    );
                  }
                  if (
                    params.row.label ===
                    translate(`resources.patients.expandFields.middleName`)
                  ) {
                    return (
                      <span>
                        {translate(`resources.patients.noInfoDetails.noInfo`)}
                        <Tooltip title={MiddleNameTooltipTitle}>
                          <Info className={classes.info} />
                        </Tooltip>
                      </span>
                    );
                  }
                  if (
                    params.row.label ===
                    translate(`resources.patients.expandFields.lastName`)
                  ) {
                    return (
                      <span>
                        {translate(`resources.patients.noInfoDetails.noInfo`)}
                        <Tooltip title={LastNameTooltipTitle}>
                          <Info className={classes.info} />
                        </Tooltip>
                      </span>
                    );
                  } else if (
                    params.row.label ===
                    translate(`resources.patients.expandFields.phone`)
                  ) {
                    return (
                      <span>
                        {translate(`resources.patients.noInfoDetails.noInfo`)}
                        <Tooltip title={phoneTooltipTitle}>
                          <Info className={classes.info} />
                        </Tooltip>
                      </span>
                    );
                  }
                  return (
                    <span>
                      {translate(`resources.patients.noInfoDetails.noInfo`)}
                      <Tooltip
                        title={translate(
                          `resources.patients.noInfoDetails.noInfo`,
                        )}
                      >
                        <Info className={classes.info} />
                      </Tooltip>
                    </span>
                  );
                }
              },
              key: column.field,
            }))}
            autoHeight
            hideFooter
            disableRowSelectionOnClick
            className={classes.hideHeader}
            getRowHeight={getRowHeight}
          />
        </div>
      </Box>
    );
  };
  return (
    <>
      <InvitePatient
        open={openDependentInvitePopup}
        patientData={selectedDependentData}
        handleClose={handleCloseDependentInvite}
      />
      <div id="dependentTable" className={classes.container}>
        {showBanner && <NotVerifiedBanner setShowBanner={setShowBanner} />}
        <Grid container spacing={3}>
          <Grid item md={10}>
            <CreatePageHeader
              subTitle=""
              mainTitle="resources.patients.dependentList"
            />
          </Grid>
        </Grid>
        <div id="dependentList" style={{ display: "column" }}>
          <div
            style={{
              float: "right",
              marginRight: "6%",
              paddingBottom: "20px",
              marginBottom: "20px",
            }}
          >
            <CustomFilter
              setFilterValue={setFilterValue}
              fieldName="first name"
            />
            <Tooltip
              title={
                emailNotVerified === true
                  ? "Add new patient is allowed only for users who have verified their email."
                  : "Add new dependent"
              }
            >
              <Button
                disabled={emailNotVerified ? true : false}
                className={classes.dependentInviteButton}
                color="primary"
                component={Link}
                to={{
                  pathname: "/addDependents",
                  state: {
                    patientDetails: null,
                    isForEdit: false,
                    type: "dependent",
                  },
                }}
                variant="contained"
              >
                <PlaylistAddSharpIcon className={classes.addIcon} />
                {translate(`resources.patients.add`)}
              </Button>
            </Tooltip>
          </div>
          <div style={{ float: "left", width: "100%" }}>
            <List
              {...props}
              bulkActionButtons={false}
              actions={<></>}
              //actions={<ExportButton />}
              title={" "}
              sort={{ field: "createdAt", order: "DESC" }}
              empty={
                !filterValue ? (
                  <CustomEmpty type="dependent" />
                ) : (
                  <CustomEmpty type="noResults" />
                )
              }
              perPage={10}
              exporter={exportDependent}
              aside={<FilterSidebar />}
              filter={{
                firstName: filterValue,
              }}
              className={classes.filterBar}
            >
              <div className={classes.tableContainer}>
                <Datagrid
                  optimized
                  className={classes.dependentTable}
                  rowStyle={rowStyle}
                  expand={<ExpandPanel />}
                >
                  <FunctionField
                    label={translate(
                      "resources.patients.fields.dependent_name",
                    )}
                    render={(record: any) => (
                      <span>
                        {`${record.firstName} ${record.middleName ? record.middleName : ""
                          } ${record.lastName}`}
                      </span>
                    )}
                  />
                  <FormattedDateField
                    source="birthDate"
                    label={translate("resources.patients.fields.dob")}
                    cellClassName={classes.dob}
                  />
                  <FunctionField
                    label={translate("resources.patients.fields.ssn")}
                    render={(record: any) => (
                      <span>
                        {record.ssn !== null ? formatSSN(record.ssn) : null}
                      </span>
                    )}
                    cellClassName={classes.ssn}
                  />
                  <FunctionField
                    label={translate("resources.patients.fields.sex")}
                    render={(record: any) => {
                      const sexData = JSON.parse(record.sex);
                      const sexValue = sexData.other
                        ? sexData.other_value
                        : sexData.value;

                      return <span>{sexValue}</span>;
                    }}
                    cellClassName={classes.sex}
                  />
                  <FunctionField
                    label={translate("resources.patients.fields.gender")}
                    render={(record: any) => {
                      const genderData = JSON.parse(record.gender);
                      const genderValue = genderData.other
                        ? genderData.other_value
                        : genderData.value;

                      return <span>{genderValue}</span>;
                    }}
                    cellClassName={classes.sex}
                  />
                  <FunctionField
                    label={translate("resources.patients.fields.email")}
                    render={(record: any) => (
                      <span>
                        <a href={"mailto:" + record.email}>{record.email}</a>
                      </span>
                    )}
                    cellClassName={classes.email}
                  />
                  <TextField
                    label={translate("resources.patients.fields.phone_number")}
                    source="phoneNumber"
                    cellClassName={classes.phone}
                  />
                  <TextField
                    label={translate("resources.patients.fields.relation")}
                    source="relatedPersonRelationshipValue"
                    cellClassName={classes.phone}
                  />
                  <FunctionField
                    label={translate("resources.patients.fields.status")}
                    render={(record: any) => (
                      <span>
                        {record.registrationStatus === "Virtual" ? (
                          <Chip
                            label={translate(
                              "resources.patients.fields.registrationStatusVirtual",
                            )}
                            style={{ width: "80px" }}
                          />
                        ) : record.registrationStatus === "REGISTERED" ? (
                          <Chip
                            label={translate(
                              "resources.patients.fields.registrationStatus",
                            )}
                            color="success"
                            style={{ width: "80px" }}
                          />
                        ) : (
                          ""
                        )}
                      </span>
                    )}
                  />

                  <CustomButtonLinkField {...props} />
                </Datagrid>
              </div>
            </List>
          </div>
        </div>
      </div>
      {openDeleteBase && (
        <BaseModal
          open={openDeleteBase}
          confirmAction={deleteDependent}
          onClose={() => {
            setOpenDeleteBase(false);
          }}
          title={translate("resources.patients.delete.deleteDependentTitle")}
          content={translate(
            "resources.patients.delete.deleteDependentMessage",
          )}
          successButtonName="Delete"
          type="delete"
        />
      )}
    </>
  );
};
