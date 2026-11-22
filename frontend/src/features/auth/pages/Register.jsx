import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import VerifyEmail from "../components/VerifyEmail";

// Two steps: 1) details + email code, 2) verify the code (the account is created only then)
const Register = () => {
  const [pending, setPending] = useState(null); // { email, image } after step 1

  return pending ? (
    <VerifyEmail pending={pending} onBack={() => setPending(null)} />
  ) : (
    <RegisterForm onCodeSent={setPending} />
  );
};

export default Register;
