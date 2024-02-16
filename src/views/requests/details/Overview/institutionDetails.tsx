import * as React from "react";
import { Typography, makeStyles } from "@material-ui/core";
const useStyles = makeStyles(() => ({
  subtitle1: {
    width: "100%",
    float: "left",
    marginLeft: "5%",
  },
}));
export const InstitutionDetails = ({ institutionData }): JSX.Element => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="subtitle2" className={classes.subtitle1}>
        Institution/Provider: {institutionData["institutionName"]}
        {institutionData["institutionType"] !== "" && (
          <>
            <br />
            Type: {institutionData["institutionType"]}
          </>
        )}
        {institutionData["email"] !== "" && (
          <>
            <br />
            Email: {institutionData["email"]}
          </>
        )}
        {institutionData["phoneNumber"] !== "" && (
          <>
            <br />
            Phone Number: {institutionData["phoneNumber"]}
          </>
        )}
        {institutionData["faxNumber"] !== "" && (
          <>
            <br />
            Fax Number: {institutionData["faxNumber"]}
          </>
        )}
        {institutionData["website"] !== "" && (
          <>
            <br />
            Website: {institutionData["website"]}
          </>
        )}
        {institutionData["address"] !== "" && (
          <>
            <br />
            Address: {institutionData["address"]}
          </>
        )}
        {institutionData["city"] && (
          <>
            <br />
            City: {institutionData["city"]}
          </>
        )}
        {institutionData["stateProvince"] !== "" && (
          <>
            <br />
            State/Province: {institutionData["stateProvince"]}
          </>
        )}
        {institutionData["countryRegion"] !== "" && (
          <>
            <br />
            Country: {institutionData["countryRegion"]}
          </>
        )}
        {institutionData["zipCode"] !== "" && (
          <>
            <br />
            ZipCode: {institutionData["zipCode"]}
          </>
        )}
      </Typography>
    </>
  );
};
