import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface CheckAccess {
  adminsOnly?: boolean;
}

export default async function checkAccess({ adminsOnly }: CheckAccess) {
  const session = await auth();

  if (session?.user?.role === "ADMIN") {
    return;
  }

  if (adminsOnly) {
    redirect("/dashboard");
  }
}
