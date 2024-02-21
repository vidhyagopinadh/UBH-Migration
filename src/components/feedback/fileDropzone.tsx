import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone-uploader";
import type { IFileWithMeta, StatusValue } from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import { imagePdfFormat } from "../../utils/fileFormat";
import { validateFileName } from "../../utils/validator";
import { Typography } from "@material-ui/core";

const FileDropzone = (props) => {
  const fileComponentName = "upload_file_" + props.name;
  const [existingFileIdentifiers, setExistingFileIdentifiers] = useState([]);
  const [isAutomaticallyRemoved, setIsAutomaticallyRemoved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (props.errorFlag) {
      setErrorMessage("Please attach a logo");
    } else {
      setErrorMessage("");
    }
  }, [props.errorFlag]);
  const getFileIdentifier = (file) => file?.meta?.name;
  const handleChangeStatus = (
    file: IFileWithMeta,
    status: StatusValue,
    allFiles: IFileWithMeta[],
  ) => {
    if (status === "preparing") {
      setErrorMessage("");
    }
    if (status === "done") {
      if (allFiles.length <= 3) {
        if (props.name !== "attach_feedback_file") {
          const image = new Image();
          image.src = URL.createObjectURL(file.file);
          image.onload = () => {
            const maxWidth = 800;
            const maxHeight = 400;
            if (image.width > maxWidth || image.height > maxHeight) {
              setErrorMessage(
                `Image dimensions should be at most ${maxWidth}x${maxHeight}px`,
              );
              setIsAutomaticallyRemoved(true);
              file.remove();
              setTimeout(() => {
                setErrorMessage("");
              }, 3000);
              return;
            } else {
              setErrorMessage("");
            }
          };
        }
        const fileIdentifier = getFileIdentifier(file);
        if (!existingFileIdentifiers.includes(fileIdentifier)) {
          setExistingFileIdentifiers((prevIdentifiers) => [
            ...prevIdentifiers,
            fileIdentifier,
          ]);
          const isRightFormat = imagePdfFormat.includes(file.meta.type);
          const valid = validateFileName(file.meta.name);
          if (isRightFormat && valid) {
            props.fileResponse({
              name: fileComponentName,
              response: file.file,
              fileStatus: status,
              index: allFiles.indexOf(file),
            });
          } else {
            console.error("Invalid file format or filename");
          }
        } else {
          setErrorMessage("File already exists");
          setIsAutomaticallyRemoved(true);
          file.remove();
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
          return;
        }
      } else {
        setErrorMessage("You can only upload up to 3 files");
        setIsAutomaticallyRemoved(true);
        file.remove();
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
        return;
      }
    } else if (status === "error_upload") {
      console.error("Error uploading:", file.xhr?.response);
    } else if (status === "removed") {
      if (!isAutomaticallyRemoved) {
        const removedFileIdentifier = getFileIdentifier(file);
        const updatedIdentifiers = existingFileIdentifiers.filter(
          (identifier) => identifier !== removedFileIdentifier,
        );
        setExistingFileIdentifiers(updatedIdentifiers);
      }
      props.fileResponse({
        name: fileComponentName,
        response: file.file,
        fileStatus: status,
        index: allFiles.indexOf(file),
      });
      setIsAutomaticallyRemoved(false);
    }
  };
  return (
    <>
      <Dropzone
        onChangeStatus={handleChangeStatus}
        accept={
          props.name !== "attach_feedback_file"
            ? "image/*"
            : "image/*,application/pdf"
        }
        inputContent={(files, extra) =>
          props.name !== "attach_feedback_file" ? (
            <div
              style={{
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                color="primary"
                style={{ fontSize: 16, fontWeight: 500, margin: "5px" }}
              >
                Add or drop image here
              </Typography>
              Preferred image formats: SVG, PNG, JPG (max 800x400px).
            </div>
          ) : extra.reject ? (
            props.name !== "attach_feedback_file" ? (
              "Image files only"
            ) : (
              "Image or pdf files only"
            )
          ) : props.name !== "attach_feedback_file" ? (
            "Add or drop image here"
          ) : (
            "Add or drop image(s) or PDF document(s) here."
          )
        }
        maxFiles={props.name !== "attach_feedback_file" ? 1 : 3}
        styles={{
          dropzone: {
            borderColor: props.errorFlag ? "#EE4B2B" : "",
            minHeight: props.name === "attach_profile_picture" ? 200 : "",
          },
          dropzoneReject: {
            borderColor: "#EE4B2B",
            backgroundColor: "#DAA",
          },
          inputLabel: (files, extra) =>
            extra.reject
              ? { color: "#EE4B2B" }
              : {
                  color: "rgba(0, 0, 0, 0.87)",
                  fontSize: "10px",
                  fontWeight: "400",
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                },
        }}
      />
      {errorMessage && (
        <p style={{ color: "#EE4B2B", fontSize: "10px", marginTop: "4px" }}>
          {errorMessage}
        </p>
      )}
    </>
  );
};

export default FileDropzone;
