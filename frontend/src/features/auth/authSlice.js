import { createSlice } from "@reduxjs/toolkit";

const empty = { user: null, token: null };

// Read from localStorage so the user stays logged in after a refresh
const loadAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("auth")) ?? empty;
  } catch {
    return empty;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuth,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
    },
    logout: () => empty,
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
