import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IUserResponse } from "../../models/UserTypes";
import type { IAvatar } from "../../models/UserTypes";

interface AuthState {
  token: string | null;
  user: IUserResponse | null;
  isAuthChecked: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthChecked: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: IUserResponse; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthChecked = true;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthChecked = false;
    },
    updateAvatar: (state, action: PayloadAction<IAvatar>) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
export const selectedCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectedCurrentToken = (state: { auth: AuthState }) =>
  state.auth.token;
export const selectIsAuthChecked = (state: { auth: AuthState }) =>
  state.auth.isAuthChecked;
export const { updateAvatar } = authSlice.actions;
