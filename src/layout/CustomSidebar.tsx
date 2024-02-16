import * as React from "react";
import { Layout, Sidebar, useSetLocale } from "react-admin";
const CustomSidebar = (props: any): JSX.Element => (
    <>
        {/* <Feedback page="login" /> */}
        <Sidebar {...props} size={200} />
    </>
);