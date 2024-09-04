import { AutoComplete, type Option } from "@/components/ui/autocomplete";

type TreatmentSelectProps = {
  options: Option[];
  isLoading?: boolean;
  disabled?: boolean;
  value?: Option;
  onValueChange?: (value: Option) => void;
  placeholder: string;
  emptyMessage?: string;
};

export default function TreatmentSelect({
  emptyMessage = "No results.",
  ...props
}: TreatmentSelectProps) {
  return <AutoComplete {...props} emptyMessage={emptyMessage} />;
}
