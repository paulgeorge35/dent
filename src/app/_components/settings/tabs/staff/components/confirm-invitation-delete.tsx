"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { toast } from "sonner";
import { useBoolean } from "react-hanger";
import { useRouter } from "next/navigation";

export const ConfirmInvitationDelete = ({ id }: { id: string }) => {
  const dialogOpen = useBoolean(false);
  const router = useRouter();
  const queryClient = api.useUtils();
  const { mutate, isPending } = api.tenant.deleteInvitation.useMutation({
    onSuccess: () => {
      toast.success("Invitation deleted successfully", {
        description:
          "The invitation has been deleted and can no longer be used",
      });
      dialogOpen.setFalse();
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to delete invitation");
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
      title="Delete Invitation"
      description="Are you sure you want to delete this invitation?"
      open={dialogOpen.value}
      onOpenChange={dialogOpen.toggle}
      confirmButtonText="Delete"
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
