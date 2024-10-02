"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import PatientForm, { type FormValues, patientSchema } from "./form";

type AddPatientDialogProps = {
  className?: string;
};

export default function AddPatientDialog({ className }: AddPatientDialogProps) {
  const t = useTranslations("page.patients.add");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const { mutateAsync: createPatient } = api.patient.create.useMutation({
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
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (values: FormValues) => {
    await createPatient(values);
  };

  useEffect(() => {
    if (dialogOpen.value) {
      form.reset();
    }
  }, [dialogOpen.value, form]);

  return (
    <Drawer open={dialogOpen.value} onOpenChange={dialogOpen.toggle}>
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
          <DrawerBody>
            <PatientForm form={form} />
          </DrawerBody>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" className="w-full md:w-auto">
              {t("dialog.cancel")}
            </Button>
          </DrawerClose>
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
