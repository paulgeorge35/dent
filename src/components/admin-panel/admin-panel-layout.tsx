"use client";

import { cn, getPageTitle } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import type { SessionUser, TenantAccount } from "@/types/schema";
import { usePathname } from "next/navigation";
import { Shell } from "../shell";

export default function AdminPanelLayout({
  children,
  session,
  accounts,
}: {
  children: React.ReactNode;
  session: SessionUser;
  accounts: TenantAccount[];
}) {
  const pathname = usePathname();
  const sidebar = useStore(useSidebarToggle, (state) => state);
  if (!sidebar) return null;

  return (
    <>
      <Sidebar
        title={getPageTitle(pathname)}
        session={session}
        accounts={accounts}
      />
      <Shell
        className={cn(
          "h-screen !w-auto gap-2 bg-background transition-[margin-left] duration-300 ease-in-out md:p-4 md:pt-20",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
        )}
      >
        {children}
      </Shell>
    </>
  );
}
