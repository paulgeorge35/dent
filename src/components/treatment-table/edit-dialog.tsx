"use client";

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { ServiceComplete } from "@/types/schema";
import type { Material, RelatedService, ServiceMaterial } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Pill } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { type UseStateful, useBoolean, useStateful } from "react-hanger";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

type EditServiceDialogProps = {
  dialogOpen: UseStateful<ServiceComplete | null>;
};

export default function EditServiceDialog({
  dialogOpen,
}: EditServiceDialogProps) {
  const t = useTranslations("page.treatments");
  const tEnums = useTranslations("enums");
  const extendedService = useStateful<number | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data: service } = api.service.get.useQuery(
    dialogOpen.value?.id ?? "",
    {
      enabled: !!dialogOpen.value?.id,
      initialData: dialogOpen.value,
    },
  );

  useEffect(() => {
    if (service) {
      extendedService.setValue(null);
    }
  }, [service]);

  if (!service) return null;

  return (
    <Credenza
      sheet
      open={!!dialogOpen.value}
      onOpenChange={() => dialogOpen.setValue(null)}
    >
      <CredenzaContent
        sheet
        className={cn({
          "!vertical my-8 mr-4 h-[calc(100vh-64px)] !w-[90vw] !max-w-[800px] gap-0 rounded-3xl p-0":
            isDesktop,
        })}
      >
        <CredenzaHeader sheet className="p-6">
          <CredenzaTitle
            sheet
            className="flex gap-2 items-center justify-center sm:justify-start"
          >
            {service?.name}
            {service.children.length > 0 ? (
              <span className="bg-purple-500/20 px-2 py-1 rounded-full text-purple-800 font-medium uppercase text-xs whitespace-nowrap">
                {t("fields.type.options.MULTI_VISIT")}
              </span>
            ) : (
              <span className="bg-teal-500/20 px-2 py-1 rounded-full text-teal-800 font-medium uppercase text-xs whitespace-nowrap">
                {t("fields.type.options.SINGLE_VISIT")}
              </span>
            )}
          </CredenzaTitle>
          <CredenzaDescription sheet>
            {service?.description ? (
              service.description
            ) : (
              <span className="italic">
                {t("fields.description.no-description")}
              </span>
            )}
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <span className="vertical gap-8 px-1">
            <span className="horizontal justify-center sm:justify-start flex-wrap gap-2">
              {service.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-muted border border-muted-foreground px-1 rounded-lg text-muted-foreground text-xs whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </span>
            <Card className="border-border shadow-none bg-muted">
              <CardContent className="grid grid-cols-2 gap-2 py-4">
                <span className="vertical gap-2 col-span-2 sm:col-span-1">
                  <p className="font-medium">{t("fields.unit_price.label")}</p>
                  <span className="horizontal center-v gap-2">
                    <span className="font-light px-1 rounded-full bg-muted border border-muted-foreground/20 text-xs text-muted-foreground">
                      RON
                    </span>
                    <span className="font-medium">
                      {Number(service.unit_price / 100).toFixed(2)}
                    </span>
                    {service.unit !== "VISIT" && (
                      <span className="font-light text-muted-foreground lowercase">
                        {`per ${tEnums(`serviceUnit.${service.unit}`)}`}
                      </span>
                    )}
                  </span>
                </span>
                <Separator className="col-span-2 sm:hidden" />
                <span className="vertical gap-2 col-span-2 sm:col-span-1">
                  <p className="font-medium">{t("fields.duration.label")}</p>
                  <div className="horizontal items-baseline gap-1">
                    <span className="text-muted-foreground">~</span>
                    {(service.duration / 60).toFixed(1)}
                    <span className="text-xs text-muted-foreground">
                      {t("fields.duration.unit")}
                    </span>
                  </div>
                </span>
              </CardContent>
            </Card>
            <span className="vertical gap-4">
              <span className="font-medium text-lg">
                {t("fields.related_services.label")}
              </span>
              {service.children.map((child, index) => (
                <RelatedServiceComponent
                  key={index}
                  data={child}
                  index={index}
                  extendedService={extendedService}
                />
              ))}
            </span>
            <Separator />
            <RelatedMaterials materials={service.materials} />
          </span>
        </CredenzaBody>
        <CredenzaFooter className="grid grid-cols-2 gap-2 p-6">
          <Button
            variant="secondary"
            className="w-full col-span-2"
            onClick={() => dialogOpen.setValue(null)}
          >
            {t("close.trigger")}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}

type RelatedServiceComponentProps = {
  data: RelatedService;
  extendedService: UseStateful<number | null>;
  index: number;
};

const RelatedServiceComponent = ({
  data,
  extendedService,
  index,
}: RelatedServiceComponentProps) => {
  const t = useTranslations("page.treatments");
  const service = data.service as unknown as ServiceComplete;
  return (
    <Card className="border-border shadow-none p-0">
      <CardHeader className="px-4 py-2">
        <CardTitle className="horizontal center-v justify-between">
          <span className="font-medium">
            {data.order + 1}. {service.name}{" "}
            <span className="text-muted-foreground font-normal text-sm">
              {data.quantity > 1 &&
                `(${data.quantity} ${t("fields.related_services.unit")})`}
            </span>
          </span>
          <Button
            variant="link"
            className="!p-0 text-link hover:text-link-hover"
            onClick={() =>
              extendedService.setValue(
                extendedService.value === index ? null : index,
              )
            }
          >
            {extendedService.value === index
              ? t("fields.related_services.hide")
              : t("fields.related_services.show")}
          </Button>
        </CardTitle>
        <CardDescription
          className={cn("", {
            "text-justify truncate w-[300px] sm:w-[500px]":
              extendedService.value !== index,
          })}
        >
          {service.description}
        </CardDescription>
      </CardHeader>
      <AnimatePresence mode="wait">
        {extendedService.value === index && service.materials?.length > 0 && (
          <motion.div
            key="joined-materials"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="col-span-3 overflow-hidden"
          >
            <Separator />
            <CardContent className="px-4 py-2">
              <ul className="mt-2 space-y-2">
                {service.materials.map((material) => (
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
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

function RelatedMaterials({
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
        className="text-link hover:text-link-hover whitespace-nowrap my-auto"
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
