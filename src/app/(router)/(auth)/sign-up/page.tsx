import Link from "next/link";
import RegisterForm from "./register-form";
import { constructMetadata } from "@/lib/utils";
import { z } from "zod";
import RootFormError from "@/components/ui/root-form-error";
import { type SearchParams } from "@/types";
import GoogleSignUp from "./google";
import { Separator } from "@/components/ui/separator";

export const metadata = constructMetadata({
  page: "Sign Up",
});

const searchParamsSchema = z.object({
  error: z.string().optional(),
});

export interface SignUpPageProps {
  searchParams: SearchParams;
}
export default async function SignUp({ searchParams }: SignUpPageProps) {
  const { error } = searchParamsSchema.parse(searchParams);

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-balance text-muted-foreground">
          Sign up using one of the options below
        </p>
      </div>
      <span className="vertical gap-4">
        <RootFormError error={error} />
        <GoogleSignUp />
      </span>
      <span className="horizontal center-v w-full gap-4">
        <Separator className="w-auto grow" />
        <span className="text-xs text-muted-foreground">
          OR SIGN UP WITH EMAIL
        </span>
        <Separator className="w-auto grow" />
      </span>

      <RegisterForm />

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="underline">
          Sign in
        </Link>
      </div>
    </>
  );
}
