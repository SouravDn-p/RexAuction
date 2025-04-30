import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://rex-auction-server-side-jzyx.onrender.com`,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `/users`,
      providesTags: ["User"],
    }),

    getUserByEmail: builder.query({
      query: (email) => `/users?email=${email}`,
      providesTags: ["User"],
    }),

    addUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByEmailQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

export default userApi;
