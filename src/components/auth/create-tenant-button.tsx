"use client";

import { Button } from "@/components/ui/button";
import { BadgePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export default function CreateTenant() {
  const t = useTranslations("page.welcome.clinic");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <Link href="/create-clinic">
      <Button
        variant="expandIcon"
        Icon={BadgePlus}
        iconPlacement="right"
        onClick={handleClick}
        isLoading={isLoading}
      >
        {t("create-clinic")}
      </Button>
    </Link>
  );
}
