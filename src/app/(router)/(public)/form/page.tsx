import { Shell } from "@/components/layout/shell";
import PatientForm from "./patient-form";
import { Box } from "lucide-react";

export default async function PatientFormPage() {
  return (
    <Shell variant="layout">
      <Shell variant="center" className="center-h flex-grow-0">
        <div className="relative z-20 flex items-center p-4 font-mono text-lg font-medium text-primary">
          <Box className="mr-2" />
          MyDent
        </div>
        <PatientForm className="mt-8 rounded-xl border border-dashed bg-muted/50 p-4" />
      </Shell>
    </Shell>
  );
}
