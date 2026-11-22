import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../auth.api";
import { registerSchema } from "../auth.schema";
import { useImagePreview } from "../../../hooks/useImagePreview";
import { getErrorMessage } from "../../../utils/toast";
import AuthCard from "../components/AuthCard";
import Field from "../../../components/Field";
import ImageField from "../../../components/ImageField";
import Button from "../../../components/Button";

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(registerSchema) });
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const preview = useImagePreview(watch("image"));

  const onSubmit = async ({ name, email, password, image }) => {
    const body = new FormData();
    body.append("name", name);
    body.append("email", email);
    body.append("password", password);
    body.append("image", image[0]);

    try {
      const result = await registerUser(body).unwrap();
      toast.success(result.message);
      navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="Register first, then log in to manage your students"
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Name" autoComplete="name" placeholder="Rahul Sharma" error={errors.name} {...register("name")} />
        <Field label="Email" type="email" autoComplete="email" placeholder="rahul@example.com" error={errors.email} {...register("email")} />
        <Field label="Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" error={errors.password} {...register("password")} />
        <Field label="Confirm password" type="password" autoComplete="new-password" placeholder="Re-enter your password" error={errors.confirmPassword} {...register("confirmPassword")} />
        <ImageField label="Profile photo" preview={preview} error={errors.image} {...register("image")} />
        <Button loading={isLoading} loadingText="Creating account...">Register</Button>
      </form>
    </AuthCard>
  );
};

export default Register;
