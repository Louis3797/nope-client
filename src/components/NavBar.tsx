import React from "react";
import { Navbar, Button } from "react-daisyui";

const NavBar = () => {
  return (
    <>
      <Navbar className="shadow-xl bg-base-100">
        <Button className="text-xl normal-case" color="ghost">
          Nope Client
        </Button>
      </Navbar>
    </>
  );
};

export default NavBar;
