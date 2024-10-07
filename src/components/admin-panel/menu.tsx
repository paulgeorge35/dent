"use client";

import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useMediaQuery from "@/hooks/use-media-query";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { getMenuList } from "@/lib/menu-list";
import { cn } from "@/lib/utils";
import type { SessionUser, TenantAccount } from "@/types/schema";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useStore } from "zustand";
import { ShortcutKeys } from "../ui/shortcut-key";
import CurrentTenant from "./tenant-card";

interface MenuProps {
  isOpen: boolean | undefined;
  accounts: TenantAccount[];
  session: SessionUser;
}

export function Menu({ isOpen, accounts, session }: MenuProps) {
  const t = useTranslations("layout.sidebar");
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const pathname = usePathname();
  const menuList = getMenuList(pathname ?? "");

  const tenant = useMemo(
    () =>
      accounts.find((account) => account.tenantId === session.user?.tenantId)
        ?.tenant,
    [accounts, session.user?.tenantId],
  );

  for (const group of menuList) {
    for (const menu of group.menus) {
      if (menu.shortcut && menu.href) {
        useHotkeys(menu.shortcut, () => {
          document.getElementById(menu.shortcut!)?.click();
        });
      }
    }
  }

  return (
    <React.Fragment>
      <CurrentTenant tenant={tenant} isOpen={isOpen} />
      <ScrollArea className="grow">
        <nav className="h-full w-full">
          <ul className="flex flex-col items-start space-y-1 px-2">
            {menuList.map(({ groupLabel, menus, hideLabel }, index: number) => (
              <li
                className={cn("w-full", groupLabel ? "pt-5" : "")}
                key={index}
              >
                {((isOpen && groupLabel && !hideLabel) ??
                isOpen === undefined) ? (
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
                  <p className="pb-2" />
                )}
                {menus.map(
                  (
                    { href, label, icon: Icon, active, submenus, shortcut },
                    index,
                  ) =>
                    submenus.length === 0 ? (
                      <div className="w-full" key={index}>
                        <TooltipProvider disableHoverableContent>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Button
                                id={shortcut}
                                variant={active ? "secondary" : "ghost"}
                                className="mb-1 h-10 w-full justify-start"
                                asChild
                                onClick={() => {
                                  if (isMobile) {
                                    sidebar?.setIsOpen();
                                  }
                                }}
                              >
                                <Link href={href}>
                                  <span
                                    className={cn(
                                      isOpen === false ? "" : "mr-4",
                                    )}
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
                                  {shortcut && isOpen && (
                                    <ShortcutKeys
                                      shortcut={shortcut}
                                      className="ml-auto"
                                    />
                                  )}
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            {isOpen === false && (
                              <TooltipContent
                                side="right"
                                className="horizontal gap-2 center-v"
                              >
                                {t(
                                  `links.sections.${groupLabel}.items.${label}`,
                                )}
                                {shortcut && (
                                  <ShortcutKeys shortcut={shortcut} />
                                )}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <div className="w-full" key={index}>
                        <CollapseMenuButton
                          icon={Icon}
                          label={t(
                            `links.sections.${groupLabel}.items.${label}`,
                          )}
                          active={active}
                          submenus={submenus.map((submenu) => ({
                            ...submenu,
                            label: t(
                              `links.sections.${groupLabel}.items.${submenu.label}`,
                            ),
                          }))}
                          isOpen={isOpen}
                          onClick={() => {
                            if (isMobile) {
                              sidebar?.setIsOpen();
                            }
                          }}
                        />
                      </div>
                    ),
                )}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </React.Fragment>
  );
}
