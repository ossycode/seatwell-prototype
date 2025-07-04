import BuyersTicketsPurchasedTable from "@/features/buyer/components/BuyersTicketsPurchasedTable";
import { createClient } from "@/utils/supabase/server";
import React from "react";

const BuyersTicketsPurchased = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  return <BuyersTicketsPurchasedTable user={user} />;
};

export default BuyersTicketsPurchased;
