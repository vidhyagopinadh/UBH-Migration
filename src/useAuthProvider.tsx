import type { AuthProvider } from "react-admin";
import secureLocalStorage from "react-secure-storage";
import {
  GetTokenQuery,
  GetUserRealmQuery,
  UserInfoQuery,
  UserRoleInfoQuery,
} from "./service/keycloakQueries";
import type { IAuthResponse, ILoginParams } from "./types/types";
import { catchActivity } from "./lib/universal/utils/analytics";
import { CO_GROUP, CO_ROLE_GUEST } from "./utils/roles";
import { validateEmail } from "./lib/universal/utils/validator";
const catchLoginActivity = (
  activityContent: string,
  userDetails: string,
  eventStatus: boolean,
): void => {
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

const authProvider: AuthProvider = {
  login: async ({ username, password }: ILoginParams) => {
    await requestAccessToken(username, password).then((response) => {
      if (response.state) {
        localStorage.setItem("authState", "true");
        catchLoginActivity("Login Success", username, true);
      } else {
        localStorage.setItem("authState", "false");
        catchLoginActivity("Login Failure", username, false);
        localStorage.clear();
        if (response.message === "lacks_permission") {
          return Promise.reject({
            message: "auth.errors.permission",
          });
        } else {
          return Promise.reject({
            message: response.message,
          });
        }
      }
    });
  },
  logout: async () => {
    //
  },
  checkError: () => {
    return Promise.resolve();
  },
  checkAuth: () => {
    // const ifAuthForm =
    //   window.location.href.includes("authorizationForm") ||
    //   window.location.href.includes("patientRequests") ||
    //   window.location.href.includes("addendumRequestForm") ||
    //   window.location.href.includes("account");
    return Promise.resolve();
  },

  getPermissions: async () => {
    const userRole = secureLocalStorage.getItem("role")
      ? secureLocalStorage.getItem("role")
      : CO_ROLE_GUEST;
    return userRole ? Promise.resolve(userRole) : Promise.reject();
  },
  getIdentity: async () => {
    return Promise.resolve({
      id: "",
      fullName: "",
    });
  },
};
async function requestAccessToken(
  username: string,
  password: string,
): Promise<IAuthResponse> {
  return await new Promise((resolve, reject) => {
    catchLoginActivity(
      "Entered requestAccessToken Function For Login",
      username,
      true,
    );

    const validEmail = validateEmail(username);
    if (password !== "") {
      catchLoginActivity(
        "Checked Empty Password validation For Login",
        username,
        true,
      );
      GetUserRealmQuery(username).then((GetUserRealmResponse: string) => {
        GetTokenQuery(username, password, GetUserRealmResponse).then(
          (tokenResponse) => {
            if (tokenResponse.error) {
              resolve({
                state: false,
                message: tokenResponse.error_description,
              });
            } else {
              UserRoleInfoQuery(GetUserRealmResponse).then(
                (userRoleInfoResponse) => {
                  UserInfoQuery(GetUserRealmResponse).then(() => {
                    const useRoles: string[] = [];
                    userRoleInfoResponse.map((eachRole: { name: string; }) => {
                      useRoles.push(eachRole.name);
                    });

                    catchLoginActivity(
                      "Got response from keycloak authenticate For Login",
                      username,
                      true,
                    );
                    if (useRoles.length > 0) {
                      const coExists = useRoles.includes(CO_GROUP);
                      if (!coExists) {
                        resolve({
                          state: false,
                          message: "lacks_permission",
                        });
                      } else {
                        resolve({
                          state: true,
                          message: "login_successful",
                        });
                      }
                    } else {
                      resolve({
                        state: false,
                        message: "lacks_permission",
                      });
                    }
                  });
                },
              );
            }
          },
        );
      });
    } else {
      if (password === "") {
        catchLoginActivity("Password is empty For Login", username, false);
        reject({ state: false, message: "passwordSholudNotBeEmpty" });
      }
      if (validEmail === false) {
        catchLoginActivity("Email is notvalid For Login", username, false);
        reject({ state: false, message: "usernameSholudBeEmail" });
      }
    }
  });
}
export default authProvider;
