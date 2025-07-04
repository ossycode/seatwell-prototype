import TransactionsTable from "@/features/admin/components/transactions/TransactionsTable";
import React from "react";

const AdminTransactions = () => {
  return (
    <div className="">
      <h1 className="text-xl sm:text-3xl font-semibold text-center sm:text-left mt-4 mb-14 dark:text-white/90">
        Transactions
      </h1>
      <TransactionsTable />
    </div>
  );
};
export default AdminTransactions;
