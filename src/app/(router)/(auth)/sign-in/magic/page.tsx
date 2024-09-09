import { constructMetadata } from "@/lib/utils";
import Link from "next/link";

export const metadata = constructMetadata({
  page: "Sign In",
});

export default async function MagicSignIn() {
  return (
    <>
      <div className="grid gap-4 text-center">
        <h1 className="text-3xl font-bold">Check your email</h1>
        <p className="text-balance text-muted-foreground">
          We sent a magic link to your email. Click the link to sign in!
        </p>
        <Link href="/sign-in" className="text-center underline">
          Back to login
        </Link>
      </div>
    </>
  );
}
