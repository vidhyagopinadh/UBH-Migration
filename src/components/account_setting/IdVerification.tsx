import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  Typography,
  type Theme,
  Divider,
  CardContent,
  Grid,
  Container,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import CreatePageHeader from "../createPageHeader";
import { BootstrapTooltip as Tooltip } from "../Tooltip";
// import {
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   Checkbox,
//   Container,
//   Divider,
//   FormControlLabel,
//   Grid,
//   Typography,
// } from "@material-ui/core";
import { perPageMax } from "../../utils/pageConstants";
import { useDataProvider, useTranslate } from "react-admin";
import type {
  Integration,
  UpdateIdentityVerificationV1Input,
  UpdateIdentityVerificationV1Mutation,
  UpdateIdentityVerificationV1MutationVariables,
} from "../../__generated__/typescript-operations_all";
import IntegrationListItem from "../integrationListItem";
import VerificationSuccessModal from "../idVerification/verificationSuccessModal";
import updateIdentityVerification from "../../queries/updateIdentityVerification/updateIdentityVerification";
import { useMutation } from "@apollo/react-hooks";
import BaseModal from "../baseModal";
import useTraces from "../../hooks/useTraces";
// import type { AppState } from "../../types";
// import { useSelector } from "react-redux";
import noIntegration from "../../images/noIntegration.jpg";
import { useNavigate } from "react-router";
import { correlationConstants } from "../../utils/OT/correlationConstants";
// const useStyles = makeStyles((theme: Theme) => ({
//   root: {
//     backgroundColor: theme.palette.primary.light,
//     marginTop: 20,
//   },
//   button: {
//     margin: theme.spacing(1),
//   },
//   imageContainer: {
//     marginTop: "10px",
//     marginBottom: "10px",
//     display: "flex",
//     justifyContent: "center",
//   },
//   image: {
//     marginTop: 10,
//     width: "300px",
//     height: "200px",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     marginBottom: theme.spacing(2),
//   },
//   empty: {
//     textAlign: "center",
//     justifyContent: "center",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     margin: "20px",
//   },
//   emptyMessage: {
//     fontSize: 16,
//     fontWeight: 500,
//     width: "400px",
//   },
//   closeButton: {
//     textTransform: "none",
//   },
// }));

