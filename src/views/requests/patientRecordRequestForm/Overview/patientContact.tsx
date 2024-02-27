import * as React from "react";
import { Grid, Button, ButtonGroup } from "@material-ui/core";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { styled } from "@mui/material/styles";

const PREFIX = "PRRPatientContact";
const classes = {
  root: `${PREFIX}-root`,
  buttongroup: `${PREFIX}-buttongroup`,
  icon: `${PREFIX}-icon`,
  button: `${PREFIX}-button`,
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {},
  [`& .${classes.buttongroup}`]: {
    height: 30,
    width: "100%",
    color: "grey",
  },
  [`& .${classes.icon}`]: {
    color: "grey",
  },
  [`& .${classes.button}`]: {
    minWidth: 45,
    paddingTop: 10,
    width: "100%",
  },
}));

export const PatientContact: React.FC = () => {
  return (
    <StyledDiv>
      <Grid container>
        <Grid item xs={12}>
          <ButtonGroup className={classes.buttongroup}>
            <Button className={classes.button}>
              <a href="">
                <CallOutlinedIcon className={classes.icon} />
              </a>
            </Button>
            <Button className={classes.button}>
              <a href="">
                <SmsOutlinedIcon className={classes.icon} />
              </a>
            </Button>
            <Button className={classes.button}>
              <a href="">
                <MailOutlinedIcon className={classes.icon} />
              </a>
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </StyledDiv>
  );
};
