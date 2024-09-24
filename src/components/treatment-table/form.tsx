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
import type { Material } from "@prisma/client";
import { Pill, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { ServiceUnitSchema } from "prisma/generated/zod";
import { useStateful } from "react-hanger";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { AutoComplete } from "../ui/autocomplete";
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
import { Separator } from "../ui/separator";
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

  const { data: tags } = api.material.listTags.useQuery();

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
                suggestions={tags ?? []}
              />
              <FormDescription>{t("tags.description")}</FormDescription>
              <FormMessage />
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
          <ComponentsSection form={form} />
        </span>
      </form>
    </Form>
  );
}

function ComponentsSection({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) {
  const t = useTranslations("page.treatments.fields.related_materials");
  const { data: materials, isLoading } = api.material.list.useQuery({});

  const materialsLenth = form.watch("materials")?.length ?? 0;

  const removeMaterial = (index: number) => {
    const materials = form.watch("materials");
    if (!materials) return;
    const newMaterials = materials.filter((_, i) => i !== index);
    form.setValue("materials", newMaterials, { shouldDirty: true });
  };

  return (
    <>
      <Separator className="col-span-2" />
      <span className="col-span-2">
        <span className="w-full p-4 grid grid-cols-[auto_1fr] gap-4">
          <Pill className="size-10 p-2 rounded-lg bg-background/80 text-muted-foreground border border-border" />
          <span className="vertical truncate">
            <p className="font-medium">{t("label")}</p>
            <p className="text-muted-foreground text-xs">{t("description")}</p>
          </span>
        </span>
      </span>
      {form.watch("materials")?.map((_, index) => (
        <>
          <span
            key={`${index}.name`}
            className="w-full border border-input rounded-md horizontal center-v gap-2 shadow-sm border-dashed"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hover:text-destructive hover:bg-transparent"
              onClick={() => {
                removeMaterial(index);
              }}
            >
              <Trash className="size-4" />
            </Button>
            <p>
              {
                materials?.content.find(
                  (material) =>
                    material.id === form.watch(`materials.${index}.materialId`),
                )?.name
              }
            </p>
          </span>
          <FormField
            key={`${index}.quantity`}
            name={`materials.${index}.quantity`}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <NumberInput
                  id={`materials.${index}.quantity`}
                  min={1}
                  max={20}
                  defaultValue={1}
                  {...field}
                  className="w-20 text-center"
                />
              </FormItem>
            )}
          />
        </>
      ))}
      <SearchMaterial
        form={form}
        index={materialsLenth}
        isLoading={isLoading}
        options={
          materials?.content.filter(
            (material) =>
              !form
                .watch("materials")
                ?.some((m) => m.materialId === material.id),
          ) ?? []
        }
      />
    </>
  );
}

type SearchMaterialProps = {
  form: UseFormReturn<FormValues>;
  index: number;
  className?: string;
  isLoading: boolean;
  options: Material[];
};

function SearchMaterial({
  form,
  index,
  isLoading,
  options,
}: SearchMaterialProps) {
  const t = useTranslations("page.treatments.fields.related_materials");
  const search = useStateful("");

  return (
    <AutoComplete<Material>
      id="name"
      search={search.value}
      setSearch={(_: string) => {}}
      disabled={isLoading}
      emptyMessage={t("empty")}
      placeholder={t("search")}
      options={
        options.map((material) => ({
          label: material.name,
          value: material,
        })) ?? []
      }
      onValueChange={(option) => {
        form.setValue(`materials.${index}.materialId`, option.value.id, {
          shouldDirty: true,
        });
        form.setValue(
          `materials.${index}.unit_price`,
          option.value.unit_price,
          {
            shouldDirty: true,
          },
        );
        form.setValue(`materials.${index}.quantity`, 1, {
          shouldDirty: true,
        });
      }}
    />
  );
}

function ServicesSection({
  onSetupMultivisit,
  form,
}: { onSetupMultivisit?: () => void; form: UseFormReturn<FormValues> }) {
  const t = useTranslations("page.treatments.fields");
  const listServices = api.service.listSimpleServices.useQuery({});
  const services = form
    .watch("relatedServices")
    ?.map((service) =>
      listServices.data?.find((s) => s.id === service.serviceId),
    )
    .filter((s) => s !== undefined);

  if (!onSetupMultivisit) return null;
  const hasRelatedServices = form.watch("relatedServices")?.length > 0;
  return hasRelatedServices ? (
    <span className="bg-muted col-span-2 w-full p-4 border-l-[2px] border-blue-500 rounded-r-lg grid center-v grid-cols-[1fr_auto]">
      <span className="vertical gap-2 truncate">
        <p className="font-light">
          <span className="text-2xl font-medium">
            {form.watch("relatedServices")?.length}
          </span>{" "}
          {form.watch("relatedServices")?.length > 1
            ? t("related_services.visit.plural")
            : t("related_services.visit.singular")}
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
          {t("related_services.edit")}
        </Button>
        <Button
          variant="link"
          className="text-sm text-destructive"
          type="button"
          onClick={() => {
            form.setValue("relatedServices", [], { shouldDirty: true });
          }}
        >
          {t("related_services.remove")}
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
