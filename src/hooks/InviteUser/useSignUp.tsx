import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateSentance,
  validateString,
  validateWebAddress,
  validateZipCode,
} from "../../utils/validator";
import { registerErrorMessages } from "../../utils/messages/errorMessages";

import type { IRegisterError, ISignupDetails, ISignupProps } from "../../types";
import {
  CheckUserExistQuery,
  RegisterUserSignupQuery,
} from "../../service/inviteQueries";
const useSignUp = ({ enrollToken }: ISignupProps) => {
  const [termsChecked, setTermsChecked] = useState(true);
  const [openBase, setOpenBase] = useState(false);
  const [openSubmitBase, setOpenSubmitBase] = useState(false);
  const [linkDisable, setLinkDisable] = useState(false);
  const [openDisableBase, setOpenDisableBase] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openErrorBase, setOpenErrorBase] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [terms, setTerms] = useState({
    privacyPolicy: {
      status: false,
    },
    termsUbh: {
      status: false,
    },
  });
  const [formvalues, setFormValues] = useState<ISignupDetails>({
    token: enrollToken + "",
    fName: "",
    lName: "",
    mName: "",
    emailAddress: "",
    orgName: "",
    phoneNumber: "",
    categoryId: 0,
    roleName: "",
    password: "",
    orgEmail: "",
    medicalGroup: 0,
    orgFax: "",
    orgPhone: "",
    orgWebsite: "",
    orgAddress: "",
    city: "",
    stateId: 0,
    countryId: 0,
    orgZipcode: "",
    providerPartyId: null,
  });
  const [registerError, setRegisterError] = useState<IRegisterError>({
    fName: {
      status: false,
      message: "",
    },
    mName: {
      status: false,
      message: "",
    },
    lName: {
      status: false,
      message: "",
    },
    emailAddress: {
      status: false,
      message: "",
    },
    phoneNumber: {
      status: false,
      message: "",
    },
    password: {
      status: false,
      message: "",
    },
    confirmPassword: {
      status: false,
      message: "",
    },
    orgName: {
      status: false,
      message: "",
    },
    orgWebsite: {
      status: false,
      message: "",
    },
    orgEmail: {
      status: false,
      message: "",
    },
    orgPhone: {
      status: false,
      message: "",
    },
    orgFax: {
      status: false,
      message: "",
    },
    orgAddress: {
      status: false,
      message: "",
    },
    city: {
      status: false,
      message: "",
    },
    orgZipcode: {
      status: false,
      message: "",
    },
  });
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      "& .MuiTypography-root": {
        fontFamily: "'Poppins', sans-serif!important",
      },
    },
    loader: {
      height: "8px",
      backgroundColor: "#2AAA8A",
      marginTop: "0px",
    },
    heading: {
      color: "#09143C",
      fontStyle: "bold",
      textAlign: "center",
      fontFamily: "'Poppins', sans-serif!important",
    },
    subheading: {
      fontFamily: "'Poppins', sans-serif!important",
      "& .MuiInputLabel-root": {
        fontFamily: "Poppins, sans-serif",
      },
      "& .MuiTypography-root": {
        fontFamily: "'Poppins', sans-serif!important",
      },
      "& .MuiOutlinedInput-root": {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "normal",
      },
    },
    info: {
      cursor: "auto",
      paddingLeft: "1%",
      color: "grey",
      fontSize: "150%",
    },
    terms: {
      fontSize: 14,
      fontWeight: 500,
      color: "grey",
    },

    container: {
      backgroundColor: "white",
      borderRadius: theme.spacing(2),
      position: "absolute",
      top: "105px",
      left: "15%",
      width: "70%",
      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      [theme.breakpoints.down("sm")]: {
        left: "7%",
        right: "7%",
        width: "90%",
      },
    },
    media: {
      height: "870px",
      width: "100%",
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "absolute",
    },
    rightGridItems: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      marginTop: "5%",
      fontFamily: "'Poppins', sans-serif!important",
    },
    rightGridItemsImage: {
      width: "85px",
      height: "75px",
    },
    gridItemsText: {
      padding: "5%",
      textAlign: "center",
      fontFamily: "'Poppins', sans-serif!important",
    },
    gridItem: {
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontFamily: "'Poppins', sans-serif!important",
    },
    leftGridContainer: {
      paddingLeft: "20%",
      paddingRight: "20%",
      [theme.breakpoints.down("sm")]: {
        paddingLeft: "10%",
        paddingRight: "10%",
      },
    },
    leftItem: {
      backgroundColor: "white",
    },
    rightItem: {
      position: "relative",
      backgroundColor: "mintcream",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
    button: {
      paddingBottom: "10%",
    },
    checkboxLabel: {
      fontFamily: "Poppins, sans-serif",
    },
  }));
  const mandatoryFilled = () => {
    return (
      formvalues.emailAddress === null ||
      formvalues.emailAddress === "" ||
      formvalues.fName === null ||
      formvalues.fName === "" ||
      formvalues.lName === null ||
      formvalues.lName === "" ||
      formvalues.password === null ||
      formvalues.password === "" ||
      ((formvalues.orgName === null ||
        formvalues.orgName === "" ||
        formvalues.orgEmail === null ||
        formvalues.orgEmail === "") &&
        formvalues.categoryId === 3)
    );
  };
  const handleConfirm = () => {
    let isTermCheck = true;
    setTermsChecked(true);
    Object.entries(terms).forEach((indv) => {
      if (!indv[1].status) {
        setTermsChecked(false);
        isTermCheck = false;
      }
    });
    if (formvalues.orgEmail === formvalues.emailAddress) {
      setError(
        "emailAddress",
        registerErrorMessages["emailAddress"]["sameAsOrg"],
        true,
      );
    }
    if (formvalues.emailAddress === null || formvalues.emailAddress === "") {
      setError(
        "emailAddress",
        registerErrorMessages["emailAddress"]["empty"],
        true,
      );
    }
    if (formvalues.fName === null || formvalues.fName === "") {
      setError("fName", registerErrorMessages["fName"]["empty"], true);
    }
    if (formvalues.lName === null || formvalues.lName === "") {
      setError("lName", registerErrorMessages["lName"]["empty"], true);
    }
    if (formvalues.password === null || formvalues.password === "") {
      setError("password", registerErrorMessages["password"]["empty"], true);
    }
    if (
      (formvalues.orgName === null || formvalues.orgName === "") &&
      formvalues.categoryId === 3
    ) {
      setError("orgName", registerErrorMessages["orgName"]["empty"], true);
    }
    if (
      (formvalues.orgEmail === null || formvalues.orgEmail === "") &&
      formvalues.categoryId === 3
    ) {
      setError("orgEmail", registerErrorMessages["orgEmail"]["empty"], true);
    }
    if (confirmPassword === "" && formvalues.password !== "") {
      setError(
        "confirmPassword",
        registerErrorMessages["confirmPassword"]["invalid"],
        true,
      );
    }

    let isRegisterValid = true;
    Object.entries(registerError).forEach((indv) => {
      if (indv[1].status) {
        isRegisterValid = false;
      }
    });
    if (
      isRegisterValid &&
      isTermCheck &&
      !mandatoryFilled() &&
      formvalues.orgEmail !== formvalues.emailAddress
    ) {
      setOpenBase(true);
    }
  };
  const handleSubmit = () => {
    setOpenBase(false);
    setIsLoading(true);
    if (formvalues.phoneNumber === "+1") {
      formvalues.phoneNumber = null;
    }
    if (formvalues.orgPhone === "+1") {
      formvalues.orgPhone = null;
    }
    if (formvalues.orgFax === "+1") {
      formvalues.orgFax = null;
    }
    RegisterUserSignupQuery(formvalues).then((response) => {
      if (response) {
        setIsLoading(false);
        setOpenSubmitBase(true);
      } else {
        setIsLoading(false);
        setOpenErrorBase(true);
      }
    });
  };
  const handleChangePhone = (value) => {
    formvalues.phoneNumber = value;
  };
  const handleChangeOrgPhone = (value) => {
    formvalues.orgPhone = value;
  };
  const handleChangeFax = (value) => {
    formvalues.orgFax = value;
  };
  const handleTermsChange = (event) => {
    setTerms((prevFormState) => ({
      ...prevFormState,
      [event.target.name]: { status: event.target.checked },
    }));
  };
  const handleChange = (event: React.BaseSyntheticEvent) => {
    setFormValues((prevFormState) => ({
      ...prevFormState,
      [event.target.name]: event.target.value,
    }));
  };
  const checkPassword = () => {
    if (formvalues.password !== confirmPassword) {
      setError(
        "confirmPassword",
        registerErrorMessages["confirmPassword"]["invalid"],
        true,
      );
    } else {
      setError("confirmPassword", "", false);
    }
  };
  const handleValidateOnBlur = (event: React.BaseSyntheticEvent) => {
    event.persist();
    let validationStatus: boolean;
    if (event.target.type === "tel") {
      if (event.target.value === "+1") {
        validationStatus = true;
        setError(event.target.name, "", false);
      } else {
        validationStatus = false;
      }
    } else if (event.target.type !== "checkbox") {
      validationStatus = !event.target.value;
    }
    if (!validationStatus) {
      switch (event.target.name) {
        case "phoneNumber":
        case "orgPhone":
        case "orgFax": {
          const valid = validatePhone(event.target.value);
          setError(
            event.target.name,
            registerErrorMessages[event.target.name]["invalid"],
            !valid,
          );
          break;
        }
        case "orgEmail": {
          const valid = validateEmail(event.target.value);
          setError(
            event.target.name,
            registerErrorMessages[event.target.name]["invalid"],
            !valid,
          );
          break;
        }
        case "emailAddress": {
          const valid = validateEmail(event.target.value);
          setError(
            event.target.name,
            registerErrorMessages[event.target.name]["invalid"],
            !valid,
          );
          if (valid) {
            setDisableSubmit(true);
            CheckUserExistQuery(formvalues.emailAddress).then((response) => {
              setDisableSubmit(false);
              if (response) {
                setError(
                  event.target.name,
                  registerErrorMessages[event.target.name]["alreadyExists"],
                  true,
                );
              }
            });
          }
          break;
        }
        case "fName":
        case "mName":
        case "lName": {
          const valid = validateString(event.target.value);
          setError(
            event.target.name,
            registerErrorMessages[event.target.name]["invalid"],
            !valid,
          );
          break;
        }
        case "orgAddress":
        case "city":
        case "orgName": {
          const valid = validateSentance(event.target.value);
          setError(
            event.target.name,
            registerErrorMessages[event.target.name]["invalid"],
            !valid,
          );
          break;
        }
        case "orgWebsite": {
          const valid = validateWebAddress(event.target.value);
          setError(
            event.target.name,
            registerErrorMessages[event.target.name]["invalid"],
            !valid,
          );
          break;
        }
        case "orgZipcode": {
          const valid = validateZipCode(event.target.value);
          setError(
            event.target.name,
            registerErrorMessages[event.target.name]["invalid"],
            !valid,
          );
          break;
        }
        case "password": {
          const valid = validatePassword(event.target.value);
          setError(
            event.target.name,
            registerErrorMessages[event.target.name]["invalid"],
            !valid,
          );
          break;
        }
        default: {
          setError(event.target.name, "", false);
          break;
        }
      }
    } else {
      if (
        event.target.name === "fName" ||
        event.target.name === "lName" ||
        event.target.name === "emailAddress" ||
        event.target.name === "password" ||
        event.target.name === "orgName" ||
        event.target.name === "orgEmail"
      ) {
        setError(
          event.target.name,
          registerErrorMessages[event.target.name]["empty"],
          true,
        );
      } else {
        setError(event.target.name, "", false);
      }
    }
  };

  const setError = (fieldName: string, type: string, setError: boolean) => {
    setRegisterError((prevFormState) => ({
      ...prevFormState,
      [fieldName]: {
        status: setError,
        message: setError ? type : "",
      },
    }));
  };
  return {
    useStyles,
    handleValidateOnBlur,
    formvalues,
    setFormValues,
    registerError,
    handleSubmit,
    setLinkDisable,
    setOpenDisableBase,
    openDisableBase,
    openSubmitBase,
    openBase,
    setOpenBase,
    linkDisable,
    handleChange,
    handleChangeOrgPhone,
    handleChangeFax,
    handleConfirm,
    handleChangePhone,
    setConfirmPassword,
    checkPassword,
    handleTermsChange,
    termsChecked,
    setOpenErrorBase,
    openErrorBase,
    isLoading,
    disableSubmit,
  };
};

export default useSignUp;
