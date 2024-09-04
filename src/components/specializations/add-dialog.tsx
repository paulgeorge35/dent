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
import { PlusCircle } from "lucide-react";

type AddSpecializationDialogProps = {
  className?: string;
};

export default function AddSpecializationDialog({
  className,
}: AddSpecializationDialogProps) {
  const router = useRouter();
  const { mutateAsync: createSpecialization } =
    api.specialization.create.useMutation({
      onSuccess: () => {
        toast.success("Specialization created");
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
      name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await createSpecialization(values);
  };

  useEffect(() => {
    if (dialogOpen.value) {
      form.reset();
    }
  }, [dialogOpen.value, form]);

  return (
    <Credenza open={dialogOpen.value} onOpenChange={dialogOpen.toggle}>
      <CredenzaTrigger className="horizontal justify-start">
        <Button
          variant="expandIcon"
          Icon={PlusCircle}
          iconPlacement="right"
          className={className}
        >
          Add new
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add Specialization</CredenzaTitle>
          <CredenzaDescription>Define a new specialization</CredenzaDescription>
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
            Save
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
