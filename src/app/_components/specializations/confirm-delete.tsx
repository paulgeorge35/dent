"use client";

import ConfirmationDialog from "@/components/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ConfirmSpecializationDeleteProps = {
  id: string;
  disabled: boolean;
};

export default function ConfirmSpecializationDelete({
  id,
  disabled,
}: ConfirmSpecializationDeleteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutateAsync: deleteSpecialization } =
    api.specialization.delete.useMutation({
      onSuccess: () => {
        toast.success("Specialization deleted");
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
        <Button size="icon" variant='destructive' disabled={disabled}>
          <Trash className="size-4" />
        </Button>
      }
      title="Delete Specialization"
      description="Are you sure you want to delete this specialization?"
      confirmButtonText="Delete"
      onConfirm={async () => {
        await deleteSpecialization({ id });
      }}
      open={open}
      onOpenChange={setOpen}
    />
  );
}
