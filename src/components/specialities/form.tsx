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
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import ColorPicker from "../ui/color-picker";
import OptionalInputTag from "../ui/optional-input-tag";

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
  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

export default function SpecialityForm({
  form,
  onSubmit,
}: SpecialityFormProps) {
  const t = useTranslations("page.specialities.fields");

  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [form]);
  
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 py-2">
        <span className="grid grid-cols-[1fr_auto] gap-4 items-end">
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
            name="color"
            render={({ field }) => (
              <FormItem>
                <ColorPicker
                  id={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </span>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>
                {t("description.label")} <OptionalInputTag />
              </FormLabel>
              <Textarea
                id={field.name}
                {...field}
                value={field.value ?? ""}
                className="max-h-40"
                placeholder={t("description.placeholder")}
                charLimit={250}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
