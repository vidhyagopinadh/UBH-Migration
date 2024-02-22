import * as React from "react";
import { useNavigate } from "react-router-dom"
import type { LayoutProps } from "react-admin";
import { Layout, Sidebar } from "react-admin";
import AppBar from "./appBar";
import CustomSidebar from "./CustomSidebar";
import Menu from "./menu";

// const CustomSidebar = (props: any): JSX.Element => (
//   <>
//     {/* <Feedback page="login" /> */}
//     <Sidebar {...props} size={200} />
//   </>
// );

const emptySideBar = (): JSX.Element => <></>;

export default (props: LayoutProps): JSX.Element => {
  const navigate = useNavigate();
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

  return (
    <>

      <div style={{ fontFamily: "Roboto, sans-serif" }}>
        <Layout
          {...props}
          appBar={ifAuthForm ? emptySideBar : AppBar}
          sidebar={ifAuthForm ? emptySideBar : CustomSidebar}
          menu={Menu}
        //theme={theme}
        />
      </div>

    </>
  );
};
