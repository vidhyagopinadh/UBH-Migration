import React from "react";
import { styled } from "@mui/material/styles";
// import {
//   TextField,
//   Typography,
//   Grid,
//   FormControl,
//   IconButton,
// } from "@material-ui/core";
import { BootstrapTooltip as Tooltip } from "../../../components/Tooltip";
import MuiPhoneNumber from "material-ui-phone-number";
import { AccessTimeOutlined, Info } from "@mui/icons-material";
import CardHeader from "./../../../components/cardHeader";
import { useTranslate } from "react-admin";
import moment from "moment";
import { Base64 } from "js-base64";
import {
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: "100%",
//     "& label": {
//       marginTop: -3,
//     },
//   },
//   cardContent: {
//     backgroundColor: theme.palette.primary.light,
//   },
//   icon: {
//     cursor: "auto",
//     marginTop: "0px",
//     marginLeft: "5px",
//     width: "20px",
//     height: "20px",
//     marginBottom: "5px",
//   },
//   subtitle: {
//     width: "40%",
//     float: "left",
//     marginLeft: "5%",
//   },

//   info: {
//     cursor: "auto",
//     width: "18px",
//     height: "18px",
//     marginLeft: "3px",
//     marginBottom: "0px",
//     paddingBottom: "0px",
//     color: "grey",
//   },
// }));
const PREFIX = "ProviderData";
const classes = {
  root: `${PREFIX}-root`,
  cardContent: `${PREFIX}-cardContent`,
  icon: `${PREFIX}-icon`,
  subtitle: `${PREFIX}-subtitle`,
  info: `${PREFIX}-info`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    width: "100%",
    "& label": {
      marginTop: -3,
    },
  },
  [`& .${classes.cardContent}`]: {
    backgroundColor: theme.palette.primary.light,
  },
  [`& .${classes.icon}`]: {
    cursor: "auto",
    marginTop: "0px",
    marginLeft: "5px",
    width: "20px",
    height: "20px",
    marginBottom: "5px",
  },
  [`& .${classes.subtitle}`]: {
    width: "40%",
    float: "left",
    marginLeft: "5%",
  },
  [`& .${classes.info}`]: {
    cursor: "auto",
    width: "18px",
    height: "18px",
    marginLeft: "3px",
    marginBottom: "0px",
    paddingBottom: "0px",
    color: "grey",
  },
}));
function ProviderData({ submittedProviderData }): JSX.Element {
  // const classes = useStyles();
  const translate = useTranslate();
  return (
    <>
      <CardHeader>
        <div style={{ display: "flex" }}>
          <Typography variant="h5" style={{ fontSize: 16, fontWeight: 500 }}>
            <b>Provider Information:</b>
            <IconButton disabled style={{ margin: "0px", padding: "0px" }}>
              <AccessTimeOutlined
                className={classes.icon}
                style={{
                  color: "orange",
                }}
              />
            </IconButton>{" "}
            Request submitted for research and verification{" "}
            {moment(submittedProviderData.timeOfSubmission).fromNow()}
            <Tooltip
              arrow
              placement="top"
              title={translate("tooltip.request.provider_data")}
            >
              <Info className={classes.info} />
            </Tooltip>
          </Typography>
        </div>
      </CardHeader>
      <Grid
        alignItems="flex-end"
        container
        spacing={1}
        style={{ display: "inline-flex", width: "100%" }}
      >
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="Name of institution/provider"
            margin="dense"
            name="companyName"
            InputProps={{ readOnly: true }}
            value={submittedProviderData.companyName}
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="Medical Group of institution/provider"
            margin="dense"
            name="companyType"
            InputProps={{ readOnly: true }}
            value={submittedProviderData.companyType}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="Email Address"
            margin="dense"
            name="workEmail"
            InputProps={{ readOnly: true }}
            value={submittedProviderData.workEmail}
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="Website Address"
            margin="dense"
            name="website"
            InputProps={{ readOnly: true }}
            value={submittedProviderData.website}
          ></TextField>
        </Grid>

        <Grid item md={4} xs={12}>
          <MuiPhoneNumber
            defaultCountry={"us"}
            onlyCountries={["us"]}
            disableAreaCodes={true}
            fullWidth
            countryCodeEditable={false}
            InputProps={{ readOnly: true }}
            margin="dense"
            label="Phone Number"
            value={submittedProviderData.workPhone}
            name="workPhone"
            onChange={() => {
              //
            }}
            variant="standard"
          />
        </Grid>

        <Grid item md={4} xs={12}>
          <MuiPhoneNumber
            defaultCountry={"us"}
            onlyCountries={["us"]}
            disableAreaCodes={true}
            fullWidth
            countryCodeEditable={false}
            InputProps={{ readOnly: true }}
            margin="dense"
            label="Fax Number"
            value={submittedProviderData.anotherPhone}
            name="anotherPhone"
            onChange={() => {
              //
            }}
            variant="standard"
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="Address"
            margin="dense"
            InputProps={{ readOnly: true }}
            name="addressHouseBuilding"
            value={submittedProviderData.addressHouseBuilding}
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="City"
            margin="dense"
            name="addressTownCity"
            InputProps={{ readOnly: true }}
            value={submittedProviderData.addressTownCity}
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="Country"
            margin="dense"
            InputProps={{ readOnly: true }}
            name="addressCountryRegion"
            value={submittedProviderData.addressCountryRegion}
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="State/Province"
            margin="dense"
            InputProps={{ readOnly: true }}
            name="addressStateProvince"
            value={submittedProviderData.addressStateProvince}
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="Zipcode"
            margin="dense"
            InputProps={{ readOnly: true }}
            name="addressZipPostalCode"
            value={submittedProviderData.addressZipPostalCode}
          ></TextField>
        </Grid>
        <Grid item md={12} xs={12}>
          <>
            {" "}
            <Typography variant="h5" style={{ fontSize: 14 }} gutterBottom>
              Additional details of the institution/ provider
            </Typography>
            <FormControl fullWidth>
              <TextField
                name="companyDescription"
                multiline
                rows={4}
                value={Base64.atob(submittedProviderData.companyDescription)}
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </FormControl>
          </>
        </Grid>
      </Grid>
    </>
  );
}

export default ProviderData;
