import AvatarComponent from "@/components/shared/avatar-component";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Patient } from "@prisma/client";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";

export default function PatientDetails({ patient }: { patient?: Patient }) {
  const t = useTranslations("page.appointments.add.steps.basic-information.fields");
  if (!patient) {
    return null;
  }

  return (
    <div className="col-span-4 rounded-md border border-border p-4">
      <span className="horizontal items-center gap-4">
        <AvatarComponent
          alt={`${patient.firstName} ${patient.lastName}`}
          fallback={`${patient.firstName} ${patient.lastName}`}
          src={""}
          className="h-20 w-20"
          width={80}
          height={80}
        />
        <span className="vertical gap-2">
          <span className="text-lg font-bold">
            {patient.firstName} {patient.lastName}
          </span>
          <span className="text-sm text-muted-foreground">{patient.email}</span>
        </span>
      </span>
      <Separator className="mt-4" />
      <span className="grid grid-cols-2 gap-4 p-4">
        <Field label={t("phone.label")} value={patient.phone} />
        <Field
          label={t("gender.label")}
          value={t(`gender.options.${patient.gender}`)}
        />
        <Field
          label={t("dob.label")}
          value={
            patient.dob
              ? DateTime.fromJSDate(patient.dob).toFormat("dd-MM-yyyy")
              : "-"
          }
        />
        <Field
          label={t("age.label")}
          value={
            patient.dob
              ? DateTime.now()
                  .diff(DateTime.fromJSDate(patient.dob), "years")
                  .years.toFixed(0)
              : "-"
          }
        />
        <Field label={t("county.label")} value={patient.county} />
        <Field label={t("city.label")} value={patient.city} />
      </span>
    </div>
  );
}

const Field = ({ label, value }: { label: string; value: string | null }) => {
  return (
    <span className="vertical gap-2 text-sm text-muted-foreground">
      <Label className="font-bold">{label}</Label>
      <span className="font-mono">{value ?? "-"}</span>
    </span>
  );
};
