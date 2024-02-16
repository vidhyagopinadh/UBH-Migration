import * as React from "react";
import { CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import Configuration from "./configuration/configuration";
import { AccountShow } from "./components/account_setting/accountDetails";
// import CreateRequest from "./views/requests/create/createRequest";
// import CreateAddendumRequest from "./views/addendumRequests/create/createRequest";
// import AddendumRequestForm from "./views/addendumRequests/form/addendumRequestForm";
// import AuthorizationForm from "./views/authorizationForm/authorizationForm";
// import AuthorizationDetails from "./views/authDetails/authorizationDetails";
// import { RequestShow } from "./views/requests/details/requestDetail";
// import { RequestDetailComponent } from "./views/requests/patientRecordRequestForm/requestDetail";
// import BillingRequest from "./views/billing/create/billingRequest";
// import BillingRequestDetail from "./views/billing/details/billingRequestDetail";
export const CustomRoute = () => {
    return (
        <CustomRoutes>
            <Route path="/test" element={<Configuration />} />

        </CustomRoutes>
        // <Route exact path="/requestCreate" render={() => <CreateRequest />} />,

        // <Route
        //   exact
        //   path="/addendumRequestCreate"
        //   render={() => <CreateAddendumRequest />}
        // />,
        // <Route
        //   exact
        //   path="/addendumRequestForm/:id"
        //   render={(rprops) => <AddendumRequestForm id={rprops.match.params.id} />}
        // />,
        // <Route
        //   exact
        //   path="/billingRequestCreate"
        //   render={() => <BillingRequest />}
        // />,
        // <Route
        //   exact
        //   path="/insuranceQuestionRequests/:insuranceUuid/show"
        //   render={(rprops) => (
        //     <BillingRequestDetail insuranceUuid={rprops.match.params.insuranceUuid} />
        //   )}
        // />,
        // <Route
        //   exact
        //   path="/authorizationForm/:formType/:token"
        //   render={(rprops) => (
        //     <AuthorizationForm
        //       formType={rprops.match.params.formType}
        //       token={rprops.match.params.token}
        //     />
        //   )}
        // />,
        // <Route
        //   exact
        //   path="/authorizationForm/:formType"
        //   render={(rprops) => (
        //     <AuthorizationForm formType={rprops.match.params.formType} token={""} />
        //   )}
        // />,
        // <Route
        //   exact
        //   path="/authDetails/:formType/:token"
        //   render={(rprops) => (
        //     <AuthorizationDetails
        //       formType={rprops.match.params.formType}
        //       token={rprops.match.params.token}
        //     />
        //   )}
        // />,

        // <Route
        //   exact
        //   path="/requestPpaMraViewV2s/:id/:tab"
        //   render={(rprops) => (
        //     <RequestShow
        //       basePath="/requestPpaMraViewV2s"
        //       id={rprops.match.params.id}
        //       hasShow={true}
        //       tab={rprops.match.params.tab}
        //       resource="requestPpaMraViewV2s"
        //       {...rprops}
        //     />
        //   )}
        // />,
        // <Route
        //   exact
        //   path="/requestPpaMraViewV2s/:id/:tab"
        //   render={(rprops) => (
        //     <RequestShow
        //       basePath="/requestPpaMraViewV2s"
        //       id={rprops.match.params.id}
        //       hasShow={true}
        //       tab={rprops.match.params.tab}
        //       resource="requestPpaMraViewV2s"
        //       {...rprops}
        //     />
        //   )}
        // />,
        // <Route
        //   exact
        //   path="/requestPpaMraViewV2s/:id/:tab"
        //   render={(rprops) => (
        //     <RequestShow
        //       basePath="/requestPpaMraViewV2s"
        //       id={rprops.match.params.id}
        //       hasShow={true}
        //       tab={rprops.match.params.tab}
        //       resource="requestPpaMraViewV2s"
        //       {...rprops}
        //     />
        //   )}
        // />,
        // <Route
        //   exact
        //   path="/patientRequests/:id/:tab"
        //   render={(rprops) => (
        //     <RequestDetailComponent
        //       basePath="/patientRequests"
        //       id={rprops.match.params.id}
        //       hasShow={true}
        //       tab={rprops.match.params.tab}
        //       resource="requestPpaMraViewV2s"
        //       {...rprops}
        //     />
        //   )}
        // />,
        // <Route
        //   exact
        //   path="/patientRequests/:id/:tab"
        //   render={(rprops) => (
        //     <RequestDetailComponent
        //       basePath="/patientRequests"
        //       id={rprops.match.params.id}
        //       hasShow={true}
        //       tab={rprops.match.params.tab}
        //       resource="requestPatientViews"
        //       {...rprops}
        //     />
        //   )}
        // />,
        // <Route
        //   exact
        //   path="/requestPatientViews/:id/:tab"
        //   render={(rprops) => (
        //     <RequestShow
        //       basePath="/requestPatientViews"
        //       id={rprops.match.params.id}
        //       hasShow={true}
        //       tab={rprops.match.params.tab}
        //       resource="requestPatientViews"
        //       {...rprops}
        //     />
        //   )}
        // />,
    )
}