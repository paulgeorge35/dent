"use client";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type DeleteSpecialityDialogProps = {
  id: string;
  disabled: boolean;
};

export default function DeleteSpecialityDialog({
  id,
  disabled,
}: DeleteSpecialityDialogProps) {
  const t = useTranslations("page.specialities.delete");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutateAsync: deleteSpeciality, isPending } =
    api.speciality.delete.useMutation({
      onSuccess: () => {
        toast.success(t("status.success"));
      setOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
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
        await deleteSpeciality({ id });
      }}
      open={open}
      onOpenChange={setOpen}
      loading={isPending}
    />
  );
}
