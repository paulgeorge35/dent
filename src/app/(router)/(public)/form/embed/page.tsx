import PatientForm from "../patient-form";

export default async function EmbeddablePatientFormPage() {
  return (
    <div className="p-4">
      <PatientForm className="rounded-xl border border-dashed bg-muted/50 p-4" />
    </div>
  );
}
