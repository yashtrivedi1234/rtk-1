import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import authReducer, { logout } from "../features/auth/authSlice";

const appReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});

// On logout, clear all cached data so the next user never sees the previous user's data
const rootReducer = (state, action) => {
  if (logout.match(action)) state = { auth: state.auth };
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

// Keep the login after a page refresh
store.subscribe(() => {
  const { token, user } = store.getState().auth;
  try {
    if (token) localStorage.setItem("auth", JSON.stringify({ token, user }));
    else localStorage.removeItem("auth");
  } catch {
    // the app keeps working even if localStorage is blocked
  }
});
