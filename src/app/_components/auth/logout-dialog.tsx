"use client";

import { signOut } from "@/app/(router)/(root)/settings/actions";
import {
  Credenza,
  CredenzaTrigger,
  CredenzaClose,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaFooter,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useTransition } from "react";

export default function LogoutDialog() {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button
          Icon={LogOut}
          variant="expandIcon"
          color="destructive"
          iconPlacement="left"
          className="w-full sm:w-fit"
        >
          Log Out
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Are you sure you want to sign out?</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaFooter className="gap-4">
          <CredenzaClose>Cancel</CredenzaClose>
          <Button disabled={pending} color="destructive" onClick={handleClick}>
            Log Out
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
