import React, { useEffect, useState } from "react";
import { List, usePermissions, useTranslate } from "react-admin";
import { useDispatch, useSelector } from "react-redux";
import { colors, Container, Divider, Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import Overview from "./Overview";
import Header from "./Header";
import Activity from "./Activities";
import { changeStatusAction } from "./../../../configuration/actions/statusChangeActions";
import {
  CO_ROLE_MRA,
  CO_ROLE_PATIENT,
  CO_ROLE_PPA,
} from "../../../utils/roles";
import useTraces from "../../../hooks/useTraces";
import type { AppState } from "../../../types";
import NotVerifiedBanner from "../../../components/notVerifiedBanner";
// import PageNotFound from "../../../components/pageNotFound";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     paddingTop: theme.spacing(3),
//     paddingBottom: theme.spacing(3),
//     backgroundColor: theme.palette.primary.light,
//   },
//   tabs: {
//     marginTop: theme.spacing(3),
//   },
//   divider: {
//     backgroundColor: colors.grey[300],
//   },
//   alert: {
//     marginTop: theme.spacing(3),
//   },
//   content: {
//     marginTop: theme.spacing(3),
//   },
//   contentMain: {
//     backgroundColor: "transparent",
//     border: "0px solid #ffffff",
//   },
//   h6_title: {
//     width: "55%",
//     float: "left",
//   },
//   subtitle: {
//     width: "40%",
//     float: "left",
//     marginLeft: "5%",
//   },
//   listitemStyle: {
//     display: "inline-block !important",
//     borderBottom: "1px solid #eaeaea !important",
//   },
//   listitemStyle2: {
//     display: "inline-block !important",
//     borderBottom: "unset !important",
//   },
// }));
const PREFIX = "RequestDetailComponent";
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
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.primary.light,
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
const RequestDetailComponent = (props): JSX.Element => {
  const { id, tab } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const [resetHeaderStatusDropdown, setResetHeaderStatusDropdown] =
    useState(false);
  const { getTrace } = useTraces();
  const { permissions } = usePermissions();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer
  );
  const classes = useStyles();
  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "activity", label: "Activity" },
  ];
  const [mount, setMount] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    if (!userInfoReducer.emailVerified) {
      setShowBanner(true);
    }
  }, [userInfoReducer]);
  useEffect(() => {
    setMount(true);
    const requestData = document.getElementById("requestData");
    if (
      mount === true &&
      requestData.hidden === false &&
      permissions === CO_ROLE_PPA
    ) {
      getTrace(
        "Each Requests loaded for PPA.",
        "ev-044",
        userInfoReducer.email
      );
    } else if (
      mount === true &&
      requestData.hidden === false &&
      permissions === CO_ROLE_MRA
    ) {
      getTrace(
        "Each Requests loaded for MRA.",
        "ev-095",
        userInfoReducer.email
      );
    } else if (
      mount === true &&
      requestData.hidden === false &&
      permissions === CO_ROLE_PATIENT
    ) {
      getTrace(
        "Each Requests loaded for Patient.",
        "ev-128",
        userInfoReducer.email
      );
    }
  }, [mount]);

  const handleTabsChange = (event, value): void => {
    setResetHeaderStatusDropdown(true);
    dispatch(
      changeStatusAction({
        from: "",
        to: "",
      })
    );

    history.push(value);
    if (value === "activity" && permissions === CO_ROLE_PPA) {
      getTrace("Click on activity by PPA", "ev-045", userInfoReducer.email);
    } else if (value === "activity" && permissions === CO_ROLE_MRA) {
      getTrace("Click on activity by MRA", "ev-096", userInfoReducer.email);
    } else if (value === "activity" && permissions === CO_ROLE_PATIENT) {
      getTrace("Click on activity by Patient", "ev-129", userInfoReducer.email);
    }
  };

  const statusChangeTrigger = (val): void => {
    setResetHeaderStatusDropdown(false);
    if (String(props.data[id].requestStatusId) !== val) {
      history.push({
        pathname: `activity`,
      });
      dispatch(
        changeStatusAction({
          from: String(props.data[id].requestStatusId),
          to: val,
        })
      );
    } else {
      history.push({
        pathname: `activity`,
      });
      dispatch(
        changeStatusAction({
          from: "",
          to: "",
        })
      );
    }
  };
  return (
    <div id="requestData">
      {showBanner && (
        <div style={{ marginTop: "10px" }}>
          <NotVerifiedBanner setShowBanner={setShowBanner} />
        </div>
      )}

      {Object.keys(props.data).length === 1 ? (
        <>
          <Header
            path={props.basePath}
            request={
              Object.keys(props.data).length === 1
                ? props.data[props.ids[0]]
                : ""
            }
            resetHeaderStatusDropdown={resetHeaderStatusDropdown}
            statusChangeTrigger={statusChangeTrigger}
          />
          <Tabs
            className={classes.tabs}
            onChange={handleTabsChange}
            scrollButtons="auto"
            value={tab}
            style={{ marginTop: "0px" }}
            variant="scrollable"
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
          <Divider className={classes.divider} />
          <div className={classes.content}>
            {tab === "overview" && <Overview {...props} />}
            {tab === "activity" && <Activity {...props} />}
          </div>
        </>
      ) : (
        <div className="loader">Loading...</div>
      )}
    </div>
  );
};
export const RequestShow = (props): JSX.Element => {
  const classes = useStyles();
  const translate = useTranslate();
  const permissions = useSelector(
    (state: AppState) => state.userRoleInfoReducer
  ).role;
  return (
    <Container maxWidth="lg">
      <List
        {...props}
        title={
          permissions !== CO_ROLE_MRA
            ? translate(`resources.requests.name`)
            : translate(`resources.requests.mraname`)
        }
        classes={{ content: classes.contentMain }}
        filterDefaultValues={{
          trackId: props.id,
        }}
        exporter={false}
        pagination={false}
        actions={null}
      >
        <RequestDetailComponent {...props} />
      </List>
    </Container>
  );
};
