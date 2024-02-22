import * as React from "react";
import { Grid, Button, ButtonGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { useNotify } from "react-admin";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.light,
  },
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

interface IPatientContact {
  phoneNumber: string;
  email: string;
}

export const PatientContact = ({
  phoneNumber,
  email,
}: IPatientContact): JSX.Element => {
  const classes = useStyles();
  const notify = useNotify();
  return (
    <Grid container>
      <Grid item xs={12}>
        <ButtonGroup className={classes.buttongroup}>
          <Button
            className={classes.button}
            onClick={() => {
              notify(
                "We're sorry, but that feature is not currently available.",
                "success",
              );
            }}
          >
            <a href={`tel:${phoneNumber}`}>
              <CallOutlinedIcon className={classes.icon} />
            </a>
          </Button>
          <Button
            className={classes.button}
            onClick={() => {
              notify(
                "We're sorry, but that feature is not currently available.",
                "success",
              );
            }}
          >
            <a href="">
              <SmsOutlinedIcon className={classes.icon} />
            </a>
          </Button>
          <Button
            className={classes.button}
            onClick={() => {
              notify(
                "We're sorry, but that feature is not currently available.",
                "success",
              );
            }}
          >
            <a href={`mailto:${email}`}>
              <MailOutlinedIcon className={classes.icon} />
            </a>
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};
