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
import { Check } from "lucide-react";
import type { City } from "prisma/generated/zod";

interface CitySelectProps {
  name: string;
  onSelect: (_name: string) => void;
  disabled?: boolean;
  cities: City[];
  loading?: boolean;
}

export function CitySelect({
  name,
  onSelect,
  disabled,
  cities,
  loading,
}: CitySelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [label, setLabel] = useState<string>("Select city...");

  useEffect(() => {
    if (name !== "") {
      setLabel(name);
      return;
    }
    setLabel("Select city...");
  }, [name]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between overflow-hidden",
            name === "" && "text-muted-foreground",
          )}
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" side="bottom">
        <Command className="max-h-[200px]">
          <CommandInput
            placeholder="Search city..."
            autoFocus
            onValueChange={(search) => setValue(search)}
          />
          {loading ? (
            <CommandEmpty>Loading...</CommandEmpty>
          ) : (
            <CommandEmpty>No results</CommandEmpty>
          )}
          <CommandList>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.id}
                  value={city.name}
                  onSelect={() => {
                    onSelect(city.name);
                    setOpen(false);
                  }}
                >
                  {city.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === city.name ? "opacity-100" : "opacity-0",
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
