export const translations = {
  en: {
    user: {
      role: {
        ADMIN: "Admin",
        USER: "User",
        DOCTOR: "Doctor",
        ASSISTANT: "Assistant",
      },
    },
    event: {
      status: {
        CREATED: "Created",
        CONFIRMED: "Confirmed",
        CANCELLED: "Cancelled",
        COMPLETED: "Completed",
        RESCHEDULED: "Rescheduled",
      },
    },
  },
};

import type { NamespaceKeys, NestedKeyOf } from "next-intl";
import { getTranslations } from "next-intl/server";

type IntlMessages = typeof import("../../messages/en.json");

export async function useTranslations<
  NestedKey extends NamespaceKeys<
    IntlMessages,
    NestedKeyOf<IntlMessages>
  > = never,
>(namespace?: NestedKey) {
  const t = await getTranslations(namespace);
  return t;
}
