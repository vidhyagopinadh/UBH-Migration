import * as React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  List,
  Typography,
  ListItem,
  Divider,
  Button,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PatientContact } from "./patientContact";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { tommddyyyy } from "./../../../../utils/dateFormator";
import { useDataProvider, usePermissions } from "react-admin";
import Activity from "./Activity";
import { getImagesByFileUploadId } from "./../../../../service/restConfig";
import FileCard from "./../../../../components/FileCard";
import type { IImageStack, IRequestToken } from "../../../../types";
import { perPageMax } from "../../../../utils/pageConstants";
import { Tab, Tabs } from "@mui/material";
import { CO_ROLE_PATIENT } from "../../../../utils/roles";
import { useHistory } from "react-router";
import { titleCase } from "../../../../utils/titleCase";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.light,
  },
  cardRoot: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.primary.light,
  },
  cardBottom: {
    marginBottom: "15px",
    backgroundColor: theme.palette.primary.light,
  },
  card: {
    flexGrow: 1,
    display: "flex",
    border: 0,
    marginLeft: "10px",
    alignItems: "center",
  },
  listItems: {
    "&.MuiListItem-gutters": {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  subTitle2: {
    textTransform: "capitalize",
  },
}));

export function Patient({ request }): JSX.Element {
  const dataProvider = useDataProvider();
  const [requestTokenList, setRequestTokenTist] = useState<IRequestToken[]>([]);
  const suffix = request.suffix ? request.suffix : "";
  const [imageStack, setImageStack] = useState<IImageStack>({
    disorderDisclosureAuthorizationFileId:
      request?.disorderDisclosureAuthorizationFileId || null,
    hipaaAuthorizationFileId: request?.hipaaAuthorizationFileId || null,
    medicalRequestFormFileId: request?.medicalRequestFormFileId || null,
    addendumRequestFileId: request?.addendumRequestFileId || null,
    editedImageId: request?.editedImageId,
    attachmentId: request?.attachment,
    proxyDocument: request?.proxyDocument || null,
  });
  const [disorderFileData, setDisorderFileData] = useState<File>();
  const [hipaaFileData, setHipaaFileData] = useState<File>();
  const [medicalFileData, setMedicalFileData] = useState<File>();
  const [personalRepData, setPersonalRepData] = useState<File>();
  const [fileData, setFileData] = useState<File>();
  const [editedImageData, setEditedImageData] = useState<File>();
  const [attachment, setAttachment] = useState<File>();
  const [currTab, setCurrTab] = React.useState("address");
  const { permissions } = usePermissions();
  const history = useHistory();
  const handleTabsChange = (
    event: React.ChangeEvent<{}>,
    value: string,
  ): void => {
    setCurrTab(value);
  };
  useEffect(() => {
    setImageStack({
      disorderDisclosureAuthorizationFileId:
        request?.disorderDisclosureAuthorizationFileId || null,
      hipaaAuthorizationFileId: request?.hipaaAuthorizationFileId || null,
      medicalRequestFormFileId: request?.medicalRequestFormFileId || null,
      addendumRequestFileId: request?.addendumRequestFileId || null,
      editedImageId: request?.editedImageId,
      attachmentId: request?.attachment,
      proxyDocument: request?.proxyDocument || null,
    });
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        requestId: request.id,
      },
    };
    function getDetails(): void {
      dataProvider.getList("requestTokenV1s", queryOption).then(({ data }) => {
        setRequestTokenTist(data);
      });
    }
    function getFileDetails(indvImageStack): void {
      const queryOptionFile = {
        pagination: { page: 1, perPage: perPageMax },
        sort: { field: "id", order: "ASC" },
        filter: {
          id: indvImageStack[1],
        },
      };

      dataProvider.getList("fileUploads", queryOptionFile).then(({ data }) => {
        if (data.length > 0) {
          getImagesByFileUploadId({
            fileName: data[0].fileName,
          }).then((res: Blob) => {
            blobToFile(res, data[0].fileName, indvImageStack[0]);
          });
        }
      });
    }
    getDetails();
    Object.entries(imageStack).forEach((indvImageStack) => {
      if (indvImageStack[1]) {
        getFileDetails(indvImageStack);
      }
    });
  }, [request]);
  const classes = useStyles();

  const blobToFile = function (blob, name, fieldName): void {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    if (fieldName === "disorderDisclosureAuthorizationFileId") {
      setDisorderFileData(blob);
    }
    if (fieldName === "hipaaAuthorizationFileId") {
      setHipaaFileData(blob);
    }
    if (fieldName === "medicalRequestFormFileId") {
      setMedicalFileData(blob);
    }
    if (fieldName === "addendumRequestFileId") {
      setFileData(blob);
    }
    if (fieldName === "editedImageId") {
      setEditedImageData(blob);
    }
    if (fieldName === "attachmentId") {
      setAttachment(blob);
    }
    if (fieldName === "proxyDocument") {
      setPersonalRepData(blob);
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: "15px" }} className={classes.root}>
        <CardContent>
          <Typography component="h6" variant="subtitle1">
            PATIENT CONTACT DETAILS
          </Typography>
          <List>
            <ListItem className={classes.listItems}>
              <PatientContact
                phoneNumber={request.phoneNumber}
                email={request.electronicDetails}
              />
            </ListItem>
            {request.mrn && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">MRN: &nbsp;</Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto" }}
                  >
                    {request.mrn}
                  </Typography>
                </ListItem>
              </>
            )}
            <ListItem className={classes.listItems}>
              <Typography variant="subtitle1">Name: &nbsp;</Typography>
              <Typography
                variant="subtitle2"
                style={{ marginLeft: "auto" }}
              >{` ${request.firstName} ${
                request.middleName ? request.middleName : ""
              } ${request.lastName} ${suffix}`}</Typography>
            </ListItem>
            <Divider />
            {request.previousName &&
              (request.previousName.trim() !== "" ? (
                <>
                  <ListItem className={classes.listItems}>
                    <Typography variant="subtitle1">
                      Previous Name: &nbsp;
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ marginLeft: "auto" }}
                    >{`${request.previousName}`}</Typography>
                  </ListItem>
                  <Divider />
                </>
              ) : (
                ""
              ))}
            {request.electronicDetails && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">Email: &nbsp;</Typography>
                  <Typography
                    variant="subtitle2"
                    style={{
                      marginLeft:
                        request.electronicDetails.length > 25 ? "50px" : "auto",
                      marginTop:
                        request.electronicDetails.length > 25 ? "-5px" : "auto",
                      wordBreak:
                        request.electronicDetails.length > 25
                          ? "break-all"
                          : "normal",
                    }}
                  >{`${request.electronicDetails}`}</Typography>
                </ListItem>
                <Divider />
              </>
            )}
            {request.relationshipValue && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">
                    Relationship: &nbsp;
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto" }}
                  >{`${titleCase(request.relationshipValue)}`}</Typography>
                </ListItem>
                <Divider />
              </>
            )}
            {request.ssn && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">SSN: &nbsp;</Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto" }}
                  >
                    {request.ssn.slice(0, 3) +
                      "-" +
                      request.ssn.slice(3, 5) +
                      "-" +
                      request.ssn.slice(5)}
                  </Typography>
                </ListItem>
                <Divider />
              </>
            )}
            {request.phoneNumber && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">Phone: &nbsp;</Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto" }}
                  >{`${request.phoneNumber}`}</Typography>
                </ListItem>
                <Divider />
              </>
            )}
            <ListItem className={classes.listItems}>
              <Typography variant="subtitle1">
                Sex Assigned at Birth: &nbsp;
              </Typography>
              <Typography
                variant="subtitle2"
                style={{ marginLeft: "auto" }}
              >{`${
                JSON.parse(request.sex).other
                  ? titleCase(JSON.parse(request.sex).other_value)
                  : titleCase(JSON.parse(request.sex).value)
              }`}</Typography>
            </ListItem>
            <Divider />
            <ListItem className={classes.listItems}>
              <Typography variant="subtitle1">Gender: &nbsp;</Typography>
              <Typography
                variant="subtitle2"
                style={{ marginLeft: "auto" }}
              >{`${
                JSON.parse(request.gender).other
                  ? titleCase(JSON.parse(request.gender).other_value)
                  : titleCase(JSON.parse(request.gender).value)
              }`}</Typography>
            </ListItem>
            <Divider />
            {request.preferredLanguageValue && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">
                    Preferred Language: &nbsp;
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto" }}
                  >{`${titleCase(request.preferredLanguageValue)}`}</Typography>
                </ListItem>
                <Divider />
              </>
            )}
            {request.preferredPronouns && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">
                    Preferred Pronouns: &nbsp;
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto" }}
                  >
                    {request.preferredPronouns
                      ? `${titleCase(request.preferredPronouns)}`
                      : ""}
                  </Typography>
                </ListItem>
                <Divider />
              </>
            )}
            <ListItem className={classes.listItems}>
              <Typography variant="subtitle1">DOB: &nbsp;</Typography>
              <Typography
                variant="subtitle2"
                style={{ marginLeft: "auto" }}
              >{`${tommddyyyy(request.birthDate)}`}</Typography>
            </ListItem>
            <Divider />
            {request.addressLine1 && (
              <>
                {" "}
                <Tabs
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  style={{ marginTop: "0px" }}
                  variant="scrollable"
                  value={currTab}
                >
                  <Tab key={"1"} label={"Address"} value={"address"} />
                  {JSON.parse(request.previousAddress).is_previous_address && (
                    <Tab
                      key={"2"}
                      label={"Previous Address"}
                      value={"previousAddress"}
                    />
                  )}
                </Tabs>
                <Divider />
                {currTab === "address" && (
                  <>
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">
                        Address line 1: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${request.addressLine1}`}</Typography>
                    </ListItem>
                    <Divider />
                    {request.addressLine2 && (
                      <>
                        <ListItem className={classes.listItems}>
                          <Typography variant="subtitle1">
                            Address line 2: &nbsp;
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            style={{ marginLeft: "auto" }}
                          >{`${request.addressLine2}`}</Typography>
                        </ListItem>
                        <Divider />
                      </>
                    )}
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">City: &nbsp;</Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${request.city}`}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">State: &nbsp;</Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${request.state}`}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">
                        Country: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${request.country}`}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">
                        Zip Code: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${request.addressZip}`}</Typography>
                    </ListItem>
                    <Divider />
                  </>
                )}
                {currTab === "previousAddress" && (
                  <>
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">
                        Address line 1: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${
                        JSON.parse(request.previousAddress).previous_address1
                      }`}</Typography>
                    </ListItem>
                    <Divider />
                    {JSON.parse(request.previousAddress).previous_address2 && (
                      <>
                        <ListItem className={classes.listItems}>
                          <Typography variant="subtitle1">
                            Address line 2: &nbsp;
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            style={{ marginLeft: "auto" }}
                          >{`${
                            JSON.parse(request.previousAddress)
                              .previous_address2
                          }`}</Typography>
                        </ListItem>
                        <Divider />
                      </>
                    )}
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">City: &nbsp;</Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${
                        JSON.parse(request.previousAddress).previous_city
                      }`}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">State: &nbsp;</Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${
                        JSON.parse(request.previousAddress).previous_state
                      }`}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">
                        Country: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${
                        JSON.parse(request.previousAddress).previous_country
                      }`}</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.listItems}>
                      <Typography variant="subtitle1">
                        Zip Code: &nbsp;
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ marginLeft: "auto" }}
                      >{`${
                        JSON.parse(request.previousAddress).previous_zip
                      }`}</Typography>
                    </ListItem>
                    <Divider />
                  </>
                )}
              </>
            )}
          </List>
        </CardContent>
      </Card>
      <Card className={classes.cardBottom}>
        <CardContent>
          <List>
            <ListItem className={classes.listItems}>
              <Typography variant="subtitle1">Created On: &nbsp;</Typography>
              <Typography variant="subtitle2" style={{ marginLeft: "auto" }}>
                {tommddyyyy(`${request.createdat}`)}
              </Typography>
            </ListItem>
            <Divider />
            {request.categoryType !== "billing" && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle1">Priority: &nbsp;</Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ marginLeft: "auto" }}
                  >{`${request.requestpriority}`}</Typography>
                </ListItem>

                <Divider />
              </>
            )}
            {request.categoryType === "request" &&
              request.durationOfProblemEncountering && (
                <>
                  <ListItem className={classes.listItems}>
                    <Typography variant="subtitle1">
                      Awaiting Resolution For: &nbsp;
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      style={{ marginLeft: "auto" }}
                    >{`${request.durationOfProblemEncountering}`}</Typography>
                  </ListItem>
                  <Divider />
                </>
              )}
            {attachment && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
                    Billing/Insurance Record File
                  </Typography>
                </ListItem>
                <ListItem className={classes.listItems}>
                  <FileCard
                    fileUrl={URL.createObjectURL(attachment)}
                    file={Object(attachment)}
                  />
                </ListItem>
                <Divider />
              </>
            )}
            {request.hasSensitiveInformation && (
              <>
                {disorderFileData && (
                  <>
                    <ListItem className={classes.listItems}>
                      <Typography
                        variant="subtitle2"
                        style={{ marginTop: "10px" }}
                      >
                        Substance Use Disorder File
                      </Typography>
                    </ListItem>
                    <ListItem className={classes.listItems}>
                      <FileCard
                        fileUrl={URL.createObjectURL(disorderFileData)}
                        file={Object(disorderFileData)}
                      />
                    </ListItem>
                    <Divider />
                  </>
                )}
              </>
            )}
            {hipaaFileData && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
                    HIPAA Request File
                  </Typography>
                </ListItem>
                <ListItem className={classes.listItems}>
                  <FileCard
                    fileUrl={URL.createObjectURL(hipaaFileData)}
                    file={Object(hipaaFileData)}
                  />
                </ListItem>
                <Divider />
              </>
            )}

            {medicalFileData && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
                    Patient Record Request File
                  </Typography>
                </ListItem>
                <ListItem className={classes.listItems}>
                  <FileCard
                    fileUrl={URL.createObjectURL(medicalFileData)}
                    file={Object(medicalFileData)}
                  />
                </ListItem>
                <Divider />
              </>
            )}
            {personalRepData && (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
                    Personal Representative Document
                  </Typography>
                </ListItem>
                <ListItem className={classes.listItems}>
                  <FileCard
                    fileUrl={URL.createObjectURL(personalRepData)}
                    file={Object(personalRepData)}
                  />
                </ListItem>
                <Divider />
              </>
            )}
            {request.categoryType === "request" &&
            permissions === CO_ROLE_PATIENT &&
            !request.signatureId &&
            request.isRequestedSupport &&
            !request.hasSignedRequest ? (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
                    Patient Medical Record Request Form
                  </Typography>
                </ListItem>
                <div className={classes.cardRoot}>
                  <Avatar>
                    <ListAltIcon />
                  </Avatar>
                  <Card className={classes.card}>
                    <Typography color="textPrimary" variant="subtitle2">
                      Patient Medical Record Request Form
                    </Typography>
                    <Button
                      style={{
                        color: "#228B22",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                      onClick={() => {
                        history.push(
                          "/patientRequests/" + request.id + "/overview",
                        );
                      }}
                    >
                      Sign Now
                    </Button>
                  </Card>
                </div>
              </>
            ) : (
              ""
            )}
            {request.categoryType === "addendum" &&
            permissions === CO_ROLE_PATIENT &&
            !request.signatureId &&
            !request.addendumRequestFileId ? (
              <>
                <ListItem className={classes.listItems}>
                  <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
                    Addendum Form
                  </Typography>
                </ListItem>
                <div className={classes.cardRoot}>
                  <Avatar>
                    <ListAltIcon />
                  </Avatar>
                  <Card className={classes.card}>
                    <Typography color="textPrimary" variant="subtitle2">
                      Addendum Form
                    </Typography>
                    <Button
                      style={{
                        color: "#228B22",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                      onClick={() => {
                        history.push(
                          "/patientRequests/" + request.id + "/overview",
                        );
                      }}
                    >
                      Sign Now
                    </Button>
                  </Card>
                </div>
              </>
            ) : (
              ""
            )}

            {request.categoryType === "request"
              ? requestTokenList.map((indvRT) => (
                  <>
                    <ListItem className={classes.listItems}>
                      <Typography
                        variant="subtitle2"
                        style={{ marginTop: "10px" }}
                      >
                        {indvRT.authFormType === 1
                          ? "HIPAA Request Form"
                          : "Substance Use Disorder Form"}
                      </Typography>
                    </ListItem>
                    <ListItem className={classes.listItems}>
                      <Activity
                        className={classes.listItems}
                        request={request}
                        activity={{
                          subject_type:
                            indvRT.authFormType === 1
                              ? "hippaAuthDetails"
                              : "substanceUseDisorder",
                          action_type: "document",
                          requestType: request.categoryType,
                          subject:
                            indvRT.authFormType === 1
                              ? "HIPAA Request Form"
                              : "Substance Use Disorder Form",
                          requestToken: indvRT,
                          requestStatus: request.requeststatus,
                        }}
                      />
                    </ListItem>
                    <Divider />
                  </>
                ))
              : request.categoryType === "addendum" && (
                  <>
                    {editedImageData && (
                      <>
                        <ListItem className={classes.listItems}>
                          <Typography
                            variant="subtitle2"
                            style={{ marginTop: "10px" }}
                          >
                            Screenshot
                          </Typography>
                        </ListItem>
                        <ListItem className={classes.listItems}>
                          <FileCard
                            fileUrl={URL.createObjectURL(editedImageData)}
                            file={Object(editedImageData)}
                          />
                        </ListItem>
                        <Divider />
                      </>
                    )}
                    {fileData && (
                      <>
                        <ListItem className={classes.listItems}>
                          <Typography
                            variant="subtitle2"
                            style={{ marginTop: "10px" }}
                          >
                            Addendum Request Form
                          </Typography>
                        </ListItem>
                        <ListItem className={classes.listItems}>
                          <FileCard
                            fileUrl={URL.createObjectURL(fileData)}
                            file={Object(fileData)}
                          />
                        </ListItem>
                        <Divider />
                      </>
                    )}
                  </>
                )}

            <Divider />
          </List>
        </CardContent>
      </Card>
    </div>
  );
}
