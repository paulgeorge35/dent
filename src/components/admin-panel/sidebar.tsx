import { Menu } from "@/components/admin-panel/menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import AccountButton from "@/components/layout/account-button";
import { Shell } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import type { SessionUser, TenantAccount } from "@/types/schema";
import { Box, Plus, Settings } from "lucide-react";
import Link from "next/link";
import GlobalSearch from "../global-search";
import LocaleSwitch from "../shared/locale-switch";

export function Sidebar({
  session,
  accounts,
  title,
  locale,
}: {
  title?: string;
  session: SessionUser;
  accounts: TenantAccount[];
  locale: "en" | "ro";
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Shell
        variant="nav"
        className={cn(
          "w-full justify-between pl-8 transition-[width] duration-300 ease-in-out lg:w-[calc(100vw-91px)] z-[30] lg:z-[50]", // Add z-index here
          {
            "lg:w-[calc(100vw-289px)]": sidebar?.isOpen,
          },
        )}
      >
        <SidebarToggle
          isOpen={sidebar?.isOpen}
          setIsOpen={sidebar?.setIsOpen}
        />
        <h1 className="mr-auto flex-shrink-0 text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <GlobalSearch />
        <Button
          size="icon"
          className="hidden md:flex flex-shrink-0 rounded-full"
        >
          <Plus />
        </Button>
        <Link href="/settings" className="hidden md:flex">
          <Button
            size="icon"
            variant="ghost"
            className="flex-shrink-0 rounded-full"
          >
            <Settings />
          </Button>
        </Link>
        <Separator orientation="vertical" />
        <AccountButton
          session={session}
          accounts={accounts}
          className="flex-shrink-0"
        />
      </Shell>
      <span
        className={cn("lg:hidden fixed inset-0 z-[35] bg-black/80", {
          hidden: sidebar?.isOpen === false,
        })}
        onClick={() => sidebar?.setIsOpen?.()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            sidebar?.setIsOpen?.();
          }
        }}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen transition-[width] duration-300 ease-in-out translate-x-0 z-[40]",
          sidebar?.isOpen === false
            ? "hidden w-0 lg:w-[90px] lg:block"
            : "w-72",
        )}
      >
        <div className="relative flex h-full flex-col overflow-y-auto bg-background px-3 py-4 shadow-md dark:shadow-zinc-800">
          <Button
            className={cn(
              "mb-1 transition-transform duration-300 ease-in-out",
              sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0",
            )}
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Box className="mr-2 size-7" />
              <h1
                className={cn(
                  "whitespace-nowrap font-mono text-lg font-medium transition-[transform,opacity,display] duration-300 ease-in-out",
                  sidebar?.isOpen === false
                    ? "hidden -translate-x-96 opacity-0"
                    : "translate-x-0 opacity-100",
                )}
              >
                MyDent
              </h1>
            </Link>
          </Button>
          <Menu
            isOpen={sidebar?.isOpen}
            accounts={accounts}
            session={session}
          />
          <LocaleSwitch locale={locale} isOpen={sidebar?.isOpen} />
        </div>
      </aside>
    </>
  );
}
