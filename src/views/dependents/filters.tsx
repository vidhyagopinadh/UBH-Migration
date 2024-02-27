import React from "react";
import { FilterList, FilterListItem } from "react-admin";
import LowPriorityIcon from "@material-ui/icons/LowPriority";
export const StatusFilter = (): JSX.Element => {
  return (
    <FilterList
      label="resources.patients.filters.status"
      icon={<LowPriorityIcon />}
    >
      <FilterListItem
        label="Virtual"
        value={{ registrationStatus: "Virtual" }}
      />
      <FilterListItem
        label="Registered"
        value={{ registrationStatus: "REGISTERED" }}
      />
    </FilterList>
  );
};
