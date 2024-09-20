import { auth } from "@/auth";
import AuthHero from "@/components/auth/auth-hero";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Box } from "lucide-react";
import { RedirectType, redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session) {
    if (session.user?.tenantId) {
      redirect("/", RedirectType.replace);
    }
    redirect("/welcome", RedirectType.replace);
  }

  return (
    <>
      <div
        className={cn(
          "container relative grid flex-col items-center justify-center h-screen lg:max-w-none lg:grid-cols-[5fr,4fr] lg:grid-rows-[1fr] lg:gap-0 lg:px-0",
          "h-[100dvh]",
        )}
      >
        <AuthHero />
        <div className="lg:p-8">
          <div className="vertical center gap-8 py-12">
            <div className="relative z-20 flex items-center p-4 font-mono text-5xl font-medium lg:hidden">
              <Box className="mr-4 size-10" />
              MyDent
            </div>
            <Separator className="lg:hidden" />
            <div className="mx-auto grid w-[350px] gap-6">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
