import type { BaseSyntheticEvent } from "react";
import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Dialog, TextField, Typography, colors } from "@material-ui/core";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: 960,
//   },
//   header: {
//     padding: theme.spacing(3),
//     maxWidth: 720,
//     margin: "0 auto",
//   },
//   content: {
//     padding: theme.spacing(0, 2),
//     maxWidth: 720,
//     margin: "0 auto",
//   },
//   helperText: {
//     textAlign: "right",
//     marginRight: 0,
//   },
//   author: {
//     margin: theme.spacing(4, 0),
//     display: "flex",
//   },
//   avatar: {
//     marginRight: theme.spacing(2),
//   },
//   actions: {
//     backgroundColor: colors.grey[100],
//     padding: theme.spacing(2),
//     display: "flex",
//     justifyContent: "center",
//   },
//   applyButton: {
//     color: theme.palette.common.white,
//     backgroundColor: colors.green[600],
//     "&:hover": {
//       backgroundColor: colors.green[900],
//     },
//   },
// }));
const PREFIX = "Application";
const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  content: `${PREFIX}-content`,
  helperText: `${PREFIX}-helperText`,
  author: `${PREFIX}-author`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`,
  applyButton: `${PREFIX}-applyButton`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    width: 960,
  },
  [`& .${classes.header}`]: {
    padding: theme.spacing(3),
    maxWidth: 720,
    margin: "0 auto",
  },
  [`& .${classes.content}`]: {
    padding: theme.spacing(0, 2),
    maxWidth: 720,
    margin: "0 auto",
  },
  [`& .${classes.helperText}`]: {
    textAlign: "right",
    marginRight: 0,
  },
  [`& .${classes.author}`]: {
    margin: theme.spacing(4, 0),
    display: "flex",
  },
  [`& .${classes.avatar}`]: {
    marginRight: theme.spacing(2),
  },
  [`& .${classes.actions}`]: {
    backgroundColor: colors.grey[100],
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
  [`& .${classes.applyButton}`]: {
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    "&:hover": {
      backgroundColor: colors.green[900],
    },
  },
}));
function Application({
  owner,
  open,
  onClose,
  className,
  ...rest
}): JSX.Element {
  const [value, setValue] = useState("");
  const classes = useStyles();

  const handleChange = (event: BaseSyntheticEvent): void => {
    event.persist();
    setValue(event.target.value);
  };

  return (
    <Dialog maxWidth="lg" onClose={onClose} open={open}>
      <div {...rest} className={clsx(classes.root, className)}>
        <div className={classes.header}>
          <Typography align="center" gutterBottom variant="h3">
            The project owner requires an introduction
          </Typography>
          <Typography align="center" variant="subtitle2">
            Write down a short note with your application regarding why you
            think you&apos;d be a good fit for this position.
          </Typography>
        </div>
        <div className={classes.content}>
          <TextField
            autoFocus
            FormHelperTextProps={{ classes: { root: classes.helperText } }}
            fullWidth
            helperText={`${200 - value.length} characters left`}
            label="Short Note"
            multiline
            onChange={handleChange}
            placeholder="What excites you about this project?"
            rows={5}
            value={value}
            variant="outlined"
          />
          <div className={classes.author}>
            <div>
              <Typography variant="h3">
                {owner.first_name} {owner.last_name}
              </Typography>
              <Typography variant="subtitle2">{owner.email}</Typography>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

Application.propTypes = {
  owner: PropTypes.object.isRequired,
  className: PropTypes.string,
  onApply: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

export default Application;
