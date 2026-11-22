import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Student"],

  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/students",
      providesTags: ["Student"],
    }),

    addStudent: builder.mutation({
      query: (student) => ({ url: "/students", method: "POST", body: student }),
      invalidatesTags: ["Student"],
    }),

    updateStudent: builder.mutation({
      query: ({ _id, ...student }) => ({
        url: `/students/${_id}`,
        method: "PUT",
        body: student,
      }),
      invalidatesTags: ["Student"],
    }),

    deleteStudent: builder.mutation({
      query: (id) => ({ url: `/students/${id}`, method: "DELETE" }),
      invalidatesTags: ["Student"],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
