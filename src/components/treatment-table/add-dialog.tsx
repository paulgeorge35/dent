"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/use-media-query";
import { showErrorToast } from "@/lib/handle-error";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Material, Service, ServiceMaterial } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Pill,
  Plus,
  PlusCircle,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";
import { useBoolean, useStateful } from "react-hanger";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ConfirmationDialog from "../shared/confirmation-dialog";
import { AutoComplete } from "../ui/autocomplete";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Label } from "../ui/label";
import NumberInput from "../ui/number-input";
import PriceInput from "../ui/price-input";
import { Separator } from "../ui/separator";
import { CONTROL_KEY } from "../ui/shortcut-key";
import { Skeleton } from "../ui/skeleton";
import { Textarea } from "../ui/textarea";
import ServiceForm, {
  createRelatedServiceSchema,
  type FormValues,
  schema,
} from "./form";

type AddServiceDialogProps = {
  className?: string;
};

export default function AddServiceDialog({ className }: AddServiceDialogProps) {
  const t = useTranslations("page.treatments.add");
  const tClose = useTranslations("page.treatments.close");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const { mutateAsync: createService } = api.service.create.useMutation({
    onSuccess: () => {
      toast.success(t("status.success"));
      dialogOpen.setFalse();
      router.refresh();
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const dialogOpen = useBoolean(false);
  const secondDialogOpen = useBoolean(false);
  const confirmationDialog = useBoolean(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      unit_price: 0,
      duration: 0,
      unit: "TOOTH",
      relatedServices: [],
      materials: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    await createService(values);
  };

  useEffect(() => {
    if (dialogOpen.value) {
      form.reset();
    }
  }, [dialogOpen.value, form]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open && form.formState.isDirty) {
        confirmationDialog.setTrue();
      } else {
        dialogOpen.setValue(open);
      }
    },
    [form, confirmationDialog, dialogOpen],
  );

  return (
    <Drawer open={dialogOpen.value} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        {isDesktop ? (
          <Button
            variant="expandIcon"
            Icon={PlusCircle}
            iconPlacement="right"
            className={className}
            shortcut={[CONTROL_KEY, "t"]}
          >
            {t("trigger")}
          </Button>
        ) : (
          <Button
            className="fixed bottom-8 right-4 rounded-full size-12 shadow-lg"
            size="icon"
          >
            <Plus className="size-6" />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent
        className={cn({
          "p-0": isDesktop,
          "lg:translate-x-[calc(100%-50px)]":
            secondDialogOpen.value && isDesktop,
        })}
      >
        <DrawerHeader className="p-6">
          <DrawerTitle>{t("dialog.title")}</DrawerTitle>
          <DrawerDescription>{t("dialog.description")}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="pb-4">
          <span className="vertical gap-8 px-1">
            <ServiceForm
              form={form}
              onSetupMultivisit={() => secondDialogOpen.setTrue()}
            />
          </span>
        </DrawerBody>
        <DrawerFooter className="grid grid-cols-2 gap-2 p-6">
          <ConfirmationDialog
            open={confirmationDialog.value}
            onOpenChange={confirmationDialog.toggle}
            title={tClose("confirmation.title")}
            description={tClose("confirmation.description")}
            confirmButtonText={tClose("confirmation.confirm")}
            onConfirm={async () => {
              confirmationDialog.setFalse();
              dialogOpen.setFalse();
            }}
          />
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              if (form.formState.isDirty) {
                confirmationDialog.setTrue();
              } else {
                dialogOpen.setFalse();
              }
            }}
          >
            {t("dialog.cancel")}
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
          >
            {t("dialog.confirm")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
      <ComplexTreatmentDialog
        open={secondDialogOpen.value}
        onOpenChange={secondDialogOpen.toggle}
        form={form}
      />
    </Drawer>
  );
}

type ComplexTreatmentFormValues = z.infer<typeof complexServicesSchema>;

const complexServicesSchema = z.object({
  relatedServices: z.array(createRelatedServiceSchema),
});

type ComplexTreatmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<FormValues>;
};

function ComplexTreatmentDialog({
  open,
  onOpenChange,
  form,
}: ComplexTreatmentDialogProps) {
  const t = useTranslations("page.treatments.multiple-visits");
  const tClose = useTranslations("page.treatments.close");
  const confirmationDialog = useBoolean(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const listServices = api.service.listSimpleServices.useQuery({});

  const complexServicesForm = useForm<ComplexTreatmentFormValues>({
    resolver: zodResolver(complexServicesSchema),
    defaultValues: {
      relatedServices: form.watch("relatedServices"),
    },
  });

  useEffect(() => {
    complexServicesForm.setValue(
      "relatedServices",
      form.watch("relatedServices"),
    );
  }, [form.watch("relatedServices"), open]);

  const handleAdd = useMemo(() => {
    return () => {
      complexServicesForm.setValue("relatedServices", [
        ...complexServicesForm.getValues("relatedServices"),
        {
          unit_price: 0,
          quantity: 1,
          serviceId: "",
          order: complexServicesForm.getValues("relatedServices").length,
        },
      ]);
    };
  }, [complexServicesForm]);

  const onSubmit = async (values: ComplexTreatmentFormValues) => {
    complexServicesForm
      .trigger()
      .then(() => {
        if (Object.keys(complexServicesForm.formState.errors).length > 0) {
          return;
        }

        const unit_price = values.relatedServices
          .map((service) => service.unit_price)
          .reduce((acc, curr) => acc + curr, 0);

        const duration =
          listServices.data
            ?.filter((service) =>
              values.relatedServices.some(
                (relatedService) => relatedService.serviceId === service.id,
              ),
            )
            .reduce((acc, curr) => acc + curr.duration, 0) ?? 0;

        form.reset(
          {
            ...form.getValues(),
            relatedServices: values.relatedServices,
            unit_price: unit_price,
            duration: duration,
          },
          { keepDefaultValues: true, keepDirty: true },
        );

        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open && complexServicesForm.formState.isDirty) {
        confirmationDialog.setTrue();
      } else {
        onOpenChange(open);
      }
    },
    [complexServicesForm, confirmationDialog, onOpenChange],
  );

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      direction={isDesktop ? "left" : undefined}
    >
      <DrawerContent
        noOverlay={isDesktop}
        className={cn({
          "opacity-0 transition-opacity duration-300 ease-in-out": isDesktop,
          "max-h-[90dvh]": !isDesktop,
          "opacity-100": open,
          "right-20": open && isDesktop,
        })}
      >
        <DrawerHeader className="p-6">
          <DrawerTitle className="horizontal relative h-9 w-full items-center">
            {t("title")}
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-0 top-0 ml-auto rounded-full !p-2"
              onClick={() => handleOpenChange(false)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </DrawerTitle>
        </DrawerHeader>
        <Separator />
        <span className="p-6 horizontal center-v justify-between">
          <p className="font-medium">{t("add-visit.title")}</p>
          <Button type="button" variant="outline" onClick={handleAdd}>
            <Plus className="size-4" />
            {t("add-visit.trigger")}
          </Button>
        </span>
        <DrawerBody>
          {complexServicesForm.watch("relatedServices").length === 0 && (
            <span className="py-6 vertical center-h">
              <p className="text-muted-foreground">
                {t("add-visit.placeholder")}
              </p>
            </span>
          )}
          <span className="py-6 vertical gap-8">
            {complexServicesForm
              .watch("relatedServices")
              .sort((a, b) => a.order - b.order)
              .map((service) => (
                <TreatmentVisit
                  key={service.serviceId + service.order}
                  index={service.order}
                  length={complexServicesForm.watch("relatedServices").length}
                  form={complexServicesForm}
                />
              ))}
          </span>
        </DrawerBody>
        <DrawerFooter className="grid grid-cols-2 gap-2 p-6">
          <ConfirmationDialog
            open={confirmationDialog.value}
            onOpenChange={confirmationDialog.toggle}
            title={tClose("confirmation.title")}
            description={tClose("confirmation.description")}
            confirmButtonText={tClose("confirmation.confirm")}
            onConfirm={async () => {
              confirmationDialog.setFalse();
              onOpenChange(false);
              complexServicesForm.reset({
                relatedServices: form.watch("relatedServices"),
              });
            }}
          />
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => handleOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={complexServicesForm.handleSubmit(onSubmit)}
            disabled={
              !complexServicesForm.formState.isDirty ||
              complexServicesForm.formState.isSubmitting
            }
            isLoading={complexServicesForm.formState.isSubmitting}
          >
            {t("confirm")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type TreatmentVisitProps = {
  index: number;
  length: number;
  form: UseFormReturn<ComplexTreatmentFormValues>;
};

function TreatmentVisit({ index, length, form }: TreatmentVisitProps) {
  const t = useTranslations("page.treatments");
  const listServices = api.service.listSimpleServices.useQuery({});
  const serviceQuery = api.service.get.useQuery(
    form.watch(`relatedServices.${index}.serviceId`),
    {
      enabled:
        !!form.watch(`relatedServices.${index}.serviceId`) &&
        form.watch(`relatedServices.${index}.serviceId`) !== "",
    },
  );

  const handleMoveUp = useMemo(() => {
    return () => {
      if (index === 0) return;
      form.setValue(`relatedServices.${index}.order`, index - 1, {
        shouldDirty: true,
      });
      form.setValue(`relatedServices.${index - 1}.order`, index, {
        shouldDirty: true,
      });
    };
  }, [form, index]);

  const handleMoveDown = useMemo(() => {
    return () => {
      if (index === length - 1) return;
      form.setValue(`relatedServices.${index}.order`, index + 1, {
        shouldDirty: true,
      });
      form.setValue(`relatedServices.${index + 1}.order`, index, {
        shouldDirty: true,
      });
    };
  }, [form, index, length]);

  const handleDelete = useMemo(() => {
    return () => {
      form.setValue(
        "relatedServices",
        [
          ...form.getValues("relatedServices").filter((_, i) => i < index),
          ...form
            .getValues("relatedServices")
            .filter((_, i) => i > index)
            .map((service, i) => ({
              ...service,
              order: service.order - 1,
            })),
        ],
        {
          shouldDirty: true,
          shouldTouch: true,
        },
      );
    };
  }, [form, index]);

  return (
    <Form {...form}>
      <form className="vertical gap-8">
        <span className="horizontal gap-2 px-6">
          <span className="vertical gap-2 hidden sm:flex">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="rounded-full"
              disabled={index === 0}
              onClick={handleMoveUp}
            >
              <ArrowUp className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="rounded-full"
              disabled={index === length - 1}
              onClick={handleMoveDown}
            >
              <ArrowDown className="size-4" />
            </Button>
          </span>
          <Card className="w-full">
            <CardHeader className="py-4 bg-muted border-b border-input rounded-t-xl">
              <CardTitle className="horizontal gap-2 center-v">
                <span className="horizontal gap-2 sm:hidden">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                    disabled={index === 0}
                    onClick={handleMoveUp}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                    disabled={index === length - 1}
                    onClick={handleMoveDown}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                </span>
                {t("multiple-visits.add-visit.visit", { index: index + 1 })}
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="rounded-full ml-auto"
                  onClick={handleDelete}
                >
                  <X className="size-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 vertical gap-4">
              <Label htmlFor="name">{t("fields.name.label")}</Label>
              <SearchService
                form={form}
                index={index}
                isLoading={listServices.isLoading}
                options={listServices.data ?? []}
              />
              {serviceQuery.isLoading && (
                <React.Fragment>
                  <Label>Treatment Description</Label>
                  <Skeleton className="h-14 w-full" />
                  <Label>Treatment Price</Label>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-full" />
                </React.Fragment>
              )}
              {serviceQuery.data && (
                <>
                  <Label htmlFor="description">
                    {t("fields.description.label")}
                  </Label>
                  <Textarea
                    id="description"
                    value={serviceQuery.data?.description ?? ""}
                    className="max-h-24"
                    disabled
                  />
                  <FormField
                    name={`relatedServices.${index}.unit_price`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={`relatedServices.${index}.unit_price`}
                        >
                          {t("fields.unit_price.label")}
                        </FormLabel>
                        <PriceInput
                          id={`relatedServices.${index}.unit_price`}
                          {...field}
                        />
                        <FormDescription>
                          {t("fields.unit_price.description")}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <ServiceComponents materials={serviceQuery.data.materials} />
                </>
              )}
            </CardContent>
          </Card>
        </span>
        <span className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="grid grid-cols-2 center-v rounded-full bg-background border border-input text-sm">
              <span className="bg-muted rounded-l-full border-r border-input w-12">
                <FormField
                  name={`relatedServices.${index}.quantity`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <NumberInput
                        id={`relatedServices.${index}.quantity`}
                        min={1}
                        max={20}
                        defaultValue={1}
                        {...field}
                        className="p-0 text-center bg-transparent text-sm rounded-r-none rounded-l-full border-none focus:outline-none"
                        actions={false}
                      />
                    </FormItem>
                  )}
                />
              </span>
              <span className="pl-2 pr-2 py-1 horizontal center-v capitalize">
                {t("fields.related_services.unit")}
              </span>
            </span>
          </span>
        </span>
      </form>
    </Form>
  );
}

type SearchServiceProps = {
  form: UseFormReturn<ComplexTreatmentFormValues>;
  index: number;
  className?: string;
  isLoading: boolean;
  options: Service[];
};

function SearchService({
  form,
  index,
  isLoading,
  options,
}: SearchServiceProps) {
  const t = useTranslations("page.treatments.fields.related_services");
  const search = useStateful("");
  useEffect(() => {
    if (form.watch(`relatedServices.${index}.serviceId`) !== "") {
      const service = options.find(
        (service) =>
          service.id === form.watch(`relatedServices.${index}.serviceId`),
      );
      if (service) {
        search.setValue(service.name);
      }
    }
  }, [form.watch(`relatedServices.${index}.serviceId`)]);

  return (
    <AutoComplete<Service>
      id="name"
      search={search.value}
      setSearch={search.setValue}
      disabled={isLoading}
      emptyMessage={t("empty")}
      placeholder={t("search")}
      options={
        options.map((service) => ({
          label: service.name,
          value: service,
        })) ?? []
      }
      onValueChange={(option) => {
        form.setValue(`relatedServices.${index}.serviceId`, option.value.id, {
          shouldDirty: true,
        });
        form.setValue(
          `relatedServices.${index}.unit_price`,
          option.value.unit_price,
          {
            shouldDirty: true,
          },
        );
      }}
    />
  );
}

function ServiceComponents({
  materials,
}: {
  materials: (ServiceMaterial & {
    material: Material;
  })[];
}) {
  const t = useTranslations("page.treatments.fields.related_materials");
  const extended = useBoolean(false);

  if (materials.length === 0) {
    return null;
  }

  return (
    <span className="bg-muted rounded-lg w-full p-4 grid grid-cols-[auto_1fr_auto] gap-4">
      <Pill className="size-10 p-2 rounded-lg bg-background/80 text-muted-foreground border border-border" />
      <span className="vertical truncate">
        <p className="font-light">
          <span className="text-2xl font-medium">{materials.length}</span>{" "}
          {t("unit")}
        </p>
        <AnimatePresence mode="wait">
          {!extended.value && (
            <motion.p
              key="joined-materials"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="truncate text-xs text-muted-foreground"
            >
              {materials
                .flatMap((material) => material.material.name)
                .join(", ")}
            </motion.p>
          )}
        </AnimatePresence>
      </span>
      <Button
        type="button"
        variant="link"
        className="text-link hover:text-link-hover whitespace-nowrap my-auto !p-0"
        onClick={extended.toggle}
      >
        {extended.value ? t("hide-details") : t("see-details")}
      </Button>
      <AnimatePresence>
        {extended.value && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="col-span-3 overflow-hidden"
          >
            <Separator />
            <ul className="mt-2 space-y-2">
              {materials.map((material) => (
                <li key={material.materialId} className="flex items-center">
                  <span className="flex-shrink-0 text-sm">
                    {material.material.name}
                  </span>
                  <span className="flex-grow mx-2 border-b border-dashed border-muted-foreground/50" />
                  <span className="flex-shrink-0 text-sm text-muted-foreground">
                    {material.quantity} {material.material.unit}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
