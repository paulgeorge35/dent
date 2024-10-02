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
import { Separator } from "@/components/ui/separator";
import Steps from "@/components/ui/steps";
import useMediaQuery from "@/hooks/use-media-query";
import { cn, zeroPad } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  type MedicalCheckupSchema,
  medicalCheckupSchema,
} from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Activity,
  Check,
  CheckCheck,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FilePenLine,
  Info,
  Monitor,
  PlusCircle,
} from "lucide-react";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";
import { useBoolean, useNumber } from "react-hanger";
import { type UseFormReturn, useForm } from "react-hook-form";
import AppointmentDetailsCard from "./appointment/appointment-details-card";
import PatientCard from "./appointment/patient-card";
import MedicalData from "./medical-checkup/medical-data";
import OralCheck from "./medical-checkup/oral-check";
import PlanAgreement from "./medical-checkup/plan-agreement";
import TreatmentPlan from "./medical-checkup/treatment-plan";

type AppointmentDialogProps = {
  open: boolean;
  onClose: () => void;
  eventId: string;
};

export default function AppointmentDialog({
  open,
  onClose,
  eventId,
}: AppointmentDialogProps) {
  const { data: event } = api.appointment.get.useQuery(eventId);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const openMedicalCheckup = useBoolean(false);

  const hasMedicalCheckup = false;
  const hasMedicalRecord = true;

  const form = useForm<MedicalCheckupSchema>({
    resolver: zodResolver(medicalCheckupSchema),
  });

  return (
    <Drawer open={open} onOpenChange={() => onClose()}>
      <DrawerContent
        className={cn({
          "!flex-row bg-background/40 dark:bg-background/80 backdrop-blur-sm p-0":
            isDesktop,
          "lg:translate-x-[calc(100%-50px)]":
            openMedicalCheckup.value && isDesktop,
        })}
      >
        <span className="hidden md:flex vertical shrink-0 items-center p-2">
          <PlusCircle className="size-10 rounded-full bg-background p-2 text-muted-foreground" />
        </span>
        <span className="vertical grow rounded-xl bg-background p-6 pt-0 border-l border-border">
          <DrawerHeader className="lg:pb-4 px-0">
            <DrawerTitle className="flex flex-col md:flex-row items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Appointment ID{" "}
                <span className="font-mono text-lg font-bold text-primary">{`#APPT${zeroPad(event?.index ?? 0)}`}</span>
              </span>
              <span className="hidden md:block text-xs text-muted-foreground">
                &bull;
              </span>
              <DrawerDescription className="horizontal items-center gap-2 text-xs font-medium text-muted-foreground">
                <Monitor className="size-4 shrink-0" />
                {event?.initiator === "SYSTEM"
                  ? "AUTOMATIC APPOINTMENT"
                  : "MANUAL APPOINTMENT"}
              </DrawerDescription>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="px-0">
            {event && (
              <span className="vertical gap-4 md:gap-8">
                {event?.patient && (
                  <PatientCard
                    patient={event.patient}
                    status={event.status}
                    description={event.description}
                  />
                )}
                <AppointmentDetailsCard
                  treatment={event.visits[0]?.service.name ?? ""}
                  date={DateTime.fromJSDate(event.date).toFormat("ccc, d LLLL")}
                  time={`${DateTime.fromJSDate(event.start!).toFormat("hh:mm")}${event.end ? `-${DateTime.fromJSDate(event.end).toFormat("hh:mm a")}` : ""}`}
                  doctor={`${event.user.profile.title} ${event.user.profile.firstName} ${event.user.profile.lastName}`}
                />
              </span>
            )}
          </DrawerBody>
          <DrawerFooter className="grid grid-cols-2 gap-2 px-0">
            <Button
              onClick={openMedicalCheckup.toggle}
              variant={hasMedicalCheckup ? "default" : "outline"}
              className={cn("col-span-2 md:col-span-1 font-light", {
                "bg-green-600 text-white hover:bg-green-700": hasMedicalCheckup,
                "border-dashed border-blue-800 text-blue-800 hover:text-blue-700":
                  !hasMedicalCheckup,
              })}
            >
              {hasMedicalCheckup ? (
                <FilePenLine className="mr-2 size-3 sm:size-4 shrink-0" />
              ) : (
                <Activity className="mr-2 size-3 sm:size-4shrink-0" />
              )}
              <p className="truncate">
                {hasMedicalCheckup ? "Edit" : "Add"} Medical Checkup
              </p>
              {hasMedicalCheckup && (
                <Check className="ml-2 size-3 sm:size-4 rounded-full bg-background p-[2px] text-green-600 shrink-0" />
              )}
            </Button>
            <Button
              className={cn("col-span-2 md:col-span-1 font-light", {
                "bg-green-600 text-white hover:bg-green-700": hasMedicalRecord,
                "border-dashed border-blue-800 text-blue-800 hover:text-blue-700":
                  !hasMedicalRecord,
              })}
            >
              {hasMedicalRecord ? (
                <FilePenLine className="mr-2 size-3 sm:size-4 shrink-0" />
              ) : (
                <Activity className="mr-2 size-3 sm:size-4 shrink-0" />
              )}
              <p className="truncate">
                {hasMedicalRecord ? "Edit" : "Add"} Medical Record
              </p>
              {hasMedicalRecord && (
                <CheckCircle className="ml-2 size-3 sm:size-4 shrink-0" />
              )}
            </Button>
            <Button
              variant="expandIcon"
              iconPlacement="right"
              Icon={CheckCheck}
              className="col-span-2 !ml-0"
              disabled={!hasMedicalCheckup || !hasMedicalRecord}
            >
              Finish
            </Button>
            <span className="col-span-2 grid grid-cols-[auto_1fr] gap-2 text-xs text-muted-foreground center-v pt-4 md:mx-20">
              <Info className="size-4 shrink-0 col-span-1" />
              <p className="col-span-1 text-left">
                Please add Medical Checkup and Medical Record to finish the
                appointment.
              </p>
            </span>
          </DrawerFooter>
        </span>
      </DrawerContent>
      <MedicalCheckup
        open={openMedicalCheckup.value}
        onOpenChange={openMedicalCheckup.toggle}
        form={form}
      />
    </Drawer>
  );
}

