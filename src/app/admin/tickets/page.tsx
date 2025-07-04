import TicketsTable from "@/features/admin/components/tickets/TicketsTable";

export default function AdminTicketManagement() {
  return (
    <div className="">
      <h1 className="text-xl sm:text-3xl font-semibold text-center sm:text-left mt-4 mb-14 dark:text-white/90">
        Ticket Management
      </h1>

      <TicketsTable />
    </div>
  );
}
