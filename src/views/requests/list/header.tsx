import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Grid, Typography } from "@material-ui/core";
import { useTranslate } from "react-admin";
import { styled } from '@mui/material/styles';

const PREFIX = 'RequestList';

const classes = {
  root: `${PREFIX}-root`,
  }
  
const StyledDiv = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
    },
 
  }));

function Header({ className, ...rest }): JSX.Element {
  const translate = useTranslate();
  return (
    <StyledDiv {...rest} className={clsx(classes.root, className)}>
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
      </StyledDiv>
  );
}

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
