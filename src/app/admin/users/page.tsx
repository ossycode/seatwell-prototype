import UserTable from "@/features/admin/components/users/UserTable";

export default function AdminUsers() {
  return (
    <div>
      <h1 className=" text-xl sm:text-3xl font-semibold text-center sm:text-left mt-4 mb-14 dark:text-white/90">
        Manage Users
      </h1>
      <UserTable />
    </div>
  );
}
