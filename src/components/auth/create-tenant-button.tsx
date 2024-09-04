"use client";

import { Button } from "@/components/ui/button";
import { BadgePlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateTenant() {
  const router = useRouter();
  return (
    <Button
      variant="expandIcon"
      Icon={BadgePlus}
      iconPlacement="right"
      onClick={() => router.push("/create-clinic")}
    >
      Start a new clinic
    </Button>
  );
}
