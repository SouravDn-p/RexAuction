import { configureStore } from "@reduxjs/toolkit";
import userApi from "./features/api/userApi";
import userSlice from "../redux/features/user/userSlice";
import liveBidApi from "./features/api/LiveBidApi";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [liveBidApi.reducerPath]: liveBidApi.reducer,
    userSlice: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware,liveBidApi.middleware),
});

export default store;
