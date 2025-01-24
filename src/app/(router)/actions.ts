"use server";

import { cookies } from "next/headers";

export async function toggleLocale() {
  const locale = (await cookies()).get("NEXT_LOCALE")?.value || "en";

  const newLocale = locale === "en" ? "ro" : "en";

  (await cookies()).set("NEXT_LOCALE", newLocale);
}
