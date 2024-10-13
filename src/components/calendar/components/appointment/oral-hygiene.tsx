import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormFieldCompact,
  FormItem,
  FormMessage
} from "@/components/ui/form";
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
        <span className="grid grid-cols-2 gap-4 col-span-2 w-full">
          {options.map((option, optionIndex) => (
            <Button
              key={optionIndex}
              type="button"
              variant={value === optionIndex ? "default" : "outline"}
              className="w-full h-full py-4 px-2 text-xs text-center text-wrap !h-auto"
              onClick={() => onChange(optionIndex)}
            >
              {option}
            </Button>
          ))}
        </span>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
