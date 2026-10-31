import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/shared/api/baseApi";
import uiReducer from "@/store/uiSlice";

// RTK Query owns server-data caching; the UI slice owns local language/accessibility preferences.
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    ui: uiReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
