"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/features/admin/components/NewAdminLayout/AppHeader";
import AdminSidebar from "@/features/admin/components/NewAdminLayout/AdminSidebar";
import Backdrop from "@/features/admin/components/NewAdminLayout/Backdrop";

// import { ReactNode, useEffect, useState } from "react";

// export default function AdminLayout({ children }: { children: ReactNode }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen flex">
//       {/* Mobile + Desktop Sidebar */}
//       <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

//       {/* Main content */}
//       {/* <div className="flex-1 flex flex-col bg-white lg:pl-72">
//         <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
//         <main className="py-10 px-4 sm:px-6 lg:px-8 flex-1 flex">
//           {children}
//         </main>
//       </div> */}
//       <div className="flex-1 flex flex-col bg-white lg:pl-72 ">
//         <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
//         <main className=" px-4 sm:px-6 lg:px-8 bg-green-500">{children}</main>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import {
//   Dialog,
//   DialogBackdrop,
//   DialogPanel,
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuItems,
//   TransitionChild,
// } from "@headlessui/react";
// import {
//   Bars3Icon,
//   BellIcon,
//   Cog6ToothIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import {
//   ChevronDownIcon,
//   MagnifyingGlassIcon,
// } from "@heroicons/react/20/solid";
// import { classNames } from "@/utils/helpers";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Routes } from "@/routes";
// import {
//   HomeIcon,
//   UsersIcon,
//   TicketsIcon,
//   CalendarCog,
//   ArrowRightLeft,
//   TicketCheck,
//   ChartLine,
//   CircleUserRound,
// } from "lucide-react";
// import Logo from "@/components/layout/Logo";
// import { createClient } from "@/utils/supabase/client";
// import { UserResponse } from "@supabase/supabase-js";
// import SignOutButton from "@/components/SignoutButton";

// const navigation = [
//   { name: "Dashboard", href: Routes.ADMIN.path, icon: HomeIcon },
//   { name: "Users", href: Routes.ADMIN_USERS.path, icon: UsersIcon },
//   { name: "Tickets", href: Routes.ADMIN_TICKETS.path, icon: TicketsIcon },
//   { name: "Games", href: Routes.ADMIN_GAMES.path, icon: CalendarCog },
//   {
//     name: "Transactions",
//     href: Routes.ADMIN_TRANSACTIONS.path,
//     icon: ArrowRightLeft,
//   },
//   { name: "Payouts", href: Routes.ADMIN_PAYOUTS.path, icon: TicketCheck },
//   { name: "Analytics", href: Routes.ADMIN_ANALYTICS.path, icon: ChartLine },
// ];

// const userNavigation = [
//   { name: "Your profile", href: "#" },
//   // { name: "Sign out", href: "#" },
// ];

// export default function AdminLayout({ children }: { children: ReactNode }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const supabase = createClient();
//   const [currentUser, setCurrentUser] = useState<UserResponse>();

//   useEffect(() => {
//     supabase.auth.getUser().then((data) => {
//       setCurrentUser(data);
//     });
//   });

//   const pathname = usePathname();

//   useEffect(() => {
//     setSidebarOpen(false);
//   }, [pathname]);

//   return (
//     <>
//       <div className=" w-full h-full bg-white">
//         <Dialog
//           open={sidebarOpen}
//           onClose={setSidebarOpen}
//           className="relative z-50 lg:hidden"
//         >
//           <DialogBackdrop
//             transition
//             className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
//           />

//           <div className="fixed inset-0 flex">
//             <DialogPanel
//               transition
//               className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
//             >
//               <TransitionChild>
//                 <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
//                   <button
//                     type="button"
//                     onClick={() => setSidebarOpen(false)}
//                     className="-m-2.5 p-2.5"
//                   >
//                     <span className="sr-only">Close sidebar</span>
//                     <XMarkIcon
//                       aria-hidden="true"
//                       className="size-6 text-white"
//                     />
//                   </button>
//                 </div>
//               </TransitionChild>

//               {/* Sidebar component, swap this element with another sidebar if you like */}
//               <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
//                 <div className="flex h-16 shrink-0 items-center">
//                   <Logo />
//                 </div>
//                 <nav className="flex flex-1 flex-col">
//                   <ul role="list" className="flex flex-1 flex-col gap-y-7">
//                     <li>
//                       <ul role="list" className="-mx-2 space-y-3">
//                         {navigation.map((item) => {
//                           const current = pathname === item.href;

//                           return (
//                             <li key={item.name}>
//                               <Link
//                                 href={item.href}
//                                 className={classNames(
//                                   current
//                                     ? "bg-gray-50 text-accent"
//                                     : "text-primary hover:bg-gray-50 hover:text-accent",
//                                   "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
//                                 )}
//                               >
//                                 <item.icon
//                                   className={classNames(
//                                     current
//                                       ? "text-accent"
//                                       : "text-gray-400 group-hover:text-accent",
//                                     "size-6 shrink-0"
//                                   )}
//                                   aria-hidden="true"
//                                 />
//                                 {item.name}
//                               </Link>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     </li>

