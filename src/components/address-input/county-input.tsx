import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useStateful } from "react-hanger";
import { AutoComplete } from "../ui/autocomplete";

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
