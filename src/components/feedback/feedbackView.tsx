import React, { useEffect, useState } from "react";
import { useDataProvider } from "react-admin";
import { perPageMax } from "../../utils/pageConstants";
import { getImagesByFileUploadId } from "../../service/restConfig";
import {
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import FileViewer from "../fileViewer";
import MuiPhoneNumber from "material-ui-phone-number";
import CreatePageHeader from "../createPageHeader";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    "& label": {
      marginTop: -3,
    },
  },
  listItems: {
    "&.MuiListItem-gutters": {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
}));

function FeedBackView({ ticket }): JSX.Element {
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const [fileUploadData, setFileUploadData] = useState([]);
  const [attachment, setAttachment] = useState<File>();
  const [uploadFile, setUploadFile] = useState<File>();
  const [feedbackQuery, setFeedbackQuery] = useState("");
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
    phone: "",
    queryType: 1,
  });
  useEffect(() => {
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "feedbackId", order: "ASC" },
      filter: { ticketNumber: ticket },
    };
    dataProvider
      .getList("feedbackDetails", queryOption)
      .then(({ data }) => {
        setFileUploadData(data);
        setFeedback({
          name: data[0].name,
          email: data[0].email,
          subject: data[0].subject,
          description: data[0].description,
          phone: data[0].phone,
          queryType: data[0].feedbackQueryTypeId,
        });
        getFeedbackQuery(data[0].feedbackQueryTypeId);
      })
      .catch((error: any) => error);
    const getFeedbackQuery = (queryType): void => {
      const queryOptionFeedbackQuery = {
        pagination: { page: 1, perPage: perPageMax },
        sort: { field: "id", order: "ASC" },
        filter: { id: queryType },
      };
      dataProvider
        .getList("feedbackQueryTypeMasters", queryOptionFeedbackQuery)
        .then(({ data }) => {
          setFeedbackQuery(data[0].value);
        })
        .catch((error) => error);
    };
  }, []);
  useEffect(() => {
    Object.entries(fileUploadData).forEach((indivFile) => {
      getFileDetails(indivFile[1]);
    });
    function getFileDetails(indivFile) {
      getImagesByFileUploadId({
        fileName: indivFile.attachmentPath,
      }).then((res: Blob) => {
        blobToFile(res, indivFile.attachmentPath, indivFile.fileType);
      });
    }
  }, [fileUploadData]);

  const blobToFile = function (blob, name, fieldName) {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    if (fieldName === "upload_file_feedback_attachment") {
      setAttachment(blob);
    }
    if (fieldName === "upload_file_attach_feedback_file") {
      setUploadFile(blob);
    }
  };
  return (
    <Container maxWidth="xl" style={{ maxWidth: "unset" }}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item id="top">
          <CreatePageHeader
            subTitle="resources.feedback.formSubtitle"
            mainTitle="resources.feedback.formTitle"
          />
        </Grid>
      </Grid>
      <Card className={classes.root}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item md={6} xs={6}>
              <TextField
                fullWidth
                label="Email"
                style={{ fontSize: "14px" }}
                name="email"
                value={feedback.email}
                variant="standard"
              />
            </Grid>
            <Grid item md={6} xs={6}>
              <TextField
                fullWidth
                label="Name"
                style={{ fontSize: "14px" }}
                name="name"
                value={feedback.name}
                variant="standard"
              />
            </Grid>
            <Grid item md={6} xs={6}>
              <MuiPhoneNumber
                defaultCountry={"us"}
                onlyCountries={["us"]}
                disableAreaCodes={true}
                countryCodeEditable={false}
                style={{ fontSize: "14px" }}
                fullWidth
                onChange={null}
                margin="dense"
                label="Phone"
                name="phone"
                value={feedback.phone}
                variant="standard"
              />
            </Grid>
            <Grid item md={6} xs={6}>
              <TextField
                fullWidth
                name="queryType"
                style={{ fontSize: "14px" }}
                label="Feedback Category"
                value={feedbackQuery}
                variant="standard"
              ></TextField>
            </Grid>
            <Grid item md={6} xs={6}>
              <TextField
                fullWidth
                label="Subject"
                style={{ fontSize: "14px" }}
                name="subject"
                value={feedback.subject}
                variant="standard"
              />
            </Grid>
            <Grid item md={6} xs={6}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={feedback.description}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Divider />
          {attachment && (
            <>
              <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
                Attachment
              </Typography>
              <CardContent>
                <FileViewer file={Object(attachment)} />
              </CardContent>
            </>
          )}
          {uploadFile && (
            <>
              <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
                Uploaded File
              </Typography>
              <Grid>
                <FileViewer file={Object(uploadFile)} />
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default FeedBackView;
