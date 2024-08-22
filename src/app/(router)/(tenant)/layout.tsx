import { auth } from "@/auth";
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
    <div className="container relative flex h-[100dvh] flex-col items-center gap-4 md:h-screen lg:max-w-none lg:px-0">
      {children}
    </div>
  );
}
