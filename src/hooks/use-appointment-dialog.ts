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
}

export const useCreateAppointmentDialog =
  create<useCreateAppointmentDialogStore>((set) => {
    return {
      open: false,
      setOpen: (value) => set({ open: value }),
    };
  });
