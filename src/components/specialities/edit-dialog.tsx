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
import type { SpecialityUserCount } from "@/server/api/routers/user";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { type UseStateful, useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ConfirmationDialog from "../shared/confirmation-dialog";
import SpecialityDeleteDialog from "./delete-dialog";
import SpecialityForm, { type FormValues, specialitySchema } from "./form";

interface SpecialityEditDialogProps {
  dialogOpen: UseStateful<SpecialityUserCount | null>;
}

export default function SpecialityEditDialog({
  dialogOpen,
}: SpecialityEditDialogProps) {
  const t = useTranslations("page.specialities.edit");
  const confirmationDialog = useBoolean(false);
  const router = useRouter();
  const { mutateAsync: updateSpeciality } = api.speciality.update.useMutation({
    onSuccess: () => {
      toast.success("Speciality updated");
      dialogOpen.setValue(null);
      router.refresh();
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const speciality = useMemo(() => dialogOpen.value, [dialogOpen.value]);

  const form = useForm<FormValues>({
    resolver: zodResolver(specialitySchema),
    defaultValues: {
      name: speciality?.name,
      description: speciality?.description ?? undefined,
      color: speciality?.color,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await updateSpeciality({ id: speciality?.id ?? "", ...data });
  });

  useEffect(() => {
    if (dialogOpen.value) {
      form.reset({
        name: speciality?.name,
        description: speciality?.description ?? undefined,
        color: speciality?.color,
      });
    }
  }, [dialogOpen.value, form, speciality]);

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
          <SpecialityForm form={form} onSubmit={onSubmit} />
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
          <SpecialityDeleteDialog
            id={speciality?.id ?? ""}
            disabled={form.formState.isSubmitting}
            onSuccess={() => dialogOpen.setValue(null)}
          />
          <Button
            variant="secondary"
            className="col-span-1 md:col-span-1"
            onClick={onClose}
          >
            {t("dialog.cancel")}
          </Button>
          <Button
            onClick={onSubmit}
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
