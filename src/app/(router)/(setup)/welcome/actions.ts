"use server";

import { auth, setSession } from "@/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

export async function toggleTenant(tenantId: string, redirectTo?: string) {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const user = await db.user.findFirst({
    where: { profileId: session.id, tenantId },
    select: {
      id: true,
      role: true,
      tenantId: true,
    },
  });

  await db.profile.update({
    where: { id: session.id },
    data: {
      preferredTenantId: tenantId,
    },
  });

  if (!user) {
    return;
  }

  await setSession(
    {
      ...session,
      user,
    },
    { days: 30 },
  );

  redirect(redirectTo ?? "/dashboard");
}

export async function logoutTenant() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  await setSession(
    {
      ...session,
      user: undefined,
    },
    { days: 30 },
  );

  redirect("/welcome");
}
