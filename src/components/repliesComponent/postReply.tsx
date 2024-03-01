import type { BaseSyntheticEvent } from "react";
import React, { useState } from "react";
import { usePermissions, useRefresh } from "react-admin";
import { Grid, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/react-hooks";
import PersonIcon from "@material-ui/icons/Person";
import SendIcon from "@material-ui/icons/Send";
import createRequestResponse from "../../queries/createRequestResponse/createRequestResponseQuery";
import type { CreateRequestResponseV1Input } from "../../__generated__/typescript-operations_all";
import useTraces from "../../hooks/useTraces";
import { CO_ROLE_MRA, CO_ROLE_PPA } from "../../utils/roles";
import { correlationConstants } from "../../utils/OT/correlationConstants";
import { useSelector } from "react-redux";
import type { AppState } from "../../types";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.light,
    marginTop: 20,
    marginBottom: 20,
  },
  iconClass: {
    height: "100%",
    alignItems: "center",
  },
  iconPerson: {
    backgroundColor: "#bdbdbd",
    height: "100%",
    alignItems: "center",
    padding: "0px 15px",
    borderRadius: 50,
  },
}));

export const PostReply = (props) => {
  const classes = useStyles();
  const refresh = useRefresh();
  const [contentValue, setContentValue] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const { handleTrace } = useTraces();
  const { permissions } = usePermissions();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const handleContentValue = (event: BaseSyntheticEvent) => {
    setContentValue(event.target.value);
  };

  const submitContent = () => {
    if (contentValue) {
      setError(false);
      setErrorText("");
      const userId = userInfoReducer.id;
      let eventObj = {
        eventTitle: "",
        aecId: "",
        aecIeId: "",
      };
      if (permissions === CO_ROLE_PPA) {
        eventObj = correlationConstants["ev-046"];
      } else if (permissions === CO_ROLE_MRA) {
        eventObj = correlationConstants["ev-097"];
      }
      console.group(
        "%cOT Traces",
        "background-color: #008000 ; color: #ffffff ; font-weight: bold ; padding: 4px ;",
      );
      console.log(eventObj);
      console.groupEnd();
      const inputContext = {
        action: "Post reply and post internal notes are filled by user",
        aecId: eventObj.aecId,
        aecIeId: eventObj.aecIeId,
      };

      if (props.label === "POST REPLY") {
        const createRequestReplyInput: CreateRequestResponseV1Input = {
          type: 2,
          response: contentValue,
          requestId: props.type !== "Billing" ? props.requestId : null,
          repliedBy: userId,
          responseType: 2,
          fingerPrint: "",
          otContext: {
            spanId: "",
            traceFlags: 1,
            traceId: "",
          },
          otTags: {
            name: "",
          },
        };

        handleTrace(
          eventObj.eventTitle,
          inputContext,
          (spanContext: any, fingerprint: any) => {
            createRequestReplyInput.otContext = JSON.stringify(spanContext);
            createRequestReplyInput.fingerPrint = fingerprint;
            createRequestReplyInput.otTags = JSON.stringify({
              name: "Attempt to Post Reply ",
            });
            subscribeReplyMutation({
              variables: {
                input: createRequestReplyInput,
              },
            }).then(() => {
              setContentValue("");
              refresh();
            });
          },
        );
      } else if (props.label === "POST INTERNAL NOTES") {
        const createRequestInternalNoteInput: CreateRequestResponseV1Input = {
          type: 3,
          response: contentValue,
          requestId: props.type !== "Billing" ? props.requestId : null,
          repliedBy: userId,
          responseType: 3,
          fingerPrint: "",
          otContext: {
            spanId: "",
            traceFlags: 1,
            traceId: "",
          },
          otTags: {
            name: "",
          },
        };
        handleTrace(
          eventObj.eventTitle,
          inputContext,
          (spanContext: any, fingerprint: any) => {
            createRequestInternalNoteInput.otContext =
              JSON.stringify(spanContext);
            createRequestInternalNoteInput.fingerPrint = fingerprint;
            createRequestInternalNoteInput.otTags = JSON.stringify({
              name: "Attempt to Post Internal Notes ",
            });
            subscribeReplyMutation({
              variables: {
                input: createRequestInternalNoteInput,
              },
            }).then(() => {
              setContentValue("");
              refresh();
            });
          },
        );
      }
    } else {
      setError(true);
      setErrorText("Please enter content.");
    }
  };

  const [subscribeReplyMutation] = useMutation(createRequestResponse, {});

  return (
    <Grid container item xs={12} className={classes.root}>
      <Grid item xs={1}>
        <PersonIcon className={classes.iconPerson} />
      </Grid>
      <Grid item xs={10}>
        <TextField
          fullWidth
          id="outlined-basic"
          label={props.label}
          variant="outlined"
          error={error}
          helperText={errorText}
          onChange={(e) => handleContentValue(e)}
          value={contentValue}
        />
      </Grid>
      <Grid item xs={1}>
        <Button className={classes.iconClass} onClick={() => submitContent()}>
          <SendIcon />
        </Button>
      </Grid>
    </Grid>
  );
};
