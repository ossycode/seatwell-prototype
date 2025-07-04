import { Routes } from "@/routes";
import { TicketStatus } from "@/types/tickets";

export const TABLE_PAGE_SIZE = 5;

export const brandName = "Seatwell";
export const defaultCurrency = "CHF";
export const clubName = "Seatwell FC";

export const headerLinks = [
  { id: 0, name: Routes.HOME.label, href: Routes.HOME.path },
  { id: 1, name: Routes.BUYER.label, href: Routes.BUYER.path },
  { id: 2, name: Routes.SELLER.label, href: Routes.SELLER.path },
  { id: 3, name: Routes.CONTACT.label, href: Routes.CONTACT.path },
];

export const ALL_STATUSES: TicketStatus[] = [
  "pending",
  "approved",
  "rejected",
  "sold",
  "payout_issued",
];
