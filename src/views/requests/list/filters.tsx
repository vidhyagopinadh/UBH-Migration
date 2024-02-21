import React, { useState, useEffect } from "react";
import {
  FilterList,
  FilterListItem,
  useListContext,
  usePermissions,
} from "react-admin";
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import useTraces from "../../../hooks/useTraces";
import {
  CO_ROLE_MRA,
  CO_ROLE_PATIENT,
  CO_ROLE_PPA,
} from "../../../utils/roles";
// import { useSelector } from "react-redux";
import type { AppState } from "../../../types";
import CategoryIcon from '@mui/icons-material/Category';
export const PriorityFilter = (): JSX.Element => {
  const { filterValues } = useListContext();
  const { getTrace } = useTraces();
  const [mount, setMount] = useState(false);
  const { permissions } = usePermissions();
  // const userInfoReducer = useSelector(
  //   (state: AppState) => state.userInfoReducer,
  // );
  useEffect(() => {
    setMount(true);
    if (mount === true && permissions === CO_ROLE_PPA) {
      getTrace(
        " Priority Filter Selected by PPA",
        "ev-042",
        userInfoReducer.email,
      );
    } else if (mount === true && permissions === CO_ROLE_MRA) {
      getTrace(
        " Priority Filter Selected by MRA",
        "ev-093",
        userInfoReducer.email,
      );
    } else if (mount === true && permissions === CO_ROLE_PATIENT) {
      getTrace(
        " Priority Filter Selected by Patient",
        "ev-126",
        userInfoReducer.email,
      );
    }
  }, [mount, filterValues.requestpriority]);
  return (
    <FilterList
      label="resources.requests.filters.priority"
      icon={<LowPriorityIcon />}
    >
      <FilterListItem label="High" value={{ requestpriority: "High" }} />
      <FilterListItem
        label="Standard"
        value={{ requestpriority: "Standard" }}
      />
    </FilterList>
  );
};

export const StatusFilter = (): JSX.Element => {
  const { getTrace } = useTraces();
  const { filterValues } = useListContext();
  const [mount, setMount] = useState(false);
  const { permissions } = usePermissions();
  // const userInfoReducer = useSelector(
  //   (state: AppState) => state.userInfoReducer,
  // );
  useEffect(() => {
    setMount(true);
    if (mount === true && permissions === CO_ROLE_PPA) {
      getTrace(
        "Status Filter Selected by PPA",
        "ev-042",
        userInfoReducer.email,
      );
    } else if (mount === true && permissions === CO_ROLE_MRA) {
      getTrace(
        "Status Filter Selected by MRA",
        "ev-093",
        userInfoReducer.email,
      );
    } else if (mount === true && permissions === CO_ROLE_PATIENT) {
      getTrace(
        "Status Filter Selected by Patient",
        "ev-126",
        userInfoReducer.email,
      );
    }
  }, [mount, filterValues.requeststatus]);
  return (
    <FilterList
      label="resources.requests.filters.status"
      icon={<EqualizerIcon />}
    >
      <FilterListItem label="New" value={{ requeststatus: "New" }} />
      <FilterListItem label="Resolved" value={{ requeststatus: "Resolved" }} />
      <FilterListItem
        label="Acknowledged"
        value={{ requeststatus: "Acknowledged" }}
      />
      {permissions !== CO_ROLE_MRA && (
        <FilterListItem label="Pending" value={{ requeststatus: "Pending" }} />
      )}
      <FilterListItem label="Denied" value={{ requeststatus: "Denied" }} />
      <FilterListItem
        label="Cancelled"
        value={{ requeststatus: "Cancelled" }}
      />
      <FilterListItem
        label="Expired"
        value={{ outstandingRequest: true, expired: true }}
      />
      {permissions === CO_ROLE_MRA && (
        <FilterListItem
          label="Outstanding Requests"
          value={{ outstandingRequest: true, expired: false }}
        />
      )}
    </FilterList>
  );
};

export const RequestTypeFilter = (): JSX.Element => {
  const { getTrace } = useTraces();
  // const userInfoReducer = useSelector(
  //   (state: AppState) => state.userInfoReducer,
  // );
  const { filterValues } = useListContext();
  const [mount, setMount] = useState(false);
  const { permissions } = usePermissions();
  useEffect(() => {
    setMount(true);
    if (mount === true && permissions === CO_ROLE_PPA) {
      getTrace(
        "Request Type Filter Selected by PPA",
        "ev-042",
        userInfoReducer.email,
      );
    } else if (mount === true && permissions === CO_ROLE_MRA) {
      getTrace(
        "Request Type Filter Selected by MRA",
        "ev-093",
        userInfoReducer.email,
      );
    } else if (mount === true && permissions === CO_ROLE_PATIENT) {
      getTrace(
        "Request type Filter Selected by Patient",
        "ev-126",
        userInfoReducer.email,
      );
    }
  }, [mount, filterValues.type]);
  return (
    <FilterList
      label="resources.requests.filters.requestType"
      icon={<DoneAllIcon />}
    >
      <FilterListItem
        label="Medical Records Request"
        value={{ categoryType: "request" }}
      />
      <FilterListItem
        label="Addendum Request"
        value={{ categoryType: "addendum" }}
      />
      <FilterListItem
        label={`Billing / Insurance Request`}
        value={{ categoryType: "billing" }}
      />
    </FilterList>
  );
};
export const PatientDependentFilter = (): JSX.Element => {
  const { getTrace } = useTraces();
  const userInfoReducer = useSelector(
    (state: AppState) => state.userInfoReducer,
  );
  const { permissions } = usePermissions();
  useEffect(() => {
    if (permissions === CO_ROLE_PATIENT) {
      getTrace(
        "Patient/Dependent Filter Selected by Patient",
        "ev-126",
        userInfoReducer.email,
      );
    }
  }, []);
  return (
    <FilterList
      label="resources.requests.filters.requestCategory"
      icon={<CategoryIcon />}
    >
      <FilterListItem label="My Requests" value={{ isDependent: false }} />
      <FilterListItem
        label="Dependent Requests"
        value={{ isDependent: true }}
      />
    </FilterList>
  );
};
