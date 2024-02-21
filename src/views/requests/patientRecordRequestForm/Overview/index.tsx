import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import Brief from "./brief";
import { Patient } from "./patient";
import type { AppState } from "../../../../types";
// import useTraces from "../../../../hooks/useTraces";
import { useSelector } from "react-redux";

function Overview(props): JSX.Element {
  const { getTrace } = useTraces();
  const userInfo = useSelector((state: AppState) => state.userInfoReducer);
  const [requestDetails, setRequestDetails] = useState({});
  useEffect(() => {
    if (props.request) {
      setRequestDetails(props.request);
    }
  }, [props.request]);
  const patientForm = document.getElementById("patientForm");
  useEffect(() => {
    if (patientForm) {
      if (patientForm.hidden === false) {
        getTrace(
          "Patient Record Request Form Loaded",
          "ev-112",
          userInfo.email,
        );
      }
    }
  }, [patientForm]);
  return (
    <Grid container spacing={3} id="patientForm">
      {requestDetails && (
        <>
          <Grid item lg={8} xl={9} xs={12}>
            {Object.keys(requestDetails).length > 0 && (
              <Brief
                path={props.basePath}
                request={requestDetails}
                onSuccess={props.onSuccess()}
              />
            )}
          </Grid>
          <Grid item xl={3} lg={4} xs={12}>
            {Object.keys(requestDetails).length > 0 && (
              <Patient request={requestDetails} />
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
}

Overview.propTypes = {
  request: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default Overview;
