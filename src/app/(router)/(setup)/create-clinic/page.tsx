import { constructMetadata } from "@/lib/utils";
import ClinicForm from "./clinic-form";
import { Shell } from "@/components/layout/shell";
import { Box } from "lucide-react";

export const metadata = constructMetadata({
  page: "Create Clinic",
});

export default async function CreateClinic() {
  return (
    <Shell variant="center">
      <div className="relative z-20 flex items-center p-4 font-mono text-lg font-medium text-primary justify-center">
        <Box className="mr-2" />
        MyDent
      </div>
      <h1 className="text-center text-5xl font-bold">
        Tell us about your team
      </h1>
      <ClinicForm />
    </Shell>
  );
}
