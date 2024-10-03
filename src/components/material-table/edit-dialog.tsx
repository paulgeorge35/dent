"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { showErrorToast } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Material } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { type UseStateful, useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ConfirmationDialog from "../shared/confirmation-dialog";
import MaterialDeleteDialog from "./delete-dialog";
import MaterialForm, { type FormValues, schema } from "./form";

interface EditMaterialDialogProps {
  dialogOpen: UseStateful<Material | null>;
}

export default function EditMaterialDialog({
  dialogOpen,
}: EditMaterialDialogProps) {
  const t = useTranslations("page.materials.edit");
  const router = useRouter();
  const confirmationDialog = useBoolean(false);

  const { mutateAsync: updateMaterial } = api.material.update.useMutation({
    onSuccess: () => {
      toast.success("Material updated");
      dialogOpen.setValue(null);
      router.refresh();
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const material = useMemo(() => dialogOpen.value, [dialogOpen.value]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: material?.name,
      description: material?.description ?? undefined,
      unit_price: material?.unit_price,
      unit: material?.unit,
      keepInventory: material?.keepInventory,
      stock: material?.stock,
      tags: material?.tags,
    },
  });

  const onSubmit = async (values: FormValues) => {
    await updateMaterial({ id: material?.id ?? "", ...values });
  };

  useEffect(() => {
    if (dialogOpen.value) {
      form.reset({
        name: material?.name,
        description: material?.description ?? undefined,
        unit_price: material?.unit_price,
        unit: material?.unit,
        keepInventory: material?.keepInventory,
        stock: material?.stock,
        tags: material?.tags,
      });
    }
  }, [dialogOpen.value, form, material]);

  const onClose = useCallback(() => {
    if (form.formState.isDirty) {
      confirmationDialog.setTrue();
    } else {
      dialogOpen.setValue(null);
    }
  }, [form, confirmationDialog, dialogOpen]);

  return (
    <Drawer open={!!dialogOpen.value} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("dialog.title")}</DrawerTitle>
          <DrawerDescription>{t("dialog.description")}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <MaterialForm form={form} />
        </DrawerBody>
        <DrawerFooter className="grid-cols-2 md:grid-cols-3">
          <ConfirmationDialog
            open={confirmationDialog.value}
            onOpenChange={confirmationDialog.toggle}
            onConfirm={async () => {
              confirmationDialog.setFalse();
              dialogOpen.setValue(null);
            }}
          />
          <MaterialDeleteDialog
            id={material?.id ?? ""}
            disabled={form.formState.isSubmitting}
            onSuccess={() => dialogOpen.setValue(null)}
          />
          <Button
            variant="secondary"
            className="col-span-1 md:col-span-1"
            onClick={() => dialogOpen.setValue(null)}
          >
            {t("dialog.cancel")}
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={
              !form.formState.isValid ||
              !form.formState.isDirty ||
              form.formState.isSubmitting
            }
            className="col-span-2 md:col-span-1"
            isLoading={form.formState.isSubmitting}
          >
            {t("dialog.confirm")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
