import * as React from "react";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { useDataProvider, useTranslate } from "react-admin";
import {
  Divider,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import type { IAuthorizationComponent, IGenericType, IRepData } from "../types/types";
import moment from "moment";
import { perPageMax } from "../utils/pageConstants";
import { validateString } from "../utils/validator";
import { addAuthFormErrorMessages } from "../utils/messages/errorMessages";

export const AuthorizationComponent = ({
  requestDetails,
  setRepresentative,
  patientRelationStatus,
  setpatientRelationStatus,
}: IAuthorizationComponent) => {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const [repData, setRepData] = useStateWithCallbackLazy<IRepData>({
    patientRepresentative: "",
    patientRelation: null,
    date: moment().format("YYYY-MM-DD"),
    valid: false,
    error: false,
  });
  const [patientRelationList, setPatientRelationList] = React.useState<
    IGenericType[]
  >([]);

  const [errorSet, setErrorSet] = React.useState({
    patientRepresentative: {
      0: false,
      1: "",
    },
  });

  const handleValidateOnBlur = (event: React.BaseSyntheticEvent) => {
    event.persist();
    let valid = validateString(event.target.value);
    if (event.target.value === "") {
      valid = true;
    } else if (event.target.value.trim() === "") {
      valid = false;
    }
    if (valid === false) {
      setRepData(
        (prevFormState: IRepData) => ({
          ...prevFormState,
          ["error"]: true,
        }),
        (curr: IRepData) => {
          setRepresentative(curr);
        },
      );
      setError("patientRepresentative", "invalid", true);
    } else {
      setRepData(
        (prevFormState: IRepData) => ({
          ...prevFormState,
          ["error"]: false,
        }),
        (curr: IRepData) => {
          setRepresentative(curr);
        },
      );
      setError("patientRepresentative", "", false);
    }
  };

  const setError = (fieldName: string, type: string, setError: boolean) => {
    setErrorSet((prevFormState) => ({
      ...prevFormState,
      [fieldName]: {
        0: setError,
        1: setError ? addAuthFormErrorMessages[fieldName][type] : "",
      },
    }));
  };
  const handleChange = (event: React.BaseSyntheticEvent) => {
    event.persist();
    setRepData(
      (prevFormState: IRepData) => ({
        ...prevFormState,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      }),
      (curr: IRepData) => {
        setRepresentative(curr);
      },
    );
    setError("patientRepresentative", "", false);
  };

  React.useEffect(() => {
    let mounted = true;
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "value", order: "ASC" },
      filter: {},
    };
    function getPatientRelation() {
      dataProvider
        .getList("relationshipTypes", queryOption)
        .then(({ data }) => {
          if (mounted) {
            setPatientRelationList(data);
          }
        })
        .catch((error: any) => error);
    }
    getPatientRelation();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ paddingTop: 16 }}>
      <Grid item xl={12} md={12}>
        <Typography
          component="h2"
          gutterBottom
          variant="h5"
          style={{
            background: "#fafafa",
            padding: "5px 10px",
            marginBottom: "0px",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          Authorization
        </Typography>
        <Divider />
        <Grid item xl={12} md={12} style={{ paddingTop: 16 }}>
          <InputLabel style={{ fontWeight: 600 }}>
            I understand and agree to the foregoing:
          </InputLabel>
        </Grid>
        <Grid
          item
          xl={12}
          md={12}
          style={{ width: "100%", display: "inline-flex" }}
        >
          <TextField
            fullWidth
            label="Patient Name"
            name="PatientName"
            inputProps={{ readOnly: true }}
            value={`${requestDetails.firstName} ${
              requestDetails.middleName ? requestDetails.middleName : ""
            } ${requestDetails.lastName}`}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            onChange={handleChange}
            value={repData.date}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xl={12} md={12}>
          <InputLabel style={{ fontWeight: "bold" }}>
            If you are signing as the patient’s representative:
          </InputLabel>
          <Grid item>
            <TextField
              fullWidth
              label="Name"
              name="patientRepresentative"
              onChange={handleChange}
              value={repData.patientRepresentative}
              onBlur={(e) => handleValidateOnBlur(e)}
              error={errorSet.patientRepresentative[0]}
              helperText={
                errorSet.patientRepresentative[0]
                  ? errorSet.patientRepresentative[1]
                  : " "
              }

              // disabled
              // value={`${requestDetails.createdfname} ${requestDetails.createdmname} ${requestDetails.createdlastname}`}
            />

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Describe your relationship to the patient: "
                margin="dense"
                name="patientRelation"
                onBlur={(e) => {
                  if (
                    repData.patientRepresentative !== "" &&
                    e.target.value === "0"
                  ) {
                    setpatientRelationStatus(true);
                  } else {
                    setpatientRelationStatus(false);
                  }
                  if (
                    repData.patientRepresentative === "" &&
                    e.target.value !== "0"
                  ) {
                    setError("patientRepresentative", "empty", true);
                  }
                }}
                error={patientRelationStatus ? true : false}
                helperText={
                  patientRelationStatus === true
                    ? addAuthFormErrorMessages.patientRelation.empty
                    : ""
                }
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                InputLabelProps={{
                  shrink: true,
                }}
                // style={{ textTransform: "capitalize" }}
                value={repData.patientRelation}
                variant="standard"
              >
                <option key={0} value={0} hidden>
                  {translate("auth.dropdown.relation")}
                </option>
                {patientRelationList.map((option: IGenericType) => (
                  <option key={option.id} value={option.id}>
                    {option.value}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
