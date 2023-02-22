import { createSlice } from "@reduxjs/toolkit";

export const activeChatSlice = createSlice({
  name: "activeChat",
  initialState: {
    focusedItem: null,
  },
  reducers: {
    activeChatUser: (state, action) => {
      state.focusedItem = action.payload;
    },
  },
});

export const { activeChatUser } = activeChatSlice.actions;

export default activeChatSlice.reducer;
