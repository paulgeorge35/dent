"use client";

import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { cn, getPageTitle } from "@/lib/utils";
import type { SessionUser, TenantAccount } from "@/types/schema";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Shell } from "../layout/shell";

export default function AdminPanelLayout({
  children,
  session,
  accounts,
  locale,
}: {
  children: React.ReactNode;
  session: SessionUser;
  accounts: TenantAccount[];
  locale: "en" | "ro";
}) {
  const t = useTranslations("page");
  const pathname = usePathname();
  const sidebar = useStore(useSidebarToggle, (state) => state);
  if (!sidebar) return null;

  return (
    <>
      <Sidebar
        title={t(`${getPageTitle(pathname ?? "")}.title`)}
        session={session}
        accounts={accounts}
        locale={locale}
      />
      <Shell
        className={cn(
          "h-[calc(100vh-64px)] !w-auto gap-2 bg-background transition-[margin-left] duration-300 ease-in-out p-2 md:p-4 mt-16",
          "h-[calc(100dvh-64px)]",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
        )}
      >
        {children}
      </Shell>
    </>
  );
}
