"use client";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SpecializationForm, {
  type FormValues,
  specializationSchema,
} from "./form";

interface EditSpecializationDialogProps {
  specialization: FormValues & { id: string };
}

export default function EditSpecializationDialog({
  specialization,
}: EditSpecializationDialogProps) {
  const router = useRouter();
  const { mutateAsync: updateSpecialization } =
    api.specialization.update.useMutation({
      onSuccess: () => {
        toast.success("Specialization updated");
        dialogOpen.setFalse();
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const dialogOpen = useBoolean(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(specializationSchema),
    defaultValues: {
      name: specialization.name,
      description: specialization.description ?? undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    await updateSpecialization({ id: specialization.id, ...values });
  };

  useEffect(() => {
    if (dialogOpen.value) {
      form.reset(specialization);
    }
  }, [dialogOpen.value, form, specialization]);

  return (
    <Credenza open={dialogOpen.value} onOpenChange={dialogOpen.toggle}>
      <CredenzaTrigger>
        <Button size="icon" variant="secondary">
          <Edit className="size-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Edit Specialization</CredenzaTitle>
          <CredenzaDescription>
            Modify the specialization details
          </CredenzaDescription>
          <CredenzaBody>
            <SpecializationForm form={form} />
          </CredenzaBody>
        </CredenzaHeader>
        <CredenzaFooter>
          <CredenzaClose>
            <Button variant="secondary">Cancel</Button>
          </CredenzaClose>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={
              !form.formState.isValid ||
              !form.formState.isDirty ||
              form.formState.isSubmitting
            }
            isLoading={form.formState.isSubmitting}
          >
            Save Changes
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
