import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import NumberInput from "../ui/number-input";
import OptionalInputTag from "../ui/optional-input-tag";
import PriceInput from "../ui/price-input";
import { Switch } from "../ui/switch";
import { TagInput } from "../ui/tag-input";
import { Textarea } from "../ui/textarea";

export const schema = z.object({
  name: z.string().trim(),
  description: z.string().max(255).trim().optional(),
  unit_price: z.coerce.number().positive(),
  unit: z.string().trim(),
  image: z.string().optional(),
  tags: z.array(z.string().trim()).optional(),
  keepInventory: z.boolean().optional().default(false),
  stock: z.number().optional().default(0),
});

export type FormValues = z.infer<typeof schema>;

type MaterialFormProps = {
  form: UseFormReturn<FormValues>;
};

export default function MaterialForm({ form }: MaterialFormProps) {
  const t = useTranslations("page.materials.fields");

  useEffect(() => {
    if (!form.watch("keepInventory")) {
      form.setValue("stock", 0);
    }
  }, [form.watch("keepInventory")]);

  return (
    <Form {...form}>
      <form className="grid grid-cols-2 gap-4 py-2">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>{t("name.label")}</FormLabel>
              <Input id={field.name} {...field} />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 w-full">
              <FormLabel htmlFor={field.name}>
                {t("description.label")} <OptionalInputTag />
              </FormLabel>
              <Textarea
                id={field.name}
                {...field}
                className="max-h-[100px]"
                charLimit={255}
              />
            </FormItem>
          )}
        />
        <FormField
          name="tags"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel htmlFor={field.name}>
                {t("tags.label")} <OptionalInputTag />
              </FormLabel>
              <TagInput
                id={field.name}
                {...field}
                placeholder={t("tags.placeholder")}
              />
              <FormDescription>{t("tags.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <span className="col-span-2 grid grid-cols-[auto_1fr] gap-4">
          <FormField
            name="unit_price"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor={field.name}>
                  {t("unit_price.label")}
                </FormLabel>
                <PriceInput id={field.name} {...field} />
              </FormItem>
            )}
          />
          <FormField
            name="unit"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>{t("unit.label")}</FormLabel>
                <FormControl>
                  <Input
                    id={field.name}
                    {...field}
                    placeholder={t("unit.placeholder")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </span>
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{t("stock.label")}</FormLabel>
              <NumberInput
                id={field.name}
                {...field}
                disabled={!form.watch("keepInventory")}
                className="w-20"
                min={0}
              />
              <FormMessage />
              <FormDescription>{t("stock.description")}</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          name="keepInventory"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <span className="horizontal center-v gap-2">
                <FormLabel htmlFor={field.name}>
                  {t("keepInventory.label")}
                </FormLabel>
                <Switch
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </span>
              <FormDescription>
                {t("keepInventory.description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
