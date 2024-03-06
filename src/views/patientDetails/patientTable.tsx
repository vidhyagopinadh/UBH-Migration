import React, { useContext, useEffect, useState } from "react";
import type { ListProps } from "react-admin";

import type { ReactElement } from "react";
import {
  Card,
  CardContent,
  IconButton,
  makeStyles,
  Button,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import { BootstrapTooltip as Tooltip } from "../../components/Tooltip";
import {
  AccountCircle,
  Assignment,
  Delete,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import type {
  UserMedicalRecordsDatum,
  UpdatePersonRecordStatusV1Input,
} from "../../__generated__/typescript-operations_all";
import { correlationConstants } from "../../utils/OT/correlationConstants";
import { useMutation } from "@apollo/react-hooks";
import updatePersonRecordStatus from "../../queries/updatePersonRecordStatus/updatePersonRecordStatus";
import BaseModal from "../../components/baseModal";
import InvitePatient from "../../components/patientInvite";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Link } from "react-router-dom";
import PlaylistAddSharpIcon from "@mui/icons-material/PlaylistAddSharp";
import { Box, Divider } from "@mui/material";
import CreatePageHeader from "../../components/createPageHeader";
import Chip from "@mui/material/Chip";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { Info } from "@mui/icons-material";
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
  useDataProvider,
} from "react-admin";
//import { useSelector } from "react-redux";
import useTraces from "../../hooks/useTraces";
//import type { AppState } from "../../types/comptypes";
// import jsonExport from "jsonexport/dist";
import { tommddyyyy } from "../../lib/universal/utils/dateFormator";
import { StatusFilter } from "./filters";
import { formatSSN } from "../../utils/validator";
import CustomEmpty from "../../components/customEmpty";
import { CO_ROLE_PPA } from "../../utils/roles";
import PageNotFound from "../../components/pageNotFound";
import CustomFilter from "../../components/customFilter";
import NotVerifiedBanner from "../../components/notVerifiedBanner";
import idVerifiedIcon from "../../images/idVerifiedIcon.png";
import { ContentPasteSearch } from "@mui/icons-material";
import MedicalRecordSearchTable from "./medicalRecordSearchTable";
import ConfirmMrrView from "./confirmMrrView";
import LoadingMrr from "./loadingMrr";
import { perPageMax } from "../../utils/pageConstants";
import ErrorMrr from "./errorMrr";
import { styled } from "@mui/material/styles";
import { UserContext } from "../../contexts";

const PREFIX = "patientTable";

