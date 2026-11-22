import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { UserPlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useAddStudentMutation, useUpdateStudentMutation } from "../student.api";
import { studentSchema, emptyStudent } from "../student.schema";
import { useImagePreview } from "../../../hooks/useImagePreview";
import { getErrorMessage } from "../../../utils/toast";
import Field from "../../../components/Field";
import ImageField from "../../../components/ImageField";

const StudentForm = ({ editing, onDone }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: editing
      ? { name: editing.name, email: editing.email, course: editing.course }
      : emptyStudent,
  });

  const preview = useImagePreview(watch("image"), editing?.image?.url);
  const [addStudent] = useAddStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const HeaderIcon = editing ? PencilSquareIcon : UserPlusIcon;

  const onSubmit = async ({ name, email, course, image }) => {
    // A file needs FormData, plain JSON cannot carry it
    const body = new FormData();
    body.append("name", name);
    body.append("email", email);
    body.append("course", course);
    if (image?.[0]) body.append("image", image[0]);

    try {
      if (editing) await updateStudent({ _id: editing._id, body }).unwrap();
      else await addStudent(body).unwrap();

      toast.success(editing ? "Student updated" : "Student added");
      reset(emptyStudent);
      onDone();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-2xl bg-surface p-6 shadow-soft ring-1 ring-line">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <HeaderIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-bold">{editing ? "Edit student" : "New student"}</h3>
      </div>

      <Field label="Name" placeholder="Rahul Sharma" error={errors.name} {...register("name")} />
      <Field label="Email" placeholder="rahul@example.com" error={errors.email} {...register("email")} />
      <Field label="Course" placeholder="MERN Stack" error={errors.course} {...register("course")} />
      <ImageField label="Photo (optional)" preview={preview} error={errors.image} {...register("image")} />

      <div className="flex gap-3">
        <button
          disabled={isSubmitting}
          className="min-h-11 cursor-pointer rounded-xl bg-primary px-6 font-semibold text-white transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : editing ? "Update student" : "Add student"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => { reset(emptyStudent); onDone(); }}
            className="min-h-11 cursor-pointer rounded-xl bg-primary-soft px-6 font-semibold text-primary transition-colors duration-200 hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentForm;
