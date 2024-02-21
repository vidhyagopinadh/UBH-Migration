/* eslint-disable linebreak-style */
import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { makeStyles } from "@material-ui/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import { tommddyyyy } from "./../../../../utils/dateFormator";
import { SignatureBox } from "../../../../components/signature";
import createFileUploadQuery from "../../../../queries/createFileUpload/createFileUploadQuery";
import updateRequestFiledetail from "../../../../queries/updateRequestFiledetail/updateRequestFiledetail";
import type {
  FileUploadInput,
  UpdateRequestFiledetailV1Input,
} from "../../../../__generated__/typescript-operations_all";
import { useMutation } from "@apollo/react-hooks";
import { blobToFile } from "./../../../../utils/images/blobToFile";
import b64toBlob from "./../../../../utils/images/b64toBlob";
//import useTraces from "../../../../hooks/useTraces";
import type { AppState } from "../../../../types";
import { useSelector } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import { CO_ROLE_PATIENT } from "../../../../utils/roles";
import { useDataProvider, useNotify, useTranslate } from "react-admin";
import { useHistory } from "react-router";
import ProviderView from "../../../../components/providerView";
import { compareObjects } from "../../../../utils/compareObjects";
import { perPageList } from "../../../../utils/pageConstants";
import { styled } from '@mui/material/styles';

// const useStyles = makeStyles(() => ({
//   root: {
//     backgroundColor: "#FFFFFF",
//     marginBottom: "15px",
//   },
//   h6_title: {
//     width: "55%",
//     float: "left",
//     fontWeight: 600,
//   },
//   subtitle: {
//     width: "40%",
//     float: "left",
//     marginLeft: "5%",
//   },
//   notes: {
//     width: "100%",
//     textAlign: "justify",
//     fontWeight: 400,
//     whiteSpace: "pre-line",
//   },
//   notesTitle: {
//     width: "100%",
//     fontWeight: 600,
//   },
//   listitemStyle: {
//     display: "inline-block !important",
//     borderBottom: "1px solid #eaeaea !important",
//   },
//   listitemStyle2: {
//     display: "inline-block !important",
//     borderBottom: "unset !important",
//   },
// }));


const PREFIX = 'OverviewBrief';
const classes = {
  root: `${PREFIX}-root`,
  h6_title: `${PREFIX}-h6_title`,
  subtitle: `${PREFIX}-subtitle`,
  helperText: `${PREFIX}-helperText`,
  notes: `${PREFIX}-notes`,
  notesTitle: `${PREFIX}-notesTitle`,
  listitemStyle: `${PREFIX}-listitemStyle`,
  listitemStyle2: `${PREFIX}-listitemStyle2`,
}

const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    backgroundColor: "#FFFFFF",
    marginBottom: "15px",
  },
  [`& .${classes.h6_title}`]: {
    width: "55%",
    float: "left",
    fontWeight: 600,
  },
  [`& .${classes.subtitle}`]: {
    width: "40%",
    float: "left",
    marginLeft: "5%",
  },
  [`& .${classes.helperText}`]: {
    textAlign: "right",
    marginRight: 0,
  },
  [`& .${classes.notes}`]: {
    width: "100%",
    textAlign: "justify",
    fontWeight: 400,
    whiteSpace: "pre-line",
  },
  [`& .${classes.notesTitle}`]: {
    width: "100%",
    fontWeight: 600,
  },
  [`& .${classes.listitemStyle}`]: {
    display: "inline-block !important",
    borderBottom: "1px solid #eaeaea !important",
  },
  [`& .${classes.listitemStyle2}`]: {
    display: "inline-block !important",
    borderBottom: "unset !important",
  },
  
}))

