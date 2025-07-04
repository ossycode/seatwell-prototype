import { Team } from "@/types/team";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const teamsApi = createApi({
  reducerPath: "teamsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Teams"],
  endpoints: (build) => ({
    getAllTeams: build.query<Team[], void>({
      query: () => "/teams",
      providesTags: [{ type: "Teams", id: "LIST" }],
    }),
  }),
});

export const { useGetAllTeamsQuery } = teamsApi;
