//import React, { useEffect } from "react";
import type { FC } from "react";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

// import { BootstrapTooltip as Tooltip } from "../components/Tooltip";
import type { MenuProps } from "react-admin";
import {
  Menu,
  DashboardMenuItem,
  MenuItemLink,
  useTranslate,
  usePermissions,
} from "react-admin";
import PersonIcon from '@mui/icons-material/Person';
import billing from "../views/billing";
import { catchActivity } from "../lib/universal/utils/analytics";
import {
  CO_ROLE_ADMIN,
  CO_ROLE_MRA,
  CO_ROLE_PATIENT,
  CO_ROLE_PPA,
} from "../utils/roles";
import useTraces from "../hooks/useTraces";
import { synapseLoginQuery } from "../service/keycloakQueries";
import { isCommentProviderIsCactusComment } from "../lib/universal/utils/comments";
import GroupIcon from '@mui/icons-material/Group';
import { CorporateFare, GridView } from "@mui/icons-material";
import { Box, InputLabel, Tooltip, useMediaQuery } from "@mui/material";
import styled from "@emotion/styled";
import requests from "../views/requests";
const { REACT_APP_SYNAPSE_URL, VITE_BASE_URL } = import.meta.env
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
const PREFIX = 'Menu';
const classes = {
  betaLabel: `${PREFIX}-betaLabel`
}
const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.betaLabel}`]: {
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
}))


const MenuList: FC<MenuProps> = ({ onMenuClick, dense = false }) => {
  const translate = useTranslate();
  // const { getTrace } = useTraces();
  //const classes = useStyles();
  //const userInfo = useSelector((state: AppState) => state.userInfoReducer);
  const userInfo: any = {}
  const { permissions } = usePermissions();
  const [cactusUrl, setCactusUrl] = useState("");
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [showIframe, setShowIframe] = useState(
    localStorage.getItem("cactus-token") ? false : true,
  );


  // const isXSmall = useMediaQuery((theme: Theme) =>
  //   theme.breakpoints.down("xs"),
  // );
  //const open = useSelector((state: AppState) => state.admin.ui.sidebarOpen);

  //useSelector((state: AppState) => state.theme);

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
  const handleClick = (event: any): void => {
    const menuChange = "Menu Change to " + event.target.innerText;
    if (
      event.target.innerText ===
      translate(`resources.requests.name`, {
        smart_count: 2,
      })
    ) {
      // if (permissions === CO_ROLE_PPA)
      //   getTrace(" My Requests Clicked", "ev-040", userInfo.email);
      // else if (permissions === CO_ROLE_PATIENT)
      //   getTrace(" My Requests Clicked", "ev-124", userInfo.email);
    }
    if (
      event.target.innerText ===
      translate(`resources.requests.mraname`, {
        smart_count: 2,
      })
    ) {
      //getTrace(" My Tasks Clicked", "ev-091", userInfo.email);
    } else if (
      event.target.innerText ===
      translate(`resources.requests.createName`, {
        smart_count: 2,
      })
    ) {
      // if (permissions === CO_ROLE_PPA)
      //   getTrace(" Medical Record Request Clicked", "ev-053", userInfo.email);
      // else if (permissions === CO_ROLE_PATIENT)
      //   getTrace(" Medical Record Request Clicked", "ev-135", userInfo.email);
    } else if (
      event.target.innerText ===
      translate(`resources.addendumRequests.createName`, {
        smart_count: 2,
      })
    ) {
      // getTrace(" Click on Create Addendum Request", "ev-064", userInfo.email);
    } else if (
      event.target.innerText ===
      translate(`resources.billingRequest.create`, {
        smart_count: 2,
      })
    ) {
      // getTrace(
      //   " Click on Create Billing/Insurance question request",
      //   "ev-073",
      //   userInfo.email,
      // );
    } else if (
      event.target.innerText ===
      translate(`resources.patients.name`, {
        smart_count: 2,
      })
    ) {
      //getTrace(" Click on Patients", "ev-080", userInfo.email);
    }
    catchActivity({
      eventType: {
        activityName: menuChange,
        activityUrl: window.location.href,
      },
      eventStatus: true,
    });
  };
  console.log(permissions)
  return (
    <Menu>

      <DashboardMenuItem onClick={onMenuClick} />


      {permissions === CO_ROLE_PPA && (
        <MenuItemLink
          to={`/requests`}
          primaryText={translate(`resources.requests.name`, {
            smart_count: 2,
          })}
          id="requests-menu"
          leftIcon={<requests.icon />}
          onClick={(e) => handleClick(e)}
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

      {permissions !== CO_ROLE_ADMIN && (
        <MenuItemLink
          to={`/userInviteLists`}
          primaryText={translate(`resources.invite.name`, {
            smart_count: 2,
          })}
          leftIcon={<GroupIcon />}
          onClick={(e) => handleClick(e)}
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
          dense={dense}
        />
      )}
      {permissions === CO_ROLE_ADMIN && (
        <MenuItemLink
          to={`/integrations`}
          primaryText={"Integrations"}
          leftIcon={<GridView />}
          onClick={(e) => handleClick(e)}
          dense={dense}
        />
      )}
      {permissions === CO_ROLE_PPA && (
        <MenuItemLink
          to={`/patientDemographics`}
          primaryText={translate(`resources.patients.patientList`, {
            smart_count: 2,
          })}
          leftIcon={<PersonIcon />}
          onClick={(e) => handleClick(e)}
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
          leftIcon={<PersonIcon />}
          onClick={(e) => handleClick(e)}
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
              VITE_BASE_URL
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
              //setCactusUrl(cactus.contentWindow.location.href);
            }}
          ></iframe>
        )}

    </Menu>
  );
};

export default MenuList;
