import React from "react";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import {
  Datagrid,
  ReferenceManyField,
  TextField,
  ReferenceField,
  // useRefresh,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import { PostTab } from "./postTab";
import { isCommentProviderIsDefaultComment } from "../../utils/comments";
import type { RecordInterface } from "../../types";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.light,
  },
  table: {
    padding: 0,
  },
}));

function Replies(props) {
  const classes = useStyles();
  const FullNameField = ({ record = {} as RecordInterface }) => (
    <span>
      {record.firstName}
      {record.middleName ? record.middleName : ""} {record.lastName}
    </span>
  );
  FullNameField.defaultProps = { label: "Name" };
  const TypeField = ({ source, record = {} }) => (
    <span>
      {record[source] === 2 ? <span>Reply</span> : <span>Internal Note</span>}
    </span>
  );
  TypeField.defaultProps = { label: "Type" };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid>
          <Grid item>
            <Typography variant="h5" style={{ marginBottom: 15 }}>
              <b>Replies</b>
            </Typography>
          </Grid>
        </Grid>
        {props.data[props.ids[0]] && (
          <PostTab
            requestId={props.ids[0]}
            type={props.data[props.ids[0]].categoryType}
            createdBy={
              props.data[props.ids[0]].createdfname.trim() +
              props.data[props.ids[0]].createdlastname.trim()
            }
            patient={
              props.data[props.ids[0]].firstName.trim() +
              (props.data[props.ids[0]].middleName !== null
                ? props.data[props.ids[0]].middleName.trim()
                : "") +
              props.data[props.ids[0]].lastName.trim()
            }
            source={
              props.data[props.ids[0]].sourceinstitutionname
                ? props.data[props.ids[0]].sourceinstitutionname.replace(
                    /"/g,
                    "",
                  )
                : ""
            }
          />
        )}
        {isCommentProviderIsDefaultComment ? (
          <Datagrid className={classes.table}>
            <ReferenceManyField
              label="Comments by"
              reference="requestResponses"
              filter={{ requestId: props.ids[0] }}
              target={"requestId"}
              sort={{ field: "requestType", order: "DESC" }}
            >
              <Datagrid>
                <ReferenceField
                  label="Replied By"
                  source="repliedby"
                  reference="personDemographicsDetailsV2"
                >
                  <FullNameField />
                </ReferenceField>
                <TextField source="response" label="Comments" />
                <TypeField source="requestType" label="Type" />
              </Datagrid>
            </ReferenceManyField>
          </Datagrid>
        ) : (
          ""
        )}
      </CardContent>
    </Card>
  );
}

Replies.propTypes = {
  className: PropTypes.string,
  replies: PropTypes.array,
  request: PropTypes.object,
  postId: PropTypes.number,
  history: PropTypes.object.isRequired,
};

export default Replies;
