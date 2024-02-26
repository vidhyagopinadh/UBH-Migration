import React, { useState } from "react";
import clsx from "clsx";

import { Card, CardContent, Grid, List, Typography } from "@material-ui/core";
import SuccessSnackbar from "./SuccessSnackbar";
import Replies from "../../../../components/repliesComponent/replies";
import {
  Datagrid,
  FunctionField,
  ReferenceField,
  ReferenceManyField,
  TextField,
  useRecordContext,
} from "react-admin";
import moment from "moment";
import type { RecordInterface } from "../../../../types";
import { styled } from "@mui/material/styles";

// const useStyles = makeStyles(() => ({
//   root: {},
//   table: {
//     padding: 0,
//   },
//   "& .RaDatagrid-headerCell-401935": {
//     display: "none",
//   },
// }));
const PREFIX = "Activities";
const classes = {
  root: `${PREFIX}-root`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {},
  [`&.${classes.table}`]: {
    padding: 0,
  },
  "& .RaDatagrid-headerCell-401935": {
    display: "none",
  },
}));
function Activities(props): JSX.Element {
  // const classes = useStyles();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleSnackbarClose = (): void => {
    setOpenSnackbar(false);
  };

  const FullNameField = ({
    record,
  }: {
    record: RecordInterface;
  }): JSX.Element => (
    <span>
      {record.firstName} {record.middleName ? record.middleName : ""}{" "}
      {record.lastName}
    </span>
  );
  FullNameField.defaultProps = { label: "Name" };

  return (
    <Grid className={clsx(classes.root)} container spacing={3}>
      <Grid item lg={8} xl={8} xs={12}>
        <Card className={classes.root}>
          <CardContent>
            <Grid>
              <Grid item>
                <Typography variant="h6" style={{ marginBottom: 15 }}>
                  <b>Activity</b>
                </Typography>
              </Grid>
            </Grid>
            <List>
              <Datagrid className={classes.table}>
                <ReferenceManyField
                  label=""
                  reference="requestLogMasters"
                  filter={{ requestId: props.ids[0] }}
                  target={"requestId"}
                  sort={{ field: "createdAt", order: "DESC" }}
                >
                  <Datagrid>
                    <TextField source="content" label="Action" />
                    <ReferenceField
                      label="Activity By"
                      source="partyId"
                      reference="personDemographicsDetailsV2"
                    >
                      <FullNameField record={useRecordContext()} />
                    </ReferenceField>
                    <TextField source="remarks" label="Remarks" />
                    <FunctionField
                      label="Created At"
                      render={(record) => (
                        <span>
                          {moment(record.createdAt).format(
                            "DD MMM YYYY hh:mm a"
                          )}
                        </span>
                      )}
                    />
                  </Datagrid>
                </ReferenceManyField>
              </Datagrid>
            </List>
          </CardContent>
        </Card>
        <SuccessSnackbar onClose={handleSnackbarClose} open={openSnackbar} />
      </Grid>
      <Grid item lg={8} xl={8} xs={12}>
        <Replies {...props} />
        <SuccessSnackbar onClose={handleSnackbarClose} open={openSnackbar} />
      </Grid>
      <Grid item lg={6} xl={6} xs={12}></Grid>
    </Grid>
  );
}

Activities.propTypes = {};

export default Activities;
