import Invitations from "@/app/_components/auth/invitations";
import Tenants from "@/app/_components/auth/tenants";
import { constructMetadata } from "@/lib/utils";
import Image from "next/image";

export const metadata = constructMetadata({
  page: "Sign In",
});

export default async function Welcome() {
  return (
    <div className="grid gap-6 text-center">
      <div>
        <div className="flex items-center justify-center p-8 text-lg font-black">
          <Image
            height={40}
            width={40}
            alt="MyDent"
            className="mr-2"
            src="logo.svg"
          />
          MyDent
        </div>
        <h1 className="text-3xl font-bold">
          Welcome back! Let&apos;s get back to work!
        </h1>
        <p className="text-balance text-muted-foreground">
          Choose a clinic below to get back to working on your team.
        </p>
      </div>
      <Tenants />
      <Invitations />
    </div>
  );
}
