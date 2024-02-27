import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  InputLabel,
  Typography,
} from "@material-ui/core";
import type { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useDataProvider } from "react-admin";
import { tommddyyyy } from "../../utils/dateFormator";
import { Header } from "./header";
import { getImagesByFileUploadId } from "../../service/restConfig";
import { perPageMax } from "../../utils/pageConstants";
import patientDetails from "./../../queries/patientDetails/patientDetails";
import { useMutation } from "react-apollo";
import {
  AUTHORIZATION_SERVICE_PROVIDERS_TYPE,
  FORM_CONTENT,
} from "../../utils/constants";
import type { IAuthorizationProps } from "../../types";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
    backgroundColor: theme.palette.primary.light,
  },
  fullWidth: {
    marginBottom: theme.spacing(1),
    width: "100%",
  },
  fields: {
    margin: theme.spacing(-1),
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      flexGrow: 1,
      margin: theme.spacing(1),
    },
  },
  select: {
    minWidth: "40%",
  },
  button: {
    margin: theme.spacing(1),
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: theme.spacing(2),
  },
  subHead: {
    backgroundColor: theme.palette.primary.light,
    padding: "5px 10px",
    marginBottom: "0px",
    fontWeight: 600,
    fontSize: "16px",
  },
  label: {
    fontWeight: "bold",
    fontSize: "13px",
  },
  rootLabel: {
    marginLeft: "0px",
    marginRight: "0px",
  },
  contentText1: {
    padding: "10px 15px 10px 18px",
  },
}));

