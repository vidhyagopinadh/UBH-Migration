import React from "react";
import { FilterList, FilterListItem } from "react-admin";
import LowPriorityIcon from "@material-ui/icons/LowPriority";
import DoneAllIcon from "@material-ui/icons/DoneAll";
export const StatusFilter = (): JSX.Element => {
  return (
    <FilterList
      label="resources.invite.filters.status"
      icon={<LowPriorityIcon />}
    >
      <FilterListItem label="Opened" value={{ invitationCode: "OPENED" }} />
      <FilterListItem
        label="Not Opened"
        value={{ invitationCode: "INVITE_NOT_USED" }}
      />
      <FilterListItem
        label="Awaiting Login"
        value={{ invitationCode: "AWAITING_LOGIN" }}
      />
      <FilterListItem
        label="Logged In"
        value={{ invitationCode: "LOGGED_IN" }}
      />
      <FilterListItem label="Expired" value={{ invitationCode: "EXPIRED" }} />
      <FilterListItem
        label="Cancelled"
        value={{ invitationCode: "CANCELLED" }}
      />
    </FilterList>
  );
};

export const UserTypeFilter = (): JSX.Element => {
  return (
    <FilterList
      label="resources.invite.filters.accountType"
      icon={<DoneAllIcon />}
    >
      <FilterListItem label="Patient" value={{ serviceCategoryTypeId: 1 }} />
      <FilterListItem label="PPA" value={{ serviceCategoryTypeId: 2 }} />
      <FilterListItem
        label="Providers(MRA)"
        value={{ serviceCategoryTypeId: 3 }}
      />
    </FilterList>
  );
};
