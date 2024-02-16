/**
 * Calls on every event
 * @Usage
 *
 * catchActivity({
 *    eventType,
 * eventBy,
 *    eventStatus
 * }) : ICatchActivity
 *
 * @ICatchActivity {
 *    eventType: IEventType;
 *    eventStatus: boolean;
 * }
 *
 * @IEventType {
 *    activityName: String;
 *    activityUrl: String;
 * }
 */

import type { ICatchActivity, IUser } from "../../../types/types";

export const catchActivity = ({
  eventType,
  eventBy,
  eventStatus,
}: ICatchActivity) => {
  const userInfo = localStorage.getItem("User") || "";

  const eventUser: IUser = eventBy
    ? eventBy
    : {
      userName: userInfo,
    };

  console.group(
    "%cActivity Tracking",
    "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;",
  );
  console.log("Event Type", eventType);
  console.log("Event By", eventUser);
  console.log("Event Status", eventStatus ? "success" : "failure");
  console.groupEnd();
};
