import { cn } from "@/lib/utils";
import type { EventStatus } from "@prisma/client";

export default function StatusBullet({ status }: { status: EventStatus }) {
  return (
    <span
      className={cn("h-2 w-2 rounded-full bg-accent", {
        "bg-neutral-600": status === "CREATED",
        "bg-green-600": status === "CONFIRMED",
        "bg-red-600": status === "CANCELLED",
        "bg-blue-600": status === "COMPLETED",
        "bg-orange-600": status === "RESCHEDULED",
      })}
    />
  );
}
