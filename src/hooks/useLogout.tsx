const { VITE_REDIRECT_URL, VITE_KEYCLOAK_REALM, VITE_BASE_URL } =
  import.meta.env
const useLogout = () => {
  const keycloakLogout = () => {
    localStorage.clear();
    localStorage.setItem("Loggedout", "true");
    window.location.replace(
      VITE_REDIRECT_URL +
      VITE_KEYCLOAK_REALM +
      "/protocol/openid-connect/logout?redirect_uri=" +
      VITE_BASE_URL,
    );
  };
  return {
    keycloakLogout,
  };
};

export default useLogout;
