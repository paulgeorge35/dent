"use server";

import { logOut } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  await logOut();
  redirect("/sign-in");
}

export async function toggleTheme(theme: "light" | "dark" | "system") {
  const cookieStore = cookies();
  cookieStore.set("theme", theme);
}
