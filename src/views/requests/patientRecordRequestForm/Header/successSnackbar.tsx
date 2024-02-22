import React from "react";
import PropTypes from "prop-types";
import { Snackbar, SnackbarContent, colors } from "@material-ui/core";
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import { styled } from '@mui/material/styles';

const PREFIX = 'PRRSuccessSnackbar';

const classes = {
  content: `${PREFIX}-content`,
  message: `${PREFIX}-message`,
  icon: `${PREFIX}-icon`,
}

const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.content}`]: {
    backgroundColor: colors.green[600],
  },
  [`& .${classes.message}`]: {
    display: "flex",
    alignItems: "center",
  },
  [`& .${classes.icon}`]: {
    marginRight: theme.spacing(2),
  },
  
}))

function SuccessSnackbar({ open, onClose }): JSX.Element {
  return (
    <StyledDiv>
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      autoHideDuration={6000}
      onClose={onClose}
      open={open}
    >
      <SnackbarContent
        className={classes.content}
        message={
          <span className={classes.message}>
            <CheckCircleIcon className={classes.icon} />
            Successfully updated status!
          </span>
        }
      />
    </Snackbar>
    </StyledDiv>
  );
}

SuccessSnackbar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

SuccessSnackbar.defaultProps = {
  open: true,
};

export default SuccessSnackbar;
