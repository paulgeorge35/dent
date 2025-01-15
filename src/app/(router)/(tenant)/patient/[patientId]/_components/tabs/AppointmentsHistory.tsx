"use client";

import { TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

export default function AppointmentsHistory() {
    const t = useTranslations("page.patient.tabs.appointments");
    return (
        <TabsContent value="appointments">
            <span className="vertical gap-4">
                <div>{t("title")}</div>
            </span>
        </TabsContent>
    )
}