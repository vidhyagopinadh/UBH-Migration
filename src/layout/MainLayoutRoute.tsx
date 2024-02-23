import React, { ReactElement } from "react";
import MainLayout from "./MainLayout";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
interface Props {
  comp: ReactElement<any, any>;
  showFam?: Boolean;
  pagekey?: string;
}

const MainLayoutRoute = (props: Props) => {
  const { keycloak } = useKeycloak();
  const { comp, ...restProps } = props;
  const [authenticated, setAuthenticated] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (keycloak.authenticated) {
      setAuthenticated(true);
    } else if (keycloak.authenticated === undefined) {
      keycloak.clearToken();
      keycloak.logout();
    }
  }, [keycloak.authenticated]);

  return (
    <>
      {!authenticated && <KeycloakLogin />}
      {(authenticated) && (
        <>
          <MainLayout pagekey={restProps.pagekey} />
          <div className="container">{comp}</div>
        </>
      )}
      {keycloak.authenticated === undefined && (
        <Box
          sx={{
            position: "fixed",
            marginTop: "20%",
            display: "flex",
            justifyContent: "center",
            width: "98%",
            zIndex: 99999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default MainLayoutRoute;
