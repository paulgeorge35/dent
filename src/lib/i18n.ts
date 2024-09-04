"use server";

import ro from "../../public/locales/ro/translations.json";
import en from "../../public/locales/en/translations.json";

export const t = (key: string, locale: "en" | "ro"): string => {
  let translation: Record<string, unknown>;
  switch (locale) {
    case "en":
      translation = en;
      break;
    case "ro":
      translation = ro;
      break;
    default:
      translation = en;
  }
  const keys = key.split(".");
  let result: Record<string, unknown> | string = translation;
  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k] as string | Record<string, unknown>;
    } else {
    }
  }
  if (result && typeof result === "string") return result;
  return key;
};
