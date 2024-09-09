import type { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import { cn, initials } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMemo } from "react";
import { LoadingSpinner } from "../ui/spinner";

const tailwindColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

function getRandomColor(seed: number) {
  return tailwindColors[seed % tailwindColors.length];
}

interface AvatarComponentProps {
  src?: string | null;
  alt: string;
  fallback: string;
  placeholder?: PlaceholderValue;
  blurDataURL?: string;
  className?: string;
  width?: number;
  height?: number;
  isLoading?: boolean;
  fixedColor?: boolean;
}

export default function AvatarComponent({
  src,
  alt,
  fallback,
  className,
  width = 20,
  height = 20,
  fixedColor,
  isLoading,
  ...imageProps
}: AvatarComponentProps) {
  const randomColor = useMemo(
    () => getRandomColor(fallback.length),
    [fallback],
  );

  if (isLoading) {
    return (
      <Avatar
        className={cn("size-5 items-center justify-center bg-muted", className)}
      >
        <AvatarFallback className={cn("text-center")}>
          <LoadingSpinner className="size-1/2 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar
      className={cn("size-5 items-center justify-center bg-muted", className)}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          style={{ objectFit: "cover" }}
          {...imageProps}
          width={width}
          height={height}
        />
      ) : (
        <AvatarFallback
          className={cn("text-center", !fixedColor ? randomColor : "")}
        >
          {initials(fallback)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