function Brief({ request, onSuccess, ...rest }): JSX.Element {
  const StatusToIgnore = "status";
  const SourceToIgnore = "sourceOfInvitation";
  //const classes = useStyles();
  const notify = useNotify();
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const history = useHistory();
  const userInfo = useSelector((state: AppState) => state.userInfoReducer);
  const { getTrace } = useTraces();
  const [submittedInstitution, setSubmittedInstitution] = useState([]);
  const [approvedInstitution, setApprovedInstitution] = useState([]);
  const [sameInstitutionData, setSameInstitutionData] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState({
    status: false,
    message: "",
  });
  React.useEffect(() => {
    function getNewInstitutionDetails(): void {
      dataProvider
        .getList("communicationRequestMasterV1", {
          pagination: { page: 1, perPage: perPageList },
          sort: { field: "id", order: "ASC" },
          filter: { id: request.communicationRequestId },
        })
        .then(({ data }) => {
          setSubmittedInstitution(
            JSON.parse(data[0].communicationMetaValue).metaData,
          );
          setApprovedInstitution(
            data[0].approvedMetaValue
              ? JSON.parse(data[0].approvedMetaValue).metaData
              : null,
          );

          if (data[0].approvedMetaValue) {
            const isInstitutionEqual = compareObjects(
              submittedInstitution,
              approvedInstitution,
              StatusToIgnore,
              SourceToIgnore,
            );
            setSameInstitutionData(isInstitutionEqual);
          }
        })
        .catch(() => {
          //
        });
    }
    if (request.communicationRequestId) {
      getNewInstitutionDetails();
    }
  }, [sameInstitutionData]);
  const getSign = (val): void => {
    setSignature(val);
  };

  const onSubmit = (): void => {
    if (signature) {
      const block = encodeURI(signature).split(";");
      const contentType = block[0].split(":")[1];
      const realData = block[1].split(",")[1];
      const blob = b64toBlob(realData, contentType);
      setError({
        status: false,
        message: "",
      });
      const fileFromBlob = blobToFile(blob, "feedback.png");
      const fileUpload: FileUploadInput = {
        fileName: fileFromBlob,
        fileType: "upload_file_signature",
      };
      subscribeFileUploadMutation({
        variables: { input: { fileUpload: fileUpload } },
      }).then((res) => {
        if (res.data) {
          getTrace(
            "Upload signature in Patient Request Form",
            "ev-113",
            userInfo.email,
          );
          updateRequest(res.data?.createFileUpload.fileUpload.id);
        }
      });
    } else {
      setError({
        status: true,
        message: translate("auth.errors.signError"),
      });
    }
  };

  const [subscribeFileUploadMutation] = useMutation(createFileUploadQuery, {});
  const [subscribeUpdateMutation] = useMutation(updateRequestFiledetail, {});
  const updateRequest = (signatureId: string): void => {
    const updateRequestFiledetailInput: UpdateRequestFiledetailV1Input = {
      requestIid: request.id,
      signatureId: signatureId,
    };
    subscribeUpdateMutation({
      variables: { input: updateRequestFiledetailInput },
    }).then((res) => {
      if (res.data) {
        onSuccess(true);
        if (secureLocalStorage.getItem("role") === CO_ROLE_PATIENT) {
          notify(translate(`auth.messages.successfully_signed`), {
            type: "success",
          });
          if (request.requester === userInfo.id) {
            history.push("/myRequests/" + request.trackId + "/overview");
          } else {
            history.push("/requestsOnBehalf/" + request.trackId + "/overview");
          }
        }
      }
    });
  };
  const listClass = classNames(classes.listitemStyle);
  const listClass2 = classNames(classes.listitemStyle2);
  return (
    <StyledDiv>
    <Card {...rest} className={classes.root}>
      <CardContent style={{ wordBreak: "break-word" }}>
        {Object.entries(request).length > 0 && (
          <>
            <Typography
              variant="subtitle1"
              style={{
                width: "98%",
                padding: "8px 9px",
                color: "rgb(135, 135, 135)",
                border: "1px solid #718cc7",
                borderRadius: "5px",
                background: "aliceblue",
                fontWeight: 600,
              }}
            >
              {request.categoryType === "request"
                ? "Medical Record Requested By: "
                : request.categoryType === "addendum"
                ? "Correction/Amendment Requested By: "
                : "Billing/Insurance Question Requested By: "}
              <b
                style={{
                  color: "#718cc7",
                }}
              >
                {` ${request.createdfname} ${request.createdlastname}`}
              </b>
            </Typography>
          </>
        )}
        <List>
          {request.categoryType !== "addendum" && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                Request Type: &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && (
                  <>
                    {JSON.parse(request.requestType).other
                      ? JSON.parse(request.requestType).other_value
                      : JSON.parse(request.requestType).value}
                  </>
                )}
              </Typography>
            </ListItem>
          )}
          {request.categoryType !== "addendum" && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                Records requested from: &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && (
                  <>
                    {tommddyyyy(request.recordsRequestedFrom)}{" "}
                    &nbsp;&nbsp;to&nbsp;&nbsp;{" "}
                    {tommddyyyy(request.recordsRequestedTo)}
                  </>
                )}
              </Typography>
            </ListItem>
          )}
          {request.categoryType !== "addendum" && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                How does this impact your care or access to information? &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && (
                  <>{request.issueImpactMasterValue}</>
                )}
              </Typography>
            </ListItem>
          )}
          {request.communicationRequestId && (
            <ProviderView
              commRequestId={null}
              approvedInstitution={approvedInstitution}
              sameInstitutionData={sameInstitutionData}
              submittedInstitution={submittedInstitution}
            />
          )}
          {!request.communicationRequestId && (
            <>
              {request.categoryType !== "addendum" && (
                <ListItem className={listClass} disableGutters>
                  <Typography variant="subtitle1" className={classes.h6_title}>
                    Nature of source: &nbsp;
                  </Typography>
                  <Typography variant="subtitle2" className={classes.subtitle}>
                    {Object.entries(request).length > 0 && (
                      <>{request.sourceNature}</>
                    )}
                  </Typography>
                </ListItem>
              )}

              <ListItem className={listClass} disableGutters>
                <Typography variant="subtitle1" className={classes.h6_title}>
                  Source Institution: &nbsp;
                </Typography>
                <Typography variant="subtitle2" className={classes.subtitle}>
                  {Object.entries(request).length > 0 && (
                    <>{request.sourceinstitutionname}</>
                  )}
                </Typography>
              </ListItem>
              <ListItem className={listClass} disableGutters>
                <Typography variant="subtitle1" className={classes.h6_title}>
                  Department: &nbsp;
                </Typography>
                <Typography variant="subtitle2" className={classes.subtitle}>
                  {Object.entries(request).length > 0 && (
                    <>{request.departmentname}</>
                  )}
                </Typography>
              </ListItem>
              {request.categoryType !== "addendum" && (
                <ListItem className={listClass} disableGutters>
                  <Typography variant="subtitle1" className={classes.h6_title}>
                    Assign To: &nbsp;
                  </Typography>
                  <Typography variant="subtitle2" className={classes.subtitle}>
                    {Object.entries(request).length > 0 &&
                      (request.assignedfname ? (
                        <>
                          {request.assignedfname} {request.assignedmname}{" "}
                          {request.assignedlastname}
                        </>
                      ) : (
                        "Not Assigned"
                      ))}
                  </Typography>
                </ListItem>
              )}
            </>
          )}
          {request.categoryType === "addendum" && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                Physician Name: &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && <>{request.provider}</>}
              </Typography>
            </ListItem>
          )}
          {request.categoryType === "addendum" && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                Date of service: &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && (
                  <>{request.servicedDate}</>
                )}
              </Typography>
            </ListItem>
          )}
          {request.categoryType === "addendum" && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                Change to be made: &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && (
                  <>{request.changeRequest}</>
                )}
              </Typography>
            </ListItem>
          )}
          {request.categoryType === "addendum" && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                Reason for request change: &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && <>{request.reason}</>}
              </Typography>
            </ListItem>
          )}

          {request.categoryType !== "addendum" && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                Requested support from the corresponding facility: &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && (
                  <>{request.is_requested_support ? "Yes" : "No"}</>
                )}
              </Typography>
            </ListItem>
          )}
          {request.categoryType !== "addendum" && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                Submitted a signed medical records request: &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && (
                  <>{request.hasSignedRequest ? "Yes" : "No"}</>
                )}
              </Typography>
            </ListItem>
          )}
          {request.categoryType !== "addendum" && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                {" "}
                Like to be contacted personally regarding this request? &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && (
                  <>
                    {request.contactPersonally ? "Yes:" : "No"}
                    {request.contactByMail ? "  By Mail  " : ""}
                    {request.contactByPhone ? " By Call  " : ""}
                    {request.contactBySms ? " By SMS  " : ""}
                  </>
                )}
              </Typography>
            </ListItem>
          )}
          {request.categoryType !== "addendum" && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                Email or send secure message to the email address: &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && (
                  <>{request.electronicDetails}</>
                )}
              </Typography>
            </ListItem>
          )}
          {request.categoryType === "request" && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                Do you have a signed HIPAA authorization form? &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && (
                  <>{request.hipaaAuthorizationFile ? "Yes" : "No"}</>
                )}
              </Typography>
            </ListItem>
          )}
          {request.categoryType === "request" && request.additionalNotes && (
            <ListItem className={listClass} disableGutters>
              <Typography variant="subtitle1" className={classes.notesTitle}>
                Additional Notes: &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.notes}>
                {request.additionalNotes}
              </Typography>
            </ListItem>
          )}
          {request.categoryType !== "addendum" && (
            <ListItem className={listClass2} disableGutters>
              <Typography variant="subtitle1" className={classes.h6_title}>
                Do these records contain sensitive information such as substance
                use disorder or mental health condition? &nbsp;
              </Typography>
              <Typography variant="subtitle2" className={classes.subtitle}>
                {Object.entries(request).length > 0 && (
                  <>{request.disorder_request_auth ? "Yes" : "No"}</>
                )}
              </Typography>
            </ListItem>
          )}
          <ListItem className={listClass2} disableGutters></ListItem>
        </List>

        <Grid item md={12} xs={12}>
          <Grid item md={8} style={{ marginTop: "35px" }} xs={12}>
            <SignatureBox getSign={getSign} />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions>
        <Button onClick={() => onSubmit()} color="primary" variant="contained">
          Submit Form
        </Button>
        {error.status && (
          <Typography style={{ color: "red", textTransform: "capitalize" }}>
            {error.message}
          </Typography>
        )}
      </CardActions>
    </Card>
    </StyledDiv>
  );
}

Brief.propTypes = {
  request: PropTypes.object.isRequired,
  className: PropTypes.string,
  onSuccess: PropTypes.func,
};

export default Brief;
