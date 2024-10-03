"use client";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { TRPCClientError } from "@trpc/client";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useBoolean } from "react-hanger";
import { toast } from "sonner";

export const ConfirmInvitationDelete = ({ id }: { id: string }) => {
  const t = useTranslations("page.settings.tabs.staff.invitations.delete");
  const dialogOpen = useBoolean(false);
  const router = useRouter();
  const queryClient = api.useUtils();
  const { mutate, isPending } = api.tenant.deleteInvitation.useMutation({
    onSuccess: () => {
      toast.success(t("status.success.title"), {
        description: t("status.success.description"),
      });
      dialogOpen.setFalse();
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        showErrorToast(error.message);
      }
    },
    onSettled: () => {
      void queryClient.tenant.invitations.invalidate();
    },
  });

  const handleDelete = () => {
    mutate(id);
  };

  return (
    <ConfirmationDialog
      title="delete-title"
      open={dialogOpen.value}
      onOpenChange={dialogOpen.toggle}
      onConfirm={handleDelete}
      loading={isPending}
      trigger={
        <Button variant="ghost" size="icon" className="rounded-full">
          <Trash2Icon className="size-4" />
        </Button>
      }
    />
  );
};
