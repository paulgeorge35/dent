import { constructMetadata } from "@/lib/utils";
import ClinicForm from "./clinic-form";
import { Shell } from "@/components/layout/shell";
import { Box } from "lucide-react";
import { useTranslations } from "@/lib/translations";

export const metadata = constructMetadata({
  page: "Create Clinic",
});

export default async function CreateClinic() {
  const t = await useTranslations("page.create-clinic");
  return (
    <Shell variant="center">
      <div className="relative z-20 flex items-center justify-center p-4 font-mono text-lg font-medium text-primary">
        <Box className="mr-2" />
        MyDent
      </div>
      <h1 className="text-center text-5xl font-bold">{t("title")}</h1>
      <ClinicForm />
    </Shell>
  );
}
