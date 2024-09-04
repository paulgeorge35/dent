"use client";

import Link from "next/link";
import { Ellipsis } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import CurrentTenant from "./tenant-card";
import type { SessionUser, TenantAccount } from "@/types/schema";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

interface MenuProps {
  isOpen: boolean | undefined;
  accounts: TenantAccount[];
  session: SessionUser;
}

export function Menu({ isOpen, accounts, session }: MenuProps) {
  const t = useTranslations("layout.sidebar");
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  const tenant = useMemo(
    () =>
      accounts.find((account) => account.tenantId === session.user?.tenantId)
        ?.tenant,
    [accounts, session.user?.tenantId],
  );

  return (
    <ScrollArea className="mt-2 [&>div>div[style]]:!block">
      <CurrentTenant tenant={tenant} isOpen={isOpen} />
      <nav className="mt-4 h-full w-full">
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-96px-40px-32px)]">
          {menuList.map(({ groupLabel, menus, hideLabel }, index: number) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel && !hideLabel) ?? isOpen === undefined ? (
                <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
                  {t(`links.sections.${groupLabel}.title`)}
                </p>
              ) : !isOpen &&
                isOpen !== undefined &&
                groupLabel &&
                !hideLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="flex w-full items-center justify-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{t(`links.sections.${groupLabel}.title`)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className="mb-1 h-10 w-full justify-start"
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen === false ? "" : "mr-4")}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100",
                                  )}
                                >
                                  {t(
                                    `links.sections.${groupLabel}.items.${label}`,
                                  )}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {t(`links.sections.${groupLabel}.items.${label}`)}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={t(`links.sections.${groupLabel}.items.${label}`)}
                        active={active}
                        submenus={submenus.map((submenu) => ({
                          ...submenu,
                          label: t(
                            `links.sections.${groupLabel}.items.${submenu.label}`,
                          ),
                        }))}
                        isOpen={isOpen}
                      />
                    </div>
                  ),
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}
