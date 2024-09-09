import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const containerClasses = cva("relative", {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const ringClasses = cva("absolute rounded-full animate-pulsate", {
  variants: {
    color: {
      green: "border-green-600",
      blue: "border-blue-600",
      red: "border-red-600",
    },
    size: {
      sm: "w-4 h-4 border-[2px]",
      md: "w-6 h-6 border-[3px]",
      lg: "w-8 h-8 border-[4px]",
    },
  },
  defaultVariants: {
    color: "green",
    size: "md",
  },
});

const circleClasses = cva("absolute rounded-full left-1 top-1", {
  variants: {
    color: {
      green: "bg-green-600",
      blue: "bg-blue-600",
      red: "bg-red-600",
    },
    size: {
      sm: "w-2 h-2",
      md: "w-4 h-4",
      lg: "w-6 h-6",
    },
  },
  defaultVariants: {
    color: "green",
    size: "md",
  },
});

interface PulsingDotProps {
  className?: string;
  color?: "green" | "blue" | "red";
  size?: "sm" | "md" | "lg";
}

const PulsingDot = ({ color, size, className }: PulsingDotProps) => {
  return (
    <div className={cn(containerClasses({ size }), className)}>
      {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
      <div className={ringClasses({ color, size })}></div>
      <div className={circleClasses({ color, size })} />
    </div>
  );
};

export default PulsingDot;
