import { api } from "@/trpc/server";
import Link from "next/link";
import RegisterForm from "./register-form";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  page: "Sign Up",
});

export default async function SignUp() {
  const counties = await api.utils.getCounties();

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-balance text-muted-foreground">
          Enter your information to create an account
        </p>
      </div>

      <RegisterForm counties={counties} />

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="underline">
          Sign in
        </Link>
      </div>
    </>
  );
}
