import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import placeHolderImage from "../../images/undraw_empty_xct9.svg";

const useStyles = makeStyles(() => ({
  root: {
    textAlign: "center",
    padding: 20,
  },
  image: {
    height: 240,
    backgroundImage: `url(${placeHolderImage})`,
    backgroundPositionX: "right",
    backgroundPositionY: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
}));

function Placeholder({ ...rest }) {
  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root)} id="test-placeholder">
      <div className={classes.image} />
      <Typography
        variant="h5"
        style={{ fontSize: "14px", paddingTop: "20px", lineHeight: 0 }}
      >
        There&apos;s nothing here...
      </Typography>
    </div>
  );
}

export default Placeholder;
