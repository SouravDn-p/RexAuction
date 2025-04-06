import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const auctionApi = createApi({
  reducerPath: "auctionApi",
  baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:5000` }),
  tagTypes: ["Auction"],
  endpoints: (builder) => ({
    getAuctions: builder.query({
      query: () => `/auctions`,
      providesTags: ["Auction"],
    }),

    // Get auctions by seller email
    getAuctionByEmail: builder.query({
      query: (email) => `/auctions?email=${email}`,
      providesTags: ["Auction"],
    }),

    addAuction: builder.mutation({
      query: (auction) => ({
        url: "/auctions",
        method: "POST",
        body: auction,
      }),
      invalidatesTags: ["Auction"],
    }),

    updateAuction: builder.mutation({
      query: ({ id, data }) => ({
        url: `/auctions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Auction"],
    }),

    deleteAuction: builder.mutation({
      query: (id) => ({
        url: `/auctions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Auction"],
    }),
  }),
});

export const {
  useGetAuctionsQuery,
  useGetAuctionByEmailQuery,
  useAddAuctionMutation,
  useUpdateAuctionMutation,
  useDeleteAuctionMutation,
} = auctionApi;

export default auctionApi;
