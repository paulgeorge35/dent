"use client";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type MaterialDeleteDialogProps = {
  id: string;
  disabled: boolean;
};

export default function MaterialDeleteDialog({
  id,
  disabled,
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
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  return (
    <ConfirmationDialog
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500"
          disabled={disabled}
        >
          <Trash className="size-4" />
        </Button>
      }
      title={t("dialog.title")}
      description={t("dialog.description")}
      confirmButtonText={t("dialog.confirm")}
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
