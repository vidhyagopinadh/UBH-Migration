import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import NotificationList from "./NotificationList";
import Placeholder from "./Placeholder";
import { CardHeader, Divider, Popover } from "@mui/material";

const useStyles = makeStyles(() => ({
  root: {
    width: 350,
    maxWidth: "100%",
  },
  title: {
    fontSize: "1rem",
  },
  actions: {
    backgroundColor: colors.grey[50],
    justifyContent: "center",
  },
}));

function NotificationsPopover({ notifications, anchorEl, open, ...rest }) {
  const classes = useStyles();

  return (
    <Popover
      {...rest}
      anchorEl={anchorEl}
      open={open}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <div className={classes.root}>
        <CardHeader
          title="Notifications"
          classes={{
            title: classes.title,
          }}
        />
        <Divider />
        {notifications && notifications.length > 0 ? (
          <NotificationList notifications={notifications} />
        ) : (
          <Placeholder />
        )}
        <Divider />
      </div>
    </Popover>
  );
}

NotificationsPopover.propTypes = {
  anchorEl: PropTypes.any,
  className: PropTypes.string,
  notifications: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default NotificationsPopover;
