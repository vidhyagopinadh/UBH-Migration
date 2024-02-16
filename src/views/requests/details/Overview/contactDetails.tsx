import * as React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  List,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  useDataProvider,
  Datagrid,
  TextField,
  ReferenceManyField,
} from "react-admin";
import { perPageMax } from "../../../../utils/pageConstants";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.light,
  },
  cardBottom: {
    marginBottom: "15px",
    backgroundColor: theme.palette.primary.light,
  },
  listItems: {
    "&.MuiListItem-gutters": {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  table: {
    padding: 0,
  },
}));

export function Contact({ request }): JSX.Element {
  const dataProvider = useDataProvider();
  const [contactList, setContactList] = useState(false);
  const [doctorList, setDoctorList] = useState(false);

  useEffect(() => {
    let mounted = true;
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        requestId: request.id,
      },
    };
    const addendumQueryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        requestId: request.id,
      },
    };

    function getContact(): void {
      dataProvider
        .getList("requestContactDetails", queryOption)
        .then(({ data }) => {
          if (data.length !== 0) {
            setContactList(true);
          }
        });
    }
    function getDoctor(): void {
      dataProvider
        .getList("addendumDoctorsDetails", addendumQueryOption)
        .then(({ data }) => {
          if (data.length !== 0) {
            setDoctorList(true);
          }
        });
    }

    if (mounted) {
      if (request.isRequestedSupport) {
        getContact();
      }
      if (request.categoryType === "addendum") {
        getDoctor();
      }
    }

    return () => {
      mounted = false;
    };
  }, [request]);

  const classes = useStyles();

  return (
    <div>
      {request?.categoryType === "request" && contactList === true && (
        <Card className={classes.cardBottom}>
          <CardContent>
            <Typography component="h6" variant="subtitle1">
              <b>CONTACT DETAILS</b>
            </Typography>

            <Divider />
            <List>
              <ReferenceManyField
                reference="requestContactDetails"
                filter={{ requestId: request.id }}
                target={"requestId"}
              >
                <Datagrid>
                  <TextField source="contactPersonName" label="Name" />
                  <TextField source="contactPersonEmail" label="Email" />
                  <TextField source="contactPersonPhone" label="Phone" />
                </Datagrid>
              </ReferenceManyField>
            </List>
          </CardContent>
        </Card>
      )}
      {request.categoryType === "addendum" && doctorList === true && (
        <Card className={classes.cardBottom}>
          <CardContent>
            <Typography component="h6" variant="subtitle1">
              <b>DOCTOR DETAILS</b>
            </Typography>
            <Divider />
            <List>
              <ReferenceManyField
                reference="addendumDoctorsDetails"
                filter={{ requestId: request.id }}
                target={"addendumRequestId"}
              >
                <Datagrid>
                  <TextField source="doctorName" label="Name" />
                  <TextField source="institution" label="Institution" />
                  <TextField source="address" label="Address" />
                  <TextField source="phoneNumber" label="Phone" />
                </Datagrid>
              </ReferenceManyField>
            </List>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
