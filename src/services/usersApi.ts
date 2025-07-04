import type { User } from "@/types/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Users"],
  endpoints: (build) => ({
    getUsers: build.query<
      { data: User[]; count: number },
      { search?: string; page?: number; limit?: number; role?: string }
    >({
      query: ({ search = "", page = 1, limit = 10, role }) => ({
        url: "/users",
        params: { search, page, limit, role },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((u) => ({ type: "Users" as const, id: u.id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    updateUser: build.mutation<User, Partial<User> & Pick<User, "id">>({
      query: ({ id, ...patch }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Users", id }],
    }),
    deleteUser: build.mutation<User, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
    createUser: build.mutation<
      User,
      { email: string; password: string; role: string }
    >({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
} = usersApi;
