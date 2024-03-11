import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import Loader from "react-js-loader";
import { makeStyles } from "@material-ui/styles";
import { Button, Dialog, Typography } from "@material-ui/core";
import { CardHeader, Divider } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import type {
  InitIdentityVerificationV1Mutation,
  InitIdentityVerificationV1MutationVariables,
} from "../../__generated__/typescript-operations_all";
import initIdentityVerification from "../../queries/initIdentityVerification/initIdentityVerification";
import VerificationSuccessModal from "./verificationSuccessModal";
import useTraces from "../../hooks/useTraces";
import { useSelector } from "react-redux";
import type { AppState, IdRedirectionProps } from "../../types";
import { TaskAlt } from "@mui/icons-material";
import { ArrowRight } from "@material-ui/icons";
const useStyles = makeStyles(() => ({
  root: {
    padding: "30px",
    width: "100%",
  },
  dialogContainer: {
    overflow: "hidden",
  },
  header: {
    maxWidth: 600,
    margin: "0 auto",
    textAlign: "center",
    marginBottom: "20px",
  },
  content: {
    maxWidth: 520,
    margin: "0 auto",
    textAlign: "justify",
    marginTop: "20px",
  },
  tickIcon: {
    color: "green",
    marginRight: "20px",
  },
}));

function IdVerificationRedirection({
  open,
  onClose,
  selectedSystem,
  ...rest
}: IdRedirectionProps): JSX.Element {
  const classes = useStyles();
  const { getTrace } = useTraces();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [patientCreationErrorModal, setPatientCreationErrorModal] =
    useState<boolean>(false);
  const [preparationCompleted, setPreparationCompleted] =
    useState<boolean>(false);
  const [redirectionUrl, setRedirectionUrl] = useState<string>(null);
  const [subscribeInitIdentityVerificationMutation] = useMutation<
    InitIdentityVerificationV1Mutation,
    InitIdentityVerificationV1MutationVariables
  >(initIdentityVerification, {});
  useEffect(() => {
    if (open && !patientCreationErrorModal) {
      initPatient();
    }
  }, [open, patientCreationErrorModal]);
  const continueVerification = (): void => {
    onClose();
    getTrace(
      "Redirect to id verification site",
      "ev-164",
      userInfoReducer.email,
    );
    window.location.href = redirectionUrl;
  };
  const initPatient = (): void => {
    subscribeInitIdentityVerificationMutation({
      variables: {
        input: {
          externalSystemId: selectedSystem.id,
          userTransactionId: selectedSystem.transactionId,
        },
      },
    }).then((res) => {
      if (
        res.data.initIdentityVerificationV1.verificationMeta.patientExternalId
      ) {
        const refParam =
          res.data.initIdentityVerificationV1.verificationMeta.externalSystem.params.find(
            (param) => param.key === "reference_required",
          )?.value === "true"
            ? "&ref=" +
              res.data.initIdentityVerificationV1.verificationMeta.externalSystem.params.find(
                (param) => param.key === "ref",
              )?.value
            : "";
        const emailParam =
          res.data.initIdentityVerificationV1.verificationMeta.externalSystem.params.find(
            (param) => param.key === "email_required",
          )?.value === "true"
            ? "&email=" + userInfoReducer.email
            : "";
        localStorage.setItem(
          "TransactionId",
          res.data.initIdentityVerificationV1.verificationMeta.transactionId,
        );
        setRedirectionUrl(
          res.data.initIdentityVerificationV1.verificationMeta.externalSystem
            .idVerificationBaseUrl +
            "?access_token=" +
            res.data.initIdentityVerificationV1.verificationMeta.externalSystem.params.find(
              (param) => param.key === "access_token",
            )?.value +
            "&redirect_url=" +
            res.data.initIdentityVerificationV1.verificationMeta.externalSystem.params.find(
              (param) => param.key === "redirect_url",
            )?.value +
            "&patient_id=" +
            res.data.initIdentityVerificationV1.verificationMeta.externalSystem.params.find(
              (param) => param.key === "patient_id",
            )?.value +
            refParam +
            emailParam,
        );
        setPreparationCompleted(true);
      } else {
        setPatientCreationErrorModal(true);
      }
    });
  };

  return (
    <>
      {patientCreationErrorModal && (
        <VerificationSuccessModal
          open={patientCreationErrorModal}
          onClose={() => {
            setPatientCreationErrorModal(false);
          }}
          modalType={"error"}
          errorType={"patientCreationError"}
          selectedSystem={selectedSystem}
        />
      )}
      <Dialog
        maxWidth="sm"
        onClose={onClose}
        open={open}
        classes={{ container: classes.dialogContainer }}
        disableBackdropClick
      >
        <div {...rest} className={clsx(classes.root)}>
          <div className={classes.header}>
            <CardHeader>
              {!preparationCompleted ? (
                <div
                  style={{
                    display: "flex",
                    textAlign: "center",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Typography style={{ fontWeight: 500 }} variant="h5">
                    Preparation is in progress
                  </Typography>
                  <div style={{ width: "40px" }}>
                    <Loader
                      type="bubble-scale"
                      bgColor="blue"
                      title={""}
                      size={20}
                      style={{ width: "40px" }}
                    />{" "}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    textAlign: "center",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TaskAlt
                    className={classes.tickIcon}
                    style={{ width: "40px", height: "40px" }}
                  />
                  <Typography style={{ fontWeight: 500 }} variant="h5">
                    Preparation steps completed
                  </Typography>
                </div>
              )}
            </CardHeader>
            <Divider />
          </div>
          <div className={classes.content}>
            We are preparing to start the identity verification process. Once
            the preparation steps completed, you will be redirected to the
            verification website.
            <ul>
              <li>
                Before you start, please prepare your identity document, and
                make sure it’s valid, unexpired, not amended, and have a photo.
                Please follow all of the instructions provided during the
                verification process.
              </li>
              <li>
                You may be asked to take a photo of your government-issued ID,
                such as your driver’s license, state ID or passport.
              </li>
              <li>You will be asked to take a photo of yourself.</li>
              <li>
                You will get a conformation message once the process is
                complete.
              </li>
              <li>
                Please do not close or navigate away until you receive the
                message <b>"Id verification completed successfully"</b> from
                Unblock Health.
              </li>
              <li>
                It may take a few minutes, but when your identification is
                complete, you will receive an email from{" "}
                <a href="mailTo:support@unblock.health">
                  support@unblock.health
                </a>{" "}
                confirming the status of your identity verification.
              </li>
              <li>
                If you need any assistance from our Support team, do not
                hesitate to contact us at{" "}
                <a href="mailTo:support@unblock.health">
                  support@unblock.health
                </a>
                .
              </li>
            </ul>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            {preparationCompleted && (
              <Button
                variant="contained"
                color="primary"
                disabled={patientCreationErrorModal}
                onClick={continueVerification}
                endIcon={<ArrowRight />}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}

IdVerificationRedirection.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  selectedSystem: PropTypes.array,
};

export default IdVerificationRedirection;
