import React, { useEffect } from "react";
import type { FC } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Box, InputLabel, makeStyles } from "@material-ui/core";
import { BootstrapTooltip as Tooltip } from "../components/Tooltip";
import type { MenuProps } from "react-admin";
import {
  DashboardMenuItem,
  MenuItemLink,
  useTranslate,
  usePermissions,
} from "react-admin";
import PatientIcon from "@material-ui/icons/Person";
import billing from "../views/billing";
import requests from "../views/requests";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import LibraryAddOutlinedIcon from "@material-ui/icons/LibraryAddOutlined";
import type { AppState } from "../types";
import { catchActivity } from "../utils/analytics";
import {
  CO_ROLE_ADMIN,
  CO_ROLE_MRA,
  CO_ROLE_PATIENT,
  CO_ROLE_PPA,
} from "../utils/roles";
import useTraces from "../hooks/useTraces";
import { synapseLoginQuery } from "../service/keycloakQueries";
import { isCommentProviderIsCactusComment } from "../utils/comments";
import { Group } from "@material-ui/icons";
import { CorporateFare, GridView } from "@mui/icons-material";
const { REACT_APP_SYNAPSE_URL, REACT_APP_BASE_URL } = process.env;
const useStyles = makeStyles({
  betaLabel: {
    float: "right",
    backgroundColor: "#4169E1",
    color: "white",
    fontWeight: 600,
    width: "40px",
    borderRadius: "30px",
    padding: "8px",
    textAlign: "center",
    fontSize: "10px",
  },
});

