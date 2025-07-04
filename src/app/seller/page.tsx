import React from "react";
import { createClient } from "@/utils/supabase/server";
import OverviewPage from "@/features/seller/components/OverviewPage";
import { Routes } from "@/routes";
import Link from "next/link";

export default async function SellerDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return <p className="p-6 text-red-600">Not signed in.</p>;
  }

  return (
    <div className=" space-y-10">
      <div className="flex items-center justify-between">
        <h1 className=" text-xl sm:text-3xl font-semibold text-center sm:text-left mt-4 mb-14 dark:text-white/90">
          Overview Dashboard
        </h1>
        <Link
          href={Routes.SELLER_RELEASE.path}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Release More Tickets
        </Link>
      </div>
      <OverviewPage userId={user.id} />
    </div>
  );
}
