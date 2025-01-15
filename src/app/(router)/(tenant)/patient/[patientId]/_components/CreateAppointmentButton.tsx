"use client";

import { Button } from "@/components/ui/button";
import { useCreateAppointmentDialog } from "@/hooks/use-appointment-dialog";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const CreateAppointmentButton = ({ patientId }: { patientId: string }) => {
    const { setOpen, form } = useCreateAppointmentDialog();
    const t = useTranslations("page.patient.header.actions");


    const handleCreateAppointment = () => {
        form?.reset();
        form?.setValue("patient", { id: patientId });
        setOpen(true);
    };

    return (
        <Button variant='expandIcon' Icon={PlusIcon} iconPlacement="right" className="capitalize" onClick={handleCreateAppointment}>
            {t("create-appointment")}
        </Button>
    );
};
