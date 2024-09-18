import type { AppointmentSchema } from "@/components/calendar/components/calendar";
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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Steps from "@/components/ui/steps";
import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
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
    title: "Treatment & Specialist",
    Icon: Icons.activity,
    Component: TreatmentSpecialist,
    errorFields: ["serviceId"],
  },
  {
    title: "Basic Information",
    Icon: Icons.user,
    Component: BasicInformation,
    errorFields: ["patient"],
  },
  {
    title: "Oral Hygiene",
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { mutateAsync: createAppointment } = api.appointment.create.useMutation(
    {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
        toast.success("Appointment created successfully");
        refetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
  const confirmationDialog = useBoolean(false);
  const [, startTransition] = useTransition();
  const step = useNumber(0, {
    upperLimit: steps.length - 1,
    lowerLimit: 0,
    loop: false,
    step: 1,
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const { mutateAsync: deleteFile, isPending: isDeleting } =
    api.storage.delete.useMutation();

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
    <Root
      open={open}
      onOpenChange={(value) => {
        if (!value && form.formState.isDirty) {
          confirmationDialog.setTrue();
          return;
        }
        onOpenChange(value);
      }}
    >
      <ContentComponent
        className={cn({
          "vertical my-8 mr-4 h-[calc(100vh-64px)] !w-[90vw] !max-w-[800px] rounded-2xl":
            isDesktop,
        })}
      >
        <HeaderComponent>
          <TitleComponent>Add new appointment</TitleComponent>
        </HeaderComponent>
        <Steps steps={steps} currentStep={step.value} className="px-8 py-2" />
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
                  <Component form={form} resourceId={resourceId} />
                </form>
              </Form>
            </motion.div>
          </ScrollArea>
        </AnimatePresence>
        <FooterComponent>
          <ConfirmationDialog
            open={confirmationDialog.value}
            onOpenChange={confirmationDialog.toggle}
            title="Are you sure you want to close this appointment?"
            description="This action cannot be undone."
            confirmButtonText="Yes"
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
