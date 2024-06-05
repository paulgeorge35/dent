"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export default function RemoveAvatar() {
  const utils = api.useUtils();
  const router = useRouter();
  const { mutate } = api.user.removeAvatar.useMutation({
    onSuccess: async () => {
      await utils.user.me.invalidate();
      router.refresh();
      toast.success("Profile picture removed successfully.");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Remove</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to remove your profile picture?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={() => {
              mutate();
            }}
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
