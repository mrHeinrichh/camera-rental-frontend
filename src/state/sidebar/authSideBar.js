import { createSlice } from "@reduxjs/toolkit";
import { TAGS } from "../../constants";
import { initialState } from "./state";

export const sideBarSlice = createSlice({
  name: TAGS.AUTH,
  initialState,
  reducers: {
    changeLinks(state, action) {
      state.links = action.payload.links;
    },
  },
});

export const { changeLinks } = sideBarSlice.actions;

export default sideBarSlice.reducer;
