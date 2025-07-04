// import { TicketWithGame } from "@/types/tickets";
// import { SupabaseClient } from "@supabase/supabase-js";

import { defaultCurrency } from "./constants";

export function generateCode(): string {
  const now = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TCK-${now}-${random}`;
}

export const fmtCurrency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: defaultCurrency,
});

export function formatCurrency(value: number, currency = "CHF") {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatDateWithoutTime = (date?: string) => {
  if (!date) return;
  return new Date(date).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
