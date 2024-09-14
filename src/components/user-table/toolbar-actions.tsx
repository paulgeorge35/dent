"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function UsersTableToolbarActions() {
  const t = useTranslations("page.staff");
  return (
    <div className="flex items-center gap-2">
      <Link href="/settings?tab=staff">
        <Button
          Icon={Icons.settings}
          iconPlacement="right"
          variant="expandIcon"
        >
          {t("manage-staff")}
        </Button>
      </Link>
    </div>
  );
}
