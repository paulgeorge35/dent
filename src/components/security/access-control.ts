import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface CheckAccess {
  membersOnly?: boolean;
  adminsOnly?: boolean;
}

export default async function checkAccess({
  membersOnly,
  adminsOnly,
}: CheckAccess) {
  const session = await auth();

  if (session.role === "ADMIN") {
    return;
  }

  if (membersOnly && session.subscription.status !== "ACTIVE") {
    redirect("/home");
  }

  if (adminsOnly) {
    redirect("/home");
  }
}
