import { type PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import { cn, initials } from "@/lib/utils";

import { Avatar, AvatarFallback } from "./ui/avatar";

interface AvatarComponentProps {
  src?: string | null;
  alt: string;
  fallback: string;
  placeholder?: PlaceholderValue;
  blurDataURL?: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function AvatarComponent({
  src,
  alt,
  fallback,
  className,
  ...imageProps
}: AvatarComponentProps) {
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
        />
      ) : (
        <AvatarFallback className="text-center">
          {initials(fallback)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
