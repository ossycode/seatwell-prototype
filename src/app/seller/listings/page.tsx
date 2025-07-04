import SellerListingsView from "@/features/seller/components/SellerListingsView";
import { createClient } from "@/utils/supabase/server";

const SellerListing = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return <p className="p-6 text-red-600">Not signed in.</p>;
  }

  return (
    <div>
      <h1 className="text-xl sm:text-3xl font-semibold text-center sm:text-left mt-4 mb-14 dark:text-white/90">
        All Your Tickets Listings
      </h1>
      <SellerListingsView userId={user?.id} />
    </div>
  );
};

export default SellerListing;
