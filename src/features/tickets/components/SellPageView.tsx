// "use client";

// // import { useGetGamesQuery } from "@/services/gamesApi";
// import { useListTicketMutation } from "@/services/ticketsApi";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";

// const SellPageView = () => {
//   const [gameId, setGameId] = useState("");
//   const [price, setPrice] = useState<number>(0);
//   const [seatInfo, setSeatInfo] = useState("");
//   const [listTicket, { isLoading }] = useListTicketMutation();
//   // const { data: futureGames } = useGetGamesQuery({ futureOnly: true });
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await listTicket({
//       gameId,
//       sellerId: "currentUserId",
//       price,
//       seatInfo,
//     }).unwrap();
//     router.push("/sell/confirmation");
//   };
//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow"
//     >
//       {/* Game selector (could be a dropdown of games) */}
//       <input
//         value={gameId}
//         onChange={(e) => setGameId(e.target.value)}
//         placeholder="Game ID"
//         className="w-full mb-3 p-2 border rounded"
//         required
//       />
//       <input
//         type="number"
//         value={price}
//         onChange={(e) => setPrice(Number(e.target.value))}
//         placeholder="Price (USD)"
//         className="w-full mb-3 p-2 border rounded"
//         required
//       />
//       <input
//         value={seatInfo}
//         onChange={(e) => setSeatInfo(e.target.value)}
//         placeholder="Seat Info (optional)"
//         className="w-full mb-3 p-2 border rounded"
//       />
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//       >
//         {isLoading ? "Listing…" : "List Ticket"}
//       </button>
//     </form>
//   );
// };

// export default SellPageView;
