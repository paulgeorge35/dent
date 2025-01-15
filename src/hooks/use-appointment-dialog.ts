import type { AppointmentSchema } from "@/components/calendar/components/calendar";
import type { UseFormReturn } from "react-hook-form";
import { create } from "zustand";

interface useAppointmentDialogStore {
  appointmentId?: string;
  openAppointmentDialog: (value: string) => void;
  clear: () => void;
}

export const useAppointmentDialog = create<useAppointmentDialogStore>(
  (set) => ({
    appointmentId: "",
    openAppointmentDialog: (value) => set({ appointmentId: value }),
    clear: () => set({ appointmentId: undefined }),
  }),
);

interface useCreateAppointmentDialogStore {
  open: boolean;
  setOpen: (value: boolean) => void;
  form: UseFormReturn<AppointmentSchema> | undefined;
  setForm: (value: UseFormReturn<AppointmentSchema>) => void;
}

export const useCreateAppointmentDialog =
  create<useCreateAppointmentDialogStore>((set) => {
    return {
      open: false,
      setOpen: (value) => set({ open: value }),
      form: undefined,
      setForm: (value) => set({ form: value }),
    };
  });
