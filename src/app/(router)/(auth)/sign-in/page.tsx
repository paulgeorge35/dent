import Link from "next/link";

import MagicLinkSignIn from "./magic-link-form";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import GoogleSignIn from "./google";
import GitHubSignIn from "./github";
import { type SearchParams } from "@/types";
import { z } from "zod";
import RootFormError from "@/components/ui/root-form-error";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  page: "Sign In",
});

const searchParamsSchema = z.object({
  banned: z.boolean().optional(),
});

export interface SignInPageProps {
  searchParams: SearchParams;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { banned } = searchParamsSchema.parse(searchParams);

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-balance text-muted-foreground">
          Sign in to your account using one of the options below
        </p>
      </div>
      <span className="vertical gap-4">
        {banned && <RootFormError error="Your account has been banned" />}
        <GoogleSignIn />
        <GitHubSignIn />
      </span>
      <span className="horizontal center-v w-full gap-4">
        <Separator className="w-auto grow" />
        <span className="text-xs text-muted-foreground">
          OR SIGN IN WITH EMAIL
        </span>
        <Separator className="w-auto grow" />
      </span>

      <MagicLinkSignIn />

      <span className="horizontal center-v w-full gap-4">
        <Separator className="w-auto grow" />
        <span className="text-xs text-muted-foreground">OTHER OPTIONS</span>
        <Separator className="w-auto grow" />
      </span>
      <Link
        href="/sign-in/email"
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
        )}
      >
        <Icons.email className="mr-2 size-5" />
        Sign in with Email
      </Link>
    </>
  );
}
