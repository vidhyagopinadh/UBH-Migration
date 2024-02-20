import React from "react";
import clsx from "clsx";
import placeHolderImage from "../../images/undraw_empty_xct9.svg";
import { styled } from '@mui/material/styles';
import { Typography } from "@mui/material";


const PREFIX = 'Placeholder';
const classes = {
  root: `${PREFIX}-root`,
  image: `${PREFIX}-image`
}
const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    textAlign: "center",
    padding: 20,
  },
  [`& .${classes.image}`]: {
    height: 240,
    backgroundImage: `url(${placeHolderImage})`,
    backgroundPositionX: "right",
    backgroundPositionY: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }
}))

function Placeholder({ ...rest }) {

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
