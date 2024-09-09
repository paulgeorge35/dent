"use client";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useBoolean } from "react-hanger";
import { toast } from "sonner";

export const ConfirmUserDelete = ({
  id,
  disabled,
}: {
  id: string;
  disabled?: boolean;
}) => {
  const t = useTranslations("page.settings.tabs.staff.active-users.delete");
  const dialogOpen = useBoolean(false);
  const router = useRouter();
  const queryClient = api.useUtils();
  const { mutate, isPending } = api.tenant.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("User deleted successfully", {
        description:
          "The user has been deleted and no longer has access to the clinic",
      });
      dialogOpen.setFalse();
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
    onSettled: () => {
      void queryClient.tenant.activeUsers.invalidate();
    },
  });

  const handleDelete = () => {
    mutate(id);
  };

  return (
    <ConfirmationDialog
      title={t("dialog.title")}
      description={t("dialog.description")}
      open={dialogOpen.value}
      onOpenChange={disabled ? dialogOpen.setFalse : dialogOpen.toggle}
      confirmButtonText={t("dialog.confirm")}
      onConfirm={handleDelete}
      loading={isPending}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          disabled={disabled}
        >
          <Trash2Icon className="size-4" />
        </Button>
      }
    />
  );
};
