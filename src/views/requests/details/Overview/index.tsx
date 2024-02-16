import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import Brief from "./brief";
import Replies from "../../../../components/repliesComponent/replies";
import { Patient } from "./patient";
import { Contact } from "./contactDetails";
import { ObtainCopy } from "./obtainCopy";

function Overview(props): JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid item lg={8} xl={9} xs={12}>
        {Object.keys(props.data).length === 1 &&
          props.data[props.ids[0]] !== undefined && (
            <>
              <Brief path={props.basePath} request={props.data[props.ids[0]]} />
              <Contact request={props.data[props.ids[0]]} />
              <Replies {...props} />
            </>
          )}
      </Grid>

      <Grid item xl={3} lg={4} xs={12}>
        {Object.keys(props.data).length === 1 &&
          props.data[props.ids[0]] !== undefined && (
            <>
              <Patient request={props.data[props.ids[0]]} />
              <ObtainCopy request={props.data[props.ids[0]]} />
            </>
          )}
      </Grid>
    </Grid>
  );
}

Overview.propTypes = {
  className: PropTypes.string,
  request: PropTypes.object,
  replies: PropTypes.array,
  history: PropTypes.object.isRequired,
};

export default Overview;
