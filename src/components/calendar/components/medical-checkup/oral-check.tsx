import type { UseFormReturn } from "react-hook-form";
import type { MedicalCheckupSchema } from "@/types/schema";

type OralCheckProps = {
  form: UseFormReturn<MedicalCheckupSchema>;
};

export default function OralCheck({}: OralCheckProps) {
  return <div className="vertical gap-4 px-4">Oral Check</div>;
}
