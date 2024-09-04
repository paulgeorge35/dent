"use client";

import { toggleLocale } from "@/app/(router)/actions";
import { Languages } from "lucide-react";
import { useTransition } from "react";

export default function LocaleSwitch({ locale }: { locale: string }) {
  const [, startTransition] = useTransition();
  const toggle = () => {
    startTransition(async () => {
      await toggleLocale();
    });
  };

  return (
    <button
      className="horizontal center-v fixed bottom-2 right-2 z-[9999] gap-1 rounded-md border border-border bg-muted px-2 py-1 hover:bg-muted-foreground hover:text-muted uppercase text-xs font-semibold"
      onClick={toggle}
    >
      <Languages className="size-4" />
      {locale}
    </button>
  );
}
