import { type ClassValue, clsx } from "clsx";
import { DateTime } from "luxon";
import type { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PickAndFlatten<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
} & unknown;

export function blocksToContentPreview(content: string | null): string {
  // content is HTML string, return content of first p element

  if (!content) {
    return "";
  }

  const firstParagraph = content.match(/<p>(.*?)<\/p>/)?.[1];

  if (!firstParagraph) {
    return "";
  }

  return firstParagraph;
}

export function isMac() {
  return typeof window !== "undefined" && getOS() === "macos";
}

export function isNotMac() {
  return typeof window !== "undefined" && getOS() !== "macos";
}

export function getOS() {
  const userAgent = window.navigator.userAgent.toLowerCase();

  const macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i;
  const windowsPlatforms = /(win32|win64|windows|wince)/i;
  const iosPlatforms = /(iphone|ipad|ipod)/i;

  if (macosPlatforms.test(userAgent)) {
    return "macos";
  }
  if (iosPlatforms.test(userAgent)) {
    return "ios";
  }
  if (windowsPlatforms.test(userAgent)) {
    return "windows";
  }
  if (/android/.test(userAgent)) {
    return "android";
  }
  if (/linux/.test(userAgent)) {
    return "linux";
  }

  return "unknown";
}

export const logTime = (message?: string) => {
  const now = DateTime.now()
    .toISOTime()
    .replace(/\.\d+Z/, "Z");
  console.log(now, message);
};

export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export const initials = (name: string): string => {
  const [first, last] = name.toUpperCase().split(" ");
  return (first?.charAt(0) ?? "") + (last?.charAt(0) ?? "");
};

export function constructMetadata({
  title = "MyDent",
  page,
  description = "MyDent is a dental practice management software",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
}: {
  title?: string;
  page?: string;
  description?: string;
  image?: string;
  icons?: string;
} = {}): Metadata {
  return {
    title: title + (page ? ` | ${page}` : ""),
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@paulgeorge35",
    },
    icons,
    metadataBase: new URL("https://dent.paulgeorge.dev/"),
  };
}

export const routeTitles = {
  "": "dashboard",
  "/dashboard": "dashboard",
  "/appointments": "appointments",
  "/staff": "staff",
  "/patients": "patients",
  "/patient": "patient",
  "/treatments": "treatments",
  "/settings": "settings",
  "/user": "user",
  "/profile": "profile",
  "/specialities": "specialities",
  "/materials": "materials",
};

export function getPageTitle(path: string) {
  const routeTitlesKeys = Object.keys(routeTitles);
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;

  if (routeTitlesKeys.includes(normalizedPath)) {
    return routeTitles[normalizedPath as keyof typeof routeTitles];
  }

  const segments = normalizedPath.split("/");
  while (segments.length > 1) {
    segments.pop();
    const parentPath = segments.join("/");
    if (routeTitlesKeys.includes(parentPath)) {
      return routeTitles[parentPath as keyof typeof routeTitles];
    }
  }

  return path.split("/").pop();
}

export const zeroPad = (num: number, places = 6) => {
  return String(num).padStart(places, "0");
};

const tailwindColors = [
  "bg-red-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
];
export const generateRandomTailwindColor = (seed?: number): string => {
  if (!seed) {
    return tailwindColors[Math.floor(Math.random() * tailwindColors.length)]!;
  }

  return tailwindColors[seed % tailwindColors.length]!;
};
