import Sidebar from "@/app/_components/sidebar/sidebar";
import { redirect } from "next/navigation";
import { Settings } from "luxon";

import { api } from "@/trpc/server";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const me = await api.user.me();
  Settings.defaultZone = me.config.timezone.nameShort;

  return (
    <main className="flex min-h-[100dvh] md:min-h-screen">
      <Sidebar className="hidden md:block" />
      <section className="flex grow flex-col items-center justify-center">
        {children}
      </section>
    </main>
  );
}
