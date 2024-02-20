import { useEffect } from "react";
import { usePermissions } from "react-admin";
import { synapseGetRoomIDQuery } from "../service/keycloakQueries";
import { CO_ROLE_MRA } from "../utils/roles";
const {
  REACT_APP_CACTUS_HOME_SERVER_URL,
  REACT_APP_CACTUS_SERVER_NAME,
  REACT_APP_CACTUS_SITE_NAME,
  REACT_APP_CACTUS_GUEST_POSTING_ENABLED,
} = process.env;
const useScript = (commentSectionId) => {
  const { permissions } = usePermissions();
  if (permissions === CO_ROLE_MRA) {
    synapseGetRoomIDQuery(commentSectionId);
  }
  useEffect(() => {
    const initScript = document.createElement("script");
    const innerScript = document.createTextNode(
      'initComments({node: document.getElementById("comment-section"),defaultHomeserverUrl:"' +
        REACT_APP_CACTUS_HOME_SERVER_URL +
        '",serverName: "' +
        REACT_APP_CACTUS_SERVER_NAME +
        '",siteName: "' +
        REACT_APP_CACTUS_SITE_NAME +
        '",commentSectionId:"' +
        commentSectionId +
        '",guestPostingEnabled: ' +
        REACT_APP_CACTUS_GUEST_POSTING_ENABLED +
        ",pageSize:5});",
    );
    initScript.appendChild(innerScript);
    document.body.appendChild(initScript);
    return () => {
      document.body.removeChild(initScript);
    };
  }, []);
};

export default useScript;
