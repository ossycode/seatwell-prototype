import ViewAllFutureGames from "@/features/buyer/components/ViewAllFutureGames";
import React from "react";

const BuyPage = () => {
  return (
    <div>
      <h1 className="text-xl sm:text-3xl font-semibold text-center sm:text-left mt-4 mb-14 dark:text-white/90">
        Upcoming Games
      </h1>
      <ViewAllFutureGames />
    </div>
  );
};

export default BuyPage;
