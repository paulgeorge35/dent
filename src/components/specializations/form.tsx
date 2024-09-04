import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const specializationSchema = z.object({
  name: z.string().min(1),
  description: z.string().max(250).nullable(),
});

export type FormValues = z.infer<typeof specializationSchema>;

type SpecializationFormProps = {
  form: UseFormReturn<FormValues>;
};

export default function SpecializationForm({ form }: SpecializationFormProps) {
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Name</FormLabel>
              <Input id={field.name} {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Description</FormLabel>
              <Textarea
                id={field.name}
                {...field}
                value={field.value ?? ""}
                className="h-40 max-h-40"
                placeholder="Description"
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
