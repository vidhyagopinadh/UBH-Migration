import type { BaseSyntheticEvent, FC } from "react";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";
import documentImage from "./../images/document.png";
import { imagePdfFormat } from "../utils/fileFormat";
import { useTranslate } from "react-admin";
import { validateFileName } from "../utils/validator";

const useStyles = makeStyles(() => ({
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
  errorInput: {
    width: "100%",
    color: "red",
  },
  description: {
    float: "left",
  },
  fileOuterComponent: {
    width: "300px",
    height: "auto",
    overflow: "hidden",
    paddingTop: "20px",
    paddingBottom: "20px",
  },
  image: {
    width: "300px",
  },
  imageDocument: {
    width: "50px",
  },
}));

interface IUploadFileProp {
  name: string;
  fileResponse: Function;
  description?: string;
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

const UploadFile: FC<IUploadFileProp> = (props) => {
  const classes = useStyles();
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileResult, setFileResult] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const translate = useTranslate();
  const fileComponentName = "upload_file_" + props.name;

  const handleChange = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    const isRightFormat = imagePdfFormat.includes(event.target.files[0].type);
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
      setErrorInput(translate(`resources.requests.error.invalid_file`));
      setFileName("");
      setFileResult("");
      setFileType("");
      props.fileResponse({
        name: fileComponentName,
        response: "",
      });
    }
  };

  return (
    <div>
      <input
        accept="image/*,application/pdf"
        id={fileComponentName}
        multiple
        name={fileComponentName}
        onChange={handleChange}
        className={classes.inputFile}
        type="file"
      />
      <Typography className={classes.errorInput} gutterBottom>
        {errorInput}
      </Typography>
      <label htmlFor={fileComponentName} className={classes.label}>
        <Button
          component="span"
          className={classes.inputButton}
          variant="contained"
          color="secondary"
        >
          Upload
        </Button>
        <input className={classes.inputFileName} value={fileName} disabled />
      </label>
      <br></br>
      <div style={{ display: "flex" }}>
        <div style={{ width: "40%" }}>
          <Typography className={classes.description} gutterBottom>
            {props.description}
          </Typography>
        </div>
        {fileResult && (
          <div className={classes.fileOuterComponent} style={{ width: "60%" }}>
            {fileType === "images" ? (
              <img src={fileResult} className={classes.image} alt={"..."} />
            ) : (
              <>
                <img
                  className={classes.imageDocument}
                  src={documentImage}
                  alt={"..."}
                />
                <br></br>
                <Typography className={classes.description} gutterBottom>
                  {fileName}
                </Typography>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
