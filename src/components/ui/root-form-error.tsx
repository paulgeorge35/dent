import { defaultErrors } from "@/lib/handle-error";
import { cn } from "@/lib/utils";

interface RootFormErrorProps {
  error?: string;
  className?: string;
}

type DefaultError = keyof typeof defaultErrors;

export default function RootFormError({
  error,
  className,
}: RootFormErrorProps) {
  if (!error) return null;
  if (Object.keys(defaultErrors).includes(error)) {
    error = defaultErrors[error as DefaultError];
  }
  return (
    <p
      className={cn(
        "text-justify text-[0.8rem] font-medium text-destructive",
        className,
      )}
    >
      {error}
    </p>
  );
}
