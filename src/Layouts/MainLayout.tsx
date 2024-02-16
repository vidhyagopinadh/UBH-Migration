import * as React from "react";
import ResponsiveAppBar from "../containers/common/Appbar";

const MainLayout = (props: any) => {

  return (
    <>
      <div className="wrapper">
        <ResponsiveAppBar pagekey={props.pagekey} />
      </div>

    </>
  );
};

export default MainLayout;
