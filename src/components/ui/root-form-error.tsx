import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface RootFormErrorProps {
  error?: string;
  className?: string;
}

export default function RootFormError({
  error,
  className,
}: RootFormErrorProps) {
  const t = useTranslations("errors");
  if (!error) return null;
  return (
    <p
      className={cn(
        "text-balance text-center text-[0.8rem] font-medium text-destructive",
        className,
      )}
    >
      {t(error)}
    </p>
  );
}
