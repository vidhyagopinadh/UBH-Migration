import {
    createBrowserRouter
} from "react-router-dom";
import Configuration from "./configuration/configuration";
import PageNotFound from "./Layouts/PageNotFound";
import MainLayoutRoute from "./Layouts/MainLayoutRoute";
import { AccountShow } from "./components/account_setting/accountDetails";

export const router = createBrowserRouter([
    {
        path: "/configuration",
        element: <MainLayoutRoute
            pagekey="config"
            comp={<Configuration />}
        />
    },
    // {
    //     path: "/profile/:tab",
    //     element: <MainLayoutRoute
    //         pagekey="account"
    //         comp={<AccountShow basePath="/profile"
    //             hasShow={true}
    //             tab={rprops.match.params.tab}
    //             {...rprops} />}
    //     />
    // },
    {
        path: "*",
        element: <PageNotFound />
    }
]);