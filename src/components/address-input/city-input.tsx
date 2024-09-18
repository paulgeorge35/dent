import { useTranslations } from "next-intl";
import type { City } from "prisma/generated/zod";
import { useEffect } from "react";
import { useStateful } from "react-hanger";
import { AutoComplete } from "../ui/autocomplete";

interface CitySelectProps {
  name: string;
  value: string;
  onSelect: (_name: string) => void;
  disabled?: boolean;
  cities: City[];
  loading?: boolean;
}

export function CitySelect({
  name,
  value,
  onSelect,
  disabled,
  cities,
  loading,
}: CitySelectProps) {
  const t = useTranslations("fields.city");
  const search = useStateful("");

  useEffect(() => {
    if (value && value !== "") {
      search.setValue(value);
    }
  }, [value]);
  
  return (
    <AutoComplete<string>
      id={name}
      value={{
        label: value,
        value: value,
      }}
      disabled={loading || disabled}
      search={search.value}
      setSearch={search.setValue}
      options={cities.map((city) => {
        return {
          label: city.name,
          value: city.name,
        };
      })}
      onValueChange={(option) => {
        onSelect(option.value);
      }}
      placeholder={loading ? t("loading") : t("placeholder")}
      emptyMessage={t("no-results")}
    />
  );
}
