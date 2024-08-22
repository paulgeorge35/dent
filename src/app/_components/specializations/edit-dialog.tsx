"use client";

import { Button } from "@/components/ui/button";
import { useBoolean } from "react-hanger";
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaBody,
  CredenzaFooter,
  CredenzaClose,
} from "@/components/ui/credenza";
import SpecializationForm, {
  type FormValues,
  specializationSchema,
} from "./form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Edit } from "lucide-react";

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
    defaultValues: specialization,
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
        <Button size="icon" variant='secondary'>
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
