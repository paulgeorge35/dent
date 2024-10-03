import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useStateful } from "react-hanger";
import { AutoComplete } from "../ui/autocomplete";

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
