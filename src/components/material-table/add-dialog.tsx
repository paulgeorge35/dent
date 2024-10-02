"use client";

import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/use-media-query";
import { showErrorToast } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "../ui/drawer";
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
    <Drawer open={dialogOpen.value} onOpenChange={dialogOpen.toggle} dismissible={false}>
      <DrawerTrigger asChild>
        {isDesktop ? (
        <Button
          variant="expandIcon"
          Icon={PlusCircle}
          iconPlacement="right"
          className={className}
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
        <DrawerFooter className="grid grid-cols-2 gap-2 p-6">
          <Button
            variant="secondary"
            onClick={dialogOpen.setFalse}
          >
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
