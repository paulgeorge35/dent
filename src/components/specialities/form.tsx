import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import ColorPicker from "../ui/color-picker";

export const specialitySchema = z.object({
  name: z.string({
    required_error: "global.required",
  }),
  description: z.string().max(250).optional(),
  color: z.string({
    required_error: "global.required",
  }),
});

export type FormValues = z.infer<typeof specialitySchema>;

type SpecialityFormProps = {
  form: UseFormReturn<FormValues>;
};

export default function SpecialityForm({ form }: SpecialityFormProps) {
  const t = useTranslations("page.specialities.fields");

  return (
    <Form {...form}>
      <form className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>{t("name.label")}</FormLabel>
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
              <FormLabel htmlFor={field.name}>
                {t("description.label")}
              </FormLabel>
              <Textarea
                id={field.name}
                {...field}
                value={field.value ?? ""}
                className="h-40 max-h-40"
                placeholder={t("description.placeholder")}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block" htmlFor={field.name}>
                {t("color.label")}
              </FormLabel>
              <ColorPicker
                id={field.name}
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
