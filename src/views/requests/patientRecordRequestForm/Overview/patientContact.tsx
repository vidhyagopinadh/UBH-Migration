import * as React from "react";
import { Grid, Button, ButtonGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CallOutlinedIcon from "@material-ui/icons/CallOutlined";
import SmsOutlinedIcon from "@material-ui/icons/SmsOutlined";
import MailOutlinedIcon from "@material-ui/icons/MailOutlined";

const useStyles = makeStyles(() => ({
  root: {},
  buttongroup: {
    height: 30,
    width: "100%",
    color: "grey",
  },
  icon: {
    color: "grey",
  },
  button: {
    minWidth: 45,
    paddingTop: 10,
    width: "100%",
  },
}));

export const PatientContact: React.FC = () => {
  const classes = useStyles();
  return (
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
  );
};
