import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../auth.api";
import { registerSchema } from "../auth.schema";
import { useImagePreview } from "../../../hooks/useImagePreview";
import { getErrorMessage } from "../../../utils/toast";
import AuthCard from "./AuthCard";
import Field from "../../../components/Field";
import ImageField from "../../../components/ImageField";
import Button from "../../../components/Button";

// Step 1 of registration: collect the details and email a verification code
const RegisterForm = ({ onCodeSent }) => {
  const { register, handleSubmit, watch, setValue, clearErrors, formState: { errors } } = useForm({ resolver: yupResolver(registerSchema) });
  const [registerUser, { isLoading }] = useRegisterMutation();
  const image = watch("image");
  const preview = useImagePreview(image);

  const removeImage = () => {
    setValue("image", null); // also empties the file input
    clearErrors("image");
  };

  const onSubmit = async ({ name, email, password, image }) => {
    try {
      const result = await registerUser({ name, email, password }).unwrap();
      toast.success(result.message);
      // The photo is uploaded in step 2, so keep the chosen file until then
      onCodeSent({ email: result.email, image: image[0] });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="Step 1 of 2: enter your details. We will email you a verification code."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Name" autoComplete="name" placeholder="Rahul Sharma" error={errors.name} {...register("name")} />
        <Field label="Email" type="email" autoComplete="email" placeholder="rahul@example.com" error={errors.email} {...register("email")} />
        <Field label="Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" error={errors.password} {...register("password")} />
        <Field label="Confirm password" type="password" autoComplete="new-password" placeholder="Re-enter your password" error={errors.confirmPassword} {...register("confirmPassword")} />
        <ImageField label="Profile photo" preview={preview} hasFile={image?.length > 0} onRemove={removeImage} error={errors.image} {...register("image")} />
        <Button loading={isLoading} loadingText="Sending code...">Send verification code</Button>
      </form>
    </AuthCard>
  );
};

export default RegisterForm;
