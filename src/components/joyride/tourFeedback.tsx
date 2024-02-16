import React, { useState } from "react";
import clsx from "clsx";
// import { makeStyles } from "@material-ui/styles";
// import { TextField } from "@material-ui/core";
//import { useDispatch } from "react-redux";
import { changeFeedbackAction } from "../../configuration/actions/feedbackChangeActions";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { TextField } from "@mui/material";
import { styled } from '@mui/material/styles';

const PREFIX = 'TourFD';
const classes = {
  root: `${PREFIX}-root`,

}
const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    textAlign: "center",
    alignItems: "center",
  }
}))

function TourFeedback() {
  const classes = useStyles();
  //const dispatch = useDispatch();
  const [feedback, setFeedback] = useState<string>(null);
  const [rating, setRating] = useState(0);

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
    // dispatch(
    //   changeFeedbackAction({
    //     feedbackData: feedback,
    //     rating: rating,
    //   }),
    // );
  };
  return (
    <div className={clsx(classes.root)}>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          onClick={() => handleStarClick(index)}
          style={{ cursor: "pointer" }}
        >
          {index < rating ? (
            <StarIcon style={{ color: "#0047ab", margin: "16px" }} />
          ) : (
            <StarBorderIcon style={{ margin: "16px" }} />
          )}
        </span>
      ))}
      <TextField
        fullWidth
        multiline
        required
        variant="outlined"
        rows={5}
        margin="dense"
        name="feedback"
        placeholder="Enter feedback here ...."
        style={{
          backgroundColor: "#ffffff",
          border: "none",
          borderRadius: "10px",
        }}
        value={feedback}
        onChange={(event) => {
          // dispatch(
          //   changeFeedbackAction({
          //     feedbackData: event.target.value,
          //     rating: rating,
          //   }),
          // );
          setFeedback(event.target.value);
        }}
      />
    </div>
  );
}

export default TourFeedback;
