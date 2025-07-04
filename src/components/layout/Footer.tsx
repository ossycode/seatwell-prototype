"use client";

// import Image from "next/image";
import React from "react";
import CustomLink from "../ui/CustomLink";
import { Routes } from "@/routes";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-6 flex items-center justify-between">
      <div className=" ">
        <p className="mt-2 text-sm">
          &copy; {new Date().getFullYear()} Seatwell. All rights reserved.
        </p>
      </div>
      <div className="flex items-center  justify-end gap-6  w-1/2">
        <CustomLink href={"#"}>Terms & Agreements</CustomLink>
        <CustomLink href={Routes.ADMIN_LOGIN.path} className="text-sm">
          Admin Login
        </CustomLink>
      </div>
    </footer>
  );
};

export default Footer;
