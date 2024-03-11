import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AppBar,
  MenuItemLink,
  UserMenu,
  useDataProvider,
  usePermissions,
  useTranslate,
} from "react-admin";
import LogoutModal from "../components/logoutModal";
import {
  Avatar,
  Badge,
  IconButton,
  Toolbar,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import type { Theme } from "@mui/material";
import { UserContext } from "../contexts";
import { getImagesByFileUploadId } from "../service/restConfig";
import logo from "../images/logo.png";
import NotificationsPopover from "../components/NotificationsPopover";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useLogout from "../hooks/useLogout";
import { useMutation } from "@apollo/client";
import PersonIcon from "@mui/icons-material/Person";
import {
  CO_NAME_GUEST,
  CO_ROLE_ADMIN,
  CO_ROLE_GUEST,
  CO_ROLE_MRA,
  CO_ROLE_PATIENT,
  CO_ROLE_PPA,
} from "../lib/universal/utils/roles";
import createNotificationRead from "../queries/createNotificationRead/createNotificationRead";
import secureLocalStorage from "react-secure-storage";
import { perPageMax } from "../lib/universal/utils/pageConstants";
import { blobToFile } from "../lib/universal/utils/images/blobToFile";

const customStyle = {
  zIndex: 999,
  visibility: "visible",
};
const PREFIX = "AppBar";
const classes = {
  title: `${PREFIX}-title`,
  spacer: `${PREFIX}-spacer`,
  hideRefreshButton: `${PREFIX}-hideRefreshButton`,
  denseToolbar: `${PREFIX}-denseToolbar`,
  appBarToolbar: `${PREFIX}-appBarToolbar`,
  logoutButton: `${PREFIX}-logoutButton`,
};
const StyledDiv = styled("div")(({ theme }) => ({
  [`&.${classes.title}`]: {
    flex: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    paddingLeft: "25px",
  },
  [`& .${classes.spacer}`]: {
    flex: 1,
  },
  [`& .${classes.hideRefreshButton}`]: {
    '& header.MuiPaper-root .MuiButtonBase-root[aria-label="Refresh"]': {
      display: "none",
    },
  },
  [`& .${classes.denseToolbar}`]: {
    minHeight: "50px",
    width: "10px",
    "&.RaAppBar-toolbar-19": {
      borderBottom: "0px solid #c0cbdd !important",
      paddingRight: "0px !important",
    },
  },
  [`& .${classes.appBarToolbar}`]: {
    borderBottom: "3px solid #6d8fcc !important",
    paddingRight: "24px !important",
    minHeight: "54px !important",
  },
  [`& .${classes.logoutButton}`]: {
    marginLeft: "-10px",
    marginRight: "10px",
  },
}));

const MyCustomIcon = () => {
  const dataProvider = useDataProvider();
  // const userInfo = useSelector((state: AppState) => state.userInfoReducer);
  const userInfo = useContext(UserContext);
  const [fileResult, setFileResult] = useState(null || "");
  // useEffect(() => {
  //   if (userInfo.profilePicId) {
  //     getFileDetails(userInfo.profilePicId);
  //   } else {
  //     setFileResult(null);
  //   }
  // }, [userInfo]);
  function getFileDetails(picId: string): void {
    const queryOptionFile: any = {
      pagination: { page: 1, perPage: 1 },
      sort: { field: "id", order: "ASC" },
      filter: {
        id: picId,
      },
    };
    dataProvider.getList("fileUploads", queryOptionFile).then(({ data }) => {
      if (data.length > 0) {
        getImagesByFileUploadId({
          fileName: data[0].fileName,
        }).then((res: any) => {
          let fileobj: any = blobToFile(res, data[0].fileName);
          setFileResult(URL.createObjectURL(fileobj));
        });
      }
    });
  }
  return (
    <div id="accountSettings" style={{ display: "flex", alignItems: "center" }}>
      <Avatar
        sx={{
          height: 30,
          width: 30,
        }}
        src={fileResult}
      />
      {useMediaQuery((theme: Theme) => theme.breakpoints.up("md")) && (
        <Typography
          variant="body1"
          style={{ marginLeft: "5px", fontWeight: 500, fontSize: "14px" }}
        >
          {userInfo.name}
        </Typography>
      )}
    </div>
  );
};
const ProfileMenu = forwardRef<any, any>((props, ref) => {
  const translate = useTranslate();
  // const { getTrace } = useTraces();
  // const userInfoReducer = useSelector(
  //   (state: AppState) => state.userInfoReducer
  // );
  // ConfigurationMenu.displayName = "MyProfile";
  return (
    // <MenuItemLink
    //   ref={ref}
    //   to="/profile/myAccount"
    //   primaryText={translate("pos.profile")}
    //   leftIcon={<Person />}
    //   onClick={() => {
    //     if (userInfoReducer.role === CO_ROLE_PATIENT) {
    //       getTrace("Select Profile", "ev-148", userInfoReducer.email);
    //     }
    //     props.onClick();
    //   }}
    //   sidebarIsOpen
    // />
    <MenuItemLink
      ref={ref}
      to="/profile/myAccount"
      primaryText={translate("pos.profile")}
      leftIcon={<PersonIcon />}
      onClick={() => {
        // if (userInfoReducer.role === CO_ROLE_PATIENT) {
        //   getTrace("Select Profile", "ev-148", userInfoReducer.email);
        // }
        props.onClick && props.onClick();
      }}
      sidebarIsOpen={true} // sidebarIsOpen is now a boolean property
    />
  );
});
const CustomUserMenu = (props: any): JSX.Element => {
  const [openLogoutModal, setOpenLogoutModal] = useState<boolean>(false);
  return (
    <>
      <UserMenu {...props} icon={<MyCustomIcon />}>
        {/* <ProfileMenu /> */}
        {/* <ConfigurationMenu /> */}
        {/* <LogoutMenu
          setOpenLogoutModal={setOpenLogoutModal}
          onClick={() => {
            props.onClick();
          }}
        /> */}
      </UserMenu>
      <LogoutModal
        open={openLogoutModal}
        onClose={() => {
          setOpenLogoutModal(false);
        }}
      />

      <ProfileMenu />
    </>
  );
};
const CustomAppBar = (props: any): JSX.Element => {
  const { keycloakLogout } = useLogout();
  const [openNotifications, setOpenNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  // const [unreadNotifications, setUnreadNotifications] = useState([]);
  // const [notificationsCount, setNotificationsCount] = useState(0);
  const dataProvider = useDataProvider();
  //const userInfo = useSelector((state: AppState) => state.userInfoReducer);
  const userInfo = useContext(UserContext);
  // const { permissions } = usePermissions();
  // const [subscribeUpdateNotificationMutation] = useMutation(
  //   createNotificationRead,
  //   {},
  // );
  const customStyle = {
    zIndex: 999,
    visibility: "visible",
  };
  const ROLES = [
    CO_ROLE_GUEST,
    CO_ROLE_PATIENT,
    CO_ROLE_MRA,
    CO_ROLE_PPA,
    CO_ROLE_ADMIN,
  ];
  useEffect(() => {
    const handleScroll = (): any => {
      const element = document.getElementById("scrollable-app-bar")?.style;
      if (element) {
        element.transform = "translateY(0px)";
        element.transition = "none";
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // const handleNotificationsOpen = (): void => {
  //   setOpenNotifications(true);
  //   unreadNotifications.map((notification: any) => {
  //     subscribeUpdateNotificationMutation({
  //       variables: {
  //         input: { requestLogId: notification.id },
  //       },
  //     });
  //   });
  //   setNotificationsCount(0);
  // };
  const handleNotificationsClose = (): void => {
    setOpenNotifications(false);
  };
  const [mounted, setMounted] = React.useState(false);

  const updateNotificationCount = (notifications: any[]): void => {
    const notificationsUnread: any = [];
    notifications.map((value) => {
      if (!value.hasRead) {
        notificationsUnread.push(value);
      }
    });
    // setNotificationsCount(notificationsUnread.length);
    // setUnreadNotifications(notificationsUnread);
  };
  useEffect(() => {
    if (!mounted) {
      console.log(1111111111111);
      if (localStorage.getItem("User") === CO_NAME_GUEST) {
        keycloakLogout();
      }
      if (!ROLES.includes(String(secureLocalStorage.getItem("role")))) {
        console.log(33333333333);
        console.log(secureLocalStorage.getItem("role"));

        keycloakLogout();
      }
    }
  }, []);
  useEffect(() => {
    setMounted(true);
    let mount = true;
    const queryOption: any = {
      pagination: { page: 1, perPage: perPageMax },
      sort: { field: "createdAt", order: "DESC" },
      filter: {},
    };
    const fetchNotifications = (): any => {
      dataProvider
        .getList("notificationListV1s", queryOption)
        .then(({ data }: any) => {
          if (mount) {
            setNotifications(data);
            updateNotificationCount(data);
          }
        })
        .catch((error) => error);
    };
    fetchNotifications();
    const id = setInterval(() => {
      if (userInfo.role !== CO_ROLE_ADMIN) {
        fetchNotifications();
      }
    }, 25000);

    return () => {
      mount = false;
      clearInterval(id);
    };
  }, []);

  return (
    <StyledDiv>
      <AppBar
        {...props}
        style={{ ...props.style, ...customStyle }}
        id="scrollable-app-bar"
        userMenu={<CustomUserMenu />}
      >
        <div style={{ display: "flex" }}>
          <img className={"appLogo"} alt="Demos" src={logo} />
        </div>
        <span className={classes.spacer} />

        {/* {permissions !== CO_ROLE_ADMIN && ( */}
        <Toolbar className={classes.denseToolbar}>
          <NotificationsPopover
            anchorEl={notificationsRef.current}
            notifications={notifications}
            onClose={handleNotificationsClose}
            open={openNotifications}
          />
          {/* <IconButton
            onClick={handleNotificationsOpen}
            ref={notificationsRef}
            size="small"
            style={{ padding: 0 }}
            id="notification"
          >
            <Badge color="primary" badgeContent={notificationsCount}>
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
        </Toolbar>
        {/* )} */}
      </AppBar>
    </StyledDiv>
  );
};

export default CustomAppBar;
