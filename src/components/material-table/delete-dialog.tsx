"use client";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Icons } from "../ui/icons";

type MaterialDeleteDialogProps = {
  id: string;
  disabled: boolean;
  onSuccess?: () => void;
};

export default function MaterialDeleteDialog({
  id,
  disabled,
  onSuccess,
}: MaterialDeleteDialogProps) {
  const t = useTranslations("page.materials.delete");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutateAsync: deleteMaterial, isPending } =
    api.material.delete.useMutation({
      onSuccess: () => {
        toast.success(t("status.success"));
        setOpen(false);
        router.refresh();
        onSuccess?.();
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  return (
    <ConfirmationDialog
      trigger={
        <Button
          variant="destructive"
          disabled={disabled}
        >
          <Icons.trash className="size-4 mr-2" />
          {t("dialog.confirm")}
        </Button>
      }
      title="delete-title"
      onConfirm={async () => {
        if (disabled) return;
        await deleteMaterial(id);
      }}
      open={open}
      onOpenChange={setOpen}
      loading={isPending}
    />
  );
}