const steps = [
  {
    title: "medical-data",
    Icon: Icons.activity,
    Component: MedicalData,
    errorFields: ["serviceId"],
  },
  {
    title: "treatment-plan",
    Icon: Icons.user,
    Component: TreatmentPlan,
    errorFields: ["patient"],
  },
  {
    title: "oral-check",
    Icon: Icons.heart,
    Component: OralCheck,
  },
  {
    title: "plan-agreement",
    Icon: Icons.heart,
    Component: PlanAgreement,
  },
];

type MedicalCheckupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<MedicalCheckupSchema>;
};

function MedicalCheckup({ open, onOpenChange, form }: MedicalCheckupProps) {
  const t = useTranslations("page.appointments.view.medical-checkup");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const confirmationDialog = useBoolean(false);
  const step = useNumber(0, {
    upperLimit: steps.length - 1,
    lowerLimit: 0,
    loop: false,
    step: 1,
  });

  const onSubmit = form.handleSubmit((values) => {
    console.log("onSubmit", values);
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
          if (
            steps[step.value]!.errorFields?.some((field) =>
              Object.keys(form.formState.errors).includes(field),
            )
          ) {
            return;
          }
          step.increase();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const Component = steps[step.value]!.Component;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        noOverlay
        className={cn({
          "opacity-0 transition-opacity duration-300 ease-in-out": isDesktop,
          "opacity-100": open,
          "right-20": open && isDesktop,
        })}
      >
        <DrawerHeader className="p-6 relative">
          <Button
            size="icon"
            variant="secondary"
            className="absolute hidden md:flex right-6 top-6 rounded-full !p-2"
            onClick={() => onOpenChange(false)}
          >
            <ChevronRight className="size-4" />
          </Button>
          <DrawerTitle>{t("title")}</DrawerTitle>
          <DrawerDescription>{t("description")}</DrawerDescription>
        </DrawerHeader>
        <Separator />
        <Steps
          steps={steps.map((step) => ({
            ...step,
            title: t(`steps.${step.title}.title`),
          }))}
          currentStep={step.value}
          className="px-2 md:px-14 py-4"
        />
        <DrawerBody className="px-0">
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <Component form={form} />
            </form>
          </Form>
        </DrawerBody>
        <DrawerFooter className="p-6 grid grid-cols-3 gap-2 px-4">
          <ConfirmationDialog
            open={confirmationDialog.value}
            onOpenChange={confirmationDialog.toggle}
            title={t("close.confirmation.title")}
            description={t("close.confirmation.description")}
            confirmButtonText={t("close.confirmation.confirm")}
            onConfirm={async () => {
              confirmationDialog.setFalse();
              onOpenChange(false);
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
