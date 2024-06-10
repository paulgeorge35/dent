"use client";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaTrigger,
  CredenzaClose,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaFooter,
} from "@/components/ui/credenza";

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
    <Credenza
      open={openDialog.value}
      onOpenChange={(value) => {
        openDialog.setValue(value);
      }}
    >
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>
            Are you sure you want to {banned ? "unban" : "ban"} this user?
          </CredenzaTitle>
        </CredenzaHeader>
        <CredenzaFooter className="gap-4">
          <CredenzaClose>Cancel</CredenzaClose>
          <Button
            disabled={isPending}
            color="destructive"
            onClick={handleClick}
          >
            Confirm
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
