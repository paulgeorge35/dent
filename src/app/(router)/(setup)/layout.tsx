import { auth } from "@/auth";
import { cn } from "@/lib/utils";
import { RedirectType, redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/sign-in", RedirectType.replace);
  }

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
