"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-semibold text-red-600">
            Something went wrong!
          </h2>
          <p className="mt-2 text-gray-500">{error.message}</p>
          <button
            onClick={() => reset()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try again
          </button>

          <Link href={"/"} className="">
            Go back home
          </Link>
        </div>
      </body>
    </html>
  );
}
