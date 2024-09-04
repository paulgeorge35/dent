import type { UseFormReturn } from "react-hook-form";
import type { MedicalCheckupSchema } from "@/types/schema";

type PlanAgreementProps = {
  form: UseFormReturn<MedicalCheckupSchema>;
};

export default function PlanAgreement({}: PlanAgreementProps) {
  return <div className="vertical gap-4 px-4">Plan Agreement</div>;
}
