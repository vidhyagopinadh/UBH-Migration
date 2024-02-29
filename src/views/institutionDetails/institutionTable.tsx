import React from "react";
import type { ListProps } from "react-admin";
import type { ReactElement } from "react";
// import { Card, CardContent, IconButton, makeStyles } from "@material-ui/core";
import { BootstrapTooltip as Tooltip } from "../../components/Tooltip";
// import { Visibility, VisibilityOff } from "@material-ui/icons";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import {
  Grid,
  Box,
  Divider,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import CreatePageHeader from "../../components/createPageHeader";
import Chip from "@mui/material/Chip";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import InfoIcon from "@mui/icons-material/Info";
import {
  Datagrid,
  TextField,
  List,
  FunctionField,
  useTranslate,
  useRecordContext,
  useExpanded,
  downloadCSV,
} from "react-admin";
import jsonExport from "jsonexport/dist";
import { StatusFilter } from "./filters";
import { Base64 } from "js-base64";
// import type { AppState } from "../../types";
// import { useSelector } from "react-redux";
import { CO_ROLE_ADMIN } from "../../utils/roles";
import PageNotFound from "../../components/pageNotFound";
import CustomFilter from "../../components/customFilter";
import CustomEmpty from "../../components/customEmpty";
import { Visibility, VisibilityOff } from "@mui/icons-material";



