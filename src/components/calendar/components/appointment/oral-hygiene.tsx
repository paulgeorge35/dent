import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormFieldCompact,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import quiz from "@/lib/quiz-questions.json";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import type { AppointmentSchema } from "../calendar";

type OralHygieneProps = {
  form: UseFormReturn<AppointmentSchema>;
  resourceId: string;
};

export default function OralHygiene({ form }: OralHygieneProps) {
  const questions = quiz;
  return (
    <div className="grid gap-4 p-4">
      {questions.map((question, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{`${index + 1}. ${question.question}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormFieldCompact
              key={`${index}-${question.question}`}
              control={form.control}
              name={`quiz.answers.${index}`}
              render={({ field }) => (
                <Question {...field} options={question.options} index={index} />
              )}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type QuestionProps = ControllerRenderProps<AppointmentSchema> & {
  options: string[];
  index: number;
};

function Question({ options, value, onChange, index }: QuestionProps) {
  return (
    <FormItem className="col-span-2 w-full">
      <FormControl>
        <RadioGroup
          onValueChange={(value) => onChange(Number(value))}
          className="grid grid-cols-2 gap-4 col-span-2 w-full"
          value={value?.toString()}
          name={`quiz.answers.${index}`}
        >
          {options.map((option, optionIndex) => (
            <FormItem key={optionIndex} className="col-span-1">
              <FormLabel className="group/radio w-full">
                <FormControl>
                  <RadioGroupItem
                    value={optionIndex.toString()}
                    className="sr-only"
                  />
                </FormControl>
                <div className="text-xs text-center relative flex w-full cursor-pointer items-center justify-center gap-4 rounded-lg border border-border p-4 group-has-[:checked]/radio:border-primary">
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
