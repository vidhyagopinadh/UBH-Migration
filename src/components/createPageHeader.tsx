import React from "react";
import PropTypes from "prop-types";
import { Typography, Grid } from "@mui/material";
import { useTranslate } from "react-admin";

interface IProps {
  subTitle: string;
  mainTitle: string;
}
function CreatePageHeader({ subTitle, mainTitle }: IProps): JSX.Element {
  const translate = useTranslate();
  return (
    <div data-testid="test-createHeader" style={{ marginTop: "10px" }}>
      <Grid
        alignItems="flex-end"
        container
        justifyContent="space-between"
        // spacing={3}
      >
        <Grid item>
          <Typography
            data-testid="test-createHeader-title1"
            component="h2"
            gutterBottom
            variant="overline"
          >
            {translate(subTitle)}
          </Typography>
          <Typography
            data-testid="test-createHeader-title2"
            component="h1"
            variant="h5"
            style={{ fontWeight: 500 }}
          >
            {translate(mainTitle)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

CreatePageHeader.propTypes = {
  subTitle: PropTypes.string,
  mainTitle: PropTypes.string,
};

export default CreatePageHeader;
