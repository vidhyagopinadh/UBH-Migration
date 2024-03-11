import React, { useContext, useState } from "react";
// import { colors, Container, Divider, Grid, Tab, Tabs } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import Profile from "./profile";
import AccountInformation from "./accountinformation";
import OrganizationDetails from "./organizationDetails";
import NotificationDetails from "./notificationDetails";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
// import CorporateFareIcon from "@mui/icons-material/CorporateFare";
// import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import CreatePageHeader from "../createPageHeader";
// import { PlaylistAddCheck } from "@material-ui/icons";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import IdVerification from "./IdVerification";
import { useNavigate } from "react-router";
// import type { AppState } from "../../types";
// import { useSelector } from "react-redux";
import { CO_ROLE_PATIENT } from "../../utils/roles";
import { Container, Divider, Grid, Tab, Tabs, colors } from "@mui/material";
import { UserContext } from "../../contexts";

// const useStyles = makeStyles((theme) => ({
//   tabs: {
//     marginTop: theme.spacing(3),
//   },
//   divider: {
//     backgroundColor: colors.grey[300],
//   },
//   content: {
//     marginTop: theme.spacing(3),
//   },
// }));

const PREFIX = "AccountDetails";
const classes = {
  tabs: `${PREFIX}-tabs`,
  divider: `${PREFIX}-divider`,
  content: `${PREFIX}-content`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.tabs}`]: {
    marginTop: theme.spacing(3),
  },
  [`& .${classes.divider}`]: {
    backgroundColor: colors.grey[300],
  },
  [`& .${classes.content}`]: {
    marginTop: theme.spacing(3),
  },
}));

const AccountDetails = (props): JSX.Element => {
  const navigate = useNavigate();
  // const userInfoReducer = useSelector(
  //   (state: AppState) => state.userInfoReducer
  // );
  const userInfoReducer: any = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(props.tab);
  const [tabs, setTabs] = useState(
    userInfoReducer.role !== CO_ROLE_PATIENT
      ? [
          {
            value: "myAccount",
            label: "My Profile",
            icon: <AccountCircleIcon />,
          },
          {
            value: "idVerification",
            label: "Id Verification",
            icon: <PlaylistAddCheckIcon />,
          },
        ]
      : [
          {
            value: "myAccount",
            label: "My Profile",
            icon: <AccountCircleIcon />,
          },
        ]
  );
  const handleTabChange = (selectedTab) => {
    navigate(`/profile/${selectedTab}`);
    setActiveTab(selectedTab);
  };
  React.useEffect(() => {
    setActiveTab(props.tab);
  }, [props.tab, activeTab]);
  React.useEffect(() => {
    setTabs(
      userInfoReducer.role === CO_ROLE_PATIENT
        ? [
            {
              value: "myAccount",
              label: "My Profile",
              icon: <AccountCircleIcon />,
            },
            {
              value: "idVerification",
              label: "Id Verification",
              icon: <PlaylistAddCheckIcon />,
            },
            // {
            //   value: "Account Information",
            //   label: "Account Information",
            //   icon: <ManageAccountsIcon />,
            // },
            // {
            //   value: "My Organization",
            //   label: "My Organization",
            //   icon: <CorporateFareIcon />,
            // },
            // {
            //   value: "Notification Settings & Preferences",
            //   label: "Notification Settings & Preferences",
            //   icon: <CircleNotificationsIcon />,
            // },
          ]
        : [
            {
              value: "myAccount",
              label: "My Profile",
              icon: <AccountCircleIcon />,
            },
            // {
            //   value: "Account Information",
            //   label: "Account Information",
            //   icon: <ManageAccountsIcon />,
            // },
            // {
            //   value: "My Organization",
            //   label: "My Organization",
            //   icon: <CorporateFareIcon />,
            // },
            // {
            //   value: "Notification Settings & Preferences",
            //   label: "Notification Settings & Preferences",
            //   icon: <CircleNotificationsIcon />,
            // },
          ]
    );
  }, [userInfoReducer.role]);
  const renderTabContent = () => {
    switch (activeTab) {
      case "myAccount":
        return <Profile {...props} />;
      case "idVerification":
        return <IdVerification {...props} />;
      case "accountInformation":
        return <AccountInformation {...props} />;
      case "My Organization":
        return <OrganizationDetails {...props} />;
      case "Notification Settings & Preferences":
        return <NotificationDetails {...props} />;
      default:
        return null;
    }
  };

  const getTabStyle = (tabValue) => {
    if (activeTab === tabValue) {
      return { color: "blue" };
    }
    return {};
  };

  const formatLabel = (label) => {
    return label
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div id="accountDetails">
      <div>
        <Tabs
          className={classes.tabs}
          scrollButtons="auto"
          value={activeTab}
          id={activeTab}
          style={{ marginTop: "0px" }}
          variant="scrollable"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              icon={tab.icon}
              id={tab.value}
              onClick={() => {
                handleTabChange(tab.value);
              }}
              label={formatLabel(tab.label)}
              value={tab.value}
              style={{ textTransform: "none", ...getTabStyle(tab.value) }}
            />
          ))}
        </Tabs>
        <Divider className={classes.divider} />
        <div className={classes.content}>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export const AccountShow = (props): JSX.Element => {
  return (
    <Container
      maxWidth="xl"
      style={{ maxWidth: "unset", paddingRight: "5px", paddingLeft: "5px" }}
    >
      <Grid alignItems="flex-end" container>
        <Grid item id="top">
          <CreatePageHeader
            subTitle=""
            mainTitle="resources.accountSetting.title"
          />
        </Grid>
      </Grid>
      <AccountDetails {...props} />
    </Container>
  );
};
