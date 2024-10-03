import type { AppointmentSchema } from "@/components/calendar/components/calendar";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
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
import { Form } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import Steps from "@/components/ui/steps";
import { showErrorToast } from "@/lib/handle-error";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useTransition } from "react";
import { useBoolean, useNumber } from "react-hanger";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import BasicInformation from "./appointment/basic-information";
import OralHygiene from "./appointment/oral-hygiene";
import TreatmentSpecialist from "./appointment/treatment-specialist";

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (_value: boolean) => void;
  form: UseFormReturn<AppointmentSchema>;
  resourceId: string;
  refetch: () => void;
}

const steps = [
  {
    title: "treatment-specialist",
    Icon: Icons.activity,
    Component: TreatmentSpecialist,
    errorFields: ["serviceId", "date", "start", "end"],
  },
  {
    title: "basic-information",
    Icon: Icons.user,
    Component: BasicInformation,
    errorFields: ["patient"],
  },
  {
    title: "oral-hygiene",
    Icon: Star,
    Component: OralHygiene,
  },
];

export default function CreateAppointmentDialog({
  open,
  onOpenChange,
  form,
  resourceId,
  refetch,
}: CreateAppointmentDialogProps) {
  const t = useTranslations("page.appointments.add");
  const { mutateAsync: createAppointment, isPending: isSubmitting } =
    api.appointment.create.useMutation({
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
        toast.success(t("status.success"));
        refetch();
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  const confirmationDialog = useBoolean(false);
  const [, startTransition] = useTransition();
  const step = useNumber(0, {
    upperLimit: steps.length - 1,
    lowerLimit: 0,
    loop: false,
    step: 1,
  });

  const { mutateAsync: deleteFile, isPending: isDeleting } =
    api.storage.delete.useMutation();

  useEffect(() => {
    if (open) {
      step.setValue(0);
    }
  }, [open]);

  const onSubmit = form.handleSubmit(async (values: AppointmentSchema) => {
    startTransition(async () => {
      try {
        await createAppointment({
          ...values,
          userId: resourceId,
          quiz: {
            answers: values.quiz.answers ?? [],
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          form.setError("root", { message: error.message });
        }
      }
    });
  });

  const handleBack = () => {
    step.decrease();
  };

  const handleNext = () => {
    if (step.value === steps.length - 1) void onSubmit();
    else {
      form
        .trigger()
        .then(() => {
          for (let i = 0; i < steps.length; i++) {
            if (
              steps[i]!.errorFields?.some((field) =>
                Object.keys(form.formState.errors).includes(field),
              )
            ) {
              step.setValue(i);
              return;
            }
          }

          form.clearErrors();
          step.increase();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const Component = steps[step.value]!.Component;

  return (
    <Drawer
      open={open}
      onOpenChange={(value) => {
        if (!value && form.formState.isDirty) {
          confirmationDialog.setTrue();
          return;
        }
        onOpenChange(value);
      }}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("title")}</DrawerTitle>
          <DrawerDescription>
            {t(`steps.${steps[step.value]!.title}.description`)}
          </DrawerDescription>
        </DrawerHeader>
        <Steps
          steps={steps.map((step) => ({
            ...step,
            title: t(`steps.${step.title}.title`),
          }))}
          currentStep={step.value}
          className="px-8 py-2"
        />
        <DrawerBody key={step.value}>
          <motion.div
            key={step.value}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <Component form={form} resourceId={resourceId} />
              </form>
            </Form>
          </motion.div>
        </DrawerBody>
        <DrawerFooter className="grid grid-cols-3 gap-2">
          <ConfirmationDialog
            open={confirmationDialog.value}
            onOpenChange={confirmationDialog.toggle}
            loading={isDeleting}
            onConfirm={async () => {
              await Promise.all(
                (form.getValues("files") ?? []).map(async (file) => {
                  await deleteFile({ key: file.key });
                }),
              )
                .then(() => {
                  form.reset();
                })
                .finally(() => {
                  confirmationDialog.setFalse();
                  onOpenChange(false);
                });
            }}
            trigger={
              <Button size="lg" variant="secondary">
                {t("close.trigger")}
              </Button>
            }
          />
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: step.value === 0 ? 0 : "auto",
              opacity: step.value === 0 ? 0 : 1,
            }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <Button
              size="lg"
              variant="expandIcon"
              Icon={ChevronLeft}
              iconPlacement="left"
              className="w-full border border-input shadow-sm text-primary bg-background hover:bg-accent hover:text-accent-foreground"
              onClick={handleBack}
            >
              {t("actions.back")}
            </Button>
          </motion.div>
          <Button
            onClick={handleNext}
            size="lg"
            variant="expandIcon"
            Icon={step.value === steps.length - 1 ? Check : ChevronRight}
            iconPlacement="right"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            className={cn(
              step.value === steps.length - 1
                ? "bg-green-600 hover:bg-green-700"
                : "",
            )}
          >
            {step.value === steps.length - 1
              ? t("actions.submit")
              : t("actions.next")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
