"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import useMediaQuery from "@/hooks/use-media-query";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function UsersTableToolbarActions() {
  const t = useTranslations("page.staff");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div className="flex items-center gap-2">
      <Link href="/settings?tab=staff">
        {isDesktop ? (
          <Button
            Icon={Icons.settings}
            iconPlacement="right"
            variant="expandIcon"
          >
            {t("manage-staff")}
          </Button>
        ) : (
          <Button
            className="fixed bottom-8 right-4 rounded-full size-12 shadow-lg"
            size="icon"
          >
            <Plus className="size-6" />
          </Button>
        )}
      </Link>
    </div>
  );
}
