import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible lg:visible absolute top-[16px] -right-[17px] z-20">
      <Button
        onClick={() => setIsOpen?.()}
        className="rounded-full !size-8 p-1"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "size-4 transition-transform ease-in-out duration-300",
            isOpen === false ? "rotate-180" : "rotate-0",
          )}
        />
      </Button>
    </div>
  );
}
