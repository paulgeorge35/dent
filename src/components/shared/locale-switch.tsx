"use client";

import { toggleLocale } from "@/app/(router)/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";
import { useTransition } from "react";

type LocaleSwitchProps = {
  locale: string;
  isOpen: boolean;
};

export default function LocaleSwitch({ locale, isOpen }: LocaleSwitchProps) {
  const [, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      await toggleLocale();
    });
  };

  const shortLocale = locale === "en" ? "EN" : "RO";

  return (
    <Select value={locale} onValueChange={toggle}>
      <SelectTrigger className="" aria-label="Select language">
        {isOpen && <Languages className="mr-2 h-4 w-4" aria-hidden="true" />}
        {isOpen ? <SelectValue /> : shortLocale}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English ({shortLocale})</SelectItem>
        <SelectItem value="ro">Română ({shortLocale})</SelectItem>
      </SelectContent>
    </Select>
  );
}
