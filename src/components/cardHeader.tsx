import type { FunctionComponent } from "react";
import React from "react";
import { styled } from "@mui/material/styles";
import { Divider, Typography } from "@mui/material";
// import { Grid, Typography, Divider } from "@material-ui/core";
// import type { PageProps } from "../types";

// const useStyles = makeStyles(() => ({
//   gridItem: {
//     paddingTop: "16px",
//   },
// }));
const PREFIX = "CardHeader";
const classes = {
  gridItem: `${PREFIX}-gridItem`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.gridItem}`]: {
    paddingTop: "16px",
  },
}));
const CardHeader: FunctionComponent<PageProps> = ({
  style = {},
  divider = true,
  children,
}) => {
  return (
    <Root
      item
      md={12}
      xs={12}
      className={classes.gridItem}
      data-testid="test-cardHeader-title"
    >
      <Typography style={style} component="h2" gutterBottom variant="h5">
        {children}
      </Typography>
      {divider && <Divider data-testid="card-header-divider" />}
    </Root>
  );
};

export default CardHeader;
