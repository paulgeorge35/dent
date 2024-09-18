import { useTranslations } from "next-intl";
import type { County } from "prisma/generated/zod";
import { useEffect } from "react";
import { useStateful } from "react-hanger";
import { AutoComplete } from "../ui/autocomplete";

interface CountySelectProps {
  name: string;
  value: string;
  onSelect: (_name: string) => void;
  counties: County[];
  loading?: boolean;
}

export function CountySelect({
  name,
  value,
  onSelect,
  counties,
  loading,
}: CountySelectProps) {
  const t = useTranslations("fields.county");
  const search = useStateful("");

  useEffect(() => {
    if (value && value !== "") {
      search.setValue(value);
    }
  }, [value]);

  return (
    <AutoComplete<string>
      id={name}
      disabled={loading}
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
      placeholder={loading ? t("loading") : t("placeholder")}
      emptyMessage={t("no-results")}
    />
  );
}
