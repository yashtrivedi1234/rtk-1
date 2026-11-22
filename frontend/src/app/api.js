import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

// One shared API slice. Each feature adds its own endpoints with api.injectEndpoints().
export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Student"],
  endpoints: () => ({}),
});
