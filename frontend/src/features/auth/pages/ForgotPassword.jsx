import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForgotPasswordMutation } from "../auth.api";
import { forgotPasswordSchema } from "../auth.schema";
import { getErrorMessage } from "../../../utils/toast";
import AuthCard from "../components/AuthCard";
import Field from "../../../components/Field";
import Button from "../../../components/Button";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(forgotPasswordSchema) });
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (data) => {
    try {
      const result = await forgotPassword(data).unwrap();
      toast.success(result.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthCard
      title="Forgot password"
      subtitle="Enter your email and we will send you a reset link"
      footer={<Link to="/login" className="font-semibold text-primary hover:underline">Back to login</Link>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Email" type="email" autoComplete="email" placeholder="rahul@example.com" error={errors.email} {...register("email")} />
        <Button loading={isLoading} loadingText="Sending...">Send reset link</Button>
      </form>
    </AuthCard>
  );
};

export default ForgotPassword;
