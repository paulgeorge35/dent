import Invitations from "@/components/auth/invitations";
import LogoutDialog from "@/components/auth/logout-dialog";
import Tenants from "@/components/auth/tenants";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/utils";
import { Box } from "lucide-react";

export const metadata = constructMetadata({
  page: "Sign In",
});

export default async function Welcome() {
  return (
    <div className="grid gap-6 text-center">
      <div>
        <div className="relative z-20 flex items-center justify-center p-4 font-mono text-2xl font-medium text-primary">
          <Box className="mr-2 size-10" />
          MyDent
        </div>
        <h1 className="text-3xl font-bold">
          Welcome back! Let&apos;s get you back to work!
        </h1>
        <p className="text-balance text-muted-foreground">
          Choose a clinic below to get back to working on your team.
        </p>
      </div>
      <Tenants />
      <Invitations />
      <LogoutDialog>
        <Button
          variant="destructive"
          className="w-full border border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-white"
        >
          Sign out
        </Button>
      </LogoutDialog>
    </div>
  );
}
