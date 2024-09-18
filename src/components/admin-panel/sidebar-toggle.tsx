import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { ShortcutKeys } from "../ui/shortcut-key";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  useHotkeys("/", () => {
    setIsOpen?.();
  });
  return (
    <div className="invisible lg:visible absolute top-[16px] -left-[16px] z-20">
      <Tooltip>
        <TooltipTrigger>
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
        </TooltipTrigger>
        <TooltipContent side="right">
          <ShortcutKeys shortcut="/" />
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
