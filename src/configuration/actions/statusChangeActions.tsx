import { ChangeStatus } from "../../types/types";

export const CHANGE_STATUS = "CHANGE_STATUS";
type ActionChangeStatusAction = { type: string; payload?: ChangeStatus };

export const changeStatusAction = (
  changeStatus: ChangeStatus,
): ActionChangeStatusAction => ({
  type: CHANGE_STATUS,
  payload: changeStatus,
});
