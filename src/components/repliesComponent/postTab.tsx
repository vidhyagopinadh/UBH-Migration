import * as React from "react";
import { Tabs, Tab, Divider } from "@material-ui/core";
import { PostReply } from "./postReply";
import { CactusComments } from "./CactusComments";
import {
  isCommentProviderIsCactusComment,
  isCommentProviderIsDefaultComment,
} from "../../utils/comments";
import { CO_ROLE_MRA } from "../../utils/roles";
import { useDataProvider, usePermissions } from "react-admin";
import { useMutation } from "@apollo/react-hooks";
import type {
  InsertChatroomDetailsInput,
  InsertChatroomDetailsMutation,
  InsertChatroomDetailsMutationVariables,
} from "../../__generated__/typescript-operations_all";
import insertChatroomDetails from "../../queries/insertChatroomDetails/insertChatroomDetails";
import { perPageMax } from "../../utils/pageConstants";
import type { AppState } from "../../types";
import { useSelector } from "react-redux";

export const PostTab = (props) => {
  const { permissions } = usePermissions();
  const dataProvider = useDataProvider();
  const tabs =
    permissions === CO_ROLE_MRA
      ? [
          { id: "0", value: "postlabel", label: "POST REPLY" },
          { id: "1", value: "postinternalnotes", label: "POST INTERNAL NOTES" },
        ]
      : [{ id: "0", value: "postlabel", label: "POST REPLY" }];
  const [currTab, setCurrTab] = React.useState("postlabel");
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const [emailNotVerified, setEmailNotVerified] = React.useState(false);
  React.useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setEmailNotVerified(true);
    }
  }, []);
  const handleTabsChange = (event: React.ChangeEvent<{}>, value: string) => {
    setCurrTab(value);
    if (value === "postlabel") {
      setApplicationArea("reply-section");
    } else {
      setApplicationArea("internal-note-section");
    }
  };
  const [commentSectionId, setCommentSectionId] = React.useState("");
  const [source, setSource] = React.useState(props.source ? props.source : "");
  const [applicationArea, setApplicationArea] = React.useState("reply-section");
  const [subscribeMutation] = useMutation<
    InsertChatroomDetailsMutation,
    InsertChatroomDetailsMutationVariables
  >(insertChatroomDetails, {});
  const insertRoomDetails = (id) => {
    const commentSectionInput: InsertChatroomDetailsInput = {
      chatRequestId: props.requestId,
      chatRoomId: id,
      appArea: applicationArea,
    };
    subscribeMutation({
      variables: { input: commentSectionInput },
    });
  };
  React.useEffect(() => {
    setCommentSectionId("");
    setSource(props.source ? props.source : "");
    const queryOption = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "requestId", order: "ASC" },
      filter: {
        requestId: props.requestId,
        applicationArea: applicationArea,
      },
    };
    dataProvider.getList("getChatroomDetails", queryOption).then(({ data }) => {
      if (data.length > 0) {
        setCommentSectionId(data[0].chatroomId);
      } else {
        if (currTab === "postlabel") {
          insertRoomDetails(
            props.createdBy.split(" ").join("") +
              "-" +
              source.split(" ").join("") +
              "-" +
              props.patient.split(" ").join("") +
              "/" +
              props.requestId +
              "/reply",
          );
          setCommentSectionId(
            props.createdBy.split(" ").join("") +
              "-" +
              source.split(" ").join("") +
              "-" +
              props.patient.split(" ").join("") +
              "/" +
              props.requestId +
              "/reply",
          );
        } else if (currTab === "postinternalnotes") {
          insertRoomDetails(
            props.createdBy.split(" ").join("") +
              "-" +
              source.split(" ").join("") +
              "-" +
              props.patient.split(" ").join("") +
              "/" +
              props.requestId +
              "/internalnotes",
          );
          setCommentSectionId(
            props.createdBy.split(" ").join("") +
              "-" +
              source.split(" ").join("") +
              "-" +
              props.patient.split(" ").join("") +
              "/" +
              props.requestId +
              "/internalnotes",
          );
        }
      }
    });
  }, [currTab, props.requestId]);
  React.useEffect(() => {
    //
  }, [commentSectionId]);
  return (
    <div>
      <Tabs
        onChange={handleTabsChange}
        scrollButtons="auto"
        style={{ marginTop: "0px" }}
        variant="scrollable"
        value={currTab}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      <Divider />
      {currTab === "postlabel" &&
        (isCommentProviderIsCactusComment && commentSectionId !== "" ? (
          <div style={{ pointerEvents: emailNotVerified ? "none" : "all" }}>
            <CactusComments
              label="POST REPLY"
              commentSectionId={commentSectionId}
            />
          </div>
        ) : isCommentProviderIsDefaultComment ? (
          <PostReply
            label="POST REPLY"
            id="postlabel"
            requestId={props.requestId}
            type={props.type}
            value="postlabel"
            index={0}
          />
        ) : (
          ""
        ))}
      {currTab === "postinternalnotes" &&
        (isCommentProviderIsCactusComment && commentSectionId !== "" ? (
          <div style={{ pointerEvents: emailNotVerified ? "none" : "all" }}>
            <CactusComments
              label="POST INTERNAL NOTES"
              commentSectionId={commentSectionId}
            />
          </div>
        ) : isCommentProviderIsDefaultComment ? (
          <PostReply
            label="POST INTERNAL NOTES"
            id="postinternalnotes"
            requestId={props.requestId}
            type={props.type}
            value="postinternalnotes"
            index={1}
          />
        ) : (
          ""
        ))}
    </div>
  );
};
