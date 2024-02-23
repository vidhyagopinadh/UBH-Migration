import React from "react";
import { Box, Typography } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const PageNotFound = () => {
  return (
    <>
      <Box
        sx={{
          // display: "flex",
          textAlign: "center",
          width: "100%",
          marginTop: "20%",
        }}
      >
        <SentimentDissatisfiedIcon fontSize="large" />
        <Typography fontSize={20}> 404</Typography>
      </Box>
    </>
  );
};

export default PageNotFound;
