import React, { useState, useRef, useEffect } from 'react';
import { Admin, Resource, AdminRouter } from 'react-admin';
import { withApollo } from "react-apollo";
import { ApolloProvider } from "@apollo/react-hooks";
import apolloConfig from "./service/apolloConfig";

import type { DataProvider } from "react-admin";
import keycloak from './keycloakConfig';
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { BrowserRouter } from "react-router-dom";

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
import PageNotFound from './layout/PageNotFound';
import BaseModal from './components/baseModal';
import { Layout } from './layout/index';
import requests from './views/requests';
import invite from "./views/invite";

import { CO_ROLE_ADMIN } from './lib/universal/utils/roles';
import { RequestList } from './views/requests/list/requestList';
import dependents from './views/dependents';

const client = apolloConfig();
console.log(client)
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

    fetchDataProvider();

  }, []);
  const fetchDataProvider = async () => {
    console.log("fetchdataprovide1111r")

    const dataProviderInstance = await DataProviderConfig();
    // @ts-ignore
    setDataProvider(() => dataProviderInstance);
  };
  const onKeycloakTokens = (tokens: any) => {
    console.log("tokn", tokens)
    if (tokens.token !== undefined) {
      ACCESS_TOKEN = tokens.token;
      localStorage.setItem("access_token", tokens.token);
      localStorage.setItem("id_token", tokens.idToken);
      localStorage.setItem("refresh_token", tokens.refreshToken);
      localStorage.setItem("authState", "true");
      localStorage.setItem("User", keycloak?.idTokenParsed?.name);
      fetchDataProvider();
    }
    // keycloak.refreshToken = localStorage.getItem("refresh_token");
    // keycloak.idToken = localStorage.getItem("id_token");
  };

  const onKeycloakEvent = (event: string) => {
    console.log("event", event);
    // alert(event)
    // console.log(keycloak)
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
  console.log(dataProvider)
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
    <ReactKeycloakProvider
      authClient={keycloak}
      onEvent={onKeycloakEvent}
      onTokens={onKeycloakTokens}
      initOptions={{
        // onLoad: "login-required",
        pkceMethod: "S256",
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
      }}>
      <BrowserRouter>
        <Admin
          title="Unblock Health"
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
          {(permissions: any) => {
            return [
              permissions === CO_ROLE_PPA
                ? [
                  <Resource name="requests" {...requests} />,
                  <Resource name="userInviteLists" {...invite} />,
                  // <Resource name="insuranceQuestionRequests" {...billing} />,
                  // <Resource name="userInviteLists" {...invite} />,
                  // <Resource name="patientDemographics" {...patientDetails} />,
                ]
                : null,
              // permissions === CO_ROLE_ADMIN
              //   ? [
              //     <Resource name="institutions" {...institutionDetails} />,
              //     <Resource name="integrations" {...integrations} />,
              //   ]
              //   : null,
              // permissions === CO_ROLE_MRA
              //   ? [
              //     <Resource name="requests" {...requests} />,
              //     <Resource name="userInviteLists" {...invite} />,
              //   ]
              //   : null,
              // permissions === CO_ROLE_GUEST
              //   ? [
              //     <Resource name="requests" {...requests} />,
              //     <Resource name="insuranceQuestionRequests" {...billing} />,
              //     <Resource name="userInviteLists" {...invite} />,
              //   ]
              //   : null,
              permissions === CO_ROLE_PATIENT
                ? [
                  <Resource name="myRequests" {...requests} />,

                  <Resource name="requestsOnBehalf" {...requests} />,
                  <Resource name="userInviteLists" {...invite} />,
                  // <Resource name="dependents" {...dependents} />,
                ]
                : null,
              <Resource name="personDemographicsDetailsV1" />,
              <Resource name="personProfile" />,
              <Resource name="personDemographicsDetailsV2" />,
              <Resource name="communicationRequestMasterV1" />,
              <Resource name="requestResponses" />,
              <Resource name="requestLogMasters" />,
              <Resource name="notificationListV1s" />,
              <Resource name="personGenders" />,
              <Resource name="person" />,
              <Resource name="personTypes" />,
              <Resource name="recordStatuses" />,
              <Resource name="requestTypeMasters" />,
              <Resource name="patients" />,
              <Resource name="requestPriorityMasters" />,
              <Resource name="requestStatusMasters" />,
              <Resource name="issueImpactMasters" />,
              <Resource name="impactSeverityMasters" />,
              <Resource name="issueDescriptionMastersMedical" />,
              <Resource name="sourceNatureDetails" />,
              <Resource name="sourceInstitutions" />,
              <Resource name="organizationMaster" />,
              <Resource name="departments" />,
              <Resource name="assignToPeople" />,
              <Resource name="recordStatuses" />,
              <Resource name="requestContactDetails" />,
              <Resource name="requestObtainRecordTypes" />,
              <Resource name="addendumDoctorsDetails" />,
              <Resource name="userMedicalRecordsData" />,
            ];
          }}
          <CustomRoutes>
            <Route path="/" element={<Dashboard />} />
          </CustomRoutes>


        </Admin>
      </BrowserRouter>



    </ReactKeycloakProvider>
  );
};
export default App;