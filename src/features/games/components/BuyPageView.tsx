// "use client";

// import { useGetGamesQuery } from "@/services/gamesApi";
// import Link from "next/link";
// import React from "react";

// const BuyPageView = () => {
//   const { data: games, isLoading, error } = useGetGamesQuery({});

//   if (isLoading) return <p>Loading games…</p>;
//   if (error) return <p>Error loading games</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl mb-4">Upcoming Games</h1>
//       <ul className="space-y-3">
//         {games!.map((g) => (
//           <li
//             key={g.id}
//             className="p-4 border rounded hover:bg-gray-50 flex justify-between"
//           >
//             <div>
//               <p className="font-medium">
//                 {g.home_team} vs {g.away_team}
//               </p>
//               <p className="text-sm text-gray-600">
//                 {new Date(g.date).toLocaleString()} @ {g.venue}
//               </p>
//             </div>
//             <Link href={`/buy/${g.id}`}>
//               <button className="px-3 py-1 bg-blue-600 text-white rounded">
//                 View Tickets
//               </button>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default BuyPageView;
