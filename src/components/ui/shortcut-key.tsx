import { cn, isNotMac } from "@/lib/utils";

export type Shortcut = {
  mac: string;
  windows: string;
};

export const OPTION_KEY = {
  mac: "⌥",
  windows: "Alt",
  value: "alt",
};

export const COMMAND_KEY = {
  mac: "⌘",
  windows: "Win",
  value: "meta",
};

export const SHIFT_KEY = {
  mac: "⇧",
  windows: "Shift",
  value: "shift",
};

export const CONTROL_KEY = {
  mac: "⌃",
  windows: "Ctrl",
  value: "ctrl",
};

export const DELETE_KEY = {
  mac: "⌫",
  windows: "Del",
  value: "delete",
};

export const shortcutCommand = (
  shortcut: (string | Shortcut)[] | string | Shortcut,
) => {
  return Array.isArray(shortcut)
    ? shortcut
        .map((key) =>
          typeof key === "object" && "value" in key ? key.value : key,
        )
        .join("+")
    : typeof shortcut === "object" && "value" in shortcut
      ? shortcut.value
      : shortcut;
};

export const ShortcutKeys = ({
  shortcut,
  className,
}: {
  shortcut: (string | Shortcut)[] | string | Shortcut;
  square?: boolean;
  className?: string;
}) => {
  return (
    <span className={cn("hidden sm:flex items-center gap-1", className)}>
      {Array.isArray(shortcut) ? (
        shortcut.map((key, index) => (
          <KeyComponent key={index} shortcut={key} />
        ))
      ) : (
        <KeyComponent shortcut={shortcut} />
      )}
    </span>
  );
};

const KeyComponent = ({
  shortcut,
  square,
}: { shortcut: string | Shortcut; square?: boolean }) => {
  const isMac = !isNotMac();
  if (typeof shortcut === "string" && shortcut.length === 1) {
    square = true;
  }

  if (typeof shortcut === "object") {
    shortcut = !isMac ? shortcut.windows : shortcut.mac;
    square = isMac;
  }

  return (
    <span
      className={cn(
        "hidden h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-xs sm:flex capitalize",
        square ? "aspect-square" : "aspect-auto",
      )}
    >
      {shortcut}
    </span>
  );
};
