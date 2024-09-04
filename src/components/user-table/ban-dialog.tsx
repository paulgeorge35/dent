"use client";

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
import { showErrorToast } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useBoolean } from "react-hanger";
import { toast } from "sonner";

interface BanDialogProps {
  userId: string;
  banned: boolean;
  children: React.ReactNode;
}

export default function BanDialog({
  userId,
  banned,
  children,
}: BanDialogProps) {
  const router = useRouter();
  const isBanned = useBoolean(banned);
  const openDialog = useBoolean(false);

  const { mutate: toggleBan, isPending } = api.user.toggleBan.useMutation({
    onMutate: () => {
      isBanned.setValue(true);
    },
    onSuccess: () => {
      router.refresh();
      toast.success("🎉 User has been banned");
      isBanned.setValue(true);
      openDialog.setFalse();
    },
    onError: (err) => {
      isBanned.setValue(false);
      openDialog.setFalse();
      showErrorToast(err);
    },
  });

  const handleClick = () => {
    toggleBan(userId);
  };

  return (
    <AlertDialog
      open={openDialog.value}
      onOpenChange={(value) => {
        openDialog.setValue(value);
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to {banned ? "unban" : "ban"} this user?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleClick}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
