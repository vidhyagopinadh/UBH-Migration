import * as React from "react";
import { Tabs, Tab, Divider } from "@material-ui/core";
import { PostReply } from "./postReply";
import { usePermissions } from "react-admin";
import { CO_ROLE_MRA } from "../../../../utils/roles";

export const PostTab = (): JSX.Element => {
  const [currTab, setCurrTab] = React.useState("postlabel");
  const { permissions } = usePermissions();
  const tabs =
    permissions === CO_ROLE_MRA
      ? [
          { id: "0", value: "postlabel", label: "POST REPLY" },
          { id: "1", value: "postinternalnotes", label: "POST INTERNAL NOTES" },
        ]
      : [{ id: "0", value: "postlabel", label: "POST REPLY" }];
  const handleTabsChange = (
    event: React.ChangeEvent<{}>,
    value: string,
  ): void => {
    setCurrTab(value);
  };

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
      {currTab === "postlabel" && (
        <PostReply
          label="POST REPLY"
          id="postlabel"
          value="postlabel"
          index={0}
        />
      )}
      {currTab === "postinternalnotes" && (
        <PostReply
          label="POST INTERNAL NOTES"
          id="postinternalnotes"
          value="postinternalnotes"
          index={1}
        />
      )}
    </div>
  );
};
