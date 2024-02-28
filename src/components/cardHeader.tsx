import type { FunctionComponent } from "react";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Divider } from "@material-ui/core";
import type { PageProps } from "../types";

const useStyles = makeStyles(() => ({
  gridItem: {
    paddingTop: "16px",
  },
}));

const CardHeader: FunctionComponent<PageProps> = ({
  style = {},
  divider = true,
  children,
}) => {
  const classes = useStyles();

  return (
    <Grid
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
    </Grid>
  );
};

export default CardHeader;
