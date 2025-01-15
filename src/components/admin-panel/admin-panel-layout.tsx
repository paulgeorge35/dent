"use client";

import { Sidebar } from "@/components/admin-panel/sidebar";
import AppointmentDialog from "@/components/calendar/components/appointment-dialog";
import { useAppointmentDialog, useCreateAppointmentDialog } from "@/hooks/use-appointment-dialog";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { cn, getPageTitle } from "@/lib/utils";
import type { SessionUser, TenantAccount } from "@/types/schema";
import { appointmentCreateInput } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import CreateAppointmentDialog from "../calendar/components/create-appointment-dialog";
import { Shell } from "../layout/shell";

type AppointmentSchema = z.infer<typeof appointmentCreateInput>;

export default function AdminPanelLayout({
  children,
  session,
  accounts,
  locale,
}: {
  children: React.ReactNode;
  session: SessionUser;
  accounts: TenantAccount[];
  locale: "en" | "ro";
}) {
  const t = useTranslations("page");
  const pathname = usePathname();
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const { appointmentId, clear } = useAppointmentDialog();
  const { open, setOpen, form, setForm } = useCreateAppointmentDialog();

  const appointmentForm = useForm<AppointmentSchema>({
    resolver: zodResolver(appointmentCreateInput),
    defaultValues: {
      description: "",
      start: DateTime.now().set({ second: 0, millisecond: 0 }).toJSDate(),
      end: undefined,
    },
  });

  if (!form) {
    setForm(appointmentForm);
    return null;
  }

  if (!sidebar) return null;

  return (
    <React.Fragment>
      <AppointmentDialog
        open={!!appointmentId}
        eventId={appointmentId ?? ""}
        onClose={clear}
      />
      <CreateAppointmentDialog
        open={open}
        resourceId={session.user!.id}
        onOpenChange={setOpen}
        form={form}
      />
      <Sidebar
        title={t(`${getPageTitle(pathname ?? "")}.title`)}
        session={session}
        accounts={accounts}
        locale={locale}
      />
      <Shell
        className={cn(
          "h-[calc(100vh-64px)] !w-auto gap-2 bg-background transition-[margin-left] duration-300 ease-in-out p-2 md:p-4 mt-16",
          "h-[calc(100dvh-64px)]",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
        )}
      >
        {children}
      </Shell>
    </React.Fragment>
  );
}
