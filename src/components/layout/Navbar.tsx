"use client";

import { headerLinks } from "@/utils/constants";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import CustomLink from "../ui/CustomLink";
import { Menu, X } from "lucide-react";
import MobileNavMenu from "./MobileNavbar";
import { inter } from "@/utils/fonts";
import { createClient } from "@/utils/supabase/client";
import { UserResponse } from "@supabase/supabase-js";
import SignOutButton from "../SignoutButton";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const pathname = usePathname();

  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<UserResponse>();

  useEffect(() => {
    supabase.auth.getUser().then((data) => {
      setCurrentUser(data);
    });
  });

  return (
    <nav className={`transition-all duration-300 ease-out ${inter.className}`}>
      <ul className="hidden lg:flex items-center gap-11 ">
        {headerLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.id} className="relative group">
              <CustomLink
                href={link.href}
                className={`
            relative inline-block text-[14px] leading-[74px] font-medium tracking-[.2px]
            transition-all duration-300
            ${isActive ? "text-accent" : "text-primary hover:text-accent"}
          `}
              >
                <span className="relative inline-block">
                  <span className="transition-colors duration-300 flex items-center gap-1.5">
                    {link.name}
                  </span>

                  <span
                    className={`
                absolute inset-0 flex items-center justify-between text-primary
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
              `}
                  >
                    <span
                      className="
                  transition-transform duration-300 transform translate-x-4 group-hover:-translate-x-4
                "
                    >
                      [
                    </span>
                    <span
                      className="
                  transition-transform duration-300 transform -translate-x-4 group-hover:translate-x-4
                "
                    >
                      ]
                    </span>
                  </span>
                </span>
              </CustomLink>
            </li>
          );
        })}
        {currentUser?.data.user && <SignOutButton />}
      </ul>
      <div className="lg:hidden z-50 relative">
        <button onClick={toggleMenu} className="flex gap-1 items-center">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
          <span>Menu</span>
        </button>
      </div>

      <MobileNavMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        isCurrentUser={!!currentUser?.data.user}
      />
    </nav>
  );
};

export default Navbar;
