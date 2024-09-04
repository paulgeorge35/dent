"use client";

import { Button } from "@/components/ui/button";
import { BadgePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function CreateTenant() {
  const t = useTranslations("page.welcome.clinic");
  const router = useRouter();
  return (
    <Button
      variant="expandIcon"
      Icon={BadgePlus}
      iconPlacement="right"
      onClick={() => router.push("/create-clinic")}
    >
      {t("create-clinic")}
    </Button>
  );
}
