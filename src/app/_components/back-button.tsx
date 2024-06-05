"use client";

import useMediaQuery from "@/hooks/use-media-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

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
      className="self-start"
      onClick={handleClick}
      size={isDesktop ? "default" : "icon"}
      variant={isDesktop ? "link" : "outline"}
    >
      <ChevronLeft className="w-4 h-4 md:mr-2" />
      <span className="hidden md:block">{title ?? "Back"}</span>
    </Button>
  );
}
