import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../features/auth/authSlice";
import type { IAuthResponse } from "../models/UserTypes";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any)?.auth?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);

    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  const isLogout =
    typeof args === "string"
      ? args.includes("logout")
      : args?.url?.includes("logout");

  if (isLogout) {
    return result;
  }
  if (result?.error?.status === 401) {
    console.log("⤵️ Access token expired, trying refresh…");
    //send refresh token to get new access token
    const refreshResult = (await baseQuery("/refresh", api, extraOptions)) as {
      data: IAuthResponse;
    };
    if (refreshResult?.data) {
      console.log("✅ Token refreshed", refreshResult.data);
      api.dispatch(
        setCredentials({
          user: refreshResult.data.userData.user,
          accessToken: refreshResult.data.userData.accessToken,
        })
      );
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("❌ Refresh failed — logout");
      api.dispatch(logOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["User", "Event", "Avatar", "UNAUTHORIZED", "UNKNOWN_ERROR"],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
