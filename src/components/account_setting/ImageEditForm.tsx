import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import blank from "../../images/blank.png";
import {
  Button,
  Dialog,
  Typography,
  IconButton,
  CircularProgress,
  InputLabel,
} from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import type { FileUploadInput } from "../../__generated__/typescript-operations_all";
import { useMutation } from "@apollo/react-hooks";
import createFileUploadQuery from "../../queries/createFileUpload/createFileUploadQuery";
import type { AppState, IFileResponse } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import FileDropzone from "../feedback/fileDropzone";
import { CardHeader, Divider } from "semantic-ui-react";
import updatePersonalProfilePic from "../../queries/updateProfilePic/updatePersonalProfilePic";
import { userInfoAction } from "../../configuration/actions/userInfoActions";
import secureLocalStorage from "react-secure-storage";
import { useNotify, useTranslate } from "react-admin";
import { CropImage } from "../cropImage";
import { Crop, Delete } from "@material-ui/icons";
import { Upload } from "@mui/icons-material";
import BaseModal from "../baseModal";
const useStyles = makeStyles(() => ({
  root: {
    padding: "30px",
    width: "100%",
    margin: "0 auto",
  },
  header: {
    maxWidth: "100%",
    margin: "0 auto",
    textAlign: "center",
    marginBottom: "20px",
  },
  content: {
    maxWidth: "100%",
    margin: "0 auto",
    textAlign: "center",
    marginTop: "20px",
  },
  image: {
    width: "150px",
    height: "120px",
    borderRadius: "50%",
  },
  cancel: {
    marginRight: "10px",
    backgroundColor: "grey",
    color: "white",
    textTransform: "none",
  },
  dialogContainer: {
    overflow: "hidden",
  },
  dialogContent: {
    maxHeight: "100%",
    overflow: "auto",
  },

  closeIcon: {
    position: "absolute",
    top: "8px",
    right: "8px",
  },
}));

