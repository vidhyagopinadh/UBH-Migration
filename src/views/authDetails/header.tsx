import * as React from "react";
import { Typography } from "@material-ui/core";

interface IHeaderProp {
  title: string;
}
export const Header = (props: IHeaderProp): JSX.Element => {
  return (
    <Typography
      component="h1"
      variant="h5"
      style={{ fontWeight: 600, marginTop: "20px", marginBottom: "20px" }}
    >
      {props.title}
    </Typography>
  );
};
