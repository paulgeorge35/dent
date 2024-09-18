import { Button } from "@/components/ui/button";
import type { MedicalCheckupSchema } from "@/types/schema";
import type { UseFormReturn } from "react-hook-form";

type MedicalDataProps = {
  form: UseFormReturn<MedicalCheckupSchema>;
};

export default function MedicalData({ form }: MedicalDataProps) {
  const onSubmit = (data: MedicalCheckupSchema) => {
    console.log(data);
  };

  return (
    <div className="vertical gap-4 px-4 h-[2000px] bg-red-200">
      Medical Data
      <Button onClick={() => form.handleSubmit(onSubmit)}>Agree</Button>
    </div>
  );
}
