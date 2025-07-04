import PayoutsTable from "@/features/admin/components/payouts/PayoutsTable";

export default function AdminPayouts() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Payouts</h1>
      <PayoutsTable />
    </div>
  );
}
