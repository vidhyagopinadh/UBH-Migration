import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { styled } from "@mui/material/styles";
import { colors, Grid, Typography } from "@material-ui/core";
import { useTranslate } from "react-admin";
import Label from "./../../../../components/label";
import { useSelector } from "react-redux";

import type { AppState, IRequestPayload } from "../../../../types";
// const useStyles = makeStyles((theme) => ({
//   root: {},
//   requestStatus: {
//     backgroundColor: theme.palette.primary.light,
//   },
//   label: {
//     marginTop: theme.spacing(1),
//   },
//   shareButton: {
//     backgroundColor: theme.palette.common.white,
//     marginRight: theme.spacing(2),
//   },
//   shareIcon: {
//     marginRight: theme.spacing(1),
//   },
//   applyButton: {
//     color: theme.palette.common.white,
//     backgroundColor: colors.green[600],
//     "&:hover": {
//       backgroundColor: colors.green[900],
//     },
//   },
// }));
const PREFIX = "Header";
const classes = {
  root: `${PREFIX}-root`,
  label: `${PREFIX}- label`,
  shareButton: `${PREFIX}-shareButton`,
  shareIcon: `${PREFIX}-shareIcon`,
  applyButton: `${PREFIX}-applyButton`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {},
  requestStatus: {
    backgroundColor: theme.palette.primary.light,
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
}));
function Header({ request, ...rest }): JSX.Element {
  const classes = useStyles();
  const [requestSet, setRequestSet] = useState<IRequestPayload>({});
  const translate = useTranslate();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer
  );
  useEffect(() => {
    let mounted = true;
    if (request) {
      if (mounted) {
        setRequestSet(request);
      }
    }
    return () => {
      mounted = false;
    };
  }, [userInfoReducer, request]);

  let statuscolor = "rgba(76, 175, 80)";

  if (Object.keys(requestSet).length > 0) {
    if (requestSet.requeststatus === "New") {
      statuscolor = "rgba(255, 152, 0)";
    } else if (requestSet.requeststatus === "Acknowledged") {
      statuscolor = "#0ea34a";
    } else if (requestSet.requeststatus === "Resolved") {
      statuscolor = "#3c57aa";
    } else if (requestSet.requeststatus === "Pending") {
      statuscolor = "#82b3ff";
    } else if (requestSet.requeststatus === "Denied") {
      statuscolor = "#e41e25";
    } else if (requestSet.requeststatus === "Cancelled") {
      statuscolor = "#838383";
    }
  }

  return (
    <div {...rest} className={clsx(classes.root)}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Typography component="h2" gutterBottom variant="overline">
            {translate(`resources.requests.browse`)}
          </Typography>
          <div style={{ display: "inline-flex" }}>
            <Typography component="h1" gutterBottom variant="h5">
              {requestSet.type === "addendum" ? (
                <>Addendum Request</>
              ) : requestSet.type === "Billing" ? (
                <>{requestSet.requestCategoryName}</>
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
    </div>
  );
}

Header.propTypes = {
  request: PropTypes.object,
};

Header.defaultProps = {};

export default Header;
