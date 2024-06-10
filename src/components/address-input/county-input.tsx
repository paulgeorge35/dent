import { useEffect, useState } from "react";

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
import { type County } from "prisma/generated/zod";
import { Check } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState<string>("Select county...");

  useEffect(() => {
    if (name !== "") {
      setLabel(name);
    }
  }, [name]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
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
      <PopoverContent className="w-[200px] p-0" side="bottom">
        <Command className="max-h-[200px]">
          <CommandInput placeholder="Search county..." />
          {loading ? (
            <CommandEmpty>Loading...</CommandEmpty>
          ) : (
            <CommandEmpty>No results</CommandEmpty>
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
