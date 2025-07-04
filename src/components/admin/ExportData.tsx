// "use client";

// import { ExportType } from "@/types/export";
// import { useState } from "react";

// const EXPORT_TYPES: ExportType[] = [
//   "users",
//   "games",
//   "tickets",
//   "transactions",
//   "payouts",
// ];

// export default function ExportData() {
//   const [isLoading, setIsLoading] = useState(false);
//   //   const [exportData, { isLoading }] = useExportDataMutation();

//   //   const download = async (type: ExportType) => {
//   //     try {
//   //       const blob = await exportData(type).unwrap();
//   //       const url = URL.createObjectURL(blob);
//   //       const a = document.createElement("a");
//   //       a.href = url;
//   //       a.download = `${type}.csv`;
//   //       a.click();
//   //       URL.revokeObjectURL(url);
//   //     } catch {
//   //       alert("Export failed.");
//   //     }
//   //   };

//   const downloadCSV = async (type: ExportType) => {
//     setIsLoading(true);
//     const res = await fetch(`/api/admin/export/${type}`);
//     if (!res.ok) return alert("Export failed");

//     const blob = await res.blob();
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${type}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//     setIsLoading(false);
//   };

//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold">📤 Export Data</h2>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
//         {EXPORT_TYPES.map((type) => (
//           <button
//             key={type}
//             onClick={() => downloadCSV(type)}
//             disabled={isLoading}
//             className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded"
//           >
//             Export {type}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
