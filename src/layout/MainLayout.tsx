import * as React from "react";
//import { useDispatch, useSelector } from "react-redux";
import type { LayoutProps } from "react-admin";
import { Layout, Sidebar, useAuthProvider, useGetList, useSetLocale } from "react-admin";
import AppBar from "./appBar";
// import Menu from "./menu";
// import { darkTheme, lightTheme } from "./themes";
import { useDataProvider } from "react-admin";
// import { userInfoAction } from "./../configuration/actions/userInfoActions";
// import Feedback from "../components/feedback/index";
// import { perPageMin } from "../utils/pageConstants";
// import { Helmet } from "react-helmet";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
// import { isCommentProviderIsCactusComment } from "../utils/comments";
//import "typeface-roboto";
// import { decodeJwt } from "../utils/parseJwt";

import { CO_ROLE_MRA } from "../utils/roles";

import { isExpired, decodeToken } from "react-jwt";
import { perPageMin } from "../lib/universal/utils/pageConstants";
import emptySideBar from "./EmptySidebar";
import { createContext } from 'react';
import { UserProps, TokenProps } from "../types/comptypes";
import { useKeycloak } from "@react-keycloak/web";


const MainLayout = (props: LayoutProps): JSX.Element => {

    const navigate = useNavigate();
    const dataProviderBypass = useDataProvider();
    const setLocale = useSetLocale();
    const { keycloak } = useKeycloak();

    const [userInfo, setUserInfo] = React.useState<UserProps>({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        name: "",
        groups: "",
        role: "",
        id: "",
        emailVerified: false,
        profilePicId: "",
    });

    const UserContext = createContext<UserProps>({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        name: "",
        groups: "",
        role: "",
        id: "",
        emailVerified: false,
        profilePicId: "",
    });



    // const { decodedToken, isExpired } = useJwt(token);

    // const dispatch = useDispatch();
    const ifAuthForm =
        window.location.href.includes("authorizationForm") ||
        window.location.href.includes("patientRequests") ||
        window.location.href.includes("addendumRequestForm") ||
        window.location.href.includes("account");
    const [loading, setLoading] = React.useState(ifAuthForm ? false : true);
    React.useEffect(() => {
        if (!localStorage.getItem("refresh_token") && !ifAuthForm) {
            navigate("/login");
        }
    }, []);
    React.useEffect(() => {
        if (
            !window.location.href.includes("login") &&
            !window.location.href.includes("account")
        ) {
            localStorage.setItem("url", window.location.href);
        }
    }, []);
    React.useEffect(() => {
        keycloak.refreshToken = localStorage.getItem("refresh_token");
        const tokenParsed: any = decodeToken(localStorage.getItem("access_token") || "");
        if (!ifAuthForm || tokenParsed) {
            const queryOption: any = {
                pagination: { page: 1, perPage: perPageMin },
                sort: { field: "id", order: "ASC" },
                filter: {},
            };
            const fetchData = async () => {
                try {

                    const { data } = await dataProviderBypass.getList(
                        "personProfile",
                        queryOption,
                    );

                    if (data.length > 0) {
                        setUserInfo({
                            username: tokenParsed.email,
                            firstName: tokenParsed.given_name,
                            lastName: tokenParsed.family_name,
                            email: tokenParsed.email,
                            name: tokenParsed.name,
                            groups:
                                secureLocalStorage.getItem("role") === CO_ROLE_MRA
                                    ? tokenParsed.groups[0]
                                    : "",
                            role: secureLocalStorage.getItem("role") + "",
                            id: data.length > 0 ? data[0]?.id : "",
                            emailVerified: tokenParsed.email_verified,
                            profilePicId: data[0]?.profilePicId,
                        })


                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
            localStorage.getItem("Lang") === "french"
                ? setLocale("fr")
                : setLocale("en");
        }
    }, [keycloak]);

    // const theme = useSelector(() =>
    //     localStorage.getItem("Theme") === "dark" ? darkTheme : lightTheme,
    // );

    console.log("auth", keycloak.authenticated)



    return (
        <>
            {/* {isCommentProviderIsCactusComment ? (
                <Helmet>
                    <script
                        type="text/javascript"
                        src="https://latest.cactus.chat/cactus.js"
                    ></script>
                </Helmet>
            ) : (
                ""
            )} */}
            {(keycloak.authenticated || ifAuthForm) && !loading && (
                <UserContext.Provider value={userInfo}>
                    <div style={{ fontFamily: "Roboto, sans-serif" }}>
                        <Layout
                            {...props}
                            appBar={ifAuthForm ? emptySideBar : AppBar}
                        //sidebar={ifAuthForm ? emptySideBar : CustomSidebar}
                        // menu={Menu}
                        // theme={theme}
                        />
                    </div>
                </UserContext.Provider>
            )}
        </>
    );
};

export default MainLayout;

