// LiveBidApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const liveBidApi = createApi({
  reducerPath: "liveBidApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://un-aux.onrender.com",
  }),
  tagTypes: ["LiveBid", "TopBidders", "RecentActivity"],

  endpoints: (builder) => ({
    // Get all live bids
    getLiveBids: builder.query({
      query: () => "/live-bid",
      providesTags: ["LiveBid"],
    }),

    // Get bids by email
    getBidsByEmail: builder.query({
      query: (email) => `/live-bid/${email}`,
      providesTags: ["LiveBid"],
    }),

    // Get top bidders by auction ID
    getTopBidders: builder.query({
      query: (auctionId) => `/live-bid/top?auctionId=${auctionId}`,
      providesTags: ["TopBidders"],
    }),

    // Get recent activity by auction ID
    getRecentActivity: builder.query({
      query: (auctionId) => `/live-bid/recent?auctionId=${auctionId}`,
      providesTags: ["RecentActivity"],
    }),

    // Add a new bid
    addBids: builder.mutation({
      query: (bid) => ({
        url: "/live-bid",
        method: "POST",
        body: bid,
      }),
      invalidatesTags: ["LiveBid", "TopBidders", "RecentActivity"],
    }),
  }),
});

export const {
  useGetLiveBidsQuery,
  useGetBidsByEmailQuery,
  useGetTopBiddersQuery,
  useGetRecentActivityQuery,
  useAddBidsMutation,
} = liveBidApi;

export default liveBidApi;
