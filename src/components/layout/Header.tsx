import React from "react";
import Navbar from "./Navbar";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between px-4 ms:px-14 py-2 bg-gray ">
      <Logo />
      <Navbar />
    </header>
  );
};

export default Header;
