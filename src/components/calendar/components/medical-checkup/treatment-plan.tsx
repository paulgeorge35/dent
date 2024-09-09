import { Button } from "@/components/ui/button";
import type { MedicalCheckupSchema } from "@/types/schema";
import type { UseFormReturn } from "react-hook-form";

type TreatmentPlanProps = {
  form: UseFormReturn<MedicalCheckupSchema>;
};

export default function TreatmentPlan({ form }: TreatmentPlanProps) {
  const onSubmit = (data: MedicalCheckupSchema) => {
    console.log(data);
  };

  return (
    <div className="vertical gap-4 px-4">
      Treatment Plan
      <Button onClick={() => form.handleSubmit(onSubmit)}>Agree</Button>
    </div>
  );
}
