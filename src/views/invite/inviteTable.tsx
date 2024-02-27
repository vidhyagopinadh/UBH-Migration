import * as React from "react";
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
} from "react-admin";
import { useEffect } from "react";
import { BootstrapTooltip as Tooltip } from "../../components/Tooltip";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Divider } from "@mui/material";
import { Info } from "@mui/icons-material";
import deleteInviteMutation from "../../queries/deleteInvite/deleteInvite";
import sendReminderMutation from "../../queries/sendReminderEmail/sendReminderEmail";
import getNotificationDetailsMutation from "../../queries/getNotificationDetails/getNotificationDetails";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Card, CardContent, IconButton } from "@mui/material";
import CreatePageHeader from "../../components/createPageHeader";
import BaseModal from "../../components/baseModal";
import { Add, Delete, Visibility, VisibilityOff } from "@mui/icons-material";
import { Schedule } from "@mui/icons-material";
import { UserTypeFilter, StatusFilter } from "./filters";
import moment from "moment";
import { tommddyyyy } from "../../utils/dateFormator";
import type {
  DeleteInviteInput,
  SendReminderEmailInput,
  GetNotificationDetailsInput,
} from "../../__generated__/typescript-operations_all";
import { DESCRIPTION_MAP } from "../../utils/constants";
import ReminderTable from "../../components/reminderTable";
// import { useSelector } from "react-redux";
// import type { AppState } from "../../types";
import { CO_ROLE_ADMIN } from "../../utils/roles";
import PageNotFound from "../../components/pageNotFound";
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
  },
  tableContainer: {
    width: "100%",
    overflowX: "auto",
  },
  icons: { margin: "0px", padding: "0px", paddingRight: "3px" },
  addIcon: {
    marginRight: theme.spacing(1),
  },
  inviteButton: {
    "&:hover": {
      backgroundColor: "#ffffff",
    },
    marginTop: "15px",
    float: "right",
  },
  inviteTable: {
    "& th": {
      borderBottom: "2px solid #ccc",
    },
  },
  item: {
    fontSize: "12px",
    lineHeight: "1",
  },
  fullName: {
    maxWidth: 150,
    wordBreak: "break-all",
  },
  email: {
    maxWidth: 150,
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-all",
  },
  userGroup: {
    maxWidth: 100,
  },
  invitedBy: {
    maxWidth: 100,
  },
  createdAt: {
    maxWidth: 30,
  },
  invitationStatus: {
    maxWidth: 150,
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
}));
export const InviteTable = (props): JSX.Element => {
  const classes = useStyles();
  const refresh = useRefresh();
  const translate = useTranslate();
  const notify = useNotify();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [showBanner, setShowBanner] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [emailNotVerified, setEmailNotVerified] = React.useState(false);
  const [isIntervalExeeds, setIsIntervalExeeds] = React.useState(false);
  const [isLimitExeeds, setIsLimitExeeds] = React.useState(false);
  const [confirmReminderSend, setConfirmReminderSend] = React.useState(false);
  const [openReminderSendMessage, setopenReminderSendMessage] =
    React.useState(false);
  const [lastReminderSendAt, setLastReminderSendAt] = React.useState("");
  const [remainingTime, setRemainingTime] = React.useState("");
  const [openDeleteBase, setOpenDeleteBase] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");
  const [invitationCode, setInvitationCode] = React.useState("");
  const [subscribeDeletionMutation] = useMutation(deleteInviteMutation, {});
  const [subscribeSendReminderMutation] = useMutation(sendReminderMutation, {});
  const [subscribeGetNotificationDetailsMutation] = useMutation(
    getNotificationDetailsMutation,
    {},
  );
  const [openReminderList, setOpenReminderList] = React.useState(false);
  React.useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setEmailNotVerified(true);
      setShowBanner(true);
    }
  }, []);
  const deleteInvite = (): void => {
    setOpenDeleteBase(false);
    const deleteInviteInput: DeleteInviteInput = {
      userInviteId: selectedId,
    };
    subscribeDeletionMutation({
      variables: { input: deleteInviteInput },
    }).then(() => {
      refresh();
      notify(translate("resources.invite.deleteInvite"), {
        type: "success",
      });
    });
  };
  const sendReminder = (): void => {
    setConfirmReminderSend(false);
    setopenReminderSendMessage(true);
    const sendReminderEmailInput: SendReminderEmailInput = {
      transactionRecordId: selectedId,
      notificationCode: invitationCode,
    };
    subscribeSendReminderMutation({
      variables: { input: sendReminderEmailInput },
    }).then(() => {
      refresh();
    });
  };
  const CustomButtonLinkField = (props): JSX.Element => {
    const [expanded, toggleExpanded] = useExpanded(
      "userInviteLists",
      props?.record?.id,
    );
    useEffect(() => {
      if (props.record.id !== selectedId) {
        if (expanded) {
          toggleExpanded();
        }
      }
    }, []);
    const onExpandClick = (): void => {
      toggleExpanded();
      setSelectedId(props.record.id);
    };
    const onReminderClick = (selectedId, invitationCode): void => {
      const getNotificationDetailsInput: GetNotificationDetailsInput = {
        notificationCode: invitationCode,
        recordId: selectedId,
      };
      subscribeGetNotificationDetailsMutation({
        variables: { input: getNotificationDetailsInput },
      }).then((response) => {
        const responseDetails = JSON.parse(
          response.data.getNotificationDetails.json,
        );
        const notificationLimit = responseDetails.notification_limit;
        const attempt = responseDetails.no_reminder_sent;
        setLastReminderSendAt(
          moment(responseDetails.last_reminder_sent_at).calendar(null, {
            sameDay: "[today at] h:mm A",
            lastDay: "[yesterday at] h:mm A",
            lastWeek: " 'at' MMM DD, YYYY h:mm A",
            sameElse: " 'at' MMM DD, YYYY h:mm A",
          }),
        );
        const interval = responseDetails.notification_interval;
        const timeDiff = responseDetails.time_difference;
        if (timeDiff === null) {
          setConfirmReminderSend(true);
        } else {
          const [days, hours, mins] = interval.split(":").map(parseFloat);
          const intervalTotalMilliseconds =
            ((days * 24 + hours) * 60 + mins) * 60 * 1000;

          const [dayss, hourss, minss] = timeDiff.split(":").map(parseFloat);
          const timeDiffTotalMilliseconds =
            ((dayss * 24 + hourss) * 60 + minss) * 60 * 1000;
          if (intervalTotalMilliseconds <= timeDiffTotalMilliseconds) {
            if (notificationLimit === 0) {
              setConfirmReminderSend(true);
            } else if (attempt >= notificationLimit) {
              setIsLimitExeeds(true);
            } else {
              setConfirmReminderSend(true);
            }
          } else {
            const differenceMilliseconds = Math.abs(
              intervalTotalMilliseconds - timeDiffTotalMilliseconds,
            );
            const differenceMinutes =
              Math.floor(differenceMilliseconds / (1000 * 60)) % 60;
            const differenceHours =
              Math.floor(differenceMilliseconds / (1000 * 60 * 60)) % 24;
            const differenceDays = Math.floor(
              differenceMilliseconds / (1000 * 60 * 60 * 24),
            );

            let formattedDifference = "";
            if (differenceDays > 0) {
              formattedDifference += `${differenceDays} day${
                differenceDays > 1 ? "s" : ""
              } `;
            }
            if (differenceHours > 0) {
              if (differenceHours > 1) {
                formattedDifference += `${differenceHours} hour${
                  differenceHours > 1 ? "s" : ""
                } `;
              } else {
                formattedDifference += `1 hour `;
              }
            }
            if (differenceMinutes > 0) {
              if (differenceMinutes > 1) {
                formattedDifference += `${differenceMinutes} minute${
                  differenceMinutes > 1 ? "s" : ""
                }`;
              } else {
                formattedDifference += `1 minute`;
              }
            }
            setRemainingTime(formattedDifference?.trim());
            setIsIntervalExeeds(true);
          }
        }
      });
    };

    return (
      <div className={classes.iconDiv}>
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
            props.record.invitationCode === "CANCELLED"
              ? "Sending reminders is not allowed for a canceled patient."
              : props.record.invitationCode === "LOGGED_IN"
              ? "Sending a reminder is not allowed for an already logged in patient. "
              : props.record.invitationCode === "EXPIRED"
              ? "Sending a reminder is not allowed for an expired invite."
              : "Send Reminder"
          }
        >
          <div>
            <IconButton
              className={classes.icons}
              disabled={
                props.record.invitationCode === "CANCELLED" ||
                props.record.invitationCode === "LOGGED_IN" ||
                props.record.invitationCode === "EXPIRED"
              }
              onClick={() => {
                setSelectedId(props.record.id);
                setInvitationCode(props.record.invitationCode);
                onReminderClick(props.record.id, props.record.invitationCode);
              }}
            >
              <Schedule
                style={{
                  color: ["LOGGED_IN", "EXPIRED", "CANCELLED"].includes(
                    props.record.invitationCode,
                  )
                    ? "grey"
                    : "blue",
                }}
              />
            </IconButton>
          </div>
        </Tooltip>
        <IconButton
          className={classes.icons}
          color="primary"
          disabled={emailNotVerified ? true : false}
          onClick={() => {
            setOpenDeleteBase(true);
            setSelectedId(props.record.id);
          }}
        >
          <Tooltip title="Cancel Invite">
            <Delete
              style={{
                color: "red",
              }}
            />
          </Tooltip>
        </IconButton>
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
            <UserTypeFilter />
          </CardContent>
        </Card>
      </div>
    );
  };
  const ExpandPanel = (): JSX.Element => {
    const record = useRecordContext();
    const translate = useTranslate();
    const [fullNameTooltipTitle, setFullNameTooltipTitle] = React.useState(
      translate(`tooltip.invite.noFullname`),
    );
    const [phoneTooltipTitle, setPhoneTooltipTitle] = React.useState(
      translate(`tooltip.invite.noPhone`),
    );

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
        headerClassName: classes.customColumn,
        cellClassName: classes.customColumn,
      },
    ];
    const rows = [
      {
        id: 1,
        label: translate(`resources.invite.expandFields.invitedDate`),
        value: record.createdAt ? tommddyyyy(record.createdAt) : null,
      },
      {
        id: 2,
        label: translate(`resources.invite.expandFields.invitedBy`),
        value: record.invitedBy ? record.invitedBy : null,
      },
      {
        id: 3,
        label: translate(`resources.invite.expandFields.status`),
        value: record.invitationStatus ? record.invitationStatus : null,
      },
      {
        id: 4,
        label: translate(`resources.invite.expandFields.linkOpenedOn`),
        value: record.openedDt ? tommddyyyy(record.openedDt) : null,
      },
      {
        id: 5,
        label: translate(`resources.invite.expandFields.group`),
        value: record.userGroup ? record.userGroup : null,
      },
      {
        id: 6,
        label: translate(`resources.invite.expandFields.name`),
        value:
          record.fullName && record.fullName.trim() ? record.fullName : null,
      },
      {
        id: 7,
        label: translate(`resources.invite.expandFields.email`),
        value: record.email ? record.email : null,
      },
      {
        id: 8,
        label: translate(`resources.invite.expandFields.phone`),
        value: record.phone ? record.phone : null,
      },
      // {
      //   id: 9,
      //   label: translate(`resources.invite.expandFields.emailStatus`),
      //   value: record.phone ? record.phone : null,
      // },
    ];
    useEffect(() => {
      setFullNameTooltipTitle(translate(`tooltip.invite.noFullname`));
      setPhoneTooltipTitle(translate(`tooltip.invite.noPhone`));
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
            //rows={filteredRows}
            //columns={columns}
            columns={columns.map((column) => ({
              ...column,
              renderCell: (params) => {
                if (params.value) {
                  return params.value;
                } else {
                  if (
                    params.row.label ===
                    translate(`resources.invite.expandFields.email`)
                  ) {
                    // Display a blank cell for the "email" field when it's null
                    return "";
                  } else if (
                    params.row.label ===
                    translate(`resources.invite.expandFields.name`)
                  ) {
                    return (
                      <span>
                        {translate(`tooltip.invite.noInfo`)}
                        <Tooltip title={fullNameTooltipTitle}>
                          <Info className={classes.info} />
                        </Tooltip>
                      </span>
                    );
                  } else if (
                    params.row.label ===
                    translate(`resources.invite.expandFields.phone`)
                  ) {
                    return (
                      <span>
                        {translate(`tooltip.invite.noInfo`)}
                        <Tooltip title={phoneTooltipTitle}>
                          <Info className={classes.info} />
                        </Tooltip>
                      </span>
                    );
                  } else if (
                    params.row.label ===
                    translate(`resources.invite.expandFields.linkOpenedOn`)
                  ) {
                    if (record.invitationCode === "INVITE_NOT_USED") {
                      return (
                        <span>
                          {translate(`tooltip.invite.noInfo`)}
                          <Tooltip
                            title={translate(`tooltip.invite.inviteNotUsed`)}
                          >
                            <Info className={classes.info} />
                          </Tooltip>
                        </span>
                      );
                    }
                  }
                  return (
                    <span>
                      {translate(`tooltip.invite.noInfo`)}
                      <Tooltip title={translate(`tooltip.invite.noInfo`)}>
                        <Info className={classes.info} />
                      </Tooltip>
                    </span>
                  );
                }
              },
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

  const rowStyle = (): { borderBottom: string } => {
    return { borderBottom: "1px solid #ccc" };
  };
  function renderDescription(
    status,
    expiredDate,
    lastReminderSentAt,
    openDt,
    id,
  ): JSX.Element {
    const additionalDescriptionMap = {
      AWAITING_LOGIN: "Invitation accepted,user not logged in yet",
      INVITE_NOT_USED: "Invitation not opened",
      OPENED: openDt ? `Invitation opened on ${tommddyyyy(openDt)}` : null,
      LOGGED_IN: "User logged in successfully",
      EXPIRED: `The invite expired  ${moment(expiredDate).fromNow()} ago`,
      CANCELLED: "Invitation cancelled",
    };
    const description = DESCRIPTION_MAP[status];
    const additionalDescription = additionalDescriptionMap[status];
    const showScheduleIcon = status !== "LOGGED_IN" && status !== "CANCELLED";
    if (description) {
      return (
        <>
          <span style={{ color: "green", fontWeight: 600 }}>{description}</span>
          <br />
          {additionalDescription && (
            <>
              <span>{additionalDescription}</span>
            </>
          )}
          <br />
          {showScheduleIcon && lastReminderSentAt && (
            <>
              <span>
                <Schedule
                  style={{
                    color: "#ff9800",
                    fontSize: "15px",
                    marginRight: "5px",
                  }}
                />
              </span>
              <span>
                Last Reminder Sent: {moment(lastReminderSentAt).fromNow(true)}{" "}
                ago{}
              </span>
              <span style={{ textDecoration: "underline", color: "blue" }}>
                <span
                  onClick={() => {
                    setOpenReminderList(true);
                    setSelectedId(id);
                  }}
                  style={{ cursor: "pointer", paddingLeft: "5px" }}
                >
                  More info
                </span>
              </span>
            </>
          )}
        </>
      );
    }
    return null;
  }
  const FormattedDateField = (props): JSX.Element => {
    const { record, source } = props;
    const formattedDate = tommddyyyy(record[source]);
    return <span>{formattedDate}</span>;
  };
  return (
    <>
      {userInfoReducer.role === CO_ROLE_ADMIN ? (
        <PageNotFound />
      ) : (
        <div id="inviteTable" className={classes.container}>
          {openDeleteBase && (
            <BaseModal
              open={openDeleteBase}
              confirmAction={deleteInvite}
              onClose={() => {
                setOpenDeleteBase(false);
              }}
              title={translate("resources.invite.deleteTitle")}
              content={translate("resources.invite.deleteMessage")}
              successButtonName="Delete"
              type="delete"
            />
          )}
          <BaseModal
            open={
              confirmReminderSend ||
              isIntervalExeeds ||
              isLimitExeeds ||
              openReminderSendMessage
            }
            confirmAction={sendReminder}
            onClose={() => {
              setConfirmReminderSend(false);
              setIsLimitExeeds(false);
              setIsIntervalExeeds(false);
              setopenReminderSendMessage(false);
            }}
            title={translate("resources.invite.reminder.confirmTitle")}
            content={
              isIntervalExeeds
                ? null
                : isLimitExeeds
                ? translate("resources.invite.reminder.reminderExeedsLimit")
                : openReminderSendMessage
                ? translate("resources.invite.reminder.reminderSend")
                : translate(
                    "resources.invite.reminder.sendReminderConfirmMessage",
                  )
            }
            successButtonName="Send"
            closeButtonName={
              isIntervalExeeds
                ? "Close"
                : isLimitExeeds
                ? "Close"
                : openReminderSendMessage
                ? "Close"
                : null
            }
            type={
              isIntervalExeeds
                ? "reminderIntervalError"
                : isLimitExeeds
                ? "reminderError"
                : openReminderSendMessage
                ? "reminderWarning"
                : "warning"
            }
            timeRemaining={remainingTime}
            lastReminderSendAt={lastReminderSendAt}
          />{" "}
          {openReminderList && (
            <ReminderTable
              open={openReminderList}
              onClose={() => {
                setOpenReminderList(false);
              }}
              selectedId={selectedId}
            />
          )}
          <div id="inviteList" style={{ display: "column" }}>
            {showBanner && <NotVerifiedBanner setShowBanner={setShowBanner} />}
            <div style={{ float: "left", paddingBottom: "20px", width: "50%" }}>
              <CreatePageHeader subTitle="" mainTitle="resources.invite.name" />
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
              <Button
                className={classes.inviteButton}
                color="primary"
                component={Link}
                to="/sendInvite"
                variant="contained"
              >
                <Add className={classes.addIcon} />
                {translate(`resources.invite.add`)}
              </Button>
            </div>
            <div style={{ float: "left", width: "100%" }}>
              <List
                {...props}
                bulkActionButtons={false}
                actions={<></>}
                title={" "}
                empty={
                  !filterValue ? (
                    <CustomEmpty type="invite" />
                  ) : (
                    <CustomEmpty type="noResults" />
                  )
                }
                filter={{
                  fullName: filterValue,
                }}
                sort={{ field: "createdAt", order: "DESC" }}
                perPage={10}
                aside={<FilterSidebar />}
                className={classes.filterBar}
              >
                <div className={classes.tableContainer}>
                  <Datagrid
                    optimized
                    className={classes.inviteTable}
                    rowStyle={rowStyle}
                    expand={<ExpandPanel />}
                  >
                    <TextField
                      label={translate("resources.invite.fields.name")}
                      source="fullName"
                      cellClassName={classes.fullName}
                    />
                    <FunctionField
                      label={translate("resources.invite.fields.email")}
                      render={(record) => (
                        <span>
                          <a href={"mailto:" + record.email}>{record.email}</a>
                        </span>
                      )}
                      cellClassName={classes.email}
                    />
                    <TextField
                      label={translate("resources.invite.fields.group")}
                      source="userGroup"
                      cellClassName={classes.userGroup}
                    />
                    <TextField
                      label={translate("resources.invite.fields.invitedBy")}
                      source="invitedBy"
                      cellClassName={classes.invitedBy}
                    />
                    <FormattedDateField
                      source="createdAt"
                      label={translate("resources.invite.fields.invitedDate")}
                      cellClassName={classes.createdAt}
                    />
                    <FunctionField
                      label={translate("resources.invite.fields.days")}
                      render={(record) => (
                        <span>{moment(record.createdAt).fromNow()}</span>
                      )}
                    />
                    <FunctionField
                      label={translate("resources.invite.fields.status")}
                      render={(record) => (
                        <>
                          {renderDescription(
                            record.invitationCode,
                            record.expiredDt,
                            record.lastReminderSentAt,
                            record.openedDt,
                            record.id,
                          )}
                        </>
                      )}
                      cellClassName={classes.invitationStatus}
                    />

                    <CustomButtonLinkField {...props} />
                  </Datagrid>
                </div>
              </List>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
