import React, { useState, useEffect } from "react";
import { useDataProvider, usePermissions, useTranslate } from "react-admin";
import clsx from "clsx";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import {
  Button,
  Dialog,
  TextField,
  Grid,
  Typography,
  colors,
  FormControlLabel,
  Checkbox,
  FormControl,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";

import type {
  CreateFeedbackV1Input,
  FileUploadInput,
} from "../../__generated__/typescript-operations_all";
import b64toBlob from "../../lib/universal/utils/images/b64toBlob";
import createFeedbackQuery from "../../queries/createFeedback/createFeedbackQuery";
import { useMutation } from "@apollo/react-hooks";
import createFileUploadQuery from "../../queries/createFileUpload/createFileUploadQuery";
import type { AppState, IPersonDemographic, IFileResponse } from "../../types";
import {
  validatePhone,
  validateEmail,
  validateString,
  validateSubjectLine,
  validateDescription,
} from "../../lib/universal/utils/validator";
import { perPageMax } from "../../lib/universal/utils/pageConstants";
// import { useSelector } from "react-redux";
import MuiPhoneNumber from "material-ui-phone-number";
import { CO_ROLE_ADMIN, CO_ROLE_MRA, CO_ROLE_PPA } from "../../utils/roles";
// import useTraces from "../../hooks/useTraces";
import BaseModal from "../baseModal";
import UploadFileDrop from "./fileDropzone";
// const useStyles = makeStyles(() => ({
//   root: {
//     padding: "30px",
//   },
//   dialogContainer: {
//     overflow: "hidden",
//   },
//   modal: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   header: {
//     maxWidth: 600,
//     margin: "0 auto",
//   },
//   closeIcon: {
//     position: "absolute",
//     top: "8px",
//     right: "8px",
//   },
//   content: {
//     maxWidth: 720,
//     margin: "0 auto",
//   },
//   product: {
//     overflow: "visible",
//     position: "relative",
//     cursor: "pointer",
//     "&:hover": {
//       transform: "scale(1.1)",
//     },
//   },
//   image: {
//     position: "absolute",
//     top: -24,
//     height: 48,
//     width: 48,
//     fontSize: 24,
//   },
//   divider: {},
//   options: {
//     lineHeight: "26px",
//   },
//   recommended: {},
//   contact: {
//     margin: "20px 0px",
//   },
//   actions: {
//     backgroundColor: colors.grey[100],
//     display: "flex",
//     justifyContent: "center",
//   },
//   startButton: {
//     backgroundColor: "#93C572",
//     color: "#ffffff",
//     "&:hover": {},
//   },
//   subtitle: {
//     width: "100%",
//   },
// }));

const PREFIX = "FeedBackForm";
const classes = {
  root: `${PREFIX}-root`,
  dialogContainer: `${PREFIX}-dialogContainer`,
  modal: `${PREFIX}-modal`,
  header: `${PREFIX}-header`,
  closeIcon: `${PREFIX}-closeIcon`,
  content: `${PREFIX}-content`,
  product: `${PREFIX}-product`,
  image: `${PREFIX}-image`,
  divider: `${PREFIX}-divider`,
  options: `${PREFIX}-options`,
  recommended: `${PREFIX}-recommended`,

  contact: `${PREFIX}- contact`,
  actions: `${PREFIX}-actions`,
  startButton: `${PREFIX}-startButton`,
  subtitle: `${PREFIX}-subtitle`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
  },
  [`& .${classes.dialogContainer}`]: {
    borderRadius: theme.shape.radius,
  },
  [`& .${classes.modal}`]: {
    color: theme.palette.common.white,
    fontSize: 16,
    lineHeight: 1.7,
  },
  [`& .${classes.header}`]: {
    color: theme.palette.common.white,
    fontSize: 16,
    lineHeight: 1.7,
  },
  [`& .${classes.closeIcon}`]: {
    color: theme.palette.common.white,
    fontSize: 16,
    lineHeight: 1.7,
  },
  [`& .${classes.content}`]: {
    color: theme.palette.common.white,
    fontSize: 16,
    lineHeight: 1.7,
  },
  [`& .${classes.product}`]: {
    color: theme.palette.common.white,
    fontSize: 16,
    lineHeight: 1.7,
  },
  [`& .${classes.image}`]: {
    color: theme.palette.common.white,
    fontSize: 16,
    lineHeight: 1.7,
  },
  [`& .${classes.divider}`]: {},
  [`& .${classes.options}`]: {
    position: "absolute",
    top: -24,
    height: 48,
    width: 48,
    fontSize: 24,
  },
  [`& .${classes.recommended}`]: {},
  [`& .${classes.contact}`]: {
    margin: "20px 0px",
  },
  [`& .${classes.actions}`]: {
    backgroundColor: colors.grey[100],
    display: "flex",
    justifyContent: "center",
  },
  [`& .${classes.startButton}`]: {
    backgroundColor: "#93C572",
    color: "#ffffff",
    "&:hover": {},
  },
  [`& .${classes.subtitle}`]: {
    width: "100%",
  },
}));
interface FailedFileResponse {
  failedResponse: IFileResponse;
}
function FeedBackForm({ open, onClose, canvased, ...rest }): JSX.Element {
  // const userInfo = useSelector((state: AppState) => state.userInfoReducer);
  const [userDetails, setUserDetails] = useState<IPersonDemographic[]>([]);
  const [formFilled, setFormFilled] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinalFailed, setIsFinalFailed] = useState(false);
  const [openConformationModal, setOpenConformationModal] = useState(false);
  const [fileUploadResponses, setFileUploadResponses] = useState<
    IFileResponse[]
  >([]);
  const [failedUploadResponses, setFailedUploadResponses] = useState<
    FailedFileResponse[]
  >([]);
  const [isHaveFailedUpload, setIsHaveFailedUpload] = useState(false);
  const [isHaveFinalFailedUpload, setIsHaveFainalFailedUpload] =
    useState(false);
  const [isHaveFailedScreenshotUpload, setIsHaveScreenshotFailedUpload] =
    useState(false);
  const [failedUploadFileNames, setFailedUploadFileNames] = useState([]);
  const [finalFailedUploadFileNames, setFinalFailedUploadFileNames] = useState(
    []
  );
  const [finalAttachmentIds, setFinalAttachmentIds] = useState([]);
  let failedUploadNames = [];
  let finalFailedUploadNames = [];
  const translate = useTranslate();
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
    attachScreenShot: false,
    attachments: [],
    phone: "",
    queryType: 1,
  });

  const [queryType, setFeedbackQuery] = useState([]);
  const dataProvider = useDataProvider();
  const { permissions } = usePermissions();
  const { getTrace } = useTraces();
  const [errorSet, setErrorSet] = useState({
    name: {
      0: false,
      1: null,
    },
    email: {
      0: false,
      1: null,
    },
    subject: {
      0: false,
      1: null,
    },
    phone: {
      0: false,
      1: null,
    },
    queryType: {
      0: false,
      1: null,
    },
    description: {
      0: false,
      1: null,
    },
  });
  const clearErrors = () => {
    setErrorSet({
      name: {
        0: false,
        1: null,
      },
      email: {
        0: false,
        1: null,
      },
      subject: {
        0: false,
        1: null,
      },
      phone: {
        0: false,
        1: null,
      },
      queryType: {
        0: false,
        1: null,
      },
      description: {
        0: false,
        1: null,
      },
    });
  };
  const classes = useStyles();
  useEffect(() => {
    if (userInfo.role !== CO_ROLE_ADMIN && open) {
      getUserInfo();
    }

    if (userInfo.id) {
      const userFirstName = userDetails[0]?.firstName || "";
      const userLastName = userDetails[0]?.lastName || "";
      const userPhone = userDetails[0]?.phoneNumber || "";
      const userEmail = userDetails[0]?.electronicDetails || "";

      setFeedback((prevFormState) => ({
        ...prevFormState,
        name: `${userFirstName} ${userLastName}`,
        email: userEmail,
        phone: userPhone,
      }));
    }
  }, [userInfo.id, userDetails, open]);

  const handleBlur = (event): void => {
    event.persist();
    let validationStatus: boolean;
    if (event.target.type !== "checkbox") {
      validationStatus = !event.target.value;
    }
    if (event.target.name === "phone") {
      if (!validationStatus) {
        const validSts = validatePhone(event.target.value);
        if (!validSts) {
          setErrorSet((prev) => ({
            ...prev,
            phone: {
              0: true,
              1: "invalid",
            },
          }));
        }
      }
    }
    if (event.target.name === "subject") {
      if (validationStatus) {
        setErrorSet((prev) => ({
          ...prev,
          subject: {
            0: true,
            1: null,
          },
        }));
      }
      if (!validationStatus) {
        const validSts = validateSubjectLine(event.target.value);
        if (!validSts) {
          setErrorSet((prev) => ({
            ...prev,
            subject: {
              0: true,
              1: "invalid",
            },
          }));
        } else {
          setErrorSet((prev) => ({
            ...prev,
            subject: {
              0: false,
              1: "",
            },
          }));
        }
      }
    }
    if (event.target.name === "email") {
      if (validationStatus) {
        setErrorSet((prev) => ({
          ...prev,
          email: {
            0: true,
            1: null,
          },
        }));
      }
      if (!validationStatus) {
        const validEmail = validateEmail(event.target.value);
        if (!validEmail) {
          setErrorSet((prev) => ({
            ...prev,
            email: {
              0: true,
              1: "invalid",
            },
          }));
        } else {
          setErrorSet((prev) => ({
            ...prev,
            email: {
              0: false,
              1: "",
            },
          }));
        }
      }
    }
    if (event.target.name === "name") {
      if (validationStatus) {
        setErrorSet((prev) => ({
          ...prev,
          name: {
            0: true,
            1: null,
          },
        }));
      }
      if (!validationStatus) {
        const validName = validateString(event.target.value);
        if (!validName) {
          setErrorSet((prev) => ({
            ...prev,
            name: {
              0: true,
              1: "invalid",
            },
          }));
        } else {
          setErrorSet((prev) => ({
            ...prev,
            name: {
              0: false,
              1: "",
            },
          }));
        }
      }
    }
    if (event.target.name === "description") {
      if (validationStatus) {
        setErrorSet((prev) => ({
          ...prev,
          description: {
            0: true,
            1: null,
          },
        }));
      }
      if (!validationStatus) {
        const validSts = validateDescription(event.target.value);
        if (!validSts) {
          setErrorSet((prev) => ({
            ...prev,
            description: {
              0: true,
              1: "invalid",
            },
          }));
        } else {
          setErrorSet((prev) => ({
            ...prev,
            description: {
              0: false,
              1: "",
            },
          }));
        }
      }
    }
  };

  const handleChange = (event): void => {
    setFormFilled(true);
    event.persist();
    setFeedback((prevFormState) => ({
      ...prevFormState,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    }));
  };
  const handleChangePhone = (value): void => {
    setFormFilled(true);
    setFeedback((prevFormState) => ({
      ...prevFormState,
      phone: value,
    }));
  };

  const getFeedbackQuery = (): void => {
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {},
    };

    dataProvider
      .getList("feedbackQueryTypeMasters", queryOption)
      .then(({ data }) => {
        setFeedbackQuery(data);
        setFeedback((prevFormState) => ({
          ...prevFormState,
          queryType: Number(data[0].id),
        }));
      })
      .catch((error) => error);
  };

  function getUserInfo(): void {
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "id", order: "ASC" },
      filter: {
        id: userInfo.id,
      },
    };
    dataProvider
      .getList("personDemographicsDetailsV2", queryOption)
      .then(({ data }) => {
        setUserDetails(data);
      })
      .catch((error) => error);
  }
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (
        localStorage.getItem("authState") &&
        userInfo.role !== CO_ROLE_ADMIN &&
        open
      ) {
        getFeedbackQuery();
      }
    }
    return () => {
      mounted = false;
    };
  }, [open]);

  function blobToFile(theBlob, fileName): any {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  const fileResponseHandler = (response: IFileResponse): void => {
    setFormFilled(true);

    if (response.fileStatus === "removed") {
      setFileUploadResponses((prevResponses) =>
        prevResponses.filter((_, index) => index !== response.index)
      );
    } else {
      setFileUploadResponses((prevResponses) => [...prevResponses, response]);
    }
  };

  const checkValidation = (): void => {
    const hasErrors = Object.values(errorSet).some(
      (fieldErrors) => fieldErrors[0] === true
    );
    if (feedback.subject === "" || feedback.description === "") {
      if (feedback.subject === "") {
        setErrorSet((prev) => ({
          ...prev,
          subject: {
            0: true,
            1: "empty",
          },
        }));
      }

      if (feedback.description === "") {
        setErrorSet((prev) => ({
          ...prev,
          description: {
            0: true,
            1: "empty",
          },
        }));
      }
      if (feedback.name === "") {
        setErrorSet((prev) => ({
          ...prev,
          name: {
            0: true,
            1: "empty",
          },
        }));
      }
      if (feedback.email === "") {
        setErrorSet((prev) => ({
          ...prev,
          email: {
            0: true,
            1: "empty",
          },
        }));
      }
    } else if (hasErrors) {
      return;
    } else {
      submitFeedBack();
    }
  };

  const [subscribeMutation] = useMutation(createFeedbackQuery, {});
  const [subscribeFileUploadMutation] = useMutation(createFileUploadQuery, {});

  const submitFeedBackWithFiles = (successfulUploads: any[]): void => {
    const block = encodeURI(canvased).split(";");
    const contentType = block[0].split(":")[1];
    const realData = block[1].split(",")[1];
    const blob = b64toBlob(realData, contentType);
    if (feedback.attachScreenShot === true) {
      const fileFromBlob = blobToFile(blob, "feedback.png");
      const fileUpload: FileUploadInput = {
        fileName: fileFromBlob,
        fileType: "upload_file_feedback_attachment",
      };
      subscribeFileUploadMutation({
        variables: { input: { fileUpload: fileUpload } },
      })
        .then((res) => {
          if (res.data) {
            const feedBackInp: CreateFeedbackV1Input = {
              email: feedback.email,
              feedbackQueryTypeId: Number(feedback.queryType),
              host: window.location.host,
              name: feedback.name,
              phone: feedback.phone,
              subject: feedback.subject,
              description: feedback.description,
              attachmentIds: [
                ...successfulUploads,
                res.data.createFileUpload.fileUpload.id,
              ],
            };
            subscribeMutation({ variables: { input: feedBackInp } }).then(
              (feedBackInsertionResponse) => {
                setIsLoading(false);
                if (feedBackInsertionResponse.data) {
                  const feedbackResult =
                    feedBackInsertionResponse.data.createFeedbackV1
                      .feedbackResult;
                  const statusCode = JSON.parse(feedbackResult.status).code;
                  if (statusCode === 500) {
                    if (isFailed) {
                      setIsFailed(false);
                      setIsFinalFailed(true);
                    } else {
                      setIsFailed(true);
                    }
                  } else if (statusCode === 201) {
                    if (permissions === CO_ROLE_PPA) {
                      getTrace(
                        "Submitted feedback form by PPA",
                        "ev-119",
                        userInfo.email
                      );
                    } else if (permissions === CO_ROLE_MRA) {
                      getTrace(
                        "Submitted feedback form by MRA",
                        "ev-120",
                        userInfo.email
                      );
                    }
                    if (isFailed) {
                      setIsFailed(false);
                      setIsSuccess(true);
                    } else {
                      setIsSuccess(true);
                      setFeedback({
                        name:
                          userDetails[0].firstName +
                          " " +
                          userDetails[0].lastName,
                        email: userDetails[0].electronicDetails,
                        subject: "",
                        description: "",
                        attachScreenShot: false,
                        attachments: [],
                        phone: userDetails[0].phoneNumber,
                        queryType: 1,
                      });
                      setFileUploadResponses([]);
                      setFinalAttachmentIds([]);
                      setFailedUploadFileNames([]);
                      setFinalFailedUploadFileNames([]);
                      failedUploadNames = [];
                      finalFailedUploadNames = [];
                    }
                  } else {
                    if (isFailed) {
                      setIsFailed(false);
                      setIsFinalFailed(true);
                    } else {
                      setIsFailed(true);
                    }
                  }
                  clearErrors();
                  onClose();
                }
              }
            );
          } else if (res.errors) {
            setIsLoading(false);
            setIsHaveScreenshotFailedUpload(true);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setIsHaveScreenshotFailedUpload(true);
        });
    } else {
      const feedBackInp: CreateFeedbackV1Input = {
        description: feedback.description,
        email: feedback.email,
        feedbackQueryTypeId: Number(feedback.queryType),
        host: window.location.host,
        name: feedback.name,
        phone: feedback.phone,
        subject: feedback.subject,
        attachmentIds: successfulUploads,
      };

      subscribeMutation({ variables: { input: feedBackInp } }).then(
        (feedBackInsertionResponse) => {
          setIsLoading(false);
          if (feedBackInsertionResponse.data) {
            const feedbackResult =
              feedBackInsertionResponse.data.createFeedbackV1.feedbackResult;
            const statusCode = JSON.parse(feedbackResult.status).code;
            if (statusCode === 500) {
              if (isFailed) {
                setIsFailed(false);
                setIsFinalFailed(true);
              } else {
                setIsFailed(true);
              }
            } else if (statusCode === 201) {
              setIsSuccess(true);
              setFeedback({
                name: userDetails[0].firstName + " " + userDetails[0].lastName,
                email: userDetails[0].electronicDetails,
                subject: "",
                description: "",
                attachScreenShot: false,
                attachments: [],
                phone: userDetails[0].phoneNumber,
                queryType: 1,
              });
              setFileUploadResponses([]);
              setFinalAttachmentIds([]);
              setFailedUploadFileNames([]);
              setFinalFailedUploadFileNames([]);
              failedUploadNames = [];
              finalFailedUploadNames = [];
            } else {
              if (isFailed) {
                setIsFailed(false);
                setIsFinalFailed(true);
              } else {
                setIsFailed(true);
              }
            }
          } else {
            if (isFailed) {
              setIsFailed(false);
              setIsFinalFailed(true);
            } else {
              setIsFailed(true);
            }
          }
          clearErrors();
          onClose();
        }
      );
    }
  };

  const retryFileUploads = (
    failedUploads: FailedFileResponse[],
    finalAttachmentIds
  ) => {
    const flattenedFailedUploads = failedUploads.flat();
    const retryPromises = flattenedFailedUploads.map((failedResponse) => {
      const fileUpload: FileUploadInput = {
        fileName: failedResponse.failedResponse.response,
        fileType: failedResponse.failedResponse.name || "",
      };
      return subscribeFileUploadMutation({
        variables: { input: { fileUpload: fileUpload } },
      })
        .then((res) => {
          if (res && res.data && res.data.createFileUpload.fileUpload.id) {
            return res.data.createFileUpload.fileUpload.id;
          } else {
            return {
              error: "Failed to upload file",
              failedResponse: failedResponse,
            };
          }
        })
        .catch((error) => {
          return {
            error: error.message,
            failedResponse: failedResponse,
          };
        });
    });

    Promise.all(retryPromises).then((retryResults) => {
      const successfulRetryUploads = retryResults.filter(
        (retryResults) => retryResults !== null && !retryResults.error
      );
      const failedRetryUploads = retryResults.filter(
        (retryResult) => retryResult !== null && !retryResult.error
      );
      finalFailedUploadNames = failedRetryUploads.map(
        (failedRetryUploads) =>
          failedRetryUploads.failedResponse.failedResponse.response.meta.name
      );

      setFinalFailedUploadFileNames(finalFailedUploadNames);

      const allSuccessfulUploadsAfterRetry = [
        ...finalAttachmentIds,
        ...successfulRetryUploads.map((res) => res),
      ];
      if (failedRetryUploads.length === 0) {
        submitFeedBackWithFiles(allSuccessfulUploadsAfterRetry);
      }
      if (failedRetryUploads.length > 0) {
        setIsHaveFainalFailedUpload(true);
      }
    });
  };

  const submitFeedBack = (): void => {
    setIsLoading(true);
    const uploadPromises = fileUploadResponses.map((response) => {
      if (response.response) {
        const fileUpload: FileUploadInput = {
          fileName: response.response,
          fileType: response.name || "",
        };

        return subscribeFileUploadMutation({
          variables: { input: { fileUpload: fileUpload } },
        })
          .then((res) => {
            if (res?.data?.createFileUpload?.fileUpload.id) {
              return res.data.createFileUpload.fileUpload.id;
            } else {
              return {
                error: "Failed to upload file",
                failedResponse: response,
              };
            }
          })
          .catch((error) => {
            return {
              error: error.message,
              failedResponse: response,
            };
          });
      } else {
        return Promise.resolve(null);
      }
    });
    if (fileUploadResponses.length > 0) {
      Promise.all(uploadPromises).then((uploadResults) => {
        const successfulUploads = uploadResults.filter(
          (uploadResult) => uploadResult !== null && !uploadResult.error
        );
        const finalAttachmentIds = uploadResults.filter(
          (uploadResult) => uploadResult !== null && !uploadResult.error
        );
        setFinalAttachmentIds(finalAttachmentIds);
        const failedUploads: FailedFileResponse[] = uploadResults.filter(
          (uploadResult) => uploadResult !== null && uploadResult.error
        );
        setFailedUploadResponses((prevResponses) => [
          ...prevResponses,
          ...failedUploads, //UC-1: check if logic is correct
        ]);
        failedUploadNames = failedUploads.map(
          (failedUpload) => failedUpload.failedResponse.response.meta.name
        );
        setFailedUploadFileNames(failedUploadNames);
        if (failedUploads.length > 0) {
          setIsHaveFailedUpload(true);
        }
        if (successfulUploads.length >= 0 && failedUploads.length == 0) {
          submitFeedBackWithFiles(finalAttachmentIds);
        }
      });
    } else {
      submitFeedBackWithFiles([]);
    }
  };

  return (
    <>
      {openConformationModal && (
        <BaseModal
          open={openConformationModal}
          confirmAction={() => {
            setFeedback({
              name: userDetails[0].firstName + " " + userDetails[0].lastName,
              email: userDetails[0].electronicDetails,
              subject: "",
              description: "",
              attachScreenShot: false,
              attachments: [],
              phone: userDetails[0].phoneNumber,
              queryType: 1,
            });
            setFileUploadResponses([]);
            setFinalAttachmentIds([]);
            setFailedUploadFileNames([]);
            setFinalFailedUploadFileNames([]);
            failedUploadNames = [];
            finalFailedUploadNames = [];
            setOpenConformationModal(false);
            setFormFilled(false);
            clearErrors();
            onClose();
          }}
          onClose={() => {
            setOpenConformationModal(false);
          }}
          title={translate("resources.feedback.cancelTitle")}
          content={translate("resources.feedback.cancelMessage")}
          type="warning"
          successButtonName="Yes"
          closeButtonName="No"
        />
      )}

      {isFailed && (
        <BaseModal
          open={isFailed}
          confirmAction={() => {
            submitFeedBack();
            setOpenConformationModal(false);
            setIsFailed(false);
          }}
          onClose={() => {
            setOpenConformationModal(false);
            setIsFailed(false);
            setFeedback({
              name: userDetails[0].firstName + " " + userDetails[0].lastName,
              email: userDetails[0].electronicDetails,
              subject: "",
              description: "",
              attachScreenShot: false,
              attachments: [],
              phone: userDetails[0].phoneNumber,
              queryType: 1,
            });
            setFileUploadResponses([]);
            setFailedUploadFileNames([]);
            setFinalFailedUploadFileNames([]);
            finalFailedUploadNames = [];
            failedUploadNames = [];
            setFormFilled(false);
            clearErrors();
            onClose();
          }}
          title={translate("resources.feedback.failedTitle")}
          content={translate("resources.feedback.failedMessage")}
          type="warning"
          successButtonName="Yes"
          closeButtonName="No"
        />
      )}
      {isHaveFailedUpload && (
        <BaseModal
          open={isHaveFailedUpload}
          confirmAction={() => {
            retryFileUploads(failedUploadResponses, finalAttachmentIds);
            setOpenConformationModal(false);
            setIsHaveFailedUpload(false);
            setFileUploadResponses([]);
            setFailedUploadFileNames([]);
            setFinalFailedUploadFileNames([]);
            finalFailedUploadNames = [];
            failedUploadNames = [];
          }}
          onClose={() => {
            setFeedback({
              name: userDetails[0].firstName + " " + userDetails[0].lastName,
              email: userDetails[0].electronicDetails,
              subject: "",
              description: "",
              attachScreenShot: false,
              attachments: [],
              phone: userDetails[0].phoneNumber,
              queryType: 1,
            });
            setFileUploadResponses([]);
            setFinalAttachmentIds([]);
            setFailedUploadFileNames([]);
            setFinalFailedUploadFileNames([]);
            failedUploadNames = [];
            finalFailedUploadNames = [];
            setIsHaveFailedUpload(false);
            setOpenConformationModal(false);
            setFormFilled(false);
            clearErrors();
            onClose();
          }}
          title={translate("resources.feedback.fileUploadFailedTitle")}
          content={translate("resources.feedback.fileUploadFailedMessage")}
          type="feedbackFileUploadError"
          successButtonName="Retry"
          closeButtonName="Cancel"
          feedbackFailedUploads={failedUploadFileNames}
          feedbackFailedSubTitle={translate(
            "resources.feedback.fileUploadFailedSubTitle"
          )}
        />
      )}
      {isHaveFailedScreenshotUpload && (
        <BaseModal
          open={isHaveFailedScreenshotUpload}
          onClose={() => {
            setFeedback({
              name: userDetails[0].firstName + " " + userDetails[0].lastName,
              email: userDetails[0].electronicDetails,
              subject: "",
              description: "",
              attachScreenShot: false,
              attachments: [],
              phone: userDetails[0].phoneNumber,
              queryType: 1,
            });
            setFileUploadResponses([]);
            setFinalAttachmentIds([]);
            setFailedUploadFileNames([]);
            setFinalFailedUploadFileNames([]);
            failedUploadNames = [];
            finalFailedUploadNames = [];
            setIsHaveScreenshotFailedUpload(false);
            setOpenConformationModal(false);
            setFormFilled(false);
            clearErrors();
            onClose();
          }}
          title={translate("resources.feedback.fileUploadFailedTitle")}
          content={translate("resources.feedback.screenShotfailedMessage")}
          type="feedbackError"
          successButtonName="Ok"
          closeButtonName="OK"
        />
      )}
      {isFinalFailed && (
        <BaseModal
          open={isFinalFailed}
          onClose={() => {
            setFeedback({
              name: userDetails[0].firstName + " " + userDetails[0].lastName,
              email: userDetails[0].electronicDetails,
              subject: "",
              description: "",
              attachScreenShot: false,
              attachments: [],
              phone: userDetails[0].phoneNumber,
              queryType: 1,
            });
            setFileUploadResponses([]);
            setFinalAttachmentIds([]);
            setFailedUploadFileNames([]);
            setFinalFailedUploadFileNames([]);
            failedUploadNames = [];
            finalFailedUploadNames = [];
            setIsFinalFailed(false);
            setOpenConformationModal(false);
            setFormFilled(false);
            clearErrors();
            onClose();
          }}
          title={translate("resources.feedback.failedTitle")}
          content={translate("resources.feedback.finalFailedMessage")}
          type="feedbackError"
          successButtonName="Ok"
          closeButtonName="Ok"
        />
      )}
      {isHaveFinalFailedUpload && (
        <BaseModal
          open={isHaveFinalFailedUpload}
          onClose={() => {
            setFeedback({
              name: userDetails[0].firstName + " " + userDetails[0].lastName,
              email: userDetails[0].electronicDetails,
              subject: "",
              description: "",
              attachScreenShot: false,
              attachments: [],
              phone: userDetails[0].phoneNumber,
              queryType: 1,
            });
            setFileUploadResponses([]);
            setFinalAttachmentIds([]);
            setFailedUploadResponses([]);
            setFailedUploadFileNames([]);
            setFinalFailedUploadFileNames([]);
            failedUploadNames = [];
            finalFailedUploadNames = [];
            setIsHaveFainalFailedUpload(false);
            setOpenConformationModal(false);
            setFormFilled(false);
            clearErrors();
            onClose();
          }}
          title={translate("resources.feedback.fileUploadFailedTitle")}
          content={translate("resources.feedback.finallyUploadFailedMessage")}
          type="feedbackFinalFileUploadError"
          successButtonName="Ok"
          closeButtonName="Ok"
          feedbackFailedUploads={finalFailedUploadFileNames}
          feedbackFailedSubTitle={translate(
            "resources.feedback.fileUploadFinallyFailedSubTitle"
          )}
        />
      )}
      {isSuccess && (
        <BaseModal
          open={isSuccess}
          confirmAction={() => {
            setIsSuccess(false);
            setOpenConformationModal(false);
          }}
          onClose={() => {
            setIsSuccess(false);
            setOpenConformationModal(false);
          }}
          title={translate("resources.feedback.successModalSubTitle")}
          content={translate("resources.feedback.successModalMessage")}
          type="feedbackSuccess"
          successButtonName="Ok"
          closeButtonName="Ok"
        />
      )}
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
            if (formFilled) {
              setOpenConformationModal(true);
            } else {
              setFeedback({
                name: userDetails[0].firstName + " " + userDetails[0].lastName,
                email: userDetails[0].electronicDetails,
                subject: "",
                description: "",
                attachScreenShot: false,
                attachments: [],
                phone: userDetails[0].phoneNumber,
                queryType: 1,
              });
              setFileUploadResponses([]);
              setFailedUploadFileNames([]);
              setFinalFailedUploadFileNames([]);
              setFinalAttachmentIds([]);
              failedUploadNames = [];
              finalFailedUploadNames = [];
              clearErrors();
              onClose();
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        <div {...rest} className={clsx(classes.root)}>
          <div className={classes.header}>
            <Typography align="center" gutterBottom variant="h5">
              Support & Feedback!
            </Typography>
            <Typography
              align="center"
              className={classes.subtitle}
              variant="subtitle2"
            >
              Please provide your support and feedback.
            </Typography>
          </div>
          <div className={classes.content}>
            <div style={{ paddingBottom: "2px", paddingTop: "2px" }}>
              <div
                style={{
                  borderLeft: "5px solid  #FF5733 ",
                  backgroundColor: "#FFFFE0",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#585858",
                }}
              >
                <Typography
                  variant="h5"
                  style={{ fontSize: 14, fontWeight: 500 }}
                  gutterBottom
                >
                  Required fields are marked * <br></br>
                  To help us effectively, please provide us with as much
                  information as possible.<br></br>
                  Please avoid entering any sensitive information in this form.
                </Typography>
              </div>
            </div>
            <Grid container spacing={4}>
              <Grid item md={12} xs={12} style={{ padding: "25px 16px 5px" }}>
                <TextField
                  fullWidth
                  label="Email"
                  style={{ fontSize: "14px" }}
                  required
                  error={errorSet.email[0]}
                  helperText={
                    errorSet.email[0]
                      ? errorSet.email[1] === null
                        ? "Please enter email"
                        : "Please enter valid email"
                      : ""
                  }
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={feedback.email}
                  variant="standard"
                />
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: "5px 16px" }}>
                <TextField
                  fullWidth
                  label="Name"
                  style={{ fontSize: "14px" }}
                  required
                  error={errorSet.name[0]}
                  helperText={
                    errorSet.name[0]
                      ? errorSet.name[1] === null
                        ? "Please enter name"
                        : "Please enter valid name"
                      : ""
                  }
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={feedback.name}
                  variant="standard"
                />
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: "5px 16px" }}>
                <MuiPhoneNumber
                  defaultCountry={"us"}
                  onlyCountries={["us"]}
                  disableAreaCodes={true}
                  countryCodeEditable={false}
                  style={{ fontSize: "14px" }}
                  fullWidth
                  error={errorSet.phone[0]}
                  helperText={
                    errorSet.phone[0]
                      ? errorSet.phone[1] === null
                        ? "Please enter phone number"
                        : "Please enter valid phone number"
                      : ""
                  }
                  margin="dense"
                  label="Phone"
                  name="phone"
                  onChange={handleChangePhone}
                  value={feedback.phone}
                  variant="standard"
                />
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: "5px 16px" }}>
                <TextField
                  fullWidth
                  name="queryType"
                  style={{ fontSize: "14px" }}
                  label="Please select a category you need help with: "
                  onChange={handleChange}
                  required
                  select
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{ native: true }}
                  value={feedback.queryType}
                  variant="standard"
                >
                  {queryType.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.value}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: "5px 16px" }}>
                <TextField
                  fullWidth
                  label="Subject"
                  style={{ fontSize: "14px" }}
                  required
                  error={errorSet.subject[0]}
                  helperText={
                    errorSet.subject[0]
                      ? errorSet.subject[1] === null
                        ? "Please enter subject (min 5 characters)"
                        : "Please enter valid subject (min 5 characters)"
                      : ""
                  }
                  name="subject"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={feedback.subject}
                  variant="standard"
                />
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: "5px 16px" }}>
                <Typography
                  variant="h5"
                  style={{ fontSize: 12, color: "gray" }}
                  gutterBottom
                >
                  Description<sup>*</sup>
                </Typography>
                <FormControl fullWidth>
                  <TextField
                    name="description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiline
                    required
                    rows={4}
                    value={feedback.description}
                    variant="outlined"
                    error={errorSet.description[0]}
                    helperText={
                      errorSet.description[0]
                        ? errorSet.description[1] === null
                          ? "Please enter description(min 25 characters)"
                          : "Please enter valid description(min 25 characters)"
                        : ""
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item md={12} xs={12} style={{ padding: "30px 0px 0px" }}>
              <Typography
                variant="h5"
                style={{ fontSize: 12, color: "gray" }}
                gutterBottom
              >
                Attachments(Optional)
              </Typography>

              <FormControlLabel
                name="attachScreenShot"
                onChange={handleChange}
                value={feedback.attachScreenShot}
                control={<Checkbox color="primary" />}
                label="Click to automatically attach a screenshot of this page."
              />
            </Grid>
            {feedback.attachScreenShot && (
              <div
                id="canvaseeee"
                style={{
                  position: "relative",
                  height: "150px",
                }}
              >
                <img
                  src={encodeURI(canvased)}
                  style={{
                    border: " 1px solid #333",
                    borderRadius: "5px",
                    position: "absolute",
                    height: "125px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                />
              </div>
            )}
            <div>
              <Typography variant="h5" style={{ fontSize: 12, color: "gray" }}>
                Attach more file(s)
              </Typography>
              <br />
              <UploadFileDrop
                name="attach_feedback_file"
                fileResponse={fileResponseHandler}
              />
            </div>
          </div>
          <div
            className={classes.actions}
            style={{ position: "relative", marginTop: "4%" }}
          >
            <Button
              variant="contained"
              onClick={() => {
                if (formFilled) {
                  setOpenConformationModal(true);
                } else {
                  setFeedback({
                    name:
                      userDetails[0].firstName + " " + userDetails[0].lastName,
                    email: userDetails[0].electronicDetails,
                    subject: "",
                    description: "",
                    attachScreenShot: false,
                    attachments: [],
                    phone: userDetails[0].phoneNumber,
                    queryType: 1,
                  });
                  setFileUploadResponses([]);
                  setFailedUploadFileNames([]);
                  setFinalFailedUploadFileNames([]);
                  setFinalAttachmentIds([]);
                  failedUploadNames = [];
                  finalFailedUploadNames = [];
                  clearErrors();
                  onClose();
                }
              }}
              style={{
                marginRight: "10px",
                backgroundColor: "grey",
                color: "white",
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => checkValidation()}
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress color="secondary" size={20} />
                ) : (
                  ""
                )
              }
            >
              {isLoading ? "Sending" : "Send Feedback"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

FeedBackForm.propTypes = {
  onClose: PropTypes.func,
  canvased: PropTypes.string,
  open: PropTypes.bool,
};

export default FeedBackForm;
