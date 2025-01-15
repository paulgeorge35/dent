"use client";

import { PatientField } from "@/components/calendar/components/appointment/patient-details";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import type { Patient, PatientData } from "@prisma/client";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";
import { z } from "zod";

interface PatientInformationProps {
    patient: Patient & { data: PatientData[] };
}

const medicalDataSchema = z.object({
    allergies: z.string().nullish(),
    medications: z.string().nullish(),
    conditions: z.string().nullish(),
});
const oralCheckSchema = z.object({
    occlusion: z.string().nullish(),
    parodontosis: z.string().nullish(),
    "tooth-decay": z.string().nullish(),
    "tooth-discoloration": z.string().nullish(),
});
const medicalSchema = z.array(
    z.union([
        z.object({
            id: z.string(),
            data: z.object({
                type: z.literal("medical-data"),
                data: medicalDataSchema,
            }),
            createdAt: z.date(),
            updatedAt: z.date()
        }),
        z.object({
            id: z.string(),
            data: z.object({
                type: z.literal("oral-check"),
                data: oralCheckSchema,
            }),
            createdAt: z.date(),
            updatedAt: z.date()
        })
    ])
);

const getKeysFromType = (type: "medical-data" | "oral-check") => {
    if (type === "medical-data") return Object.keys(medicalDataSchema.shape);
    if (type === "oral-check") return Object.keys(oralCheckSchema.shape);
    return [];
}

export default function PatientInformation({ patient }: PatientInformationProps) {
    const t = useTranslations("page.patient.tabs.information");
    const tGlobal = useTranslations("global");
    const medical = medicalSchema.parse(patient.data);

    const parseNullishValue = (value: string | null | undefined) => {
        if (value === undefined) return "-";
        if (value === null) return tGlobal('no');
        return `${tGlobal('yes')}${value.trim() === "" ? "" : `, ${value.trim()}`}`
    }

    return (
        <TabsContent value="information">
            <span className="vertical gap-4">
                <Section
                    title={t("patient-data.title")}
                    values={[
                        {
                            label: t("patient-data.age.label"),
                            value: patient.dob ? `${DateTime.now()
                                .diff(DateTime.fromJSDate(patient.dob), "years")
                                .years.toFixed(0)} ${t("patient-data.age.years-old")}` : "-"
                        },
                        { label: t("patient-data.gender.label"), value: t(`patient-data.gender.options.${patient.gender}`) },
                        { label: t("patient-data.email.label"), value: patient.email },
                        { label: t("patient-data.phone.label"), value: patient.phone },
                        { label: t("patient-data.county.label"), value: patient.county },
                        { label: t("patient-data.city.label"), value: patient.city },
                    ]}
                />

                {medical.map((item) => (
                    <Section
                        key={item.id}
                        title={t(`${item.data.type}.title`)}
                        values={getKeysFromType(item.data.type).map((key) => ({
                            label: t(`${item.data.type}.${key}.label`),
                            value: parseNullishValue(item.data.data[key as keyof typeof item.data.data])
                        }))}
                        lastUpdate={DateTime.fromJSDate(item.updatedAt).equals(DateTime.fromJSDate(item.createdAt)) ? undefined : DateTime.fromJSDate(item.updatedAt).toFormat("dd MMM yyyy")}
                        action={() => { }}
                    />
                ))}
            </span>
        </TabsContent >
    )
}

interface SectionProps {
    title: string;
    values: {
        label: string;
        value: string | null;
    }[];
    lastUpdate?: string;
    action?: () => void;
}

const Section = ({ title, values, lastUpdate, action }: SectionProps) => {
    const t = useTranslations("global");
    return (
        <>
            <span className="horizontal center-v">
                <h1 className="font-bold text-sm uppercase border-l-[3px] border-blue-500 pl-2">
                    {title}
                    {lastUpdate && (
                        <span className="text-xs text-muted-foreground normal-case font-normal ml-2">
                            {lastUpdate}
                        </span>
                    )}
                </h1>
                {action && (
                    <Button variant="link" onClick={action} className="ml-auto text-link hover:text-link-hover">
                        {t("edit")}
                    </Button>
                )}
            </span>
            <span className="grid grid-cols-3 gap-5">
                {values.map((value) => (
                    <PatientField key={value.label} label={value.label} value={value.value} />
                ))}
            </span>
            <Separator />
        </>
    )
}