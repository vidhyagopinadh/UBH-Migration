import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";
import {
  Typography,
  Grid,
  Divider,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  TextareaAutosize,
} from "@material-ui/core";
import type { Request } from "../../../../__generated__/typescript-operations_all";
import { SignatureBox } from "../../../../components/signature";
import type { AppState } from "../../../../types";
import { useSelector } from "react-redux";
import useDenial from "../../../../hooks/useDenial";

function DenialForm({
  request,
  idVal,
  deniedReasonList,
  onSubmit,
  onCancel,
  shareInternalDenial,
  notes,
  selectedReasons,
  isExceptionId,
  exceptionIds,
}): JSX.Element {
  const {
    useStyles,
    handleValidateOnBlur,
    getAssignedTo,
    setDeniedReasonLists,
    deniedReasonLists,
    reasonList,
    getInfBlockingDetails,
    infBlockingData,
    extraDetails,
    type,
    handleTypeChange,
    errorMsg,
    handleChange,
    reason,
    getSign,
    onSubmitTrigger,
  } = useDenial({
    request,
    idVal,
    onSubmit,
  });
  const classes = useStyles();
  const [requestDetail, setRequestDetail] = useState<Request>({});
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (request.assignToPersonId) {
        getAssignedTo();
      }
      if (Object.entries(request).length > 0) {
        setRequestDetail(request);
      }
      if (Object.entries(deniedReasonList).length > 0) {
        setDeniedReasonLists(deniedReasonList);
      }
    }
    return () => {
      mounted = false;
    };
  }, [request, deniedReasonList]);
  useEffect(() => {
    if (isExceptionId && exceptionIds.length !== 0) {
      getInfBlockingDetails();
    }
  }, [isExceptionId, exceptionIds]);
  return (
    <>
      <Grid className={clsx(classes.root)} container spacing={2}>
        <Grid item md={12} style={{ paddingTop: "16px" }} xs={12}>
          <Typography component="h2" gutterBottom variant="h5">
            REQUEST FOR ACCESS - NOTICE OF DENIAL LETTER
          </Typography>
          <Divider />
        </Grid>
        <Grid item lg={12} xl={12} xs={12}>
          <Typography variant="body1">
            <b>{moment().format("DD/MM/YYYY")}</b>
          </Typography>
        </Grid>
        <Grid item lg={12} xl={12} xs={12}>
          <Typography variant="body1">
            {Object.entries(requestDetail).length > 0 && (
              <>
                Dear{" "}
                <b>{requestDetail.firstName + " " + requestDetail.lastName}</b>{" "}
                :
              </>
            )}
          </Typography>
        </Grid>
        <Grid item lg={12} xl={12} xs={12}>
          <Typography variant="body1">
            We have received and reviewed your request for a copy of your health
            information record dated{" "}
            <b>
              {Object.entries(requestDetail).length > 0 && (
                <> {moment(requestDetail.createdat).format("DD/MM/YYYY")} </>
              )}
            </b>
            .<br />
            Unfortunately, we cannot honor all or part of your request because:
          </Typography>
        </Grid>
        <Grid item lg={12} xl={12} xs={12}>
          {Object.entries(deniedReasonLists).length > 0 && (
            <>
              {deniedReasonLists.map((option) =>
                selectedReasons.map((each, key) =>
                  each === option.id ? (
                    <>
                      <FormControlLabel
                        key={key}
                        name={option.code}
                        value={reasonList[option.code]}
                        control={
                          <Checkbox
                            color="primary"
                            checked={true}
                            disabled={true}
                          />
                        }
                        label={option.value}
                      />
                      <br />
                      <br />
                    </>
                  ) : (
                    ""
                  ),
                ),
              )}
            </>
          )}
        </Grid>
        <Grid item lg={12} xl={12} xs={12}>
          {Object.entries(exceptionIds).length > 0 && shareInternalDenial && (
            <>
              {infBlockingData.map((option) =>
                exceptionIds.map((each, key) =>
                  each === option.id ? (
                    <div style={{ width: "50%", float: "left" }} key={key}>
                      <FormControlLabel
                        name={each.code}
                        value={option.value}
                        control={
                          <Checkbox
                            color="primary"
                            checked={true}
                            disabled={true}
                          />
                        }
                        label={option.value}
                      />
                      <br />
                      <br />
                    </div>
                  ) : (
                    ""
                  ),
                ),
              )}
            </>
          )}
        </Grid>
        {shareInternalDenial && notes !== "" && (
          <Grid item md={12} xs={12}>
            <Typography
              variant="h5"
              style={{ fontSize: 14, fontWeight: 500 }}
              gutterBottom
            >
              Notes :
            </Typography>
            <FormControl fullWidth>
              <TextareaAutosize
                className={classes.notesArea}
                disabled
                name="notes"
                style={{ fontSize: "14px" }}
                value={notes}
                minRows={6}
              />
            </FormControl>
          </Grid>
        )}
        <Grid item lg={12} xl={12} xs={12}>
          <Typography variant="body1" style={{ textAlign: "justify" }}>
            If the above basis for denying you access to your health information
            is identified as &ldquo; &rdquo;(reviewable)&ldquo; &rdquo;, then
            you have the right to request review of the decision by a licensed
            health care professional who we designate and who did not
            participate in the original decision to deny access. You may request
            such a review by contacting{" "}
            {Object.entries(request).length > 0 && (
              <>
                <b>
                  {(request.assignedfname
                    ? request.assignedfname
                    : userInfoReducer.firstName) +
                    " " +
                    (request.assignedlastname
                      ? request.assignedlastname
                      : userInfoReducer.lastName)}
                </b>
              </>
            )}{" "}
            through email{" "}
            {Object.entries(extraDetails).length > 0 ? (
              <>
                <b>{extraDetails[0].electronicDetails}</b>{" "}
              </>
            ) : (
              <b>{userInfoReducer.email}</b>
            )}
            .
          </Typography>
        </Grid>
        <Grid item lg={12} xl={12} xs={12}>
          <Typography variant="body1" style={{ textAlign: "justify" }}>
            This denial applies to{" "}
            <RadioGroup
              name="type"
              value={type}
              onChange={handleTypeChange}
              style={{ display: "inline-block" }}
            >
              <FormControlLabel
                name="type"
                value="all"
                control={<Radio color="primary" defaultChecked={true} />}
                style={{ marginLeft: "auto" }}
                label="ALL"
                id="allRadio"
              />{" "}
              or{" "}
              <FormControlLabel
                name="type"
                value="part"
                style={{ marginLeft: "auto" }}
                control={<Radio color="primary" />}
                label="PART"
              />
            </RadioGroup>{" "}
            of the information you requested. If we are denying only part of
            your request, you will be given access to the remaining information
            after we have excluded the parts which are inaccessible for you.
          </Typography>
        </Grid>
        <Grid item lg={12} xl={12} xs={12}>
          <Typography variant="body1" style={{ textAlign: "justify" }}>
            If you believe your privacy rights have been violated, you may
            deliver a written complaint to{" "}
            {Object.entries(request).length > 0 && (
              <>
                <b>
                  {(request.assignedfname
                    ? request.assignedfname
                    : userInfoReducer.firstName) +
                    " " +
                    (request.assignedlastname
                      ? request.assignedlastname
                      : userInfoReducer.lastName)}
                </b>
              </>
            )}{" "}
            through email{" "}
            {Object.entries(extraDetails).length > 0 ? (
              <>
                <b>{extraDetails[0].electronicDetails}</b>{" "}
              </>
            ) : (
              <b>{userInfoReducer.email}</b>
            )}
            . You may also file a complaint with the secretary of Health and
            Human services. We respect your right to file a complaint with us or
            with the secretary of Health and Human services. If you choose to
            take this action, no one will retaliate or take action against you
            for filing a complaint.
          </Typography>
        </Grid>
        <Grid item lg={12} xl={12} xs={12}>
          <TextField
            fullWidth
            // margin="dense"
            name="reason"
            label="Remarks"
            onBlur={(e) => handleValidateOnBlur(e)}
            error={errorMsg ? true : false}
            helperText={errorMsg}
            onChange={handleChange}
            style={{ fontSize: "14px" }}
            required
            value={reason}
            variant="standard"
          />
        </Grid>
        <Grid item lg={12} xl={12} xs={12}>
          <Typography variant="body1">Sincerely,</Typography>
        </Grid>
        {request.categoryType === "addendum" && (
          <SignatureBox getSign={getSign} />
        )}
        <Grid item lg={12} xl={12} xs={12}>
          <Typography variant="body1">
            <b>{userInfoReducer.firstName + " " + userInfoReducer.lastName}</b>
            <br />
            <b style={{ fontSize: "13px", color: "#546e7a" }}>
              {userInfoReducer.email}
            </b>
          </Typography>
        </Grid>
        <Grid item lg={12} xl={12} xs={12}>
          <Button
            disabled={Object.entries(selectedReasons).length > 0 ? false : true}
            onClick={onSubmitTrigger}
            color="primary"
            variant="contained"
          >
            Deny Request
          </Button>
          <Button
            onClick={onCancel}
            style={{
              backgroundColor: "#93C572",
              color: "white",
              marginLeft: "10px",
            }}
            variant="contained"
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

DenialForm.propTypes = {
  deniedReasonList: PropTypes.object.isRequired,
  request: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  idVal: PropTypes.string,
  shareInternalDenial: PropTypes.bool,
  notes: PropTypes.string,
  selectedReasons: PropTypes.object.isRequired,
  isExceptionId: PropTypes.bool,
  exceptionIds: PropTypes.object.isRequired,
};

export default DenialForm;
