import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
//import { makeStyles } from "@material-ui/styles";
import {
  Button,
  Dialog,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useMutation } from "@apollo/react-hooks";
import { CardHeader, Divider } from "semantic-ui-react";
import { GridCloseIcon } from "@mui/x-data-grid";
//import type { IConfirmMrrViewProps } from "../../types";
import type { IConfirmMrrViewProps } from "../../types/types";
import { NavigateNext } from "@mui/icons-material";
import { useDataProvider } from "react-admin";
import { perPageMax } from "../../utils/pageConstants";
import type {
  GetPatientMedicalRecordDocumentMutation,
  GetPatientMedicalRecordDocumentMutationVariables,
  Integration,
} from "../../__generated__/typescript-operations_all";
import getPatientMedicalRecord from "../../queries/getPatientMedicalRecord/getPatientMedicalRecord";
import { styled } from "@mui/material/styles";

const PREFIX = "confirmMrrView";

const classes = {
  root: `${PREFIX}-root`,
  cancel: `${PREFIX}-cancel`,
  continue: `${PREFIX}-continue`,
  dialogContainer: `${PREFIX}-dialogContainer`,
  dialogContent: `${PREFIX}-dialogContent`,
  header: `${PREFIX}-header`,
  content: `${PREFIX}-content`,
  closeIcon: `${PREFIX}-closeIcon`,
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: "30px",
    width: "100%",
  },
  [`& .${classes.cancel}`]: {
    marginRight: "10px",
    backgroundColor: "grey",
    color: "white",
    textTransform: "none",
  },
  [`& .${classes.continue}`]: {
    textTransform: "none",
    borderRadius: "20px",
    color: "#000000",
  },
  [`&.${classes.dialogContainer}`]: {
    overflow: "hidden",
  },
  [`& .${classes.dialogContent}`]: {
    maxHeight: "100%",
    overflow: "auto",
  },
  [`& .${classes.header}`]: {
    maxWidth: 350,
    margin: "0 auto",
    textAlign: "center",
    marginBottom: "20px",
  },
  [`&.${classes.content}`]: {
    maxWidth: 350,
    margin: "0 auto",
    textAlign: "justify",
    marginTop: "20px",
  },
  [`& .${classes.closeIcon}`]: {
    position: "absolute",
    top: "8px",
    right: "8px",
  },
}));

function ConfirmMrrView({
  open,
  onClose,
  setOpenLoadingBase,
  setSelectedIntegration,
  setOpenErrorBase,
  selectedIntegration,
  selectedPatientId,
  ...rest
}: IConfirmMrrViewProps): JSX.Element {
  const dataProvider = useDataProvider();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [subscribeGetPatientMedicalRecord] = useMutation<
    GetPatientMedicalRecordDocumentMutation,
    GetPatientMedicalRecordDocumentMutationVariables
  >(getPatientMedicalRecord, {});
  const getMedicalRecords = (): void => {
    subscribeGetPatientMedicalRecord({
      variables: {
        input: {
          externalSystemId: selectedIntegration,
          patientId: selectedPatientId,
        },
      },
    }).then((res) => {
      if (res.data.getPatientMedicalRecordDocument.requestApiResponse.success) {
        setOpenLoadingBase(true);
        onClose();
      } else {
        setOpenErrorBase(true);
        onClose();
      }
    });
  };
  function getIntegrationList(): void {
    dataProvider
      .getList("integrations", {
        pagination: { page: 1, perPage: perPageMax },
        sort: { field: "recordStatusId", order: "ASC" },
        filter: {},
      })
      .then(({ data }) => {
        setIntegrations(data);
      })
      .catch((error) => error);
  }
  useEffect(() => {
    getIntegrationList();
  }, []);
  const handleSelectedIntegrationChange = (event) => {
    setSelectedIntegration(event.target.value);
  };
  return (
    <>
    <StyledDiv>
      <Dialog
        maxWidth="sm"
        onClose={onClose}
        open={open}
        classes={{ container: classes.dialogContainer }}
        disableBackdropClick
      >
        <IconButton
          className={classes.closeIcon}
          onClick={() => {
            onClose();
          }}
        >
          <GridCloseIcon />
        </IconButton>
        <div {...rest} className={clsx(classes.root)}>
          <div className={classes.header}>
            <CardHeader>
              <Typography align="center" gutterBottom variant="h5">
                <b>Select a health data connector partner service</b>{" "}
              </Typography>
            </CardHeader>
            <Divider />
          </div>
          <div className={classes.content}>
            <p>
              Choose from one of the health data connector partner services to
              search for your medical records.
            </p>
            <RadioGroup
              name="type"
              onChange={handleSelectedIntegrationChange}
              style={{ display: "inline-block" }}
            >
              {integrations.map((each) => (
                <>
                  <FormControlLabel
                    name={each.systemName}
                    value={each.id}
                    control={<Radio color="primary" />}
                    style={{ marginLeft: "auto" }}
                    label={<b>{each.systemName}</b>}
                  />
                  <br></br>
                </>
              ))}
            </RadioGroup>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.continue}
              onClick={getMedicalRecords}
              endIcon={<NavigateNext />}
              style={{
                background: selectedIntegration
                  ? `linear-gradient(to right, #96DED1 70%, #2AAA8A 40%)`
                  : `linear-gradient(to right, #d3d3d3 70%, #949494 40%)`,
              }}
              disabled={selectedIntegration ? false : true}
            >
              Continue
            </Button>
          </div>
        </div>
      </Dialog>
      </StyledDiv>
    </>
  );
}

ConfirmMrrView.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  setOpenLoadingBase: PropTypes.func,
};

export default ConfirmMrrView;
