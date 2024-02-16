import type { feedback } from "../../types";

export const CHANGE_FEEDBACK = "CHANGE_LOADING";
interface changeFeedbackActions {
  type: string;
  payload?: feedback;
}

export const changeFeedbackAction = (
  feedback: feedback,
): changeFeedbackActions => ({
  type: CHANGE_FEEDBACK,
  payload: feedback,
});
