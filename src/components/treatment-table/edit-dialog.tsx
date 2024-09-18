"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useMediaQuery from "@/hooks/use-media-query";
import { showErrorToast } from "@/lib/handle-error";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Material, Service, ServiceMaterial } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, ChevronRight, Pill, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type UseStateful, useBoolean, useStateful } from "react-hanger";
import { type UseFormReturn, useForm } from "react-hook-form";
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
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import ServiceForm, {
  type FormValues,
  createRelatedServiceSchema,
  schema,
} from "./form";

type EditServiceDialogProps = {
  dialogOpen: UseStateful<string | null>;
};

export default function EditServiceDialog({
  dialogOpen,
}: EditServiceDialogProps) {
  const t = useTranslations("page.treatments.edit");
  const tClose = useTranslations("page.treatments.close");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const { data: service } = api.service.get.useQuery(dialogOpen.value ?? "", {
    enabled: !!dialogOpen.value,
  });
  const { mutateAsync: createService } = api.service.create.useMutation({
    onSuccess: () => {
      toast.success(t("status.success"));
      dialogOpen.setValue(null);
      router.refresh();
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const secondDialogOpen = useBoolean(false);
  const confirmationDialog = useBoolean(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: service?.name,
      description: service?.description ?? undefined,
      unit_price: service?.unit_price,
      duration: service?.duration,
      unit: service?.unit,
      relatedServices: service?.children.map((service) => ({
        serviceId: (service.service as unknown as Service).id,
        unit_price: service.unit_price,
        quantity: 1,
        order: service.order,
      })),
      materials: service?.materials.map((material) => ({
        materialId: material.material.id,
        quantity: material.quantity,
        unit_price: material.unit_price,
      })),
    },
  });

  const onSubmit = async (values: FormValues) => {
    await createService(values);
  };

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        description: service.description ?? undefined,
        unit_price: service.unit_price,
        duration: service.duration,
        unit: service.unit,
        relatedServices: service.children.map((service) => ({
          serviceId: (service.service as unknown as Service).id,
          unit_price: service.unit_price,
          quantity: service.quantity,
          order: service.order,
        })),
        materials: service.materials.map((material) => ({
          materialId: material.material.id,
          quantity: material.quantity,
          unit_price: material.unit_price,
        })),
      });
    }
  }, [service, form]);

  useEffect(() => {
    if (dialogOpen.value) {
      form.reset();
    }
  }, [dialogOpen.value, form]);

  const Root = isDesktop ? Sheet : Drawer;
  const ContentComponent = isDesktop ? SheetContent : DrawerContent;
  const HeaderComponent = isDesktop ? SheetHeader : DrawerHeader;
  const TitleComponent = isDesktop ? SheetTitle : DrawerTitle;
  const DescriptionComponent = isDesktop ? SheetDescription : DrawerDescription;
  const FooterComponent = isDesktop ? SheetFooter : DrawerFooter;

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open && form.formState.isDirty) {
        confirmationDialog.setTrue();
      } else {
        dialogOpen.setValue(null);
      }
    },
    [form, confirmationDialog, dialogOpen],
  );

  return (
    <Root open={!!dialogOpen.value} onOpenChange={onOpenChange}>
      <ContentComponent
        className={cn({
          "vertical my-8 mr-4  h-[calc(100vh-64px)] !w-[90vw] !max-w-[800px] gap-0 rounded-3xl p-0":
            isDesktop,
          "translate-x-[75%]": secondDialogOpen.value,
        })}
      >
        <HeaderComponent className="p-6">
          <TitleComponent className="flex items-center gap-2">
            {t("dialog.title")}
          </TitleComponent>
          <DescriptionComponent>{t("dialog.description")}</DescriptionComponent>
        </HeaderComponent>
        <ScrollArea className="relative my-4 grow px-6">
          <span className="vertical gap-8 px-1">
            <ServiceForm
              form={form}
              onSetupMultivisit={() => secondDialogOpen.setTrue()}
            />
          </span>
        </ScrollArea>
        <FooterComponent className="grid grid-cols-2 gap-2 p-6">
          <ConfirmationDialog
            open={confirmationDialog.value}
            onOpenChange={confirmationDialog.toggle}
            title={tClose("confirmation.title")}
            description={tClose("confirmation.description")}
            confirmButtonText={tClose("confirmation.confirm")}
            onConfirm={async () => {
              confirmationDialog.setFalse();
              dialogOpen.setValue(null);
            }}
          />
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              if (form.formState.isDirty) {
                confirmationDialog.setTrue();
              } else {
                dialogOpen.setValue(null);
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
        </FooterComponent>
      </ContentComponent>
      <ComplexTreatmentDialog
        open={secondDialogOpen.value}
        onOpenChange={secondDialogOpen.toggle}
        form={form}
      />
    </Root>
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const listServices = api.service.listSimpleServices.useQuery({});

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollAreaRef.current) {
        setScrollTop(scrollAreaRef.current.scrollTop);
      }
    };

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (open) {
      complexServicesForm.reset({
        relatedServices: form.watch("relatedServices"),
      });
    }
  }, [open]);

  const Root = isDesktop ? Sheet : Drawer;
  const ContentComponent = isDesktop ? SheetContent : DrawerContent;
  const HeaderComponent = isDesktop ? SheetHeader : DrawerHeader;
  const TitleComponent = isDesktop ? SheetTitle : DrawerTitle;
  const FooterComponent = isDesktop ? SheetFooter : DrawerFooter;

  const complexServicesForm = useForm<ComplexTreatmentFormValues>({
    resolver: zodResolver(complexServicesSchema),
    defaultValues: {
      relatedServices: form.watch("relatedServices"),
    },
  });

  const handleAdd = useMemo(() => {
    return () => {
      complexServicesForm.setValue("relatedServices", [
        ...complexServicesForm.getValues("relatedServices"),
        {
          unit_price: 0,
          quantity: 1,
          serviceId: "",
          order: complexServicesForm.getValues("relatedServices")?.length,
        },
      ]);
    };
  }, [complexServicesForm]);

  const onSubmit = async (values: ComplexTreatmentFormValues) => {
    complexServicesForm
      .trigger()
      .then(() => {
        if (Object.keys(complexServicesForm.formState.errors)?.length > 0) {
          console.log(form.formState.errors);
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

        form.setValue("relatedServices", values.relatedServices, {
          shouldDirty: true,
          shouldTouch: true,
        });
        form.setValue("unit_price", unit_price, {
          shouldDirty: true,
          shouldTouch: true,
        });
        form.setValue("duration", duration, {
          shouldDirty: true,
          shouldTouch: true,
        });

        console.log("Updated form values:", form.getValues());

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
    <Root open={open} onOpenChange={handleOpenChange}>
      <ContentComponent
        side="left"
        noOverlay
        noCloseButton
        className={cn({
          "vertical p-0 my-8 mr-4 h-[calc(100vh-64px)] !w-[90vw] !max-w-[800px] gap-0 rounded-2xl opacity-0 transition-opacity duration-300 ease-in-out":
            isDesktop,
          "translate-x-[calc(100vw-125%-32px)] opacity-100": open,
        })}
      >
        <HeaderComponent className="p-6">
          <TitleComponent className="horizontal relative h-9 w-full items-center">
            {t("title")}
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-0 top-0 ml-auto rounded-full !p-2"
              onClick={() => onOpenChange(false)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </TitleComponent>
        </HeaderComponent>
        <Separator />
        <span className="p-6 horizontal center-v justify-between">
          <p className="font-medium">Visitation Settings</p>
          <Button type="button" variant="outline" onClick={handleAdd}>
            <Plus className="size-4" />
            Add New Visit
          </Button>
        </span>
        <AnimatePresence mode="wait">
          <ScrollArea
            className="relative grow"
            viewportRef={scrollAreaRef}
            onScroll={handleScroll}
          >
            <div
              className={cn(
                "pointer-events-none absolute left-0 right-0 top-0 z-50 h-16 bg-gradient-to-b from-secondary to-transparent transition-[height] duration-300 ease-in-out",
                {
                  "h-0": scrollTop === 0,
                },
              )}
            />
            {complexServicesForm.watch("relatedServices")?.length === 0 && (
              <span className="py-6 vertical center-h">
                <p className="text-muted-foreground">
                  Add a new visit to get started.
                </p>
              </span>
            )}
            <span className="py-6 vertical gap-8">
              {complexServicesForm
                .watch("relatedServices")
                ?.sort((a, b) => a.order - b.order)
                .map((service) => (
                  <TreatmentVisit
                    key={service.serviceId + service.order}
                    index={service.order}
                    length={
                      complexServicesForm.watch("relatedServices")?.length
                    }
                    form={complexServicesForm}
                  />
                ))}
            </span>
            <div
              className={cn(
                "ease-in-outƒ pointer-events-none absolute bottom-0 left-0 right-0 z-50 h-24 bg-gradient-to-t from-secondary to-transparent transition-[height] duration-300",
                {
                  "h-0":
                    scrollTop + (scrollAreaRef.current?.clientHeight ?? 0) >=
                    (scrollAreaRef.current?.scrollHeight ?? 0),
                },
              )}
            />
          </ScrollArea>
        </AnimatePresence>
        <FooterComponent className="grid grid-cols-2 gap-2 p-6">
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
        </FooterComponent>
      </ContentComponent>
    </Root>
  );
}

type TreatmentVisitProps = {
  index: number;
  length: number;
  form: UseFormReturn<ComplexTreatmentFormValues>;
};

function TreatmentVisit({ index, length, form }: TreatmentVisitProps) {
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
        [...form.getValues("relatedServices").filter((_, i) => i !== index)],
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
          <span className="vertical gap-2">
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
              <CardTitle className="horizontal center-v justify-between">
                Visit #{index + 1}
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  onClick={handleDelete}
                >
                  <X className="size-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 vertical gap-4">
              <Label htmlFor="name">Treatment Name</Label>
              <SearchService
                form={form}
                index={index}
                isLoading={listServices.isLoading}
                options={listServices.data ?? []}
              />
              {serviceQuery.data && (
                <>
                  <Label htmlFor="description">Treatment Description</Label>
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
                          Treatment Price
                        </FormLabel>
                        <PriceInput
                          id={`relatedServices.${index}.unit_price`}
                          {...field}
                        />
                        <FormDescription>
                          Only applies for this treatment. The original price
                          will not be affected.
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
              <span className="pl-1 pr-2 py-1 horizontal center-v">
                {"Day(s)"}
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
      emptyMessage="No services found"
      placeholder="Search for a service..."
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
          components
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
        className="text-link hover:text-link-hover whitespace-nowrap my-auto"
        onClick={extended.toggle}
      >
        {extended.value ? "Hide details" : "See details"}
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