const Menu: FC<MenuProps> = ({ onMenuClick, dense = false }) => {
  const translate = useTranslate();
  const { getTrace } = useTraces();
  const classes = useStyles();
  const userInfo = useSelector((state: AppState) => state.userInfoReducer);
  const { permissions } = usePermissions();
  const [cactusUrl, setCactusUrl] = useState("");
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [showIframe, setShowIframe] = useState(
    localStorage.getItem("cactus-token") ? false : true,
  );
  // const isXSmall = useMediaQuery((theme: Theme) =>
  //   theme.breakpoints.down("xs"),
  // );
  const open = useSelector((state: AppState) => state.admin.ui.sidebarOpen);
  useSelector((state: AppState) => state.theme);
  useEffect(() => {
    if (isCommentProviderIsCactusComment) {
      const loginToken = cactusUrl.split("=");
      if (loginToken[1] != "" && loginToken[1] != undefined) {
        synapseLoginQuery(loginToken[1]);
        setShowIframe(false);
      }
    }
  }, [cactusUrl]);
  useEffect(() => {
    if (!userInfo.emailVerified) {
      setEmailNotVerified(true);
    }
  }, []);
  const handleClick = (event): void => {
    const menuChange = "Menu Change to " + event.target.innerText;
    if (
      event.target.innerText ===
      translate(`resources.requests.name`, {
        smart_count: 2,
      })
    ) {
      if (permissions === CO_ROLE_PPA)
        getTrace(" My Requests Clicked", "ev-040", userInfo.email);
      else if (permissions === CO_ROLE_PATIENT)
        getTrace(" My Requests Clicked", "ev-124", userInfo.email);
    }
    if (
      event.target.innerText ===
      translate(`resources.requests.mraname`, {
        smart_count: 2,
      })
    ) {
      getTrace(" My Tasks Clicked", "ev-091", userInfo.email);
    } else if (
      event.target.innerText ===
      translate(`resources.requests.createName`, {
        smart_count: 2,
      })
    ) {
      if (permissions === CO_ROLE_PPA)
        getTrace(" Medical Record Request Clicked", "ev-053", userInfo.email);
      else if (permissions === CO_ROLE_PATIENT)
        getTrace(" Medical Record Request Clicked", "ev-135", userInfo.email);
    } else if (
      event.target.innerText ===
      translate(`resources.addendumRequests.createName`, {
        smart_count: 2,
      })
    ) {
      getTrace(" Click on Create Addendum Request", "ev-064", userInfo.email);
    } else if (
      event.target.innerText ===
      translate(`resources.billingRequest.create`, {
        smart_count: 2,
      })
    ) {
      getTrace(
        " Click on Create Billing/Insurance question request",
        "ev-073",
        userInfo.email,
      );
    } else if (
      event.target.innerText ===
      translate(`resources.patients.name`, {
        smart_count: 2,
      })
    ) {
      getTrace(" Click on Patients", "ev-080", userInfo.email);
    }
    catchActivity({
      eventType: {
        activityName: menuChange,
        activityUrl: window.location.href,
      },
      eventStatus: true,
    });
  };
  return (
    <Box mt={1} id="menu">
      {" "}
      <div id="dashboard-menu">
        <DashboardMenuItem onClick={onMenuClick} sidebarIsOpen={open} />
      </div>
      {permissions === CO_ROLE_PPA && (
        <MenuItemLink
          to={`/requests`}
          primaryText={translate(`resources.requests.name`, {
            smart_count: 2,
          })}
          id="requests-menu"
          leftIcon={<requests.icon />}
          onClick={(e) => handleClick(e)}
          sidebarIsOpen={open}
          dense={dense}
        />
      )}
      {permissions === CO_ROLE_MRA && (
        <MenuItemLink
          to={`/requests`}
          primaryText={translate(`resources.requests.mraname`, {
            smart_count: 2,
          })}
          id="requests-menu"
          leftIcon={<requests.icon />}
          onClick={(e) => handleClick(e)}
          sidebarIsOpen={open}
          dense={dense}
        />
      )}
      {permissions === CO_ROLE_PATIENT && (
        <MenuItemLink
          to={`/myRequests`}
          primaryText={translate(`resources.requests.name`, {
            smart_count: 2,
          })}
          id="requests-menu"
          leftIcon={<requests.icon />}
          onClick={(e) => handleClick(e)}
          sidebarIsOpen={open}
          dense={dense}
        />
      )}
      {(permissions === CO_ROLE_PPA || permissions === CO_ROLE_PATIENT) && (
        <Tooltip
          title={emailNotVerified ? translate("tooltip.email_unverified") : ""}
        >
          <span>
            <MenuItemLink
              to={`/requestCreate`}
              primaryText={translate(`resources.requests.createName`, {
                smart_count: 2,
              })}
              style={{ whiteSpace: "break-spaces" }}
              leftIcon={<PlaylistAddIcon />}
              disabled={emailNotVerified ? true : false}
              onClick={(e) => handleClick(e)}
              sidebarIsOpen={open}
              dense={dense}
              id="mrr-menu"
            />
          </span>
        </Tooltip>
      )}
      {(permissions === CO_ROLE_PPA || permissions === CO_ROLE_PATIENT) && (
        <Tooltip
          title={
            permissions === CO_ROLE_PATIENT
              ? translate("tooltip.feature_in_progress")
              : emailNotVerified
              ? translate("tooltip.email_unverified")
              : ""
          }
        >
          <span>
            <MenuItemLink
              to={`/addendumRequestCreate`}
              primaryText={
                <>
                  {translate(`resources.addendumRequests.createName`, {
                    smart_count: 2,
                  })}{" "}
                  <InputLabel className={classes.betaLabel}>Beta</InputLabel>
                </>
              }
              style={{ whiteSpace: "break-spaces" }}
              leftIcon={<LibraryAddOutlinedIcon />}
              onClick={(e) => handleClick(e)}
              sidebarIsOpen={open}
              disabled={
                permissions === CO_ROLE_PATIENT || emailNotVerified
                  ? true
                  : false
              }
              dense={dense}
              id="arr-menu"
            />
          </span>
        </Tooltip>
      )}
      {(permissions === CO_ROLE_PPA || permissions === CO_ROLE_PATIENT) && (
        <Tooltip
          title={
            permissions === CO_ROLE_PATIENT
              ? translate("tooltip.feature_in_progress")
              : emailNotVerified
              ? translate("tooltip.email_unverified")
              : ""
          }
        >
          <span>
            <MenuItemLink
              to={`/billingRequestCreate`}
              primaryText={
                <>
                  {translate(`resources.billingRequest.create`, {
                    smart_count: 2,
                  })}
                  <InputLabel className={classes.betaLabel}>Beta</InputLabel>
                </>
              }
              leftIcon={<billing.createIcon />}
              onClick={(e) => handleClick(e)}
              sidebarIsOpen={open}
              disabled={
                permissions === CO_ROLE_PATIENT || emailNotVerified
                  ? true
                  : false
              }
              style={{ whiteSpace: "break-spaces" }}
              dense={dense}
              id="billing-menu"
            />
          </span>
        </Tooltip>
      )}
      {/* <SubMenu
        handleToggle={() => handleToggle("billingRequest")}
        isOpen={state.billingRequest}
        sidebarIsOpen={open}
        name={translate(`resources.billingRequest.mainMenuName`, {
          smart_count: 2,
        })}
        icon={<billing.mainMenuIcon />}
        dense={dense}
      >
        <MenuItemLink
          to={`/insuranceQuestionRequests`}
          primaryText={translate(`resources.billingRequest.list`, {
            smart_count: 2,
          })}
          leftIcon={<billing.listIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          style={{ whiteSpace: "break-spaces" }}
          dense={dense}
        />
        {permissions !== "hospital_admin" && (
          <MenuItemLink
            to={`/billingRequestCreate`}
            primaryText={translate(`resources.billingRequest.create`, {
              smart_count: 2,
            })}
            leftIcon={<billing.createIcon />}
            onClick={onMenuClick}
            sidebarIsOpen={open}
            style={{ whiteSpace: "break-spaces" }}
            dense={dense}
          />
        )}
      </SubMenu> */}
      {permissions !== CO_ROLE_ADMIN && (
        <MenuItemLink
          to={`/userInviteLists`}
          primaryText={translate(`resources.invite.name`, {
            smart_count: 2,
          })}
          leftIcon={<Group />}
          onClick={(e) => handleClick(e)}
          sidebarIsOpen={open}
          dense={dense}
          id="invite-menu"
        />
      )}
      {permissions === CO_ROLE_ADMIN && (
        <MenuItemLink
          to={`/institutions`}
          primaryText={"Institution List"}
          leftIcon={<CorporateFare />}
          onClick={(e) => handleClick(e)}
          sidebarIsOpen={open}
          dense={dense}
        />
      )}
      {permissions === CO_ROLE_ADMIN && (
        <MenuItemLink
          to={`/integrations`}
          primaryText={"Integrations"}
          leftIcon={<GridView />}
          onClick={(e) => handleClick(e)}
          sidebarIsOpen={open}
          dense={dense}
        />
      )}
      {permissions === CO_ROLE_PPA && (
        <MenuItemLink
          to={`/patientDemographics`}
          primaryText={translate(`resources.patients.patientList`, {
            smart_count: 2,
          })}
          leftIcon={<PatientIcon />}
          onClick={(e) => handleClick(e)}
          sidebarIsOpen={open}
          dense={dense}
          id="patient-menu"
        />
      )}
      {permissions === CO_ROLE_PATIENT && (
        <MenuItemLink
          to={`/dependents`}
          primaryText={translate(`resources.patients.dependentList`, {
            smart_count: 2,
          })}
          leftIcon={<PatientIcon />}
          onClick={(e) => handleClick(e)}
          sidebarIsOpen={open}
          dense={dense}
          id="dependent-menu"
        />
      )}
      {localStorage.getItem("access_token") !== "" &&
        isCommentProviderIsCactusComment &&
        showIframe && (
          <iframe
            src={
              REACT_APP_SYNAPSE_URL +
              "/sso/redirect/oidc-keycloak?redirectUrl=" +
              REACT_APP_BASE_URL
            }
            width="0px"
            height="0px"
            style={{ display: "none" }}
            id="cactus-iframe"
            sandbox="allow-same-origin"
            onLoad={() => {
              const cactus = document.getElementById(
                "cactus-iframe",
              ) as HTMLIFrameElement;
              setCactusUrl(cactus.contentWindow.location.href);
            }}
          ></iframe>
        )}
      {/* {isXSmall && (
        <MenuItemLink
          to="/configuration"
          primaryText={translate("pos.configuration")}
          leftIcon={<SettingsIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
          id="configuration"
        />
      )} */}
    </Box>
  );
};

export default Menu;
