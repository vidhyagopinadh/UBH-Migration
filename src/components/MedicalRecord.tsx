import type { BaseSyntheticEvent, FC } from "react";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, Modal } from "@material-ui/core";
import documentImage from "./../images/document.png";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import EditImage from "./editImage";
import { imageFormat } from "../utils/fileFormat";
import { useTranslate } from "react-admin";
import { validateFileName } from "../utils/validator";

const useStyles = makeStyles((theme) => ({
  inputFile: {
    display: "none",
    padding: "5px 15px",
  },
  label: {
    display: "inline-flex",
    width: "70% !important",
    lineHeight: "35px",
    height: "30px",
    fontSize: "12px",
  },
  inputButton: {
    padding: "5px 15px",
    width: "40%",
    float: "right",
    right: "0",
    fontSize: "12px",
    background: "#325774",
    borderTopRightRadius: "0",
    borderBottomRightRadius: "0",
  },
  inputFileName: {
    width: "100%",
    padding: "8px 15px",
    background: "#eee",
    border: "1px solid #ccc",
    borderRadius: " 4px",
    borderTopLeftRadius: "0",
    borderBottomLeftRadius: "0",
    marginLeft: "-5px",
  },
  description: {
    float: "left",
  },
  fileOuterComponent: {
    width: "150px",
    height: "150px",
    overflow: "hidden",

    marginTop: "20px",
    position: "relative",
    border: "2px solid #333",
    borderRadius: "10px",
    borderBottomRightRadius: "20px",
  },
  modal: {
    display: "block",
    justifyItems: "center",
    alignItems: "center",
    marginLeft: 170,
    marginRight: 170,
    marginTop: 40,
    position: "relative",

    overflow: "auto",
  },
  image: {
    width: "auto",
    height: "150px",
    position: "absolute",
    scale: "155%",
    // transform: "translate(-33%,0)",
    top: "0",
    left: "15%",
  },
  imageDocument: {
    width: "150px",
  },
  errorInput: {
    width: "100%",
    padding: "8px 15px",
    color: "red",
    marginLeft: "5px",
  },
  edit: {
    fontSize: "20px",
    position: "absolute",
    marginTop: "150px",
    background: theme.palette.primary.light,
    bottom: "0px",
    right: "0px",
    borderRadius: "100%",
    padding: "5px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  close: {
    // fontSize: "20px",
    position: "absolute",
    //marginTop: "150px",
    background: theme.palette.primary.light,
    // bottom: "0px",
    left: "115px",
    borderRadius: "100%",
    padding: "5px",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

interface IUploadProp {
  name: string;
  fileResponse: Function;
  description?: string;
  deleteImage?: Function;
}

/**
 *
 * @Props
 *
 * - name : string [specify file input name]
 * - fileResponse : Function [returns file object]
 * - description : string (Optional) [description to show under input component]
 *
 */

const Upload: FC<IUploadProp> = (props) => {
  const classes = useStyles();
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileResult, setFileResult] = useState("");
  const [showImageEdit, setShowImageEdit] = useState(false);
  const fileComponentName = "upload_file_" + props.name;
  const editorRef = React.useRef(null);
  const [open, setOpen] = useState(false);
  const [errorInput, setErrorInput] = useState("");
  const translate = useTranslate();
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setShowImageEdit(false);
  };
  function dataURLtoFile(dataUrl) {
    const arr = dataUrl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }
  const handleEdit = (editedImage) => {
    const dataUrl = editedImage.toDataURL();
    setFileResult(dataUrl);
    const imgFile = dataURLtoFile(dataUrl);

    props.fileResponse({
      name: fileComponentName,
      response: imgFile,
    });
  };
  const handleChange = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    const isRightFormat = imageFormat.includes(event.target.files[0].type);
    const valid = validateFileName(event.target.files[0].name);
    if (isRightFormat && valid) {
      setErrorInput("");
      if (event.target.type === "file") {
        if (event.target.files[0].type.includes("image")) {
          setFileType("images");
        } else if (event.target.files[0].type.includes("text")) {
          setFileType("text");
        } else {
          setFileType("document");
        }
        props.fileResponse({
          name: fileComponentName,
          response: event.target.files[0],
        });
        setFileName(event.target.files[0].name);
        setFileResult(URL.createObjectURL(event.target.files[0]));
      }
    } else {
      setErrorInput(translate(`resources.requests.error.invalid_image_file`));
      setFileName("");
      setFileResult("");
      setFileType("");
      props.fileResponse({
        name: fileComponentName,
        response: "",
      });
    }
  };

  function handleStartDraw() {
    setShowImageEdit(true);
    setOpen(true);
  }
  function handleDelete() {
    setFileResult("");
    setFileName("");

    props.deleteImage(true);
  }

  return (
    <div>
      <input
        accept="image/*"
        id={fileComponentName}
        multiple
        name={fileComponentName}
        onChange={handleChange}
        className={classes.inputFile}
        type="file"
      />
      <label htmlFor={fileComponentName} className={classes.label}>
        <Button
          component="span"
          className={classes.inputButton}
          variant="contained"
          color="secondary"
          onClick={handleOpen}
        >
          Upload
        </Button>
        <input className={classes.inputFileName} value={fileName} disabled />
      </label>
      <Typography className={classes.description} gutterBottom>
        {props.description}
      </Typography>
      <Typography className={classes.errorInput}>{errorInput}</Typography>
      <div style={{ display: "-webkit-inline-flex" }}>
        {fileResult && (
          <>
            <div className={classes.fileOuterComponent}>
              {fileType === "images" ? (
                <img
                  ref={editorRef}
                  src={fileResult}
                  className={classes.image}
                  alt={"..."}
                />
              ) : (
                <img
                  className={classes.imageDocument}
                  src={documentImage}
                  alt={"..."}
                />
              )}

              <EditIcon
                onClick={() => handleStartDraw()}
                className={classes.edit}
              />
              <DeleteIcon
                className={classes.close}
                onClick={() => handleDelete()}
              />
            </div>

            {showImageEdit && (
              <Modal
                open={open}
                className={classes.modal}
                onClose={handleClose}
              >
                <EditImage
                  file={fileResult}
                  handleClose={() => handleClose()}
                  imgEditResult={(editedImage) => handleEdit(editedImage)}
                />
              </Modal>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Upload;
