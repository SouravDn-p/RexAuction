import { baseApi } from "../baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Auth"],
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["Auth"],
        }),

        refresh: builder.mutation({
            query: () => ({
                url: "/auth/refresh",
                method: "POST",
            }),
            invalidatesTags: ["Auth"],
        }),

        me: builder.query({
            query: () => ({
                url: "/auth/me",
                method: "POST",
            }),
            providesTags: ["Auth"],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRefreshMutation,
    useMeQuery,
} = authApi;