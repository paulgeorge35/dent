import type { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import { cn, generateRandomTailwindColor, initials } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSpinner } from "../ui/spinner";

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
  randomColor?: boolean;
}

export default function AvatarComponent({
  src,
  alt,
  fallback,
  className,
  width = 20,
  height = 20,
  isLoading,
  randomColor,
  ...imageProps
}: AvatarComponentProps) {
  const backgroundColor = randomColor
    ? generateRandomTailwindColor(fallback.length)
    : "bg-muted";
  if (isLoading) {
    return (
      <Avatar
        className={cn(
          "size-5 items-center justify-center",
          className,
          backgroundColor,
        )}
      >
        <AvatarFallback className={cn("text-center bg-transparent")}>
          <LoadingSpinner className="size-1/2 text-background" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar
      className={cn(
        "size-5 items-center justify-center",
        className,
        backgroundColor,
      )}
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
        <AvatarFallback className={cn("text-center bg-transparent")}>
          {initials(fallback)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
