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
import type { Material } from "@prisma/client";
import { Edit2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import MaterialForm, { type FormValues, schema } from "./form";

interface EditMaterialDialogProps {
  material: Material;
}

export default function EditMaterialDialog({
  material,
}: EditMaterialDialogProps) {
  const t = useTranslations("page.materials.edit");
  const router = useRouter();
  const { mutateAsync: updateMaterial } = api.material.update.useMutation({
    onSuccess: () => {
      toast.success("Material updated");
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
    defaultValues: {
      name: material.name,
      description: material.description ?? undefined,
      unit_price: material.unit_price,
      unit: material.unit,
      keepInventory: material.keepInventory,
      stock: material.stock,
      tags: material.tags,
    },
  });

  const onSubmit = async (values: FormValues) => {
    await updateMaterial({ id: material.id, ...values });
  };

  useEffect(() => {
    if (dialogOpen.value) {
      form.reset({
        name: material.name,
        description: material.description ?? undefined,
        unit_price: material.unit_price,
        unit: material.unit,
        keepInventory: material.keepInventory,
        stock: material.stock,
        tags: material.tags,
      });
    }
  }, [dialogOpen.value, form, material]);

  return (
    <Credenza open={dialogOpen.value} onOpenChange={dialogOpen.toggle}>
      <CredenzaTrigger>
        <Button variant="ghost" size="icon">
          <Edit2 className="size-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{t("dialog.title")}</CredenzaTitle>
          <CredenzaDescription>{t("dialog.description")}</CredenzaDescription>
          <CredenzaBody>
            <MaterialForm form={form} />
          </CredenzaBody>
        </CredenzaHeader>
        <CredenzaFooter>
          <CredenzaClose>
            <Button variant="secondary">{t("dialog.cancel")}</Button>
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
            {t("dialog.confirm")}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
