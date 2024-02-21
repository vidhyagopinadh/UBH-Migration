import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import "typeface-poppins";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CardMedia,
  Grid,
  CircularProgress,
  LinearProgress,
  InputAdornment,
} from "@material-ui/core";
import { BootstrapTooltip as Tooltip } from "../components/Tooltip";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MuiPhoneNumber from "material-ui-phone-number";
import logo from "../images/logo.png";
import signUpImage from "../images/signUp.jpg";
import { useTranslate } from "react-admin";
import type { IGenericType, ISignupProps } from "../types";
import {
  EnrollTokenQuery,
  GetCountryListQuery,
  GetMedicalGroupQuery,
  GetStateListQuery,
} from "../service/inviteQueries";
import { AppBar, Autocomplete, Toolbar } from "@mui/material";
import { InputLabel } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Info } from "@material-ui/icons";
import BaseModal from "../components/baseModal";
import SuccessModal from "../components/successModal";
import { SIGNUP_CONSTANTS } from "../utils/messages/signupConstants";
import useSignUp from "../hooks/InviteUser/useSignUp";
import { useHistory } from "react-router";
import type {
  CountryList,
  StateList,
} from "../__generated__/typescript-operations_all";
const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#09143C",
        },
      },
    },
  },
});
export default function SignUp({ enrollToken }: ISignupProps): JSX.Element {
  const {
    useStyles,
    handleValidateOnBlur,
    formvalues,
    setFormValues,
    registerError,
    handleSubmit,
    setLinkDisable,
    setOpenDisableBase,
    openDisableBase,
    openBase,
    setOpenErrorBase,
    openErrorBase,
    setOpenBase,
    linkDisable,
    handleChange,
    handleChangeOrgPhone,
    handleChangeFax,
    handleConfirm,
    handleChangePhone,
    setConfirmPassword,
    checkPassword,
    openSubmitBase,
    handleTermsChange,
    termsChecked,
    isLoading,
    disableSubmit,
  } = useSignUp({ enrollToken });
  const classes = useStyles();
  const translate = useTranslate();
  const history = useHistory();
  const [showHint, setShowHint] = React.useState(false);
  const [stateList, setStateList] = React.useState<StateList[]>([]);
  const [countryList, setCountryList] = React.useState<CountryList[]>([]);
  const [categoryType, setCategoryType] = React.useState(0);
  const [sourceNature, setSourceNature] = React.useState({
    id: 0,
    value: translate("resources.requests.dropdown.companyType"),
  });
  const [sourcesNatureList, setSourcesNatureList] = React.useState<
    IGenericType[]
  >([]);
  const [orgDetails, setOrgDetails] = React.useState({
    orgName: "",
    orgEmail: "",
  });
  const [expand, setExpand] = React.useState(false);
  React.useEffect(() => {
    EnrollTokenQuery(enrollToken + "").then((response) => {
      setCategoryType(response.serviceCategoryTypeId);
      if (response.inviteStatusId >= 3 || response.userTokenStatus) {
        setLinkDisable(true);
        setOpenDisableBase(true);
      } else {
        setOrgDetails({
          orgName: response.orgName,
          orgEmail: response.orgEmail,
        });
        if (response) {
          setFormValues((prevFormState) => ({
            ...prevFormState,
            fName: response.firstName,
            lName: response.lastName,
            mName: response.middleName,
            emailAddress: response.email,
            orgName: response.orgName,
            phoneNumber: response.phone,
            categoryId: response.serviceCategoryTypeId,
            roleName: response.userGroup,
            orgEmail: response.orgEmail,
            orgFax: response.orgFax,
            orgPhone: response.orgPhone,
            orgWebsite: response.orgWebsite,
            orgAddress: response.orgAddress,
            // medicalGroup:response.medicalGroup,
            city: response.orgCity,
            stateId: response.orgStateId,
            countryId: response.orgCountryId,
            orgZipcode: response.orgZipcode,
            providerPartyId: response.providerPartyId,
          }));
        }
      }
    });
    GetCountryListQuery().then((response) => {
      setCountryList(response);
    });
    GetStateListQuery().then((response) => {
      setStateList(response);
    });
    GetMedicalGroupQuery().then((response) => {
      setSourcesNatureList(response);
    });
  }, []);
  return (
    <>
      <div>
        <style>
          {`
      .RaLayout-content-4 {
        padding:0;
      }
    `}
        </style>
        {openDisableBase && (
          <BaseModal
            open={openDisableBase}
            confirmAction={() => {
              setOpenDisableBase(false);
              history.push("/login");
            }}
            onClose={() => {
              setOpenDisableBase(false);
              history.push("/login");
            }}
            title={translate("resources.register.disableTitle")}
            content={translate("resources.register.disableMessage")}
            successButtonName="Ok"
            type="logout"
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
            title={translate("resources.register.errorTitle")}
            content={translate("resources.register.errorMessage")}
            closeButtonName="Close"
            type="requestError"
          />
        )}
        <ThemeProvider theme={theme}>
          {openSubmitBase && (
            <SuccessModal
              open={openSubmitBase}
              title={translate("resources.register.successTitle")}
              confirmAction={() => {
                history.push("/login");
              }}
              onClose={() => {
                history.push("/login");
              }}
              message={translate("resources.register.successMessage")}
            />
          )}

          {openBase && (
            <BaseModal
              open={openBase}
              confirmAction={handleSubmit}
              onClose={() => {
                setOpenBase(false);
              }}
              title={translate("resources.register.confirmTitle")}
              content={translate("resources.register.confirmMessage")}
              successButtonName="Yes"
            />
          )}
          <Box sx={{ flexGrow: 1, padding: 0, margin: 0, border: 0 }}>
            <AppBar elevation={0} position="fixed">
              <Toolbar variant="dense">
                <img src={logo} />
              </Toolbar>
            </AppBar>
          </Box>
          {isLoading && (
            <div
              style={{
                position: "fixed",
                zIndex: 999,
                width: "100%",
                height: "8px",
              }}
            >
              <LinearProgress className={classes.loader} />
            </div>
          )}
          <Grid
            container
            spacing={0}
            style={{ filter: linkDisable ? "blur(2px)" : "" }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              className={`${classes.root}${classes.gridItem} ${classes.leftItem}`}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {" "}
                <div className={classes.leftGridContainer}>
                  {" "}
                  <Typography
                    component="h1"
                    variant="h3"
                    className={classes.heading}
                    style={{
                      paddingTop: "7%",
                      fontWeight: "bold",
                      fontSize: "210%",
                    }}
                  >
                    {translate("resources.register.registerTitle")}
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.subheading}
                    style={{
                      textAlign: "center",
                      padding: "2%",
                    }}
                  >
                    {categoryType === 3
                      ? translate("resources.register.registerSubTitleMra")
                      : translate("resources.register.registerSubTitle")}
                  </Typography>
                  <Grid container spacing={1}>
                    {categoryType === 3 && (
                      <Grid item xs={12} style={{ display: "flex" }}>
                        <Accordion
                          expanded={expand}
                          onChange={() => {
                            setExpand(!expand);
                          }}
                          style={{ width: "100%", marginBottom: "20px" }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                          >
                            <Typography
                              variant="h5"
                              style={{ fontSize: 16, fontWeight: 600 }}
                              gutterBottom
                              className={classes.subheading}
                            >
                              {translate("resources.register.orgTitle")}
                            </Typography>
                            <Tooltip
                              arrow
                              placement="top"
                              title={translate("tooltip.register.organization")}
                            >
                              <Info className={classes.info} />
                            </Tooltip>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid
                              alignItems="flex-end"
                              container
                              spacing={1}
                              style={{ display: "inline-flex", width: "100%" }}
                            >
                              <Grid item xs={12}>
                                <TextField
                                  name="orgName"
                                  required
                                  fullWidth
                                  inputProps={{
                                    readOnly: orgDetails.orgName ? true : false,
                                  }}
                                  label="Name of Institution/Provider"
                                  value={formvalues.orgName}
                                  onChange={(event) => handleChange(event)}
                                  onBlur={(e) => {
                                    handleValidateOnBlur(e);
                                  }}
                                  error={registerError.orgName.status}
                                  helperText={
                                    registerError.orgName.status
                                      ? registerError.orgName.message
                                      : " "
                                  }
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Autocomplete
                                  id="medicalGroup"
                                  options={sourcesNatureList}
                                  autoHighlight
                                  disableClearable
                                  value={sourceNature}
                                  style={{
                                    fontSize: "14px",
                                    // marginRight: "30px",
                                  }}
                                  getOptionLabel={(option) => option.value}
                                  onChange={(e, newValue) => {
                                    if (newValue) {
                                      const { id, value } = newValue;
                                      setSourceNature({
                                        id: Number(id),
                                        value: value,
                                      });
                                      setFormValues((prevFormState) => ({
                                        ...prevFormState,
                                        ["medicalGroup"]: Number(id),
                                      }));
                                    }
                                  }}
                                  renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                      {option.value}
                                    </Box>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      margin="dense"
                                      name="medicalGroup"
                                      helperText={" "}
                                      style={{
                                        fontSize: "14px",
                                        color: "grey",
                                      }}
                                      value={formvalues.medicalGroup}
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  name="orgWebsite"
                                  fullWidth
                                  id="orgWebsite"
                                  label="Website Address"
                                  value={formvalues.orgWebsite}
                                  onChange={(event) => handleChange(event)}
                                  onBlur={(e) => {
                                    handleValidateOnBlur(e);
                                  }}
                                  error={registerError.orgWebsite.status}
                                  helperText={
                                    registerError.orgWebsite.status
                                      ? registerError.orgWebsite.message
                                      : " "
                                  }
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  name="orgEmail"
                                  fullWidth
                                  id="orgEmail"
                                  required
                                  label="Email Address"
                                  inputProps={{
                                    readOnly: orgDetails.orgEmail
                                      ? true
                                      : false,
                                  }}
                                  value={formvalues.orgEmail}
                                  onChange={(event) => handleChange(event)}
                                  onBlur={(e) => {
                                    handleValidateOnBlur(e);
                                  }}
                                  error={registerError.orgEmail.status}
                                  helperText={
                                    registerError.orgEmail.status
                                      ? registerError.orgEmail.message
                                      : " "
                                  }
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <MuiPhoneNumber
                                  defaultCountry={"us"}
                                  onlyCountries={["us"]}
                                  disableAreaCodes={true}
                                  fullWidth
                                  margin="dense"
                                  label="Phone Number"
                                  countryCodeEditable={false}
                                  name="orgPhone"
                                  value={formvalues.orgPhone}
                                  onChange={handleChangeOrgPhone}
                                  variant="outlined"
                                  onBlur={(e) => {
                                    handleValidateOnBlur(e);
                                  }}
                                  error={registerError.orgPhone.status}
                                  helperText={
                                    registerError.orgPhone.status
                                      ? registerError.orgPhone.message
                                      : " "
                                  }
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <MuiPhoneNumber
                                  defaultCountry={"us"}
                                  onlyCountries={["us"]}
                                  disableAreaCodes={true}
                                  fullWidth
                                  margin="dense"
                                  label="Fax Number"
                                  name="orgFax"
                                  countryCodeEditable={false}
                                  value={formvalues.orgFax}
                                  onChange={handleChangeFax}
                                  variant="outlined"
                                  onBlur={(e) => {
                                    handleValidateOnBlur(e);
                                  }}
                                  error={registerError.orgFax.status}
                                  helperText={
                                    registerError.orgFax.status
                                      ? registerError.orgFax.message
                                      : " "
                                  }
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  name="orgAddress"
                                  fullWidth
                                  id="orgAddress"
                                  label="Address"
                                  value={formvalues.orgAddress}
                                  onChange={(event) => handleChange(event)}
                                  onBlur={(e) => {
                                    handleValidateOnBlur(e);
                                  }}
                                  error={registerError.orgAddress.status}
                                  helperText={
                                    registerError.orgAddress.status
                                      ? registerError.orgAddress.message
                                      : " "
                                  }
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  name="city"
                                  fullWidth
                                  id="city"
                                  label="City"
                                  value={formvalues.city}
                                  onChange={(event) => handleChange(event)}
                                  onBlur={(e) => {
                                    handleValidateOnBlur(e);
                                  }}
                                  error={registerError.city.status}
                                  helperText={
                                    registerError.city.status
                                      ? registerError.city.message
                                      : " "
                                  }
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="State"
                                  margin="dense"
                                  name="stateId"
                                  select
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  SelectProps={{ native: true }}
                                  value={formvalues.stateId}
                                  onChange={(event) => handleChange(event)}
                                  helperText={" "}
                                >
                                  <option key={0} value="0" hidden>
                                    {translate(
                                      "resources.patients.dropdown.state",
                                    )}
                                  </option>
                                  {stateList.map((option) => (
                                    <option key={option.id} value={option.id}>
                                      {option.value}
                                    </option>
                                  ))}
                                </TextField>
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Country"
                                  margin="dense"
                                  name="countryId"
                                  select
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  SelectProps={{ native: true }}
                                  value={formvalues.countryId}
                                  onChange={(event) => handleChange(event)}
                                  helperText={" "}
                                >
                                  <option key={0} value="0" hidden>
                                    {translate(
                                      "resources.patients.dropdown.country",
                                    )}
                                  </option>
                                  {countryList.map((option) => (
                                    <option key={option.id} value={option.id}>
                                      {option.value}
                                    </option>
                                  ))}
                                </TextField>
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  name="orgZipcode"
                                  fullWidth
                                  id="orgZipcode"
                                  label="Zipcode"
                                  value={formvalues.orgZipcode}
                                  onChange={(event) => handleChange(event)}
                                  onBlur={(e) => {
                                    handleValidateOnBlur(e);
                                  }}
                                  inputProps={{
                                    maxLength: 5,
                                  }}
                                  error={registerError.orgZipcode.status}
                                  helperText={
                                    registerError.orgZipcode.status
                                      ? registerError.orgZipcode.message
                                      : " "
                                  }
                                />
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <TextField
                        name="fName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        value={formvalues.fName}
                        onChange={(event) => handleChange(event)}
                        onBlur={(e) => {
                          handleValidateOnBlur(e);
                        }}
                        error={registerError.fName.status}
                        helperText={
                          registerError.fName.status
                            ? registerError.fName.message
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="mName"
                        fullWidth
                        id="middleName"
                        label="Middle Name"
                        value={formvalues.mName}
                        onChange={(event) => handleChange(event)}
                        onBlur={(e) => {
                          handleValidateOnBlur(e);
                        }}
                        error={registerError.mName.status}
                        helperText={
                          registerError.mName.status
                            ? registerError.mName.message
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        value={formvalues.lName}
                        onChange={(event) => handleChange(event)}
                        name="lName"
                        onBlur={(e) => {
                          handleValidateOnBlur(e);
                        }}
                        error={registerError.lName.status}
                        helperText={
                          registerError.lName.status
                            ? registerError.lName.message
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="emailAddress"
                        value={formvalues.emailAddress}
                        onChange={(event) => handleChange(event)}
                        onBlur={(e) => {
                          handleValidateOnBlur(e);
                        }}
                        error={registerError.emailAddress.status}
                        helperText={
                          registerError.emailAddress.status
                            ? registerError.emailAddress.message
                            : " "
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {disableSubmit && <CircularProgress size={15} />}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MuiPhoneNumber
                        defaultCountry={"us"}
                        onlyCountries={["us"]}
                        disableAreaCodes={true}
                        fullWidth
                        margin="dense"
                        label="Phone Number"
                        name="phoneNumber"
                        countryCodeEditable={false}
                        value={formvalues.phoneNumber}
                        onChange={handleChangePhone}
                        variant="outlined"
                        onBlur={(e) => {
                          handleValidateOnBlur(e);
                        }}
                        error={registerError.phoneNumber.status}
                        helperText={
                          registerError.phoneNumber.status
                            ? registerError.phoneNumber.message
                            : " "
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        value={formvalues.password}
                        onChange={(event) => handleChange(event)}
                        id="password"
                        onBlur={(e) => {
                          setShowHint(false);
                          handleValidateOnBlur(e);
                        }}
                        onClick={() => {
                          setShowHint(true);
                        }}
                        error={registerError.password.status}
                        helperText={
                          registerError.password.status
                            ? registerError.password.message
                            : " "
                        }
                      />
                      {showHint && !registerError.password.status && (
                        <InputLabel style={{ lineHeight: "20px" }}>
                          {translate("resources.register.passwordRule")}
                        </InputLabel>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                        }}
                        onBlur={checkPassword}
                        id="confirmPassword"
                        error={registerError.confirmPassword.status}
                        helperText={
                          registerError.confirmPassword.status
                            ? registerError.confirmPassword.message
                            : " "
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="privacyPolicy"
                            name="privacyPolicy"
                            onChange={handleTermsChange}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body1" className={classes.terms}>
                            I agree to this{" "}
                            <a
                              target="_blank"
                              href="https://www.unblock.health/privacy-policy/"
                              rel="noreferrer"
                            >
                              Privacy Policy
                            </a>
                          </Typography>
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="termsUbh"
                            name="termsUbh"
                            onChange={handleTermsChange}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body1" className={classes.terms}>
                            I agree to the Unblock Health{" "}
                            <a
                              target="_blank"
                              href="https://www.unblock.health/terms-and-conditions/"
                              rel="noreferrer"
                            >
                              Terms of Service
                            </a>
                          </Typography>
                        }
                      />
                    </Grid>
                  </Grid>
                  <Typography style={{ color: "#bf0000" }}>
                    {!termsChecked
                      ? translate("resources.register.termsError")
                      : " "}
                  </Typography>
                  <Button
                    type="submit"
                    fullWidth
                    onClick={() => {
                      setExpand(true);
                      handleConfirm();
                    }}
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    style={{
                      backgroundColor: "#2AAA8A",
                      fontSize: "16px",
                      color: "#ffffff",
                    }}
                    disabled={isLoading || disableSubmit}
                    startIcon={
                      isLoading ? (
                        <CircularProgress color="secondary" size={20} />
                      ) : (
                        ""
                      )
                    }
                  >
                    Create My Account
                  </Button>
                </div>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              className={`${classes.root}${classes.gridItem} ${classes.rightItem}`}
            >
              <Grid xs={12} sm={6} md={6} lg={6}>
                <CardMedia
                  image={signUpImage}
                  title=""
                  className={classes.media}
                >
                  <Typography
                    component="h1"
                    variant="h3"
                    className={classes.heading}
                    style={{
                      paddingTop: "5%",
                      paddingBottom: "2%",
                      fontWeight: "bold",
                      fontSize: "240%",
                      fontFamily: "Poppins, sans-serif!important ",
                    }}
                  >
                    {translate("resources.register.ubhTitle")}
                  </Typography>
                  <div className={classes.container}>
                    <Grid
                      container
                      spacing={0}
                      justify="center"
                      alignItems="center"
                    >
                      {SIGNUP_CONSTANTS.map((eachValue, key) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          key={key}
                          className={classes.rightGridItems}
                        >
                          <CardMedia
                            image={eachValue.icon}
                            title=""
                            className={classes.rightGridItemsImage}
                          />
                          <Typography
                            component="h1"
                            variant="h5"
                            className={classes.gridItemsText}
                            style={{ fontSize: "1.3rem" }}
                          >
                            {eachValue.text}
                          </Typography>
                        </Grid>
                      ))}
                      <div className={classes.button}>
                        <Button
                          className={classes.subheading}
                          size="large"
                          style={{
                            textTransform: "none",
                            borderRadius: theme.spacing(1),
                            width: "100%",
                          }}
                          variant="outlined"
                          target="_blank"
                          href="https://www.unblock.health//"
                        >
                          Learn more
                        </Button>
                      </div>
                    </Grid>
                  </div>
                </CardMedia>
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    </>
  );
}
