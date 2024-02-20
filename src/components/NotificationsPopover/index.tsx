import React from "react";
import PropTypes from "prop-types";
import NotificationList from "./NotificationList";
import Placeholder from "./Placeholder";
import { CardHeader, Divider, Popover, colors } from "@mui/material";
import { styled } from '@mui/material/styles';

const PREFIX = 'Notif';
const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  actions: `${PREFIX}-actions`,
}
const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    width: 350,
    maxWidth: "100%",
  },
  [`& .${classes.title}`]: {
    fontSize: "1rem",
  },
  [`& .${classes.actions}`]: {
    backgroundColor: colors.grey[50],
    justifyContent: "center",
  }
}))


function NotificationsPopover({ notifications, anchorEl, open, ...rest }: any) {

  return (
    <StyledDiv>
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
    </StyledDiv>

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
