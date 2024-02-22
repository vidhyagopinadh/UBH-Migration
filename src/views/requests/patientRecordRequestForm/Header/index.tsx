import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Typography, Grid, colors } from "@material-ui/core";
import { useTranslate } from "react-admin";
import Label from "./../../../../components/label";
import { useSelector } from "react-redux";
import type { AppState, IRequestPayload } from "../../../../types";
import { styled } from '@mui/material/styles';


const PREFIX = 'PRRHeader';

const classes = {
  root: `${PREFIX}-root`,
  label: `${PREFIX}-label`,
  shareButton: `${PREFIX}-shareButton`,
  shareIcon: `${PREFIX}-shareIcon`,
  applyButton: `${PREFIX}-applyButton`,
}

const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    [theme.breakpoints.down("md")]: {
      marginTop: "20px",
    },
  },
  [`& .${classes.label}`]: {
    marginTop: theme.spacing(1),
  },
  [`& .${classes.shareButton}`]: {
    backgroundColor: theme.palette.common.white,
    marginRight: theme.spacing(2),
  },
  [`& .${classes.shareIcon}`]: {
    marginRight: theme.spacing(1),
  },
  [`& .${classes.applyButton}`]: {
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    "&:hover": {
      backgroundColor: colors.green[900],
    },
  },
  
}))

function Header({ request, ...rest }): JSX.Element {
  const [requestSet, setRequestSet] = useState<IRequestPayload>({});
  const translate = useTranslate();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );

  useEffect(() => {
    if (request) {
      setRequestSet(request);
    }
  }, [userInfoReducer, request]);

  let statuscolor = "rgba(76, 175, 80)";

  if (Object.keys(requestSet).length > 0) {
    if (requestSet.requeststatus === "New") {
      statuscolor = "rgba(255, 152, 0)";
    } else if (requestSet.requeststatus === "Acknowledged") {
      statuscolor = "#0ea34a";
    } else if (requestSet.requeststatus === "Resolved") {
      statuscolor = "#3c57aa";
    } else if (requestSet.requeststatus === "On Hold") {
      statuscolor = "#3c57a";
    } else if (requestSet.requeststatus === "Denied") {
      statuscolor = "#e41e25";
    } else if (requestSet.requeststatus === "") {
      statuscolor = "#838383";
    }
  }

  return (
    <StyledDiv {...rest} className={clsx(classes.root)}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Typography component="h2" gutterBottom variant="overline">
            {translate(`resources.requests.browse`)}
          </Typography>
          <div style={{ display: "inline-flex" }}>
            <Typography component="h1" gutterBottom variant="h5">
              {requestSet.type === "addendum" ? (
                <>Addendum Request</>
              ) : (
                <>
                  {Object.entries(requestSet).length > 0 && (
                    <>{requestSet.issueImpactMasterValue}</>
                  )}
                </>
              )}
            </Typography>
            <Label
              className={classes.label}
              color={statuscolor}
              shape="square"
              style={{ margin: "3px 10px" }}
              variant="contained"
            >
              {Object.entries(requestSet).length > 0 && (
                <>{requestSet.requeststatus}</>
              )}
            </Label>
          </div>
        </Grid>
      </Grid>
    </StyledDiv>
  );
}

Header.propTypes = {
  className: PropTypes.string,
  request: PropTypes.object,
};

Header.defaultProps = {};

export default Header;
