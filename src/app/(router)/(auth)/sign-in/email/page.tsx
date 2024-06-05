import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import EmailSignIn from "./email-form";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  page: "Sign In",
});

export default async function SignInEmail() {
  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-balance text-muted-foreground">
          Sign in to your account using your email address and password.
        </p>
      </div>

      <EmailSignIn />

      <span className="horizontal center-v w-full gap-4">
        <Separator className="w-auto grow" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="w-auto grow" />
      </span>
      <Link
        href="/sign-up"
        className={cn(
          buttonVariants({
            variant: "secondary",
          }),
        )}
      >
        Create an account
      </Link>
    </>
  );
}
