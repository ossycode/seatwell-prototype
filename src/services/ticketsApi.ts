import {
  BuyTicketArgs,
  GetTicketsParams,
  NewTicket,
  Ticket,
  TicketWithGame,
} from "@/types/tickets";
import { BuyerTransaction } from "@/types/transaction";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type GetTicketsBySellerParams = {
  sellerId: string;
  gameId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export const ticketsApi = createApi({
  reducerPath: "ticketsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Tickets"],
  endpoints: (build) => ({
    getTickets: build.query<
      { data: TicketWithGame[]; count: number },
      GetTicketsParams
    >({
      query: ({ page = 1, limit = 10, gameId, search, status }) => ({
        url: "tickets",
        params: {
          page,
          limit,
          ...(gameId ? { gameId } : {}),
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Tickets" as const,
                id,
              })),
              { type: "Tickets", id: "LIST" },
            ]
          : [{ type: "Tickets", id: "LIST" }],
    }),

    // 2) Fetch tickets for a specific game (buyer view)
    getTicketsByGame: build.query<Ticket[], string>({
      query: (gameId) => `tickets${gameId}`,
      providesTags: (result = [], gameId) =>
        result
          .map(({ id }) => ({ type: "Tickets" as const, id }))
          .concat([{ type: "Tickets", id: `GAME_${gameId}` }]),
    }),

    listTicket: build.mutation<Ticket, NewTicket>({
      query: (newTicket) => ({
        url: `tickets`,
        method: "POST",
        body: newTicket,
      }),
      invalidatesTags: [{ type: "Tickets", id: "LIST" }],
    }),

    // 4) Buyer “buys” a ticket
    buyTicket: build.mutation<Ticket, BuyTicketArgs>({
      query: ({ ticketId, buyerId }) => ({
        url: `tickets/${ticketId}/buy`,
        method: "POST",
        body: { buyerId },
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        { type: "Tickets", id: ticketId },
        { type: "Tickets", id: "LIST" },
      ],
    }),

    updateTicket: build.mutation<
      Ticket,
      { id: string; changes: Partial<Ticket> }
    >({
      query: ({ id, changes }) => ({
        url: `tickets/${id}`,
        method: "PATCH",
        body: changes,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Tickets", id },
        { type: "Tickets", id: "LIST" },
      ],
    }),

    deleteTicket: build.mutation<Ticket, string>({
      query: (id) => ({
        url: `tickets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Tickets", id },
        { type: "Tickets", id: "LIST" },
      ],
    }),
    getTicket: build.query<TicketWithGame, string>({
      query: (ticketId) => `tickets/${ticketId}`,
      providesTags: (result, error, id) => [{ type: "Tickets", id }],
    }),
    getTicketsBySeller: build.query<
      { data: TicketWithGame[]; count: number; page: number; limit: number },
      GetTicketsBySellerParams
    >({
      query: ({ sellerId, gameId, status, search, page = 1, limit = 10 }) => ({
        url: `/tickets/seller/${sellerId}`,
        params: {
          gameId,
          status,
          search,
          page,
          limit,
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((ticket) => ({
                type: "Tickets" as const,
                id: ticket.id,
              })),
              { type: "Tickets", id: "LIST" },
            ]
          : [{ type: "Tickets", id: "LIST" }],
    }),
    getTicketsByBuyer: build.query<
      { data: BuyerTransaction[]; count: number; page: number; limit: number },
      { buyerId: string; page?: number; limit?: number }
    >({
      query: ({ buyerId, page = 1, limit = 10 }) => ({
        url: `/tickets/buyer/${buyerId}`,
        params: { page, limit },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((tx) => ({
                type: "Tickets" as const,
                id: tx.ticket.id,
              })),
              { type: "Tickets", id: "LIST" },
            ]
          : [{ type: "Tickets", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketsByGameQuery,
  useListTicketMutation,
  useBuyTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetTicketQuery,
  useGetTicketsBySellerQuery,
  useGetTicketsByBuyerQuery,
} = ticketsApi;
