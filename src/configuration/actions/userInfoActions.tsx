import { userInfo } from "../../types/types";

export const CHANGE_USER_INFO = "CHANGE_USER_INFO";
type ReturnUserInfoAction = { type: string; payload?: userInfo };

export const userInfoAction = (userInfo: userInfo): ReturnUserInfoAction => ({
  type: CHANGE_USER_INFO,
  payload: userInfo,
});
