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
  DrawerTrigger
} from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/use-media-query";
import { showErrorToast } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircle } from "lucide-react";
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
    <Drawer
      open={dialogOpen.value}
      onOpenChange={dialogOpen.toggle}
      dismissible={false}
    >
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
          <SpecialityForm form={form} onSubmit={onSubmit} />
        </DrawerBody>
        <DrawerFooter className="grid grid-cols-2 gap-2 p-6">
          <Button variant="secondary" onClick={dialogOpen.setFalse}>
            {t("dialog.cancel")}
          </Button>
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