const PREFIX = "IdVerification";
const classes = {
  root: `${PREFIX}-root`,
  button: `${PREFIX}-button`,
  imageContainer: `${PREFIX}-imageContainer`,
  image: `${PREFIX}-image`,
  header: `${PREFIX}-header`,
  empty: `${PREFIX}- empty`,
  emptyMessage: `${PREFIX}- emptyMessage`,
  closeButton: `${PREFIX}- closeButton`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    backgroundColor: theme.palette.primary.light,
    marginTop: 20,
  },
  [`& .${classes.button}`]: {
    margin: theme.spacing(1),
  },
  [`& .${classes.imageContainer}`]: {
    marginTop: "10px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
  },
  [`&.${classes.image}`]: {
    marginTop: 10,
    width: "300px",
    height: "200px",
  },
  [`& .${classes.header}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: theme.spacing(2),
  },
  [`& .${classes.empty}`]: {
    textAlign: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "20px",
  },
  [`& .${classes.emptyMessage}`]: {
    fontSize: 16,
    fontWeight: 500,
    width: "400px",
  },
  [`& .${classes.closeButton}`]: {
    textTransform: "none",
  },
}));

export default function IdVerification(): JSX.Element {
  const translate = useTranslate();
  const { getTrace, handleTrace } = useTraces();
  const history = useHistory();
  const dataProvider = useDataProvider();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer
  );
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [openBase, setOpenBase] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openErrorBase, setOpenErrorBase] = useState<boolean>(false);
  const [reloadIntegrations, setReloadIntegrations] = useState<boolean>(false);
  const status = window.location.href.split("?");
  const [verifiedFhirId, setVerifiedFhirId] = useState<string>(null);
  const [errorType, setErrorType] = useState<string>(null);
  const [subscribeUpdateIdentityVerificationMutation] = useMutation<
    UpdateIdentityVerificationV1Mutation,
    UpdateIdentityVerificationV1MutationVariables
  >(updateIdentityVerification, {});

  useEffect(() => {
    getIntegrationList();
    getTrace("Click on Id verification", "ev-156", userInfoReducer.email);
  }, [reloadIntegrations]);
  useEffect(() => {
    if (status?.length > 1) {
      const statusWithoutIss = status[1].split("#");
      const statusParameters = statusWithoutIss[0].split("&");
      const keyValuePairs = statusParameters.map((item) => {
        const [key, value] = item.split("=");
        return { [key]: value };
      });
      const identityVerificationInput: UpdateIdentityVerificationV1Input = {
        updateData: {
          externalSystemPatientId:
            keyValuePairs.find((item) => "status" in item)?.status === "SUCCESS"
              ? keyValuePairs.find((item) => "patient_id" in item)?.patient_id
              : null,
          transactionId: localStorage.getItem("TransactionId"),
          status: keyValuePairs.find((item) => "status" in item)?.status,
          errorType:
            keyValuePairs.find((item) => "status" in item)?.status !== "SUCCESS"
              ? keyValuePairs.find((item) => "errors" in item)?.errors
              : null,
        },
      };
      if (identityVerificationInput.updateData.status) {
        const eventObj = correlationConstants["ev-165"];
        const inputContext = {
          action: "Verification completed and message displayed",
          aecId: eventObj.aecId,
          aecIeId: eventObj.aecIeId,
        };
        handleTrace(
          eventObj.eventTitle,
          inputContext,
          (spanContext: any, fingerprint: any) => {
            identityVerificationInput.otContext = JSON.stringify(spanContext);
            identityVerificationInput.fingerPrint = fingerprint;
            identityVerificationInput.otTags = JSON.stringify({
              name: "Verification completed and message displayed",
            });
            subscribeUpdateIdentityVerificationMutation({
              variables: {
                input: identityVerificationInput,
              },
            }).then((response) => {
              localStorage.removeItem("TransactionId");
              if (
                response.data.updateIdentityVerificationV1.requestResult.success
              ) {
                if (identityVerificationInput.updateData.status === "SUCCESS") {
                  setVerifiedFhirId(statusParameters[1].split("=")[1]);
                  setOpenBase(true);
                } else {
                  setErrorType(statusParameters[1].split("=")[1]);
                  setOpenBase(true);
                }
              } else {
                setOpenErrorBase(true);
              }
            });
          }
        );
      }
    }
  }, []);

  function getIntegrationList(): void {
    dataProvider
      .getList("integrations", {
        pagination: { page: 1, perPage: perPageMax },
        sort: { field: "recordStatusId", order: "ASC" },
        filter: { partyIdVerification: true },
      })
      .then(({ data }) => {
        setIntegrations(data);
        setIsLoading(false);
      })
      .catch((error) => error);
  }

  return (
    <>
      {!isLoading ? (
        <Container
          maxWidth="xl"
          style={{ maxWidth: "unset", paddingRight: "5px", paddingLeft: "5px" }}
        >
          {openBase && (
            <VerificationSuccessModal
              open={openBase}
              onClose={() => {
                setOpenBase(false);
              }}
              modalType={verifiedFhirId ? "success" : "error"}
              errorType={errorType}
              selectedSystem={null}
            />
          )}
          {openErrorBase && (
            <BaseModal
              open={openErrorBase}
              confirmAction={() => {
                setOpenErrorBase(false);
              }}
              onClose={() => {
                setOpenErrorBase(false);
              }}
              title={"Error"}
              content={translate(
                "resources.requests.notification.errorMessageMrr"
              )}
              closeButtonName="Close"
              type="requestError"
            />
          )}
          <CreatePageHeader
            subTitle=""
            mainTitle="resources.accountSetting.verifyIdTitle"
          />
          <Card className={classes.root}>
            <CardHeader>
              <Typography
                variant="h5"
                style={{ fontSize: 16, fontWeight: 500 }}
                gutterBottom
              >
                <b>Verify Your Id:</b>
              </Typography>
            </CardHeader>
            {integrations.length > 0 ? (
              <CardContent>
                <Grid item md={12}>
                  <Typography
                    variant="h5"
                    style={{ fontSize: 18, fontWeight: 600 }}
                    gutterBottom
                  >
                    We need to verify your ID
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item md={12}>
                  <Typography
                    variant="body1"
                    style={{
                      fontSize: 14,
                      textAlign: "justify",
                      marginTop: "20px",
                    }}
                    gutterBottom
                  >
                    Choose from the list of service providers to verify your
                    identity. To start, select one of the providers from the
                    list and click{" "}
                    <span style={{ fontWeight: "bold" }}>‘Start Verify’</span>{" "}
                    or <span style={{ fontWeight: "bold" }}>'Reverify' </span>
                    button.{" "}
                  </Typography>
                </Grid>
                {integrations.map((eachIntegration, key) => (
                  <IntegrationListItem
                    eachIntegration={eachIntegration}
                    key={key}
                    setReloadIntegrations={setReloadIntegrations}
                  />
                ))}
              </CardContent>
            ) : (
              <Container className={classes.empty}>
                <div className={classes.imageContainer}>
                  <img alt="" className={classes.image} src={noIntegration} />
                </div>
                <Typography
                  variant="h5"
                  className={classes.emptyMessage}
                  gutterBottom
                  align="center"
                >
                  No ID verification providers are currently available. We're
                  working hard to add providers soon. Please check back later.
                </Typography>
                <Tooltip
                  arrow
                  placement="top"
                  title={translate("tooltip.integration.notifyMe")}
                >
                  <FormControlLabel
                    name="prevName"
                    // onChange={handleNotify}
                    control={<Checkbox color="primary" />}
                    label={
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: "500" }}
                      >
                        Notify me
                      </Typography>
                    }
                  />
                </Tooltip>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.closeButton}
                  onClick={() => {
                    history.push("/profile/myAccount");
                  }}
                >
                  Close
                </Button>
              </Container>
            )}
          </Card>
        </Container>
      ) : (
        <div className="loader">Loading...</div>
      )}
    </>
  );
}
