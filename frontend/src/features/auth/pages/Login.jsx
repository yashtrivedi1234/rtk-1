import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLoginMutation } from "../auth.api";
import { setCredentials } from "../authSlice";
import { loginSchema } from "../auth.schema";
import { getErrorMessage } from "../../../utils/toast";
import AuthCard from "../components/AuthCard";
import Field from "../../../components/Field";
import Button from "../../../components/Button";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      toast.success(`Welcome back, ${result.user.name}!`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your account"
      footer={<>New here? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Email" type="email" autoComplete="email" placeholder="rahul@example.com" error={errors.email} {...register("email")} />
        <Field label="Password" type="password" autoComplete="current-password" placeholder="••••••••" error={errors.password} {...register("password")} />
        <div className="text-right text-sm">
          <Link to="/forgot-password" className="font-semibold text-primary hover:underline">Forgot password?</Link>
        </div>
        <Button loading={isLoading} loadingText="Logging in...">Log in</Button>
      </form>
    </AuthCard>
  );
};

export default Login;
