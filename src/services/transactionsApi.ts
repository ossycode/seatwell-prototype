import { GetListParams } from "@/types/shared";
import { Transaction } from "@/types/transaction";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PaginatedTransactions {
  data: Transaction[];
  count: number;
}
export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Transactions"],
  endpoints: (build) => ({
    getTransactions: build.query<PaginatedTransactions, GetListParams>({
      query: ({ search = "", page = 1, limit = 10 } = {}) => ({
        url: "/transactions",
        params: { search, page, limit },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((t) => ({
                type: "Transactions" as const,
                id: t.id,
              })),
              { type: "Transactions", id: "LIST" },
            ]
          : [{ type: "Transactions", id: "LIST" }],
    }),
  }),
});
export const { useGetTransactionsQuery } = transactionsApi;
