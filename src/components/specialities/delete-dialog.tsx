"use client";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type SpecialityDeleteDialogProps = {
  id: string;
  disabled: boolean;
  onSuccess?: () => void;
};

export default function SpecialityDeleteDialog({
  id,
  disabled,
  onSuccess,
}: SpecialityDeleteDialogProps) {
  const t = useTranslations("page.specialities.delete");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutateAsync: deleteSpeciality, isPending } =
    api.speciality.delete.useMutation({
      onSuccess: () => {
        toast.success(t("status.success"));
        setOpen(false);
        router.refresh();
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  return (
    <ConfirmationDialog
      trigger={
        <Button variant="destructive" disabled={disabled}>
          <Trash className="size-4" />
          {t("dialog.confirm")}
        </Button>
      }
      title="delete-title"
      onConfirm={async () => {
        await deleteSpeciality({ id });
      }}
      open={open}
      onOpenChange={setOpen}
      loading={isPending}
    />
  );
}
