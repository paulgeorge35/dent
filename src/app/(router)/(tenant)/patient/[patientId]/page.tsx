import BackButton from "@/components/layout/back-button";
import { constructMetadata } from "@/lib/utils";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Separator } from "@/components/ui/separator";

import { Shell } from "@/components/layout/shell";
import AvatarComponent from "@/components/shared/avatar-component";

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

  return (
    <Shell>
      <section className="flex flex-col items-center gap-2">
        <span className="flex w-full justify-between">
          <BackButton />
        </span>
        <AvatarComponent
          src={""}
          alt={`${patient.firstName} ${patient.lastName}`}
          fallback={`${patient.firstName} ${patient.lastName}`}
          width={96}
          height={96}
          className="size-24"
        />
        <span className="flex items-center justify-end gap-2">
          <h1 className="text-2xl font-bold">
            {patient.firstName} {patient.lastName}
          </h1>
        </span>
        <p className="text-center text-sm font-extralight text-muted-foreground">
          {patient.email}
        </p>
        {patient.phone && (
          <p className="text-center text-sm font-extralight text-muted-foreground">
            {patient.phone}
          </p>
        )}
        <Separator className="my-4" />
      </section>
    </Shell>
  );
}
