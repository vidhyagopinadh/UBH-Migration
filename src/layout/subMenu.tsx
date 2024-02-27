import * as React from "react";
import type { FC, ReactElement } from "react";
import { Fragment } from "react";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from "@material-ui/core/List";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import { BootstrapTooltip as Tooltip } from "../components/Tooltip";
import { styled } from "@mui/material/styles";
import { useTranslate } from "react-admin";

// const useStyles = makeStyles((theme) => ({
//   icon: { minWidth: theme.spacing(5) },
//   sidebarIsOpen: {
//     "& a": {
//       paddingLeft: theme.spacing(4),
//       transition: "padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
//     },
//   },
//   sidebarIsClosed: {
//     "& a": {
//       paddingLeft: theme.spacing(2),
//       transition: "padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
//     },
//   },
// }));

const PREFIX = "MyCard";
const classes = {
  icon: `${PREFIX}-icon`,
  sidebarIsOpen: `${PREFIX}-sidebarIsOpen`,
  sidebarIsClosed: `${PREFIX}-sidebarIsClosed`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.icon}`]: {
    minWidth: theme.spacing(5),
  },
  [`& .${classes.sidebarIsOpen}`]: {
    "& a": {
      paddingLeft: theme.spacing(4),
      transition: "padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
    },
  },
  [`& .${classes.sidebarIsClosed}`]: {
    "& a": {
      paddingLeft: theme.spacing(2),
      transition: "padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
    },
  },
}));

interface Props {
  dense: boolean;
  handleToggle: () => void;
  icon: ReactElement;
  isOpen: boolean;
  name: string;
  sidebarIsOpen: boolean;
}

const SubMenu: FC<Props> = ({
  handleToggle,
  sidebarIsOpen,
  isOpen,
  name,
  icon,
  children,
  dense,
}) => {
  const translate = useTranslate();
  const classes = useStyles();

  const header = (
    <MenuItem
      dense={dense}
      button
      onClick={handleToggle}
      style={{ whiteSpace: "break-spaces" }}
    >
      <ListItemIcon className={classes.icon}>
        {isOpen ? <ExpandMore /> : icon}
      </ListItemIcon>
      <Typography variant="inherit" color="textSecondary">
        {name}
      </Typography>
    </MenuItem>
  );
  return (
    <Root>
      {sidebarIsOpen || isOpen ? (
        header
      ) : (
        <Tooltip title={translate(name)} placement="right">
          {header}
        </Tooltip>
      )}
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List
          dense={dense}
          component="div"
          disablePadding
          className={
            sidebarIsOpen ? classes.sidebarIsOpen : classes.sidebarIsClosed
          }
        >
          {children}
        </List>
      </Collapse>
    </Root>
  );
};

export default SubMenu;
