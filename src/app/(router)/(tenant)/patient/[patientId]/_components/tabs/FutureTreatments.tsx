"use client";

import { TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

export default function FutureTreatments() {
    const t = useTranslations("page.patient.tabs.future-treatments");
    return (
        <TabsContent value="future-treatments">
            <span className="vertical gap-4">
                <div>{t("title")}</div>
            </span>
        </TabsContent>
    )
}