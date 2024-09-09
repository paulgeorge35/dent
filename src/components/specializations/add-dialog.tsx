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
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SpecializationForm, {
  type FormValues,
  specializationSchema,
} from "./form";

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
