import type { IAvatar, IUserResponse } from "../../models/UserTypes";
import { apiSlice } from "../../api/apiSlice";
import { updateAvatar } from "../../features/auth/authSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query<IUserResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) =>
        result
          ? [{ type: "User", id }]
          : error?.status === 401
          ? ["UNAUTHORIZED"]
          : ["UNKNOWN_ERROR"],
    }),
    getUsers: builder.query<IUserResponse[], void>({
      query: () => "/users",
      providesTags: (result, error) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : error?.status === 401
          ? ["UNAUTHORIZED"]
          : ["UNKNOWN_ERROR"],
    }),
    sendEmail: builder.mutation<
      any,
      { from: string; to: string; subject: string; text: string }
    >({
      query: ({ from, to, subject, text }) => ({
        url: "/users/send-email",
        method: "POST",
        body: { from, to, subject, text },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    createAvatar: builder.mutation<IAvatar, FormData>({
      query: (formData) => ({
        url: "/users/create-avatar",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) dispatch(updateAvatar(data));
        } catch (e) {
          console.error(e);
        }
      },
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetUsersQuery,
  useCreateAvatarMutation,
} = usersApi;
