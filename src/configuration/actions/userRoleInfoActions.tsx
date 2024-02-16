import { userRoleInfo } from "../../types/types";

export const CHANGE_USER_ROLE_INFO = "CHANGE_USER_ROLE_INFO";
type ReturnUserRoleInfoAction = { type: string; payload?: userRoleInfo };

export const userRoleInfoAction = (
  userRoleInfo: userRoleInfo,
): ReturnUserRoleInfoAction => ({
  type: CHANGE_USER_ROLE_INFO,
  payload: userRoleInfo,
});
