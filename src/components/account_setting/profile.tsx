import React, { useEffect, useState } from "react";
import type { BaseSyntheticEvent } from "react";
// import {
//   TextField,
//   Typography,
//   Grid,
//   CardContent,
//   Container,
//   Card,
//   ListItem,
//   IconButton,
//   Button,
//   CircularProgress,
//   Box,
//   Chip,
// } from "@material-ui/core";
import CardHeader from "../cardHeader";
import MuiPhoneNumber from "material-ui-phone-number";
import { useMutation } from "@apollo/react-hooks";
// import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { BootstrapTooltip as Tooltip } from "../Tooltip";
// import {
//   Edit,
//   EditTwoTone,
//   Visibility,
//   VisibilityOff,
//   Warning,
// } from "@material-ui/icons";
import { useDataProvider, useTranslate } from "react-admin";
import type {
  AppState,
  IEmailVerify,
  IInitialType,
  IProfileError,
} from "../../types";
import DatePickerWithMonthAndYearDropdown from "../datePicker";
import { tommddyyyy } from "../../utils/dateFormator";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import blank from "../../images/blank.png";
import verifiedBadge from "../../images/verified-badge.png";
import useMedicalrequestGetFunctions from "../../hooks/MedicalRecord/useMedicalRequestGetFunctions";
import {
  ADD_PROFILE_FORM_INIT,
  PROFILE_ERROR_INIT,
} from "../../utils/messages/initializeConstants";
import moment from "moment";
import {
  formatSSN,
  validateDate,
  validateEmail,
  validatePhone,
  validateSentance,
  validateSsn,
  validateString,
  validateZipCode,
} from "../../utils/validator";
import {
  ERROR_MESSAGE_KEY,
  addNewPatientErrorMessages,
} from "../../utils/messages/errorMessages";
import type {
  ModifyPatientInfoInput,
  SendEmailToUnverifiedUserMutation,
  SendEmailToUnverifiedUserMutationVariables,
  // UserDemographicsV1Input,
} from "../../__generated__/typescript-operations_all";
import { getImagesByFileUploadId } from "../../service/restConfig";
import modifyPatientInfoQuery from "../../queries/modifyPatientInfo/modifyPatientInfoQuery";
import { useDispatch, useSelector } from "react-redux";
import BaseModal from "../baseModal";
import { userInfoAction } from "../../configuration/actions/userInfoActions";
import secureLocalStorage from "react-secure-storage";
import ImageEditForm from "./ImageEditForm";
import { BadgeOutlined, TaskAlt } from "@mui/icons-material";
import sendEmailToUnverifiedUser from "../../queries/sendEmailToUnverifiedUser/sendEmailToUnverifiedUser";
import { useHistory } from "react-router";
import { CO_ROLE_ADMIN, CO_ROLE_PATIENT } from "../../utils/roles";
import { blobToFile } from "../../utils/images/blobToFile";
import IdVerificationUpdate from "../idVerification/idVerificationUpdate";
import useTraces from "../../hooks/useTraces";
import { Icon } from "semantic-ui-react";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& label": {
      marginTop: -3,
    },
  },
  viewIcon: {
    cursor: "pointer",
    width: "17px",
    height: "17px",
    marginLeft: "3px",
  },
  container: {
    position: "relative",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  icon: {
    position: "absolute",
    top: "60%",
    float: "right",
    right: 0,
    cursor: "pointer",
  },
  tickIcon: {
    position: "absolute",
    right: 0,
    borderRadius: "50%",
    cursor: "pointer",
  },
  cardContent: {
    backgroundColor: theme.palette.primary.light,
  },
  h6_title: {
    width: "20%",
    float: "left",
    fontWeight: 600,
  },
  subtitle: {
    width: "70%",
    float: "left",
    marginLeft: "5%",
  },
  listitemStyle: {
    display: "inline-block !important",
    borderBottom: "1px solid #eaeaea !important",
  },
  cancel: {
    marginRight: "10px",
    backgroundColor: "grey",
    color: "white",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    cursor: "pointer",
  },
  idVerifiedIcon: {
    color: "white",
    borderRadius: "50%",
    backgroundColor: "#2AAA8A",
    padding: "2px",
    cursor: "navigator",
  },
  editButton: {
    float: "right",
    borderRadius: "50%",
    border: "1px solid",
    backgroundColor: " #d7ecff ",
  },
  emailTickIcon: {
    color: "green",
    marginLeft: "10px",
    marginRight: "3px",
    padding: "0px",
    width: "20px",
    height: "20px",
  },
}));

