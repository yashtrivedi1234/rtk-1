import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useVerifyEmailMutation, useResendOtpMutation } from "../auth.api";
import { otpSchema } from "../auth.schema";
import { getErrorMessage } from "../../../utils/toast";
import AuthCard from "./AuthCard";
import Field from "../../../components/Field";
import Button from "../../../components/Button";

const RESEND_SECONDS = 60;

// Step 2 of registration: enter the code, then the account is created
const VerifyEmail = ({ pending, onBack }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(otpSchema) });
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const navigate = useNavigate();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const onSubmit = async ({ otp }) => {
    const body = new FormData();
    body.append("email", pending.email);
    body.append("otp", otp);
    body.append("image", pending.image);

    try {
      const result = await verifyEmail(body).unwrap();
      toast.success(result.message);
      navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleResend = async () => {
    try {
      const result = await resendOtp({ email: pending.email }).unwrap();
      toast.success(result.message);
      setSecondsLeft(RESEND_SECONDS);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthCard
      title="Verify your email"
      subtitle={`Step 2 of 2: enter the 6-digit code we sent to ${pending.email}`}
      footer={
        <button onClick={onBack} className="cursor-pointer font-semibold text-primary hover:underline">
          Use a different email
        </button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Verification code" inputMode="numeric" maxLength={6} autoComplete="one-time-code" placeholder="123456" error={errors.otp} {...register("otp")} />
        <Button loading={isLoading} loadingText="Verifying...">Verify and create account</Button>
        <button
          type="button"
          onClick={handleResend}
          disabled={secondsLeft > 0 || isResending}
          className="min-h-11 w-full cursor-pointer rounded-xl bg-primary-soft px-6 font-semibold text-primary transition-colors duration-200 hover:bg-line disabled:cursor-not-allowed disabled:opacity-60"
        >
          {secondsLeft > 0 ? `Resend code in ${secondsLeft}s` : isResending ? "Sending..." : "Resend code"}
        </button>
      </form>
    </AuthCard>
  );
};

export default VerifyEmail;
