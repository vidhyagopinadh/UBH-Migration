import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

import placeHolderImage from "../images/undraw_empty_xct9.svg";
import { usePermissions } from "react-admin";
import { CO_ROLE_MRA } from "../utils/roles";
import type { IEmptyList } from "../types/types";
import { Box, Button, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';

const PREFIX = 'EmptyList';
const classes = {
  image: `${PREFIX}-image`
}
const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.image}`]: {
    width: 500,
    position: "absolute",
    backgroundImage: `url(${placeHolderImage})`,
    backgroundPositionX: "right",
    backgroundPositionY: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    left: "50%",
    transform: "translate(-50%,0)",
  }
}))


const EmptyList = ({ title, buttonTitle }: IEmptyList) => {
  const classes = useStyles();
  const { permissions } = usePermissions();
  return (
    <Box textAlign="center" m={1}>
      <div style={{ position: "relative", height: 400 }}>
        <div className={classes.image} />
      </div>
      <Typography variant="h5" paragraph style={{ color: "#767474" }}>
        {title}
      </Typography>
      {permissions !== CO_ROLE_MRA && (
        <Button
          variant="outlined"
          color="primary"
          component={RouterLink}
          to={`/billingRequestCreate`}
        >
          {buttonTitle}
        </Button>
      )}
    </Box>
  );
};

export default EmptyList;
