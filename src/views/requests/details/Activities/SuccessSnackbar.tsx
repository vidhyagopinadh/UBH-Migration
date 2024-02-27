import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Snackbar, SnackbarContent, colors } from "@material-ui/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
// const useStyles = makeStyles((theme) => ({
//   content: {
//     backgroundColor: colors.green[600],
//   },
//   message: {
//     display: "flex",
//     alignItems: "center",
//   },
//   icon: {
//     marginRight: theme.spacing(2),
//   },
// }));
const PREFIX = "SuccessSnackbar";
const classes = {
  content: `${PREFIX}-content`,
  message: `${PREFIX}- message`,
  icon: `${PREFIX}-icon`,
};
const Root = styled("div")(({ theme }) => ({
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
}));

function SuccessSnackbar({ open, onClose }): JSX.Element {
  const classes = useStyles();

  return (
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
        variant="outlined"
      />
    </Snackbar>
  );
}

SuccessSnackbar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

SuccessSnackbar.defaultProps = {
  open: true,
  // onClose: () => {},
};

export default SuccessSnackbar;
