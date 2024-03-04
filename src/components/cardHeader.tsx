import type { FunctionComponent } from "react";
//import React from "react";
//import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Divider } from "@mui/material";
import type { PageProps } from "../types/types";
import { styled } from "@mui/material/styles";

const PREFIX = "CreateRequest";
const classes = {
  gridItem: `${PREFIX}-gridItem`,
};
const StyledDiv = styled("div")(({ theme }) => ({
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
    <StyledDiv>
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
    </StyledDiv>
  );
};

export default CardHeader;
