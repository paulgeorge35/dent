import Link from "next/link";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  page: "Activate",
});

export default async function Activate() {
  return (
    <>
      <div className="grid gap-4 text-center">
        <h1 className="text-3xl font-bold">Check your email!</h1>
        <p className="text-balance text-muted-foreground">
          We&apos;ve sent you an email with a link to activate your account. If
          you don&apos;t see it, check your spam folder.
        </p>
        <Link href="/sign-in" className="text-center underline">
          Back to login
        </Link>
      </div>
    </>
  );
}
