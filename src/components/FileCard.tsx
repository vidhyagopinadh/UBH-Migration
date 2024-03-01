import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  colors,
} from "@material-ui/core";
import { BootstrapTooltip as Tooltip } from "./Tooltip";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFileOutlined";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useSelector } from "react-redux";
import type { AppState } from "../types";
const useStyles = makeStyles(() => ({
  root: {},
  media: {
    height: 170,
  },
  placeholder: {
    height: 170,
    backgroundColor: colors.blueGrey[50],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  insertDriveFileIcon: {
    // height: theme.spacing(6),
    // width: theme.spacing(6),
    // fontSize: theme.spacing(6),
  },
  content: {
    padding: 8,
    width: "60%",
    // display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    // justifyContent: "space-between"
  },
  actions: {
    padding: 8,
    justifyContent: "center",
  },
  getAppIcon: {
    // marignRight: theme.spacing(1),
  },
  menu: {
    width: 250,
    maxWidth: "100%",
  },
}));

interface IFile {
  size?: number;
  type?: string;
  name?: string;
}

function FileCard({ fileUrl, file, ...rest }) {
  const classes = useStyles();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [fileVal, setFileVal] = useState<IFile>({});
  useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setEmailNotVerified(true);
    }
  }, []);
  useEffect(() => {
    if (file) {
      setFileVal({
        size: file.size,
        type: file.type,
        name: file.name,
      });
    }
  }, [file]);

  const downloadTap = (url, name) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  return (
    fileVal && (
      <Card
        {...rest}
        className={clsx(classes.root)}
        style={{ display: "inline-flex", position: "relative", width: "100%" }}
      >
        {fileVal.type && fileVal.type.includes("image/") ? (
          <CardMedia
            className={classes.media}
            style={{ height: "50px", width: "20%" }}
            image={fileUrl}
          />
        ) : (
          <div
            className={classes.placeholder}
            style={{ height: "50px", width: "20%" }}
          >
            <InsertDriveFileIcon className={classes.insertDriveFileIcon} />
          </div>
        )}
        <CardContent className={classes.content}></CardContent>
        <Divider />
        <CardActions
          className={classes.actions}
          style={{
            right: "0",
            width: "10%",
          }}
        >
          {!emailNotVerified && (
            <Tooltip title="Download">
              <Button onClick={() => downloadTap(fileUrl, fileVal.name)}>
                <GetAppIcon className={classes.getAppIcon} />
              </Button>
            </Tooltip>
          )}
        </CardActions>
      </Card>
    )
  );
}

FileCard.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  file: PropTypes.object.isRequired,
};

export default FileCard;
