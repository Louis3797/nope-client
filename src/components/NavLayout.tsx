import React from "react";
import NavBar from "./NavBar";

interface NavLayoutProps {
  children: React.ReactNode;
}
const NavLayout: React.FC<NavLayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default NavLayout;
