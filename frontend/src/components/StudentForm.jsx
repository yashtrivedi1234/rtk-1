import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useAddStudentMutation,
  useUpdateStudentMutation,
} from "../services/studentApi";

// Yup schema: validation ke saare rules yaha likhte hain
// Regex (pattern) ek jagah, taaki samjhana easy ho
const nameRegex = /^[A-Za-z ]+$/; // sirf letters aur space
const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/; // abc@xyz.com
const courseRegex = /^[A-Za-z0-9 .+#-]+$/; // letters, numbers, space aur . + # -

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name zaroori hai")
    .min(2, "Name kam se kam 2 letters ka ho")
    .matches(nameRegex, "Name me sirf letters allowed hain"),
  email: yup
    .string()
    .trim()
    .required("Email zaroori hai")
    .matches(emailRegex, "Sahi email daalo (jaise abc@gmail.com)"),
  course: yup
    .string()
    .trim()
    .required("Course zaroori hai")
    .matches(courseRegex, "Course me special characters allowed nahi hain"),
});

const empty = { name: "", email: "", course: "" };

// Label + input + error message ek jagah
const Field = ({ label, error, ...inputProps }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
    <input
      className={`w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-indigo-300 ${
        error ? "border-red-400" : "border-slate-300"
      }`}
      {...inputProps}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
);

const StudentForm = ({ editing, onDone }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema), // resolver yup ko react-hook-form se jodta hai
    defaultValues: editing || empty, // edit mode me purana data bhara hota hai
  });

  const [addStudent, { error: addError }] = useAddStudentMutation();
  const [updateStudent, { error: updateError }] = useUpdateStudentMutation();
  const apiError = addError || updateError;

  // handleSubmit tabhi chalta hai jab validation pass ho
  const onSubmit = async (data) => {
    const result = editing
      ? await updateStudent({ ...data, _id: editing._id })
      : await addStudent(data);
    if (!result.error) {
      reset(empty);
      onDone();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-800">{editing ? "Edit Student" : "Add Student"}</h2>

      <Field label="Name" placeholder="Rahul Sharma" error={errors.name} {...register("name")} />
      <Field label="Email" placeholder="rahul@example.com" error={errors.email} {...register("email")} />
      <Field label="Course" placeholder="MERN Stack" error={errors.course} {...register("course")} />

      {apiError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {apiError.data?.message || "Something went wrong"}
        </p>
      )}

      <div className="flex gap-2">
        <button disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {isSubmitting ? "Saving..." : editing ? "Update" : "Add Student"}
        </button>
        {editing && (
          <button type="button" onClick={() => { reset(empty); onDone(); }} className="rounded-lg bg-slate-200 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-300">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentForm;
