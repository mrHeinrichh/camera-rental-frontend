import { createSlice } from "@reduxjs/toolkit";
import { api } from "../api/reducer";
import { initialState } from "./state";
import { TAGS } from "../../constants";

export const authSlice = createSlice({
  name: TAGS.AUTH,
  initialState,
  reducers: {
    logout(state) {
      state.token = "";
      state.user = {};
      state.authenticated = false;
      state.loggedInUserId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        if (payload?.success === true) {
          state.token = payload?.details?.accessToken;
          state.user = payload?.details?.user;
          state.authenticated = true;
          state.loggedInUserId = state.user._id;
        }
      }
    );
    builder.addMatcher(
      api.endpoints.updateUser.matchFulfilled,
      (state, { payload }) => {
        if (payload?.success === true) {
          const updatedUser = payload?.details;
          if (updatedUser._id === state.loggedInUserId) {
            return {
              ...state,
              user: updatedUser,
            };
          }
        }
        return state;
      }
    );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
