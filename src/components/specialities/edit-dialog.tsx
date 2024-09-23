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
import { showErrorToast } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Speciality } from "@prisma/client";
import { Edit2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SpecialityForm, { type FormValues, specialitySchema } from "./form";

interface EditSpecialityDialogProps {
  speciality: Speciality;
}

export default function EditSpecialityDialog({
  speciality,
}: EditSpecialityDialogProps) {
  const t = useTranslations("page.specialities.edit");
  const router = useRouter();
  const { mutateAsync: updateSpeciality } = api.speciality.update.useMutation({
    onSuccess: () => {
      toast.success("Speciality updated");
      dialogOpen.setFalse();
      router.refresh();
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const dialogOpen = useBoolean(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(specialitySchema),
    defaultValues: {
      name: speciality.name,
      description: speciality.description ?? undefined,
      color: speciality.color,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await updateSpeciality({ id: speciality.id, ...data });
  });

  useEffect(() => {
    if (dialogOpen.value) {
      form.reset({
        name: speciality.name,
        description: speciality.description ?? undefined,
        color: speciality.color,
      });
    }
  }, [dialogOpen.value, form, speciality]);

  return (
    <Credenza open={dialogOpen.value} onOpenChange={dialogOpen.toggle}>
      <CredenzaTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="size-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{t("dialog.title")}</CredenzaTitle>
          <CredenzaDescription>{t("dialog.description")}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <SpecialityForm form={form} onSubmit={onSubmit} />
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="secondary" className="w-full md:w-auto">
              {t("dialog.cancel")}
            </Button>
          </CredenzaClose>
          <Button
            onClick={onSubmit}
            disabled={
              !form.formState.isValid ||
              !form.formState.isDirty ||
              form.formState.isSubmitting
            }
            isLoading={form.formState.isSubmitting}
          >
            {t("dialog.confirm")}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
