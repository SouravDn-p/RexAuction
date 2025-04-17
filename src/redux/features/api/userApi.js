import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:5000`,
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `/users`,
    }),
    getUserByEmail: builder.query({
      query: (email) => `/users?email=${email}`,
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByEmailQuery,
  useAddUserMutation,
  useUpdateUserMutation,
} = userApi;

export default userApi;