const Profile = () => {
  const {
    getStateList,
    getCountryList,
    getGenderList,
    getSexList,
    stateList,
    countryList,
    sexList,
    genderList,
    getPronounList,
    getLanguageList,
    pronounList,
    languageList,
  } = useMedicalrequestGetFunctions();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const history = useHistory();
  const dispatch = useDispatch();
  const [formFilled, setFormFilled] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [showSendModal, setShowSendModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alreadyVerified, setAlreadyVerified] = useState<boolean>(false);
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer
  );
  const { getTrace } = useTraces();
  const listClass = classNames(classes.listitemStyle);
  const [openCancelConformationModal, setOpenCancelConformationModal] =
    useState<boolean>(false);

  const [editView, setEditView] = useState<boolean>(false);
  const [confirmEdit, setConfirmEdit] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [showSsn, setShowSsn] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(null);
  const [fileResult, setFileResult] = useState<string>(blank);
  const [openImageEdit, setOpenImageEdit] = useState<boolean>(false);
  const [idVerificationStatus, setIdVerificationStatus] =
    useState<boolean>(false);
  const [editVerifiedConfirm, setEditVerifiedConfirm] =
    useState<boolean>(false);
  const [profileData, setProfileData] = useState(ADD_PROFILE_FORM_INIT);
  const [emailVerificationDetails, setEmailVerificationDetails] =
    useState<IEmailVerify>({
      emailVerified: false,
      emailVerifiedAt: null,
    });
  const [subscribeMutation] = useMutation<
    SendEmailToUnverifiedUserMutation,
    SendEmailToUnverifiedUserMutationVariables
  >(sendEmailToUnverifiedUser, {});
  const [subscribeEditProfileMutation] = useMutation(
    modifyPatientInfoQuery,
    {}
  );
  const [lang, setLang] = useState<IInitialType>({
    id: "0",
    value: translate("resources.patients.dropdown.lang"),
  });
  const [pronouns, setPronouns] = useState<IInitialType>({
    id: "0",
    value: "",
  });
  const [profileError, setProfileError] =
    useState<IProfileError>(PROFILE_ERROR_INIT);
  const [state, setState] = useState({
    id: "0",
    value: translate("resources.patients.dropdown.state"),
  });
  const [country, setCountry] = useState({
    id: "0",
    value: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    if (userInfoReducer.role === CO_ROLE_PATIENT) {
      getTrace("Profile loaded", "ev-149", userInfoReducer.email);
    }
    function getUserInfo(): void {
      setIsLoading(true);
      const queryOption = {
        pagination: { page: 1, perPage: 1 },
        sort: { field: "id", order: "ASC" },
        filter: {},
      };
      dataProvider
        .getList("personProfile", queryOption)
        .then(({ data }) => {
          setIdVerificationStatus(data[0].status === "Verified" ? true : false);
          setEmailVerificationDetails({
            emailVerified: data[0].isEmailVerified,
            emailVerifiedAt: data[0].emailVerifiedAt,
          });
          if (data[0].birthDate) {
            setSelectedDate(new Date(data[0].birthDate));
          } else {
            setSelectedDate(null);
          }
          setLang({
            id: data[0].preferredLanguageId
              ? String(data[0].preferredLanguageId)
              : "0",
            value: data[0].preferredLanguageValue
              ? data[0].preferredLanguageValue
              : translate("resources.patients.dropdown.lang"),
          });
          setPronouns({
            id: data[0].preferredPronounsId
              ? String(data[0].preferredPronounsId)
              : "0",
            value: data[0].preferredPronounsValue
              ? data[0].preferredPronounsValue
              : "",
          });
          setProfileData((prevFormState) => ({
            ...prevFormState,
            firstName: data[0].firstName,
            middleName: data[0].middleName ? data[0].middleName : "",
            lastName: data[0].lastName,
            electronicDetails: data[0].electronicDetails,
            birthDate: data[0].birthDate
              ? moment(new Date(data[0].birthDate)).format("YYYY-MM-DD")
              : null,
            number: data[0].phoneNumber,
            addressZip: data[0].addressZip,
            addressLine1: data[0].addressLine1,
            addressLine2: data[0].addressLine2,
            city: data[0].city,
            state: data[0].state,
            country: data[0].country,
            preferredLanguageId: data[0].preferredLanguageId,
            preferredPronouns: data[0].preferredPronounsId,
            // directAddress: data[0].directAddress,
            sex: {
              id: JSON.parse(data[0].sex).id,
              value: JSON.parse(data[0].sex).value,
              other: JSON.parse(data[0].sex).other,
              otherValue: JSON.parse(data[0].sex).other_value,
            },
            gender: {
              id: JSON.parse(data[0].gender).id,
              value: JSON.parse(data[0].gender).value,
              other: JSON.parse(data[0].gender).other,
              otherValue: JSON.parse(data[0].gender).other_value,
            },
            ssn: data[0].ssn
              ? data[0].ssn.slice(0, 3) +
                "-" +
                data[0].ssn.slice(3, 5) +
                "-" +
                data[0].ssn.slice(5)
              : null,
          }));
          setState({
            id: data[0].state ? data[0].state : "0",
            value: data[0].stateValue
              ? data[0].stateValue
              : translate("resources.patients.dropdown.state"),
          });
          setCountry({
            id: data[0].country ? data[0].country : "0",
            value: data[0].countryValue,
          });
          setIsLoading(false);
        })
        .catch((error) => error);
    }
    getUserInfo();
  }, [editView]);
  useEffect(() => {
    getCountryList();
    getStateList();
    getSexList();
    getGenderList();
    getPronounList();
    getLanguageList();
  }, []);
  useEffect(() => {
    if (userInfoReducer.profilePicId) {
      getFileDetails(userInfoReducer.profilePicId);
    } else {
      setFileResult(blank);
    }
  }, [userInfoReducer.profilePicId]);
  function getFileDetails(picId: string): void {
    const queryOptionFile = {
      pagination: { page: 1, perPage: 1 },
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
          setFileResult(URL.createObjectURL(blobToFile(res, data[0].fileName)));
        });
      }
    });
  }
  const confirmSubmission = (): void => {
    let isProfileDataValid = true;
    if (profileData.number === "+1") {
      profileData.number = null;
    }
    Object.entries(profileError).forEach((indv) => {
      if (indv[1]?.status) {
        isProfileDataValid = false;
      }
    });
    if (
      !profileData.firstName ||
      !profileData.city ||
      !profileData.state ||
      !profileData.addressZip ||
      !profileData.addressLine1 ||
      !profileData.sex.value ||
      !profileData.gender.value ||
      !profileData.birthDate ||
      !profileData.lastName ||
      !profileData.number ||
      !profileData.preferredLanguageId ||
      !profileData.preferredPronouns
    ) {
      if (!profileData.firstName) {
        setError(
          "firstName",
          addNewPatientErrorMessages["firstName"]["empty"],
          true
        );
      }
      if (!profileData.lastName) {
        setError(
          "lastName",
          addNewPatientErrorMessages["lastName"]["empty"],
          true
        );
      }
      if (!profileData.number) {
        setError("number", addNewPatientErrorMessages["number"]["empty"], true);
      }
      if (!profileData.birthDate) {
        setError(
          "birthDate",
          addNewPatientErrorMessages["birthDate"]["empty"],
          true
        );
      }
      if (!profileData.gender.value) {
        setError("gender", addNewPatientErrorMessages["gender"]["empty"], true);
      }
      if (!profileData.sex.value) {
        setError("sex", addNewPatientErrorMessages["sex"]["empty"], true);
      }
      if (!profileData.addressLine1) {
        setError(
          "addressLine1",
          addNewPatientErrorMessages["addressLine1"]["empty"],
          true
        );
      }
      if (!profileData.city) {
        setError("city", addNewPatientErrorMessages["city"]["empty"], true);
      }
      if (!profileData.addressZip) {
        setError(
          "addressZip",
          addNewPatientErrorMessages["addressZip"]["empty"],
          true
        );
      }
      if (!profileData.preferredLanguageId) {
        setError(
          "preferredLanguageId",
          addNewPatientErrorMessages["preferredLanguageId"]["empty"],
          true
        );
      }
      if (!profileData.preferredPronouns) {
        setError(
          "preferredPronouns",
          addNewPatientErrorMessages["preferredPronouns"]["empty"],
          true
        );
      }
      if (!profileData.state) {
        setError("state", addNewPatientErrorMessages["state"]["empty"], true);
      }
    } else {
      if (isProfileDataValid) {
        setConfirmEdit(true);
      }
    }
  };
  const handleSubmit = (): void => {
    if (userInfoReducer.role === CO_ROLE_PATIENT) {
      getTrace("Click on submit button", "ev-155", userInfoReducer.email);
    }
    setShowLoader(true);
    setConfirmEdit(false);
    const editPatientDetails: ModifyPatientInfoInput = {
      pdr: { ...profileData },
      patientId: userInfoReducer.id,
    };
    editPatientDetails.pdr.ssn =
      profileData.ssn !== null ? profileData.ssn.split("-").join("") : null;
    subscribeEditProfileMutation({
      variables: {
        input: editPatientDetails,
      },
    })
      .then((editPatientResponse) => {
        if (editPatientResponse.data) {
          const editPatientResult =
            editPatientResponse.data.modifyPatientInfo.requestResult;
          const statusCode = JSON.parse(editPatientResult.status).code;
          if (statusCode === 200) {
            setIsSuccess(true);
            setShowLoader(false);
            dispatch(
              userInfoAction({
                username: profileData.electronicDetails,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                email: profileData.electronicDetails,
                name: profileData.firstName + " " + profileData.lastName,
                groups: userInfoReducer.groups,
                role: secureLocalStorage.getItem("role") + "",
                id: userInfoReducer.id,
                emailVerified: userInfoReducer.emailVerified,
                profilePicId: userInfoReducer.profilePicId,
              })
            );
            localStorage.setItem(
              "User",
              profileData.firstName + " " + profileData.lastName
            );
          } else {
            setShowLoader(false);
          }
        }
      })
      .catch((error) => {
        console.log("Edit patient response error:", error);
      });
  };
  const handleChangeProfile = (event: BaseSyntheticEvent) => {
    event.persist();
    setFormFilled(true);
    if (event.target.name === "ssn") {
      const formattedSSN = formatSSN(event.target.value);
      setProfileData((prevFormState) => ({
        ...prevFormState,
        [event.target.name]: event.target.value !== "" ? formattedSSN : null,
      }));
    } else if (event.target.name === "preferredPronouns") {
      setProfileData((prevFormState) => ({
        ...prevFormState,
        [event.target.name]: Number(event.target.value),
      }));
    } else {
      setProfileData((prevFormState) => ({
        ...prevFormState,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      }));
    }
  };
  const handleChange = (event: BaseSyntheticEvent) => {
    event.persist();
    setFormFilled(true);
    if (event.target.name === "sexOthers") {
      setProfileData((prevFormState) => ({
        ...prevFormState,
        sex: {
          ...prevFormState.sex,
          otherValue: event.target.value,
        },
      }));
    } else if (event.target.name === "genderOthers") {
      setProfileData((prevFormState) => ({
        ...prevFormState,
        gender: {
          ...prevFormState.gender,
          otherValue: event.target.value,
        },
      }));
    } else {
      setProfileData((prevFormState) => ({
        ...prevFormState,
        [event.target.name]: {
          id: Number(event.target.value),
          value: event.target.options[event.target.selectedIndex].id,
          other:
            event.target.options[event.target.selectedIndex].id ===
            "Other (specify)"
              ? true
              : false,
          otherValue: "",
        },
      }));
    }
  };
  const handleChangeDOB = (value) => {
    setFormFilled(true);
    let validationStatus: boolean;
    if (!value) {
      validationStatus = true;
      setSelectedDate(null);
      setProfileData((prevFormState) => ({
        ...prevFormState,
        birthDate: null,
      }));
    } else {
      validationStatus = false;
    }
    if (!validationStatus) {
      const date = moment(value).format("MM/DD/YYYY");
      const valid = validateDate(date);
      setError("birthDate", !valid && ERROR_MESSAGE_KEY, !valid);
      setProfileData((prevFormState) => ({
        ...prevFormState,
        birthDate: value,
      }));
      setSelectedDate(value);
    }
    if (validationStatus) {
      setError("patientDOB", "empty", true);
      setSelectedDate(null);
      setProfileData((prevFormState) => ({
        ...prevFormState,
        birthDate: null,
      }));
    }
  };
  const handleChangePhone = (value) => {
    setFormFilled(true);
    setProfileData((prevFormState) => ({
      ...prevFormState,
      number: value,
    }));
  };

  const handleValidateOnBlur = (event: BaseSyntheticEvent): void => {
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
        case "number": {
          const valid = validatePhone(event.target.value);
          setError(
            event.target.name,
            "Please enter a valid phone number",
            !valid
          );
          break;
        }
        case "electronicDetails": {
          const valid = validateEmail(event.target.value);
          setError(event.target.name, "Please enter a valid email", !valid);
          break;
        }
        case "directAddress": {
          const valid = validateEmail(event.target.value);
          setError(
            event.target.name,
            "Please enter a valid direct address",
            !valid
          );
          break;
        }
        case "firstName":
        case "middleName":
        case "lastName": {
          const valid = validateString(event.target.value);
          setError(event.target.name, "Please enter a valid name", !valid);
          break;
        }
        case "ssn": {
          const valid = validateSsn(event.target.value);
          setError(event.target.name, "Please enter a valid SSN", !valid);
          break;
        }
        case "addressLine1":
        case "addressLine2":
        case "city": {
          const valid = validateSentance(event.target.value);
          setError(event.target.name, "Please enter a valid address", !valid);
          break;
        }
        case "addressZip": {
          const valid = validateZipCode(event.target.value);
          setError(event.target.name, "Please enter a valid zip code", !valid);
          break;
        }
        default: {
          setError(event.target.name, "", false);
          break;
        }
      }
    } else {
      setError(event.target.name, "", false);
    }
  };

  const setError = (
    fieldName: string,
    type: string,
    setError: boolean
  ): void => {
    setProfileError((prevFormState) => ({
      ...prevFormState,
      [fieldName]: {
        status: setError,
        message: setError ? type : "",
      },
    }));
  };
  const editImage = (): void => {
    if (userInfoReducer.role === CO_ROLE_PATIENT) {
      getTrace(
        "Click on change profile picture",
        "ev-150",
        userInfoReducer.email
      );
    }
    if (userInfoReducer.emailVerified) setOpenImageEdit(true);
  };
  const regenerateLink = (): void => {
    setIsLoading(true);
    if (userInfoReducer.role === CO_ROLE_PATIENT) {
      getTrace("Click on verify email button", "ev-152", userInfoReducer.email);
    }
    subscribeMutation({
      variables: { input: { userId: userInfoReducer.id } },
    }).then((response) => {
      setIsLoading(false);
      const regenerateResponse = JSON.parse(
        response.data.sendEmailToUnverifiedUser.json
      );
      if (regenerateResponse.Success) {
        setShowSendModal(true);
        if (regenerateResponse.code === 200) {
          setAlreadyVerified(false);
        } else {
          setAlreadyVerified(true);
        }
      } else {
        setShowErrorModal(true);
      }
    });
  };
  return (
    <>
      {!isLoading ? (
        <Container
          maxWidth="xl"
          style={{ maxWidth: "unset", paddingRight: "5px", paddingLeft: "5px" }}
        >
          {openCancelConformationModal && (
            <BaseModal
              open={openCancelConformationModal}
              confirmAction={() => {
                setOpenCancelConformationModal(false);
                setEditView(false);
              }}
              onClose={() => {
                setOpenCancelConformationModal(false);
              }}
              title={translate("resources.accountSetting.cancelTitle")}
              content={translate("resources.accountSetting.cancelMessage")}
              successButtonName="Yes"
              closeButtonName="No"
            />
          )}
          {showSendModal && (
            <BaseModal
              open={showSendModal}
              confirmAction={() => {
                setShowSendModal(false);
                history.push("/profile/myAccount");
              }}
              title={
                alreadyVerified
                  ? translate(`auth.already_verified_title`)
                  : translate(`auth.regenerate_link_title`)
              }
              content={
                alreadyVerified
                  ? translate(`auth.already_verified_subtitle`)
                  : translate(`auth.regenerate_link_subtitle`)
              }
              successButtonName="Ok"
              type="regenerateSuccess"
            />
          )}
          {showErrorModal && (
            <BaseModal
              open={showErrorModal}
              confirmAction={() => {
                setShowErrorModal(false);
                history.push("/profile/myAccount");
              }}
              title={translate(`auth.regenerate_link_error_title`)}
              content={translate("resources.invite.errorMessage")}
              successButtonName="Ok"
              type="regenerateError"
            />
          )}
          {confirmEdit && (
            <BaseModal
              open={confirmEdit}
              confirmAction={handleSubmit}
              onClose={() => {
                setConfirmEdit(false);
              }}
              title={translate(
                "resources.accountSetting.editProfileConfirmTitle"
              )}
              content={translate(
                "resources.accountSetting.editProfileConfirmMessage"
              )}
              successButtonName={"Save Changes"}
              type={"warning"}
            />
          )}
          {isSuccess && (
            <BaseModal
              open={isSuccess}
              confirmAction={() => {
                setIsSuccess(false);
                setEditView(false);
              }}
              onClose={() => {
                setIsSuccess(false);
                setEditView(false);
              }}
              title={translate(
                "resources.accountSetting.editProfileSuccessTitle"
              )}
              content={translate(
                "resources.accountSetting.editProfileSuccessMessage"
              )}
              successButtonName={"Close"}
              closeButtonName="Close"
              type={"editPatientSuccess"}
            />
          )}
          {!editView ? (
            <>
              <Card className={classes.root}>
                <div>
                  <CardContent className={classes.cardContent}>
                    <CardHeader>
                      <Grid container spacing={1} style={{ marginTop: "5px" }}>
                        <Grid item md={6} xs={6}>
                          <Typography
                            variant="h5"
                            style={{ fontSize: 16, fontWeight: 500 }}
                          >
                            <b>PERSONAL INFORMATION</b>{" "}
                          </Typography>
                        </Grid>
                        {userInfoReducer.emailVerified && (
                          <Grid item md={6} xs={6}>
                            <Tooltip
                              title={translate(
                                "resources.accountSetting.editProfile"
                              )}
                            >
                              <IconButton
                                onClick={() => {
                                  if (
                                    userInfoReducer.role === CO_ROLE_PATIENT
                                  ) {
                                    getTrace(
                                      "Click on edit profile button",
                                      "ev-153",
                                      userInfoReducer.email
                                    );
                                  }
                                  if (idVerificationStatus) {
                                    setEditVerifiedConfirm(true);
                                  } else {
                                    setEditView(true);
                                  }
                                }}
                                size="small"
                                className={classes.editButton}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        )}
                      </Grid>
                    </CardHeader>
                    <ListItem className={listClass} disableGutters>
                      {fileResult && (
                        <Grid container spacing={1}>
                          <Grid item lg={1} md={2}>
                            <div className={classes.container}>
                              {userInfoReducer.role === CO_ROLE_PATIENT &&
                                idVerificationStatus && (
                                  <div
                                    className={classes.tickIcon}
                                    style={{ float: "right" }}
                                  >
                                    <TaskAlt
                                      className={classes.idVerifiedIcon}
                                    />
                                  </div>
                                )}
                              {userInfoReducer.role === CO_ROLE_PATIENT &&
                                idVerificationStatus && (
                                  <div
                                    style={{ position: "absolute", left: 0 }}
                                  >
                                    {" "}
                                    <img
                                      src={verifiedBadge}
                                      className={classes.image}
                                      onClick={editImage}
                                    />
                                  </div>
                                )}
                              <img
                                src={fileResult}
                                className={classes.image}
                                onClick={editImage}
                              />
                              {userInfoReducer.emailVerified && (
                                <Tooltip
                                  title={translate(
                                    "resources.accountSetting.editProfilePic"
                                  )}
                                >
                                  <div className={classes.icon}>
                                    <EditTwoTone
                                      style={{
                                        borderRadius: "50%",
                                        backgroundColor: "white",
                                        padding: "2px",
                                      }}
                                      onClick={editImage}
                                    />
                                  </div>
                                </Tooltip>
                              )}
                            </div>
                          </Grid>{" "}
                          <Grid
                            item
                            md={4}
                            style={{ marginTop: "20px", marginLeft: "20px" }}
                          >
                            <div style={{ display: "flex" }}>
                              <Typography
                                variant="body1"
                                style={{
                                  fontWeight: 600,
                                  justifyContent: "center",
                                }}
                              >
                                {profileData.firstName
                                  ? profileData.firstName +
                                    " " +
                                    (profileData.middleName
                                      ? profileData.middleName
                                      : "") +
                                    " " +
                                    profileData.lastName
                                  : ""}
                              </Typography>
                              {profileData.firstName &&
                                !idVerificationStatus &&
                                userInfoReducer.role === CO_ROLE_PATIENT && (
                                  <Chip
                                    label={
                                      <Typography
                                        variant="body1"
                                        style={{
                                          fontWeight: 600,
                                        }}
                                      >
                                        Unverified
                                      </Typography>
                                    }
                                    icon={<BadgeOutlined />}
                                    style={{
                                      backgroundColor: "#ffcc33",
                                      width: "120px",
                                      marginLeft: "10px",
                                      height: "23px",
                                    }}
                                  />
                                )}
                            </div>
                          </Grid>
                        </Grid>
                      )}
                    </ListItem>
                    {profileData.firstName && (
                      <>
                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            Date of Birth: &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {profileData.birthDate
                              ? tommddyyyy(profileData.birthDate)
                              : "N/A"}
                          </Typography>
                        </ListItem>

                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            Sex Assigned at Birth: &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {profileData.sex.value
                              ? profileData.sex.other
                                ? profileData.sex.otherValue
                                : profileData.sex.value
                              : "N/A"}
                          </Typography>
                        </ListItem>
                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            Gender: &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {profileData.gender.value
                              ? profileData.gender.other
                                ? profileData.gender.otherValue
                                : profileData.gender.value
                              : "N/A"}
                          </Typography>
                        </ListItem>

                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            Preferred Language: &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {profileData.preferredLanguageId
                              ? lang.value
                              : "N/A"}
                          </Typography>
                        </ListItem>
                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            Preferred Pronouns: &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {profileData.preferredPronouns
                              ? pronouns.value
                              : "N/A"}
                          </Typography>
                        </ListItem>
                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            SSN (Social Security Number): &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {profileData.ssn
                              ? showSsn
                                ? profileData.ssn
                                : "* * *-* *-" +
                                  profileData.ssn?.substring(7, 11)
                              : "N/A"}
                            {profileData.ssn ? (
                              showSsn ? (
                                <VisibilityOff
                                  onClick={() => {
                                    setShowSsn(false);
                                  }}
                                  className={classes.viewIcon}
                                />
                              ) : (
                                <Visibility
                                  onClick={() => {
                                    setShowSsn(true);
                                    if (
                                      userInfoReducer.role === CO_ROLE_PATIENT
                                    ) {
                                      getTrace(
                                        "Click on view ssn",
                                        "ev-151",
                                        userInfoReducer.email
                                      );
                                    }
                                  }}
                                  className={classes.viewIcon}
                                />
                              )
                            ) : (
                              ""
                            )}
                          </Typography>
                        </ListItem>
                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            Email Address: &nbsp;
                          </Typography>

                          {profileData.electronicDetails && (
                            <div style={{ display: "flex" }}>
                              <Typography
                                variant="body1"
                                className={classes.subtitle}
                                style={{
                                  marginLeft: "6%",
                                  wordBreak: "break-all",
                                }}
                              >
                                {profileData.electronicDetails}
                                {"  "}
                                {emailVerificationDetails.emailVerified ? (
                                  <>
                                    <Icon
                                      name="check"
                                      color="green"
                                      className={classes.emailTickIcon}
                                    />
                                    <b>
                                      Verified on{" "}
                                      {tommddyyyy(
                                        emailVerificationDetails.emailVerifiedAt
                                      )}
                                    </b>
                                  </>
                                ) : (
                                  <>
                                    <Warning
                                      style={{
                                        color: "orange",
                                        marginLeft: "5px",
                                        marginRight: "3px",
                                        width: "16px",
                                        height: "16px",
                                      }}
                                    />
                                    <b>The email has not yet been verified</b>
                                    {userInfoReducer.role !== CO_ROLE_ADMIN && (
                                      <Button
                                        color="primary"
                                        onClick={regenerateLink}
                                        style={{
                                          textTransform: "none",
                                          color: "white",
                                          backgroundColor: "#2AAA8A",
                                          marginLeft: "20px",
                                        }}
                                        startIcon={
                                          isLoading ? (
                                            <CircularProgress
                                              color="secondary"
                                              size={20}
                                            />
                                          ) : (
                                            ""
                                          )
                                        }
                                      >
                                        Verify Email
                                      </Button>
                                    )}
                                  </>
                                )}
                              </Typography>
                            </div>
                          )}
                        </ListItem>
                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            Phone: &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {profileData.number ? profileData.number : "N/A"}
                          </Typography>
                        </ListItem>
                        {/* <ListItem className={listClass} disableGutters>
                  <Typography variant="body1" className={classes.h6_title}>
                    Direct Address: &nbsp;
                  </Typography>
                  <Typography variant="body1" className={classes.subtitle}>
                    {profileData.directAddress
                      ? profileData.directAddress
                      : "N/A"}
                  </Typography>
                </ListItem> */}
                        <CardHeader>
                          <Typography
                            variant="h5"
                            style={{ fontSize: 16, fontWeight: 500 }}
                          >
                            <b>ADDRESS</b>{" "}
                          </Typography>
                        </CardHeader>
                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            Address Line 1: &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {profileData.addressLine1
                              ? profileData.addressLine1
                              : "N/A"}
                          </Typography>
                        </ListItem>
                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            Address Line 2: &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {profileData.addressLine2
                              ? profileData.addressLine2
                              : "N/A"}
                          </Typography>
                        </ListItem>
                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            City: &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {profileData.city ? profileData.city : "N/A"}
                          </Typography>
                        </ListItem>
                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            State: &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {state.id !== "0" ? state.value : "N/A"}
                          </Typography>
                        </ListItem>
                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            Country: &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {country.value ? country.value : "N/A"}
                          </Typography>
                        </ListItem>
                        <ListItem className={listClass} disableGutters>
                          <Typography
                            variant="body1"
                            className={classes.h6_title}
                          >
                            Zipcode: &nbsp;
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.subtitle}
                          >
                            {profileData.addressZip
                              ? profileData.addressZip
                              : "N/A"}
                          </Typography>
                        </ListItem>
                      </>
                    )}
                  </CardContent>
                </div>
              </Card>
            </>
          ) : (
            <>
              <Card className={classes.root}>
                <div>
                  <CardContent className={classes.cardContent}>
                    <CardHeader>
                      <Typography
                        variant="h5"
                        style={{ fontSize: 16, fontWeight: 500 }}
                      >
                        <b>PERSONAL INFORMATION</b>{" "}
                      </Typography>
                    </CardHeader>
                    <Grid container spacing={1}>
                      <Grid item md={3} xs={12}>
                        <TextField
                          margin="dense"
                          label="First Name"
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={profileError.firstName.status}
                          helperText={
                            profileError.firstName.status
                              ? profileError.firstName.message
                              : " "
                          }
                          name="firstName"
                          className="firstName"
                          required
                          id="firstName"
                          variant="standard"
                          fullWidth
                          onChange={handleChangeProfile}
                          SelectProps={{ native: true }}
                          value={profileData.firstName}
                        />
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <TextField
                          fullWidth
                          margin="dense"
                          label="Middle Name"
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={profileError.middleName.status}
                          helperText={
                            profileError.middleName.status
                              ? profileError.middleName.message
                              : " "
                          }
                          name="middleName"
                          onChange={handleChangeProfile}
                          value={profileData.middleName}
                          variant="standard"
                        />
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <TextField
                          fullWidth
                          margin="dense"
                          label="Last Name"
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={profileError.lastName.status}
                          helperText={
                            profileError.lastName.status
                              ? profileError.lastName.message
                              : " "
                          }
                          required
                          name="lastName"
                          onChange={handleChangeProfile}
                          value={profileData.lastName}
                          variant="standard"
                        />
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <TextField
                          fullWidth
                          margin="dense"
                          label="SSN"
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={profileError.ssn.status}
                          helperText={
                            profileError.ssn.status
                              ? profileError.ssn.message
                              : " "
                          }
                          placeholder="xxx-xx-xxxx"
                          inputProps={{
                            pattern: "\\d{3}-\\d{2}-\\d{4}",
                            maxLength: 11,
                          }}
                          name="ssn"
                          onChange={handleChangeProfile}
                          value={profileData.ssn}
                          variant="standard"
                        />
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <TextField
                          fullWidth
                          margin="dense"
                          name="sex"
                          label="Sex Assigned at Birth"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                          onChange={handleChange}
                          style={{ fontSize: "14px" }}
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={profileError.sex.status}
                          helperText={
                            profileError.sex.status
                              ? profileError.sex.message
                              : " "
                          }
                          select
                          SelectProps={{ native: true }}
                          value={profileData.sex.id}
                          variant="standard"
                        >
                          <option key={0} value="0" hidden>
                            {translate("resources.patients.dropdown.sex")}
                          </option>
                          {sexList.map((option) => (
                            <option
                              key={option.id}
                              value={option.id}
                              id={option.value}
                            >
                              {option.value}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      {Number(profileData.sex.id) === 8 && (
                        <Grid item md={3} xs={12}>
                          <TextField
                            fullWidth
                            margin="dense"
                            required
                            label="Please specify sex"
                            onBlur={(e) => {
                              handleValidateOnBlur(e);
                            }}
                            error={profileError.sexOthers.status}
                            helperText={
                              profileError.sexOthers.status
                                ? profileError.sexOthers.message
                                : " "
                            }
                            name="sexOthers"
                            onChange={handleChange}
                            value={profileData.sex.otherValue}
                            variant="standard"
                          />
                        </Grid>
                      )}
                      <Grid item md={3} xs={12}>
                        <TextField
                          fullWidth
                          margin="dense"
                          name="gender"
                          label="Gender"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={handleChange}
                          style={{ fontSize: "14px" }}
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={profileError.gender.status}
                          required
                          helperText={
                            profileError.gender.status
                              ? profileError.gender.message
                              : " "
                          }
                          select
                          SelectProps={{ native: true }}
                          value={profileData.gender.id}
                          variant="standard"
                        >
                          <option key={0} value="0" hidden>
                            {translate("resources.patients.dropdown.gender")}
                          </option>
                          {genderList.map((option) => (
                            <option
                              key={option.id}
                              value={option.id}
                              id={option.value}
                            >
                              {option.value}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      {Number(profileData.gender.id) === 9 && (
                        <Grid item md={3} xs={12}>
                          <TextField
                            fullWidth
                            margin="dense"
                            required
                            label="Please specify gender"
                            onBlur={(e) => {
                              handleValidateOnBlur(e);
                            }}
                            error={profileError.genderOthers.status}
                            helperText={
                              profileError.genderOthers.status
                                ? profileError.genderOthers.message
                                : " "
                            }
                            name="genderOthers"
                            onChange={handleChange}
                            value={profileData.gender.otherValue}
                            variant="standard"
                          />
                        </Grid>
                      )}
                      <Grid item md={3} xs={12}>
                        <TextField
                          fullWidth
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={profileError.electronicDetails.status}
                          helperText={
                            profileError.electronicDetails.status
                              ? profileError.electronicDetails.message
                              : " "
                          }
                          inputProps={{ readOnly: true }}
                          margin="dense"
                          label="Email Address"
                          required
                          name="electronicDetails"
                          onChange={handleChangeProfile}
                          value={profileData.electronicDetails}
                          variant="standard"
                        />
                      </Grid>
                      {/* <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      onBlur={(e) => {
                        handleValidateOnBlur(e);
                      }}
                      error={profileError.directAddress.status}
                      helperText={
                        profileError.directAddress.status
                          ? profileError.directAddress.message
                          : " "
                      }
                      margin="dense"
                      label="Direct Address"
                      name="directAddress"
                      onChange={handleChangeProfile}
                      value={profileData.directAddress}
                      variant="standard"
                    />
                  </Grid> */}
                      <Grid item md={3} xs={12}>
                        <div style={{ marginBottom: "28px" }}>
                          <DatePickerWithMonthAndYearDropdown
                            handleChangeFunction={handleChangeDOB}
                            handleValidateOnBlurFunction={handleValidateOnBlur}
                            errorStatus={profileError.birthDate.status}
                            errorMessage={profileError.birthDate.message}
                            selectedDate={selectedDate}
                            id={"patientDOB"}
                            label={
                              <>
                                Date of Birth <sup>*</sup>
                              </>
                            }
                          />
                        </div>
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <MuiPhoneNumber
                          defaultCountry={"us"}
                          onlyCountries={["us"]}
                          disableAreaCodes={true}
                          fullWidth
                          required
                          countryCodeEditable={false}
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={profileError.number.status}
                          helperText={
                            profileError.number.status
                              ? profileError.number.message
                              : " "
                          }
                          margin="dense"
                          label="Phone Number"
                          name="number"
                          onChange={handleChangePhone}
                          value={profileData.number}
                          variant="standard"
                        />
                      </Grid>

                      <Grid item md={3} xs={12}>
                        <Autocomplete
                          id="preferredLanguageId"
                          options={languageList}
                          disableClearable
                          autoHighlight
                          value={lang}
                          getOptionLabel={(option) => option.value}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              const { id, value } = newValue;
                              setLang({ id: id + "", value: value });
                              setProfileData((prevFormState) => ({
                                ...prevFormState,
                                ...prevFormState,
                                ["preferredLanguageId"]: Number(id),
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
                              error={profileError.preferredLanguageId.status}
                              helperText={
                                profileError.preferredLanguageId.message
                              }
                              onBlur={(e) => handleValidateOnBlur(e)}
                              margin="dense"
                              required
                              label="Preferred Language"
                              name="preferredLanguageId"
                              style={{ fontSize: "14px" }}
                              value={profileData.preferredLanguageId}
                              variant="standard"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <TextField
                          fullWidth
                          margin="dense"
                          name="preferredPronouns"
                          label="Preferred Pronouns"
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={handleChangeProfile}
                          style={{ fontSize: "14px" }}
                          error={profileError.preferredPronouns.status}
                          helperText={profileError.preferredPronouns.message}
                          onBlur={(e) => handleValidateOnBlur(e)}
                          select
                          SelectProps={{ native: true }}
                          value={profileData.preferredPronouns}
                          variant="standard"
                        >
                          <option key={0} value="0" hidden>
                            {translate(
                              "resources.patients.dropdown.preferredPronouns"
                            )}
                          </option>
                          {pronounList.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.value}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                    <CardHeader>
                      <Typography
                        variant="h5"
                        style={{ fontSize: 16, fontWeight: 500 }}
                      >
                        <b>ADDRESS</b>{" "}
                      </Typography>
                    </CardHeader>
                    <Grid container spacing={1}>
                      <Grid item md={4} xs={12}>
                        <TextField
                          margin="dense"
                          label="Address Line 1"
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          required
                          error={profileError.addressLine1.status}
                          helperText={
                            profileError.addressLine1.status
                              ? profileError.addressLine1.message
                              : " "
                          }
                          name="addressLine1"
                          className="addressLine1"
                          id="addressLine1"
                          variant="standard"
                          fullWidth
                          onChange={handleChangeProfile}
                          SelectProps={{ native: true }}
                          value={profileData.addressLine1}
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <TextField
                          fullWidth
                          margin="dense"
                          label="Address Line 2"
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={profileError.addressLine2.status}
                          helperText={
                            profileError.addressLine2.status
                              ? profileError.addressLine2.message
                              : " "
                          }
                          name="addressLine2"
                          onChange={handleChangeProfile}
                          value={profileData.addressLine2}
                          variant="standard"
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <TextField
                          fullWidth
                          margin="dense"
                          label="City"
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={profileError.city.status}
                          helperText={
                            profileError.city.status
                              ? profileError.city.message
                              : " "
                          }
                          required
                          name="city"
                          onChange={handleChangeProfile}
                          value={profileData.city}
                          variant="standard"
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <TextField
                          fullWidth
                          label="Country"
                          margin="dense"
                          name="country"
                          onChange={handleChangeProfile}
                          select
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                          SelectProps={{ native: true }}
                          value={profileData.country}
                          variant="standard"
                        >
                          {countryList.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.value}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <Autocomplete
                          id="state"
                          options={stateList}
                          disableClearable
                          autoHighlight
                          value={state}
                          style={{
                            width: "100%",
                          }}
                          getOptionLabel={(option) => option.value}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              const { id, value } = newValue;
                              setState({ id: id + "", value: value });
                              setProfileData((prevFormState) => ({
                                ...prevFormState,
                                state: Number(id),
                                country: 1,
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
                              onBlur={(e) => {
                                handleValidateOnBlur(e);
                              }}
                              error={profileError.state.status}
                              helperText={
                                profileError.state.status
                                  ? profileError.state.message
                                  : " "
                              }
                              required
                              margin="dense"
                              label="State"
                              name="state"
                              style={{ fontSize: "14px" }}
                              value={profileData.state}
                              variant="standard"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <TextField
                          fullWidth
                          margin="dense"
                          label="Zip code"
                          onBlur={(e) => {
                            handleValidateOnBlur(e);
                          }}
                          error={profileError.addressZip.status}
                          helperText={
                            profileError.addressZip.status
                              ? profileError.addressZip.message
                              : " "
                          }
                          required
                          inputProps={{
                            maxLength: 5,
                          }}
                          name="addressZip"
                          onChange={handleChangeProfile}
                          value={profileData.addressZip}
                          variant="standard"
                        />
                      </Grid>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "right",
                        }}
                      >
                        <Button
                          variant="contained"
                          className={classes.cancel}
                          onClick={() => {
                            if (userInfoReducer.role === CO_ROLE_PATIENT) {
                              getTrace(
                                "Click on close edit button",
                                "ev-154",
                                userInfoReducer.email
                              );
                            }
                            if (formFilled) {
                              setOpenCancelConformationModal(true);
                            } else {
                              setEditView(false);
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={confirmSubmission}
                          startIcon={
                            showLoader ? (
                              <CircularProgress color="secondary" size={20} />
                            ) : (
                              ""
                            )
                          }
                        >
                          {showLoader ? "Saving Changes" : "Save Changes"}
                        </Button>
                      </div>
                    </Grid>
                  </CardContent>
                </div>
              </Card>
            </>
          )}
          <ImageEditForm
            open={openImageEdit}
            onClose={() => {
              setOpenImageEdit(false);
            }}
            profilePic={fileResult}
          />
          <IdVerificationUpdate
            open={editVerifiedConfirm}
            onClose={() => {
              setEditVerifiedConfirm(false);
            }}
            setEditView={setEditView}
          />
        </Container>
      ) : (
        <div className="loader">Loading...</div>
      )}
    </>
  );
};

export default Profile;
