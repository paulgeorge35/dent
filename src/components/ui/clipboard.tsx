"use client";

import { Copy } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

type ClipboardProps = {
  text: string;
  className?: string;
};

export default function Clipboard({ text, className }: ClipboardProps) {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <Button
      onClick={copyToClipboard}
      className={cn("!size-4 shrink-0 !p-0", className)}
      size="icon"
      variant="ghost"
    >
      <Copy className="size-4" />
    </Button>
  );
}
