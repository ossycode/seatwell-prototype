import React from "react";
import CustomLink from "../ui/CustomLink";
import { Routes } from "@/routes";
import { brandName } from "@/utils/constants";

interface Props {
  textColor?: string;
}
const Logo = ({ textColor = "text-primary" }: Props) => {
  return (
    <CustomLink
      href={`${Routes.HOME.path}`}
      className={`text-2xl sm:text-3xl font-bold ${textColor}`}
    >
      {brandName}
    </CustomLink>
  );
};

export default Logo;
