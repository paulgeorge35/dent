import { cn } from "@/lib/utils";
import { isNotMac } from "@/lib/utils";

type Shortcut = {
  mac: string;
  windows: string;
};

export const OPTION_KEY = {
  mac: "⌥",
  windows: "Alt",
};

export const COMMAND_KEY = {
  mac: "⌘",
  windows: "Win",
};

export const SHIFT_KEY = {
  mac: "⇧",
  windows: "Shift",
};

export const CONTROL_KEY = {
  mac: "⌃",
  windows: "Ctrl",
};

export const DELETE_KEY = {
  mac: "⌫",
  windows: "Del",
};

export const ShortcutKeys = ({
  shortcut,
  square,
  className,
}: {
  shortcut: string | Shortcut;
  square?: boolean;
  className?: string;
}) => {
  const isMac = !isNotMac();
  if (typeof shortcut === "object") {
    shortcut = !isMac ? shortcut.windows : shortcut.mac;
    square = isMac;
  }

  return (
    <span
      className={cn(
        "hidden h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-xs sm:flex",
        square ? "aspect-square" : "aspect-auto",
        className,
      )}
    >
      {shortcut}
    </span>
  );
};
