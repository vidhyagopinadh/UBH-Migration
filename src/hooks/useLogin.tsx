import { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import useTraces from "./useTraces";
import { LoginUserSyncV1 } from "../service/keycloakQueries";
import {
  CO_GROUP,
  CO_ROLE_ADMIN,
  CO_ROLE_GUEST,
  CO_ROLE_MRA,
  CO_ROLE_PATIENT,
  CO_ROLE_PPA,
} from "../utils/roles";
import { useDispatch } from "react-redux";
import { catchActivity } from "../utils/analytics";
import { userInfoAction } from "../configuration/actions/userInfoActions";
import { userRoleInfoAction } from "../configuration/actions/userRoleInfoActions";
import { useHistory } from "react-router";
import secureLocalStorage from "react-secure-storage";
import { decodeJwt } from "../utils/parseJwt";
const { REACT_APP_BASE_URL } = process.env;
const useDashboard = () => {
  const { keycloak } = useKeycloak();
  const history = useHistory();
  const { getTrace } = useTraces();
  const dispatch = useDispatch();
  const [openBase, setOpenBase] = useState(false);
  const [openAdminBase, setOpenAdminBase] = useState(false);
  const [showEmailVerifiedModal, setShowEmailVerifiedModal] = useState(false);
  const catchLoginActivity = (
    activityContent: string,
    userDetails: string,
    eventStatus: boolean,
  ) => {
    catchActivity({
      eventType: {
        activityName: activityContent,
        activityUrl: window.location.href,
      },
      eventBy: {
        userName: "anonymous",
      },
      eventStatus: eventStatus,
    });
  };
  const setRoles = () => {
    getTrace("Token is received from keycloak", "ev-004", "Anonymous");
    const userRoleFromKeycloak = keycloak.tokenParsed.realm_access.roles;
    const useRoles: string[] = [];
    let userRole = CO_ROLE_GUEST;
    userRoleFromKeycloak.map((eachRole) => {
      useRoles.push(eachRole);
    });
    if (useRoles.length > 0) {
      const coExists = useRoles.includes(CO_GROUP);
      if (!coExists) {
        getTrace("Login Failure", "ev-006", "Anonymous");
        catchLoginActivity("Login Failure", keycloak.tokenParsed.sub, false);
        setOpenBase(true);
      } else {
        if (
          useRoles.includes(CO_ROLE_PPA) ||
          useRoles.includes(CO_ROLE_MRA) ||
          useRoles.includes(CO_ROLE_PATIENT) ||
          useRoles.includes(CO_ROLE_ADMIN)
        ) {
          if (useRoles.includes(CO_ROLE_MRA)) {
            const tokenParsed = decodeJwt(localStorage.getItem("access_token"));
            if (tokenParsed.payload.groups?.length > 0) {
              if (tokenParsed.payload.groups[0].split("/").length !== 3) {
                setOpenAdminBase(true);
              } else {
                userRole = CO_ROLE_MRA;
                getTrace(
                  "User Logged In succesfsully",
                  "ev-005",
                  keycloak.tokenParsed.email,
                );
                catchLoginActivity(
                  "Login Success",
                  keycloak.tokenParsed.email,
                  true,
                );
                localStorage.setItem("Loggedout", "false");
                LoginUserSyncV1().then(() => {
                  //
                });
                secureLocalStorage.setItem("role", userRole);
                dispatch(
                  userInfoAction({
                    id: keycloak.tokenParsed.sub,
                    username: keycloak.tokenParsed.email,
                    firstName: keycloak.tokenParsed.given_name,
                    lastName: keycloak.tokenParsed.family_name,
                    email: keycloak.tokenParsed.email,
                    name: keycloak.tokenParsed.name,
                    groups: "",
                    role: userRole,
                    emailVerified: keycloak.tokenParsed.email_verified,
                    profilePicId: "",
                  }),
                );

                dispatch(
                  userRoleInfoAction({
                    role: userRole,
                  }),
                );
              }
              if (keycloak.token && !openBase && !openAdminBase) {
                if (keycloak.tokenParsed.email_verified === false) {
                  setShowEmailVerifiedModal(true);
                }
                if (keycloak.tokenParsed.email_verified) {
                  if (localStorage.getItem("url")) {
                    history.push(
                      localStorage
                        .getItem("url")
                        .replace(REACT_APP_BASE_URL, ""),
                    );
                  } else {
                    history.push("/");
                  }
                  localStorage.removeItem("url");
                }
              }
            } else {
              setOpenAdminBase(true);
            }
          } else {
            getTrace(
              "User Logged In successfully",
              "ev-005",
              keycloak.tokenParsed.email,
            );
            catchLoginActivity(
              "Login Success",
              keycloak.tokenParsed.email,
              true,
            );
            localStorage.setItem("Loggedout", "false");
            LoginUserSyncV1().then(() => {
              //
            });
            if (useRoles.includes(CO_ROLE_PPA)) {
              userRole = CO_ROLE_PPA;
            } else if (useRoles.includes(CO_ROLE_GUEST)) {
              userRole = CO_ROLE_GUEST;
            } else if (useRoles.includes(CO_ROLE_PATIENT)) {
              userRole = CO_ROLE_PATIENT;
            } else if (useRoles.includes(CO_ROLE_ADMIN)) {
              userRole = CO_ROLE_ADMIN;
            }
            if (!openAdminBase) {
              secureLocalStorage.setItem("role", userRole);
              dispatch(
                userInfoAction({
                  id: keycloak.tokenParsed.sub,
                  username: keycloak.tokenParsed.email,
                  firstName: keycloak.tokenParsed.given_name,
                  lastName: keycloak.tokenParsed.family_name,
                  email: keycloak.tokenParsed.email,
                  name: keycloak.tokenParsed.name,
                  groups: "",
                  role: userRole,
                  emailVerified: keycloak.tokenParsed.email_verified,
                  profilePicId: "",
                }),
              );
              dispatch(
                userRoleInfoAction({
                  role: userRole,
                }),
              );
            }
            if (keycloak.token && !openBase && !openAdminBase) {
              if (keycloak.tokenParsed.email_verified === false) {
                setShowEmailVerifiedModal(true);
              }
              if (keycloak.tokenParsed.email_verified) {
                if (localStorage.getItem("url")) {
                  history.push(
                    localStorage.getItem("url").replace(REACT_APP_BASE_URL, ""),
                  );
                } else {
                  history.push("/");
                }
                localStorage.removeItem("url");
              }
            }
          }
        } else {
          getTrace("Login Failure", "ev-006", "Anonymous");
          catchLoginActivity("Login Failure", keycloak.tokenParsed.sub, false);
          setOpenBase(true);
        }
      }
    }
  };
  return {
    setRoles,
    openBase,
    setOpenBase,
    setOpenAdminBase,
    openAdminBase,
    showEmailVerifiedModal,
    setShowEmailVerifiedModal,
  };
};
export default useDashboard;
