import { api } from "../../app/api";

export const studentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/students",
      providesTags: ["Student"],
    }),

    addStudent: builder.mutation({
      query: (formData) => ({ url: "/students", method: "POST", body: formData }),
      invalidatesTags: ["Student"], // the list (and the dashboard) refetch automatically
    }),

    updateStudent: builder.mutation({
      query: ({ _id, body }) => ({ url: `/students/${_id}`, method: "PUT", body }),
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
