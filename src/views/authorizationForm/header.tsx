import * as React from "react";
import { Typography } from "@mui/material";

interface IHeaderProp {
  title: string;
}
export const Header = (props: IHeaderProp): JSX.Element => {
  return (
    <Typography
      component="h1"
      variant="h5"
      style={{ fontWeight: 600, marginBottom: "20px" }}
    >
      {props.title}
    </Typography>
  );
};
