"use client";

import Link, { LinkProps, useLinkStatus } from "next/link";
import { ComponentProps, ReactNode } from "react";
import Loader from "./Loader";

type CustomLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: LinkProps["href"];
  children: ReactNode;
};

const CustomLink = ({ href, children, ...linkProps }: CustomLinkProps) => {
  const { pending } = useLinkStatus();
  return (
    <Link href={href} {...linkProps}>
      {children}
      {pending ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50">
          <Loader />
        </div>
      ) : null}
    </Link>
  );
};

export default CustomLink;
