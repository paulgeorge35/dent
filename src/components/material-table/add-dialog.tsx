"use client";

import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/use-media-query";
import { showErrorToast } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import ConfirmationDialog from "../shared/confirmation-dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { CONTROL_KEY } from "../ui/shortcut-key";
import MaterialForm, { type FormValues, schema } from "./form";

type AddMaterialDialogProps = {
  className?: string;
};

export default function AddMaterialDialog({
  className,
}: AddMaterialDialogProps) {
  const t = useTranslations("page.materials.add");
  const isDesktop = useMediaQuery("(min-width: 768px)");
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

  const confirmationDialog = useBoolean(false);
  const dialogOpen = useBoolean(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      unit_price: 0,
      unit: "",
      keepInventory: false,
      stock: 0,
      description: "",
      tags: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    await createMaterial(values);
  };

  useEffect(() => {
    if (dialogOpen.value) {
      form.reset();
    }
  }, [dialogOpen.value, form]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open && form.formState.isDirty) {
        confirmationDialog.setTrue();
      } else {
        dialogOpen.setValue(open);
      }
    },
    [form, confirmationDialog, dialogOpen],
  );

  useHotkeys("ctrl+a", () => {
    dialogOpen.setTrue();
  });

  return (
    <Drawer
      open={dialogOpen.value}
      onOpenChange={onOpenChange}
    >
      <DrawerTrigger asChild>
        {isDesktop ? (
          <Button
            variant="expandIcon"
            Icon={PlusCircle}
            iconPlacement="right"
            className={className}
            shortcut={[CONTROL_KEY, "a"]}
          >
            {t("trigger")}
          </Button>
        ) : (
          <Button
            className="fixed bottom-8 right-4 rounded-full size-12 shadow-lg"
            size="icon"
          >
            <Plus className="size-6" />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("dialog.title")}</DrawerTitle>
          <DrawerDescription>{t("dialog.description")}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <MaterialForm form={form} />
        </DrawerBody>
        <DrawerFooter className="grid grid-cols-2 gap-2 py-6">
          <ConfirmationDialog
            open={confirmationDialog.value}
            onOpenChange={confirmationDialog.toggle}
            onConfirm={async () => {
              confirmationDialog.setFalse();
              dialogOpen.setFalse();
            }}
          />
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t("dialog.cancel")}
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
          >
            {t("dialog.confirm")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
