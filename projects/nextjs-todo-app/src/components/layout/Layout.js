import React from "react";
import MainNavigation from "./MainNavigation";

const Layout = (props) => {
  return (
    <>
      <header>
        <MainNavigation />
      </header>
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
