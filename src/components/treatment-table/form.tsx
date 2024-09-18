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
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { ServiceUnitSchema } from "prisma/generated/zod";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import NumberInput from "../ui/number-input";
import OptionalInputTag from "../ui/optional-input-tag";
import PriceInput from "../ui/price-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TagInput } from "../ui/tag-input";
import { Textarea } from "../ui/textarea";

const createMaterialSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(10).default(1),
  unit_price: z.coerce.number().int().min(0),
  materialId: z.string().min(1),
});

export const createRelatedServiceSchema = z.object({
  order: z.number(),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
  unit_price: z.coerce.number().int().min(0),
  serviceId: z.string().min(1),
});

export const schema = z.object({
  name: z.string(),
  description: z.string().optional(),
  unit_price: z.coerce.number().int().min(0),
  unit: ServiceUnitSchema,
  duration: z.coerce.number().int().min(0),
  image: z.string().optional(),
  tags: z.array(z.string()).default([]),
  categoryId: z.string().optional(),
  materials: z.array(createMaterialSchema).optional().default([]),
  relatedServices: z.array(createRelatedServiceSchema).optional().default([]),
});

export type FormValues = z.infer<typeof schema>;

type ServiceFormProps = {
  form: UseFormReturn<FormValues>;
  onSetupMultivisit?: () => void;
};

export default function ServiceForm({
  form,
  onSetupMultivisit,
}: ServiceFormProps) {
  const t = useTranslations("page.treatments.fields");
  const tEnums = useTranslations("enums.serviceUnit");

  return (
    <Form {...form}>
      <form className="grid grid-cols-2 gap-4">
        <span className="col-span-2 grid grid-cols-[1fr_auto] gap-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor={field.name}>{t("name.label")}</FormLabel>
                <Input id={field.name} {...field} />
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t("unit.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TOOTH">{tEnums("TOOTH")}</SelectItem>
                      <SelectItem value="QUAD">{tEnums("QUAD")}</SelectItem>
                      <SelectItem value="ARCH">{tEnums("ARCH")}</SelectItem>
                      <SelectItem value="VISIT">{tEnums("VISIT")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </span>
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
        <ServicesSection onSetupMultivisit={onSetupMultivisit} form={form} />
        <span className="col-span-2 grid grid-cols-[1fr_auto] gap-4">
          <FormField
            name="unit_price"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor={field.name}>
                  {t("unit_price.label")}
                </FormLabel>
                <PriceInput
                  id={field.name}
                  {...field}
                  disabled={form.watch("relatedServices")?.length > 0}
                  onChange={(value) => {
                    form.setValue("unit_price", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("duration.label")}</FormLabel>
                <NumberInput
                  id={field.name}
                  {...field}
                  step={10}
                  min={0}
                  className="w-20 text-center"
                  disabled={form.watch("relatedServices")?.length > 0}
                />
                <FormDescription>{t("duration.description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </span>
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
      </form>
    </Form>
  );
}

function ServicesSection({
  onSetupMultivisit,
  form,
}: { onSetupMultivisit?: () => void; form: UseFormReturn<FormValues> }) {
  const t = useTranslations("page.treatments.fields");
  const listServices = api.service.listSimpleServices.useQuery({});
  const services = listServices.data?.filter((service) =>
    form
      .watch("relatedServices")
      ?.some((relatedService) => relatedService.serviceId === service.id),
  );
  if (!onSetupMultivisit) return null;
  const hasRelatedServices = form.watch("relatedServices")?.length > 0;
  return hasRelatedServices ? (
    <span className="bg-muted col-span-2 w-full p-4 border-l-[2px] border-blue-500 rounded-r-lg grid center-v grid-cols-[1fr_auto]">
      <span className="vertical gap-2 truncate">
        <p className="font-light">
          <span className="text-2xl font-medium">
            {form.watch("relatedServices")?.length}
          </span>{" "}
          visits
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {services?.map((service) => service.name).join(" → ")}
        </p>
      </span>
      <span className="horizontal gap-2 my-auto">
        <Button
          variant="link"
          className="text-sm text-link hover:text-link-hover"
          type="button"
          onClick={onSetupMultivisit}
        >
          Edit
        </Button>
        <Button
          variant="link"
          className="text-sm text-destructive"
          type="button"
          onClick={() => {
            form.setValue("relatedServices", []);
          }}
        >
          Remove
        </Button>
      </span>
    </span>
  ) : (
    <span className="bg-muted col-span-2 w-full p-4 border-l-[2px] border-blue-500 rounded-r-lg horizontal center-v justify-between">
      <span className="vertical gap-2">
        <p className="text-sm font-semibold capitalize">
          {t("setup-multivisit.label")}
        </p>
        <p className="text-muted-foreground text-xs">
          {t("setup-multivisit.description")}
        </p>
      </span>
      <Button
        variant="link"
        className="text-sm text-blue-500"
        type="button"
        onClick={onSetupMultivisit}
      >
        {t("setup-multivisit.button")}
      </Button>
    </span>
  );
}
