import { Payout } from "@/types/payout";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface GetPayoutsParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: "pending" | "paid";
  seller_id?: string;
}
export const payoutsApi = createApi({
  reducerPath: "payoutsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin/payouts" }),
  tagTypes: ["Payouts"],
  endpoints: (build) => ({
    getPayouts: build.query<
      { data: Payout[]; count: number },
      GetPayoutsParams
    >({
      query: ({
        search = "",
        page = 1,
        limit = 10,
        status,
        seller_id = "",
      } = {}) => ({
        url: "",
        params: { search, page, limit, status, seller_id },
      }),
      providesTags: (res) =>
        res?.data
          ? [
              ...res.data.map((p) => ({ type: "Payouts" as const, id: p.id })),
              { type: "Payouts", id: "LIST" },
            ]
          : [{ type: "Payouts", id: "LIST" }],
    }),
    payPayout: build.mutation<Payout, string>({
      query: (id) => ({ url: `/${id}/pay`, method: "POST" }),
      invalidatesTags: [{ type: "Payouts", id: "LIST" }],
    }),
  }),
});

export const { useGetPayoutsQuery, usePayPayoutMutation } = payoutsApi;
