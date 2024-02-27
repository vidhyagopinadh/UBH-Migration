import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Typography,
  Grid,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  TextareaAutosize,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import * as ReactAdmin from "react-admin";
import { perPageMax } from "../../../../utils/pageConstants";
import { getImagesByFileUploadId } from "../../../../service/restConfig";
// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//     alignItems: "center",
//   },
//   h6_title: {
//     width: "55%",
//     float: "left",
//     fontWeight: 600,
//   },
//   notesArea: {
//     backgroundColor: theme.palette.primary.light,
//     color: theme.palette.primary.dark,
//   },
//   card: {
//     marginLeft: theme.spacing(2),
//     flexGrow: 1,
//     display: "flex",
//     padding: theme.spacing(2),
//     alignItems: "center",
//   },
//   date: {
//     marginLeft: "auto",
//     flexShrink: 0,
//   },
// }));

const PREFIX = "DenialFormDetail";
const classes = {
  root: `${PREFIX}-root`,
  h6_title: `${PREFIX}-h6_title`,
  notesArea: `${PREFIX}-notesArea`,
  card: `${PREFIX}-card`,
  date: `${PREFIX}-date`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: "flex",
    alignItems: "center",
  },
  [`& .${classes.h6_title}`]: {
    width: "55%",
    float: "left",
    fontWeight: 600,
  },
  [`& .${classes.notesArea}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
  },
  [`& .${classes.card}`]: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    display: "flex",
    padding: theme.spacing(2),
    alignItems: "center",
  },
  [`& .${classes.date}`]: {
    marginLeft: "auto",
    flexShrink: 0,
  },
}));
function DenialFormDetail({
  deniedReasonList,
  request,
  requestDenial,
  ...rest
}): JSX.Element {
  const classes = useStyles();
  const [reason, setReason] = useState("");
  const [fileData, setFileData] = useState<File>();
  const dataProvider = ReactAdmin.useDataProvider();
  const [infBlockingData, setInfBlockingData] = useState([]);
  const [orgData, setOrgData] = useState([]);
  const [requestDetail, setRequestDetail] = useState({});
  const [reasonList, setReasonList] = useState({});
  const [type, setType] = useState(false);
  const [deniedReasonLists, setDeniedReasonLists] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [hasShareInternalDenial, setHasShareInternalDenial] = useState(false);
  const [signature, setSignature] = useState(null);
  const [notes, setNotes] = useState("");
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (Object.entries(request).length > 0) {
        setRequestDetail(request);
      }
      if (Object.entries(requestDenial).length > 0) {
        setNotes(requestDenial[0].notes);
        setHasShareInternalDenial(requestDenial[0].hasShareInternalDenial);
        setExceptions(requestDenial[0].exceptions);
        setType(requestDenial[0].denialType);
        setSelectedReasons(requestDenial[0].codevalue);
        setReason(requestDenial[0].remarks);
        if (requestDenial[0].denyemail) {
          getOrg(requestDenial[0].denyemail);
        }
        const resonListTemp = { ...reasonList };
        requestDenial[0].codevalue.map((resonsMap) => {
          deniedReasonList.map((master) => {
            if (resonsMap === master.code) {
              resonListTemp[master.code] = true;
            } else {
              setReasonList((prevFormState) => ({
                ...prevFormState,
                [master.code]: false,
              }));
            }
          });
        });
        Object.entries(resonListTemp).forEach((indvres) => {
          setReasonList((prevFormState) => ({
            ...prevFormState,
            [indvres[0]]: indvres[1],
          }));
        });
        setSignature(requestDenial[0].signature);
      }

      getDenialReasonList();
      getInfBlockingDetails();
    }
    return () => {
      mounted = false;
    };
  }, [request, deniedReasonList, requestDenial, infBlockingData]);
  const queryOptionInf = {
    pagination: { page: 1, perPage: perPageMax },
    sort: { field: "id", order: "ASC" },
    filter: {},
  };
  function getInfBlockingDetails(): void {
    dataProvider
      .getList("informationBlockingExceptionsMaster", queryOptionInf)
      .then(({ data }) => {
        setInfBlockingData(data);
      });
  }

  function getDenialReasonList(): void {
    dataProvider
      .getList("denialLetterReasonMasters", queryOptionInf)
      .then(({ data }) => {
        setDeniedReasonLists(data);
      })
      .catch((error) => error);
  }
  function getOrg(denyEmail): void {
    const queryOptionOrg = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: { electronicDetails: denyEmail },
    };
    function getOrgDetails(): void {
      dataProvider
        .getList("organizationDetails", queryOptionOrg)
        .then(({ data }) => {
          setOrgData(data);
        });
    }
    getOrgDetails();
  }
  useEffect(() => {
    const queryOptionFile = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        id: signature,
      },
    };
    function getFileDetails(): void {
      dataProvider.getList("fileUploads", queryOptionFile).then(({ data }) => {
        if (data.length > 0) {
          getImagesByFileUploadId({
            fileName: data[0].fileName,
          }).then((res: Blob) => {
            blobToFile(res, data[0].fileName);
          });
        }
      });
    }
    if (signature !== null) {
      getFileDetails();
    }
  }, [signature]);
  const blobToFile = function (blob, name): void {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    setFileData(blob);
  };
  const handleTypeChange = (event): void => {
    event.persist();
    if (event.target.type === "checkbox") {
      setType(event.target.checked);
    } else {
      setType(event.target.value);
    }
  };

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            variant="h5"
            style={{ fontSize: 16, fontWeight: 500 }}
            gutterBottom
          >
            Notice Of Denial Letter
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid {...rest} className={clsx(classes.root)} container spacing={3}>
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
            <Grid item lg={12} xl={12} xs={12}></Grid>
            <Grid item lg={12} xl={12} xs={12}>
              <Typography variant="body1">
                {Object.entries(requestDetail).length > 0 && (
                  <>
                    Dear <b>{request.firstName + " " + request.lastName}</b> :
                  </>
                )}
              </Typography>
            </Grid>
            <Grid item lg={12} xl={12} xs={12}>
              <Typography variant="body1">
                We have received and reviewed your request for a copy of your
                health information record dated{" "}
                <b>
                  {Object.entries(request).length > 0 && (
                    <>{moment(request.createdat).format("DD/MM/YYYY")}</>
                  )}
                </b>
                .<br />
                Unfortunately, we cannot honor all or part of your request
                because:
              </Typography>
            </Grid>
            <Grid item lg={12} xl={12} xs={12} style={{ paddingBottom: "0px" }}>
              {Object.entries(deniedReasonLists).length > 0 && (
                <>
                  {deniedReasonLists.map((each) =>
                    selectedReasons.includes(each.code) ? (
                      <>
                        <FormControlLabel
                          label={each.value}
                          control={
                            <Checkbox
                              color="primary"
                              disabled={true}
                              defaultChecked={true}
                            />
                          }
                        />
                        <br />
                        <br />
                      </>
                    ) : (
                      ""
                    )
                  )}
                </>
              )}
            </Grid>
            {hasShareInternalDenial && (
              <>
                <Grid item lg={12} xl={12} xs={12} spacing={0}>
                  {exceptions.map((option, key) => (
                    <div style={{ width: "50%", float: "left" }} key={key}>
                      <FormControlLabel
                        name={option}
                        value={option}
                        control={
                          <Checkbox
                            color="primary"
                            disabled={true}
                            defaultChecked={true}
                          />
                        }
                        label={option}
                      />
                    </div>
                  ))}
                </Grid>
                {notes !== "" && (
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
              </>
            )}

            <Grid item lg={12} xl={12} xs={12}>
              <Typography variant="body1" style={{ textAlign: "justify" }}>
                If the above basis for denying you access to your health
                information is identified as (reviewable), then you have the
                right to request review of the decision by a licensed health
                care professional who we designate and who did not participate
                in the original decision to deny access. You may request such a
                review by contacting{" "}
                {Object.entries(requestDenial).length > 0 && (
                  <>
                    <b>
                      {(requestDenial[0].assignedfperson !== null
                        ? requestDenial[0].assignedfperson
                        : requestDenial[0].denyfperson) +
                        " " +
                        (requestDenial[0].assignedlperson !== null
                          ? requestDenial[0].assignedlperson
                          : requestDenial[0].denylperson)}
                    </b>
                  </>
                )}{" "}
                through email{" "}
                {Object.entries(requestDenial).length > 0 && (
                  <>
                    <b>
                      {" "}
                      {requestDenial[0].assignedemail
                        ? requestDenial[0].assignedemail
                        : requestDenial[0].denyemail}
                    </b>
                  </>
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
                    control={<Radio color="primary" disabled={true} />}
                    style={{ marginLeft: "auto" }}
                    label="ALL"
                  />{" "}
                  or{" "}
                  <FormControlLabel
                    name="type"
                    value="part"
                    style={{ marginLeft: "auto" }}
                    control={<Radio color="primary" disabled={true} />}
                    label="PART"
                  />
                </RadioGroup>{" "}
                of the information you requested. If we are denying only part of
                your request, you will be given access to the remaining
                information after we have excluded the parts which are
                inaccessible for you.
              </Typography>
            </Grid>
            <Grid item lg={12} xl={12} xs={12}>
              <Typography variant="body1" style={{ textAlign: "justify" }}>
                If you believe your privacy rights have been violated, you may
                deliver a written complaint to{" "}
                {Object.entries(requestDenial).length > 0 && (
                  <>
                    <b>
                      {(requestDenial[0].assignedfperson !== null
                        ? requestDenial[0].assignedfperson
                        : requestDenial[0].denyfperson) +
                        " " +
                        (requestDenial[0].assignedlperson !== null
                          ? requestDenial[0].assignedlperson
                          : requestDenial[0].denylperson)}
                    </b>
                  </>
                )}{" "}
                through email{" "}
                {Object.entries(requestDenial).length > 0 && (
                  <>
                    <b>
                      {" "}
                      {requestDenial[0].assignedemail
                        ? requestDenial[0].assignedemail
                        : requestDenial[0].denyemail}
                    </b>
                  </>
                )}
                . You may also file a complaint with the secretary of Health and
                Human services. We respect your right to file a complaint with
                us or with the secretary of Health and Human services. If you
                choose to take this action, no one will retaliate or take action
                against you for filing a complaint.
              </Typography>
            </Grid>
            {reason && (
              <Grid item lg={12} xl={12} xs={12}>
                <TextField
                  fullWidth
                  // margin="dense"
                  name="reason"
                  label="Remarks"
                  disabled={true}
                  style={{ fontSize: "14px" }}
                  required
                  value={reason}
                  variant="standard"
                />
              </Grid>
            )}
            <Grid></Grid>
            {fileData && (
              <Grid item lg={12} xl={12} xs={12}>
                <div style={{ float: "right", paddingBottom: "30px" }}>
                  <Typography variant="subtitle1" className={classes.h6_title}>
                    Signature: &nbsp;
                  </Typography>
                  <img
                    src={URL.createObjectURL(fileData)}
                    style={{ width: "150px", height: "150px" }}
                  />
                </div>
              </Grid>
            )}
            <Grid item lg={12} xl={12} xs={12}>
              <Typography variant="body1">Sincerely,</Typography>
            </Grid>
            <Grid item lg={12} xl={12} xs={12}>
              <Typography variant="body1">
                {Object.entries(requestDenial).length > 0 && (
                  <>
                    {" "}
                    <b>
                      {requestDenial[0].denyfperson +
                        " " +
                        requestDenial[0].denylperson}
                    </b>
                    <br />
                    {Object.entries(orgData).length > 0 && (
                      <>
                        {orgData[0].organizationName ? (
                          <>
                            {orgData[0].organizationName}
                            <br />
                          </>
                        ) : (
                          ""
                        )}
                        {orgData[0].street ? (
                          <>
                            {orgData[0].street}
                            <br />
                          </>
                        ) : (
                          ""
                        )}
                        {orgData[0].city ? (
                          <>
                            {orgData[0].city}
                            {", "}
                            <br />
                          </>
                        ) : (
                          ""
                        )}
                        {orgData[0].state ? (
                          <>
                            {orgData[0].state}
                            <br />
                          </>
                        ) : (
                          ""
                        )}
                        {orgData[0].country ? (
                          <>
                            {orgData[0].country}
                            <br />
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                    <b style={{ fontSize: "13px", color: "#546e7a" }}>
                      Email: {requestDenial[0].denyemail}
                    </b>
                  </>
                )}
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

DenialFormDetail.propTypes = {
  deniedReasonList: PropTypes.object.isRequired,
  request: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  requestDenial: PropTypes.object.isRequired,
  // onSubmit: PropTypes.func,
  className: PropTypes.string,
};

export default DenialFormDetail;
