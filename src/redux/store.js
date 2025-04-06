import { configureStore } from "@reduxjs/toolkit";
import userApi from "./features/api/userApi";
import userSlice from "../redux/features/user/userSlice";
import liveBidApi from "./features/api/LiveBidApi";
import announcementApi from "./features/api/announcementApi";
import auctionApi from "./features/api/auctionApi";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [liveBidApi.reducerPath]: liveBidApi.reducer,
    [announcementApi.reducerPath]: announcementApi.reducer,
    [auctionApi.reducerPath]: auctionApi.reducer,
    userSlice: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      liveBidApi.middleware,
      announcementApi.middleware,
      auctionApi.middleware
    ),
});

export default store;
