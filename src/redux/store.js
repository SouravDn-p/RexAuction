import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice";
import authSlice from "./features/auth/authSlice";
import { baseApi } from "./features/api/baseApi";

export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    authSlice: authSlice,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export default store;
