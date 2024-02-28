import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
//import { makeStyles } from "@material-ui/styles";
// import { Avatar, Card, Typography } from "@material-ui/core";
import GetAppIcon from "@mui/icons-material/GetApp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { styled } from "@mui/material/styles";
import { Avatar, Card, Typography } from "@mui/material";

const PREFIX = "PRRActivity";

const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  listItems: `${PREFIX}-listItems`,
  date: `${PREFIX}-date`,
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: "flex",
    alignItems: "center",
  },
  [`& .${classes.card}`]: {
    flexGrow: 1,
    display: "flex",
    border: 0,
    marginLeft: "10px",
    alignItems: "center",
  },
  [`& .${classes.listItems}`]: {
    "&.MuiListItem-gutters": {
      paddingLeft: 0,

      paddingRight: 0,
    },
  },
  [`& .${classes.date}`]: {
    marginLeft: "auto",
    flexShrink: 0,
  },
}));

function Activity({ activity, className, ...rest }): JSX.Element {
  useEffect(() => {
    //
  }, [activity]);

  const avatars = {
    upload_file: (
      <Avatar>
        <GetAppIcon />
      </Avatar>
    ),
    document: (
      <Avatar>
        <ListAltIcon />
      </Avatar>
    ),
    price_change: (
      <Avatar>
        <AttachMoneyIcon />
      </Avatar>
    ),
    contest_created: (
      <Avatar>
        <DashboardIcon />
      </Avatar>
    ),
  };

  return (
    <StyledDiv {...rest} className={clsx(classes.root, className)}>
      {avatars[activity.action_type]}
      <Card className={classes.card}>
        <Typography variant="body1">
          <Typography color="textPrimary" variant="subtitle2">
            {activity.subject}
          </Typography>{" "}
          {activity.requestType === "request" ? (
            activity.requestToken.isFilled ? (
              <>
                <span style={{ fontWeight: "bold", color: "#718cc7" }}>
                  Filled
                </span>{" "}
              </>
            ) : (
              <>
                <span style={{ fontWeight: "bold", color: "#718cc7" }}>
                  Not Filled
                </span>
              </>
            )
          ) : activity.requestToken.signature ? (
            <>
              <span style={{ fontWeight: "bold", color: "#718cc7" }}>
                Signed
              </span>
            </>
          ) : (
            <>
              <span style={{ fontWeight: "bold", color: "#718cc7" }}>
                Not Signed
              </span>{" "}
            </>
          )}
        </Typography>
        <br />
      </Card>
    </StyledDiv>
  );
}

Activity.propTypes = {
  activity: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default Activity;
