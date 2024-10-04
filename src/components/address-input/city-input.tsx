import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { CommandLoading } from "cmdk";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
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

interface CitySelectProps {
  name: string;
  value?: string;
  onSelect: (_name: string) => void;
  county?: string | null;
}

export function CitySelect({
  name,
  value = "",
  onSelect,
  county,
}: CitySelectProps) {
  const t = useTranslations("fields");
  const search = useStateful("");
  const dialog = useBoolean(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data: cities, isFetching } = api.utils.getCities.useQuery(
    county ?? "",
    {
      enabled: !!county,
      initialData: [],
    },
  );

  useEffect(() => {
    search.setValue(value);
  }, [value]);

  const placeholder =
    county === "București" ? t("sector.placeholder") : t("city.placeholder");

  const searchPlaceholder =
    county === "București" ? t("sector.search") : t("city.search");

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
            disabled={isFetching || !county}
          >
            {value === "" && (
              <MagnifyingGlassIcon className="size-4 text-muted-foreground shrink-0" />
            )}
            {value !== "" ? value : placeholder}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[50vh]">
          <Command>
            <DrawerHeader>
              <DrawerTitle className="grid grid-cols-[1fr_auto] items-center gap-2">
                <CommandInput
                  placeholder={searchPlaceholder}
                  defaultValue={value}
                />
                <Button
                  variant="ghost"
                  onClick={() => {
                    onSelect("");
                    dialog.setValue(false);
                  }}
                >
                  {t("city.clear")}
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
                {cities?.map((city) => (
                  <CommandItem
                    key={city.name}
                    className={cn(
                      "flex w-full items-center gap-2 aria-selected:bg-accent/50 cursor-pointer",
                      value === city.name ? "bg-accent/50" : null,
                    )}
                    onSelect={() => {
                      onSelect(city.name);
                      dialog.setValue(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "w-4 transition-opacity duration-300 opacity-0",
                        {
                          "opacity-100": value === city.name,
                        },
                      )}
                    />
                    {city.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              {!isFetching ? (
                <CommandEmpty>{t("city.no-results")}</CommandEmpty>
              ) : null}
            </CommandList>
          </Command>
        </DrawerContent>
      </Drawer>
    );

  return (
    <AutoComplete<string>
      id={name}
      value={{
        label: value,
        value: value,
      }}
      disabled={isFetching || !county}
      search={search.value}
      setSearch={search.setValue}
      options={
        cities?.map((city) => {
          return {
            label: city.name,
            value: city.name,
          };
        }) ?? []
      }
      onValueChange={(option) => {
        onSelect(option.value);
      }}
      placeholder={isFetching ? t("city.loading") : placeholder}
      emptyMessage={t("city.no-results")}
      className="w-full"
    />
  );
}
