import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function ActivatePage(
  props: {
    params: Promise<{ token: string }>;
  }
) {
  const params = await props.params;
  const { token } = params;
  if (!token) {
    redirect("/sign-in");
  }
  const { success } = await api.user.confirmAccount(token);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8">
        {success ? (
          <React.Fragment>
            <h1 className="mb-6 text-center text-3xl font-bold">
              Account Activated
            </h1>
            <div className="space-y-4 text-center text-muted-foreground">
              <p>
                Your account email has been confirmed and your account is now
                activated.
              </p>
            </div>
            <div className="mt-8 text-center">
              <Button asChild className="px-6 py-2">
                <Link href="/sign-in">Go to Sign In</Link>
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Activation Failed</h1>
            <p>Please try again or contact support.</p>
          </div>
        )}
      </div>
    </div>
  );
}
