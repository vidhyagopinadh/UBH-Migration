import React, {
  useState,
  useEffect,
  useCallback,
  FC,
} from "react";

import {
  useDataProvider,
  usePermissions,
} from "react-admin";

import Welcome from "./welcome";
import UserTag from "./userTag";
import { Review, State } from "../types/types";
import { CO_ROLE_PPA, CO_ROLE_MRA } from "../lib/universal/utils/roles";
import { perPageMax } from "../lib/universal/utils/pageConstants";
// import useTraces from "../hooks/useTraces";

// import Acknowledge from "../components/acknowledge";
import CountCard from "./countCard";
import { Grid } from "@mui/material";

const styles = {
  flex: { display: "flex" },
  flexColumn: { display: "flex", flexDirection: "column" },
  leftCol: { flex: 1, marginRight: "0.5em" },
  rightCol: { flex: 1, marginLeft: "0.5em" },
  singleCol: { marginTop: "1em", marginBottom: "1em" },
};

const Spacer = () => <span style={{ width: "1em" }} />;
const VerticalSpacer: FC = () => {
  return <span style={{ height: "1em" }} />;
};


const Dashboard: FC = () => {
  // const userInfo = useSelector((state: AppState) => state.userInfoReducer);
  // const { getTrace } = useTraces();
  const [mounted, setMounted] = React.useState(false);
  const [openAck] = useState(false);
  const { permissions } = usePermissions();
  // const navigate = useNavigate();
  // const { keycloak } = useKeycloak();
  const [state, setState] = useState<State>({});
  const dataProvider = useDataProvider();
  // const isXSmall = useMediaQuery((theme: Theme) =>
  //   theme.breakpoints.down("xs"),
  // );
  // const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  // const getRequestCount = useCallback(async () => {
  //   if (permissions === CO_ROLE_MRA) {
  //     const { data: requestList } = await dataProvider.getList<Review>(
  //       "requestPpaMraViewV2s",
  //       {
  //         filter: { recordStatusId: 1 },
  //         sort: { field: "id", order: "DESC" },
  //         pagination: { page: 1, perPage: perPageMax },
  //       },
  //     );
  //     const { data: outstandingList } = await dataProvider.getList<Review>(
  //       "requestPpaMraViewV2s",
  //       {
  //         filter: { outstandingRequest: true },
  //         sort: { field: "id", order: "DESC" },
  //         pagination: { page: 1, perPage: perPageMax },
  //       },
  //     );
  //     const { data: expiringList } = await dataProvider.getList<Review>(
  //       "requestPpaMraViewV2s",
  //       {
  //         filter: { expired: true },
  //         sort: { field: "id", order: "DESC" },
  //         pagination: { page: 1, perPage: perPageMax },
  //       },
  //     );
  //     const nbRequestListCount = requestList.length;
  //     const outstandingListCount = outstandingList.length;
  //     const expiringListCount = expiringList.length;
  //     setState((state: any) => ({ ...state, nbRequestListCount }));
  //     setState((state: any) => ({ ...state, outstandingListCount }));
  //     setState((state: any) => ({ ...state, expiringListCount }));
  //   }
  // }, [permissions]);
  // useEffect(() => {
  //   getRequestCount();
  // }, [permissions]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (permissions === CO_ROLE_PPA) {
      // getTrace(" Role of the user verified as PPA", "ev-037", userInfo.email);
    } else if (permissions === CO_ROLE_MRA) {
      // getTrace(" Role of the user verified as MRA", "ev-088", userInfo.email);
    }
  }, [permissions]);

  const dashboardData = document.getElementById("dashboardData");

  React.useEffect(() => {
    setMounted(true);
    if (permissions === CO_ROLE_PPA && mounted === true) {
      // getTrace(" Dashboard Loaded(PPA)", "ev-038", userInfo.email);
    } else if (permissions === CO_ROLE_MRA && mounted === true) {
      // getTrace(" Dashboard Loaded(MRA)", "ev-089", userInfo.email);
    }
    if (
      permissions === CO_ROLE_PPA &&
      mounted &&
      dashboardData !== null &&
      dashboardData.hidden === false
    ) {
      // getTrace("Data loaded in dashboard(PPA)", "ev-039", userInfo.email);
    } else if (
      permissions === CO_ROLE_MRA &&
      mounted &&
      dashboardData !== null &&
      dashboardData.hidden === false
    ) {
      // getTrace("Data loaded in dashboard(MRA)", "ev-090", userInfo.email);
    }
  }, [mounted, dashboardData, permissions]);

  return (
    // isXSmall ? (
    //   <div id="dashboardData">
    //     {openAck ? (
    //       <>
    //         {/* <Acknowledge type="error_message" /> */}
    //       </>
    //     ) : (
    //       <div style={styles.flexColumn as CSSProperties}>
    //         <UserTag />
    //         <Welcome />
    //         {permissions === CO_ROLE_MRA && (
    //           <>
    //             <CountCard value={state.nbRequestListCount} type="total" />
    //             <CountCard
    //               value={state.outstandingListCount}
    //               type="outstanding"
    //             />
    //             <CountCard value={state.expiringListCount} type="expired" />
    //             <VerticalSpacer />
    //           </>
    //         )}
    //       </div>
    //     )}
    //   </div>
    // ) : isSmall ? (
    //   <div style={styles.flexColumn as CSSProperties} id="dashboardData">
    //     {openAck ? (
    //       <>
    //         {/* <Acknowledge type="error_message" /> */}
    //       </>
    //     ) : (
    //       <>
    //         <div style={styles.singleCol}>
    //           <UserTag />
    //           <Welcome />
    //         </div>
    //         {permissions === CO_ROLE_MRA && (
    //           <div style={styles.flex}>
    //             <CountCard value={state.nbRequestListCount} type="total" />
    //             <CountCard
    //               value={state.outstandingListCount}
    //               type="outstanding"
    //             />
    //             <CountCard value={state.expiringListCount} type="expired" />
    //              <Spacer />
    //           </div>
    //         )}
    //       </>
    //     )}
    //   </div>
    // ) :
    <div id="dashboardData">
      <VerticalSpacer />
      {openAck ? (
        <>
          {/* <Acknowledge type="error_message" /> */}
        </>
      ) : (
        <>
          {" "}
          <Grid
            alignItems="flex-end"
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item md={12} lg={12}>
              <UserTag />
            </Grid>
          </Grid>
          <Welcome />
          {permissions === CO_ROLE_MRA && (
            <div style={styles.flex}>
              <div style={styles.leftCol}>
                <div style={styles.flex}>
                  <CountCard value={state.nbRequestListCount} type="total" />
                  <CountCard
                    value={state.outstandingListCount}
                    type="outstanding"
                  />
                  <CountCard value={state.expiringListCount} type="expired" />
                  <Spacer />
                </div>
              </div>
              <div style={styles.rightCol}></div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard;
