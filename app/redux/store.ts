import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { customerApi } from "~/services/customerApi";

export const store = configureStore({
  reducer: {
    [customerApi.reducerPath]: customerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(customerApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Enable the RTK Query DevTools only in development mode
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
