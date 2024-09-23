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
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SpecialityForm, { type FormValues, specialitySchema } from "./form";

type AddSpecialityDialogProps = {
  className?: string;
};

export default function AddSpecialityDialog({
  className,
}: AddSpecialityDialogProps) {
  const t = useTranslations("page.specialities.add");
  const dialogOpen = useBoolean(false);
  const router = useRouter();

  const { mutateAsync: createSpeciality } = api.speciality.create.useMutation({
    onSuccess: () => {
      toast.success(t("status.success"));
      dialogOpen.setFalse();
      router.refresh();
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(specialitySchema),
    defaultValues: {
      name: "",
      color: "blue",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await createSpeciality(data);
  });

  return (
    <Credenza open={dialogOpen.value} onOpenChange={dialogOpen.toggle}>
      <CredenzaTrigger className="horizontal justify-start" asChild>
        <Button
          variant="expandIcon"
          Icon={PlusCircle}
          iconPlacement="right"
          className={className}
        >
          {t("trigger")}
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
