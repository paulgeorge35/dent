"use client";

import useMediaQuery from "@/hooks/use-media-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  title?: string;
}

export default function BackButton({ title }: BackButtonProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <Button
      className={cn("self-start", !isDesktop && "h-9 w-9 px-0")}
      onClick={handleClick}
      variant={isDesktop ? "link" : "outline"}
    >
      <ChevronLeft className="h-4 w-4 md:mr-2" />
      <span className="hidden md:block">{title ?? "Back"}</span>
    </Button>
  );
}
