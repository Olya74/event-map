import { apiSlice } from "../../api/apiSlice";
import { logOut, setCredentials } from "./authSlice";
import type {
  ILoginRequest,
  IRegisterRequest,
  IAuthResponse,
} from "../../models/UserTypes";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<IAuthResponse, ILoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: { ...credentials },
        invalidatesTags: (result: any) => (result ? ["UNAUTHORIZED"] : []),
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.userData.user,
              accessToken: data.userData.accessToken,
            })
          );
        } catch {}
      },
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch }) {
        dispatch(logOut());
      },
    }),
    register: build.mutation<IAuthResponse, IRegisterRequest>({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: { ...user },
        invalidatesTags: (result: any) => (result ? ["UNAUTHORIZED"] : []),
      }),
    }),
    refresh: build.query<IAuthResponse, void>({
      query: () => ({
        url: "/refresh",
        method: "GET",
        credentials: "include", // 🔹 обязательно
      }),
    }),
    refetchErroredQueries: build.mutation<null, void>({
      queryFn: () => ({ data: null }),
      invalidatesTags: ["UNKNOWN_ERROR"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshQuery,
  useRegisterMutation,
} = authApiSlice;
