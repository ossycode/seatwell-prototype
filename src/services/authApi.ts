// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const authApi = createApi({
//   reducerPath: "authApi",
//   baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
//   endpoints: (build) => ({
//     login: build.mutation<
//       { token: string },
//       { email: string; password: string }
//     >({
//       query: (credentials) => ({
//         url: "login",
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//   }),
// });

// export const { useLoginMutation } = authApi;
