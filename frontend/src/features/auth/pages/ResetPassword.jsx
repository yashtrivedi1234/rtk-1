import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../auth.api";
import { resetPasswordSchema } from "../auth.schema";
import { getErrorMessage } from "../../../utils/toast";
import AuthCard from "../components/AuthCard";
import Field from "../../../components/Field";
import Button from "../../../components/Button";

const ResetPassword = () => {
  const { token } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(resetPasswordSchema) });
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const onSubmit = async ({ password }) => {
    try {
      const result = await resetPassword({ token, password }).unwrap();
      toast.success(result.message);
      navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a new password for your account"
      footer={<Link to="/login" className="font-semibold text-primary hover:underline">Back to login</Link>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="New password" type="password" autoComplete="new-password" placeholder="At least 8 characters" error={errors.password} {...register("password")} />
        <Field label="Confirm password" type="password" autoComplete="new-password" placeholder="Re-enter your password" error={errors.confirmPassword} {...register("confirmPassword")} />
        <Button loading={isLoading} loadingText="Saving...">Reset password</Button>
      </form>
    </AuthCard>
  );
};

export default ResetPassword;
