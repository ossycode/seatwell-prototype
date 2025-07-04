"use client";

import { headerLinks } from "@/utils/constants";
import { usePathname } from "next/navigation";
import CustomLink from "../ui/CustomLink";
import SignOutButton from "../SignoutButton";

interface Props {
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  isCurrentUser: boolean;
}

const MobileNavMenu: React.FC<Props> = ({
  menuOpen,
  setMenuOpen,
  isCurrentUser,
}) => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div
      className={`
        lg:hidden overflow-hidden bg-[#fff] text-white w-full transition-all duration-500 ease-in-out z-40
        absolute left-0 top-[49px] shadow-[0_2px_6px_rgba(0,0,0,0.1)]
        ${menuOpen ? "max-h-[800px]" : "max-h-0"}
      `}
    >
      <ul className="flex flex-col gap-4">
        {headerLinks.map((link) => {
          return (
            <li key={link.id} className="border-b-2 border-[rgba(0,0,0,0.035)]">
              <div className="flex items-center justify-between">
                <CustomLink
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={` text-left block py-[10px] px-[25px] text-[18px] font-semibold ${
                    isActive(link.href) ? "text-accent" : "text-primary"
                  }`}
                >
                  {link.name}
                </CustomLink>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="p-4 ml-3 hover:bg-gray">
        {isCurrentUser && <SignOutButton />}
      </div>
    </div>
  );
};

export default MobileNavMenu;
