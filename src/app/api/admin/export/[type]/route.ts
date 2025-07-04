// app/api/admin/export/[type]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const ALLOWED = [
  "users",
  "games",
  "tickets",
  "transactions",
  "payouts",
] as const;
type ExportType = (typeof ALLOWED)[number];

/** A row is a map from column name → primitive value or null */
type Row = Record<string, string | number | boolean | null>;

/** Convert an array of rows into CSV text */
function arrayToCSV(rows: Row[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: string | number | boolean | null): string => {
    if (v === null) return "";
    const s = String(v).replace(/"/g, '""');
    return `"${s}"`;
  };
  const headerLine = headers.join(",");
  const bodyLines = rows.map((row) =>
    headers.map((h) => escape(row[h])).join(",")
  );
  return [headerLine, ...bodyLines].join("\r\n");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type: typeParam } = await params;
  if (!ALLOWED.includes(typeParam as ExportType)) {
    return NextResponse.json(
      { error: `Invalid export type: ${typeParam}` },
      { status: 400 }
    );
  }
  const table = typeParam as ExportType;

  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Flatten one level of nested objects
  const rawRows = data as Record<string, unknown>[];
  const rows: Row[] = rawRows.map((r) => {
    const flat: Row = {};
    for (const [k, v] of Object.entries(r)) {
      if (v !== null && typeof v === "object") {
        // flatten nested object
        const nested = v as Record<string, unknown>;
        for (const [k2, v2] of Object.entries(nested)) {
          flat[`${k}_${k2}`] =
            v2 === null || ["string", "number", "boolean"].includes(typeof v2)
              ? (v2 as string | number | boolean | null)
              : JSON.stringify(v2);
        }
      } else if (
        v === null ||
        ["string", "number", "boolean"].includes(typeof v)
      ) {
        flat[k] = v as string | number | boolean | null;
      } else {
        // for any other type, stringify
        flat[k] = String(v);
      }
    }
    return flat;
  });

  const csv = arrayToCSV(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${table}.csv"`,
    },
  });
}
