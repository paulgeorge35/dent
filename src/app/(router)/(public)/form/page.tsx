import { Shell } from "@/components/layout/shell";
import Image from "next/image";
import PatientForm from "./patient-form";

export default async function PatientFormPage() {
  return (
    <Shell variant="layout">
      <Shell variant="center" className="center-h flex-grow-0">
        <Image src="/logo.svg" alt="logo" width={100} height={100} priority />
        <h1 className="text-lg">
          my<strong>Dent</strong>
        </h1>
        <PatientForm className="mt-8 rounded-xl border border-dashed bg-muted/50 p-4" />
      </Shell>
    </Shell>
  );
}