const PREFIX = "InstitutionList";
const classes = {
  container: `${PREFIX}-container`,
  filterBar: `${PREFIX}-filterBar`,
  tableContainer: `${PREFIX}-tableContainer`,
  icons: `${PREFIX}- icons`,
  institutionTable: `${PREFIX}-institutionTable`,
  item: `${PREFIX}-item`,
  email: `${PREFIX}- email`,
  showIcon: `${PREFIX}-showIcon`,
  iconDiv: `${PREFIX}-iconDiv`,
  filterContainer: `${PREFIX}-filterContainer`,
  filter: `${PREFIX}-filter`,
  filterContent: `${PREFIX}- filterContent`,
  customHeader: `${PREFIX}- customHeader`,
  dataGridContainer: `${PREFIX}-dataGridContainer`,
  hideHeader: `${PREFIX}-hideHeader`,
  customColumn: `${PREFIX}-customColumn`,
  customDivider: `${PREFIX}-customDivider`,
  website: `${PREFIX}-website`,
  institutionName: `${PREFIX}-institutionName`,
  institutionType: `${PREFIX}-institutionType`,
};
const Root = styled("div")(({ theme }) => ({
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
    margin: "0px", padding: "0px", paddingRight: "3px"
  },
  [`& .${classes.institutionTable}`]: {
    "& th": {
            borderBottom: "2px solid #ccc",
          },
          "& .MuiToolbar-root": {
            minHeight: 0,
          },
          ".MuiToolbar-regular": {
            height: "0px !important",
          },
  },
  [`& .${classes.item}`]: {
    fontSize: "12px",
       lineHeight: "1",
  },
  [`&.${classes.email}`]: {
    maxWidth: 200,
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-all",
  },
  [`& .${classes.showIcon}`]: {
    color: "green",
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
  [`& .${classes.filterContent}`]: {
    flex: 1,
        display: "flex",
        flexDirection: "column",
  },
  [`&.${classes.customHeader}`]: {
    width: "200px",
  },
  [`& .${classes.dataGridContainer}`]: {
    width: "700px",
     maxWidth: "100%",
  },
  [`& .${classes.hideHeader}`]: {
    "& .MuiDataGrid-columnHeaders": {
            minHeight: "0!important",
            maxHeight: "0!important",
            lineHeight: "0!important",
  },
  [`&.${classes.customColumn}`]: {
    width: "200px",
  },
  [`& .${classes.customDivider}`]: {
    margin: 0,
    borderStyle: "hidden!important ",
    borderColor: "rgba(0, 0, 0, 0.12)",
    borderBottomWidth: "inherit!important",
    disply: "none",
  },
  [`& .${classes.website}`]: {
    maxWidth: 150,
        overflow: "hidden",
        textOverflow: "ellipsis",
        wordBreak: "break-all",
  },
  [`&.${classes.institutionName}`]: {
    maxWidth: 150,
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-all",
  },
  [`& .${classes.institutionType}`]: {
    maxWidth: 250,
        overflow: "hidden",
        textOverflow: "ellipsis",
        wordBreak: "break-all",
  },
}));

export const InstitutionList = (props: ListProps): ReactElement => {
  const classes = useStyles();
  const translate = useTranslate();
  const rowStyle = (): { borderBottom: string } => {
    return { borderBottom: "1px solid #ccc" };
  };
  const [selectedId, setSelectedId] = React.useState<string>(null);
  const [filterValue, setFilterValue] = React.useState("");
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer
  );
  function exportInstitution(institutions): void {
    jsonExport(institutions, (err, csv) => {
      downloadCSV(csv, "institutions");
    });
  }
  const CustomButtonLinkField = (props): JSX.Element => {
    const [expanded, toggleExpanded] = useExpanded(
      "institutions",
      props.record.id
    );
    React.useEffect(() => {
      if (props.record.id !== selectedId) {
        if (expanded) {
          toggleExpanded();
        }
      }
    }, []);
    return (
      <div className={classes.iconDiv}>
        <IconButton
          className={classes.icons}
          color="primary"
          onClick={() => {
            toggleExpanded();
            setSelectedId(props.record.id);
          }}
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
            props.record.status === "Approved"
              ? "You cannot edit information of approved institutions"
              : "Edit Institution"
          }
        >
          <span>
            <IconButton
              className={classes.icons}
              color="primary"
              component={Link}
              disabled={props.record.status === "Approved"}
              to={{
                pathname: `/institutions/${props.record.id}`,
              }}
            >
              <EditIcon
                style={{
                  color:
                    props.record.status === "Approved" ? "grey" : "primary",
                }}
              />
            </IconButton>
          </span>
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
    const useStyles = makeStyles({
      customHeader: {
        width: "50px",
      },
      dataGridContainer: {
        width: "1300px",
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
        minWidth: "308px !important",
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
    const columns: GridColDef[] = [
      {
        field: "label",
        headerName: "",
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
        label: translate(`resources.institutions.fields.institution_name`),
        value: record.institutionName,
      },

      {
        id: 2,
        label: translate(`resources.institutions.fields.institution_type`),
        value: record.institutionType,
      },
      {
        id: 3,
        label: translate(`resources.institutions.fields.institution_email`),
        value: record.institutionEmail,
      },
      {
        id: 13,
        label: translate(
          `resources.institutions.fields.institution_directAddress`
        ),
        value: record.directAddress,
      },
      {
        id: 4,
        label: translate(`resources.institutions.fields.institution_phone`),
        value: record.phoneNumber,
      },
      {
        id: 5,
        label: translate(`resources.institutions.fields.institution_fax`),
        value: record.faxNumber,
      },
      {
        id: 6,
        label: translate(`resources.institutions.fields.institution_website`),
        value: record.website,
      },
      {
        id: 7,
        label: translate(`resources.institutions.fields.institution_address`),
        value: record.address,
      },
      {
        id: 8,
        label: translate(`resources.institutions.fields.institution_city`),
        value: record.city,
      },
      {
        id: 9,
        label: translate(`resources.institutions.fields.institution_state`),
        value: record.state,
      },
      {
        id: 10,
        label: translate(`resources.institutions.fields.institution_country`),
        value: record.country,
      },
      {
        id: 11,
        label: translate(`resources.institutions.fields.institution_zipCode`),
        value: record.zipCode,
      },
      {
        id: 12,
        label: translate(`resources.institutions.fields.status`),
        value: record.status,
      },
      {
        id: 14,
        label: translate(`resources.institutions.fields.description`),
        value: record.institutionDescription ? (
          <div
            style={{
              width: "100%",
              height: "50px",
              overflowX: "scroll",
              overflowY: "scroll",
              wordWrap: "break-word",
            }}
          >
            {Base64.atob(record.institutionDescription)}
          </div>
        ) : (
          ""
        ),
      },
      {
        id: 15,
        label: translate(`resources.institutions.fields.requester_name`),
        value: record.requesterName,
      },
      {
        id: 16,
        label: translate(`resources.institutions.fields.requester_email`),
        value: record.requesterEmail,
      },
      {
        id: 17,
        label: translate(`resources.institutions.fields.approver_name`),
        value: record.approverName
          ? record.approverName + "(" + record.approverEmail + ")"
          : "N/A",
      },
    ];

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
                  return (
                    <span>
                      {translate(`resources.patients.noInfoDetails.noInfo`)}
                      <Tooltip
                        title={translate(
                          `resources.patients.noInfoDetails.noInfo`
                        )}
                      >
                        <InfoIcon className={classes.info} />
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
            getRowHeight={(params) => {
              if (params.id === 14) {
                return 80;
              }
              return 35;
            }}
          />
        </div>
      </Box>
    );
  };

  return (
    <>
      {userInfoReducer.role === CO_ROLE_ADMIN ? (
        <div id="institutionTable" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item md={9}>
              <CreatePageHeader
                subTitle=""
                mainTitle="resources.institutions.list"
              />
            </Grid>
            <Grid item md={3}>
              <CustomFilter
                setFilterValue={setFilterValue}
                fieldName="institution name"
              />
            </Grid>
          </Grid>
          <div
            id="institutionList"
            style={{ display: "column", padding: "0px", margin: "0px" }}
          >
            <div style={{ float: "left", width: "100%" }}>
              <List
                {...props}
                bulkActionButtons={false}
                actions={<></>}
                //actions={<ExportButton />}
                title={" "}
                sort={{ field: "", order: "" }}
                perPage={10}
                empty={
                  !filterValue ? (
                    <CustomEmpty type="institution" />
                  ) : (
                    <CustomEmpty type="noResults" />
                  )
                }
                filter={{
                  institutionName: filterValue,
                }}
                exporter={exportInstitution}
                aside={<FilterSidebar />}
                className={classes.filterBar}
              >
                <div className={classes.tableContainer}>
                  <Datagrid
                    optimized
                    className={classes.institutionTable}
                    rowStyle={rowStyle}
                    expand={<ExpandPanel />}
                  >
                    <FunctionField
                      label={translate(
                        "resources.institutions.fields.institution_name"
                      )}
                      render={(record) => (
                        <span>{`${record.institutionName}`}</span>
                      )}
                      cellClassName={classes.institutionName}
                    />
                    <TextField
                      label={translate(
                        "resources.institutions.fields.institution_type"
                      )}
                      source="institutionType"
                      cellClassName={classes.institutionType}
                    />
                    <FunctionField
                      label={translate(
                        "resources.institutions.fields.institution_email"
                      )}
                      render={(record) => (
                        <span>
                          <a href={"mailto:" + record.institutionEmail}>
                            {record.institutionEmail}
                          </a>
                        </span>
                      )}
                      cellClassName={classes.email}
                    />
                    <FunctionField
                      label={translate(
                        "resources.institutions.fields.requester_name"
                      )}
                      render={(record) => (
                        <span>{`${record.requesterName}`}</span>
                      )}
                    />
                    <FunctionField
                      label={translate("resources.institutions.fields.status")}
                      render={(record) => (
                        <span>
                          {record.status === "Pending" ? (
                            <Chip
                              label={translate(
                                "resources.institutions.fields.pending"
                              )}
                              color="primary"
                              style={{ width: "80px" }}
                            />
                          ) : record.status === "Approved" ? (
                            <Chip
                              label={translate(
                                "resources.institutions.fields.approved"
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
      ) : (
        <PageNotFound />
      )}
    </>
  );
};
