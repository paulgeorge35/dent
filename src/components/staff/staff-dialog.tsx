"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import useMediaQuery from "@/hooks/use-media-query";
import Steps from "../ui/steps";
import { ReceiptText, Clock, Stethoscope, User } from "lucide-react";
import { useNumber } from "react-hanger";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import PersonalInformation from "./forms/personal-info";
import AssignedServices from "./forms/assigned-services";
import WorkingHours from "./forms/working-hours";
import Confirmation from "./forms/confirmation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { staffSchema } from "@/types/schema";
import type { z } from "zod";

type LogoutDialogProps = {
  children?: React.ReactNode;
};

const steps = [
  {
    title: "Personal Information",
    Icon: User,
    Component: PersonalInformation,
  },
  {
    title: "Assigned Services",
    Icon: Stethoscope,
    Component: AssignedServices,
  },
  {
    title: "Working Hours",
    Icon: Clock,
    Component: WorkingHours,
  },
  {
    title: "Confirmation",
    Icon: ReceiptText,
    Component: Confirmation,
  },
];

type FormValues = z.infer<typeof staffSchema>;

export default function StaffDialog({ children }: LogoutDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [, startTransition] = useTransition();
  const step = useNumber(0, {
    upperLimit: 3,
    lowerLimit: 0,
    loop: false,
    step: 1,
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values: FormValues) => {
    startTransition(async () => {
      try {
        console.log(values);
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
    if (step.value === 3) void onSubmit();
    else {
      void onSubmit()
        .then(() => {
          step.increase();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const Credenza = isDesktop ? Sheet : Drawer;
  const TriggerComponent = isDesktop ? SheetTrigger : DrawerTrigger;
  const ContentComponent = isDesktop ? SheetContent : DrawerContent;
  const HeaderComponent = isDesktop ? SheetHeader : DrawerHeader;
  const TitleComponent = isDesktop ? SheetTitle : DrawerTitle;
  const FooterComponent = isDesktop ? SheetFooter : DrawerFooter;

  const Component = steps[step.value]!.Component;

  return (
    <Credenza>
      <TriggerComponent asChild>{children}</TriggerComponent>
      <ContentComponent
        className={cn({
          "vertical my-4 mr-4 h-[calc(100vh-32px)] !w-[90vw] !max-w-[800px] rounded-lg":
            isDesktop,
        })}
      >
        <HeaderComponent>
          <TitleComponent>Add new staff user</TitleComponent>
        </HeaderComponent>
        <Steps steps={steps} currentStep={step.value} className="py-2" />
        <ScrollArea className="grow">
          <Component form={form} onSubmit={onSubmit} />
        </ScrollArea>
        <FooterComponent>
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button
            onClick={handleNext}
            className={cn(
              step.value === 3 ? "bg-green-600 hover:bg-green-700" : "",
            )}
          >
            {step.value === 3 ? "Save" : "Next"}
          </Button>
        </FooterComponent>
      </ContentComponent>
    </Credenza>
  );
}
