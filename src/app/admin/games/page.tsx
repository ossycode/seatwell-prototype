import GamesTable from "@/features/admin/components/games/GamesTable";

const AdminGames = () => {
  return (
    <div className="">
      <h1 className="text-xl sm:text-3xl font-semibold text-center sm:text-left mt-4 mb-14 dark:text-white/90">
        Game Schedule Manager
      </h1>

      <GamesTable />
    </div>
  );
};

export default AdminGames;
