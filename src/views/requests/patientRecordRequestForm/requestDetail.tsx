import React, { useEffect, useState } from "react";
import { useDataProvider, useLogin } from "react-admin";
// import { colors, Container, Divider, Tab, Tabs } from "@material-ui/core";
import { useNavigate } from "react-router";
import Overview from "./Overview";
import Header from "./Header";
import Acknowledge from "../../../components/acknowledge";
import BaseModal from "../../../components/baseModal";
// import type { AppState, IAlreadyLoggedIn } from "../../../types";
// import { useSelector } from "react-redux";
import {
  CO_ROLE_GUEST,
  CO_NAME_GUEST,
  CO_ROLE_PATIENT,
} from "../../../utils/roles";
import { perPageMax } from "../../../utils/pageConstants";
import secureLocalStorage from "react-secure-storage";
import { styled } from "@mui/material/styles";
import { Container, Divider, Tab, Tabs, colors } from "@mui/material";
const { REACT_APP_GUEST_USERNAME, REACT_APP_GUEST_PASSWORD } = process.env;

const PREFIX = "PRRRequestDetails";
const classes = {
  root: `${PREFIX}-root`,
  tabs: `${PREFIX}-tabs`,
  divider: `${PREFIX}-divider`,
  alert: `${PREFIX}-alert`,
  content: `${PREFIX}-content`,
  contentMain: `${PREFIX}-contentMain`,
  h6_title: `${PREFIX}-h6_title`,
  subtitle: `${PREFIX}-subtitle`,
  listitemStyle: `${PREFIX}-listitemStyle`,
  listitemStyle2: `${PREFIX}-listitemStyle2`,
};

const StyledDiv = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  [`& .${classes.tabs}`]: {
    marginTop: theme.spacing(3),
  },
  [`& .${classes.divider}`]: {
    backgroundColor: colors.grey[300],
  },
  [`& .${classes.alert}`]: {
    marginTop: theme.spacing(3),
  },
  [`& .${classes.content}`]: {
    marginTop: theme.spacing(3),
  },
  [`& .${classes.contentMain}`]: {
    backgroundColor: "transparent",
    border: "0px solid #ffffff",
  },
  [`& .${classes.h6_title}`]: {
    width: "55%",
    float: "left",
  },
  [`& .${classes.subtitle}`]: {
    width: "40%",
    float: "left",
    marginLeft: "5%",
  },
  [`& .${classes.listitemStyle}`]: {
    display: "inline-block !important",
    borderBottom: "1px solid #eaeaea !important",
  },
  [`& .${classes.listitemStyle2}`]: {
    display: "inline-block !important",
    borderBottom: "unset !important",
  },
}));

export const RequestDetailComponent = (props): JSX.Element => {
  const dataProvider = useDataProvider();
  const { id, tab } = props;
  const navigate = useNavigate();
  const login = useLogin();
  const [requestViewList, setRequestViewList] = useState<any>({});
  const [openBase, setOpenBase] = useState(false);
  const [successAck, setSuccessAck] = useState(false);
  const userInfo = useSelector((state: AppState) => state.userInfoReducer);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState<IAlreadyLoggedIn>({
    alreadyThere: localStorage.getItem("authState") == "true" ? true : false,
    userName: localStorage.getItem("User") || CO_NAME_GUEST,
    role: secureLocalStorage.getItem("role")
      ? String(secureLocalStorage.getItem("role"))
      : CO_ROLE_GUEST,
    email: userInfo ? userInfo.email : "",
  });

  useEffect(() => {
    if (alreadyLoggedIn.role === CO_ROLE_PATIENT) {
      setAlreadyLoggedIn((prevFormState: IAlreadyLoggedIn) => ({
        ...prevFormState,
        alreadyThere: false,
      }));
      getRequestViews();
    } else {
      if (alreadyLoggedIn.userName === CO_NAME_GUEST) {
        setOpenBase(false);
        doLogin();
      } else {
        if (alreadyLoggedIn.alreadyThere) {
          setOpenBase(true);
        } else {
          setOpenBase(false);
          doLogin();
        }
      }
      localStorage.setItem("User", CO_NAME_GUEST);
    }
  }, []);

  function doLogin(): void {
    login(
      {
        username: REACT_APP_GUEST_USERNAME,
        password: REACT_APP_GUEST_PASSWORD,
      },
      `overview`
    )
      .then(() => {
        setAlreadyLoggedIn((prevFormState: IAlreadyLoggedIn) => ({
          ...prevFormState,
          alreadyThere: false,
        }));
        getRequestViews();
      })
      .catch(() => {
        // notify(err.message, { type: "warning" });
      });
  }
  const queryOption = {
    pagination: { page: 1, perPage: perPageMax },
    sort: { field: "id", order: "ASC" },
    filter: { id: id },
  };
  function getRequestViews(): void {
    dataProvider
      .getList("requests", queryOption)
      .then(({ data }) => {
        setRequestViewList(data[0]);
      })
      .catch((error) => error);
  }
  const doneAfter = (): void => {
    setSuccessAck(true);
  };
  const tabs = [{ value: "overview", label: "Overview" }];

  const handleTabsChange = (event, value): void => {
    navigate(value);
  };

  const alreadyConfirmation = (): void => {
    localStorage.setItem("Loggedout", "true");
    localStorage.setItem("User", CO_NAME_GUEST);
    doLogin();
  };

  return (
    <StyledDiv>
      <Container maxWidth="lg">
        {alreadyLoggedIn.alreadyThere &&
        alreadyLoggedIn.role !== CO_ROLE_PATIENT ? (
          <>
            {openBase && (
              <BaseModal
                open={openBase}
                confirmAction={alreadyConfirmation}
                onClose={() => {
                  setOpenBase(false);
                  navigate("/");
                }}
                content={`${alreadyLoggedIn.userName} is already loggedin on this browser. If you continue, ${alreadyLoggedIn.userName} will disconnect. Do you want to continue?`}
                title="User Already Logged In"
                successButtonName="Continue"
              />
            )}
          </>
        ) : (
          <>
            {Object.entries(requestViewList).length > 0 &&
              (requestViewList.signatureId &&
              alreadyLoggedIn.role !== CO_ROLE_PATIENT ? (
                <Acknowledge type="request_signed" />
              ) : (
                <>
                  {successAck ? (
                    <Acknowledge type="successfully_signed" />
                  ) : (
                    <>
                      <Header path={props.basePath} request={requestViewList} />
                      <Tabs
                        className={classes.tabs}
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        value={tab}
                        style={{ marginTop: "0px" }}
                        variant="scrollable"
                      >
                        {tabs.map((tab) => (
                          <Tab
                            key={tab.value}
                            label={tab.label}
                            value={tab.value}
                          />
                        ))}
                      </Tabs>
                      <Divider className={classes.divider} />
                      <div className={classes.content}>
                        {tab === "overview" && (
                          <Overview
                            request={requestViewList}
                            onSuccess={() => doneAfter}
                          />
                        )}
                      </div>
                    </>
                  )}
                </>
              ))}
          </>
        )}
      </Container>
    </StyledDiv>
  );
};
