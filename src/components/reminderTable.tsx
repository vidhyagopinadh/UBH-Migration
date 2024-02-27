import React from "react";
import { useState, useEffect } from "react";
import { Modal, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { useDataProvider } from "react-admin";
import { perPageMax } from "../utils/pageConstants";
import { CircularProgress } from "@mui/material";

function ReminderTable({ open, onClose, selectedId }): JSX.Element {
  const dataProvider = useDataProvider();
  const [reminderList, setReminderList] = React.useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const CustomMoveIcon = (props: { colDef }): JSX.Element => {
    return <div>{props.colDef.headerName}</div>;
  };
  const queryOptionSort = {
    pagination: { page: 1, perPage: perPageMax },
    sort: { field: "notificationSendAt", order: "DESC" },
    filter: {
      transactionRefId: selectedId,
    },
  };
  function getReminderDetails(): void {
    dataProvider
      .getList("reminderNotificationDetails", queryOptionSort)
      .then(({ data }) => {
        setReminderList(data);
        setShowLoader(false);
      })
      .catch((error) => error);
  }
  useEffect(() => {
    if (open) {
      setShowLoader(true);
      getReminderDetails();
    }
  }, [open]);

  const columns: GridColDef[] = [
    {
      field: "notificationSendAt",
      headerName: "Date Time",
      width: 180,
      renderCell: (params) => (
        <>{moment(params.value).format("MMM DD, YYYY h:mm a")}</>
      ),
    },
    { field: "serviceTypeValue", headerName: "Source Type", width: 180 },
    {
      field: "remainderNotificationType",
      headerName: "Notification Type",
      width: 150,
    },
    { field: "notificationSentTo", headerName: "Send To", width: 320 },
    {
      field: "eventStatusMessage",
      headerName: "Delivery Status",
      width: 150,
      renderCell: (params) => {
        let backgroundColor = "";
        if (params.value === "Processing") {
          backgroundColor = "#1b98ef";
        } else if (params.value === "Pending delivery") {
          backgroundColor = "#ff9800";
        } else if (params.value === "Delivered") {
          backgroundColor = "#10ce58";
        }

        return (
          <div
            style={{
              backgroundColor: backgroundColor,
              padding: "4px",
              width: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none",
            }}
          >
            {params.value}
          </div>
        );
      },
    },
  ];

  const getRowHeight = (): number => 50;

  return (
    <Modal onClose={onClose} open={open} disableBackdropClick>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          bgcolor: "transparent",
          overflowX: "auto",
          backgroundColor: "white",
          borderRadius: "20px",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding={2}
        >
          <Typography variant="h6">Reminder Notification Details</Typography>
          <IconButton aria-label="close" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <div
          style={{
            height: 360,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {showLoader ? (
            <div>
              <Typography variant="h6" style={{ marginTop: "-47%" }}>
                Loading ...
              </Typography>
              <CircularProgress
                color="secondary"
                style={{ marginLeft: "15%", marginTop: "10%" }}
              />
            </div>
          ) : (
            <Box sx={{ overflow: "auto", width: "100%", height: "100%" }}>
              <DataGrid
                rows={reminderList}
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
      </Box>
    </Modal>
  );
}

export default ReminderTable;
