import React, { useState, useRef, useEffect } from 'react';
import { Admin, Resource, AuthProvider, DataProvider, AdminRouter } from 'react-admin';
//import simpleRestProvider from 'ra-data-simple-rest';
import Keycloak, {
  KeycloakConfig,
  KeycloakTokenParsed,
  KeycloakInitOptions,
} from 'keycloak-js';
import { keycloakAuthProvider, httpClient } from 'ra-keycloak';

import i18nProvider from './i18nProvider';
import MainLayout from './layout/MainLayout';
//import posts from './posts';
//import users from './users';
import { CustomRoute } from "./CustomRoute";
import {
  CO_ROLE_PPA,
  CO_ROLE_MRA,
  CO_ROLE_GUEST,
  CO_ROLE_PATIENT,
} from "././roles";
import myDataProvider, {
  keyCloakTokenDataProviderBuilder,
} from './dataProvider';

import { CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import Configuration from "./configuration/configuration";
import { DataProviderConfig } from "./dataProviderConfig";
import tags from './tags';
//import requests from './views/requests';

import Dashboard from './dashboard/dashboard';
const config: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

console.log(config)
export let ACCESS_TOKEN = "";
// here you can set options for the keycloak client
const initOptions: KeycloakInitOptions = {
  onLoad: "check-sso",
  silentCheckSsoRedirectUri:
    window.location.origin + "/silent-check-sso.html",
  pkceMethod: "S256",

};

// here you can implement the permission mapping logic for react-admin
const getPermissions = (decoded: KeycloakTokenParsed) => {
  const roles = decoded?.realm_access?.roles;

  if (!roles) {
    return false;
  }
  if (roles.includes(CO_ROLE_PPA)) return CO_ROLE_PPA;
  if (roles.includes(CO_ROLE_MRA)) return CO_ROLE_MRA;
  if (roles.includes(CO_ROLE_GUEST)) return CO_ROLE_GUEST;
  if (roles.includes(CO_ROLE_PATIENT)) return CO_ROLE_PATIENT;
  return false;
};

const raKeycloakOptions = {
  onPermissions: getPermissions
};



const App = () => {
  const [keycloak, setKeycloak] = useState<Keycloak>();
  const authProvider = useRef<AuthProvider>();
  //const dataProvider = useRef<DataProvider>();
  const [dataProvider, setDataProvider] = useState<DataProvider>();

  useEffect(() => {
    const initKeyCloakClient = async () => {
      // init the keycloak client

      const keycloakClient = new Keycloak(config);

      await keycloakClient.init(initOptions);
      // use keycloakAuthProvider to create an authProvider
      authProvider.current = keycloakAuthProvider(
        keycloakClient,
        raKeycloakOptions
      );
      console.log(authProvider.current)

      // example dataProvider using the httpClient helper
      // dataProvider.current = simpleRestProvider(
      //   '$API_URL',
      //   httpClient(keycloakClient)
      // );
      console.log(keycloakClient)
      setKeycloak(keycloakClient);
    };
    if (!keycloak) {
      initKeyCloakClient();
    }
    else { //Keycloak success

      if (keycloak.authenticated) {
        //ACCESS_TOKEN = keycloak.token;
        localStorage.setItem("access_token", keycloak.token || "");
        localStorage.setItem("id_token", keycloak.idToken || "");
        localStorage.setItem("refresh_token", keycloak.refreshToken || "");
        localStorage.setItem("authState", "true");
        if (keycloak.idTokenParsed) {
          localStorage.setItem("User", keycloak.idTokenParsed.name);
        }
      }
      else {
        keycloak.login();
      }

    }
  }, [keycloak]);

  useEffect(() => {
    const fetchDataProvider = async () => {
      const dataProviderInstance = await DataProviderConfig();
      // @ts-ignore
      setDataProvider(() => dataProviderInstance);
    };
    fetchDataProvider();
  }, []);

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
  return (
    <Admin
      authProvider={authProvider.current}
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      title="Unblock Health"
      dashboard={Dashboard}
      layout={MainLayout}
      basename="/"
    >
      {dataProvider &&
        <>
          {/* <Resource name="requests" {...requests} />, */}
          <CustomRoutes>
            <Route path="/test" element={<Configuration />} />

          </CustomRoutes>
        </>

      }
    </Admin>
  );
};
export default App;