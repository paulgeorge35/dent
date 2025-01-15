"use client";

import { TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

export default function MedicalRecords() {
    const t = useTranslations("page.patient.tabs.records");
    return (
        <TabsContent value="records">
            <span className="vertical gap-4">
                <div>{t("title")}</div>
            </span>
        </TabsContent>
    )
}