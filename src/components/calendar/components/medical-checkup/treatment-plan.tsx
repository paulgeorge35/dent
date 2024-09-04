import type { UseFormReturn } from "react-hook-form";
import type { MedicalCheckupSchema } from "@/types/schema";

type TreatmentPlanProps = {
  form: UseFormReturn<MedicalCheckupSchema>;
};

export default function TreatmentPlan({}: TreatmentPlanProps) {
  return <div className="vertical gap-4 px-4">Treatment Plan</div>;
}
