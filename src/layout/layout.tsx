import * as React from "react";
import { useNavigate } from "react-router-dom"
import type { LayoutProps } from "react-admin";
import { Layout, Sidebar, useLocaleState } from "react-admin";
import AppBar from "./appBar";
import CustomSidebar from "./CustomSidebar";
import Menu from "./menu";
import { useKeycloak } from "@react-keycloak/web";
import { useDataProvider } from "react-admin";
import { decodeToken } from "react-jwt";
import { perPageMin } from "../lib/universal/utils/pageConstants";
import { UserProps } from "../types/comptypes";
import secureLocalStorage from "react-secure-storage";
import { CO_ROLE_MRA } from "../lib/universal/utils/roles";


// const CustomSidebar = (props: any): JSX.Element => (
//   <>
//     {/* <Feedback page="login" /> */}
//     <Sidebar {...props} size={200} />
//   </>
// );

const emptySideBar = (): JSX.Element => <></>;

export default (props: LayoutProps): JSX.Element => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const dataProviderBypass = useDataProvider();

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

  const [locale, setLocale] = useLocaleState();
  const ifAuthForm =
    window.location.href.includes("authorizationForm") ||
    window.location.href.includes("patientRequests") ||
    window.location.href.includes("addendumRequestForm") ||
    window.location.href.includes("account");
  const [loading, setLoading] = React.useState(ifAuthForm ? false : true);
  React.useEffect(() => {
    if (!localStorage.getItem("refresh_token") && !ifAuthForm) {
      localStorage.clear()
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
    // keycloak.refreshToken = localStorage.getItem("refresh_token");

    const tokenParsed: any = decodeToken(localStorage.getItem("access_token") || "");
    if (!ifAuthForm || tokenParsed?.payload) {
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

          console.log(data);

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
  }, []);
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
        <div style={{ fontFamily: "Roboto, sans-serif" }}>
          <Layout
            {...props}
            appBar={ifAuthForm ? emptySideBar : AppBar}
            sidebar={ifAuthForm ? emptySideBar : CustomSidebar}
            menu={Menu}
          //theme={theme}
          />
        </div>
      )}

    </>
  );
};
