import { configureStore } from "@reduxjs/toolkit";
import ticketsReducer from "../../features/tickets/ticketsSlice";
import gamesReducer from "../../features/games/gamesSlice";
import adminReducer from "../../features/admin/adminSlice";
import { ticketsApi } from "@/services/ticketsApi";
import { gamesApi } from "@/services/gamesApi";
import { usersApi } from "@/services/usersApi";
import { transactionsApi } from "@/services/transactionsApi";
import { notificationsApi } from "@/services/notificationsApi";
import { payoutsApi } from "@/services/payoutsApi";
import { teamsApi } from "@/services/teamsApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      // auth: authReducer,
      tickets: ticketsReducer,
      games: gamesReducer,
      admin: adminReducer,

      // [authApi.reducerPath]: authApi.reducer,
      [ticketsApi.reducerPath]: ticketsApi.reducer,
      [gamesApi.reducerPath]: gamesApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
      [transactionsApi.reducerPath]: transactionsApi.reducer,
      [notificationsApi.reducerPath]: notificationsApi.reducer,
      [payoutsApi.reducerPath]: payoutsApi.reducer,
      [teamsApi.reducerPath]: teamsApi.reducer,
    },
    middleware: (getDefault) =>
      getDefault()
        // .concat(authApi.middleware)
        .concat(ticketsApi.middleware)
        .concat(gamesApi.middleware)
        .concat(usersApi.middleware)
        .concat(transactionsApi.middleware)
        .concat(notificationsApi.middleware)
        .concat(teamsApi.middleware)
        .concat(payoutsApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
