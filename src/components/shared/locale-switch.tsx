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

export default function LocaleSwitch({ locale }: { locale: string }) {
  const [, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      await toggleLocale();
    });
  };

  return (
    <Select value={locale} onValueChange={toggle}>
      <SelectTrigger className="" aria-label="Select language">
        <Languages className="mr-2 h-4 w-4" aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English (EN)</SelectItem>
        <SelectItem value="ro">Română (RO)</SelectItem>
      </SelectContent>
    </Select>
  );
}
