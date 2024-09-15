import { useTranslations } from "next-intl";

export default function OptionalInputTag() {
  const t = useTranslations("fields");

  return (
    <span className="text-muted-foreground lowercase font-light">({t("optional")})</span>
  );
}
