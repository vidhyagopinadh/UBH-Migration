import type { IFetchConfigReturn } from "../types/types";
import FetchConfig from "./fetchConfig";
export const synapseLoginQuery = (synapseLoginCode: string): void => {
  fetch(import.meta.env.VITE_SYNAPSE_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "m.login.token",
      token: synapseLoginCode,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      const synapseLocalStorageItem =
        `{ "homeserverUrl": "https://` +
        json.home_server +
        `", "kind": "user", "txnId": 1, "userId": "` +
        json.user_id +
        `", "accessToken": "` +
        json.access_token +
        `" }`;
      localStorage.setItem("cactus-token", json.access_token);
      localStorage.setItem("cactus-session", synapseLocalStorageItem);
    });
};
export const synapseGetRoomIDQuery = (commentSectionId: string): void => {
  const commentId = commentSectionId.replaceAll("/", "%2F");
  fetch(
    import.meta.env.VITE_CACTUS_ROOMID_URL +
    commentId.replace("reply", "internalnotes") +
    "%3A" +
    import.meta.env.VITE_CACTUS_SERVER_NAME,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + localStorage.getItem("cactus-token"),
      },
    },
  )
    .then((response) => response.json())
    .then((json) => {
      localStorage.setItem("RoomId", json.room_id);
    });
};

export const synapsePostCommentQuery = (comments: string): void => {
  fetch(
    import.meta.env.VITE_CACTUS_POST_MESSAGE_URL +
    localStorage.getItem("RoomId")?.replace(":", "%3A") +
    "/send/m.room.message/" +
    Math.floor(Date.now() / 1000),
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + localStorage.getItem("cactus-token"),
      },
      body: JSON.stringify({
        body: comments,
        msgtype: "m.text",
      }),
    },
  )
    .then((response) => response.json())
    .then(() => {
      // console.log("comment posted", json);
    });
};

export const keycloakUserInfoQuery = (): Promise<any> => {
  return fetch(import.meta.env.VITE_KEYCLOAK_USERINFO_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  }).then((response) => {
    return response;
  });
};

export const GetTokenQuery = (
  username: string,
  password: string,
  realm: string,
): Promise<any> => {
  return FetchConfig({
    anonymous: true,
    query: `mutation  authenticateWithRealm {
      authenticateWithRealm(
        input: {
          username: "${username}"
          passwords: "${password}"
          realm:"${realm}"
        }
        )
        {
          clientMutationId
          string
        }
      }`,
  }).then((response: IFetchConfigReturn) => {
    const getTokenResponse = JSON.parse(
      response.data.authenticateWithRealm.string,
    );
    localStorage.setItem("access_token", getTokenResponse.access_token);
    localStorage.setItem("refresh_token", getTokenResponse.refresh_token);
    return getTokenResponse;
  });
};
export const RefreshTokenQueryWithOutRealm = (): Promise<any> => {
  return FetchConfig({
    anonymous: true,
    query: `query refreshToken {
      refreshToken(
          refreshToken: "${localStorage.getItem("refresh_token")}"
        )
      }`,
  }).then((response: IFetchConfigReturn) => {
    const refreshTokenResponse = JSON.parse(response.data.refreshToken);
    localStorage.setItem("access_token", refreshTokenResponse.access_token);
    localStorage.setItem("refresh_token", refreshTokenResponse.refresh_token);
    return refreshTokenResponse;
  });
};

export const UserInfoQuery = (realmname: string): Promise<any> => {
  const variables = {
    realmName: realmname,
  };
  return FetchConfig({
    anonymous: false,
    query: `query userRealm($realmName: String!) {
          userRealm(
            realmName: $realmName,
          )
        }`,
    variables: variables,
  }).then((response: IFetchConfigReturn) => {
    const userRealmInfoResponse = JSON.parse(response.data.userRealm);
    return userRealmInfoResponse;
  });
};

export const UserRoleInfoQuery = (realmname: string): Promise<any> => {
  const variables = {
    realm: realmname,
  };
  return FetchConfig({
    anonymous: false,
    query: `query userRole ($realm: String!){
          userRole(
            realmName: $realm,
          )
        }`,
    variables: variables,
  }).then((response: IFetchConfigReturn) => {
    const userRoleInfoResponse = JSON.parse(response.data.userRole);
    return userRoleInfoResponse;
  });
};
export const LoginUserSyncV1 = (): Promise<any> => {
  return FetchConfig({
    anonymous: false,
    query: `mutation MyMutation {
      loginUserSyncV1(input: {}) {
        clientMutationId
        fPartyId
      }
    }`,
  }).then((response: IFetchConfigReturn) => {
    const loginUserSyncResponse = response.data;
    return loginUserSyncResponse;
  });
};
export const GetUserRealmQuery = (username: string): Promise<any> => {
  return FetchConfig({
    anonymous: true,
    query: `query getUserRealm {
      getUserRealm(
        username: "${username}"
      )
    }`,
  }).then((response: IFetchConfigReturn) => {
    if (response.status === 200) {
      return response.data.getUserRealm;
    }
  });
};

export const ForgotPasswordEmailQuery = (username: string): Promise<any> => {
  return FetchConfig({
    anonymous: true,
    query: `query forgotPasswordEmail {
      forgotPasswordEmail(
        username: "${username}"
      )
    }
    `,
  }).then((response: IFetchConfigReturn) => {
    const forgotPasswordEmailResponse = response.data.forgotPasswordEmail;
    return forgotPasswordEmailResponse;
  });
};

export const LogoutQuery = (): Promise<any> => {
  const variables = {
    realm: "Medigy",
    token: localStorage.getItem("refresh_token"),
  };
  return FetchConfig({
    anonymous: false,
    query: `query logout($realm: String!,$token: String!){
      logout(
        realmName: $realm,
        refreshToken: $token
      )
    }`,
    variables: variables,
  }).then((response: IFetchConfigReturn) => {
    const logoutResponse = response.data.logout;
    return logoutResponse;
  });
};

const KeycloakQueries = {
  GetTokenQuery,
  UserInfoQuery,
  RefreshTokenQueryWithOutRealm,
  ForgotPasswordEmailQuery,
  GetUserRealmQuery,
  UserRoleInfoQuery,
  LogoutQuery,
  LoginUserSyncV1,
  synapseLoginQuery,
  synapseGetRoomIDQuery,
  synapsePostCommentQuery,
};

export default KeycloakQueries;
