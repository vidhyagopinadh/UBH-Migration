const { REACT_APP_REDIRECT_URL, REACT_APP_KEYCLOAK_REALM, REACT_APP_BASE_URL } =
  import.meta.env
const useLogout = () => {
  const keycloakLogout = () => {
    localStorage.clear();
    localStorage.setItem("Loggedout", "true");
    window.location.replace(
      REACT_APP_REDIRECT_URL +
      REACT_APP_KEYCLOAK_REALM +
      "/protocol/openid-connect/logout?redirect_uri=" +
      REACT_APP_BASE_URL,
    );
  };
  return {
    keycloakLogout,
  };
};

export default useLogout;
