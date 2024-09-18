import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Steps from "@/components/ui/steps";
import useMediaQuery from "@/hooks/use-media-query";
import { cn, zeroPad } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  type MedicalCheckupSchema,
  medicalCheckupSchema,
} from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data: event } = api.appointment.get.useQuery(eventId);

  const openMedicalCheckup = useBoolean(false);
  const Root = isDesktop ? Sheet : Drawer;
  const ContentComponent = isDesktop ? SheetContent : DrawerContent;
  const HeaderComponent = isDesktop ? SheetHeader : DrawerHeader;
  const TitleComponent = isDesktop ? SheetTitle : DrawerTitle;
  const FooterComponent = isDesktop ? SheetFooter : DrawerFooter;

  const hasMedicalCheckup = false;
  const hasMedicalRecord = true;

  const form = useForm<MedicalCheckupSchema>({
    resolver: zodResolver(medicalCheckupSchema),
  });

  return (
    <Root open={open} onOpenChange={() => onClose()}>
      <ContentComponent
        className={cn({
          " horizontal my-8 mr-4 h-[calc(100vh-64px)] !w-[90vw] !max-w-[800px] gap-0 rounded-3xl bg-neutral-200 p-0":
            isDesktop,
          "translate-x-[75%]": openMedicalCheckup.value,
        })}
      >
        <span className="vertical shrink-0 items-center p-2">
          <PlusCircle className="size-10 rounded-full bg-background p-2 text-muted-foreground" />
        </span>
        <span className="vertical grow rounded-3xl bg-background p-6">
          <HeaderComponent>
            <TitleComponent className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Appointment ID
              </span>
              <span className="font-mono text-lg font-bold">{`#RSVA${zeroPad(event?.index ?? 0)}`}</span>
              <span className="text-xs text-muted-foreground">&bull;</span>
              <span className="horizontal items-center gap-2 text-xs font-medium text-muted-foreground">
                <Monitor className="size-4" />
                {event?.initiator === "SYSTEM"
                  ? "AUTOMATIC APPOINTMENT"
                  : "MANUAL APPOINTMENT"}
              </span>
            </TitleComponent>
          </HeaderComponent>
          {event && (
            <ScrollArea className="relative my-4 grow">
              <span className="vertical gap-8 bg-red-200 h-[2000px]">
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
            </ScrollArea>
          )}
          <FooterComponent className="grid grid-cols-2 gap-2">
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
                <FilePenLine className="mr-2 h-4 w-4" />
              ) : (
                <Activity className="mr-2 h-4 w-4" />
              )}
              {hasMedicalCheckup ? "Edit" : "Add"} Medical Checkup
              {hasMedicalCheckup && (
                <Check className="ml-2 h-4 w-4 rounded-full bg-background p-[2px] text-green-600" />
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
                <FilePenLine className="mr-2 h-4 w-4" />
              ) : (
                <Activity className="mr-2 h-4 w-4" />
              )}
              {hasMedicalRecord ? "Edit" : "Add"} Medical Record
              {hasMedicalRecord && <CheckCircle className="ml-2 h-4 w-4" />}
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
            <p className="col-span-2 flex items-center justify-center text-center text-xs text-muted-foreground">
              <Info className="mr-2 h-4 w-4" />
              Please add Medical Checkup and Medical Record to finish the
              appointment.
            </p>
          </FooterComponent>
        </span>
      </ContentComponent>
      <MedicalCheckup
        open={openMedicalCheckup.value}
        onOpenChange={openMedicalCheckup.toggle}
        form={form}
      />
    </Root>
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
  const Root = isDesktop ? Sheet : Drawer;
  const ContentComponent = isDesktop ? SheetContent : DrawerContent;
  const HeaderComponent = isDesktop ? SheetHeader : DrawerHeader;
  const TitleComponent = isDesktop ? SheetTitle : DrawerTitle;
  const FooterComponent = isDesktop ? SheetFooter : DrawerFooter;

  const Component = steps[step.value]!.Component;

  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <ContentComponent
        side="left"
        noOverlay
        noCloseButton
        className={cn({
          "vertical my-8 mr-4 h-[calc(100vh-64px)] !w-[90vw] !max-w-[800px] gap-0 rounded-2xl p-0 opacity-0 transition-opacity duration-300 ease-in-out":
            isDesktop,
          "translate-x-[calc(100vw-125%-32px)] opacity-100": open,
        })}
      >
        <HeaderComponent className="p-6">
          <TitleComponent className="horizontal relative h-9 w-full items-center">
            Medical Checkup
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-0 top-0 ml-auto rounded-full !p-2"
              onClick={() => onOpenChange(false)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </TitleComponent>
        </HeaderComponent>
        <Separator />
        <Steps steps={steps} currentStep={step.value} className="px-14 py-4" />
        <AnimatePresence mode="wait">
          <ScrollArea
            className="relative grow"
            viewportRef={scrollAreaRef}
            onScroll={handleScroll}
          >
            <div
              className={cn(
                "pointer-events-none absolute left-0 right-0 top-0 z-50 h-16 bg-gradient-to-b from-secondary to-transparent transition-[height] duration-300 ease-in-out",
                {
                  "h-0": scrollTop === 0,
                },
              )}
            />
            <div
              className={cn(
                "ease-in-outƒ pointer-events-none absolute bottom-0 left-0 right-0 z-50 h-24 bg-gradient-to-t from-secondary to-transparent transition-[height] duration-300",
                {
                  "h-0":
                    scrollTop + (scrollAreaRef.current?.clientHeight ?? 0) >=
                    (scrollAreaRef.current?.scrollHeight ?? 0),
                },
              )}
            />
            <motion.div
              key={step.value}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Form {...form}>
                <form onSubmit={onSubmit}>
                  <Component form={form} />
                </form>
              </Form>
            </motion.div>
          </ScrollArea>
        </AnimatePresence>
        <FooterComponent className="p-6">
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
            <Button size="lg" variant="outline" onClick={handleBack}>
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
        </FooterComponent>
      </ContentComponent>
    </Root>
  );
}
