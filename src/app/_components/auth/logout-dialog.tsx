"use client";

import { signOut } from "@/app/(router)/(root)/settings/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

export default function LogoutDialog() {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" variant="destructive" className="w-full md:w-auto">
          Log Out
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to sign out?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={pending} onClick={handleClick}>
            Log Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
