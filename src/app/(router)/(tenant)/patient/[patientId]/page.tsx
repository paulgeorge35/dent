import BackButton from "@/components/layout/back-button";
import { constructMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Separator } from "@/components/ui/separator";

import { Shell } from "@/components/layout/shell";
import AvatarComponent from "@/components/shared/avatar-component";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "@/lib/translations";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "lucide-react";
import NoteInput from "./_components/NoteInput";
import AppointmentsHistory from "./_components/tabs/AppointmentsHistory";
import FutureTreatments from "./_components/tabs/FutureTreatments";
import MedicalRecords from "./_components/tabs/MedicalRecords";
import PatientInformation from "./_components/tabs/PatientInformation";

export async function generateMetadata({
  params,
}: PatientPageProps): Promise<Metadata> {
  const id = params.patientId;

  const patient = await api.patient.get({ id }).catch((error) => {
    console.error(error);
    notFound();
  });
  return constructMetadata({
    page: `${patient.firstName} ${patient.lastName}`,
  });
}

interface PatientPageProps {
  params: { patientId: string };
}

export default async function Patient({
  params: { patientId },
}: PatientPageProps) {
  const patient = await api.patient.get({ id: patientId }).catch((error) => {
    console.error(error);
    notFound();
  });
  if (!patient) notFound();

  const t = await useTranslations("page.patient");

  return (
    <Shell>
      <section className="vertical gap-2">
        <BackButton />
        <span className="horizontal items-start gap-2">
          <AvatarComponent
            src={""}
            alt={`${patient.firstName} ${patient.lastName}`}
            fallback={`${patient.firstName} ${patient.lastName}`}
            width={96}
            height={96}
            className="size-24"
          />
          <span className="vertical items-start justify-around h-full">
            <h1 className="text-2xl font-bold">
              {patient.firstName} {patient.lastName}
            </h1>
            <NoteInput patientId={patientId} note={patient.note} />
          </span>

          <span className="horizontal items-center gap-2 ml-auto">
            <Button variant='expandIcon' Icon={PlusIcon} iconPlacement="right" className="capitalize">
              {t("header.actions.create-appointment")}
            </Button>
            <Button variant="outline" className="!p-2">
              <DotsVerticalIcon className="size-4" />
            </Button>
          </span>
        </span>
        <Separator className="my-4" />
        <Tabs defaultValue="information">
          <TabsList className="mb-2">
            <TabsTrigger value="information">{t("tabs.information.title")}</TabsTrigger>
            <TabsTrigger value="appointments">{t("tabs.appointments.title")}</TabsTrigger>
            <TabsTrigger value="future-treatments">{t("tabs.future-treatments.title")}</TabsTrigger>
            <TabsTrigger value="records">{t("tabs.records.title")}</TabsTrigger>
          </TabsList>
          <PatientInformation patient={patient} />
          <AppointmentsHistory />
          <FutureTreatments />
          <MedicalRecords />
        </Tabs>
      </section>
    </Shell>
  );
}
