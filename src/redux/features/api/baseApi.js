import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: "include",
    }),
    tagTypes: ["User" , "LiveBid", "TopBidders", "RecentActivity" , "Auction"],
    endpoints: () => ({}),
});