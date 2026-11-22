import { api } from "../../app/api";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => "/dashboard",
      providesTags: ["Student"], // refreshes whenever students change
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
