import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { Progress } from "./progress";

type StepsProps = {
  steps: {
    title: string;
    Icon: React.ElementType;
  }[];
  currentStep: number;
  className?: string;
};

export default function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <span
      className={cn(
        "horizontal items-start justify-between sm:justify-center gap-1",
        className,
      )}
    >
      {steps.map((step, index) => (
        <Step
          key={step.title}
          {...step}
          stepNumber={index}
          isActive={currentStep === index}
          isCompleted={currentStep > index}
          isLast={index === steps.length - 1}
        />
      ))}
    </span>
  );
}

type StepProps = {
  title: string;
  Icon: React.ElementType;
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
};

const Step = ({
  title,
  Icon,
  isActive,
  isCompleted,
  isLast,
  stepNumber,
}: StepProps) => {
  const t = useTranslations("global");
  return (
    <React.Fragment>
      <span className="vertical center-h relative items-start gap-1">
        {isActive && (
          <motion.span
            className="absolute inset-0 size-10 left-1/4 rounded-full border-[2px] border-dashed border-blue-500"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        )}
        <span
          className={cn(
            "box-border flex size-10 items-center justify-center rounded-full border bg-white text-muted-foreground transition-[background-color,border-color] duration-300 ease-in-out",
            {
              "my-1 size-8 bg-blue-500 text-white transition-[background-color,border-color] duration-300 ease-in-out":
                isActive,
              "bg-green-600 text-white transition-[background-color,border-color] duration-300 ease-in-out":
                isCompleted,
            },
          )}
        >
          {isCompleted ? (
            <Check className="size-5" />
          ) : (
            <Icon
              className={cn("size-5 stroke-muted-foreground stroke-2", {
                "stroke-white": isActive,
              })}
            />
          )}
        </span>
        <span className="text-xs text-muted-foreground">
          {t("step", { index: stepNumber + 1 })}
        </span>
        <span className="w-20 text-center text-xs font-semibold">{title}</span>
      </span>
      {!isLast && (
        <Progress
          className="mt-5 h-1 hidden sm:block"
          indicatorClassName={cn("bg-muted", {
            "bg-green-600": isCompleted,
            "bg-blue-500": isActive,
          })}
          value={isCompleted ? 100 : isActive ? 50 : 0}
        />
      )}
    </React.Fragment>
  );
};
