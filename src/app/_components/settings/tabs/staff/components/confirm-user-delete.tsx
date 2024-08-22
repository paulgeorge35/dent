"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { toast } from "sonner";
import { useBoolean } from "react-hanger";
import { useRouter } from "next/navigation";

export const ConfirmUserDelete = ({
  id,
  disabled,
}: {
  id: string;
  disabled?: boolean;
}) => {
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
      title="Delete User"
      description="Are you sure you want to delete this user?"
      open={dialogOpen.value}
      onOpenChange={dialogOpen.toggle}
      confirmButtonText="Delete"
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
