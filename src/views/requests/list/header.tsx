import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import { useTranslate } from "react-admin";

const useStyles = makeStyles(() => ({
  root: {},
}));

function Header({ className, ...rest }): JSX.Element {
  const classes = useStyles();
  const translate = useTranslate();
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid
        alignItems="flex-end"
        container
        justifyContent="space-between"
        spacing={3}
      >
        <Grid item>
          <Typography component="h2" gutterBottom variant="overline">
            {translate(`resources.requests.browse`)}
          </Typography>
          <Typography component="h1" variant="h5">
            {translate(`resources.requests.see`)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
