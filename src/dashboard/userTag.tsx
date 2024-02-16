import { Typography } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { useTranslate } from "react-admin";


const UserTag: FC = () => {
  const translate = useTranslate();
  return (
    <div style={{ marginLeft: "10px" }}>
      <Typography component="h2" variant="overline">
        {translate("pos.dashboard.userTag.title")}
      </Typography>
      <Typography
        component="h1"
        gutterBottom
        variant="h5"
        style={{ fontWeight: 500 }}
      >
        {translate("pos.dashboard.userTag.greetings")}
        {localStorage.getItem("User")}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {translate("pos.dashboard.userTag.tagLine")}
      </Typography>
    </div>
  );
};

export default UserTag;
