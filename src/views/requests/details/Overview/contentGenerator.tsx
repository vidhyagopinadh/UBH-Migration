import { List, ListItem, makeStyles, Typography } from "@material-ui/core";
import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { tommddyyyy } from "../../../../utils/dateFormator";
import { perPageList } from "../../../../utils/pageConstants";
import { useDataProvider } from "react-admin";
import type { AppState } from "../../../../types";
import { useSelector } from "react-redux";
import { compareObjects } from "../../../../utils/compareObjects";
import ProviderView from "../../../../components/providerView";
// const useStyles = makeStyles((theme) => ({
//   root: {
//     backgroundColor: theme.palette.primary.light,
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
//   subtitle1: {
//     width: "100%",
//     float: "left",
//     marginLeft: "5%",
//   },
//   listitemStyle: {
//     display: "inline-block !important",
//     borderBottom: "1px solid #eaeaea !important",
//   },
//   tab: {
//     textTransform: "none",
//     fontSize: "14px",
//     fontWeight: 500,
//   },
//   icon: {
//     cursor: "auto",
//     marginTop: "0px",
//     width: "23px",
//     height: "20px",
//   },
// }));

const PREFIX = "MyCard";
const classes = {
  root: `${PREFIX}-root`,
  h6_title: `${PREFIX}-h6_title`,
  subtitle: `${PREFIX}-subtitle`,
  subtitle1: `${PREFIX}-subtitle1`,
  listitemStyle: `${PREFIX}-listitemStyle`,
  tab: `${PREFIX}-tab`,
  icon: `${PREFIX}-icon`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    backgroundColor: theme.palette.primary.light,
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
  [`& .${classes.subtitle1}`]: {
    width: "100%",
    float: "left",
    marginLeft: "5%",
  },

  [`& .${classes.listitemStyle}`]: {
    display: "inline-block !important",
    borderBottom: "1px solid #eaeaea !important",
  },
  [`& .${classes.tab}`]: {
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
  },
  [`& .${classes.icon}`]: {
    cursor: "auto",
    marginTop: "0px",
    width: "23px",
    height: "20px",
  },
}));
const ContentGenerator = ({ request }): JSX.Element => {
  const StatusToIgnore = "status";
  const SourceToIgnore = "sourceOfInvitation";
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const listClass = classNames(classes.listitemStyle);
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer
  );
  const [submittedInstitution, setSubmittedInstitution] = useState([]);
  const [approvedInstitution, setApprovedInstitution] = useState([]);
  const [sameInstitutionData, setSameInstitutionData] = useState(false);
  const adRep = request.isRequestedSupport
    ? {
        "Representative Name": request.representName,
        "Representative Email": request.representMail,
      }
    : {};
  const requestContent = {
    billing: {
      "Request Type": request.requestCategoryName,
      "Description of Billing Question Request": JSON.parse(request.requestType)
        ?.other
        ? JSON.parse(request.requestType)?.other_value
        : JSON.parse(request.requestType)?.value,
      PAN: request.pan,
      "Organization Group": request.organizationgroupname,
      Organization: request.sourceinstitutionname,
      "Assign To": request.assignedfname
        ? `${request.assignedfname} ${request.assignedmname} ${request.assignedlastname}`
        : "Not Assigned",
      "Contact By": request.channelName,
      "Way to contact regarding this request": request.contactData,
    },
    medicalRequestTypeSection: {
      "Request Type": JSON.parse(request.requestType)?.other
        ? JSON.parse(request.requestType)?.other_value
        : JSON.parse(request.requestType)?.value,
      "Records requested from": `${tommddyyyy(
        request.recordsRequestedFrom
      )}    to    ${tommddyyyy(request.recordsRequestedTo)}`,
      "How does this impact your care or access to information?":
        request.issueImpactMasterValue,
    },
    medicalRequestInstitutionSection: {
      "Nature of source": request.sourceNature ? request.sourceNature : "",
      "Source Institution": request.sourceinstitutionname
        ? request.sourceinstitutionname
        : "",
      Department: request.departmentname ? request.departmentname : "",
      "Assign To": request.assignedfname
        ? `${request.assignedfname} ${request.assignedmname} ${request.assignedlastname}`
        : "Not Assigned",
    },
    medicalRequestSupportSection: {
      "Requested support from the corresponding facility":
        request.isRequestedSupport ? "Yes" : "No",
      "Submitted a signed medical records request": request.hasSignedRequest
        ? "Yes"
        : "No",
      "Like to be contacted personally regarding this request?": `${
        request.contactPersonallyValue ? "Yes" : "No"
      }
        ${request.contactByMailValue ? "  By Mail  " : ""}
        ${request.contactByPhoneValue ? "  By Call  " : ""}
        ${request.contactBySmsValue ? "  By SMS  " : ""}`,
      "Email or send secure message to the email address":
        request.electronicDetails,
      "Please indicate whether you would like to inspect or receive a copy of your records":
        request.isInspect
          ? "Inspect"
          : request.isObtainCopy
          ? "Obtain Copy "
          : "No",
    },

    addendum: {
      "Physician Name": request.provider,
      "Source Institution": request.sourceinstitutionname,
      Department: request.departmentname,
      "Date of service": tommddyyyy(request.dateOfService),
      "Change to be made": request.changeRequest,
      "Reason for request change": request.reason,
      "Would you like the response to be sent to a representative email address?":
        request.isRequestedSupport ? "Yes" : "No",

      ...adRep,
    },
  };
  useEffect(() => {
    function getNewInstitutionDetails(): void {
      dataProvider
        .getList("communicationRequestMasterV1", {
          pagination: { page: 1, perPage: perPageList },
          sort: { field: "id", order: "ASC" },
          filter: { id: request.communicationRequestId },
        })
        .then(({ data }) => {
          setSubmittedInstitution(
            JSON.parse(data[0].communicationMetaValue).metaData
          );
          setApprovedInstitution(
            data[0].approvedMetaValue
              ? JSON.parse(data[0].approvedMetaValue).metaData
              : null
          );

          if (data[0].approvedMetaValue) {
            const isInstitutionEqual = compareObjects(
              submittedInstitution,
              approvedInstitution,
              StatusToIgnore,
              SourceToIgnore
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
  }, [userInfoReducer, sameInstitutionData]);
  return (
    <List>
      {request.categoryType === "request" ? (
        <>
          {Object.entries(requestContent["medicalRequestTypeSection"]).map(
            (eachContent) => (
              <ListItem className={listClass} disableGutters>
                <Typography variant="subtitle1" className={classes.h6_title}>
                  {`${eachContent[0]}`}: &nbsp;
                </Typography>
                <Typography variant="subtitle2" className={classes.subtitle}>
                  {`${eachContent[1]}`}
                </Typography>
              </ListItem>
            )
          )}
          {!request.communicationRequestId && (
            <>
              {Object.entries(
                requestContent["medicalRequestInstitutionSection"]
              ).map(
                (eachContent) =>
                  eachContent[1] !== "" && (
                    <ListItem className={listClass} disableGutters>
                      <Typography
                        variant="subtitle1"
                        className={classes.h6_title}
                      >
                        {`${eachContent[0]}`}: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        className={classes.subtitle}
                      >
                        {`${eachContent[1]}`}
                      </Typography>
                    </ListItem>
                  )
              )}
            </>
          )}
          {request.communicationRequestId && (
            <ProviderView
              commRequestId={request.communicationRequestId}
              approvedInstitution={approvedInstitution}
              sameInstitutionData={sameInstitutionData}
              submittedInstitution={submittedInstitution}
            />
          )}
          {Object.entries(requestContent["medicalRequestSupportSection"]).map(
            (eachContent) => (
              <ListItem className={listClass} disableGutters>
                <Typography variant="subtitle1" className={classes.h6_title}>
                  {`${eachContent[0]}`}: &nbsp;
                </Typography>
                <Typography variant="subtitle2" className={classes.subtitle}>
                  {`${eachContent[1]}`}
                </Typography>
              </ListItem>
            )
          )}
          {request.isObtainCopy && (
            <>
              <ListItem className={listClass} disableGutters>
                <Typography variant="subtitle1" className={classes.h6_title}>
                  Requested copy will be :
                </Typography>
                <Typography variant="subtitle2" className={classes.subtitle}>
                  {request.obtainCopyMethodId === 1
                    ? "Collected in Person"
                    : request.obtainCopyMethodId === 2
                    ? "Send through Postal Service"
                    : "Send through Expedited Mailing (i.e., FedEx)"}
                </Typography>
              </ListItem>
              {request.obtainCopyMethodId === 2 && request.postalAddress && (
                <ListItem className={listClass} disableGutters>
                  <Typography variant="subtitle1" className={classes.h6_title}>
                    Address of Requester:
                  </Typography>
                  <Typography variant="subtitle2" className={classes.subtitle}>
                    {request.postalAddress}
                  </Typography>
                </ListItem>
              )}
              {request.obtainCopyMethodId === 2 && request.physicianAddress && (
                <ListItem className={listClass} disableGutters>
                  <Typography variant="subtitle1" className={classes.h6_title}>
                    Address of Physician/Practitioner:
                  </Typography>
                  <Typography variant="subtitle2" className={classes.subtitle}>
                    {request.physicianAddress}
                  </Typography>
                </ListItem>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {Object.entries(requestContent[request.categoryType]).map(
            (eachContent) => (
              <ListItem className={listClass} disableGutters>
                <Typography variant="subtitle1" className={classes.h6_title}>
                  {`${eachContent[0]}`}: &nbsp;
                </Typography>
                <Typography variant="subtitle2" className={classes.subtitle}>
                  {`${eachContent[1]}`}
                </Typography>
              </ListItem>
            )
          )}
        </>
      )}
    </List>
  );
};
export default ContentGenerator;
