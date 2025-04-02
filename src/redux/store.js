import { configureStore } from "@reduxjs/toolkit";
import userApi from "./features/api/userApi";
import userSlice from "../redux/features/user/userSlice";

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    userSlice: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});

export default store;
