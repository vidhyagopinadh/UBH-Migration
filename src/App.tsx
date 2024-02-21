import React, { useState, useRef, useEffect } from 'react';
import { Admin, Resource, AdminRouter } from 'react-admin';
import type { DataProvider } from "react-admin";
import keycloak from './keycloakConfig';
import { ReactKeycloakProvider } from "@react-keycloak/web";

// import i18nProvider from './i18nProvider';
// import MainLayout from './layout/MainLayout';
//import posts from './posts';
//import users from './users';
// import { CustomRoute } from "./CustomRoute";
import {
  CO_ROLE_PPA,
  CO_ROLE_MRA,
  CO_ROLE_GUEST,
  CO_ROLE_PATIENT,
} from "././roles";


import { CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import Configuration from "./configuration/configuration";
import { DataProviderConfig } from "./dataProviderConfig";
import authProvider from "./useAuthProvider"
import useLogout from "./hooks/useLogout";

import Dashboard from './dashboard/dashboard';
import KeycloakLogin from './layout/keycloakLogin';
import i18nProvider from './i18nProvider';
import PageNotFound from './Layouts/PageNotFound';
import BaseModal from './components/baseModal';
import { Layout } from './layout';
// import BaseModal from './components/baseModal';

// import LogoutButton from "./components/LogoutButton";

export let ACCESS_TOKEN = "";


// here you can implement the permission mapping logic for react-admin



const App = () => {
  // const authProvider = useRef<AuthProvider>();
  const [dataProvider, setDataProvider] = useState<DataProvider>();
  const [openBase, setOpenBase] = useState(false);

  const ifAuthForm =
    window.location.href.includes("authorizationForm") ||
    window.location.href.includes("patientRequests") ||
    window.location.href.includes("addendumRequestForm") ||
    window.location.href.includes("account");
  const { keycloakLogout } = useLogout();

  useEffect(() => {
    const fetchDataProvider = async () => {
      console.log("fetchdataprovide1111r")

      const dataProviderInstance = await DataProviderConfig();
      // @ts-ignore
      setDataProvider(() => dataProviderInstance);
    };
    fetchDataProvider();

  }, []);

  const onKeycloakTokens = (tokens: any) => {
    if (tokens.token !== undefined) {
      ACCESS_TOKEN = tokens.token;
      localStorage.setItem("access_token", tokens.token);
      localStorage.setItem("id_token", tokens.idToken);
      localStorage.setItem("refresh_token", tokens.refreshToken);
      localStorage.setItem("authState", "true");
      localStorage.setItem("User", keycloak?.idTokenParsed?.name);
    }
    // keycloak.refreshToken = localStorage.getItem("refresh_token");
    // keycloak.idToken = localStorage.getItem("id_token");
  };

  const onKeycloakEvent = (event: string) => {
    console.log("event", event);
    console.log(keycloak)
    if (!ifAuthForm) {
      if (event === "onTokenExpired") {
        keycloak.updateToken(60);
      }
      if (event === "onAuthLogout") {
        keycloak.authenticated = true;
      }
      if (event === "onReady" && keycloak.token === undefined) {
        keycloak.updateToken(60);
      }
      if (event === "onAuthRefreshError") {
        keycloakLogout();
      }
      if (event === "onAuthError" || event === "onInitError") {
        setOpenBase(true);
      }
    }
  };

  // hide the admin until the keycloak client is ready
  if (!keycloak) return <p>Loading...</p>;
  if (!dataProvider) {
    return (
      <div className="loader-container">
        {localStorage.getItem("Loggedout") === "true" ? (
          <h3>Logging Out ....</h3>
        ) : (
          <h3>Loading ....</h3>
        )}
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (openBase) {
    return (
      <BaseModal
        open={openBase}
        confirmAction={keycloakLogout}
        onClose={() => {
          setOpenBase(false);
        }}
        title={"Session Expired"}
        content={"Your session has expired."}
        subContent={[
          "Sessions are logged out due to inactivity.",
          "Mouse or keyboard activity must be registered to keep your session active.",
          "Please log in again.",
        ]}
        successButtonName="Log in again"
        type="logout" />
    );
  }
  return (
    <ReactKeycloakProvider authClient={keycloak}
      onEvent={onKeycloakEvent}
      onTokens={onKeycloakTokens}
      initOptions={{
        onLoad: "login-required",
        pkceMethod: "S256",
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
      }}>

      <Admin
        title="Unblock Health"
        basename="/"
        //customReducers={ReducerHub}
        //customRoutes={customRoutes}
        authProvider={authProvider}
        dataProvider={dataProvider}
        dashboard={Dashboard}
        loginPage={KeycloakLogin}
        layout={Layout}
        //logoutButton={LogoutButton}
        i18nProvider={i18nProvider}
        catchAll={PageNotFound}
        disableTelemetry
      >

        <>
          {/* <Resource name="requests" {...requests} />, */}
          <CustomRoutes>
            <Route path="/" element={<Configuration />} />

          </CustomRoutes>
        </>


      </Admin>

    </ReactKeycloakProvider>
  );
};
export default App;