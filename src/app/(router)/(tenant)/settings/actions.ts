import { logOut } from "@/auth";
import { redirect } from "next/navigation";

export async function signOut() {
  await logOut();
  redirect("/");
}
