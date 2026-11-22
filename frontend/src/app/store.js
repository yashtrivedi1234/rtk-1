import { configureStore } from "@reduxjs/toolkit";
import { studentApi } from "../features/students/studentApi";

export const store = configureStore({
  reducer: {
    [studentApi.reducerPath]: studentApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(studentApi.middleware),
});
