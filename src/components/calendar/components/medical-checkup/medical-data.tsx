import type { UseFormReturn } from "react-hook-form";
import type { MedicalCheckupSchema } from "@/types/schema";

type MedicalDataProps = {
  form: UseFormReturn<MedicalCheckupSchema>;
};

export default function MedicalData({}: MedicalDataProps) {
  return <div className="vertical gap-4 px-4">Medical Data</div>;
}
