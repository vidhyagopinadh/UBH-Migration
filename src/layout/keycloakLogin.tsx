import * as React from "react";
import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
//import useTraces from "../hooks/useTraces";
import useLogin from "../hooks/useLogin";
import BaseModal from "../components/baseModal";
import useLogout from "../hooks/useLogout";
import { useDataProvider, useTranslate } from "react-admin";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import sendEmailToUnverifiedUser from "../queries/sendEmailToUnverifiedUser/sendEmailToUnverifiedUser";
import type {
  SendEmailToUnverifiedUserMutation,
  SendEmailToUnverifiedUserMutationVariables,
} from "../__generated__/typescript-operations_all";
import { perPageMin } from "../lib/universal/utils/pageConstants";
// const { REACT_APP_KEYCLOAK_SOURCE } = process.env;
const { REACT_APP_BASE_URL } = import.meta.env;
const KeycloakLogin = (): JSX.Element => {
  //const { keycloak } = useKeycloak();
  const translate = useTranslate();
  const {
    setRoles,
    openBase,
    setOpenBase,
    setOpenAdminBase,
    openAdminBase,
    showEmailVerifiedModal,
    setShowEmailVerifiedModal,
  } = useLogin();
  //const { getTrace } = useTraces();
  const navigate = useNavigate();
  const { keycloakLogout } = useLogout();
  const dataProvider = useDataProvider();
  const code: any = getUrlVars()["code"];
  // const keycloakOptions = {
  //   loginHint: REACT_APP_KEYCLOAK_SOURCE,
  // };
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [showSendModal, setShowSendModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [subscribeMutation] = useMutation<
    SendEmailToUnverifiedUserMutation,
    SendEmailToUnverifiedUserMutationVariables
  >(sendEmailToUnverifiedUser, {});
  const [alreadyVerified, setAlreadyVerified] = React.useState(false);

  const authenticated: Boolean = Boolean(localStorage.getItem("authState")) || false;
  const access_token = localStorage.getItem("access_token")

  // useEffect(() => {
  //   getTrace("Login page is loaded", "ev-002", "Anonymous");
  // }, []);
  useEffect(() => {

    if (code === undefined && authenticated === false) {
      //alert("keycloaklogin")
    } else {
      if (access_token) {
        setRoles();
      }
    }
  }, [access_token]);
  const regenerateLink = (): void => {
    setIsLoading(true);
    const queryOption: any = {
      pagination: { page: 1, perPage: perPageMin },
      sort: { field: "id", order: "ASC" },
      filter: {},
    };
    dataProvider
      .getList("personDemographicsDetailsV1", queryOption)
      .then(async ({ data }) => {
        if (data.length > 0) {
          subscribeMutation({
            variables: { input: { userId: data[0].id } },
          }).then((response: any) => {
            setShowEmailVerifiedModal(false);
            setIsLoading(false);
            const regenerateResponse = JSON.parse(
              response.data.sendEmailToUnverifiedUser.json,
            );
            if (regenerateResponse.Success) {
              setShowSendModal(true);
              if (regenerateResponse.code === 200) {
                setAlreadyVerified(false);
              } else {
                setAlreadyVerified(true);
              }
            } else {
              setShowErrorModal(true);
            }
          });
        }
      });
  };
  function getUrlVars(): string[] {
    const vars = [];
    let hash: any;
    const hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
      if (typeof hash[1] != "string") vars[hash[0]] = null;
    }
    return vars;
  }

  return (
    <div style={{ backgroundColor: "#f4f6f8", height: "100vh" }}>
      {showEmailVerifiedModal && (
        <BaseModal
          open={showEmailVerifiedModal}
          confirmAction={() => {
            setShowEmailVerifiedModal(false);
            let urlstr: any = localStorage.getItem("url");
            if (urlstr) {
              navigate(
                urlstr.replace(REACT_APP_BASE_URL, ""),
              );
            } else {
              navigate("/");
            }
            localStorage.removeItem("url");
          }}
          onClose={regenerateLink}
          title={translate(`auth.email_unverified_title`)}
          content={translate(`auth.email_unverified_subtitle`)}
          successButtonName="Ok"
          closeButtonName={isLoading ? "Generating" : "Re-Generate Link"}
          type="emailNotVerified"
        />
      )}
      {showSendModal && (
        <BaseModal
          open={showSendModal}
          confirmAction={() => {
            setShowSendModal(false);
            let urlstr: any = localStorage.getItem("url");
            if (urlstr) {
              navigate(
                urlstr.replace(REACT_APP_BASE_URL, ""),
              );
            } else {
              navigate("/");
            }
            localStorage.removeItem("url");
          }}
          title={alreadyVerified
            ? translate(`auth.already_verified_title`)
            : translate(`auth.regenerate_link_title`)}
          content={alreadyVerified
            ? translate(`auth.already_verified_subtitle`)
            : translate(`auth.regenerate_link_subtitle`)}
          successButtonName="Ok"
          type="regenerateSuccess" onClose={function (e?: any, r?: any): void {
            throw new Error("Function not implemented.");
          }} closeButtonName={""} />
      )}
      {showErrorModal && (
        <BaseModal
          open={showErrorModal}
          confirmAction={() => {
            setShowErrorModal(false);

            let urlstr: any = localStorage.getItem("url");
            if (urlstr) {
              navigate(
                urlstr.replace(REACT_APP_BASE_URL, ""),
              );
            } else {
              navigate("/");
            }
            localStorage.removeItem("url");
          }}
          title={translate(`auth.regenerate_link_error_title`)}
          content={translate("resources.invite.errorMessage")}
          successButtonName="Ok"
          type="regenerateError" onClose={function (e?: any, r?: any): void {
            throw new Error("Function not implemented.");
          }} closeButtonName={""} />
      )}
      {openBase && (
        <BaseModal
          open={openBase}
          confirmAction={() => {
            keycloakLogout();
          }}
          onClose={() => {
            setOpenBase(false);
          }}
          title={translate(`auth.insufficient_role_title`)}
          content={translate(`auth.insufficient_role_subtitle1`)}
          subContent={[
            translate(`auth.insufficient_role_subtitle2`),
            translate(`auth.insufficient_role_subtitle3`),
          ]}
          successButtonName="Ok"
          type="logout"
        />
      )}
      {openAdminBase && (
        <BaseModal
          open={openAdminBase}
          confirmAction={() => {
            keycloakLogout();
          }}
          onClose={() => {
            setOpenAdminBase(false);
          }}
          title={translate(`auth.insufficient_permission_title`)}
          content={translate(`auth.insufficient_permission_subtitle1`)}
          subContent={[
            translate(`auth.insufficient_permission_subtitle2`),
            translate(`auth.insufficient_permission_subtitle3`),
          ]}
          successButtonName="Ok"
          type="logout"
        />
      )}
      {code && (
        <div className="loader-container">
          <h3 style={{ fontFamily: "sans-serif" }}>Loading ....</h3>
          <div className="loader">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default KeycloakLogin;
