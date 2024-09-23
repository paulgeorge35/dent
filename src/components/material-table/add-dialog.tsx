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
import { useEffect } from "react";
import { useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import MaterialForm, { type FormValues, schema } from "./form";

type AddMaterialDialogProps = {
  className?: string;
};

export default function AddMaterialDialog({
  className,
}: AddMaterialDialogProps) {
  const t = useTranslations("page.materials.add");
  const router = useRouter();
  const { mutateAsync: createMaterial } = api.material.create.useMutation({
    onSuccess: () => {
      toast.success(t("status.success"));
      dialogOpen.setFalse();
      router.refresh();
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const dialogOpen = useBoolean(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    await createMaterial(values);
  };

  useEffect(() => {
    if (dialogOpen.value) {
      form.reset();
    }
  }, [dialogOpen.value, form]);

  return (
    <Credenza open={dialogOpen.value} onOpenChange={dialogOpen.toggle}>
      <CredenzaTrigger asChild className="horizontal justify-start">
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
          <MaterialForm form={form} />
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="secondary">{t("dialog.cancel")}</Button>
          </CredenzaClose>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
          >
            {t("dialog.confirm")}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
