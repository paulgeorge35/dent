import Link from "next/link";
import ForgotPasswordForm from "./forgot-password-form";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  page: "Forgot Password",
});

export default function ForgotPassword() {
  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password?</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to receive a password reset link
        </p>
      </div>

      <ForgotPasswordForm />

      <Link href="/sign-in" className="text-center underline">
        Back to login
      </Link>
    </>
  );
}
