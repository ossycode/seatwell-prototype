import { Game } from "@/types/games";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const gamesApi = createApi({
  reducerPath: "gamesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Games"],
  endpoints: (build) => ({
    // getGames: build.query<Game[], { futureOnly?: boolean; search?: string }>({
    //   query: ({ futureOnly, search }) => ({
    //     url: "/games",
    //     method: "GET",
    //     params: { futureOnly, search },
    //   }),
    //   providesTags: (result = []) => [
    //     ...result.map((g) => ({ type: "Games" as const, id: g.id })),
    //     { type: "Games", id: "LIST" },
    //   ],
    // }),

    getGames: build.query<
      { data: Game[]; count: number },
      { futureOnly?: boolean; search?: string; page?: number; limit?: number }
    >({
      query: ({ futureOnly, search, page = 1, limit = 10 }) => ({
        url: "/games",
        method: "GET",
        params: { futureOnly, search, page, limit },
      }),
      providesTags: (result) => [
        ...(result?.data ?? []).map((g) => ({
          type: "Games" as const,
          id: g.id,
        })),
        { type: "Games", id: "LIST" },
      ],
    }),
    getGameById: build.query<Game, string>({
      query: (id) => `games/${id}`,
      providesTags: (result, error, id) => [{ type: "Games", id }],
    }),
    addGame: build.mutation<Game, Omit<Game, "id">>({
      query: (newGame) => ({ url: "games", method: "POST", body: newGame }),
      invalidatesTags: [{ type: "Games", id: "LIST" }],
    }),
    updateGame: build.mutation<Game, Partial<Game> & Pick<Game, "id">>({
      query: ({ id, ...patch }) => ({
        url: `games/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Games", id }],
    }),
    deleteGame: build.mutation<Game, string>({
      query: (id) => ({ url: `games/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [
        { type: "Games", id },
        { type: "Games", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetGamesQuery,
  useGetGameByIdQuery,
  useAddGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
} = gamesApi;
