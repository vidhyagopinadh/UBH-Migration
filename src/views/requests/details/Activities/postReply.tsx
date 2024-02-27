import * as React from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     backgroundColor: theme.palette.primary.light,
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   iconClass: {
//     height: "100%",
//     alignItems: "center",
//   },
//   iconPerson: {
//     backgroundColor: "#bdbdbd",
//     height: "100%",
//     alignItems: "center",
//     padding: "0px 15px",
//     borderRadius: 50,
//   },
// }));

const PREFIX = "PostReply";
const classes = {
  root: `${PREFIX}-root`,
  iconClass: `${PREFIX}-iconClass`,
  iconPerson: `${PREFIX}-iconPerson`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    backgroundColor: theme.palette.primary.light,
    marginTop: 20,
    marginBottom: 20,
  },
  [`& .${classes.iconClass}`]: {
    height: "100%",
    alignItems: "center",
  },
  [`& .${classes.iconPerson}`]: {
    backgroundColor: "#bdbdbd",
    height: "100%",
    alignItems: "center",
    padding: "0px 15px",
    borderRadius: 50,
  },
}));

export const PostReply = (props): JSX.Element => {
  const classes = useStyles();
  return (
    <Grid container xs={12} className={classes.root}>
      <Grid item xs={1}>
        <PersonIcon className={classes.iconPerson} />
      </Grid>
      <Grid item xs={10}>
        <form action="" noValidate autoComplete="off">
          <TextField
            fullWidth
            id="outlined-basic"
            label={props.label}
            variant="outlined"
          />
        </form>
      </Grid>
      <Grid item xs={1}>
        <Button className={classes.iconClass}>
          <SendIcon />
        </Button>
      </Grid>
    </Grid>
  );
};
