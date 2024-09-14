import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { County } from "prisma/generated/zod";

interface CountySelectProps {
  name: string;
  onSelect: (_name: string) => void;
  counties: County[];
  loading?: boolean;
}

export function CountySelect({
  name,
  onSelect,
  counties,
  loading,
}: CountySelectProps) {
  const t = useTranslations("fields.county");
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState<string>(t("placeholder"));
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (name !== "") {
      setLabel(name);
    }
  }, [name]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            name === "" && "text-muted-foreground",
          )}
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0"
        side="bottom"
        style={{ width: ref.current?.clientWidth }}
      >
        <Command className="max-h-[200px]">
          <CommandInput placeholder={t("search")} autoFocus />
          {loading ? (
            <CommandEmpty>{t("loading")}</CommandEmpty>
          ) : (
            <CommandEmpty>{t("no-results")}</CommandEmpty>
          )}
          <CommandList>
            <CommandGroup>
              {counties.map((county) => (
                <CommandItem
                  key={county.id}
                  value={county.name}
                  onSelect={() => {
                    onSelect(county.name);
                    setOpen(false);
                  }}
                >
                  {county.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      name === county.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
