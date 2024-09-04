"use client";

import useMediaQuery from "@/hooks/use-media-query";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
  main?: boolean;
}

export default function NavLink({
  href,
  children,
  className,
  main,
}: SidebarLinkProps) {
  const path = usePathname();
  const isActive = path === href;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Link
      className={cn(
        isDesktop
          ? buttonVariants({
              size: "sm",
              variant: main ? "ghost" : "linkHover2",
            })
          : buttonVariants({
              size: "default",
              variant: main ? "ghost" : "link",
            }),
        isActive && "font-bold",
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
