import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from "@material-ui/core";
import { BootstrapTooltip as Tooltip } from "./Tooltip";
import { useDataProvider, useTranslate } from "react-admin";
import { getImagesByFileUploadId } from "../service/restConfig";
import noLogo from "../images/noLogo.png";
import idVerifiedIcon from "../images/idVerified.png";
import { Cancel, CheckCircle, Edit } from "@material-ui/icons";
import { ExpandableText } from "./expandableText";
import { blobToFile } from "../utils/images/blobToFile";
const useStyles = makeStyles(() => ({
  root: {
    position: "relative",
    overflow: "hidden",
  },
  image: {
    height: "70px",
    marginBottom: "30px",
    textAlign: "center",
    maxWidth: "50%",
  },

  header: {
    paddingBottom: 0,
  },
  content: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#f5f5f5",
    "&:hover": {
      backgroundColor: "#F0F8FF",
    },
  },
  editIcon: { fontSize: "18px" },
  idVerifiedIcon: {
    float: "right",
    width: "40px",
    height: "auto",
    marginRight: "20px",
    marginLeft: "10px",
  },
  comingButton: {
    textTransform: "none",
    backgroundColor: "grey",
    width: "120px",
  },
  checkIcon: {
    color: "green",
    marginRight: "5px",
  },
  cancelIcon: {
    color: "red",
    marginRight: "5px",
  },
  text: {
    fontWeight: 600,
  },
  iconContainer: {
    float: "right",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0px",
    height: "30px",
    marginBottom: "60px",
  },
  buttonContainer: {
    float: "right",
    display: "flex",
    margin: "10px",
  },
  mainContent: {
    width: "100%",
    textAlign: "center",
    padding: "50px",
  },
}));
function IntegrationCard({ project, ...rest }) {
  const classes = useStyles();
  const history = useHistory();
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const [fileResult, setFileResult] = useState<string>(null);

  async function getFileDetails(picId: string) {
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

  useEffect(() => {
    if (project) {
      if (project.logoFileId) getFileDetails(project.logoFileId);
    }
  }, [project.logoFileId]);
  return (
    <>
      <Card {...rest} className={clsx(classes.root)}>
        <CardContent className={classes.content}>
          <div className={classes.buttonContainer}>
            {project.recordStatusId !== 2 && (
              <Tooltip
                arrow
                placement="top"
                title={translate("tooltip.integration.editIcon")}
              >
                <IconButton
                  onClick={() => {
                    history.push("/integrations/" + project.id);
                  }}
                  className={classes.editButton}
                >
                  <Edit className={classes.editIcon} />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <div className={classes.mainContent}>
            <div
              style={{
                position: "relative",
              }}
            >
              {!project.logoFileId ? (
                <img src={noLogo} className={classes.image} />
              ) : (
                <>
                  {fileResult ? (
                    <img src={fileResult} className={classes.image} />
                  ) : (
                    <CircularProgress className={classes.image} />
                  )}
                </>
              )}
            </div>
            <Typography variant="body1" style={{ marginBottom: "10px" }}>
              <ExpandableText text={project.description} maxLines={3} />
            </Typography>
            {project.recordStatusId === 2 && (
              <Button
                variant="contained"
                className={classes.comingButton}
                disabled
              >
                Coming Soon
              </Button>
            )}
            {project.recordStatusId !== 2 && (
              <div className={classes.iconContainer}>
                {project.partyIdVerification && (
                  <Tooltip
                    arrow
                    placement="top"
                    title={translate("tooltip.integration.idVerifiedIcon")}
                  >
                    <img
                      src={idVerifiedIcon}
                      className={classes.idVerifiedIcon}
                    />
                  </Tooltip>
                )}
                {project.recordStatusId === 1 && (
                  <>
                    <CheckCircle className={classes.checkIcon} />
                    <Typography variant="body1" className={classes.text}>
                      Active
                    </Typography>
                  </>
                )}
                {project.recordStatusId === 3 && (
                  <>
                    <Cancel className={classes.cancelIcon} />
                    <Typography variant="body1" className={classes.text}>
                      Inactive
                    </Typography>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

IntegrationCard.propTypes = {
  project: PropTypes.object.isRequired,
};

export default IntegrationCard;