const AuthorizationDetails = ({
  formType,
  token,
}: IAuthorizationProps): JSX.Element => {
  const [subscribepatientDetailsMutation] = useMutation(patientDetails, {});
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const [fileData, setFileData] = useState<File>();
  const [legalIdData, setLegalIdData] = useState<File>();
  const [dataToShow, setDataToShow] = useState({
    authorizationExpireEvent: "",
    authorizationOthers: "",
    authorizationServiceProvidersOthers: "",
    authorizationServiceProvidersType: 1,
    disorderTreatmentProgram: "",
    createdAt: "",
    endTo: "",
    startFrom: "",
    expiryDate: "",
    healthAuthAuthorizationTitle: "",
    useDisorderAuthorizationTitle: "",
    id: 0,
    image: "",
    isValidAfterDeath: false,
    nodeId: "",
    others: "",
    patientId: "",
    purpose: "",
    receiveperson: "",
    recordStatusId: "",
    requestId: "",
    signatureFile: "",
    firstName: "",
    lastName: "",
    middleName: "",
    patientRepresentative: "",
    patientRelation: "",
    legalId: "",
  });
  const [formVar, setFormVar] = useState("hipaa");
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getData();
    }
    return () => {
      mounted = false;
    };
  }, [formType]);
  function getData(): void {
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        token,
      },
    };
    dataProvider.getList("requestTokenV1s", queryOption).then(({ data }) => {
      if (data[0].authFormType === 1) {
        setFormVar("hipaa");
      } else {
        setFormVar("sud");
      }
      const queryOptionRequest = {
        pagination: { page: 1, perPage: perPageMax },
        sort: { field: "id", order: "ASC" },
        filter: {
          requestId: data[0].requestId,
        },
      };
      dataProvider
        .getList(
          data[0].authFormType === 1
            ? "healthInfoAuthorizationV2"
            : "substanceDisorderAuthorizationV1s",
          queryOptionRequest,
        )
        .then(({ data }) => {
          if (data) {
            setDataToShow((prevFormState) => ({
              ...prevFormState,

              authorizationExpireEvent: data[0].authorizationExpireEvent,
              healthAuthAuthorizationTitle:
                data[0].healthAuthAuthorizationTitle,
              authorizationOthers: data[0].authorizationOthers,
              authorizationServiceProvidersOthers:
                data[0].authorizationServiceProvidersOthers,
              authorizationServiceProvidersType: Number(
                data[0].authorizationServiceProvidersType,
              ),
              useDisorderAuthorizationTitle:
                data[0].useDisorderAuthorizationTitle,
              createdAt: tommddyyyy(data[0].createdAt),
              endTo: tommddyyyy(data[0].endTo),
              startFrom: tommddyyyy(data[0].startFrom),
              expiryDate: data[0].expiryDate && tommddyyyy(data[0].expiryDate),
              id: Number(data[0].id),
              image: data[0].image,
              isValidAfterDeath: data[0].isValidAfterDeath,
              disorderTreatmentProgram: data[0].disorderTreatmentProgram,
              nodeId: "",
              others: data[0].others,
              patientId: data[0].patientId,
              purpose: data[0].purpose,
              receiveperson: data[0].receivePerson,
              patientRepresentative: data[0].patientRepresentative,
              patientRelation: data[0].patientRelation,
              recordStatusId: "",
              requestId: "",
              signatureFile: data[0].signatureFile,
              legalId: data[0].legalId,
            }));
            if (data[0].signatureFile !== null) {
              getFileDetails(data[0].signatureFile, "sign");
            }
            if (data[0].legalId) {
              getFileDetails(data[0].legalId, "id");
            }

            subscribepatientDetailsMutation({
              variables: {
                input: { patientid: data[0].patientId },
              },
            }).then((res) => {
              setDataToShow((prevFormState) => ({
                ...prevFormState,
                firstName: res.data.patientDetailsV1.results[0].firstName,
                lastName: res.data.patientDetailsV1.results[0].lastName,
                middleName: res.data.patientDetailsV1.results[0].middleName
                  ? res.data.patientDetailsV1.results[0].middleName
                  : "",
              }));
            });
          }
        });
    });
  }
  function getFileDetails(picId: string, picType: string): void {
    const queryOptionFile = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        id: picId,
      },
    };
    dataProvider.getList("fileUploads", queryOptionFile).then(({ data }) => {
      if (data.length > 0) {
        getImagesByFileUploadId({
          fileName: data[0].fileName,
        }).then((res: Blob) => {
          blobToFile(res, data[0].fileName, picType);
        });
      }
    });
  }
  const blobToFile = function (blob, name, type): void {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    if (type === "sign") setFileData(blob);
    else setLegalIdData(blob);
  };

  return (
    <Container>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Header title={FORM_CONTENT[formVar].headerTitle} />
        </Grid>
      </Grid>
      <form autoComplete="off" noValidate>
        <Card className={classes.root}>
          <CardContent>
            <Grid item md={12} xs={12}>
              <Typography
                component="h2"
                gutterBottom
                variant="h5"
                className={classes.subHead}
              >
                {FORM_CONTENT[formVar].cardTitle}
              </Typography>
              <Divider />
            </Grid>
            <Grid container spacing={3} style={{ marginTop: "5px" }}>
              <Grid item md={12} xs={12} style={{ padding: "5px 12px" }}>
                <Typography
                  variant="h5"
                  style={{
                    fontSize: 15,
                    margin: "13px 0",
                    fontWeight: "bold",
                  }}
                  gutterBottom
                >
                  {FORM_CONTENT[formVar].title}
                </Typography>
                <Grid item md={12} xs={12}>
                  <InputLabel
                    style={{
                      fontWeight: "bold",
                      fontSize: "5px 15px 5px 15px",
                    }}
                  >
                    1. This authorization applies to the following information:
                  </InputLabel>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    style={{ display: "inline-flex", width: "100%" }}
                  >
                    <Typography className={classes.contentText1}>
                      Authorization Title:{" "}
                      <span style={{ color: "#4e6a9c" }}>
                        {Object.entries(dataToShow).length > 0 && (
                          <>
                            {formType === "hipaa"
                              ? dataToShow.healthAuthAuthorizationTitle
                              : dataToShow.useDisorderAuthorizationTitle}
                          </>
                        )}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  style={{ display: "inline-flex", width: "100%" }}
                >
                  <Typography variant="body1" className={classes.contentText1}>
                    Time Period From:{" "}
                    <span style={{ color: "#4e6a9c" }}>
                      {Object.entries(dataToShow).length > 0 && (
                        <>{dataToShow.startFrom}</>
                      )}
                    </span>
                    .<br />
                  </Typography>

                  <Typography variant="body1" className={classes.contentText1}>
                    Time Period To:{" "}
                    <span style={{ color: "#4e6a9c" }}>
                      {Object.entries(dataToShow).length > 0 && (
                        <>{dataToShow.endTo}</>
                      )}
                    </span>
                    .<br />
                  </Typography>
                </Grid>
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: "5px 12px" }}>
                <InputLabel
                  style={{ fontWeight: "bold", fontSize: "5px 15px 5px 15px" }}
                >
                  2. {FORM_CONTENT[formVar].formfield2}
                </InputLabel>
                <Grid
                  item
                  md={12}
                  xs={12}
                  style={{ display: "inline-flex", width: "100%" }}
                >
                  <Typography variant="body1" className={classes.contentText1}>
                    {FORM_CONTENT[formVar].formField2Label}:{" "}
                    {formVar === "hipaa" ? (
                      <>
                        {dataToShow.authorizationServiceProvidersType && (
                          <>
                            <span style={{ color: "#4e6a9c" }}>
                              {Object.entries(dataToShow).length > 0 && (
                                <>
                                  {" "}
                                  {
                                    AUTHORIZATION_SERVICE_PROVIDERS_TYPE[
                                      dataToShow.authorizationServiceProvidersType -
                                        1
                                    ].value
                                  }{" "}
                                </>
                              )}
                            </span>
                            .<br />
                            {dataToShow.authorizationServiceProvidersOthers && (
                              <>
                                <>
                                  <span style={{ color: "#4e6a9c" }}>
                                    {Object.entries(dataToShow).length > 0 && (
                                      <>
                                        {" "}
                                        {
                                          dataToShow.authorizationServiceProvidersOthers
                                        }{" "}
                                      </>
                                    )}
                                  </span>
                                  .<br />
                                </>
                              </>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {Object.entries(dataToShow).length > 0 && (
                          <span style={{ color: "#4e6a9c" }}>
                            {Object.entries(dataToShow).length > 0 && (
                              <>{dataToShow.disorderTreatmentProgram}</>
                            )}
                          </span>
                        )}
                      </>
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: "5px 12px" }}>
                <InputLabel
                  style={{ fontWeight: "bold", fontSize: "5px 15px 5px 15px" }}
                >
                  3.{FORM_CONTENT[formVar].formField3}
                </InputLabel>

                <Typography variant="body1" className={classes.contentText1}>
                  Receive Person:{" "}
                  <span style={{ color: "#4e6a9c" }}>
                    {Object.entries(dataToShow).length > 0 && (
                      <>{dataToShow.receiveperson}</>
                    )}
                  </span>
                  .<br />
                </Typography>
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: "5px 12px" }}>
                <InputLabel
                  style={{ fontWeight: "bold", fontSize: "5px 15px 5px 15px" }}
                >
                  4. Purpose of proposed use or disclosure:
                </InputLabel>

                <Typography variant="body1" className={classes.contentText1}>
                  Purpose:{" "}
                  <span style={{ color: "#4e6a9c" }}>
                    {Object.entries(dataToShow).length > 0 && (
                      <>{dataToShow.purpose}</>
                    )}
                  </span>
                  .<br />
                </Typography>
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: "5px 12px" }}>
                <InputLabel
                  style={{ fontWeight: "bold", fontSize: "5px 15px 5px 15px" }}
                >
                  5.{" "}
                  {dataToShow.isValidAfterDeath ? (
                    <>
                      {" "}
                      This authorization does not expire & is valid until after
                      my death.{" "}
                    </>
                  ) : (
                    <>This authorization expires:</>
                  )}
                </InputLabel>
                {!dataToShow.isValidAfterDeath && (
                  <Grid
                    item
                    md={12}
                    xs={12}
                    style={{ display: "inline-flex", width: "100%" }}
                  >
                    {dataToShow.authorizationExpireEvent && (
                      <>
                        <Typography
                          variant="body1"
                          className={classes.contentText1}
                        >
                          Authorization Expire Event:{" "}
                          <span style={{ color: "#4e6a9c" }}>
                            {Object.entries(dataToShow).length > 0 && (
                              <>{dataToShow.authorizationExpireEvent}</>
                            )}
                          </span>
                          .<br />
                        </Typography>
                      </>
                    )}

                    {dataToShow.expiryDate && (
                      <>
                        <Typography
                          variant="body1"
                          className={classes.contentText1}
                        >
                          Authorization Expire Date:{" "}
                          <span style={{ color: "#4e6a9c" }}>
                            {Object.entries(dataToShow).length > 0 && (
                              <>{dataToShow.expiryDate}</>
                            )}
                          </span>
                          .<br />
                        </Typography>
                      </>
                    )}
                  </Grid>
                )}
              </Grid>
              <Grid item md={12} xs={12}>
                <div>
                  <Grid item>
                    <Typography
                      component="h2"
                      gutterBottom
                      variant="h5"
                      className={classes.subHead}
                      style={{ textAlign: "left" }}
                    >
                      AUTHORIZATION
                    </Typography>
                    <Divider />
                  </Grid>
                  <div style={{ display: "inline-flex", width: "100%" }}>
                    <Grid item md={8} xs={12}>
                      <Grid item md={12} xs={12} style={{ paddingTop: "16px" }}>
                        <InputLabel style={{ fontWeight: "bold" }}>
                          I understand and agree to the foregoing:
                        </InputLabel>
                      </Grid>

                      <Grid
                        item
                        md={12}
                        xs={12}
                        style={{ display: "inline-flex", width: "100%" }}
                      >
                        <Typography
                          variant="body1"
                          className={classes.contentText1}
                        >
                          Patient Name:{" "}
                          <span style={{ color: "#4e6a9c" }}>
                            {Object.entries(dataToShow).length > 0 && (
                              <>
                                <>
                                  {" "}
                                  {dataToShow.firstName +
                                    " " +
                                    dataToShow.middleName +
                                    " " +
                                    dataToShow.lastName}{" "}
                                </>
                              </>
                            )}
                          </span>
                          .
                        </Typography>
                      </Grid>
                      <Grid item md={12} xs={12} style={{ paddingTop: "16px" }}>
                        {dataToShow.patientRepresentative ? (
                          <InputLabel style={{ fontWeight: "bold" }}>
                            Signed as the patient representative:
                          </InputLabel>
                        ) : (
                          <InputLabel style={{ fontWeight: "bold" }}>
                            Signed as the patient
                          </InputLabel>
                        )}
                      </Grid>
                      {dataToShow.patientRepresentative && (
                        <Grid item md={12} xs={12}>
                          <Typography
                            variant="body1"
                            className={classes.contentText1}
                          >
                            Name:{" "}
                            <span style={{ color: "#4e6a9c" }}>
                              {Object.entries(dataToShow).length > 0 && (
                                <>{dataToShow.patientRepresentative}</>
                              )}
                            </span>
                            .<br />
                          </Typography>

                          <Typography
                            variant="body1"
                            className={classes.contentText1}
                          >
                            Relation:{" "}
                            <span style={{ color: "#4e6a9c" }}>
                              {Object.entries(dataToShow).length > 0 && (
                                <>{dataToShow.patientRelation}</>
                              )}
                            </span>
                            .
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                    {legalIdData && formType === "hipaa" && (
                      <Grid
                        item
                        md={2}
                        xs={12}
                        style={{
                          margin: "10%",
                          float: "right",
                          // padding: "20px",
                        }}
                      >
                        <Typography variant="subtitle1">Legal ID:</Typography>
                        <>
                          <img
                            src={URL.createObjectURL(legalIdData)}
                            style={{ width: "250px", height: "190px" }}
                          />
                        </>
                      </Grid>
                    )}

                    <Grid
                      item
                      md={2}
                      style={{ marginTop: "10%", float: "right" }}
                      xs={12}
                    >
                      {fileData && (
                        <>
                          <Typography variant="subtitle1">
                            Signature: &nbsp;
                          </Typography>
                          <img
                            src={URL.createObjectURL(fileData)}
                            style={{ width: "150px", height: "150px" }}
                          />
                        </>
                      )}
                    </Grid>
                  </div>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </Container>
  );
};

export default AuthorizationDetails;
