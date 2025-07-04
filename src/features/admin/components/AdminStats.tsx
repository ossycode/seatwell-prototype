"use client";

import ExportButton from "@/components/admin/ExportButton";
import { Routes } from "@/routes";
import { useGetGamesQuery } from "@/services/gamesApi";
import { useGetTicketsQuery } from "@/services/ticketsApi";
import { useGetTransactionsQuery } from "@/services/transactionsApi";
import { useGetUsersQuery } from "@/services/usersApi";
import { ExportType } from "@/types/export";
import { roboto_mono } from "@/utils/fonts";
import {
  UsersIcon,
  CalendarIcon,
  TicketIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const STAT_TYPES = [
  {
    id: 0,
    label: "Users",
    key: "users" as ExportType,
    href: Routes.ADMIN_USERS.path,
    icon: <UsersIcon aria-hidden="true" className="size-6 text-primary" />,
  },
  {
    id: 1,
    label: "Games",
    key: "games" as ExportType,
    href: Routes.ADMIN_GAMES.path,
    icon: <CalendarIcon aria-hidden="true" className="size-6 text-primary" />,
  },
  {
    id: 2,
    label: "Tickets",
    key: "tickets" as ExportType,
    href: Routes.ADMIN_TICKETS.path,
    icon: <TicketIcon aria-hidden="true" className="size-6 text-primary" />,
  },
  {
    id: 3,
    label: "Transactions",
    key: "transactions" as ExportType,
    href: Routes.ADMIN_TRANSACTIONS.path,
    icon: <BanknotesIcon aria-hidden="true" className="size-6 text-primary" />,
  },
];

export default function AdminStats() {
  const { data: users } = useGetUsersQuery({});
  const { data: games } = useGetGamesQuery({});
  const { data: tickets } = useGetTicketsQuery({});
  const { data: transactions } = useGetTransactionsQuery({});

  const stats = STAT_TYPES.map((s) => ({
    ...s,
    value:
      s.key === "users"
        ? users?.data?.length ?? 0
        : s.key === "games"
        ? games?.data.length ?? 0
        : s.key === "tickets"
        ? tickets?.data?.length ?? 0
        : /* transactions */ transactions?.data?.length ?? 0,
  }));
  return (
    <div>
      <dl className="mt-1 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, href, key, icon }) => (
          <div
            key={label}
            className="group  bg-white rounded-lg  hover:shadow-lg transition flex flex-col  shadow-sm "
          >
            <dt className="flex justify-between items-center p-6">
              <div className="relative flex items-center gap-3">
                <div className=" rounded-md bg-accent/50 p-3">{icon}</div>
                <span className="text-lg font-medium text-gray-600">
                  {label}
                </span>
              </div>
              <div
                className={`text-3xl font-bold text-gray-900 ${roboto_mono.className} bg-gray-100 py-2 px-3 rounded-md`}
              >
                {value}
              </div>
            </dt>

            <div className="mt-5 flex-grow flex items-center justify-between text-sm bg-gray-100 px-6 py-4">
              <Link
                href={href}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all<span className="sr-only"> {label} stats</span>
              </Link>

              <ExportButton type={key} />
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