const classes = {
  container: `${PREFIX}-container`,
  filterBar: `${PREFIX}-filterBar`,
  tableContainer: `${PREFIX}-tableContainer`,
  icons: `${PREFIX}-icons`,
  addIcon: `${PREFIX}-addIcon`,
  patientInviteButton: `${PREFIX}-patientInviteButton`,
  patientTable: `${PREFIX}-patientTable`,
  item: `${PREFIX}-item`,
  email: `${PREFIX}-email`,
  userGroup: `${PREFIX}-userGroup`,
  createdAt: `${PREFIX}-createdAt`,
  invitationStatus: `${PREFIX}-invitationStatus`,
  showIcon: `${PREFIX}-showIcon`,
  reminderIcon: `${PREFIX}-reminderIcon`,
  iconDiv: `${PREFIX}-iconDiv`,
  filterContainer: `${PREFIX}-filterContainer`,
  filter: `${PREFIX}-filter`,
  customHeaderem: `${PREFIX}-customHeader`,
  dataGridContainer: `${PREFIX}-dataGridContainer`,
  hideHeader: `${PREFIX}-hideHeader`,
  customColumn: `${PREFIX}-customColumn`,
  customDivider: `${PREFIX}-customDivider`,
  ssn: `${PREFIX}-ssn`,
  filterContent: `${PREFIX}-filterContent`,
  customHeader: `${PREFIX}-customHeader`,
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`&.${classes.container}`]: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
    flex: "1 1 auto",
    overflowY: "hidden",
    overflowX: "scroll",
  },
  [`& .${classes.filterBar}`]: {
    marginBottom: "20px",
  },
  [`& .${classes.tableContainer}`]: {
    width: "100%",
    overflowX: "auto",
  },
  [`&.${classes.icons}`]: {
    margin: "0px",
    padding: "0px",
    paddingRight: "3px",
  },
  [`& .${classes.addIcon}`]: {
    marginRight: theme.spacing(1),
  },
  [`&.${classes.patientInviteButton}`]: {
    "&:hover": {
      backgroundColor: "#ffffff",
    },
    marginTop: "15px",
    float: "right",
  },
  [`& .${classes.filterBar}`]: {
    marginRight: "20px",
    fontWeight: 600,
  },
  [`& .${classes.patientTable}`]: {
    "& th": {
      borderBottom: "2px solid #ccc",
    },
  },
  [`&.${classes.item}`]: {
    fontSize: "12px",
    lineHeight: "1",
  },
  [`& .${classes.email}`]: {
    maxWidth: 150,
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-all",
  },
  [`&.${classes.userGroup}`]: {
    maxWidth: 100,
  },
  [`& .${classes.createdAt}`]: {
    maxWidth: 120,
  },
  [`& .${classes.createdAt}`]: {
    maxWidth: 120,
  },
  [`&.${classes.invitationStatus}`]: {
    maxWidth: 100,
  },
  [`& .${classes.showIcon}`]: {
    color: "green",
  },
  [`& .${classes.reminderIcon}`]: {
    color: "blue",
  },
  [`& .${classes.iconDiv}`]: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
  },
  [`&.${classes.filterContainer}`]: {
    display: "flex",
    order: -1,
    paddingRight: "20px",
  },
  [`& .${classes.filter}`]: {
    backgroundColor: theme.palette.primary.light,
    width: 200,
    display: "flex",
    flexDirection: "column",
  },
  [`&.${classes.filterContent}`]: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  [`& .${classes.customHeader}`]: {
    width: "200px",
  },
  [`& .${classes.dataGridContainer}`]: {
    width: "700px",
    maxWidth: "100%",
  },
  [`&.${classes.hideHeader}`]: {
    "& .MuiDataGrid-columnHeaders": {
      minHeight: "0!important",
      maxHeight: "0!important",
      lineHeight: "0!important",
    },
  },
  [`& .${classes.customColumn}`]: {
    width: "200px",
  },
  [`&.${classes.customDivider}`]: {
    margin: 0,
    borderStyle: "hidden!important ",
    borderColor: "rgba(0, 0, 0, 0.12)",
    borderBottomWidth: "inherit!important",
    disply: "none",
  },
  [`& .${classes.ssn}`]: {
    maxWidth: 150,
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-all",
    paddingLeft: "3px",
    paddingRight: "3px",
  },
  "& .ra-datagrid .ra-no-results": {
    display: "none",
  },
}));

