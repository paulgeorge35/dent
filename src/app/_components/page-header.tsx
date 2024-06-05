import { cn } from "@/lib/utils";

export const PageHeader = ({
  icon,
  title,
  subtitle,
  className,
}: {
  title: string;
  icon?: string;
  subtitle?: string;
  className?: string;
}) => (
  <div
    className={cn(
      "md:m-0 md:p-0 md:block md:bg-transparent w-full flex flex-col gap-3 relative",
      className,
    )}
  >
    <span className="flex items-center gap-6">
      {icon && <h1>{icon}</h1>}
      <h1 className="text-2xl font-bold">{title}</h1>
    </span>
    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
  </div>
);
