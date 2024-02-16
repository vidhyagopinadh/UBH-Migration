import { ThemeName } from "../types/types";

export const CHANGE_THEME = "CHANGE_THEME";
export const CHANGE_AUTHSTATE = "CHANGE_AUTHSTATE";
type ActionChangeTheme = { type: string; payload?: ThemeName };
type ActionChangeAuthState = { type: string; payload?: boolean };

export const changeTheme = (theme: ThemeName): ActionChangeTheme => ({
  type: CHANGE_THEME,
  payload: theme,
});

export const changeAuthState = (authState: boolean): ActionChangeAuthState => ({
  type: CHANGE_AUTHSTATE,
  payload: authState,
});