export const PatientList = (props: ListProps): ReactElement => {
  const refresh = useRefresh();
  const notify = useNotify();
  const translate = useTranslate();
  const { getTrace, handleTrace } = useTraces();
  const [isOpen, setIsOpen] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [openPatientInvitePopup, setOpenPatientInvitePopup] =
    React.useState(false);
  // const [response, setResponse] = useState<string>(null);
  const [response, setResponse] = useState<string | null>(null);

  const [openDeleteBase, setOpenDeleteBase] = React.useState(false);
  const [emailNotVerified, setEmailNotVerified] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(false);
  const [openSearchBase, setOpenSearchBase] = React.useState<boolean>(false);
  const [openLoadingBase, setOpenLoadingBase] = React.useState<boolean>(false);
  const [openErrorBase, setOpenErrorBase] = React.useState<boolean>(false);
  const [openConfirmBase, setOpenConfirmBase] = React.useState<boolean>(false);

  const [openInviteBase, setOpenInviteBase] = React.useState<boolean>(false);

  const [selectedId, setSelectedId] = React.useState("");
  const [selectedPatientData, setSelectedPatientData] = React.useState(null);
  // const userInfoReducer = useSelector(
  //   (state: AppState) => state.userInfoReducer,
  // );
  const userInfoReducer: any = useContext(UserContext);
  const [subscribeUpdateRequestTokenMutation] = useMutation(
    updatePersonRecordStatus,
    {}
  );
  useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setEmailNotVerified(true);
      setShowBanner(true);
    }
  }, []);
  useEffect(() => {
    setOpenConfirmBase(false);
    setOpenSearchBase(false);
    setOpenLoadingBase(false);
    setOpenErrorBase(false);
    setResponse(null);
  }, [selectedId]);
  const handleClosePatientInvite = (): void => {
    setOpenPatientInvitePopup(false);
    refresh();
  };
  const deletePatient = (): void => {
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
      "background-color: #008000 ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
    );
    console.log(eventObj);
    console.groupEnd();
    const inputContext = {
      action: "Closed Patient Account",
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
          name: "Attempt to close Patient Account",
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
              " userInfoReducer.email"
            );
          } else {
            notify(
              translate("resources.patients.accountCloseError")
              // "warning"
            );
          }
        });
      }
    );
  };

  // function exportPatient(patientDemographics: any): void {
  //   getTrace("Export Clicked", "ev-086", userInfoReducer.email);
  //   jsonExport(patientDemographics, (_err, csv) => {
  //     downloadCSV(csv, "patientDemographics");
  //     getTrace(
  //       "Patient Demographics file downloaded as csv format",
  //       "ev-087",
  //       userInfoReducer.email
  //     );
  //   });
  // }

  const rowStyle = (): { borderBottom: string; borderTop: string } => {
    return { borderBottom: "1px solid #ccc", borderTop: "1px solid #ccc" };
  };

  const CustomButtonLinkField = (props: any): JSX.Element => {
    const [expanded, toggleExpanded] = useExpanded(
      "patientDemographics",
      props.record?.id
    );
    useEffect(() => {
      if (props?.record?.id !== selectedId) {
        if (expanded) {
          toggleExpanded();
        }
      }
    }, []);
    const handleInviteClick = (): void => {
      if (props.record?.inviteDetails) {
        setOpenInviteBase(true);
      } else {
        setSelectedPatientData(props?.record);
        setOpenPatientInvitePopup(true);
      }
    };
    const handleEditClick = (): void => {
      setSelectedPatientData(props.record);
    };
    const onExpandClick = (): void => {
      toggleExpanded();
      setSelectedId(props.record?.id);
    };
    const isDisabled = emailNotVerified;
    return (
      <StyledDiv className={classes.iconDiv}>
        <IconButton
          className={classes.icons}
          color="primary"
          onClick={onExpandClick}
        >
          {!expanded ? (
            <Tooltip title="View More">
              <Visibility className={classes.showIcon} />
            </Tooltip>
          ) : (
            <Tooltip title="View Less">
              <VisibilityOff className={classes.showIcon} />
            </Tooltip>
          )}
        </IconButton>
        <Tooltip
          title={
            isDisabled
              ? translate("tooltip.patient.editEmailNotVerified")
              : props.record?.status === "Verified"
              ? translate("tooltip.patient.editIdVerified")
              : translate("tooltip.patient.edit")
          }
        >
          <div>
            <IconButton
              className={classes.icons}
              color="primary"
              component={Link}
              onClick={handleEditClick}
              to={{
                pathname: `/patients/${props.record?.id}`,
                state: {
                  patientDetails: props.record,
                  isForEdit: true,
                  type: "patient",
                },
              }}
              disabled={isDisabled || props.record?.status === "Verified"}
            >
              <EditIcon
                style={{
                  color: isDisabled ? "grey" : "primary",
                }}
              />
            </IconButton>
          </div>
        </Tooltip>
        <Tooltip
          title={
            props.record?.registrationStatus === "REGISTERED"
              ? translate("tooltip.patient.inviteRegistered")
              : translate("tooltip.patient.inviteIcon")
          }
        >
          <div>
            <IconButton
              className={classes.icons}
              color="primary"
              onClick={handleInviteClick}
              disabled={
                props.record?.registrationStatus === "REGISTERED" ? true : false
              }
            >
              <PersonAddAltIcon
                style={{
                  width: "20px",
                  height: "20px",
                  color:
                    props.record?.registrationStatus === "REGISTERED"
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
              : "Cancel Patient"
          }
        >
          <div>
            <IconButton
              className={classes.icons}
              color="primary"
              disabled={isDisabled ? true : false}
              onClick={() => {
                setOpenDeleteBase(true);
                setSelectedId(props.record?.id);
              }}
            >
              <Delete
                style={{
                  color: isDisabled ? "grey" : "red",
                }}
              />
            </IconButton>
          </div>
        </Tooltip>
      </StyledDiv>
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
    // const useStyles = makeStyles({
    //   customHeader: {
    //     width: "200px",
    //   },
    //   dataGridContainer: {
    //     width: "700px",
    //     maxWidth: "100%",
    //   },
    //   hideHeader: {
    //     "& .MuiDataGrid-columnHeaders": {
    //       minHeight: "0!important",
    //       maxHeight: "0!important",
    //       lineHeight: "0!important",
    //     },
    //   },
    //   customColumn: {
    //     width: "200px",
    //   },
    //   customValue: {
    //     marginLeft: "20px",
    //   },
    //   customDivider: {
    //     margin: 0,
    //     borderStyle: "hidden!important ",
    //     borderColor: "rgba(0, 0, 0, 0.12)",
    //     borderBottomWidth: "inherit!important",
    //     disply: "none",
    //   },
    //   info: {
    //     cursor: "auto",
    //     width: "20px",
    //     height: "15px",
    //     color: "grey",
    //   },
    //   tab: {
    //     textTransform: "none",
    //     fontSize: "12px",
    //     fontWeight: 500,
    //   },
    // });
    // const classes = useStyles();
    const record = useRecordContext();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const [currTab, setCurrTab] = React.useState("");
    const [FirstNameTooltipTitle, setFirstNameTooltipTitle] = React.useState(
      translate(`resources.patients.noInfoDetails.noFirstname`)
    );
    const [MiddleNameTooltipTitle, setMiddleNameTooltipTitle] = React.useState(
      translate(`resources.patients.noInfoDetails.noMiddlename`)
    );
    const [LastNameTooltipTitle, setLastNameTooltipTitle] = React.useState(
      translate(`resources.patients.noInfoDetails.noLastname`)
    );
    const [phoneTooltipTitle, setPhoneTooltipTitle] = React.useState(
      translate(`resources.patients.noInfoDetails.noPhone`)
    );

    const [showPreviousAddressDetails, setShowPreviousAddressDetails] =
      React.useState(false);
    const togglePreviousAddressDetails = (): void => {
      setShowPreviousAddressDetails(!showPreviousAddressDetails);
    };
    const [showInviteDetails, setShowInviteDetails] = React.useState(false);
    const [showInviteStatusDetails, setShowInviteStatusDetails] =
      React.useState(false);
    const previousAddressData = record.previousAddress
      ? JSON.parse(record.previousAddress).previous_address_json
      : null;
    const sexObject = JSON.parse(record.sex);
    const sexValue = sexObject.other ? sexObject.other_value : sexObject.value;
    const [loading, setLoading] = useState<boolean>(true);
    const [mrrList, setMrrList] = React.useState<UserMedicalRecordsDatum[]>([]);
    const genderObject = JSON.parse(record.gender);
    const genderValue = genderObject.other
      ? genderObject.other_value
      : genderObject.value;

    const InviteData = record.inviteDetails
      ? JSON.parse(record.inviteDetails).invite_details_json
      : null;
    const toggleInviteDetails = (): void => {
      setShowInviteDetails(!showInviteDetails);
      if (InviteData !== null) {
        setShowInviteStatusDetails(true);
      }
    };
    const getRowHeight = (): number => {
      return 35;
    };
    const getTabStyle = (tabValue: any) => {
      if (currTab === tabValue) {
        return { color: "blue" };
      }
      return {};
    };

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
        //headerClassName: classes.customColumn,
        //cellClassName: classes.customColumn,
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
        id: 31,
        label: translate(`resources.patients.expandFields.suffix`),
        value: record.suffix && record.suffix.trim() ? record.suffix : null,
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
        label: translate(`resources.patients.expandFields.Address.address1`),
        value: record.address1 ? record.address1 : null,
      },
      {
        id: 11,
        label: translate(`resources.patients.expandFields.Address.address2`),
        value: record.address2 ? record.address2 : null,
      },
      {
        id: 12,
        label: translate(`resources.patients.expandFields.Address.country`),
        value: record.country ? record.country : null,
      },
      {
        id: 13,
        label: translate(`resources.patients.expandFields.Address.state`),
        value: record.state ? record.state : null,
      },
      {
        id: 14,
        label: translate(`resources.patients.expandFields.Address.city`),
        value: record.city ? record.city : null,
      },
      {
        id: 15,
        label: translate(`resources.patients.expandFields.Address.zip`),
        value: record.zip ? record.zip : null,
      },
      {
        id: 16,
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
              id: 17,
              label: translate(
                `resources.patients.expandFields.previousAddressDetails.previous_address1`
              ),
              value: previousAddressData?.previous_address1 || null,
            },
            {
              id: 18,
              label: translate(
                `resources.patients.expandFields.previousAddressDetails.previous_address2`
              ),
              value: previousAddressData?.previous_address2 || null,
            },
            {
              id: 19,
              label: translate(
                `resources.patients.expandFields.previousAddressDetails.previous_country`
              ),
              value: previousAddressData?.previous_country || null,
            },
            {
              id: 20,
              label: translate(
                `resources.patients.expandFields.previousAddressDetails.previous_state`
              ),
              value: previousAddressData?.previous_state || null,
            },
            {
              id: 21,
              label: translate(
                `resources.patients.expandFields.previousAddressDetails.previous_city`
              ),
              value: previousAddressData?.previous_city || null,
            },
            {
              id: 22,
              label: translate(
                `resources.patients.expandFields.previousAddressDetails.previous_zip`
              ),
              value: previousAddressData?.previous_zip || null,
            },
          ]
        : []),
      {
        id: 23,
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
                    id: 24,
                    label: translate(
                      `resources.patients.expandFields.inviteDetails.invite_status`
                    ),
                    value: InviteData?.invite_status || null,
                  },
                  {
                    id: 25,
                    label: translate(
                      `resources.patients.expandFields.inviteDetails.signup_completed_date`
                    ),

                    value: InviteData?.signup_completed_date
                      ? tommddyyyy(InviteData.signup_completed_date)
                      : null,
                  },
                  {
                    id: 26,
                    label: translate(
                      `resources.patients.expandFields.inviteDetails.first_sign_in_date`
                    ),
                    value: InviteData?.first_sign_in_date
                      ? tommddyyyy(InviteData.first_sign_in_date)
                      : null,
                  },
                ]
              : [
                  {
                    id: 27,
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
    // const [selectedIntegration, setSelectedIntegration] =
    //   useState<string>(null);
    const [selectedIntegration, setSelectedIntegration] = useState<
      string | null
    >(null);

    useEffect(() => {
      if (
        openConfirmBase ||
        openSearchBase ||
        openLoadingBase ||
        openErrorBase ||
        response
      ) {
        setCurrTab("mrr");
      } else {
        setCurrTab("personal");
      }
      setFirstNameTooltipTitle(
        translate(`resources.patients.noInfoDetails.noFirstname`)
      );
      setMiddleNameTooltipTitle(
        translate(`resources.patients.noInfoDetails.noMiddlename`)
      );
      setLastNameTooltipTitle(
        translate(`resources.patients.noInfoDetails.noLastname`)
      );
      setPhoneTooltipTitle(
        translate(`resources.patients.noInfoDetails.noPhone`)
      );
      getMrrDetails();
    }, [response]);
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "createdAt", order: "DESC" as const },
      filter: {
        partyId: selectedId,
      },
    };
    function getMrrDetails(): void {
      dataProvider
        .getList("userMedicalRecordsData", queryOption)
        .then(({ data }) => {
          setMrrList(data);
          setLoading(false);
        })
        .catch((error) => error);
    }
    return (
      <>
        <Tabs
          onChange={(event, value) => {
            setCurrTab(value);
          }}
          scrollButtons="auto"
          style={{ marginBottom: "5px", marginLeft: "15px" }}
          variant="scrollable"
          value={currTab}
        >
          <Tab
            key={"1"}
            style={{ textTransform: "none", ...getTabStyle("personal") }}
            label={<Typography>Personal Information</Typography>}
            value={"personal"}
            icon={<AccountCircle />}
          />
          {record?.status === "Verified" && (
            <Tab
              key={"2"}
              style={{ textTransform: "none", ...getTabStyle("mrr") }}
              label={<Typography>Medical Records Search</Typography>}
              value={"mrr"}
              icon={<ContentPasteSearch />}
            />
          )}
        </Tabs>
        {currTab === "personal" && (
          <Box
            sx={{
              width: "100%",
              bgcolor: "transparent",
              overflowX: "auto",
            }}
          >
            <Divider className={classes.customDivider} />
            <div className={classes.dataGridContainer}>
              <DataGrid
                style={{ marginLeft: "5%" }}
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
                            {translate(
                              `resources.patients.noInfoDetails.noInfo`
                            )}
                            <Tooltip title={FirstNameTooltipTitle}>
                              <Info />
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
                            {translate(
                              `resources.patients.noInfoDetails.noInfo`
                            )}
                            <Tooltip title={MiddleNameTooltipTitle}>
                              <Info />
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
                            {translate(
                              `resources.patients.noInfoDetails.noInfo`
                            )}
                            <Tooltip title={LastNameTooltipTitle}>
                              <Info />
                            </Tooltip>
                          </span>
                        );
                      }
                      if (
                        params.row.label ===
                        translate(`resources.patients.expandFields.suffix`)
                      ) {
                        return (
                          <span>
                            {translate(
                              `resources.patients.noInfoDetails.noInfo`
                            )}
                            <Tooltip
                              title={translate(
                                `resources.patients.noInfoDetails.noInfo`
                              )}
                            >
                              <Info />
                            </Tooltip>
                          </span>
                        );
                      } else if (
                        params.row.label ===
                        translate(`resources.patients.expandFields.phone`)
                      ) {
                        return (
                          <span>
                            {translate(
                              `resources.patients.noInfoDetails.noInfo`
                            )}
                            <Tooltip title={phoneTooltipTitle}>
                              <Info />
                            </Tooltip>
                          </span>
                        );
                      }
                      // else if (
                      //   params.row.label ===
                      //   translate(
                      //     `resources.patients.expandFields.inviteDetails.invite_status`,
                      //   )
                      // ) {
                      //   return <></>;
                      // }
                      return (
                        <span>
                          {translate(`resources.patients.noInfoDetails.noInfo`)}
                          <Tooltip
                            title={translate(
                              `resources.patients.noInfoDetails.noInfo`
                            )}
                          >
                            <Info />
                          </Tooltip>
                        </span>
                      );
                    }
                  },
                  key: column.field,
                }))}
                // autoHeight
                // hideFooter
                // disableRowSelectionOnClick
                // className={classes.hideHeader}
                // getRowHeight={getRowHeight}
                autoHeight
                // disableSelectionOnClick
                // className={classes.hideHeader}
                getRowId={(row) => row.id}
                components={{
                  NoRowsOverlay: CustomEmpty, // Your custom NoRowsOverlay component
                }}
              />
            </div>
          </Box>
        )}
        {currTab === "mrr" && (
          <>
            <Card>
              <div style={{ textAlign: "center" }}>
                <div style={{ margin: "20px" }}>
                  <Button
                    color="primary"
                    onClick={() => {
                      setCurrTab("mrr");
                      setOpenConfirmBase(true);
                    }}
                    startIcon={<Assignment />}
                    variant="contained"
                    style={{ margin: "20px", textTransform: "none" }}
                  >
                    Get Medical Records
                  </Button>
                </div>
                {!loading && (
                  <>
                    {!(mrrList?.length > 0)
                      ? !openConfirmBase &&
                        !openLoadingBase && (
                          <Typography
                            align="center"
                            gutterBottom
                            variant="subtitle1"
                            style={{ marginBottom: "20px" }}
                          >
                            No medical records searched yet.
                          </Typography>
                        )
                      : !openConfirmBase &&
                        !openLoadingBase && (
                          <MedicalRecordSearchTable
                            mrrList={mrrList}
                            setResponse={setResponse}
                          />
                        )}
                  </>
                )}
                {/* <ConfirmMrrView
                  open={openConfirmBase}
                  onClose={() => {
                    setOpenConfirmBase(false);
                  }}
                  setOpenLoadingBase={setOpenLoadingBase}
                  setOpenErrorBase={setOpenErrorBase}
                  setSelectedIntegration={setSelectedIntegration}
                  // selectedIntegration={selectedIntegration}
                  selectedPatientId={selectedId}
                /> */}
                <LoadingMrr
                  open={openLoadingBase}
                  onClose={() => {
                    setOpenLoadingBase(false);
                  }}
                  setOpenSearchBase={setOpenSearchBase}
                />
                <ErrorMrr
                  open={openErrorBase}
                  onClose={() => {
                    setOpenErrorBase(false);
                  }}
                />
              </div>
            </Card>
          </>
        )}
      </>
    );
  };
  return (
    <>
      {userInfoReducer.role === CO_ROLE_PPA ? (
        <>
          <InvitePatient
            open={openPatientInvitePopup}
            patientData={selectedPatientData}
            handleClose={handleClosePatientInvite}
          />
          <div id="patientTable" className={classes.container}>
            {showBanner && <NotVerifiedBanner setShowBanner={setShowBanner} />}
            <div id="patientList" style={{ display: "column" }}>
              <div style={{ float: "left", paddingBottom: "20px" }}>
                <CreatePageHeader
                  subTitle=""
                  mainTitle="resources.patients.patientList"
                />
              </div>
              <div
                style={{
                  float: "right",
                  marginRight: "6%",
                  marginBottom: "10px",
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
                      : "Add new patient"
                  }
                >
                  <Button
                    disabled={emailNotVerified ? true : false}
                    className={classes.patientInviteButton}
                    color="primary"
                    // component={Link}
                    // to={{
                    //   pathname: "/patients",
                    //   state: {
                    //     patientDetails: null,
                    //     isForEdit: false,
                    //     type: "patient",
                    //   },
                    // }}
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
                      <CustomEmpty type="patient" />
                    ) : (
                      <CustomEmpty type="noResults" />
                    )
                  }
                  filter={{
                    firstName: filterValue,
                  }}
                  perPage={10}
                  // exporter={exportPatient}
                  aside={<FilterSidebar />}
                  className={classes.filterBar}
                >
                  <div className={classes.tableContainer}>
                    <Datagrid
                      optimized
                      className={classes.patientTable}
                      rowStyle={rowStyle}
                      expand={<ExpandPanel />}
                    >
                      <FunctionField
                        label={
                          <span style={{ paddingLeft: "20px" }}>
                            {translate(
                              "resources.patients.fields.patient_name"
                            )}
                          </span>
                        }
                        render={(record: any) => (
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            {" "}
                            {record?.status === "Verified" ? (
                              <Tooltip
                                title={translate("tooltip.patient.idVerified")}
                              >
                                <img
                                  src={idVerifiedIcon}
                                  style={{
                                    width: "25px",
                                    height: "20px",
                                    marginRight: "5px",
                                  }}
                                />
                              </Tooltip>
                            ) : (
                              <div
                                style={{
                                  width: "25px",
                                  height: "20px",
                                  marginRight: "5px",
                                }}
                              ></div>
                            )}
                            {`${record.firstName} ${
                              record.middleName ? record.middleName : ""
                            } ${record.lastName}`}
                          </div>
                        )}
                      />
                      <FunctionField
                        render={(record: any) => (
                          <span>
                            {record.birthDate
                              ? tommddyyyy(record.birthDate)
                              : ""}
                          </span>
                        )}
                        label={translate("resources.patients.fields.dob")}
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
                      />
                      <FunctionField
                        label={translate("resources.patients.fields.email")}
                        render={(record: any) => (
                          <span>
                            <a href={"mailto:" + record.email}>
                              {record.email}
                            </a>
                          </span>
                        )}
                        cellClassName={classes.email}
                      />

                      <TextField
                        label={translate(
                          "resources.patients.fields.phone_number"
                        )}
                        source="phoneNumber"
                      />
                      <FunctionField
                        label={translate("resources.patients.fields.status")}
                        render={(record: any) => (
                          <span>
                            {record?.registrationStatus === "Virtual" ? (
                              <Chip
                                label={translate(
                                  "resources.patients.fields.registrationStatusVirtual"
                                )}
                                style={{ width: "80px" }}
                              />
                            ) : record?.registrationStatus === "REGISTERED" ? (
                              <Chip
                                label={translate(
                                  "resources.patients.fields.registrationStatus"
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
              confirmAction={deletePatient}
              onClose={() => {
                setOpenDeleteBase(false);
              }}
              title={translate("resources.patients.delete.deleteTitle")}
              content={translate("resources.patients.delete.deleteMessage")}
              successButtonName="Delete"
              type="delete"
            />
          )}
          {/* {openInviteBase && (
            <BaseModal
              open={openInviteBase}
              confirmAction={() => {
                setOpenInviteBase(false);
              }}
              onClose={() => {
                setOpenInviteBase(false);
              }}
              title={translate("resources.patients.noInviteTitle")}
              content={translate("resources.patients.noInviteMessage")}
              closeButtonName="Okay, got it"
              type="reminderWarning"
            />
          )} */}
        </>
      ) : (
        <PageNotFound />
      )}
    </>
  );
};
