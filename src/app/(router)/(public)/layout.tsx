import { cn } from "@/lib/utils";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "container relative flex flex-col items-center gap-4 h-screen lg:max-w-none lg:px-0",
        "h-[100dvh]",
      )}
    >
      {children}
    </div>
  );
}
