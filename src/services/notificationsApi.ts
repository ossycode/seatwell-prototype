import { TicketNotification } from "@/types/notification";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Notifications"],
  endpoints: (build) => ({
    getNotifications: build.query<TicketNotification[], string | void>({
      query: (userId) =>
        userId ? `notifications?userId=${userId}` : "notifications",
      providesTags: (result = []) =>
        result.map((n) => ({ type: "Notifications" as const, id: n.id })),
    }),
    addNotification: build.mutation<Notification, Partial<TicketNotification>>({
      query: (body) => ({
        url: "notifications",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});

export const { useGetNotificationsQuery, useAddNotificationMutation } =
  notificationsApi;
