import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
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
  ChevronRight,
  FilePenLine,
  Info,
  Monitor,
  PlusCircle,
} from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
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
          "!flex-row bg-background/80 backdrop-blur-sm p-0": isDesktop,
          "lg:translate-x-[calc(100%-50px)]": openMedicalCheckup.value && isDesktop,
        })}
      >
        <span className="hidden md:flex vertical shrink-0 items-center p-2">
          <PlusCircle className="size-10 rounded-full bg-background p-2 text-muted-foreground" />
        </span>
        <span className="vertical grow rounded-xl bg-background pt-0 md:pt-6 p-6">
          <DrawerHeader className="lg:pb-4">
            <DrawerTitle className="flex flex-col md:flex-row items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Appointment ID{" "}
                <span className="font-mono text-lg font-bold text-primary">{`#APPT${zeroPad(event?.index ?? 0)}`}</span>
              </span>
              <span className="hidden md:block text-xs text-muted-foreground">
                &bull;
              </span>
              <span className="horizontal items-center gap-2 text-xs font-medium text-muted-foreground">
                <Monitor className="size-4 shrink-0" />
                {event?.initiator === "SYSTEM"
                  ? "AUTOMATIC APPOINTMENT"
                  : "MANUAL APPOINTMENT"}
              </span>
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
              className={cn("col-span-1 font-light", {
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
              className={cn("col-span-1 font-light", {
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
            <p className="col-span-2 flex items-center justify-center text-center text-xs text-muted-foreground flex-wrap">
              <Info className="mr-2 h-4 w-4 shrink-0" />
              <span>
                Please add Medical Checkup and Medical Record to finish the
                appointment.
              </span>
            </p>
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
    title: "Medical Data",
    Icon: Icons.activity,
    Component: MedicalData,
    errorFields: ["serviceId"],
  },
  {
    title: "Treatment Plan",
    Icon: Icons.user,
    Component: TreatmentPlan,
    errorFields: ["patient"],
  },
  {
    title: "Oral Check",
    Icon: Icons.heart,
    Component: OralCheck,
  },
  {
    title: "Plan Agreement",
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const confirmationDialog = useBoolean(false);
  const step = useNumber(0, {
    upperLimit: steps.length - 1,
    lowerLimit: 0,
    loop: false,
    step: 1,
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollAreaRef.current) {
        setScrollTop(scrollAreaRef.current.scrollTop);
      }
    };

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const onSubmit = form.handleSubmit((values) => {
    console.log("onSubmit", values);
  });

  const handleBack = () => {
    step.decrease();
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
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
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
          }
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
        <DrawerHeader className="p-6">
          <DrawerTitle className="horizontal relative h-9 w-full items-center">
            Medical Checkup
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-0 top-0 ml-auto rounded-full !p-2"
              onClick={() => onOpenChange(false)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </DrawerTitle>
        </DrawerHeader>
        <Separator />
        <Steps
          steps={steps}
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
            title="Are you sure you want to close this medical checkup?"
            description="This action cannot be undone and all changes will be lost."
            confirmButtonText="Yes"
            onConfirm={async () => {
              confirmationDialog.setFalse();
              onOpenChange(false);
            }}
            trigger={
              <Button size="lg" variant="secondary">
                Close
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
              className="w-full"
              variant="outline"
              onClick={handleBack}
            >
              Back
            </Button>
          </motion.div>
          <Button
            onClick={handleNext}
            size="lg"
            className={cn(
              step.value === steps.length - 1
                ? "bg-green-600 hover:bg-green-700"
                : "",
            )}
          >
            {step.value === steps.length - 1 ? "Save" : "Next"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
