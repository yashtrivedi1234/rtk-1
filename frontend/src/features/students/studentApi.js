import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// RTK Query: yaha saari API calls define hoti hain.
// Har endpoint ke liye ek hook automatically ban jata hai.
export const studentApi = createApi({
  reducerPath: "studentApi",
  // URL frontend/.env se aata hai (Vite me variable ka naam VITE_ se shuru hona chahiye)
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Student"], // cache ka naam, refresh karne ke liye

  endpoints: (builder) => ({
    // READ -> useGetStudentsQuery()
    getStudents: builder.query({
      query: () => "/students",
      providesTags: ["Student"],
    }),

    // CREATE -> useAddStudentMutation()
    addStudent: builder.mutation({
      query: (student) => ({ url: "/students", method: "POST", body: student }),
      invalidatesTags: ["Student"], // list apne aap dobara fetch hogi
    }),

    // UPDATE -> useUpdateStudentMutation()
    updateStudent: builder.mutation({
      query: ({ _id, ...student }) => ({
        url: `/students/${_id}`,
        method: "PUT",
        body: student,
      }),
      invalidatesTags: ["Student"],
    }),

    // DELETE -> useDeleteStudentMutation()
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
