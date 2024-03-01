import * as React from "react";
import { useState, useEffect } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, IconButton, makeStyles, Radio } from "@material-ui/core";
import { useDataProvider } from "react-admin";
import { perPageMax } from "../utils/pageConstants";
import type { QueryOptions } from "../types";
import moment from "moment";
import { Typography } from "@mui/material";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
      {
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
  noOutline: {
    outline: "none",
  },
  noSelection: {
    "&.Mui-selected": {
      backgroundColor: "transparent",
    },
  },
  customCell: {
    outline: "none",
  },
  selectedRow: {
    "& .MuiDataGrid-cell": {
      outline: "none !important",
      boxShadow: "none !important",
    },
  },
  table: {
    padding: 0,
  },
  info: {
    cursor: "auto",
    width: "20px",
    height: "15px",
    color: "grey",
  },
  helperText: {
    textAlign: "right",
  },
  tableBox: { height: 370, width: "100%" },
  searchLabel: { fontSize: 16, fontWeight: 500 },
  subLabel: { marginTop: "10px", marginBottom: "10px" },
  button: { textTransform: "none" },
  "& .MuiDataGrid-cell:focus": {
    outline: "0px solid white",
  },
}));
const DependentTable = ({ getSelectedDependent }): JSX.Element => {
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const [dependentData, setDependentData] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const [dependentAllData, setDependentAllData] = useState([]);
  const CustomMoveIcon = (props: { colDef }): JSX.Element => {
    return <div>{props.colDef.headerName}</div>;
  };
  const [selectedRow, setSelectedRow] = useState(null);
  useEffect(() => {
    const queryOption: QueryOptions = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "", order: "ASC" },
      filter: {},
    };
    function getDependentData(): void {
      dataProvider
        .getList("dependentList", queryOption)
        .then(({ data }: { data: any[] }) => {
          setDependentAllData(data);
          if (data.length > 0) {
            setNoResult(false);
            const rows = data
              .filter((value) => value)
              .map((value) => ({
                id: value.id,
                name: value.firstName + " " + value.lastName,
                birthDate: moment(value.birthDate).format("MM/DD/YYYY"),
                relation: value.relatedPersonRelationshipValue,
                address: value.address1
                  ? value.address1 +
                    (value.address2 ? ", " + value.address2 : ", ") +
                    value.city +
                    "\n " +
                    value.state +
                    ", " +
                    value.country +
                    "-" +
                    value.zip
                  : "",
              }));
            setDependentData(rows);
          } else {
            setNoResult(true);
          }
        });
    }
    getDependentData();
  }, []);
  const handleRadioClick = (row) => {
    setSelectedRow(row.id);
    getSelectedDependent(dependentAllData.find((item) => item.id === row.id));
  };
  const columns: GridColDef[] = [
    {
      field: "radiobutton",
      headerName: "",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Radio
          checked={params.row.id === selectedRow}
          onClick={() => handleRadioClick(params.row)}
        />
      ),
    },
    { field: "id", headerName: "id", width: 200, hideable: false },
    {
      field: "name",
      headerName: "Name",
      width: 250,
      editable: false,
    },
    {
      field: "birthDate",
      headerName: "Date of Birth",
      width: 200,
      editable: false,
    },
    {
      field: "relation",
      headerName: "Relation",
      width: 200,
      editable: false,
    },
    {
      field: "address",
      headerName: "Address",
      width: 400,
      editable: false,
    },
  ];

  return (
    <>
      {noResult ? (
        <div
          style={{
            backgroundColor: "lightblue",
            padding: "25px",
            position: "relative",
            marginTop: "25px",
            borderRadius: "5px",
          }}
        >
          {" "}
          <IconButton
            onClick={() => {
              setNoResult(false);
            }}
            style={{
              position: "absolute",
              top: "0px",
              right: "0px",
              color: "black",
              padding: "10px",
            }}
          >
            <Close style={{ fontSize: "18px" }} />
          </IconButton>
          <Typography
            variant="h6"
            style={{ color: "#4183c4", fontSize: "14px" }}
          >
            No dependents added yet.
          </Typography>
        </div>
      ) : (
        <Grid container spacing={2}>
          <div
            style={{
              height: 360,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "auto",
            }}
          >
            <DataGrid
              className={classes.root}
              rows={dependentData}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              checkboxSelection={false}
              disableRowSelectionOnClick
              columnVisibilityModel={{
                id: false,
              }}
              slots={{
                columnSelectorIcon: CustomMoveIcon,
              }}
              disableColumnSelector={true}
              disableColumnMenu
            />
          </div>
        </Grid>
      )}
    </>
  );
};

export default DependentTable;
