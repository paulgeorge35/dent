import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { CommandLoading } from "cmdk";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { useBoolean, useStateful } from "react-hanger";
import { AutoComplete } from "../ui/autocomplete";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Skeleton } from "../ui/skeleton";

interface CountySelectProps {
  name: string;
  value?: string;
  onSelect: (_name: string) => void;
}

export function CountySelect({
  name,
  value = "",
  onSelect,
}: CountySelectProps) {
  const t = useTranslations("fields.county");
  const search = useStateful("");
  const dialog = useBoolean(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: counties, isFetching } = api.utils.getCounties.useQuery(
    undefined,
    {
      initialData: [],
    },
  );

  useEffect(() => {
    if (value && value !== "") {
      search.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (inputRef.current && dialog.value) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [dialog.value]);

  if (!isDesktop)
    return (
      <Drawer open={dialog.value} onOpenChange={dialog.toggle}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full font-normal text-base horizontal items-center justify-start gap-2 truncate",
              {
                "text-muted-foreground": value === "",
              },
            )}
            disabled={isFetching}
          >
            {value === "" && (
              <MagnifyingGlassIcon className="size-4 text-muted-foreground shrink-0" />
            )}
            {value !== "" ? value : t("placeholder")}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[50vh]">
          <Command>
            <DrawerHeader>
              <DrawerTitle className="grid grid-cols-[1fr_auto] items-center gap-2">
                <CommandInput
                  placeholder={t("search")}
                  defaultValue={value}
                  className="text-base"
                  ref={inputRef}
                />
                <Button
                  variant="ghost"
                  onClick={() => {
                    onSelect("");
                    dialog.setValue(false);
                  }}
                >
                  {t("clear")}
                </Button>
              </DrawerTitle>
            </DrawerHeader>
            <CommandList className="max-h-none grow px-4 pb-4">
              {isFetching ? (
                <CommandLoading>
                  <Skeleton className="h-8 w-full" />
                </CommandLoading>
              ) : null}
              <CommandGroup>
                {counties.map((county) => (
                  <CommandItem
                    key={county.name}
                    className={cn(
                      "flex w-full items-center gap-2 aria-selected:bg-accent/50 cursor-pointer",
                      value === county.name ? "bg-accent/50" : null,
                    )}
                    onSelect={() => {
                      onSelect(county.name);
                      dialog.setValue(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "w-4 transition-opacity duration-300 opacity-0",
                        {
                          "opacity-100": value === county.name,
                        },
                      )}
                    />
                    {county.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              {!isFetching ? (
                <CommandEmpty>{t("no-results")}</CommandEmpty>
              ) : null}
            </CommandList>
          </Command>
        </DrawerContent>
      </Drawer>
    );

  return (
    <AutoComplete<string>
      id={name}
      disabled={isFetching}
      value={{
        label: value,
        value: value,
      }}
      search={search.value}
      setSearch={search.setValue}
      options={counties.map((county) => {
        return {
          label: county.name,
          value: county.name,
        };
      })}
      onValueChange={(option) => {
        onSelect(option.value);
      }}
      placeholder={isFetching ? t("loading") : t("placeholder")}
      emptyMessage={t("no-results")}
      className="w-full"
    />
  );
}