function ImageEditForm({ open, onClose, profilePic, ...rest }): JSX.Element {
  const dispatch = useDispatch();
  const notify = useNotify();
  const translate = useTranslate();
  const [fileResult, setFileResult] = useState(blank);
  const [crop, setCrop] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [subscribeFileUploadMutation] = useMutation(createFileUploadQuery, {});
  const [subscribeUpdateProfilePicMutation] = useMutation(
    updatePersonalProfilePic,
    {},
  );
  const [cropped, setCropped] = useState(null);
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [fileUploadResponse, setFileUploadResponse] = useState(null);
  const classes = useStyles();
  const fileResponseHandler = (response: IFileResponse): void => {
    if (response.fileStatus === "removed") {
      setFileUploadResponse(null);
      setFileResult(null);
    } else {
      setFileUploadResponse(response);
      setFileResult(URL.createObjectURL(response.response));
    }
  };
  const removeProfilePic = (): void => {
    setConfirmDelete(false);
    subscribeUpdateProfilePicMutation({
      variables: {
        input: { profileImageId: null },
      },
    }).then((response) => {
      if (response.data.updatePersonProfilePic.requestResult.success) {
        notify(translate("resources.accountSetting.removeSuccess"), {
          type: "success",
        });
        dispatch(
          userInfoAction({
            username: userInfoReducer.userName,
            firstName: userInfoReducer.firstName,
            lastName: userInfoReducer.lastName,
            email: userInfoReducer.email,
            name: userInfoReducer.name,
            groups: userInfoReducer.groups,
            role: secureLocalStorage.getItem("role") + "",
            id: userInfoReducer.id,
            emailVerified: userInfoReducer.emailVerified,
            profilePicId: null,
          }),
        );
      } else {
        notify(translate("resources.accountSetting.removeError"), {
          type: "warning",
        });
      }
      onClose();
      setShowLoader(false);
      setUploaded(false);
      setFileResult(null);
      setCrop(false);
    });
  };
  const uploadProfile = (): void => {
    setShowLoader(true);
    if (fileUploadResponse) {
      const fileUpload: FileUploadInput = {
        fileName: cropped ? cropped : fileUploadResponse.response,
        fileType: "upload_file_profile_picture",
      };
      subscribeFileUploadMutation({
        variables: { input: { fileUpload: fileUpload } },
      }).then((res) => {
        subscribeUpdateProfilePicMutation({
          variables: {
            input: { profileImageId: res.data.createFileUpload.fileUpload.id },
          },
        }).then((response) => {
          if (response.data.updatePersonProfilePic.requestResult.success) {
            notify(translate("resources.accountSetting.uploadSuccess"), {
              type: "success",
            });
            dispatch(
              userInfoAction({
                username: userInfoReducer.userName,
                firstName: userInfoReducer.firstName,
                lastName: userInfoReducer.lastName,
                email: userInfoReducer.email,
                name: userInfoReducer.name,
                groups: userInfoReducer.groups,
                role: secureLocalStorage.getItem("role") + "",
                id: userInfoReducer.id,
                emailVerified: userInfoReducer.emailVerified,
                profilePicId: res.data.createFileUpload.fileUpload.id,
              }),
            );
          } else {
            notify(translate("resources.accountSetting.uploadError"), {
              type: "warning",
            });
          }
          onClose();
          setShowLoader(false);
          setUploaded(false);
          setFileResult(null);
          setCrop(false);
        });
      });
    }
  };
  return (
    <>
      {confirmDelete && (
        <BaseModal
          open={confirmDelete}
          confirmAction={removeProfilePic}
          onClose={() => setConfirmDelete(false)}
          title={translate("resources.accountSetting.deleteConfirmTitle")}
          content={translate("resources.accountSetting.deleteConfirmMessage")}
          successButtonName="Confirm"
          type="delete"
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
            setUploaded(false);
            setShowLoader(false);
            setFileResult(null);
            setCrop(false);
            onClose();
          }}
        >
          <CloseIcon />
        </IconButton>
        <div {...rest} className={clsx(classes.root)}>
          <div className={classes.header}>
            {crop ? (
              <CardHeader>
                <Typography align="center" gutterBottom variant="h5">
                  <b>Crop & Rotate</b>{" "}
                </Typography>
              </CardHeader>
            ) : (
              <>
                {" "}
                {!uploaded ? (
                  <>
                    <CardHeader>
                      <Typography align="center" gutterBottom variant="h5">
                        <b>Add profile picture</b>{" "}
                      </Typography>
                    </CardHeader>
                    <InputLabel style={{ marginTop: "20px" }}>
                      Add a profile picture to personalize your account
                    </InputLabel>
                    <Divider />
                    {profilePic && (
                      <img src={profilePic} className={classes.image} />
                    )}
                  </>
                ) : (
                  <>
                    <CardHeader>
                      <Typography align="center" gutterBottom variant="h5">
                        <b>Your new profile picture</b>{" "}
                      </Typography>
                    </CardHeader>
                    <Divider />
                  </>
                )}{" "}
              </>
            )}
          </div>
          <div className={classes.content}>
            {crop ? (
              <CropImage
                imgSrc={fileResult}
                setCropView={setCrop}
                setUploaded={setUploaded}
                setFileResult={setFileResult}
                setCropped={setCropped}
              />
            ) : (
              <>
                {!uploaded ? (
                  <FileDropzone
                    name="attach_profile_picture"
                    fileResponse={fileResponseHandler}
                  />
                ) : (
                  <>
                    <img
                      src={fileResult}
                      className={classes.image}
                      alt={"..."}
                    />
                    <InputLabel style={{ marginTop: "20px" }}>
                      Please review your new profile picture. Click the 'Save as
                      Profile Picture' button to confirm.
                    </InputLabel>
                  </>
                )}
              </>
            )}
          </div>
          {!crop && (
            <>
              {!uploaded ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "30px",
                  }}
                >
                  <Button
                    variant="contained"
                    className={classes.cancel}
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      backgroundColor:
                        !fileResult || fileResult === blank ? "grey" : "",
                      textTransform: "none",
                      color: "white",
                    }}
                    disabled={!fileResult || fileResult === blank}
                    onClick={() => {
                      setUploaded(true);
                      setCrop(false);
                    }}
                    startIcon={<Upload style={{ color: "white" }} />}
                  >
                    Upload
                  </Button>
                  {!crop && (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        backgroundColor:
                          !fileResult || fileResult === blank ? "grey" : "",
                        textTransform: "none",
                        marginLeft: "10px",
                        color: "white",
                      }}
                      disabled={!fileResult || fileResult === blank}
                      onClick={() => {
                        setCrop(true);
                      }}
                      startIcon={<Crop style={{ color: "white" }} />}
                    >
                      Crop
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: profilePic === blank ? "grey" : "red",
                      textTransform: "none",
                      color: "white",
                      marginLeft: "10px",
                    }}
                    disabled={profilePic === blank}
                    onClick={() => {
                      setConfirmDelete(true);
                    }}
                    startIcon={<Delete style={{ color: "white" }} />}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "30px",
                  }}
                >
                  <Button
                    variant="contained"
                    className={classes.cancel}
                    onClick={() => {
                      onClose();
                      setUploaded(false);
                      setShowLoader(false);
                      setFileResult(null);
                      setCrop(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={uploadProfile}
                    style={{ textTransform: "none" }}
                    startIcon={
                      showLoader ? (
                        <CircularProgress color="secondary" size={20} />
                      ) : (
                        ""
                      )
                    }
                  >
                    {!showLoader
                      ? "Save as profile picture"
                      : "Uploading image"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Dialog>
    </>
  );
}

ImageEditForm.propTypes = {
  onClose: PropTypes.func,
  canvased: PropTypes.string,
  open: PropTypes.bool,
};

export default ImageEditForm;
