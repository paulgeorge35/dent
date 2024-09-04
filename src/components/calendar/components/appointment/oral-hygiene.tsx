import type { UseFormReturn } from "react-hook-form";
import type { AppointmentSchema } from "../calendar";
import quiz from "@/lib/quiz-questions.json";
import {
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
  FormFieldCompact,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type OralHygieneProps = {
  form: UseFormReturn<AppointmentSchema>;
  resourceId: string;
};

export default function OralHygiene({ form }: OralHygieneProps) {
  const { questions } = quiz;
  return (
    <div className="vertical gap-4 px-4">
      {questions.map((question, index) => (
        <FormFieldCompact
          key={index}
          control={form.control}
          label={`${index + 1}. ${question.question}`}
          name={`quiz.answers.${index}`}
          render={({ field }) => (
            <Question {...field} options={question.options} index={index} />
          )}
        />
      ))}
    </div>
  );
}

type QuestionProps = {
  options: string[];
  value: number | null | undefined;
  onChange: (value: number | null | undefined) => void;
  index: number;
};

function Question({ options, value, onChange, index }: QuestionProps) {
  return (
    <FormItem className="col-span-2">
      <FormControl>
        <RadioGroup
          onValueChange={(value) => onChange(Number(value))}
          className="grid grid-cols-2 gap-4 col-span-2"
          value={value?.toString()}
          name={`quiz.answers.${index}`}
        >
          {options.map((option, optionIndex) => (
            <FormItem key={optionIndex} className="col-span-1">
              <FormLabel className="group">
                <FormControl>
                  <RadioGroupItem
                    value={optionIndex.toString()}
                    className="sr-only"
                  />
                </FormControl>
                <div className="relative flex w-full cursor-pointer items-center justify-center gap-4 rounded-lg border border-border p-4 group-has-[:checked]:border-primary">
                  {option}
                </div>
              </FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
