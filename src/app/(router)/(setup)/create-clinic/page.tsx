import { Shell } from "@/components/layout/shell";
import { useTranslations } from "@/lib/translations";
import { constructMetadata } from "@/lib/utils";
import { Box } from "lucide-react";
import ClinicForm from "./clinic-form";

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
      <h1 className="text-center text-3xl md:text-5xl font-bold mb-8">
        {t("title")}
      </h1>
      <ClinicForm />
    </Shell>
  );
}