//                     <li className="mt-auto">
//                       <Link
//                         href="#"
//                         className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-accent"
//                       >
//                         <Cog6ToothIcon className="size-6 shrink-0 text-primary group-hover:text-accent" />
//                         Settings
//                       </Link>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>
//             </DialogPanel>
//           </div>
//         </Dialog>

//         {/* Static sidebar for desktop */}
//         <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
//           {/* Sidebar component, swap this element with another sidebar if you like */}
//           <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
//             <div className="flex h-16 shrink-0 items-center">
//               <Logo />
//             </div>
//             <nav className="flex flex-1 flex-col">
//               <ul role="list" className="flex flex-1 flex-col gap-y-7">
//                 <li>
//                   <ul role="list" className="-mx-2 space-y-3">
//                     {navigation.map((item) => {
//                       const current = pathname === item.href;

//                       return (
//                         <li key={item.name}>
//                           <Link
//                             href={item.href}
//                             className={classNames(
//                               current
//                                 ? "bg-gray-50 text-accent"
//                                 : "text-primary hover:bg-gray-50 hover:text-accent",
//                               "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
//                             )}
//                           >
//                             <item.icon
//                               className={classNames(
//                                 current
//                                   ? "text-accent"
//                                   : "text-gray-400 group-hover:text-accent",
//                                 "size-6 shrink-0"
//                               )}
//                               aria-hidden="true"
//                             />
//                             {item.name}
//                           </Link>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </li>

//                 <li className="mt-auto">
//                   <a
//                     href="#"
//                     className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
//                   >
//                     <Cog6ToothIcon
//                       aria-hidden="true"
//                       className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
//                     />
//                     Settings
//                   </a>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>

//         <div className="lg:pl-72 w-full h-full flex flex-col">
//           <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
//             <button
//               type="button"
//               onClick={() => setSidebarOpen(true)}
//               className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
//             >
//               <span className="sr-only">Open sidebar</span>
//               <Bars3Icon aria-hidden="true" className="size-6" />
//             </button>

//             {/* Separator */}
//             <div
//               aria-hidden="true"
//               className="h-6 w-px bg-gray-200 lg:hidden"
//             />

//             <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
//               <form action="#" method="GET" className="grid flex-1 grid-cols-1">
//                 <input
//                   name="search"
//                   type="search"
//                   placeholder="Search"
//                   aria-label="Search"
//                   className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
//                 />
//                 <MagnifyingGlassIcon
//                   aria-hidden="true"
//                   className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
//                 />
//               </form>
//               <div className="flex items-center gap-x-4 lg:gap-x-6">
//                 <button
//                   type="button"
//                   className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
//                 >
//                   <span className="sr-only">View notifications</span>
//                   <BellIcon aria-hidden="true" className="size-6" />
//                 </button>

//                 {/* Separator */}
//                 <div
//                   aria-hidden="true"
//                   className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
//                 />

//                 {/* Profile dropdown */}
//                 <Menu as="div" className="relative">
//                   <MenuButton className="relative flex items-center focus:outline-none focus:ring-0">
//                     <span className="absolute -inset-1.5" />
//                     <span className="sr-only">Open user menu</span>
//                     <CircleUserRound />
//                     <span className="hidden lg:flex lg:items-center">
//                       <span
//                         aria-hidden="true"
//                         className="ml-4 text-sm/6 font-semibold text-gray-900"
//                       >
//                         {currentUser?.data.user?.email}
//                       </span>
//                       <ChevronDownIcon
//                         aria-hidden="true"
//                         className="ml-2 size-5 text-gray-400"
//                       />
//                     </span>
//                   </MenuButton>
//                   <MenuItems
//                     transition
//                     className="absolute right-0 z-10 mt-2 w-38 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
//                   >
//                     {userNavigation.map((item) => (
//                       <MenuItem key={item.name}>
//                         <a
//                           href={item.href}
//                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 data-focus:bg-gray-50 data-focus:outline-hidden"
//                         >
//                           {item.name}
//                         </a>
//                       </MenuItem>
//                     ))}
//                     <div className="border-t border-gray my-1" />
//                     <MenuItem>
//                       <div className="px-4 py-2 hover:bg-gray-50">
//                         <SignOutButton />
//                       </div>
//                     </MenuItem>
//                   </MenuItems>
//                 </Menu>
//               </div>
//             </div>
//           </div>

//           <main className=" w-full bg-white flex-1">
//             <div className="px-2 sm:px-6 h-full w-full ">{children}</div>
//           </main>
//         </div>
//       </div>
//     </>
//   );
// }

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AdminSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
