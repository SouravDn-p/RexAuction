import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../redux/features/user/userSlice";
import { baseApi } from "./features/api/baseApi";

export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export default store;
