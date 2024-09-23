import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface useSidebarToggleStore {
  isOpen: boolean;
  setIsOpen: () => void;
}

const isMobile = () => window.innerWidth <= 768; // Adjust the width as needed

export const useSidebarToggle = create(
  persist<useSidebarToggleStore>(
    (set, get) => ({
      isOpen: !isMobile(), // Default to false on mobile
      setIsOpen: () => {
        set({ isOpen: !get().isOpen });
      },
    }),
    {
      name: "sidebarOpen",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
