import type { BaseSyntheticEvent } from "react";
import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Grid } from "@material-ui/core";
import { validateSentance } from "../../../../utils/validator";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//     alignItems: "center",
//   },
//   card: {
//     marginLeft: theme.spacing(2),
//     flexGrow: 1,
//     display: "flex",
//     padding: theme.spacing(2),
//     alignItems: "center",
//   },
//   date: {
//     marginLeft: "auto",
//     flexShrink: 0,
//   },
// }));
const PREFIX = "ReviewForm";
const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  date: `${PREFIX}-date`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
  },
  [`& .${classes.card}`]: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    display: "flex",
    padding: theme.spacing(2),
    alignItems: "center",
  },
  [`& .${classes.date}`]: {
    marginLeft: "auto",
    flexShrink: 0,
  },
}));
function ReviewForm({ submitStatusChange }): JSX.Element {
  const classes = useStyles();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const handleChange = (event): void => {
    setReason(event.target.value);
  };

  const onSubmitTrigger = (): void => {
    if (reason && error === "") {
      submitStatusChange(reason);
    } else {
      setError("Please enter valid remarks");
    }
  };

  const handleValidateOnBlur = (event: BaseSyntheticEvent): void => {
    event.persist();
    if (event.target.value === "") {
      setError("Please enter some remarks");
    } else if (event.target.value) {
      const valid = validateSentance(event.target.value);
      if (valid) {
        setError("");
      } else {
        setError("Please enter valid remarks");
      }
    } else {
      setError("");
    }
  };

  return (
    <Grid className={clsx(classes.root)} container spacing={3}>
      <Grid item lg={12} xl={12} xs={12}>
        <TextField
          fullWidth
          name="reason"
          label="Remarks"
          onBlur={(e) => handleValidateOnBlur(e)}
          error={error ? true : false}
          helperText={error}
          onChange={handleChange}
          style={{ fontSize: "14px" }}
          required
          value={reason}
          variant="standard"
        />
      </Grid>
      <Grid item lg={12} xl={12} xs={12}>
        <Button onClick={onSubmitTrigger} color="primary" variant="contained">
          Submit
        </Button>
      </Grid>
    </Grid>
  );
}

ReviewForm.propTypes = {
  submitStatusChange: PropTypes.func,
};

export default ReviewForm;
