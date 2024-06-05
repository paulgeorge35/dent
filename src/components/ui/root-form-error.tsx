import { cn } from "@/lib/utils";

interface RootFormErrorProps {
  error?: string;
  className?: string;
}
export default function RootFormError({
  error,
  className,
}: RootFormErrorProps) {
  if (!error) return null;
  return (
    <p className={cn("text-[0.8rem] font-medium text-destructive", className)}>
      {error}
    </p>
  );
}
